import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  getDocs,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  where,
  limit as firestoreLimit,
  increment,
  Unsubscribe,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { AppUser, Career, Answers, SavedJob, InterviewAttempt, JobApplication, ActivityLog, NotificationPreferences, ResumeData, CommunityPost, CommunityReply, ChatMessage, AIConversation, DailyAction, DailyActionsPrefs, DailyActionsState, DEFAULT_DAILY_PREFS, EmployerBookmark, CandidateListItem, ContactRequest, DirectMessage, Conversation } from '../types';

// ── Timeout Helper ──────────────────────────────────────────────
// Firestore operations can hang if rules block writes (SDK retries silently).
// This wrapper ensures operations either complete or fail within a time limit.
function withTimeout<T>(promise: Promise<T>, ms = 8000, label = 'Firestore op'): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms),
    ),
  ]);
}

// ── Backward Compat Helper ──────────────────────────────────────
function normalizeUser(data: Record<string, any>): AppUser {
  return {
    ...data,
    role: data.role || 'seeker',
    visibleToEmployers: data.visibleToEmployers ?? false,
  } as AppUser;
}

// ── User Profile ────────────────────────────────────────────────

export async function getUser(uid: string): Promise<AppUser | null> {
  const snap = await withTimeout(getDoc(doc(db, 'users', uid)), 8000, 'getUser');
  return snap.exists() ? normalizeUser(snap.data()) : null;
}

export async function updateUser(uid: string, data: Partial<AppUser>): Promise<void> {
  await withTimeout(updateDoc(doc(db, 'users', uid), data as Record<string, any>), 8000, 'updateUser');
}

export function onUserSnapshot(uid: string, callback: (user: AppUser | null) => void): Unsubscribe {
  return onSnapshot(doc(db, 'users', uid), (snap) => {
    callback(snap.exists() ? normalizeUser(snap.data()) : null);
  });
}

// ── Careers ─────────────────────────────────────────────────────

export async function getAllCareers(): Promise<Career[]> {
  const snap = await withTimeout(getDocs(collection(db, 'careers')), 10000, 'getAllCareers');
  return snap.docs.map((d) => ({ uid: d.id, ...d.data() } as Career));
}

export async function getCareer(uid: string): Promise<Career | null> {
  const snap = await withTimeout(getDoc(doc(db, 'careers', uid)), 8000, 'getCareer');
  return snap.exists() ? ({ uid: snap.id, ...snap.data() } as Career) : null;
}

export function onCareerSnapshot(uid: string, callback: (career: Career | null) => void): Unsubscribe {
  return onSnapshot(doc(db, 'careers', uid), (snap) => {
    callback(snap.exists() ? ({ uid: snap.id, ...snap.data() } as Career) : null);
  });
}

// ── Questionnaire Answers ───────────────────────────────────────

export async function saveAnswers(userUid: string, answers: Answers): Promise<void> {
  const ref = collection(db, 'users', userUid, 'questionnaires');
  await withTimeout(addDoc(ref, {
    answers,
    updatedAt: Date.now(),
  }), 8000, 'saveAnswers');
}

export async function getLatestAnswers(userUid: string): Promise<Answers | null> {
  const ref = collection(db, 'users', userUid, 'questionnaires');
  const snap = await withTimeout(getDocs(ref), 8000, 'getLatestAnswers');
  if (snap.empty) return null;

  let latest: any = null;
  snap.docs.forEach((d) => {
    const data = d.data();
    if (!latest || (data.updatedAt || 0) > (latest.updatedAt || 0)) {
      latest = data;
    }
  });
  return latest?.answers || null;
}

// ── Generated Learning Paths (cached from AI) ──────────────────

export async function saveLearningPath(
  userUid: string,
  careerId: string,
  pathData: any,
): Promise<void> {
  await withTimeout(setDoc(doc(db, 'users', userUid, 'learning_paths', careerId), {
    ...pathData,
    generatedAt: Date.now(),
  }), 8000, 'saveLearningPath');
}

export async function getLearningPath(
  userUid: string,
  careerId: string,
): Promise<any | null> {
  const snap = await withTimeout(getDoc(doc(db, 'users', userUid, 'learning_paths', careerId)), 8000, 'getLearningPath');
  return snap.exists() ? snap.data() : null;
}

// ── Career Progress ─────────────────────────────────────────────

export async function getCompletedSteps(userUid: string, careerId: string): Promise<number[]> {
  const snap = await withTimeout(getDoc(doc(db, 'users', userUid, 'career_progress', careerId)), 8000, 'getCompletedSteps');
  return snap.exists() ? (snap.data().completedSteps || []) : [];
}

export async function saveCompletedSteps(
  userUid: string,
  careerId: string,
  completedSteps: number[]
): Promise<void> {
  await withTimeout(setDoc(doc(db, 'users', userUid, 'career_progress', careerId), { completedSteps }), 8000, 'saveCompletedSteps');
}

// ── Saved Jobs ──────────────────────────────────────────────────

export async function saveJob(uid: string, job: Omit<SavedJob, 'id'>): Promise<string> {
  const ref = await withTimeout(addDoc(collection(db, 'users', uid, 'saved_jobs'), job), 8000, 'saveJob');
  return ref.id;
}

export async function getSavedJobs(uid: string): Promise<SavedJob[]> {
  const snap = await withTimeout(getDocs(collection(db, 'users', uid, 'saved_jobs')), 8000, 'getSavedJobs');
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as SavedJob));
}

export async function deleteSavedJob(uid: string, jobId: string): Promise<void> {
  await withTimeout(deleteDoc(doc(db, 'users', uid, 'saved_jobs', jobId)), 8000, 'deleteSavedJob');
}

// ── Interview Attempts ──────────────────────────────────────────

export async function saveInterviewAttempt(
  uid: string,
  attempt: InterviewAttempt,
): Promise<string> {
  const ref = await withTimeout(addDoc(collection(db, 'users', uid, 'interview_attempts'), attempt), 8000, 'saveInterviewAttempt');
  return ref.id;
}

export async function getInterviewAttempts(uid: string): Promise<InterviewAttempt[]> {
  const snap = await withTimeout(getDocs(collection(db, 'users', uid, 'interview_attempts')), 8000, 'getInterviewAttempts');
  return snap.docs.map((d) => d.data() as InterviewAttempt);
}

// ── Job Applications ────────────────────────────────────────────

export async function addApplication(
  uid: string,
  app: Omit<JobApplication, 'id'>,
): Promise<string> {
  const ref = await withTimeout(addDoc(collection(db, 'users', uid, 'applications'), app), 8000, 'addApplication');
  return ref.id;
}

export async function getApplications(uid: string): Promise<JobApplication[]> {
  const snap = await withTimeout(getDocs(collection(db, 'users', uid, 'applications')), 8000, 'getApplications');
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as JobApplication));
}

export async function updateApplication(
  uid: string,
  appId: string,
  data: Partial<JobApplication>,
): Promise<void> {
  await withTimeout(updateDoc(doc(db, 'users', uid, 'applications', appId), data as Record<string, any>), 8000, 'updateApplication');
}

export async function deleteApplication(uid: string, appId: string): Promise<void> {
  await withTimeout(deleteDoc(doc(db, 'users', uid, 'applications', appId)), 8000, 'deleteApplication');
}

// ── Activity Log (Progress Tracking) ────────────────────────

export async function logActivity(
  userUid: string,
  careerId: string,
  action: string,
  details?: string,
): Promise<void> {
  const today = new Date().toISOString().split('T')[0];
  const activity: ActivityLog = { date: today, action, details };
  await withTimeout(addDoc(collection(db, 'users', userUid, 'career_progress', careerId, 'activity_log'), activity), 8000, 'logActivity');
}

export async function getActivityLog(userUid: string, careerId: string): Promise<ActivityLog[]> {
  const snap = await withTimeout(getDocs(
    collection(db, 'users', userUid, 'career_progress', careerId, 'activity_log'),
  ), 8000, 'getActivityLog');
  return snap.docs.map((d) => d.data() as ActivityLog);
}

// ── Notification Preferences ────────────────────────────────

export async function getNotificationPreferences(uid: string): Promise<NotificationPreferences | null> {
  const snap = await withTimeout(getDoc(doc(db, 'users', uid, 'settings', 'notifications')), 8000, 'getNotificationPreferences');
  return snap.exists() ? (snap.data() as NotificationPreferences) : null;
}

export async function saveNotificationPreferences(
  uid: string,
  prefs: NotificationPreferences,
): Promise<void> {
  await withTimeout(setDoc(doc(db, 'users', uid, 'settings', 'notifications'), prefs as Record<string, any>), 8000, 'saveNotificationPreferences');
}

// ── Resume Data ──────────────────────────────────────────────

export async function getResumeData(uid: string): Promise<ResumeData | null> {
  const snap = await withTimeout(getDoc(doc(db, 'users', uid, 'resume', 'data')), 8000, 'getResumeData');
  return snap.exists() ? (snap.data() as ResumeData) : null;
}

export async function saveResumeData(uid: string, data: ResumeData): Promise<void> {
  await withTimeout(setDoc(doc(db, 'users', uid, 'resume', 'data'), {
    ...data,
    updatedAt: Date.now(),
  } as Record<string, any>), 8000, 'saveResumeData');
}

// ── Community Posts ──────────────────────────────────────────

export async function getCommunityPosts(category?: string): Promise<CommunityPost[]> {
  const ref = collection(db, 'community_posts');
  const q = category && category !== 'All'
    ? query(ref, where('category', '==', category), orderBy('createdAt', 'desc'), firestoreLimit(50))
    : query(ref, orderBy('createdAt', 'desc'), firestoreLimit(50));
  const snap = await withTimeout(getDocs(q), 10000, 'getCommunityPosts');
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as CommunityPost));
}

export async function createCommunityPost(post: Omit<CommunityPost, 'id'>): Promise<string> {
  const ref = await withTimeout(addDoc(collection(db, 'community_posts'), post), 8000, 'createCommunityPost');
  return ref.id;
}

export async function getCommunityPost(postId: string): Promise<CommunityPost | null> {
  const snap = await withTimeout(getDoc(doc(db, 'community_posts', postId)), 8000, 'getCommunityPost');
  return snap.exists() ? ({ id: snap.id, ...snap.data() } as CommunityPost) : null;
}

export async function getPostReplies(postId: string): Promise<CommunityReply[]> {
  const ref = collection(db, 'community_posts', postId, 'replies');
  const q = query(ref, orderBy('createdAt', 'asc'));
  const snap = await withTimeout(getDocs(q), 8000, 'getPostReplies');
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as CommunityReply));
}

export async function addPostReply(postId: string, reply: Omit<CommunityReply, 'id'>): Promise<string> {
  const ref = await withTimeout(addDoc(collection(db, 'community_posts', postId, 'replies'), reply), 8000, 'addPostReply');
  await withTimeout(updateDoc(doc(db, 'community_posts', postId), { replyCount: increment(1) }), 8000, 'addPostReply:updateCount');
  return ref.id;
}

export async function togglePostUpvote(postId: string, uid: string): Promise<void> {
  const postRef = doc(db, 'community_posts', postId);
  const snap = await withTimeout(getDoc(postRef), 8000, 'togglePostUpvote:read');
  if (!snap.exists()) return;
  const data = snap.data();
  const upvotedBy: string[] = data.upvotedBy || [];
  if (upvotedBy.includes(uid)) {
    await withTimeout(updateDoc(postRef, { upvotes: increment(-1), upvotedBy: upvotedBy.filter((id) => id !== uid) }), 8000, 'togglePostUpvote:remove');
  } else {
    await withTimeout(updateDoc(postRef, { upvotes: increment(1), upvotedBy: [...upvotedBy, uid] }), 8000, 'togglePostUpvote:add');
  }
}

export async function toggleReplyUpvote(postId: string, replyId: string, uid: string): Promise<void> {
  const replyRef = doc(db, 'community_posts', postId, 'replies', replyId);
  const snap = await withTimeout(getDoc(replyRef), 8000, 'toggleReplyUpvote:read');
  if (!snap.exists()) return;
  const data = snap.data();
  const upvotedBy: string[] = data.upvotedBy || [];
  if (upvotedBy.includes(uid)) {
    await withTimeout(updateDoc(replyRef, { upvotes: increment(-1), upvotedBy: upvotedBy.filter((id) => id !== uid) }), 8000, 'toggleReplyUpvote:remove');
  } else {
    await withTimeout(updateDoc(replyRef, { upvotes: increment(1), upvotedBy: [...upvotedBy, uid] }), 8000, 'toggleReplyUpvote:add');
  }
}

export async function reportPost(postId: string, uid: string): Promise<void> {
  const postRef = doc(db, 'community_posts', postId);
  const snap = await withTimeout(getDoc(postRef), 8000, 'reportPost:read');
  if (!snap.exists()) return;
  const reportedBy: string[] = snap.data().reportedBy || [];
  if (!reportedBy.includes(uid)) {
    await withTimeout(updateDoc(postRef, { reported: true, reportedBy: [...reportedBy, uid] }), 8000, 'reportPost:write');
  }
}

export async function reportReply(postId: string, replyId: string, uid: string): Promise<void> {
  const replyRef = doc(db, 'community_posts', postId, 'replies', replyId);
  const snap = await withTimeout(getDoc(replyRef), 8000, 'reportReply:read');
  if (!snap.exists()) return;
  const reportedBy: string[] = snap.data().reportedBy || [];
  if (!reportedBy.includes(uid)) {
    await withTimeout(updateDoc(replyRef, { reported: true, reportedBy: [...reportedBy, uid] }), 8000, 'reportReply:write');
  }
}

// ── AI Chat Conversations ──────────────────────────────────────

const MAX_STORED_MESSAGES = 50;

export async function getAIConversation(uid: string): Promise<AIConversation | null> {
  const snap = await withTimeout(getDoc(doc(db, 'users', uid, 'ai_chat', 'conversation')), 8000, 'getAIConversation');
  return snap.exists() ? (snap.data() as AIConversation) : null;
}

export async function saveAIConversation(uid: string, messages: ChatMessage[]): Promise<void> {
  const trimmed = messages.slice(-MAX_STORED_MESSAGES);
  await withTimeout(setDoc(doc(db, 'users', uid, 'ai_chat', 'conversation'), {
    messages: trimmed,
    createdAt: trimmed.length > 0 ? trimmed[0].timestamp : Date.now(),
    updatedAt: Date.now(),
  } as Record<string, any>), 8000, 'saveAIConversation');
}

export async function clearAIConversation(uid: string): Promise<void> {
  await withTimeout(deleteDoc(doc(db, 'users', uid, 'ai_chat', 'conversation')), 8000, 'clearAIConversation');
}

// ── Daily Actions ─────────────────────────────────────────────────

export async function getDailyActionsPrefs(uid: string): Promise<DailyActionsPrefs> {
  const snap = await withTimeout(getDoc(doc(db, 'users', uid, 'settings', 'daily_actions')), 8000, 'getDailyActionsPrefs');
  return snap.exists() ? (snap.data() as DailyActionsPrefs) : DEFAULT_DAILY_PREFS;
}

export async function saveDailyActionsPrefs(uid: string, prefs: DailyActionsPrefs): Promise<void> {
  await withTimeout(setDoc(doc(db, 'users', uid, 'settings', 'daily_actions'), prefs as Record<string, any>), 8000, 'saveDailyActionsPrefs');
}

export async function getDailyActionsState(uid: string): Promise<DailyActionsState | null> {
  const snap = await withTimeout(getDoc(doc(db, 'users', uid, 'daily_actions', 'today')), 8000, 'getDailyActionsState');
  return snap.exists() ? (snap.data() as DailyActionsState) : null;
}

export async function saveDailyActionsState(uid: string, state: DailyActionsState): Promise<void> {
  await withTimeout(setDoc(doc(db, 'users', uid, 'daily_actions', 'today'), {
    ...state,
    updatedAt: Date.now(),
  } as Record<string, any>), 8000, 'saveDailyActionsState');
}

// ── Employer / Recruiter ───────────────────────────────────────

export async function getVisibleSeekers(): Promise<CandidateListItem[]> {
  const q = query(
    collection(db, 'users'),
    where('visibleToEmployers', '==', true),
  );
  const snap = await withTimeout(getDocs(q), 10000, 'getVisibleSeekers');
  return snap.docs.map((d) => {
    const data = d.data();
    return {
      uid: d.id,
      username: data.username || '',
      avatar: data.avatar || 0,
      skills: data.skills || '',
      chosenCareer: data.chosenCareer || '',
      education: data.education || '',
      age: data.age || '',
      currentJob: data.currentJob || '',
      profileCompleted: data.profileCompleted || false,
    } as CandidateListItem;
  });
}

export async function saveEmployerBookmark(
  employerUid: string,
  bookmark: EmployerBookmark,
): Promise<void> {
  await withTimeout(setDoc(
    doc(db, 'employer_bookmarks', employerUid, 'saved', bookmark.seekerUid),
    bookmark as Record<string, any>,
  ), 8000, 'saveEmployerBookmark');
}

export async function removeEmployerBookmark(
  employerUid: string,
  seekerUid: string,
): Promise<void> {
  await withTimeout(deleteDoc(doc(db, 'employer_bookmarks', employerUid, 'saved', seekerUid)), 8000, 'removeEmployerBookmark');
}

export async function getEmployerBookmarks(employerUid: string): Promise<EmployerBookmark[]> {
  const snap = await withTimeout(getDocs(collection(db, 'employer_bookmarks', employerUid, 'saved')), 8000, 'getEmployerBookmarks');
  return snap.docs.map((d) => d.data() as EmployerBookmark);
}

export async function isBookmarked(employerUid: string, seekerUid: string): Promise<boolean> {
  const snap = await withTimeout(getDoc(doc(db, 'employer_bookmarks', employerUid, 'saved', seekerUid)), 8000, 'isBookmarked');
  return snap.exists();
}

// ── Contact Requests ──────────────────────────────────────────

export async function sendContactRequest(req: Omit<ContactRequest, 'id'>): Promise<string> {
  const ref = await withTimeout(addDoc(collection(db, 'contact_requests'), req), 8000, 'sendContactRequest');
  return ref.id;
}

export async function getIncomingRequests(uid: string): Promise<ContactRequest[]> {
  const q = query(
    collection(db, 'contact_requests'),
    where('toUid', '==', uid),
  );
  const snap = await withTimeout(getDocs(q), 8000, 'getIncomingRequests');
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() } as ContactRequest))
    .sort((a, b) => b.createdAt - a.createdAt);
}

export async function getOutgoingRequests(uid: string): Promise<ContactRequest[]> {
  const q = query(
    collection(db, 'contact_requests'),
    where('fromUid', '==', uid),
  );
  const snap = await withTimeout(getDocs(q), 8000, 'getOutgoingRequests');
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() } as ContactRequest))
    .sort((a, b) => b.createdAt - a.createdAt);
}

export async function respondToRequest(
  requestId: string,
  status: 'accepted' | 'declined',
): Promise<void> {
  await withTimeout(updateDoc(doc(db, 'contact_requests', requestId), {
    status,
    respondedAt: Date.now(),
  }), 8000, 'respondToRequest');
}

// ── Conversations / DMs ──────────────────────────────────────

export async function createConversation(conv: Omit<Conversation, 'id'>): Promise<string> {
  const ref = await withTimeout(addDoc(collection(db, 'conversations'), conv), 8000, 'createConversation');
  return ref.id;
}

export async function getConversations(uid: string): Promise<Conversation[]> {
  const q = query(
    collection(db, 'conversations'),
    where('participants', 'array-contains', uid),
  );
  const snap = await withTimeout(getDocs(q), 8000, 'getConversations');
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() } as Conversation))
    .sort((a, b) => b.lastMessageAt - a.lastMessageAt);
}

export async function getMessages(conversationId: string): Promise<DirectMessage[]> {
  const q = query(
    collection(db, 'conversations', conversationId, 'messages'),
    orderBy('timestamp', 'asc'),
  );
  const snap = await withTimeout(getDocs(q), 8000, 'getMessages');
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as DirectMessage));
}

export async function sendMessage(
  conversationId: string,
  msg: Omit<DirectMessage, 'id'>,
): Promise<string> {
  const ref = await withTimeout(addDoc(
    collection(db, 'conversations', conversationId, 'messages'),
    msg,
  ), 8000, 'sendMessage:add');
  await withTimeout(updateDoc(doc(db, 'conversations', conversationId), {
    lastMessage: msg.text,
    lastMessageAt: msg.timestamp,
  }), 8000, 'sendMessage:update');
  return ref.id;
}

export async function findConversation(uid1: string, uid2: string): Promise<Conversation | null> {
  const q = query(
    collection(db, 'conversations'),
    where('participants', 'array-contains', uid1),
  );
  const snap = await withTimeout(getDocs(q), 8000, 'findConversation');
  const match = snap.docs.find((d) => {
    const data = d.data();
    return data.participants?.includes(uid2);
  });
  return match ? ({ id: match.id, ...match.data() } as Conversation) : null;
}

// ── Employer Notes on Candidates ─────────────────────────────

export async function saveEmployerNote(
  employerUid: string,
  seekerUid: string,
  note: string,
): Promise<void> {
  await withTimeout(setDoc(doc(db, 'employer_bookmarks', employerUid, 'notes', seekerUid), {
    note,
    updatedAt: Date.now(),
  }), 8000, 'saveEmployerNote');
}

export async function getEmployerNote(
  employerUid: string,
  seekerUid: string,
): Promise<string> {
  const snap = await withTimeout(getDoc(doc(db, 'employer_bookmarks', employerUid, 'notes', seekerUid)), 8000, 'getEmployerNote');
  return snap.exists() ? snap.data().note || '' : '';
}
