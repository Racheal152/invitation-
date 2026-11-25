import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Users,
  CheckCircle2,
  XCircle,
  Download,
  Trash2,
  LogOut,
  Lock,
  Loader2,
  Mail,
} from 'lucide-react';
import { onAuthStateChanged, signInWithPopup, signOut, type User } from 'firebase/auth';
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  type Timestamp,
} from 'firebase/firestore';
import { auth, db, googleProvider, HOST_EMAIL, handleFirestoreError, OperationType } from '../firebase';
import type { Language } from '../data/invitationContent';

interface FirestoreRsvpItem {
  id: string;
  fullName: string;
  email: string;
  attending: 'accept' | 'decline';
  guests: number;
  message: string;
  language: string;
  createdAt?: Timestamp | null;
}

interface HostRsvpModalProps {
  open: boolean;
  onClose: () => void;
  lang: Language;
}

type FilterTab = 'all' | 'accept' | 'decline';

export function HostRsvpModal({ open, onClose, lang }: HostRsvpModalProps) {
  const [authReady, setAuthReady] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [rsvps, setRsvps] = useState<FirestoreRsvpItem[]>([]);
  const [loadingList, setLoadingList] = useState(false);
  const [listError, setListError] = useState('');
  const [filter, setFilter] = useState<FilterTab>('all');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const isSw = lang === 'sw';

  const isVerifiedHost = Boolean(
    user &&
      user.email?.toLowerCase() === HOST_EMAIL.toLowerCase() &&
      user.emailVerified
  );

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      setAuthReady(true);
    });
    return () => unsubscribe();
  }, []);

  // Only attach real-time Firestore listener when modal is open, auth is ready, and user is verified host
  useEffect(() => {
    if (!open || !authReady || !isVerifiedHost) {
      setRsvps([]);
      setLoadingList(false);
      return;
    }

    setLoadingList(true);
    setListError('');
    const rsvpsPath = 'rsvps';
    const q = query(collection(db, rsvpsPath), orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const items: FirestoreRsvpItem[] = snapshot.docs.map((docSnap) => {
          const data = docSnap.data();
          return {
            id: docSnap.id,
            fullName: String(data.fullName ?? ''),
            email: String(data.email ?? ''),
            attending: data.attending === 'decline' ? 'decline' : 'accept',
            guests: typeof data.guests === 'number' ? data.guests : 0,
            message: String(data.message ?? ''),
            language: String(data.language ?? 'en'),
            createdAt: (data.createdAt as Timestamp | null) ?? null,
          };
        });
        setRsvps(items);
        setLoadingList(false);
      },
      (error) => {
        setLoadingList(false);
        setListError(
          isSw
            ? 'Imeshindikana kupakia orodha ya majibu kwa sasa.'
            : 'Unable to load RSVP responses right now.'
        );
        try {
          handleFirestoreError(error, OperationType.LIST, rsvpsPath);
        } catch {
          // Structured error already logged by handleFirestoreError
        }
      }
    );

    return () => unsubscribe();
  }, [open, authReady, isVerifiedHost, isSw]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  const handleGoogleSignIn = async () => {
    setAuthLoading(true);
    setAuthError('');
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      const code = (error as { code?: string })?.code;
      if (code !== 'auth/popup-closed-by-user') {
        setAuthError(
          isSw
            ? 'Imeshindikana kuingia kupitia Google. Tafadhali jaribu tena.'
            : 'Google sign-in could not be completed. Please try again.'
        );
      }
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setRsvps([]);
    } catch {
      // Ignore sign-out errors
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    const path = `rsvps/${id}`;
    try {
      await deleteDoc(doc(db, 'rsvps', id));
      setConfirmDeleteId(null);
    } catch (error) {
      setListError(
        isSw ? 'Imeshindikana kufuta jibu hilo.' : 'Could not delete that response.'
      );
      try {
        handleFirestoreError(error, OperationType.DELETE, path);
      } catch {
        // Logged
      }
    } finally {
      setDeletingId(null);
    }
  };

  const handleExportCsv = () => {
    const headers = ['Full Name', 'Email', 'Status', 'Guests', 'Message', 'Submitted At'];
    const escapeCell = (val: string | number) => {
      const str = String(val ?? '').replace(/"/g, '""');
      return `"${str}"`;
    };
    const rows = rsvps.map((r) => [
      escapeCell(r.fullName),
      escapeCell(r.email),
      escapeCell(r.attending === 'accept' ? 'Attending' : 'Declined'),
      escapeCell(r.guests),
      escapeCell(r.message),
      escapeCell(r.createdAt ? r.createdAt.toDate().toISOString() : ''),
    ]);
    const csv = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'racheal-kache-2026-rsvps.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const stats = useMemo(() => {
    const accepting = rsvps.filter((r) => r.attending === 'accept');
    const declining = rsvps.filter((r) => r.attending === 'decline');
    const totalGuests = accepting.reduce((sum, r) => sum + (r.guests || 0), 0);
    return {
      totalResponses: rsvps.length,
      acceptingCount: accepting.length,
      decliningCount: declining.length,
      totalGuests,
    };
  }, [rsvps]);

  const filtered = useMemo(() => {
    if (filter === 'all') return rsvps;
    return rsvps.filter((r) => r.attending === filter);
  }, [rsvps, filter]);

  const formatDate = (ts?: Timestamp | null) => {
    if (!ts) return isSw ? 'Sasa hivi' : 'Just now';
    try {
      return ts.toDate().toLocaleDateString(isSw ? 'sw-KE' : 'en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return '';
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
          className="fixed inset-0 z-50 bg-[#2F2426]/45 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label={isSw ? 'Orodha ya Majibu ya RSVP' : 'Host RSVP Guest List'}
        >
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl max-h-[86vh] flex flex-col rounded-2xl bg-[#FDFBF9] border border-[#EFE0E3] shadow-[0_24px_64px_rgba(68,40,46,0.22)] overflow-hidden"
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-[#F0E3E5] flex items-center justify-between gap-3 bg-[#FAF5F6]/70">
              <div>
                <p className="text-[10px] tracking-[0.26em] uppercase text-[#C47483]">
                  {isSw ? 'UKURASA WA MWENYEJI · RACHEAL KACHE' : 'HOST VIEW · RACHEAL KACHE'}
                </p>
                <h3 className="font-serif-editorial text-xl sm:text-2xl text-[#352E2D]">
                  {isSw ? 'Orodha ya Wageni na Salamu' : 'Guest RSVP List & Wishes'}
                </h3>
              </div>
              <div className="flex items-center gap-1.5">
                {user && (
                  <button
                    type="button"
                    onClick={handleSignOut}
                    title={isSw ? 'Ondoka' : 'Sign out'}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-[#EAD7DB] bg-white px-2.5 py-1.5 text-[11px] text-[#7A6367] hover:text-[#B85063] hover:border-[#C96476] transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">
                      {isSw ? 'Ondoka' : 'Sign out'}
                    </span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={onClose}
                  aria-label={isSw ? 'Funga' : 'Close'}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-[#8B767A] hover:text-[#352E2D] hover:bg-[#F3E6E9] transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-6 py-5">
              {!authReady ? (
                <div className="py-12 flex flex-col items-center justify-center text-[#8C7A7D]">
                  <Loader2 className="w-5 h-5 animate-spin text-[#C96476]" />
                </div>
              ) : !user ? (
                <div className="py-8 text-center max-w-sm mx-auto">
                  <div className="mx-auto w-11 h-11 rounded-full bg-[#FBF0F2] flex items-center justify-center text-[#C86E7D]">
                    <Lock className="w-5 h-5" />
                  </div>
                  <h4 className="mt-4 font-serif-editorial text-xl text-[#352E2D]">
                    {isSw ? 'Ufikiaji Binafsi wa Mwenyeji' : 'Private Host Access'}
                  </h4>
                  <p className="mt-2 text-xs sm:text-[13px] text-[#6E615F] leading-relaxed">
                    {isSw
                      ? `Ingia kwa akaunti ya Google ya Racheal (${HOST_EMAIL}) ili kutazama majibu ya RSVP, idadi ya wageni, na salamu za pongezi.`
                      : `Sign in with Racheal's Google account (${HOST_EMAIL}) to view live guest RSVPs, headcounts, and congratulatory wishes.`}
                  </p>
                  {authError && (
                    <p className="mt-3 text-xs text-[#B3394D] font-medium">{authError}</p>
                  )}
                  <button
                    type="button"
                    disabled={authLoading}
                    onClick={handleGoogleSignIn}
                    className="mt-5 inline-flex items-center justify-center gap-2 rounded-lg bg-[#C96476] hover:bg-[#B85466] disabled:opacity-60 px-5 py-2.5 text-xs font-medium tracking-wider uppercase text-white shadow-sm transition-colors cursor-pointer"
                  >
                    {authLoading ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Users className="w-3.5 h-3.5" />
                    )}
                    <span>
                      {isSw ? 'Ingia kwa Google (Mwenyeji)' : 'Sign in with Google'}
                    </span>
                  </button>
                </div>
              ) : !isVerifiedHost ? (
                <div className="py-8 text-center max-w-sm mx-auto">
                  <div className="mx-auto w-11 h-11 rounded-full bg-[#FBF0F2] flex items-center justify-center text-[#C86E7D]">
                    <Lock className="w-5 h-5" />
                  </div>
                  <h4 className="mt-4 font-serif-editorial text-xl text-[#352E2D]">
                    {isSw ? 'Kwa Akaunti ya Mwenyeji Pekee' : 'Restricted to Host Account'}
                  </h4>
                  <p className="mt-2 text-xs sm:text-[13px] text-[#6E615F] leading-relaxed">
                    {isSw
                      ? `Umeingia kama ${user.email}. Ili kulinda faragha ya wageni, ni ${HOST_EMAIL} pekee anayeweza kuona orodha kamili ya RSVP.`
                      : `Signed in as ${user.email}. To protect guest privacy, only ${HOST_EMAIL} can view the full RSVP list.`}
                  </p>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="mt-5 inline-flex items-center justify-center gap-2 rounded-lg border border-[#E5CCD1] bg-white px-4 py-2 text-xs font-medium text-[#6C5458] hover:border-[#C96476] hover:text-[#B85063] transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>{isSw ? 'Badili Akaunti' : 'Switch Account'}</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-5">
                  {/* Live KPI Summary Grid */}
                  <div className="grid grid-cols-3 gap-2.5">
                    <div className="rounded-xl bg-[#FAF6F4] border border-[#F0E3E4] p-3.5 text-center">
                      <p className="text-[10px] tracking-[0.2em] uppercase text-[#9A8588]">
                        {isSw ? 'Wageni' : 'Headcount'}
                      </p>
                      <p className="mt-1 font-serif-editorial text-2xl sm:text-3xl text-[#C56375] tabular-nums">
                        {stats.totalGuests}
                      </p>
                    </div>
                    <div className="rounded-xl bg-[#FAF6F4] border border-[#F0E3E4] p-3.5 text-center">
                      <p className="text-[10px] tracking-[0.2em] uppercase text-[#9A8588]">
                        {isSw ? 'Watakuja' : 'Accepted'}
                      </p>
                      <p className="mt-1 font-serif-editorial text-2xl sm:text-3xl text-[#352E2D] tabular-nums">
                        {stats.acceptingCount}
                      </p>
                    </div>
                    <div className="rounded-xl bg-[#FAF6F4] border border-[#F0E3E4] p-3.5 text-center">
                      <p className="text-[10px] tracking-[0.2em] uppercase text-[#9A8588]">
                        {isSw ? 'Hawatakuja' : 'Declined'}
                      </p>
                      <p className="mt-1 font-serif-editorial text-2xl sm:text-3xl text-[#7D6C6A] tabular-nums">
                        {stats.decliningCount}
                      </p>
                    </div>
                  </div>

                  {/* Filter Tabs + CSV Export */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#EFE2E4] pb-2.5">
                    <div className="flex items-center gap-4 text-xs">
                      {(
                        [
                          ['all', isSw ? `Wote (${stats.totalResponses})` : `All (${stats.totalResponses})`],
                          ['accept', isSw ? `Watakuja (${stats.acceptingCount})` : `Attending (${stats.acceptingCount})`],
                          ['decline', isSw ? `Hawatakuja (${stats.decliningCount})` : `Declined (${stats.decliningCount})`],
                        ] as const
                      ).map(([tab, label]) => (
                        <button
                          key={tab}
                          type="button"
                          onClick={() => setFilter(tab)}
                          className={`pb-1 transition-colors cursor-pointer border-b-2 ${
                            filter === tab
                              ? 'border-[#C96476] text-[#C56375] font-medium'
                              : 'border-transparent text-[#857275] hover:text-[#352E2D]'
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>

                    {rsvps.length > 0 && (
                      <button
                        type="button"
                        onClick={handleExportCsv}
                        className="inline-flex items-center gap-1.5 text-xs text-[#C56375] hover:text-[#A9495B] font-medium transition-colors cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>{isSw ? 'Pakua CSV' : 'Export CSV'}</span>
                      </button>
                    )}
                  </div>

                  {listError && (
                    <p className="text-xs text-[#B3394D] font-medium">{listError}</p>
                  )}

                  {loadingList ? (
                    <div className="py-10 flex items-center justify-center">
                      <Loader2 className="w-5 h-5 animate-spin text-[#C96476]" />
                    </div>
                  ) : filtered.length === 0 ? (
                    <div className="py-10 text-center">
                      <p className="font-serif-editorial italic text-base text-[#7E6D6B]">
                        {isSw
                          ? 'Bado hakuna majibu ya RSVP — wageni wakijibu, yataonekana hapa moja kwa moja.'
                          : 'No RSVP responses yet — as guests reply, they will appear here live.'}
                      </p>
                    </div>
                  ) : (
                    <ul className="space-y-3">
                      {filtered.map((item) => (
                        <li
                          key={item.id}
                          className="rounded-xl bg-[#FAF6F4] border border-[#F0E3E4] p-4 text-left"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-serif-editorial text-lg text-[#352E2D] leading-snug">
                                  {item.fullName}
                                </span>
                                {item.attending === 'accept' ? (
                                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#4D7A58]">
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    {isSw
                                      ? `${item.guests === 1 ? 'Mgeni 1' : `Wageni ${item.guests}`}`
                                      : `${item.guests} ${item.guests === 1 ? 'guest' : 'guests'}`}
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#9A7A7F]">
                                    <XCircle className="w-3.5 h-3.5" />
                                    {isSw ? 'Hatahudhuria' : 'Declined'}
                                  </span>
                                )}
                              </div>
                              <a
                                href={`mailto:${item.email}`}
                                className="mt-0.5 inline-flex items-center gap-1.5 text-xs text-[#8A7578] hover:text-[#C56375] transition-colors break-all"
                              >
                                <Mail className="w-3 h-3 shrink-0" />
                                <span>{item.email}</span>
                              </a>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <span className="text-[10.5px] text-[#A28E91] tabular-nums">
                                {formatDate(item.createdAt)}
                              </span>
                              {confirmDeleteId === item.id ? (
                                <div className="flex items-center gap-1">
                                  <button
                                    type="button"
                                    disabled={deletingId === item.id}
                                    onClick={() => handleDelete(item.id)}
                                    className="px-2 py-0.5 rounded bg-[#B3394D] text-white text-[10px] font-medium cursor-pointer"
                                  >
                                    {deletingId === item.id
                                      ? '...'
                                      : isSw
                                        ? 'Futa'
                                        : 'Delete'}
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setConfirmDeleteId(null)}
                                    className="px-1.5 py-0.5 rounded border border-[#E5D5D7] text-[10px] text-[#6E6062] cursor-pointer"
                                  >
                                    {isSw ? 'Ghairi' : 'Cancel'}
                                  </button>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => setConfirmDeleteId(item.id)}
                                  aria-label={isSw ? 'Futa' : 'Remove entry'}
                                  className="p-1 rounded text-[#B39CA0] hover:text-[#B3394D] transition-colors cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </div>

                          {item.message && (
                            <p className="mt-2.5 pt-2.5 border-t border-[#EFE2E4] font-serif-editorial italic text-[14.5px] text-[#5B4F4D] leading-relaxed whitespace-pre-wrap">
                              “{item.message}”
                            </p>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
