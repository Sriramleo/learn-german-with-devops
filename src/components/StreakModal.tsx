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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white border border-border-strong rounded-2xl p-5 sm:p-6 shadow-2xl flex flex-col gap-5 text-slate-900">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-border-subtle pb-3">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-500 fill-amber-500" />
            <h2 className="font-sans text-base font-bold text-slate-900">
              Daily Streak & Reminder / தொடர் பயிற்சி
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Close Streak Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Big Streak Counter Badge */}
        <div className="p-5 sm:p-6 rounded-2xl bg-amber-50/80 border border-amber-200 flex items-center justify-between gap-4">
          <div>
            <span className="text-[10px] text-amber-800 uppercase tracking-wider font-bold block mb-1 font-mono">
              ACTIVE STUDY STREAK
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-bold font-mono text-slate-900">
                {stats.streakDays}
              </span>
              <span className="text-xs sm:text-sm font-mono text-amber-700 font-semibold">
                Days Clean / நாட்கள்
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1 font-sans">
              {stats.streakDays > 0 
                ? 'Top 5% of candidate engineers targeting Bavaria/Berlin roles'
                : 'Start your daily streak today by completing your first drill or quiz!'}
            </p>
          </div>

          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white border border-amber-300 flex items-center justify-center text-amber-500 shrink-0 shadow-xs">
            <Flame className="w-8 h-8 sm:w-9 sm:h-9 fill-amber-500" />
          </div>
        </div>

        {/* 7-Day Visual Calendar */}
        <div className="flex flex-col gap-2">
          <span className="text-[11px] text-slate-500 uppercase tracking-wider font-bold font-mono">
            This Week's Activity (இந்த வார பயிற்சி):
          </span>

          <div className="grid grid-cols-7 gap-1.5 sm:gap-2 text-center font-mono text-xs">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => {
              const isDone = i < stats.streakDays;
              const isToday = stats.streakDays === 0 ? i === 0 : i === Math.min(6, stats.streakDays);

              return (
                <div
                  key={day}
                  className={`p-2 sm:p-2.5 rounded-xl border flex flex-col items-center gap-1.5 shadow-2xs ${
                    isToday
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-800 font-bold'
                      : isDone
                      ? 'bg-slate-50 border-border-subtle text-slate-900'
                      : 'bg-white border-border-subtle text-slate-400'
                  }`}
                >
                  <span className="text-[10px] sm:text-[11px] text-slate-500">{day}</span>
                  <div className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full flex items-center justify-center ${
                    isDone || isToday ? 'bg-emerald-600 text-white' : 'bg-slate-200'
                  }`}>
                    {(isDone || isToday) && <Check className="w-2.5 h-2.5" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Schedule Daily Reminder Notification */}
        <div className="p-4 rounded-xl bg-slate-50 border border-border-subtle flex flex-col gap-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-sky-600" />
              <span className="font-sans text-xs font-bold text-slate-900">
                Daily Standup Practice Alarm
              </span>
            </div>

            <select
              value={reminderTime}
              onChange={(e) => setReminderTime(e.target.value)}
              className="px-2.5 py-1 rounded-lg bg-white border border-border-subtle font-mono text-xs text-slate-700 focus:outline-none focus:border-emerald-500"
            >
              <option value="08:30 AM">08:30 AM (Before Standup)</option>
              <option value="09:00 AM">09:00 AM (Sprint Sync)</option>
              <option value="12:30 PM">12:30 PM (Lunch Drill)</option>
              <option value="06:00 PM">06:00 PM (Evening Review)</option>
            </select>
          </div>

          <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600 font-sans">
            <input
              type="checkbox"
              checked={browserNotificationEnabled}
              onChange={(e) => setBrowserNotificationEnabled(e.target.checked)}
              className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
            />
            <span>Send browser push notification reminders</span>
          </label>

          <button
            onClick={handleSaveReminder}
            className="w-full mt-1 py-2 rounded-lg bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold border border-border-subtle transition-colors flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
          >
            {savedNotificationAlert ? (
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                <span>Alarm Saved for {reminderTime}!</span>
              </span>
            ) : (
              <span>Save Practice Time</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
