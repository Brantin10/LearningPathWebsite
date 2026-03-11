'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useUser } from '@/hooks/useUser';
import { useToast } from '@/hooks/useToast';
import {
  getResumeData,
  saveResumeData,
  getCareer,
  getCompletedSteps,
  getLearningPath,
} from '@/services/firestore';
import {
  ResumeData,
  ResumeWorkEntry,
  ResumeEducationEntry,
  ResumeCertEntry,
  Career,
} from '@/types';
import Navbar from '@/components/Navbar';
import PageHeader from '@/components/PageHeader';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Input from '@/components/Input';
import TextArea from '@/components/TextArea';
import { PageSkeleton } from '@/components/Skeleton';
import AnimatedPage from '@/components/AnimatedPage';
import ScrollReveal from '@/components/ScrollReveal';

// ── Helpers ──────────────────────────────────────────────────────

function uid(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

const EMPTY_RESUME: ResumeData = {
  contact: {
    fullName: '',
    email: '',
    phone: '',
    location: '',
    linkedIn: '',
    portfolio: '',
  },
  summary: '',
  workExperience: [],
  education: [],
  skills: [],
  certifications: [],
  targetCareer: '',
  learningProgress: '',
  updatedAt: 0,
};

function emptyWork(): ResumeWorkEntry {
  return { id: uid(), company: '', position: '', startDate: '', endDate: '', description: '', highlights: [] };
}

function emptyEdu(): ResumeEducationEntry {
  return { id: uid(), institution: '', degree: '', field: '', startDate: '', endDate: '' };
}

function emptyCert(): ResumeCertEntry {
  return { id: uid(), name: '', issuer: '', date: '' };
}

// ── Section Header ───────────────────────────────────────────────

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-lg font-bold text-accent mb-3 tracking-wide">
      {children}
    </h2>
  );
}

// ── Main Page Component ──────────────────────────────────────────

export default function CVPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { profile } = useUser();
  const toast = useToast();

  const [tab, setTab] = useState<'edit' | 'preview'>('edit');
  const [resume, setResume] = useState<ResumeData>({ ...EMPTY_RESUME });
  const [career, setCareer] = useState<Career | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newSkill, setNewSkill] = useState('');

  // Editing IDs: which work/edu/cert entry is currently being edited inline
  const [editingWorkId, setEditingWorkId] = useState<string | null>(null);
  const [editingEduId, setEditingEduId] = useState<string | null>(null);
  const [editingCertId, setEditingCertId] = useState<string | null>(null);

  const printRef = useRef<HTMLDivElement>(null);
  const initializedRef = useRef(false);

  // ── Load data ────────────────────────────────────────────────

  useEffect(() => {
    if (!user || initializedRef.current) return;
    initializedRef.current = true;

    (async () => {
      try {
        const saved = await getResumeData(user.uid);

        // Load career info
        let careerData: Career | null = null;
        if (profile?.chosenCareer) {
          careerData = await getCareer(profile.chosenCareer);
          setCareer(careerData);
        }

        if (saved) {
          // Use saved resume, but update target career if changed
          setResume({
            ...saved,
            targetCareer: careerData?.name || saved.targetCareer,
          });
        } else {
          // Auto-populate from profile on first load
          let learningProgress = '';
          if (profile?.chosenCareer) {
            try {
              const [completed, pathData] = await Promise.all([
                getCompletedSteps(user.uid, profile.chosenCareer),
                getLearningPath(user.uid, profile.chosenCareer),
              ]);
              const total = pathData?.learning_path?.length || 0;
              if (total > 0) {
                learningProgress = `${completed.length} of ${total} steps completed`;
              }
            } catch {
              // ignore
            }
          }

          const profileSkills = profile?.skills
            ? profile.skills.split(',').map((s: string) => s.trim()).filter(Boolean)
            : [];

          setResume({
            ...EMPTY_RESUME,
            contact: {
              fullName: profile?.username || '',
              email: profile?.email || user.email || '',
              phone: '',
              location: '',
              linkedIn: '',
              portfolio: '',
            },
            skills: profileSkills,
            targetCareer: careerData?.name || '',
            learningProgress,
          });
        }
      } catch (e) {
        console.error('Failed to load resume data', e);
      } finally {
        setLoading(false);
      }
    })();
  }, [user, profile]);

  // ── Update helpers ───────────────────────────────────────────

  const updateContact = useCallback(
    (field: keyof ResumeData['contact'], value: string) => {
      setResume((prev) => ({
        ...prev,
        contact: { ...prev.contact, [field]: value },
      }));
    },
    [],
  );

  // ── Work experience handlers ─────────────────────────────────

  const addWork = () => {
    const entry = emptyWork();
    setResume((prev) => ({
      ...prev,
      workExperience: [...prev.workExperience, entry],
    }));
    setEditingWorkId(entry.id);
  };

  const updateWork = (id: string, field: keyof ResumeWorkEntry, value: string | string[]) => {
    setResume((prev) => ({
      ...prev,
      workExperience: prev.workExperience.map((w) =>
        w.id === id ? { ...w, [field]: value } : w,
      ),
    }));
  };

  const removeWork = (id: string) => {
    if (!window.confirm('Remove this work entry?')) return;
    setResume((prev) => ({
      ...prev,
      workExperience: prev.workExperience.filter((w) => w.id !== id),
    }));
    if (editingWorkId === id) setEditingWorkId(null);
  };

  // ── Education handlers ───────────────────────────────────────

  const addEdu = () => {
    const entry = emptyEdu();
    setResume((prev) => ({
      ...prev,
      education: [...prev.education, entry],
    }));
    setEditingEduId(entry.id);
  };

  const updateEdu = (id: string, field: keyof ResumeEducationEntry, value: string) => {
    setResume((prev) => ({
      ...prev,
      education: prev.education.map((e) =>
        e.id === id ? { ...e, [field]: value } : e,
      ),
    }));
  };

  const removeEdu = (id: string) => {
    if (!window.confirm('Remove this education entry?')) return;
    setResume((prev) => ({
      ...prev,
      education: prev.education.filter((e) => e.id !== id),
    }));
    if (editingEduId === id) setEditingEduId(null);
  };

  // ── Certification handlers ───────────────────────────────────

  const addCert = () => {
    const entry = emptyCert();
    setResume((prev) => ({
      ...prev,
      certifications: [...prev.certifications, entry],
    }));
    setEditingCertId(entry.id);
  };

  const updateCert = (id: string, field: keyof ResumeCertEntry, value: string) => {
    setResume((prev) => ({
      ...prev,
      certifications: prev.certifications.map((c) =>
        c.id === id ? { ...c, [field]: value } : c,
      ),
    }));
  };

  const removeCert = (id: string) => {
    if (!window.confirm('Remove this certification?')) return;
    setResume((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((c) => c.id !== id),
    }));
    if (editingCertId === id) setEditingCertId(null);
  };

  // ── Skills handlers ──────────────────────────────────────────

  const addSkill = () => {
    const trimmed = newSkill.trim();
    if (!trimmed) return;
    if (resume.skills.includes(trimmed)) {
      toast.warning('Skill already added.');
      return;
    }
    setResume((prev) => ({ ...prev, skills: [...prev.skills, trimmed] }));
    setNewSkill('');
  };

  const removeSkill = (skill: string) => {
    setResume((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }));
  };

  // ── Save ─────────────────────────────────────────────────────

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await saveResumeData(user.uid, { ...resume, updatedAt: Date.now() });
      toast.success('Resume saved successfully!');
    } catch (e: any) {
      toast.error(e.message || 'Failed to save resume.');
    } finally {
      setSaving(false);
    }
  };

  // ── Share as text ────────────────────────────────────────────

  const shareAsText = () => {
    const { contact, summary, workExperience, education, skills, certifications, targetCareer, learningProgress } = resume;

    let text = '';
    text += `${contact.fullName}\n`;
    if (contact.email) text += `Email: ${contact.email}\n`;
    if (contact.phone) text += `Phone: ${contact.phone}\n`;
    if (contact.location) text += `Location: ${contact.location}\n`;
    if (contact.linkedIn) text += `LinkedIn: ${contact.linkedIn}\n`;
    if (contact.portfolio) text += `Portfolio: ${contact.portfolio}\n`;
    text += '\n';

    if (targetCareer) {
      text += `TARGET CAREER: ${targetCareer}\n`;
      if (learningProgress) text += `Learning Progress: ${learningProgress}\n`;
      text += '\n';
    }

    if (summary) {
      text += `PROFESSIONAL SUMMARY\n${summary}\n\n`;
    }

    if (workExperience.length > 0) {
      text += 'WORK EXPERIENCE\n';
      workExperience.forEach((w) => {
        text += `${w.position} at ${w.company} (${w.startDate} - ${w.endDate || 'Present'})\n`;
        if (w.description) text += `${w.description}\n`;
        if (w.highlights.length > 0) {
          w.highlights.forEach((h) => { text += `  - ${h}\n`; });
        }
        text += '\n';
      });
    }

    if (education.length > 0) {
      text += 'EDUCATION\n';
      education.forEach((e) => {
        text += `${e.degree} in ${e.field} - ${e.institution} (${e.startDate} - ${e.endDate || 'Present'})\n`;
      });
      text += '\n';
    }

    if (skills.length > 0) {
      text += `SKILLS\n${skills.join(', ')}\n\n`;
    }

    if (certifications.length > 0) {
      text += 'CERTIFICATIONS\n';
      certifications.forEach((c) => {
        text += `${c.name} - ${c.issuer} (${c.date})\n`;
      });
      text += '\n';
    }

    navigator.clipboard.writeText(text.trim()).then(() => {
      toast.info('Resume copied to clipboard!');
    }).catch(() => {
      toast.error('Failed to copy to clipboard.');
    });
  };

  // ── Export PDF via print ─────────────────────────────────────

  const exportPDF = () => {
    const { contact, summary, workExperience, education, skills, certifications, targetCareer, learningProgress } = resume;

    const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>${contact.fullName || 'Resume'}</title>
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;color:#1a1a2e;line-height:1.5;padding:40px 50px;max-width:800px;margin:0 auto}
  h1{font-size:26px;color:#1a1a2e;margin-bottom:4px}
  h2{font-size:14px;text-transform:uppercase;letter-spacing:2px;color:#27ae60;border-bottom:2px solid #27ae60;padding-bottom:4px;margin:20px 0 10px}
  h3{font-size:15px;color:#1a1a2e;margin-bottom:2px}
  .contact-line{font-size:12px;color:#555;margin-bottom:2px}
  .summary{font-size:13px;color:#333;margin-bottom:6px}
  .entry{margin-bottom:12px}
  .entry-title{font-weight:600;font-size:14px}
  .entry-sub{font-size:12px;color:#555;margin-bottom:3px}
  .entry-desc{font-size:13px;color:#333}
  .highlights{margin:4px 0 0 16px;font-size:12px;color:#333}
  .highlights li{margin-bottom:2px}
  .skills-list{display:flex;flex-wrap:wrap;gap:6px;margin-top:4px}
  .skill-chip{background:#e8f5e9;color:#27ae60;padding:3px 10px;border-radius:12px;font-size:12px;font-weight:500}
  .cert-entry{font-size:13px;margin-bottom:4px}
  .career-badge{background:#e8f5e9;color:#27ae60;padding:4px 12px;border-radius:8px;font-size:13px;display:inline-block;margin-bottom:4px}
  .progress-text{font-size:11px;color:#888}
  @media print{body{padding:20px 30px}}
</style></head><body>
<h1>${contact.fullName || 'Your Name'}</h1>
${contact.email ? `<div class="contact-line">${contact.email}${contact.phone ? ' | ' + contact.phone : ''}${contact.location ? ' | ' + contact.location : ''}</div>` : ''}
${contact.linkedIn ? `<div class="contact-line">LinkedIn: ${contact.linkedIn}</div>` : ''}
${contact.portfolio ? `<div class="contact-line">Portfolio: ${contact.portfolio}</div>` : ''}

${targetCareer ? `<h2>Target Career</h2><div class="career-badge">${targetCareer}</div>${learningProgress ? `<div class="progress-text">${learningProgress}</div>` : ''}` : ''}

${summary ? `<h2>Professional Summary</h2><p class="summary">${summary}</p>` : ''}

${workExperience.length > 0 ? `<h2>Work Experience</h2>${workExperience.map((w) => `<div class="entry"><div class="entry-title">${w.position}</div><div class="entry-sub">${w.company} | ${w.startDate} - ${w.endDate || 'Present'}</div>${w.description ? `<div class="entry-desc">${w.description}</div>` : ''}${w.highlights.length > 0 ? `<ul class="highlights">${w.highlights.map((h) => `<li>${h}</li>`).join('')}</ul>` : ''}</div>`).join('')}` : ''}

${education.length > 0 ? `<h2>Education</h2>${education.map((e) => `<div class="entry"><div class="entry-title">${e.degree}${e.field ? ' in ' + e.field : ''}</div><div class="entry-sub">${e.institution} | ${e.startDate} - ${e.endDate || 'Present'}</div></div>`).join('')}` : ''}

${skills.length > 0 ? `<h2>Skills</h2><div class="skills-list">${skills.map((s) => `<span class="skill-chip">${s}</span>`).join('')}</div>` : ''}

${certifications.length > 0 ? `<h2>Certifications</h2>${certifications.map((c) => `<div class="cert-entry"><strong>${c.name}</strong> - ${c.issuer}${c.date ? ' (' + c.date + ')' : ''}</div>`).join('')}` : ''}
</body></html>`;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(html);
      printWindow.document.close();
      // Allow rendering before print dialog
      setTimeout(() => {
        printWindow.print();
      }, 500);
    } else {
      toast.error('Could not open print window. Please allow popups for this site.');
    }
  };

  // ── Auth guard ───────────────────────────────────────────────

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-bg to-bg-elevated">
        <Navbar />
        <AnimatedPage>
          <main className="max-w-3xl mx-auto px-5 pt-4 pb-10">
            <PageSkeleton />
          </main>
        </AnimatedPage>
      </div>
    );
  }

  if (!user) {
    router.push('/login');
    return null;
  }

  // ── Render ───────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gradient-to-b from-bg to-bg-elevated">
      <Navbar />
      <AnimatedPage>
        <main className="max-w-3xl mx-auto px-5 pt-4 pb-10">
          <PageHeader title="Resume Builder" subtitle="Create and export your professional resume" />

        {/* ── Tab Bar ────────────────────────────────────────── */}
        <div className="flex gap-2 mb-6">
          {(['edit', 'preview'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                tab === t
                  ? 'bg-primary text-white'
                  : 'glass-card text-text-secondary hover:text-text-primary'
              }`}
            >
              {t === 'edit' ? 'Edit' : 'Preview'}
            </button>
          ))}
        </div>

        {/* ── Action Buttons ────────────────────────────────── */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={shareAsText}
            className="flex-1 py-2 rounded-xl text-xs font-semibold glass-card text-text-secondary hover:text-text-primary transition-colors"
          >
            Copy as Text
          </button>
          <button
            onClick={exportPDF}
            className="flex-1 py-2 rounded-xl text-xs font-semibold glass-card text-text-secondary hover:text-text-primary transition-colors"
          >
            Export PDF
          </button>
        </div>

        {/* ═════════════════════════════════════════════════════
            EDIT MODE
           ═════════════════════════════════════════════════════ */}
        {tab === 'edit' && (
          <div className="space-y-6">
            {/* ── Contact Info ─────────────────────────────── */}
            <ScrollReveal>
            <Card>
              <SectionTitle>Contact Information</SectionTitle>
              <Input
                label="Full Name"
                placeholder="John Doe"
                value={resume.contact.fullName}
                onChange={(e) => updateContact('fullName', e.target.value)}
              />
              <Input
                label="Email"
                type="email"
                placeholder="john@example.com"
                value={resume.contact.email}
                onChange={(e) => updateContact('email', e.target.value)}
              />
              <Input
                label="Phone"
                type="tel"
                placeholder="+1 (555) 123-4567"
                value={resume.contact.phone}
                onChange={(e) => updateContact('phone', e.target.value)}
              />
              <Input
                label="Location"
                placeholder="New York, NY"
                value={resume.contact.location}
                onChange={(e) => updateContact('location', e.target.value)}
              />
              <Input
                label="LinkedIn"
                placeholder="linkedin.com/in/johndoe"
                value={resume.contact.linkedIn}
                onChange={(e) => updateContact('linkedIn', e.target.value)}
              />
              <Input
                label="Portfolio"
                placeholder="johndoe.dev"
                value={resume.contact.portfolio}
                onChange={(e) => updateContact('portfolio', e.target.value)}
              />
            </Card>
            </ScrollReveal>

            {/* ── Target Career ────────────────────────────── */}
            {resume.targetCareer && (
              <ScrollReveal delay={0.1}>
              <Card>
                <SectionTitle>Target Career</SectionTitle>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="bg-primary-muted text-primary rounded-full px-4 py-1.5 text-sm font-semibold">
                    {resume.targetCareer}
                  </span>
                  {resume.learningProgress && (
                    <span className="text-xs text-text-secondary">
                      {resume.learningProgress}
                    </span>
                  )}
                </div>
              </Card>
              </ScrollReveal>
            )}

            {/* ── Professional Summary ─────────────────────── */}
            <ScrollReveal delay={0.2}>
            <Card>
              <SectionTitle>Professional Summary</SectionTitle>
              <TextArea
                placeholder="Brief overview of your professional background, key strengths, and career objectives..."
                value={resume.summary}
                onChange={(e) => setResume((prev) => ({ ...prev, summary: e.target.value }))}
                rows={5}
              />
            </Card>
            </ScrollReveal>

            {/* ── Work Experience ──────────────────────────── */}
            <ScrollReveal delay={0.3}>
            <Card>
              <SectionTitle>Work Experience</SectionTitle>
              {resume.workExperience.length === 0 && (
                <p className="text-text-muted text-sm mb-3">No work entries yet.</p>
              )}
              <div className="space-y-4">
                {resume.workExperience.map((w) => (
                  <div key={w.id} className="border border-border-light rounded-xl p-4">
                    {editingWorkId === w.id ? (
                      /* ── Inline Edit Form ── */
                      <div className="space-y-3">
                        <Input
                          label="Position"
                          placeholder="Software Engineer"
                          value={w.position}
                          onChange={(e) => updateWork(w.id, 'position', e.target.value)}
                          containerClassName="!mb-2"
                        />
                        <Input
                          label="Company"
                          placeholder="Acme Corp"
                          value={w.company}
                          onChange={(e) => updateWork(w.id, 'company', e.target.value)}
                          containerClassName="!mb-2"
                        />
                        <div className="grid grid-cols-2 gap-3">
                          <Input
                            label="Start Date"
                            placeholder="Jan 2022"
                            value={w.startDate}
                            onChange={(e) => updateWork(w.id, 'startDate', e.target.value)}
                            containerClassName="!mb-2"
                          />
                          <Input
                            label="End Date"
                            placeholder="Present"
                            value={w.endDate}
                            onChange={(e) => updateWork(w.id, 'endDate', e.target.value)}
                            containerClassName="!mb-2"
                          />
                        </div>
                        <TextArea
                          label="Description"
                          placeholder="Describe your responsibilities..."
                          value={w.description}
                          onChange={(e) => updateWork(w.id, 'description', e.target.value)}
                          rows={3}
                          containerClassName="!mb-2"
                        />
                        <TextArea
                          label="Highlights (one per line)"
                          placeholder="Led a team of 5 engineers&#10;Increased revenue by 20%"
                          value={w.highlights.join('\n')}
                          onChange={(e) =>
                            updateWork(
                              w.id,
                              'highlights',
                              e.target.value.split('\n').filter((h) => h.trim()),
                            )
                          }
                          rows={3}
                          containerClassName="!mb-2"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => setEditingWorkId(null)}
                            className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-primary text-white hover:bg-primary-dark transition-colors"
                          >
                            Done
                          </button>
                          <button
                            onClick={() => removeWork(w.id)}
                            className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-error-muted text-error hover:bg-[rgba(255,107,107,0.25)] transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* ── Display View ── */
                      <div
                        className="cursor-pointer"
                        onClick={() => setEditingWorkId(w.id)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-sm font-semibold text-text-primary">
                              {w.position || 'Untitled Position'}
                            </h3>
                            <p className="text-xs text-text-secondary">
                              {w.company || 'Company'} | {w.startDate || '...'} - {w.endDate || 'Present'}
                            </p>
                          </div>
                          <div className="flex gap-1">
                            <button
                              onClick={(e) => { e.stopPropagation(); setEditingWorkId(w.id); }}
                              className="text-xs text-primary hover:text-primary-dark px-2 py-1"
                            >
                              Edit
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); removeWork(w.id); }}
                              className="text-xs text-error hover:text-[#ff4040] px-2 py-1"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                        {w.description && (
                          <p className="text-xs text-text-muted mt-1 line-clamp-2">{w.description}</p>
                        )}
                        {w.highlights.length > 0 && (
                          <ul className="mt-1 list-disc list-inside text-xs text-text-muted">
                            {w.highlights.slice(0, 3).map((h, i) => (
                              <li key={i}>{h}</li>
                            ))}
                            {w.highlights.length > 3 && (
                              <li className="text-text-secondary">+{w.highlights.length - 3} more</li>
                            )}
                          </ul>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <button
                onClick={addWork}
                className="mt-3 w-full py-2.5 rounded-xl text-sm font-semibold border border-dashed border-border-light text-primary hover:bg-primary-muted transition-colors"
              >
                + Add Work Experience
              </button>
            </Card>
            </ScrollReveal>

            {/* ── Education ────────────────────────────────── */}
            <ScrollReveal delay={0.4}>
            <Card>
              <SectionTitle>Education</SectionTitle>
              {resume.education.length === 0 && (
                <p className="text-text-muted text-sm mb-3">No education entries yet.</p>
              )}
              <div className="space-y-4">
                {resume.education.map((e) => (
                  <div key={e.id} className="border border-border-light rounded-xl p-4">
                    {editingEduId === e.id ? (
                      <div className="space-y-3">
                        <Input
                          label="Institution"
                          placeholder="MIT"
                          value={e.institution}
                          onChange={(ev) => updateEdu(e.id, 'institution', ev.target.value)}
                          containerClassName="!mb-2"
                        />
                        <Input
                          label="Degree"
                          placeholder="Bachelor of Science"
                          value={e.degree}
                          onChange={(ev) => updateEdu(e.id, 'degree', ev.target.value)}
                          containerClassName="!mb-2"
                        />
                        <Input
                          label="Field of Study"
                          placeholder="Computer Science"
                          value={e.field}
                          onChange={(ev) => updateEdu(e.id, 'field', ev.target.value)}
                          containerClassName="!mb-2"
                        />
                        <div className="grid grid-cols-2 gap-3">
                          <Input
                            label="Start Date"
                            placeholder="Sep 2018"
                            value={e.startDate}
                            onChange={(ev) => updateEdu(e.id, 'startDate', ev.target.value)}
                            containerClassName="!mb-2"
                          />
                          <Input
                            label="End Date"
                            placeholder="Jun 2022"
                            value={e.endDate}
                            onChange={(ev) => updateEdu(e.id, 'endDate', ev.target.value)}
                            containerClassName="!mb-2"
                          />
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setEditingEduId(null)}
                            className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-primary text-white hover:bg-primary-dark transition-colors"
                          >
                            Done
                          </button>
                          <button
                            onClick={() => removeEdu(e.id)}
                            className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-error-muted text-error hover:bg-[rgba(255,107,107,0.25)] transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div
                        className="cursor-pointer"
                        onClick={() => setEditingEduId(e.id)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-sm font-semibold text-text-primary">
                              {e.degree || 'Degree'}{e.field ? ` in ${e.field}` : ''}
                            </h3>
                            <p className="text-xs text-text-secondary">
                              {e.institution || 'Institution'} | {e.startDate || '...'} - {e.endDate || 'Present'}
                            </p>
                          </div>
                          <div className="flex gap-1">
                            <button
                              onClick={(ev) => { ev.stopPropagation(); setEditingEduId(e.id); }}
                              className="text-xs text-primary hover:text-primary-dark px-2 py-1"
                            >
                              Edit
                            </button>
                            <button
                              onClick={(ev) => { ev.stopPropagation(); removeEdu(e.id); }}
                              className="text-xs text-error hover:text-[#ff4040] px-2 py-1"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <button
                onClick={addEdu}
                className="mt-3 w-full py-2.5 rounded-xl text-sm font-semibold border border-dashed border-border-light text-primary hover:bg-primary-muted transition-colors"
              >
                + Add Education
              </button>
            </Card>
            </ScrollReveal>

            {/* ── Skills ───────────────────────────────────── */}
            <ScrollReveal delay={0.5}>
            <Card>
              <SectionTitle>Skills</SectionTitle>
              <div className="flex flex-wrap gap-2 mb-3">
                {resume.skills.map((skill) => (
                  <span
                    key={skill}
                    className="bg-primary-muted text-primary rounded-full px-3 py-1 text-sm font-medium flex items-center gap-1.5"
                  >
                    {skill}
                    <button
                      onClick={() => removeSkill(skill)}
                      className="text-primary hover:text-error text-base leading-none ml-0.5"
                      title="Remove skill"
                    >
                      x
                    </button>
                  </span>
                ))}
                {resume.skills.length === 0 && (
                  <p className="text-text-muted text-sm">No skills added yet.</p>
                )}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add a skill..."
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } }}
                  className="flex-1 text-sm py-2.5 px-4 rounded-xl text-text-primary glass-input placeholder:text-text-muted"
                />
                <button
                  onClick={addSkill}
                  className="px-4 py-2.5 rounded-xl text-sm font-semibold bg-primary text-white hover:bg-primary-dark transition-colors"
                >
                  Add
                </button>
              </div>
            </Card>
            </ScrollReveal>

            {/* ── Certifications ──────────────────────────── */}
            <ScrollReveal delay={0.6}>
            <Card>
              <SectionTitle>Certifications</SectionTitle>
              {resume.certifications.length === 0 && (
                <p className="text-text-muted text-sm mb-3">No certifications added yet.</p>
              )}
              <div className="space-y-4">
                {resume.certifications.map((c) => (
                  <div key={c.id} className="border border-border-light rounded-xl p-4">
                    {editingCertId === c.id ? (
                      <div className="space-y-3">
                        <Input
                          label="Certification Name"
                          placeholder="AWS Solutions Architect"
                          value={c.name}
                          onChange={(e) => updateCert(c.id, 'name', e.target.value)}
                          containerClassName="!mb-2"
                        />
                        <Input
                          label="Issuer"
                          placeholder="Amazon Web Services"
                          value={c.issuer}
                          onChange={(e) => updateCert(c.id, 'issuer', e.target.value)}
                          containerClassName="!mb-2"
                        />
                        <Input
                          label="Date"
                          placeholder="Mar 2024"
                          value={c.date}
                          onChange={(e) => updateCert(c.id, 'date', e.target.value)}
                          containerClassName="!mb-2"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => setEditingCertId(null)}
                            className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-primary text-white hover:bg-primary-dark transition-colors"
                          >
                            Done
                          </button>
                          <button
                            onClick={() => removeCert(c.id)}
                            className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-error-muted text-error hover:bg-[rgba(255,107,107,0.25)] transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div
                        className="cursor-pointer"
                        onClick={() => setEditingCertId(c.id)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-sm font-semibold text-text-primary">
                              {c.name || 'Certification Name'}
                            </h3>
                            <p className="text-xs text-text-secondary">
                              {c.issuer || 'Issuer'}{c.date ? ` | ${c.date}` : ''}
                            </p>
                          </div>
                          <div className="flex gap-1">
                            <button
                              onClick={(e) => { e.stopPropagation(); setEditingCertId(c.id); }}
                              className="text-xs text-primary hover:text-primary-dark px-2 py-1"
                            >
                              Edit
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); removeCert(c.id); }}
                              className="text-xs text-error hover:text-[#ff4040] px-2 py-1"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <button
                onClick={addCert}
                className="mt-3 w-full py-2.5 rounded-xl text-sm font-semibold border border-dashed border-border-light text-primary hover:bg-primary-muted transition-colors"
              >
                + Add Certification
              </button>
            </Card>
            </ScrollReveal>

            {/* ── Save Button ──────────────────────────────── */}
            <Button
              title="Save Resume"
              onPress={handleSave}
              loading={saving}
              className="w-full"
            />
          </div>
        )}

        {/* ═════════════════════════════════════════════════════
            PREVIEW MODE
           ═════════════════════════════════════════════════════ */}
        {tab === 'preview' && (
          <div ref={printRef} className="space-y-6">
            {/* ── Contact Header ──────────────────────────── */}
            <Card>
              <h2 className="text-xl font-bold text-text-primary mb-1">
                {resume.contact.fullName || 'Your Name'}
              </h2>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-text-secondary">
                {resume.contact.email && <span>{resume.contact.email}</span>}
                {resume.contact.phone && <span>{resume.contact.phone}</span>}
                {resume.contact.location && <span>{resume.contact.location}</span>}
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-primary mt-1">
                {resume.contact.linkedIn && <span>{resume.contact.linkedIn}</span>}
                {resume.contact.portfolio && <span>{resume.contact.portfolio}</span>}
              </div>
            </Card>

            {/* ── Target Career ────────────────────────────── */}
            {resume.targetCareer && (
              <Card>
                <SectionTitle>Target Career</SectionTitle>
                <span className="bg-primary-muted text-primary rounded-full px-4 py-1.5 text-sm font-semibold inline-block">
                  {resume.targetCareer}
                </span>
                {resume.learningProgress && (
                  <p className="text-xs text-text-secondary mt-2">{resume.learningProgress}</p>
                )}
              </Card>
            )}

            {/* ── Professional Summary ─────────────────────── */}
            {resume.summary && (
              <Card>
                <SectionTitle>Professional Summary</SectionTitle>
                <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-wrap">
                  {resume.summary}
                </p>
              </Card>
            )}

            {/* ── Work Experience ──────────────────────────── */}
            {resume.workExperience.length > 0 && (
              <Card>
                <SectionTitle>Work Experience</SectionTitle>
                <div className="space-y-5">
                  {resume.workExperience.map((w, idx) => (
                    <div key={w.id}>
                      {idx > 0 && <div className="border-t border-border-light mb-4" />}
                      <h3 className="text-sm font-bold text-text-primary">{w.position}</h3>
                      <p className="text-xs text-primary font-medium">{w.company}</p>
                      <p className="text-xs text-text-muted mb-2">
                        {w.startDate} - {w.endDate || 'Present'}
                      </p>
                      {w.description && (
                        <p className="text-sm text-text-secondary mb-1">{w.description}</p>
                      )}
                      {w.highlights.length > 0 && (
                        <ul className="list-disc list-inside text-sm text-text-secondary space-y-0.5">
                          {w.highlights.map((h, i) => (
                            <li key={i}>{h}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* ── Education ────────────────────────────────── */}
            {resume.education.length > 0 && (
              <Card>
                <SectionTitle>Education</SectionTitle>
                <div className="space-y-4">
                  {resume.education.map((e, idx) => (
                    <div key={e.id}>
                      {idx > 0 && <div className="border-t border-border-light mb-3" />}
                      <h3 className="text-sm font-bold text-text-primary">
                        {e.degree}{e.field ? ` in ${e.field}` : ''}
                      </h3>
                      <p className="text-xs text-primary font-medium">{e.institution}</p>
                      <p className="text-xs text-text-muted">
                        {e.startDate} - {e.endDate || 'Present'}
                      </p>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* ── Skills ───────────────────────────────────── */}
            {resume.skills.length > 0 && (
              <Card>
                <SectionTitle>Skills</SectionTitle>
                <div className="flex flex-wrap gap-2">
                  {resume.skills.map((skill) => (
                    <span
                      key={skill}
                      className="bg-primary-muted text-primary rounded-full px-3 py-1 text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </Card>
            )}

            {/* ── Certifications ──────────────────────────── */}
            {resume.certifications.length > 0 && (
              <Card>
                <SectionTitle>Certifications</SectionTitle>
                <div className="space-y-3">
                  {resume.certifications.map((c, idx) => (
                    <div key={c.id}>
                      {idx > 0 && <div className="border-t border-border-light mb-3" />}
                      <h3 className="text-sm font-bold text-text-primary">{c.name}</h3>
                      <p className="text-xs text-text-secondary">
                        {c.issuer}{c.date ? ` | ${c.date}` : ''}
                      </p>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* ── Empty State ──────────────────────────────── */}
            {!resume.summary &&
              resume.workExperience.length === 0 &&
              resume.education.length === 0 &&
              resume.skills.length === 0 &&
              resume.certifications.length === 0 && (
                <Card>
                  <p className="text-text-secondary text-center py-8">
                    Your resume is empty. Switch to the Edit tab to start building it.
                  </p>
                </Card>
              )}
          </div>
        )}
      </main>
      </AnimatedPage>
    </div>
  );
}
