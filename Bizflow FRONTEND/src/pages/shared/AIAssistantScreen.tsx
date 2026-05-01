import { useState, useEffect, useRef } from 'react';
import { MainLayout } from '../../components/layout/MainLayout';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Sparkles, Send, TrendingUp } from 'lucide-react';
import { aiApi } from '../../services/aiApi';
import toast from 'react-hot-toast';

const AIAssistantScreen = () => {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'ai', text: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [insights, setInsights] = useState<any[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    aiApi.getRevenueInsights().then(res => {
      setInsights([
        { title: 'Revenue Trend', desc: res.data?.message || 'Based on your recent transactions.', icon: TrendingUp },
      ]);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const handleSend = async () => {
    if (!message.trim()) return;
    const userMsg = message;
    setMessage('');
    setChatHistory(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);
    try {
      const response = await aiApi.chat(userMsg);
      setChatHistory(prev => [...prev, { role: 'ai', text: response.data.reply }]);
    } catch {
      toast.error('Failed to get AI response');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout>
      {/* Full height flex column — input always visible at bottom */}
      <div className="flex flex-col" style={{ height: 'calc(100dvh - 180px)' }}>

        {/* Header */}
        <div className="flex items-center gap-2 mb-4 shrink-0">
          <div className="w-8 h-8 bg-coffee-700 rounded-full flex items-center justify-center text-white">
            <Sparkles size={18} fill="white" />
          </div>
          <h2 className="text-2xl font-bold">BizFlow AI</h2>
        </div>

        {/* Scrollable chat area */}
        <div className="flex-1 overflow-y-auto no-scrollbar space-y-4 pr-1">
          {chatHistory.length === 0 && (
            <>
              <section className="bg-coffee-700 text-white p-5 rounded-3xl relative overflow-hidden shadow-medium">
                <div className="relative z-10">
                  <h3 className="text-base font-bold mb-1">Hello, I'm your assistant!</h3>
                  <p className="text-sm text-white/80 leading-relaxed">
                    Ask me about your revenue, staff, or customer trends.
                  </p>
                </div>
                <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
              </section>

              {insights.length > 0 && (
                <section>
                  <h3 className="text-[10px] uppercase tracking-wider text-coffee-500 font-bold mb-2">Today's Insight</h3>
                  {insights.map((item, i) => (
                    <Card key={i} className="flex gap-4 p-4 border-none bg-white shadow-subtle">
                      <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-coffee-700/10 text-coffee-700 shrink-0">
                        <item.icon size={20} />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold">{item.title}</h4>
                        <p className="text-xs text-neutral-500 mt-0.5">{item.desc}</p>
                      </div>
                    </Card>
                  ))}
                </section>
              )}

              <section>
                <h3 className="text-[10px] uppercase tracking-wider text-coffee-500 font-bold mb-2">Try asking</h3>
                <button
                  onClick={() => setMessage("What's my expected revenue for tomorrow?")}
                  className="text-xs font-bold text-coffee-700 bg-coffee-700/10 px-4 py-2 rounded-xl hover:bg-coffee-700/20 transition-standard text-left"
                >
                  What's my expected revenue for tomorrow?
                </button>
              </section>
            </>
          )}

          {chatHistory.map((chat, i) => (
            <div key={i} className={`flex ${chat.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-4 rounded-2xl text-sm ${
                chat.role === 'user'
                  ? 'bg-coffee-700 text-white'
                  : 'bg-white border border-coffee-200 text-coffee-900 shadow-subtle'
              }`}>
                {chat.text}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white border border-coffee-200 p-4 rounded-2xl">
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 bg-coffee-700 rounded-full animate-bounce" />
                  <div className="w-1.5 h-1.5 bg-coffee-700 rounded-full animate-bounce delay-75" />
                  <div className="w-1.5 h-1.5 bg-coffee-700 rounded-full animate-bounce delay-150" />
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Chat Input — always at the bottom, never hidden */}
        <div className="pt-3 shrink-0">
          <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-2 items-center">
            <Card className="flex-1 p-1 flex gap-2 items-center bg-white shadow-large border border-coffee-700/20 rounded-2xl">
              <input
                type="text"
                placeholder="Ask BizFlow AI..."
                className="w-full bg-transparent border-none focus:ring-0 px-3 py-3 text-sm font-medium"
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
