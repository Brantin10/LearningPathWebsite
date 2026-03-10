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

// ── Backward Compat Helper ──────────────────────────────────────
// Existing users lack role/visibleToEmployers fields — default them safely
function normalizeUser(data: Record<string, any>): AppUser {
  return {
    ...data,
    role: data.role || 'seeker',
    visibleToEmployers: data.visibleToEmployers ?? false,
  } as AppUser;
}

// ── User Profile ────────────────────────────────────────────────

export async function getUser(uid: string): Promise<AppUser | null> {
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? normalizeUser(snap.data()) : null;
}

export async function updateUser(uid: string, data: Partial<AppUser>): Promise<void> {
  await updateDoc(doc(db, 'users', uid), data as Record<string, any>);
}

export function onUserSnapshot(uid: string, callback: (user: AppUser | null) => void): Unsubscribe {
  return onSnapshot(doc(db, 'users', uid), (snap) => {
    callback(snap.exists() ? normalizeUser(snap.data()) : null);
  });
}

// ── Careers ─────────────────────────────────────────────────────

export async function getAllCareers(): Promise<Career[]> {
  const snap = await getDocs(collection(db, 'careers'));
  return snap.docs.map((d) => ({ uid: d.id, ...d.data() } as Career));
}

export async function getCareer(uid: string): Promise<Career | null> {
  const snap = await getDoc(doc(db, 'careers', uid));
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
  await addDoc(ref, {
    answers,
    updatedAt: Date.now(),
  });
}

export async function getLatestAnswers(userUid: string): Promise<Answers | null> {
  const ref = collection(db, 'users', userUid, 'questionnaires');
  const snap = await getDocs(ref);
  if (snap.empty) return null;

  // Get the most recent by updatedAt
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
  await setDoc(doc(db, 'users', userUid, 'learning_paths', careerId), {
    ...pathData,
    generatedAt: Date.now(),
  });
}

export async function getLearningPath(
  userUid: string,
  careerId: string,
): Promise<any | null> {
  const snap = await getDoc(doc(db, 'users', userUid, 'learning_paths', careerId));
  return snap.exists() ? snap.data() : null;
}

// ── Career Progress ─────────────────────────────────────────────

export async function getCompletedSteps(userUid: string, careerId: string): Promise<number[]> {
  const snap = await getDoc(doc(db, 'users', userUid, 'career_progress', careerId));
  return snap.exists() ? (snap.data().completedSteps || []) : [];
}

export async function saveCompletedSteps(
  userUid: string,
  careerId: string,
  completedSteps: number[]
): Promise<void> {
  await setDoc(doc(db, 'users', userUid, 'career_progress', careerId), { completedSteps });
}

// ── Saved Jobs ──────────────────────────────────────────────────

export async function saveJob(uid: string, job: Omit<SavedJob, 'id'>): Promise<string> {
  const ref = await addDoc(collection(db, 'users', uid, 'saved_jobs'), job);
  return ref.id;
}

export async function getSavedJobs(uid: string): Promise<SavedJob[]> {
  const snap = await getDocs(collection(db, 'users', uid, 'saved_jobs'));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as SavedJob));
}

export async function deleteSavedJob(uid: string, jobId: string): Promise<void> {
  await deleteDoc(doc(db, 'users', uid, 'saved_jobs', jobId));
}

// ── Interview Attempts ──────────────────────────────────────────

export async function saveInterviewAttempt(
  uid: string,
  attempt: InterviewAttempt,
): Promise<string> {
  const ref = await addDoc(collection(db, 'users', uid, 'interview_attempts'), attempt);
  return ref.id;
}

export async function getInterviewAttempts(uid: string): Promise<InterviewAttempt[]> {
  const snap = await getDocs(collection(db, 'users', uid, 'interview_attempts'));
  return snap.docs.map((d) => d.data() as InterviewAttempt);
}

// ── Job Applications ────────────────────────────────────────────

export async function addApplication(
  uid: string,
  app: Omit<JobApplication, 'id'>,
): Promise<string> {
  const ref = await addDoc(collection(db, 'users', uid, 'applications'), app);
  return ref.id;
}

export async function getApplications(uid: string): Promise<JobApplication[]> {
  const snap = await getDocs(collection(db, 'users', uid, 'applications'));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as JobApplication));
}

export async function updateApplication(
  uid: string,
  appId: string,
  data: Partial<JobApplication>,
): Promise<void> {
  await updateDoc(doc(db, 'users', uid, 'applications', appId), data as Record<string, any>);
}

export async function deleteApplication(uid: string, appId: string): Promise<void> {
  await deleteDoc(doc(db, 'users', uid, 'applications', appId));
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
  await addDoc(collection(db, 'users', userUid, 'career_progress', careerId, 'activity_log'), activity);
}

export async function getActivityLog(userUid: string, careerId: string): Promise<ActivityLog[]> {
  const snap = await getDocs(
    collection(db, 'users', userUid, 'career_progress', careerId, 'activity_log'),
  );
  return snap.docs.map((d) => d.data() as ActivityLog);
}

// ── Notification Preferences ────────────────────────────────

export async function getNotificationPreferences(uid: string): Promise<NotificationPreferences | null> {
  const snap = await getDoc(doc(db, 'users', uid, 'settings', 'notifications'));
  return snap.exists() ? (snap.data() as NotificationPreferences) : null;
}

export async function saveNotificationPreferences(
  uid: string,
  prefs: NotificationPreferences,
): Promise<void> {
  await setDoc(doc(db, 'users', uid, 'settings', 'notifications'), prefs as Record<string, any>);
}

// ── Resume Data ──────────────────────────────────────────────

export async function getResumeData(uid: string): Promise<ResumeData | null> {
  const snap = await getDoc(doc(db, 'users', uid, 'resume', 'data'));
  return snap.exists() ? (snap.data() as ResumeData) : null;
}

export async function saveResumeData(uid: string, data: ResumeData): Promise<void> {
  await setDoc(doc(db, 'users', uid, 'resume', 'data'), {
    ...data,
    updatedAt: Date.now(),
  } as Record<string, any>);
}

// ── Community Posts ──────────────────────────────────────────

export async function getCommunityPosts(category?: string): Promise<CommunityPost[]> {
  const ref = collection(db, 'community_posts');
  const q = category && category !== 'All'
    ? query(ref, where('category', '==', category), orderBy('createdAt', 'desc'), firestoreLimit(50))
    : query(ref, orderBy('createdAt', 'desc'), firestoreLimit(50));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as CommunityPost));
}

export async function createCommunityPost(post: Omit<CommunityPost, 'id'>): Promise<string> {
  const ref = await addDoc(collection(db, 'community_posts'), post);
  return ref.id;
}

export async function getCommunityPost(postId: string): Promise<CommunityPost | null> {
  const snap = await getDoc(doc(db, 'community_posts', postId));
  return snap.exists() ? ({ id: snap.id, ...snap.data() } as CommunityPost) : null;
}

export async function getPostReplies(postId: string): Promise<CommunityReply[]> {
  const ref = collection(db, 'community_posts', postId, 'replies');
  const q = query(ref, orderBy('createdAt', 'asc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as CommunityReply));
}

export async function addPostReply(postId: string, reply: Omit<CommunityReply, 'id'>): Promise<string> {
  const ref = await addDoc(collection(db, 'community_posts', postId, 'replies'), reply);
  await updateDoc(doc(db, 'community_posts', postId), { replyCount: increment(1) });
  return ref.id;
}

export async function togglePostUpvote(postId: string, uid: string): Promise<void> {
  const postRef = doc(db, 'community_posts', postId);
  const snap = await getDoc(postRef);
  if (!snap.exists()) return;
  const data = snap.data();
  const upvotedBy: string[] = data.upvotedBy || [];
  if (upvotedBy.includes(uid)) {
    await updateDoc(postRef, { upvotes: increment(-1), upvotedBy: upvotedBy.filter((id) => id !== uid) });
  } else {
    await updateDoc(postRef, { upvotes: increment(1), upvotedBy: [...upvotedBy, uid] });
  }
}

export async function toggleReplyUpvote(postId: string, replyId: string, uid: string): Promise<void> {
  const replyRef = doc(db, 'community_posts', postId, 'replies', replyId);
  const snap = await getDoc(replyRef);
  if (!snap.exists()) return;
  const data = snap.data();
  const upvotedBy: string[] = data.upvotedBy || [];
  if (upvotedBy.includes(uid)) {
    await updateDoc(replyRef, { upvotes: increment(-1), upvotedBy: upvotedBy.filter((id) => id !== uid) });
  } else {
    await updateDoc(replyRef, { upvotes: increment(1), upvotedBy: [...upvotedBy, uid] });
  }
}

export async function reportPost(postId: string, uid: string): Promise<void> {
  const postRef = doc(db, 'community_posts', postId);
  const snap = await getDoc(postRef);
  if (!snap.exists()) return;
  const reportedBy: string[] = snap.data().reportedBy || [];
  if (!reportedBy.includes(uid)) {
    await updateDoc(postRef, { reported: true, reportedBy: [...reportedBy, uid] });
  }
}

export async function reportReply(postId: string, replyId: string, uid: string): Promise<void> {
  const replyRef = doc(db, 'community_posts', postId, 'replies', replyId);
  const snap = await getDoc(replyRef);
  if (!snap.exists()) return;
  const reportedBy: string[] = snap.data().reportedBy || [];
  if (!reportedBy.includes(uid)) {
    await updateDoc(replyRef, { reported: true, reportedBy: [...reportedBy, uid] });
  }
}

// ── AI Chat Conversations ──────────────────────────────────────

const MAX_STORED_MESSAGES = 50;

export async function getAIConversation(uid: string): Promise<AIConversation | null> {
  const snap = await getDoc(doc(db, 'users', uid, 'ai_chat', 'conversation'));
  return snap.exists() ? (snap.data() as AIConversation) : null;
}

export async function saveAIConversation(uid: string, messages: ChatMessage[]): Promise<void> {
  const trimmed = messages.slice(-MAX_STORED_MESSAGES);
  await setDoc(doc(db, 'users', uid, 'ai_chat', 'conversation'), {
    messages: trimmed,
    createdAt: trimmed.length > 0 ? trimmed[0].timestamp : Date.now(),
    updatedAt: Date.now(),
  } as Record<string, any>);
}

export async function clearAIConversation(uid: string): Promise<void> {
  await deleteDoc(doc(db, 'users', uid, 'ai_chat', 'conversation'));
}

// ── Daily Actions ─────────────────────────────────────────────────

export async function getDailyActionsPrefs(uid: string): Promise<DailyActionsPrefs> {
  const snap = await getDoc(doc(db, 'users', uid, 'settings', 'daily_actions'));
  return snap.exists() ? (snap.data() as DailyActionsPrefs) : DEFAULT_DAILY_PREFS;
}

export async function saveDailyActionsPrefs(uid: string, prefs: DailyActionsPrefs): Promise<void> {
  await setDoc(doc(db, 'users', uid, 'settings', 'daily_actions'), prefs as Record<string, any>);
}

export async function getDailyActionsState(uid: string): Promise<DailyActionsState | null> {
  const snap = await getDoc(doc(db, 'users', uid, 'daily_actions', 'today'));
  return snap.exists() ? (snap.data() as DailyActionsState) : null;
}

export async function saveDailyActionsState(uid: string, state: DailyActionsState): Promise<void> {
  await setDoc(doc(db, 'users', uid, 'daily_actions', 'today'), {
    ...state,
    updatedAt: Date.now(),
  } as Record<string, any>);
}

// ── Employer / Recruiter ───────────────────────────────────────

export async function getVisibleSeekers(): Promise<CandidateListItem[]> {
  // Single-field query — no composite index needed.
  // Only seekers can enable visibleToEmployers, so role filter is unnecessary.
  const q = query(
    collection(db, 'users'),
    where('visibleToEmployers', '==', true),
  );
  const snap = await getDocs(q);
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
  await setDoc(
    doc(db, 'employer_bookmarks', employerUid, 'saved', bookmark.seekerUid),
    bookmark as Record<string, any>,
  );
}

export async function removeEmployerBookmark(
  employerUid: string,
  seekerUid: string,
): Promise<void> {
  await deleteDoc(doc(db, 'employer_bookmarks', employerUid, 'saved', seekerUid));
}

export async function getEmployerBookmarks(employerUid: string): Promise<EmployerBookmark[]> {
  const snap = await getDocs(collection(db, 'employer_bookmarks', employerUid, 'saved'));
  return snap.docs.map((d) => d.data() as EmployerBookmark);
}

export async function isBookmarked(employerUid: string, seekerUid: string): Promise<boolean> {
  const snap = await getDoc(doc(db, 'employer_bookmarks', employerUid, 'saved', seekerUid));
  return snap.exists();
}

// ── Contact Requests ──────────────────────────────────────────

export async function sendContactRequest(req: Omit<ContactRequest, 'id'>): Promise<string> {
  const ref = await addDoc(collection(db, 'contact_requests'), req);
  return ref.id;
}

export async function getIncomingRequests(uid: string): Promise<ContactRequest[]> {
  const q = query(
    collection(db, 'contact_requests'),
    where('toUid', '==', uid),
  );
  const snap = await getDocs(q);
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() } as ContactRequest))
    .sort((a, b) => b.createdAt - a.createdAt);
}

export async function getOutgoingRequests(uid: string): Promise<ContactRequest[]> {
  const q = query(
    collection(db, 'contact_requests'),
    where('fromUid', '==', uid),
  );
  const snap = await getDocs(q);
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() } as ContactRequest))
    .sort((a, b) => b.createdAt - a.createdAt);
}

export async function respondToRequest(
  requestId: string,
  status: 'accepted' | 'declined',
): Promise<void> {
  await updateDoc(doc(db, 'contact_requests', requestId), {
    status,
    respondedAt: Date.now(),
  });
}

// ── Conversations / DMs ──────────────────────────────────────

export async function createConversation(conv: Omit<Conversation, 'id'>): Promise<string> {
  const ref = await addDoc(collection(db, 'conversations'), conv);
  return ref.id;
}

export async function getConversations(uid: string): Promise<Conversation[]> {
  const q = query(
    collection(db, 'conversations'),
    where('participants', 'array-contains', uid),
  );
  const snap = await getDocs(q);
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() } as Conversation))
    .sort((a, b) => b.lastMessageAt - a.lastMessageAt);
}

export async function getMessages(conversationId: string): Promise<DirectMessage[]> {
  const q = query(
    collection(db, 'conversations', conversationId, 'messages'),
    orderBy('timestamp', 'asc'),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as DirectMessage));
}

export async function sendMessage(
  conversationId: string,
  msg: Omit<DirectMessage, 'id'>,
): Promise<string> {
  const ref = await addDoc(
    collection(db, 'conversations', conversationId, 'messages'),
    msg,
  );
  // Update conversation last message
  await updateDoc(doc(db, 'conversations', conversationId), {
    lastMessage: msg.text,
    lastMessageAt: msg.timestamp,
  });
  return ref.id;
}

export async function findConversation(uid1: string, uid2: string): Promise<Conversation | null> {
  const q = query(
    collection(db, 'conversations'),
    where('participants', 'array-contains', uid1),
  );
  const snap = await getDocs(q);
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
  await setDoc(doc(db, 'employer_bookmarks', employerUid, 'notes', seekerUid), {
    note,
    updatedAt: Date.now(),
  });
}

export async function getEmployerNote(
  employerUid: string,
  seekerUid: string,
): Promise<string> {
  const snap = await getDoc(doc(db, 'employer_bookmarks', employerUid, 'notes', seekerUid));
  return snap.exists() ? snap.data().note || '' : '';
}
