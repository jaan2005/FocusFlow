export interface Task {
  id: string;
  text: string;
  completed: boolean;
  startTime?: string;
  endTime?: string;
  priority?: 'low' | 'medium' | 'high';
  category?: string;
}

export interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export interface Reminder {
  id: string;
  title: string;
  description?: string;
  time: string;
  date: string;
  completed: boolean;
  recurring?: 'none' | 'daily' | 'weekly' | 'monthly';
}

export interface PomodoroSettings {
  workDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  sessionsUntilLongBreak: number;
}

export interface Note {
  id: string;
  content: string;
  lastModified: Date;
}

export interface Habit {
  id: string;
  name: string;
  description?: string;
  category: 'health' | 'work' | 'personal' | 'learning' | 'fitness';
  targetFrequency: 'daily' | 'weekly';
  targetCount?: number;
  color: string;
  icon: string;
  createdAt: Date;
  streak: number;
  completions: HabitCompletion[];
  xp: number;
}

export interface HabitCompletion {
  id: string;
  habitId: string;
  date: string;
  completed: boolean;
  timestamp: Date;
}

export interface Goal {
  id: string;
  title: string;
  description?: string;
  category: 'work' | 'personal' | 'health' | 'learning' | 'finance';
  priority: 'low' | 'medium' | 'high';
  deadline: Date;
  progress: number;
  status: 'active' | 'completed' | 'paused' | 'cancelled';
  subtasks: GoalSubtask[];
  createdAt: Date;
  completedAt?: Date;
}

export interface GoalSubtask {
  id: string;
  goalId: string;
  title: string;
  completed: boolean;
  deadline?: Date;
  estimatedHours?: number;
  createdAt: Date;
}

export interface JournalEntry {
  id: string;
  date: string;
  mood: 1 | 2 | 3 | 4 | 5;
  highlights: string;
  challenges: string;
  gratitude: string;
  tomorrow: string;
  reflection: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface FocusSession {
  id: string;
  type: 'work' | 'study' | 'break';
  category: string;
  duration: number;
  startTime: Date;
  endTime: Date;
  completed: boolean;
}

export interface AnalyticsData {
  totalFocusTime: number;
  tasksCompleted: number;
  habitsCompleted: number;
  goalsProgress: number;
  streakDays: number;
  productivityScore: number;
  categoryBreakdown: Record<string, number>;
  weeklyTrends: Array<{ date: string; focusTime: number; tasks: number }>;
}

export type Theme = 'light' | 'dark';

export type ActiveTab = 'assistant' | 'planner' | 'study' | 'reminders' | 'habits' | 'goals' | 'analytics' | 'journal';