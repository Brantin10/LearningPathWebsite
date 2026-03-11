'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useUser } from '@/hooks/useUser';
import { useToast } from '@/hooks/useToast';
import { getMessages, sendMessage, getConversations } from '@/services/firestore';
import { DirectMessage, Conversation } from '@/types';
import Navbar from '@/components/Navbar';
import Avatar from '@/components/Avatar';
import { PageSkeleton } from '@/components/Skeleton';
import AnimatedPage from '@/components/AnimatedPage';
import Breadcrumbs from '@/components/Breadcrumbs';

function formatTime(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function ConversationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const conversationId = searchParams.get('conversationId') || '';
  const { user } = useAuth();
  const { profile } = useUser();
  const toast = useToast();

  const [messages, setMessages] = useState<DirectMessage[]>([]);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pollRef = useRef<NodeJS.Timeout | null>(null);

  // Get conversation metadata
  useEffect(() => {
    if (!user || !conversationId) return;
    getConversations(user.uid).then((convos) => {
      const found = convos.find((c) => c.id === conversationId);
      setConversation(found || null);
    });
  }, [user, conversationId]);

  // Load messages and poll for new ones
  useEffect(() => {
    if (!conversationId) return;

    const fetchMessages = async () => {
      const msgs = await getMessages(conversationId);
      setMessages(msgs);
      setLoading(false);
    };

    fetchMessages();

    // Poll every 5 seconds for new messages
    pollRef.current = setInterval(fetchMessages, 5000);

    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [conversationId]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const otherUid = conversation?.participants.find((p) => p !== user?.uid) || '';
  const otherName = conversation?.participantNames[otherUid] || 'Unknown';
  const otherAvatar = conversation?.participantAvatars[otherUid] ?? 0;

  const handleSend = async () => {
    if (!user || !profile || text.trim().length === 0 || !conversationId) return;
    setSending(true);
    try {
      const msg: Omit<DirectMessage, 'id'> = {
        senderUid: user.uid,
        senderName: profile.username || 'Anonymous',
        text: text.trim(),
        timestamp: Date.now(),
      };
      const msgId = await sendMessage(conversationId, msg);
      setMessages((prev) => [...prev, { id: msgId, ...msg }]);
      setText('');
    } catch (err) {
      toast.error('Failed to send message.');
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-bg to-bg-elevated flex flex-col">
      <AnimatedPage>
      <Breadcrumbs />
      {/* Header */}
      <div className="glass-card border-b border-border px-5 py-3 flex items-center gap-3 shrink-0">
        <button
          onClick={() => router.back()}
          className="text-text-secondary hover:text-text-primary transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        {conversation && <Avatar index={otherAvatar} size={36} />}
        <div className="flex-1 min-w-0">
          <p className="text-[15px] font-semibold text-text-primary truncate">{otherName}</p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-5 py-4">
        {loading ? (
          <PageSkeleton />
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-text-muted text-sm">No messages yet. Say hello!</p>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto space-y-3">
            {messages.map((msg) => {
              const isSent = msg.senderUid === user?.uid;
              return (
                <div
                  key={msg.id}
                  className={`flex ${isSent ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
                      isSent
                        ? 'bg-primary-muted text-text-primary rounded-br-md'
                        : 'glass-card-elevated text-text-primary rounded-bl-md'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                    <p
                      className={`text-[10px] mt-1 ${
                        isSent ? 'text-text-muted text-right' : 'text-text-muted'
                      }`}
                    >
                      {formatTime(msg.timestamp)}
                    </p>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Bar */}
      <div className="glass-card border-t border-border px-5 py-3 shrink-0">
        <div className="max-w-3xl mx-auto flex gap-3 items-end">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            rows={1}
            className="flex-1 glass-input rounded-xl px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted resize-none min-h-[44px] max-h-[120px]"
          />
          <button
            onClick={handleSend}
            disabled={sending || text.trim().length === 0}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors shrink-0 ${
              sending || text.trim().length === 0
                ? 'bg-bg-card-hover text-text-muted cursor-not-allowed'
                : 'bg-primary text-white hover:bg-primary-dark cursor-pointer'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
      </AnimatedPage>
    </div>
  );
}

export default function ConversationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-b from-bg to-bg-elevated" />}>
      <ConversationContent />
    </Suspense>
  );
}
