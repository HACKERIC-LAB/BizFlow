import { useState, useEffect } from 'react';
import { MainLayout } from '../../components/layout/MainLayout';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { 
  Sparkles, 
  Send, 
  TrendingUp, 
  Users
} from 'lucide-react';
import { aiApi } from '../../services/aiApi';
import toast from 'react-hot-toast';

const AIAssistantScreen = () => {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'ai', text: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [insights, setInsights] = useState<any[]>([]);

  useEffect(() => {
    aiApi.getRevenueInsights().then(res => {
      setInsights([
        { title: 'Revenue Trend', desc: res.data.message, icon: TrendingUp, color: 'primary' },
      ]);
    });
  }, []);

  const handleSend = async () => {
    if (!message.trim()) return;
    
    const userMsg = message;
    setMessage('');
    setChatHistory(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      const response = await aiApi.chat(userMsg);
      setChatHistory(prev => [...prev, { role: 'ai', text: response.data.reply }]);
    } catch (error) {
      toast.error('Failed to get AI response');
    } finally {
      setIsLoading(false);
    }
  };

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
          {/* Chat History */}
          <div className="space-y-4">
            {chatHistory.length === 0 && (
              <section className="bg-primary-dark text-white p-6 rounded-card relative overflow-hidden">
                <div className="relative z-10">
                  <h3 className="text-lg font-bold mb-2">Hello, I'm your assistant!</h3>
                  <p className="text-sm text-white/80 leading-relaxed">
                    I analyze your business data to help you make better decisions. Ask me about your revenue, staff, or customer trends.
                  </p>
                </div>
                <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
              </section>
            )}

            {chatHistory.map((chat, i) => (
              <div key={i} className={`flex ${chat.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-4 rounded-card text-sm ${
                  chat.role === 'user' ? 'bg-primary text-white' : 'bg-white border border-neutral-border text-neutral-darkNavy shadow-subtle'
                }`}>
                  {chat.text}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-neutral-border p-4 rounded-card">
                   <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" />
                      <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce delay-75" />
                      <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce delay-150" />
                   </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Insights */}
          {insights.length > 0 && chatHistory.length === 0 && (
            <section>
              <h3 className="text-xs uppercase tracking-wider text-neutral-textLight font-bold mb-3">Today's Insight</h3>
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
          )}

          {/* Suggestions */}
          {chatHistory.length === 0 && (
            <section>
              <h3 className="text-xs uppercase tracking-wider text-neutral-textLight font-bold mb-3">Try asking</h3>
              <div className="flex flex-wrap gap-2">
                {[
                  "What's my expected revenue for tomorrow?",
                  "Who is my most productive staff member?",
                  "Suggest a promotion for slow days"
                ].map((text, i) => (
                  <button 
                    key={i} 
                    onClick={() => setMessage(text)}
                    className="text-xs font-medium text-primary bg-primary-light px-4 py-2 rounded-badge border border-primary/10 hover:bg-primary/20 transition-standard text-left"
                  >
                    {text}
                  </button>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Chat Input */}
        <div className="pt-2">
          <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-2 items-center">
            <Card className="flex-1 p-1 flex gap-2 items-center bg-white shadow-large border-primary/10">
              <input 
                type="text" 
                placeholder="Ask BizFlow AI..." 
                className="w-full bg-transparent border-none focus:ring-0 px-3 py-2 text-sm"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <Button type="submit" className="h-10 w-10 p-0 rounded-full shrink-0" disabled={!message || isLoading}>
                <Send size={18} />
              </Button>
            </Card>
          </form>
        </div>
      </div>
    </MainLayout>
  );
};

export default AIAssistantScreen;
