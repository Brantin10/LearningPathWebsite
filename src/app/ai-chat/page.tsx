'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useUser } from '@/hooks/useUser';
import { useTheme } from '@/hooks/useTheme';
import { sendMessageToGemini } from '@/services/gemini';
import {
  getAIConversation,
  saveAIConversation,
  clearAIConversation,
} from '@/services/firestore';
import PageHeader from '@/components/PageHeader';
import Navbar from '@/components/Navbar';
import { Send, Trash2, Sparkles } from 'lucide-react';
import { ChatMessage } from '@/types';

const SUGGESTIONS = [
  'What skills should I learn first?',
  'Help me prepare for interviews',
  'Review my career progress',
  "What's the job market like?",
  'How do I negotiate salary?',
];

export default function AIChatPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useUser();
  const { colors } = useTheme();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const username = profile?.username || user?.email?.split('@')[0] || 'there';

  // Auto-scroll to bottom
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  // Load saved conversation
  useEffect(() => {
    if (!user) return;

    async function loadConversation() {
      try {
        const conv = await getAIConversation(user!.uid);
        if (conv && conv.messages.length > 0) {
          setMessages(conv.messages);
        }
      } catch (err) {
        console.error('Failed to load conversation:', err);
      } finally {
        setLoading(false);
      }
    }

    loadConversation();
  }, [user]);

  // Save conversation when messages change
  useEffect(() => {
    if (!user || loading || messages.length === 0) return;

    const timeout = setTimeout(() => {
      saveAIConversation(user.uid, messages).catch((err) =>
        console.error('Failed to save conversation:', err)
      );
    }, 500);

    return () => clearTimeout(timeout);
  }, [messages, user, loading]);

  // Auto-resize textarea
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  };

  const handleSend = useCallback(
    async (text?: string) => {
      const messageText = (text || input).trim();
      if (!messageText || isTyping || !profile) return;

      const userMessage: ChatMessage = {
        id: `user-${Date.now()}`,
        role: 'user',
        content: messageText,
        timestamp: Date.now(),
      };

      const updatedMessages = [...messages, userMessage];
      setMessages(updatedMessages);
      setInput('');
      setIsTyping(true);

      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }

      try {
        const response = await sendMessageToGemini(updatedMessages, profile);

        const assistantMessage: ChatMessage = {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: response,
          timestamp: Date.now(),
        };

        setMessages((prev) => [...prev, assistantMessage]);
      } catch (err: any) {
        console.error('AI chat error:', err);

        const errorMessage: ChatMessage = {
          id: `assistant-error-${Date.now()}`,
          role: 'assistant',
          content: err.message || 'Sorry, something went wrong. Please try again.',
          timestamp: Date.now(),
        };

        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setIsTyping(false);
      }
    },
    [input, isTyping, messages, profile]
  );

  const handleClear = useCallback(async () => {
    if (messages.length === 0) return;

    const confirmed = window.confirm('Clear all messages? This cannot be undone.');
    if (!confirmed) return;

    try {
      if (user) {
        await clearAIConversation(user.uid);
      }
      setMessages([]);
    } catch (err) {
      console.error('Failed to clear conversation:', err);
    }
  }, [messages, user]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  if (authLoading || profileLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-bg to-bg-elevated flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const isWelcome = messages.length === 0;
  const canSend = input.trim().length > 0 && !isTyping;

  return (
    <div className="min-h-screen bg-gradient-to-b from-bg to-bg-elevated flex flex-col">
      <Navbar />

      {/* Header Bar */}
      <div className="max-w-3xl w-full mx-auto px-5 pt-4 pb-2 flex items-center justify-between">
        <PageHeader title="Career Coach" showBack={true} />
        {messages.length > 0 && (
          <button
            onClick={handleClear}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-error hover:bg-error-muted transition-colors"
          >
            <Trash2 size={14} />
            Clear
          </button>
        )}
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-5">
        <div className="max-w-3xl mx-auto pb-4">
          {isWelcome ? (
            /* Welcome State */
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 rounded-full bg-primary-muted flex items-center justify-center mb-4">
                <Sparkles size={28} className="text-primary" />
              </div>
              <h2 className="text-xl font-bold text-text-primary mb-2">
                Hi {username}!
              </h2>
              <p className="text-sm text-text-secondary text-center max-w-md mb-8">
                I&apos;m your AI Career Coach. Ask me anything about career planning, skill development, interviews, or job searching.
              </p>
              <div className="flex flex-wrap gap-2 justify-center max-w-lg">
                {SUGGESTIONS.map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => handleSend(suggestion)}
                    className="px-4 py-2 rounded-2xl text-xs font-medium glass-card text-text-primary hover:bg-bg-card-hover transition-colors border border-border-light"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Message Bubbles */
            <div className="space-y-4 py-4">
              {messages.map((msg) => {
                const isUser = msg.role === 'user';

                return (
                  <div
                    key={msg.id}
                    className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] md:max-w-[75%] rounded-2xl px-4 py-3 ${
                        isUser
                          ? 'bg-primary-muted border border-[rgba(39,174,96,0.3)] rounded-br-md'
                          : 'glass-card rounded-bl-md'
                      }`}
                    >
                      <p className="text-sm text-text-primary whitespace-pre-wrap leading-relaxed">
                        {msg.content}
                      </p>
                      <p
                        className={`text-[10px] mt-1.5 ${
                          isUser ? 'text-primary/60 text-right' : 'text-text-muted'
                        }`}
                      >
                        {formatTime(msg.timestamp)}
                      </p>
                    </div>
                  </div>
                );
              })}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="glass-card rounded-2xl rounded-bl-md px-4 py-3">
                    <div className="flex gap-1.5 items-center h-5">
                      <span className="w-2 h-2 rounded-full bg-text-muted animate-bounce-dot" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 rounded-full bg-text-muted animate-bounce-dot" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 rounded-full bg-text-muted animate-bounce-dot" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      {/* Input Bar */}
      <div className="border-t border-border bg-bg/80 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto px-5 py-3 flex items-end gap-3">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Ask your career coach..."
            rows={1}
            className="flex-1 glass-input rounded-2xl px-4 py-3 text-sm text-text-primary placeholder:text-text-muted resize-none focus:outline-none focus:border-primary transition-colors max-h-[120px]"
          />
          <button
            onClick={() => handleSend()}
            disabled={!canSend}
            className={`w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
              canSend
                ? 'bg-primary text-white hover:bg-primary-dark'
                : 'bg-bg-card text-text-muted'
            }`}
          >
            <Send size={18} />
          </button>
        </div>
      </div>

      {/* Bouncing Dots Animation */}
      <style jsx global>{`
        @keyframes bounce-dot {
          0%, 60%, 100% {
            transform: translateY(0);
          }
          30% {
            transform: translateY(-6px);
          }
        }
        .animate-bounce-dot {
          animation: bounce-dot 1.2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
