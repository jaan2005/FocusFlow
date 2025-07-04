import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { MobileSidebar } from './components/MobileSidebar';
import { AssistantChat } from './components/Assistant/AssistantChat';
import { DailyPlanner } from './components/Planner/DailyPlanner';
import { StudyDashboard } from './components/Study/StudyDashboard';
import { ReminderBot } from './components/Reminders/ReminderBot';
import { HabitTracker } from './components/Habits/HabitTracker';
import { GoalSystem } from './components/Goals/GoalSystem';
import { AnalyticsDashboard } from './components/Analytics/AnalyticsDashboard';
import { JournalTab } from './components/Journal/JournalTab';
import { VoiceInput } from './components/Voice/VoiceInput';
import { PWAInstallButton } from './components/PWAInstall/PWAInstallButton';
import { useTheme } from './hooks/useTheme';
import { useLocalStorage } from './hooks/useLocalStorage';
import type { 
  ActiveTab, 
  ChatMessage, 
  Task, 
  Reminder, 
  Note, 
  Habit, 
  HabitCompletion, 
  Goal, 
  JournalEntry,
  FocusSession 
} from './types';

function App() {
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<ActiveTab>('assistant');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  
  // Data persistence
  const [messages, setMessages] = useLocalStorage<ChatMessage[]>('focusflow-messages', []);
  const [tasks, setTasks] = useLocalStorage<Task[]>('focusflow-tasks', []);
  const [reminders, setReminders] = useLocalStorage<Reminder[]>('focusflow-reminders', []);
  const [notes, setNotes] = useLocalStorage<Note[]>('focusflow-notes', []);
  const [habits, setHabits] = useLocalStorage<Habit[]>('focusflow-habits', []);
  const [habitCompletions, setHabitCompletions] = useLocalStorage<HabitCompletion[]>('focusflow-habit-completions', []);
  const [goals, setGoals] = useLocalStorage<Goal[]>('focusflow-goals', []);
  const [journalEntries, setJournalEntries] = useLocalStorage<JournalEntry[]>('focusflow-journal', []);
  const [focusSessions, setFocusSessions] = useLocalStorage<FocusSession[]>('focusflow-focus-sessions', []);

  const handleScheduleGenerated = (newTasks: Task[]) => {
    setTasks(newTasks);
    setActiveTab('planner');
  };

  const handleVoiceCommand = (command: string) => {
    const lowerCommand = command.toLowerCase();
    
    if (lowerCommand.includes('start pomodoro') || lowerCommand.includes('start timer')) {
      setActiveTab('study');
    } else if (lowerCommand.includes('add task') || lowerCommand.includes('create task')) {
      setActiveTab('planner');
    } else if (lowerCommand.includes('add reminder')) {
      setActiveTab('reminders');
    } else if (lowerCommand.includes('habits') || lowerCommand.includes('habit tracker')) {
      setActiveTab('habits');
    } else if (lowerCommand.includes('goals') || lowerCommand.includes('goal')) {
      setActiveTab('goals');
    } else if (lowerCommand.includes('analytics') || lowerCommand.includes('stats')) {
      setActiveTab('analytics');
    } else if (lowerCommand.includes('journal') || lowerCommand.includes('write')) {
      setActiveTab('journal');
    } else {
      // Default to assistant for general queries
      setActiveTab('assistant');
      // Add the voice command as a message
      const voiceMessage: ChatMessage = {
        id: `voice-${Date.now()}`,
        text: command,
        isUser: true,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, voiceMessage]);
    }
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'assistant':
        return (
          <AssistantChat
            messages={messages}
            onMessagesChange={setMessages}
            onScheduleGenerated={handleScheduleGenerated}
          />
        );
      case 'planner':
        return (
          <DailyPlanner
            tasks={tasks}
            onTasksChange={setTasks}
          />
        );
      case 'study':
        return (
          <StudyDashboard
            notes={notes}
            onNotesChange={setNotes}
          />
        );
      case 'reminders':
        return (
          <ReminderBot
            reminders={reminders}
            onRemindersChange={setReminders}
          />
        );
      case 'habits':
        return (
          <HabitTracker
            habits={habits}
            onHabitsChange={setHabits}
            habitCompletions={habitCompletions}
            onCompletionsChange={setHabitCompletions}
          />
        );
      case 'goals':
        return (
          <GoalSystem
            goals={goals}
            onGoalsChange={setGoals}
          />
        );
      case 'analytics':
        return (
          <AnalyticsDashboard
            tasks={tasks}
            habits={habits}
            habitCompletions={habitCompletions}
            goals={goals}
            focusSessions={focusSessions}
          />
        );
      case 'journal':
        return (
          <JournalTab
            journalEntries={journalEntries}
            onEntriesChange={setJournalEntries}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          theme={theme}
          onThemeToggle={toggleTheme}
        />
      </div>

      {/* Mobile Sidebar */}
      <MobileSidebar
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        theme={theme}
        onThemeToggle={toggleTheme}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <div className="md:hidden p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <Menu className="w-6 h-6" />
            </button>
            
            <VoiceInput onVoiceCommand={handleVoiceCommand} />
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-hidden bg-white dark:bg-gray-900">
          {renderActiveTab()}
        </div>
      </div>

      {/* PWA Install Button */}
      <PWAInstallButton />
    </div>
  );
}

export default App;