import React, { useState, useEffect } from 'react';
import { BookOpen, Calendar, Smile, Frown, Meh, Heart, Star, Save, Edit3 } from 'lucide-react';
import type { JournalEntry } from '../../types';
import { getTodayDateString } from '../../utils/timeUtils';

interface JournalTabProps {
  journalEntries: JournalEntry[];
  onEntriesChange: (entries: JournalEntry[]) => void;
}

const MOOD_ICONS = {
  1: { icon: Frown, color: 'text-red-500', label: 'Terrible', bg: 'bg-red-100 dark:bg-red-900/20' },
  2: { icon: Frown, color: 'text-orange-500', label: 'Bad', bg: 'bg-orange-100 dark:bg-orange-900/20' },
  3: { icon: Meh, color: 'text-yellow-500', label: 'Okay', bg: 'bg-yellow-100 dark:bg-yellow-900/20' },
  4: { icon: Smile, color: 'text-green-500', label: 'Good', bg: 'bg-green-100 dark:bg-green-900/20' },
  5: { icon: Smile, color: 'text-emerald-500', label: 'Amazing', bg: 'bg-emerald-100 dark:bg-emerald-900/20' },
};

const JOURNAL_PROMPTS = [
  "What went well today?",
  "What challenged you today?",
  "What are you grateful for?",
  "What will you focus on tomorrow?",
  "How did you grow today?",
  "What made you smile today?",
  "What would you do differently?",
  "What are you proud of today?",
];

export function JournalTab({ journalEntries, onEntriesChange }: JournalTabProps) {
  const [selectedDate, setSelectedDate] = useState(getTodayDateString());
  const [currentEntry, setCurrentEntry] = useState<JournalEntry | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    const entry = journalEntries.find(e => e.date === selectedDate);
    if (entry) {
      setCurrentEntry(entry);
      setIsEditing(false);
    } else {
      setCurrentEntry(null);
      setIsEditing(false);
    }
    setHasUnsavedChanges(false);
  }, [selectedDate, journalEntries]);

  const saveEntry = () => {
    if (!currentEntry) return;

    const existingIndex = journalEntries.findIndex(e => e.date === selectedDate);
    const updatedEntry = {
      ...currentEntry,
      updatedAt: new Date(),
    };

    if (existingIndex >= 0) {
      const updatedEntries = [...journalEntries];
      updatedEntries[existingIndex] = updatedEntry;
      onEntriesChange(updatedEntries);
    } else {
      onEntriesChange([...journalEntries, updatedEntry]);
    }

    setIsEditing(false);
    setHasUnsavedChanges(false);
  };

  const createNewEntry = () => {
    const newEntry: JournalEntry = {
      id: `journal-${Date.now()}`,
      date: selectedDate,
      mood: 3,
      highlights: '',
      challenges: '',
      gratitude: '',
      tomorrow: '',
      reflection: '',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setCurrentEntry(newEntry);
    setIsEditing(true);
    setHasUnsavedChanges(false);
  };

  const updateEntry = (field: keyof JournalEntry, value: any) => {
    if (!currentEntry) return;
    setCurrentEntry({ ...currentEntry, [field]: value });
    setHasUnsavedChanges(true);
  };

  const getRandomPrompt = () => {
    return JOURNAL_PROMPTS[Math.floor(Math.random() * JOURNAL_PROMPTS.length)];
  };

  const getRecentDates = () => {
    const dates = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    if (dateStr === today) return 'Today';
    if (dateStr === yesterdayStr) return 'Yesterday';
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const cancelEdit = () => {
    const originalEntry = journalEntries.find(e => e.date === selectedDate);
    if (originalEntry) {
      setCurrentEntry(originalEntry);
    } else {
      setCurrentEntry(null);
    }
    setIsEditing(false);
    setHasUnsavedChanges(false);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Daily Journal</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Reflect on your day and track your growth
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {journalEntries.length} entries
            </div>
            {hasUnsavedChanges && (
              <div className="text-xs text-orange-500 dark:text-orange-400 mt-1">
                Unsaved changes
              </div>
            )}
          </div>
        </div>

        {/* Date Navigation */}
        <div className="flex space-x-2 mt-4 overflow-x-auto">
          {getRecentDates().map((date) => {
            const hasEntry = journalEntries.some(e => e.date === date);
            const entry = journalEntries.find(e => e.date === date);
            const MoodIcon = entry ? MOOD_ICONS[entry.mood].icon : Calendar;
            
            return (
              <button
                key={date}
                onClick={() => setSelectedDate(date)}
                className={`flex flex-col items-center p-3 rounded-lg min-w-0 transition-colors ${
                  selectedDate === date
                    ? 'bg-indigo-100 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                <MoodIcon className={`w-5 h-5 mb-1 ${entry ? MOOD_ICONS[entry.mood].color : ''}`} />
                <span className="text-xs font-medium whitespace-nowrap">
                  {formatDate(date)}
                </span>
                {hasEntry && (
                  <div className="w-1 h-1 bg-current rounded-full mt-1" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {!currentEntry && !isEditing ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No entry for {formatDate(selectedDate)}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Start journaling to track your thoughts and progress.
            </p>
            <button
              onClick={createNewEntry}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors inline-flex items-center space-x-2"
            >
              <Edit3 className="w-4 h-4" />
              <span>Write Entry</span>
            </button>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto">
            {/* Mood Selector */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                How was your day?
              </label>
              <div className="flex space-x-3">
                {Object.entries(MOOD_ICONS).map(([mood, { icon: Icon, color, label, bg }]) => (
                  <button
                    key={mood}
                    onClick={() => updateEntry('mood', parseInt(mood))}
                    disabled={!isEditing}
                    className={`flex flex-col items-center p-3 rounded-lg transition-colors ${
                      currentEntry?.mood === parseInt(mood)
                        ? `${bg} ring-2 ring-indigo-500`
                        : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                    } ${!isEditing ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <Icon className={`w-6 h-6 ${color} mb-1`} />
                    <span className="text-xs text-gray-600 dark:text-gray-400">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Journal Sections */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  ✨ Highlights of the day
                </label>
                <textarea
                  value={currentEntry?.highlights || ''}
                  onChange={(e) => updateEntry('highlights', e.target.value)}
                  disabled={!isEditing}
                  placeholder="What went well today? What made you happy?"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  🎯 Challenges & learnings
                </label>
                <textarea
                  value={currentEntry?.challenges || ''}
                  onChange={(e) => updateEntry('challenges', e.target.value)}
                  disabled={!isEditing}
                  placeholder="What was difficult? What did you learn?"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  🙏 Gratitude
                </label>
                <textarea
                  value={currentEntry?.gratitude || ''}
                  onChange={(e) => updateEntry('gratitude', e.target.value)}
                  disabled={!isEditing}
                  placeholder="What are you grateful for today?"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  rows={2}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  🚀 Tomorrow's focus
                </label>
                <textarea
                  value={currentEntry?.tomorrow || ''}
                  onChange={(e) => updateEntry('tomorrow', e.target.value)}
                  disabled={!isEditing}
                  placeholder="What will you focus on tomorrow?"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  rows={2}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  💭 Free reflection
                </label>
                <textarea
                  value={currentEntry?.reflection || ''}
                  onChange={(e) => updateEntry('reflection', e.target.value)}
                  disabled={!isEditing}
                  placeholder={`${getRandomPrompt()} Write whatever comes to mind...`}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  rows={4}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-3 mt-8">
              {isEditing ? (
                <>
                  <button
                    onClick={saveEntry}
                    className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors inline-flex items-center justify-center space-x-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Entry</span>
                  </button>
                  {currentEntry && journalEntries.some(e => e.date === selectedDate) && (
                    <button
                      onClick={cancelEdit}
                      className="px-6 py-3 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                </>
              ) : (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors inline-flex items-center justify-center space-x-2"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>Edit Entry</span>
                  </button>
                  {!currentEntry && (
                    <button
                      onClick={createNewEntry}
                      className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors inline-flex items-center space-x-2"
                    >
                      <Edit3 className="w-4 h-4" />
                      <span>New Entry</span>
                    </button>
                  )}
                </>
              )}
            </div>

            {/* Entry Info */}
            {currentEntry && !isEditing && (
              <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
                Last updated: {currentEntry.updatedAt.toLocaleString()}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}