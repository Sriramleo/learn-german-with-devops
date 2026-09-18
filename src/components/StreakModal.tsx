import React, { useState } from 'react';
import { 
  X, 
  Flame, 
  Bell, 
  Check 
} from 'lucide-react';
import { UserStats } from '../types';

interface StreakModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: UserStats;
  onUpdateStats: (newStats: Partial<UserStats>) => void;
}

export const StreakModal: React.FC<StreakModalProps> = ({
  isOpen,
  onClose,
  stats
}) => {
  const [reminderTime, setReminderTime] = useState('09:00 AM');
  const [browserNotificationEnabled, setBrowserNotificationEnabled] = useState(true);
  const [savedNotificationAlert, setSavedNotificationAlert] = useState(false);

  if (!isOpen) return null;

  const handleSaveReminder = () => {
    setSavedNotificationAlert(true);
    setTimeout(() => {
      setSavedNotificationAlert(false);
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-2xl p-6 shadow-2xl flex flex-col gap-6 text-slate-900">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-500" />
            <h2 className="font-mono text-base font-bold text-slate-900">
              Daily Streak & Reminder / தொடர் பயிற்சி நினைவூட்டல்
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Big Streak Counter Badge */}
        <div className="p-6 rounded-2xl bg-amber-50/70 border border-amber-200 flex items-center justify-between">
          <div>
            <span className="font-mono text-xs text-amber-700 uppercase tracking-wider font-bold block mb-1">
              ACTIVE STUDY STREAK
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold font-mono text-slate-900">
                {stats.streakDays}
              </span>
              <span className="text-sm font-mono text-amber-700 font-semibold">
                Days Clean / நாட்கள்
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1">
              {stats.streakDays > 0 
                ? 'Top 5% of candidate engineers targeting Bavaria/Berlin roles'
                : 'Start your daily streak today by completing your first drill or quiz!'}
            </p>
          </div>

          <div className="w-16 h-16 rounded-2xl bg-white border border-amber-300 flex items-center justify-center text-amber-500 shrink-0 shadow-xs">
            <Flame className="w-9 h-9 fill-amber-500" />
          </div>
        </div>

        {/* 7-Day Visual Calendar */}
        <div className="flex flex-col gap-2">
          <span className="font-mono text-xs text-slate-500 uppercase tracking-wider font-semibold">
            This Week's Activity (இந்த வார பயிற்சி):
          </span>

          <div className="grid grid-cols-7 gap-2 text-center font-mono text-xs">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => {
              const isDone = i < stats.streakDays;
              const isToday = stats.streakDays === 0 ? i === 0 : i === Math.min(6, stats.streakDays);

              return (
                <div
                  key={day}
                  className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 shadow-xs ${
                    isToday
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-800 font-bold'
                      : isDone
                      ? 'bg-slate-50 border-slate-200 text-slate-900'
                      : 'bg-white border-slate-200 text-slate-400'
                  }`}
                >
                  <span className="text-[10px] text-slate-500">{day}</span>
                  {isDone ? (
                    <Check className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <span className="w-4 h-4 rounded-full border border-dashed border-slate-300" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-sky-600" />
              <span className="font-mono text-xs font-bold text-slate-900">
                Daily Standup Practice Reminder
              </span>
            </div>

            <button
              onClick={() => setBrowserNotificationEnabled(!browserNotificationEnabled)}
              className={`w-10 h-6 rounded-full transition-colors relative ${
                browserNotificationEnabled ? 'bg-emerald-600' : 'bg-slate-300'
              }`}
            >
              <span
                className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                  browserNotificationEnabled ? 'right-1' : 'left-1'
                }`}
              />
            </button>
          </div>

          <p className="text-xs text-slate-600">
            Receive a prompt 15 minutes before your morning scrum to practice incident phrases and tech vocabulary.
          </p>

          <div className="flex items-center gap-2 pt-1 font-mono text-xs">
            <span className="text-slate-500">Scheduled for:</span>
            {['08:30 AM', '09:00 AM', '10:00 AM'].map((t) => (
              <button
                key={t}
                onClick={() => setReminderTime(t)}
                className={`px-2.5 py-1 rounded-lg border transition-colors shadow-xs ${
                  reminderTime === t
                    ? 'bg-emerald-600 text-white border-emerald-600 font-bold'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {savedNotificationAlert && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-mono text-emerald-800 flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>Reminder settings updated successfully!</span>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-2">
          <span className="font-mono text-xs text-slate-500">
            Streak freeze available: {stats.streakDays > 0 ? 2 : 0}
          </span>

          <button
            onClick={handleSaveReminder}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-mono text-xs font-bold transition-all shadow-xs"
          >
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
};
