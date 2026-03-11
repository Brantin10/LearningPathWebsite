'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useUser } from '@/hooks/useUser';
import {
  getIncomingRequests,
  getOutgoingRequests,
  respondToRequest,
  getConversations,
  createConversation,
} from '@/services/firestore';
import { ContactRequest, Conversation } from '@/types';
import Navbar from '@/components/Navbar';
import PageHeader from '@/components/PageHeader';
import Card from '@/components/Card';
import Avatar from '@/components/Avatar';
import { PageSkeleton } from '@/components/Skeleton';
import AnimatedPage from '@/components/AnimatedPage';
import EmptyState from '@/components/EmptyState';

function timeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks}w ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
}

const STATUS_BADGES: Record<string, string> = {
  pending: 'bg-accent-muted text-accent',
  accepted: 'bg-primary-muted text-primary',
  declined: 'bg-error-muted text-error',
};

export default function InboxPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { profile } = useUser();
  const [tab, setTab] = useState<'conversations' | 'requests'>('conversations');
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [incoming, setIncoming] = useState<ContactRequest[]>([]);
  const [outgoing, setOutgoing] = useState<ContactRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    Promise.all([
      getConversations(user.uid),
      getIncomingRequests(user.uid),
      getOutgoingRequests(user.uid),
    ])
      .then(([convos, inc, out]) => {
        setConversations(convos);
        setIncoming(inc);
        setOutgoing(out);
      })
      .finally(() => setLoading(false));
  }, [user]);

  const pendingCount = incoming.filter((r) => r.status === 'pending').length;

  const handleAccept = async (req: ContactRequest) => {
    if (!user || !profile) return;
    await respondToRequest(req.id, 'accepted');
    // Create a conversation
    await createConversation({
      participants: [req.fromUid, req.toUid],
      participantNames: {
        [req.fromUid]: req.fromName,
        [req.toUid]: req.toName,
      },
      participantAvatars: {
        [req.fromUid]: req.fromAvatar,
        [req.toUid]: req.toAvatar,
      },
      lastMessage: '',
      lastMessageAt: Date.now(),
      createdAt: Date.now(),
    });
    // Refresh lists
    setIncoming((prev) =>
      prev.map((r) => (r.id === req.id ? { ...r, status: 'accepted' as const } : r)),
    );
    const convos = await getConversations(user.uid);
    setConversations(convos);
  };

  const handleDecline = async (req: ContactRequest) => {
    if (!window.confirm('Decline this contact request?')) return;
    await respondToRequest(req.id, 'declined');
    setIncoming((prev) =>
      prev.map((r) => (r.id === req.id ? { ...r, status: 'declined' as const } : r)),
    );
  };

  const getOtherName = (conv: Conversation): string => {
    if (!user) return '';
    const otherUid = conv.participants.find((p) => p !== user.uid) || '';
    return conv.participantNames[otherUid] || 'Unknown';
  };

  const getOtherAvatar = (conv: Conversation): number => {
    if (!user) return 0;
    const otherUid = conv.participants.find((p) => p !== user.uid) || '';
    return conv.participantAvatars[otherUid] ?? 0;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-bg to-bg-elevated">
      <Navbar />
      <AnimatedPage>
        <main className="max-w-3xl mx-auto px-5 pt-4 pb-10">
          <PageHeader title="Inbox" subtitle="Messages and contact requests" />

        {/* Tab Bar */}
        <div className="flex rounded-xl glass-card p-1 mb-5">
          <button
            onClick={() => setTab('conversations')}
            className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
              tab === 'conversations'
                ? 'bg-primary text-white'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            Conversations
          </button>
          <button
            onClick={() => setTab('requests')}
            className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-colors relative ${
              tab === 'requests'
                ? 'bg-primary text-white'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            Requests
            {pendingCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-error text-white text-[10px] font-bold flex items-center justify-center">
                {pendingCount}
              </span>
            )}
          </button>
        </div>

        {loading ? (
          <PageSkeleton />
        ) : tab === 'conversations' ? (
          /* Conversations Tab */
          conversations.length === 0 ? (
            <EmptyState
              icon="💬"
              title="No Conversations"
              description="No conversations yet. Accept a contact request to start chatting."
            />
          ) : (
            <div className="space-y-2">
              {conversations.map((conv) => (
                <Card
                  key={conv.id}
                  onClick={() => router.push(`/conversation?conversationId=${conv.id}`)}
                  className="cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <Avatar index={getOtherAvatar(conv)} size={44} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-[15px] font-semibold text-text-primary truncate">
                          {getOtherName(conv)}
                        </p>
                        <p className="text-[11px] text-text-muted whitespace-nowrap ml-2">
                          {timeAgo(conv.lastMessageAt)}
                        </p>
                      </div>
                      <p className="text-sm text-text-secondary truncate mt-0.5">
                        {conv.lastMessage || 'No messages yet'}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )
        ) : (
          /* Requests Tab */
          <div>
            {/* Incoming Requests */}
            <h3 className="text-sm font-semibold text-text-secondary mb-3">Incoming</h3>
            {incoming.length === 0 ? (
              <div className="mb-5">
                <EmptyState icon="📥" title="No Incoming Requests" description="No incoming requests." />
              </div>
            ) : (
              <div className="space-y-2 mb-5">
                {incoming.map((req) => (
                  <Card key={req.id}>
                    <div className="flex items-center gap-3">
                      <Avatar index={req.fromAvatar} size={40} />
                      <div className="flex-1 min-w-0">
                        <p className="text-[15px] font-semibold text-text-primary truncate">
                          {req.fromName}
                        </p>
                        <p className="text-xs text-text-muted">
                          {req.fromRole === 'employer' ? 'Employer' : 'Job Seeker'} &middot;{' '}
                          {timeAgo(req.createdAt)}
                        </p>
                        {req.message && (
                          <p className="text-sm text-text-secondary mt-1 truncate">{req.message}</p>
                        )}
                      </div>
                      {req.status === 'pending' ? (
                        <div className="flex gap-2 shrink-0">
                          <button
                            onClick={() => handleAccept(req)}
                            className="px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary-dark transition-colors"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleDecline(req)}
                            className="px-3 py-1.5 rounded-lg bg-error-muted text-error text-xs font-semibold hover:bg-[rgba(255,107,107,0.25)] transition-colors"
                          >
                            Decline
                          </button>
                        </div>
                      ) : (
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-semibold capitalize ${
                            STATUS_BADGES[req.status]
                          }`}
                        >
                          {req.status}
                        </span>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {/* Outgoing Requests */}
            <h3 className="text-sm font-semibold text-text-secondary mb-3">Sent</h3>
            {outgoing.length === 0 ? (
              <EmptyState icon="📤" title="No Sent Requests" description="No sent requests." />
            ) : (
              <div className="space-y-2">
                {outgoing.map((req) => (
                  <Card key={req.id}>
                    <div className="flex items-center gap-3">
                      <Avatar index={req.toAvatar} size={40} />
                      <div className="flex-1 min-w-0">
                        <p className="text-[15px] font-semibold text-text-primary truncate">
                          {req.toName}
                        </p>
                        <p className="text-xs text-text-muted">{timeAgo(req.createdAt)}</p>
                      </div>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-semibold capitalize ${
                          STATUS_BADGES[req.status]
                        }`}
                      >
                        {req.status}
                      </span>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
      </AnimatedPage>
    </div>
  );
}
