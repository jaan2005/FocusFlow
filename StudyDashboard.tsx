import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Settings, Maximize2, Minimize2, Clock } from 'lucide-react';
import type { PomodoroSettings, Note } from '../../types';
import { formatTime } from '../../utils/timeUtils';

interface StudyDashboardProps {
  notes: Note[];
  onNotesChange: (notes: Note[]) => void;
}

const DEFAULT_SETTINGS: PomodoroSettings = {
  workDuration: 25,
  shortBreakDuration: 10,
  longBreakDuration: 15,
  sessionsUntilLongBreak: 4,
};

const TIMER_PRESETS = [
  { label: '25 min', value: 25 },
  { label: '30 min', value: 30 },
  { label: '45 min', value: 45 },
];

export function StudyDashboard({ notes, onNotesChange }: StudyDashboardProps) {
  const [settings, setSettings] = useState<PomodoroSettings>(DEFAULT_SETTINGS);
  const [currentSession, setCurrentSession] = useState<'work' | 'shortBreak' | 'longBreak'>('work');
  const [timeLeft, setTimeLeft] = useState(settings.workDuration);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [noteContent, setNoteContent] = useState('');
  const [selectedPreset, setSelectedPreset] = useState(25);
  
  const intervalRef = useRef<number>();

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = window.setInterval(() => {
        setTimeLeft(prev => prev - 1/60); // Update every second (1/60 minute)
      }, 1000);
    } else if (timeLeft <= 0) {
      handleSessionComplete();
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft]);

  useEffect(() => {
    // Load the current note
    if (notes.length > 0) {
      setNoteContent(notes[0].content);
    }
  }, [notes]);

  const handleSessionComplete = () => {
    setIsRunning(false);
    
    if (currentSession === 'work') {
      const newSessionsCompleted = sessionsCompleted + 1;
      setSessionsCompleted(newSessionsCompleted);
      
      // Always start with 10-minute break after work session
      setCurrentSession('shortBreak');
      setTimeLeft(10); // 10-minute break
    } else {
      setCurrentSession('work');
      setTimeLeft(selectedPreset);
    }

    // Play notification sound (browser notification)
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(`${currentSession === 'work' ? 'Work' : 'Break'} session completed!`, {
        icon: '/focus-icon.svg',
        body: currentSession === 'work' ? 'Time for a 10-minute break!' : 'Time to get back to work!',
      });
    }
  };

  const toggleTimer = () => {
    if (!isRunning && 'Notification' in window && Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setCurrentSession('work');
    setTimeLeft(selectedPreset);
    setSessionsCompleted(0);
  };

  const selectPreset = (minutes: number) => {
    if (!isRunning) {
      setSelectedPreset(minutes);
      setTimeLeft(minutes);
      setCurrentSession('work');
    }
  };

  const updateSettings = (newSettings: PomodoroSettings) => {
    setSettings(newSettings);
    if (!isRunning) {
      setTimeLeft(selectedPreset);
    }
    setShowSettings(false);
  };

  const saveNote = () => {
    const noteId = notes.length > 0 ? notes[0].id : `note-${Date.now()}`;
    const updatedNote: Note = {
      id: noteId,
      content: noteContent,
      lastModified: new Date(),
    };

    if (notes.length > 0) {
      onNotesChange([updatedNote, ...notes.slice(1)]);
    } else {
      onNotesChange([updatedNote]);
    }
  };

  const getSessionColor = () => {
    switch (currentSession) {
      case 'work': return 'text-indigo-600 dark:text-indigo-400';
      case 'shortBreak': return 'text-emerald-600 dark:text-emerald-400';
      case 'longBreak': return 'text-purple-600 dark:text-purple-400';
    }
  };

  const getSessionBackground = () => {
    switch (currentSession) {
      case 'work': return 'from-indigo-500 to-purple-600';
      case 'shortBreak': return 'from-emerald-500 to-teal-600';
      case 'longBreak': return 'from-purple-500 to-pink-600';
    }
  };

  if (focusMode) {
    return (
      <div className="h-full bg-gradient-to-br from-gray-900 to-black flex items-center justify-center text-white">
        <div className="text-center">
          <div className="text-8xl font-mono font-bold mb-4">
            {formatTime(timeLeft)}
          </div>
          <div className="text-2xl mb-8 capitalize">
            {currentSession === 'shortBreak' || currentSession === 'longBreak' ? 'Break Time' : 'Focus Time'}
          </div>
          <div className="flex items-center justify-center space-x-4">
            <button
              onClick={toggleTimer}
              className="p-4 bg-white/10 backdrop-blur rounded-full hover:bg-white/20 transition-colors"
            >
              {isRunning ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}
            </button>
            <button
              onClick={resetTimer}
              className="p-4 bg-white/10 backdrop-blur rounded-full hover:bg-white/20 transition-colors"
            >
              <RotateCcw className="w-8 h-8" />
            </button>
            <button
              onClick={() => setFocusMode(false)}
              className="p-4 bg-white/10 backdrop-blur rounded-full hover:bg-white/20 transition-colors"
            >
              <Minimize2 className="w-8 h-8" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Study Dashboard</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Sessions completed: {sessionsCompleted}
            </p>
          </div>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Pomodoro Timer */}
        <div className="lg:w-1/2 p-6 border-b lg:border-b-0 lg:border-r border-gray-200 dark:border-gray-700">
          <div className="text-center">
            {/* Timer Presets */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Timer Duration</h3>
              <div className="flex justify-center space-x-2">
                {TIMER_PRESETS.map((preset) => (
                  <button
                    key={preset.value}
                    onClick={() => selectPreset(preset.value)}
                    disabled={isRunning}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedPreset === preset.value
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    } ${isRunning ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <Clock className="w-4 h-4 inline mr-1" />
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Timer Display */}
            <div className={`w-64 h-64 mx-auto rounded-full bg-gradient-to-br ${getSessionBackground()} p-1 mb-8`}>
              <div className="w-full h-full bg-white dark:bg-gray-900 rounded-full flex items-center justify-center">
                <div>
                  <div className="text-4xl font-mono font-bold text-gray-900 dark:text-white mb-2">
                    {formatTime(timeLeft)}
                  </div>
                  <div className={`text-lg font-semibold capitalize ${getSessionColor()}`}>
                    {currentSession === 'shortBreak' ? 'Break Time (10 min)' : 
                     currentSession === 'longBreak' ? 'Long Break' : 
                     `Focus Time (${selectedPreset} min)`}
                  </div>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center space-x-4 mb-6">
              <button
                onClick={toggleTimer}
                className={`p-4 rounded-full bg-gradient-to-r ${getSessionBackground()} text-white hover:opacity-90 transition-opacity`}
              >
                {isRunning ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
              </button>
              <button
                onClick={resetTimer}
                className="p-4 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                <RotateCcw className="w-6 h-6" />
              </button>
              <button
                onClick={() => setFocusMode(true)}
                className="p-4 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                <Maximize2 className="w-6 h-6" />
              </button>
            </div>

            {/* Progress */}
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Today's Progress</div>
              <div className="flex space-x-1">
                {Array.from({ length: settings.sessionsUntilLongBreak }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-2 flex-1 rounded ${
                      i < sessionsCompleted % settings.sessionsUntilLongBreak
                        ? 'bg-indigo-600'
                        : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Notes Section */}
        <div className="lg:w-1/2 p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Study Notes</h3>
            <button
              onClick={saveNote}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
            >
              Save Notes
            </button>
          </div>
          
          <textarea
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value)}
            placeholder="Write your study notes here..."
            className="flex-1 p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
          />
          
          {notes.length > 0 && (
            <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
              Last saved: {notes[0].lastModified.toLocaleString()}
            </div>
          )}
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-96 max-w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Timer Settings
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Break Duration (minutes)
                </label>
                <input
                  type="number"
                  value={settings.shortBreakDuration}
                  onChange={(e) => setSettings({ ...settings, shortBreakDuration: parseInt(e.target.value) || 10 })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  min="5"
                  max="30"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Long Break (minutes)
                </label>
                <input
                  type="number"
                  value={settings.longBreakDuration}
                  onChange={(e) => setSettings({ ...settings, longBreakDuration: parseInt(e.target.value) || 15 })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  min="10"
                  max="60"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Sessions until Long Break
                </label>
                <input
                  type="number"
                  value={settings.sessionsUntilLongBreak}
                  onChange={(e) => setSettings({ ...settings, sessionsUntilLongBreak: parseInt(e.target.value) || 4 })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  min="2"
                  max="10"
                />
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => updateSettings(settings)}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Save Settings
              </button>
              <button
                onClick={() => setShowSettings(false)}
                className="flex-1 px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}