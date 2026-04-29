import { prisma } from '../utils/prisma';
import { chatCompletion } from '../utils/openAIClient';
import { AppError } from '../middlewares/errorHandler';

const SYSTEM_PROMPT = `You are BizFlow AI, a bilingual business assistant for small businesses in Kenya. 
You respond in both English and Kiswahili. You help with customer replies, business insights, 
and revenue optimization. Be concise, professional, and culturally aware.`;

export async function suggestReply(
  businessId: string,
  customerMessage: string
): Promise<{ english: string; kiswahili: string }> {
  const prompt = `Customer message: "${customerMessage}"
  
Please provide a professional reply to this customer message in TWO formats:
1. English version
2. Kiswahili version

Format your response as:
ENGLISH: [reply in English]
KISWAHILI: [reply in Kiswahili]`;

  const response = await chatCompletion(SYSTEM_PROMPT, prompt);

  // Parse response
  const englishMatch = response.match(/ENGLISH:\s*(.+?)(?=KISWAHILI:|$)/s);
  const kiswahiliMatch = response.match(/KISWAHILI:\s*(.+?)$/s);

  const result = {
    english: englishMatch?.[1]?.trim() || response,
    kiswahili: kiswahiliMatch?.[1]?.trim() || response,
  };

  await prisma.aIInteraction.create({
    data: { businessId, prompt: customerMessage, response: JSON.stringify(result) },
  });

  return result;
}

async function getBusinessContext(businessId: string) {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const [monthTransactions, todayTransactions, customers, staff, appointments] = await Promise.all([
    prisma.transaction.findMany({
      where: { businessId, status: 'COMPLETED', createdAt: { gte: startOfMonth } },
    }),
    prisma.transaction.findMany({
      where: { businessId, status: 'COMPLETED', createdAt: { gte: startOfToday } },
    }),
    prisma.customer.count({ where: { businessId } }),
    prisma.user.findMany({ where: { businessId, role: { not: 'OWNER' } }, select: { name: true, role: true } }),
    prisma.appointment.findMany({
      where: { businessId, scheduledAt: { gte: startOfToday }, status: 'SCHEDULED' },
      include: { staff: { select: { name: true } } }
    })
  ]);

  const monthRevenue = monthTransactions.reduce((s, t) => s + t.totalAmount, 0);
  const todayRevenue = todayTransactions.reduce((s, t) => s + t.totalAmount, 0);

  return `
BUSINESS CONTEXT FOR AI:
- Current Month Revenue: KSh ${monthRevenue.toLocaleString()}
- Total Transactions this month: ${monthTransactions.length}
- Today's Revenue: KSh ${todayRevenue.toLocaleString()}
- Total Registered Customers: ${customers}
- Staff Members: ${staff.map(s => `${s.name} (${s.role})`).join(', ')}
- Today's Upcoming Appointments: ${appointments.length}
- Current Date: ${now.toDateString()}
  `.trim();
}

export async function chat(businessId: string, userMessage: string): Promise<string> {
  const context = await getBusinessContext(businessId);
  
  const prompt = `
${context}

User Question: "${userMessage}"

You are BizFlow AI, the business brain for this company. 
1. Use the data provided above to answer precisely.
2. If the user asks for calculations (e.g. revenue per staff), perform them.
3. If they ask about trends, compare today's data to the month.
4. Use Markdown formatting (bold, tables, lists) to make data easy to read.
5. Be bilingual (English & Kiswahili) as per your system prompt.
`.trim();

  const response = await chatCompletion(SYSTEM_PROMPT, prompt);

  await prisma.aIInteraction.create({
    data: { businessId, prompt: userMessage, response },
  });

  return response;
}

export async function getWeeklySummary(businessId: string): Promise<string> {
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  const [transactions, customers, appointments] = await Promise.all([
    prisma.transaction.findMany({
      where: { businessId, status: 'COMPLETED', createdAt: { gte: weekAgo } },
      include: { services: { include: { service: true } } },
    }),
    prisma.customer.count({ where: { businessId, createdAt: { gte: weekAgo } } }),
    prisma.appointment.count({
      where: { businessId, scheduledAt: { gte: weekAgo }, status: 'COMPLETED' },
    }),
  ]);

  const totalRevenue = transactions.reduce((s, t) => s + t.totalAmount, 0);
  const serviceBreakdown = new Map<string, number>();
  for (const t of transactions) {
    for (const ts of t.services) {
      serviceBreakdown.set(ts.service.name, (serviceBreakdown.get(ts.service.name) || 0) + ts.price);
    }
  }

  const summaryData = {
    totalRevenue,
    transactionCount: transactions.length,
    newCustomers: customers,
    completedAppointments: appointments,
    topServices: Array.from(serviceBreakdown.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3),
  };

  const prompt = `Here is this week's business data for a Kenyan small business:
- Total Revenue: KSh ${totalRevenue.toLocaleString()}
- Transactions: ${summaryData.transactionCount}
- New Customers: ${summaryData.newCustomers}
- Completed Appointments: ${summaryData.completedAppointments}
- Top Services: ${summaryData.topServices.map(([name, rev]) => `${name} (KSh ${rev})`).join(', ')}

Write a brief, encouraging weekly summary for the business owner in both English and Kiswahili. 
Include 2-3 actionable tips to improve next week.`;

  const summary = await chatCompletion(SYSTEM_PROMPT, prompt);

  await prisma.aIInteraction.create({
    data: {
      businessId,
      prompt: 'weekly_summary',
      response: summary,
    },
  });

  return summary;
}

export async function getRevenueInsights(businessId: string) {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const transactions = await prisma.transaction.findMany({
    where: { businessId, status: 'COMPLETED', createdAt: { gte: thirtyDaysAgo } },
    include: { services: { include: { service: true } } },
  });

  // Daily revenue
  const dailyRevenue = new Map<string, number>();
  for (const t of transactions) {
    const day = t.createdAt.toISOString().split('T')[0];
    dailyRevenue.set(day, (dailyRevenue.get(day) || 0) + t.totalAmount);
  }

  // Service performance
  const serviceMap = new Map<string, { name: string; revenue: number; count: number }>();
  for (const t of transactions) {
    for (const ts of t.services) {
      const existing = serviceMap.get(ts.serviceId) || { name: ts.service.name, revenue: 0, count: 0 };
      serviceMap.set(ts.serviceId, {
        name: ts.service.name,
        revenue: existing.revenue + ts.price,
        count: existing.count + 1,
      });
    }
  }

  const totalRevenue = transactions.reduce((s, t) => s + t.totalAmount, 0);
  const avgPerDay = totalRevenue / 30;

  const prompt = `Business performance for last 30 days:
- Total Revenue: KSh ${totalRevenue.toLocaleString()}
- Average Daily Revenue: KSh ${avgPerDay.toFixed(0)}
- Top Services: ${Array.from(serviceMap.values()).sort((a,b) => b.revenue - a.revenue).slice(0,3).map(s => `${s.name}: KSh ${s.revenue}`).join(', ')}

Provide 3 specific, actionable revenue insights with estimated KES impact. Be concise.`;

  const insights = await chatCompletion(SYSTEM_PROMPT, prompt);

  return {
    totalRevenue,
    avgDailyRevenue: Math.round(avgPerDay),
    topServices: Array.from(serviceMap.values()).sort((a, b) => b.revenue - a.revenue),
    dailyTrend: Array.from(dailyRevenue.entries()).sort((a, b) => a[0].localeCompare(b[0])),
    aiInsights: insights,
  };
}

export async function recordFeedback(
  businessId: string,
  interactionId: string,
  feedback: number
) {
  const interaction = await prisma.aIInteraction.findFirst({
    where: { id: interactionId, businessId },
  });
  if (!interaction) throw new AppError('Interaction not found', 404);
  return prisma.aIInteraction.update({ where: { id: interactionId }, data: { feedback } });
}
