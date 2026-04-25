import { useState } from 'react';
import { MainLayout } from '../../components/layout/MainLayout';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { 
  Sparkles, 
  Send, 
  TrendingUp, 
  Users
} from 'lucide-react';

const AIAssistantScreen = () => {
  const [message, setMessage] = useState('');

  const insights = [
    { title: 'Peak Hours', desc: 'Saturday afternoons are 40% busier than average.', icon: ClockIcon, color: 'blue' },
    { title: 'Popular Service', desc: 'Fade cuts brought in 60% of revenue this week.', icon: TrendingUp, color: 'primary' },
    { title: 'Staff Performance', desc: 'David has the highest customer return rate (85%).', icon: Users, color: 'gold' },
  ];

  return (
    <MainLayout>
      <div className="space-y-6 flex flex-col h-[calc(100vh-140px)]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white">
            <Sparkles size={18} fill="white" />
          </div>
          <h2 className="text-2xl">BizFlow AI</h2>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto space-y-6 pr-1">
          {/* AI Intro */}
          <section className="bg-primary-dark text-white p-6 rounded-card relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-lg font-bold mb-2">Hello, I'm your assistant!</h3>
              <p className="text-sm text-white/80 leading-relaxed">
                I analyze your business data to help you make better decisions. Ask me about your revenue, staff, or customer trends.
              </p>
            </div>
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
          </section>

          {/* Quick Insights */}
          <section>
            <h3 className="text-xs uppercase tracking-wider text-neutral-textLight font-bold mb-3">Weekly Insights</h3>
            <div className="grid grid-cols-1 gap-3">
              {insights.map((item, i) => (
                <Card key={i} className="flex gap-4 p-4 border-none bg-white shadow-subtle hover:shadow-medium transition-standard">
                  <div className={`w-10 h-10 rounded-card flex items-center justify-center bg-${item.color}-light text-${item.color} shrink-0`}>
                    <item.icon size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold">{item.title}</h4>
                    <p className="text-xs text-neutral-textMid mt-1">{item.desc}</p>
                  </div>
                </Card>
              ))}
            </div>
          </section>

          {/* Suggestions */}
          <section>
            <h3 className="text-xs uppercase tracking-wider text-neutral-textLight font-bold mb-3">Try asking</h3>
            <div className="flex flex-wrap gap-2">
              {[
                "What's my expected revenue for tomorrow?",
                "Who is my most productive staff member?",
                "Suggest a promotion for slow days",
                "Show me customer retention trends"
              ].map((text, i) => (
                <button 
                  key={i} 
                  className="text-xs font-medium text-primary bg-primary-light px-4 py-2 rounded-badge border border-primary/10 hover:bg-primary/20 transition-standard text-left"
                >
                  {text}
                </button>
              ))}
            </div>
          </section>
        </div>

        {/* Chat Input */}
        <div className="pt-2">
          <Card className="p-2 flex gap-2 items-center bg-white shadow-large border-primary/10">
            <div className="flex-1">
              <input 
                type="text" 
                placeholder="Ask BizFlow AI..." 
                className="w-full bg-transparent border-none focus:ring-0 px-3 py-2 text-sm"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
            <Button className="h-10 w-10 p-0 rounded-full shrink-0" disabled={!message}>
              <Send size={18} />
            </Button>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

const ClockIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
  </svg>
);

export default AIAssistantScreen;
