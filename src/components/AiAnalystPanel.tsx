import { FormEvent, useRef, useState } from 'react';
import {
  ArrowRight,
  Bot,
  Loader2,
  RotateCcw,
  Send,
  X,
} from 'lucide-react';
import { DATASETS } from '../data/maeSaiData';
import { DatasetItem, PageRoute } from '../types/hub';
import { AccessBadge } from './AccessBadge';

export interface AnalystMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  analysisMode?: string;
  keyTakeaways?: string[];
  recommendedDatasetIds?: string[];
  followUpPrompts?: string[];
}

interface AiAnalystPanelProps {
  activePage: PageRoute;
  activeDatasetId?: string;
  datasets?: DatasetItem[];
  onSelectDataset: (datasetId: string) => void;
  variant?: 'embedded' | 'drawer';
  onCloseDrawer?: () => void;
}

const STARTER_PROMPTS = [
  {
    mode: 'Explore',
    prompt: 'Which open datasets cover Pong Pha and Doi Pha Hee?',
  },
  {
    mode: 'Analyze',
    prompt:
      'Compare border market vs. highland coffee seasonal trends and top visitor pain points.',
  },
  {
    mode: 'Predict',
    prompt:
      'Forecast how Q3 monsoon weather affects cave and trail visits, and what local cafés should do.',
  },
  {
    mode: 'Predict',
    prompt:
      'If Pha Hee cafés shift 20% of morning visitors to afternoon slots, what changes?',
  },
];

export function AiAnalystPanel({
  activePage,
  activeDatasetId,
  datasets = DATASETS,
  onSelectDataset,
  variant = 'embedded',
  onCloseDrawer,
}: AiAnalystPanelProps) {
  const [messages, setMessages] = useState<AnalystMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const sendPrompt = async (promptText: string) => {
    const trimmed = promptText.trim();
    if (!trimmed || isLoading) return;

    setErrorMessage(null);
    const userMsg: AnalystMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      text: trimmed,
    };

    const nextHistory = [...messages, userMsg];
    setMessages(nextHistory);
    setInputValue('');
    setIsLoading(true);

    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 40);

    try {
      const response = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmed,
          history: nextHistory.slice(-6).map((m) => ({
            role: m.role,
            text: m.text,
          })),
          activeContext: {
            page: activePage,
            datasetId: activePage === 'detail' ? activeDatasetId : undefined,
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(
          data?.error || 'Unable to reach the AI Data Analyst service.'
        );
        setIsLoading(false);
        return;
      }

      const assistantMsg: AnalystMessage = {
        id: `a-${Date.now()}`,
        role: 'assistant',
        text: data.answer || 'No response generated.',
        analysisMode: data.analysisMode,
        keyTakeaways: Array.isArray(data.keyTakeaways) ? data.keyTakeaways : [],
        recommendedDatasetIds: Array.isArray(data.recommendedDatasetIds)
          ? data.recommendedDatasetIds
          : [],
        followUpPrompts: Array.isArray(data.followUpPrompts)
          ? data.followUpPrompts
          : [],
      };

      setMessages((prev) => [...prev, assistantMsg]);
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 40);
    } catch {
      setErrorMessage(
        'Network error while contacting the server. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    sendPrompt(inputValue);
  };

  const resetChat = () => {
    setMessages([]);
    setErrorMessage(null);
    setInputValue('');
  };

  return (
    <div
      className={`flex flex-col bg-white ${
        variant === 'embedded'
          ? 'border border-[#E3E6DF] rounded-lg min-h-[540px]'
          : 'h-full'
      }`}
    >
      {/* Header */}
      <div className="px-5 py-4 border-b border-[#E3E6DF] flex items-center justify-between gap-3 bg-[#F7F8F5]">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-full bg-[#406246] text-white flex items-center justify-center shrink-0">
            <Bot className="w-4 h-4" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <div className="font-display text-sm font-bold text-[#243329] truncate">
              Mae Sai Data Analyst
            </div>
            <div className="text-[11px] text-[#66736A] truncate">
              Explore, analyze &amp; forecast hub datasets
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {messages.length > 0 && (
            <button
              type="button"
              onClick={resetChat}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-[#66736A] hover:text-[#243329] bg-white border border-[#E3E6DF] rounded-md cursor-pointer"
              title="Clear conversation"
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Clear</span>
            </button>
          )}
          {variant === 'drawer' && onCloseDrawer && (
            <button
              type="button"
              onClick={onCloseDrawer}
              className="p-1.5 text-[#66736A] hover:text-[#243329] rounded-md cursor-pointer"
              aria-label="Close AI Data Analyst"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Messages Viewport */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {messages.length === 0 ? (
          <div className="space-y-5 py-2">
            <div className="space-y-1">
              <h3 className="font-display text-base font-semibold text-[#243329]">
                Ask anything about Mae Sai datasets
              </h3>
              <p className="text-xs sm:text-sm text-[#66736A] leading-relaxed">
                Discover catalog sources, compare sub-districts, or run seasonal and capacity projections.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {STARTER_PROMPTS.map((item) => (
                <button
                  key={item.prompt}
                  type="button"
                  onClick={() => sendPrompt(item.prompt)}
                  className="text-left p-3.5 bg-[#F7F8F5] hover:bg-[#f5f0de] border border-[#E3E6DF] hover:border-[#406246] rounded-md transition-colors space-y-1 cursor-pointer"
                >
                  <div className="text-[11px] font-semibold text-[#406246]">
                    {item.mode}
                  </div>
                  <div className="text-xs font-medium text-[#243329] leading-snug">
                    {item.prompt}
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            {messages.map((msg) => {
              if (msg.role === 'user') {
                return (
                  <div key={msg.id} className="flex justify-end">
                    <div className="max-w-[85%] bg-[#406246] text-white text-sm px-4 py-3 rounded-lg leading-relaxed">
                      {msg.text}
                    </div>
                  </div>
                );
              }

              const referencedDatasets = (msg.recommendedDatasetIds || [])
                .map((id) => datasets.find((d) => d.id === id))
                .filter((d): d is NonNullable<typeof d> => Boolean(d));

              return (
                <div
                  key={msg.id}
                  className="bg-[#F7F8F5] border border-[#E3E6DF] rounded-lg p-4 sm:p-5 space-y-4"
                >
                  <div className="text-xs font-semibold text-[#406246] capitalize">
                    {msg.analysisMode || 'Analyze'}
                  </div>

                  <p className="text-sm text-[#243329] leading-relaxed whitespace-pre-line">
                    {msg.text}
                  </p>

                  {msg.keyTakeaways && msg.keyTakeaways.length > 0 && (
                    <div className="bg-white border border-[#E3E6DF] rounded-md p-3.5 space-y-2">
                      <div className="text-xs font-semibold text-[#243329]">
                        Key Takeaways
                      </div>
                      <ul className="space-y-1.5 text-xs text-[#243329] leading-relaxed">
                        {msg.keyTakeaways.map((point, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-[#406246] font-bold" aria-hidden="true">
                              ·
                            </span>
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {referencedDatasets.length > 0 && (
                    <div className="space-y-2">
                      <div className="text-xs font-semibold text-[#66736A]">
                        Referenced Datasets
                      </div>
                      <div className="grid grid-cols-1 gap-2">
                        {referencedDatasets.map((ds) => (
                          <button
                            key={ds.id}
                            type="button"
                            onClick={() => {
                              if (onCloseDrawer) onCloseDrawer();
                              onSelectDataset(ds.id);
                            }}
                            className="w-full text-left p-3 bg-white hover:bg-[#f5f0de] border border-[#E3E6DF] rounded-md flex items-center justify-between gap-3 transition-colors cursor-pointer"
                          >
                            <div className="min-w-0">
                              <div className="text-xs font-semibold text-[#243329] truncate">
                                {ds.title}
                              </div>
                              <div className="text-[11px] text-[#66736A] mt-0.5 truncate">
                                {ds.dataType} · {ds.sourceLabel}
                              </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <AccessBadge level={ds.accessLevel} />
                              <ArrowRight
                                className="w-3.5 h-3.5 text-[#406246]"
                                aria-hidden="true"
                              />
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {msg.followUpPrompts && msg.followUpPrompts.length > 0 && (
                    <div className="pt-2 border-t border-[#E3E6DF] flex flex-wrap gap-1.5">
                      {msg.followUpPrompts.map((q) => (
                        <button
                          key={q}
                          type="button"
                          onClick={() => sendPrompt(q)}
                          className="text-left px-2.5 py-1.5 text-xs text-[#406246] bg-white hover:bg-[#f5f0de] border border-[#CFD5CB] rounded-md transition-colors cursor-pointer"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {isLoading && (
              <div className="bg-[#F7F8F5] border border-[#E3E6DF] rounded-lg p-4 flex items-center gap-2.5 text-sm text-[#66736A]">
                <Loader2 className="w-4 h-4 animate-spin text-[#406246]" aria-hidden="true" />
                <span>Analyzing Mae Sai hub data...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}

        {errorMessage && (
          <div
            role="alert"
            className="bg-[#FAF1EE] border border-[#E7CFC6] text-[#7C2D12] text-xs rounded-md p-3.5 leading-relaxed"
          >
            {errorMessage}
          </div>
        )}
      </div>

      {/* Input Form */}
      <form
        onSubmit={handleSubmit}
        className="p-4 border-t border-[#E3E6DF] bg-[#F7F8F5] flex items-center gap-2"
      >
        <label htmlFor={`ai-input-${variant}`} className="sr-only">
          Ask Mae Sai Data Analyst
        </label>
        <input
          id={`ai-input-${variant}`}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          disabled={isLoading}
          placeholder="Ask about datasets, trends, or seasonal forecasts..."
          className="flex-1 px-3.5 py-2.5 text-sm bg-white border border-[#D7DDD3] rounded-md text-[#243329] placeholder:text-[#66736A] focus:outline-none focus:border-[#406246] disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={isLoading || !inputValue.trim()}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-[#406246] hover:bg-[#335038] disabled:opacity-50 text-white text-sm font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          <Send className="w-4 h-4" aria-hidden="true" />
          <span>Ask</span>
        </button>
      </form>
    </div>
  );
}
