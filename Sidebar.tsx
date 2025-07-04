import React from 'react';
import { Brain, Calendar, BookOpen, Bell, Sun, Moon, Target, TrendingUp, BarChart3, PenTool } from 'lucide-react';
import type { ActiveTab, Theme } from '../types';

interface SidebarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  theme: Theme;
  onThemeToggle: () => void;
}

const navItems = [
  { id: 'assistant' as ActiveTab, icon: Brain, label: 'Assistant' },
  { id: 'planner' as ActiveTab, icon: Calendar, label: 'Planner' },
  { id: 'study' as ActiveTab, icon: BookOpen, label: 'Study' },
  { id: 'reminders' as ActiveTab, icon: Bell, label: 'Reminders' },
  { id: 'habits' as ActiveTab, icon: Target, label: 'Habits' },
  { id: 'goals' as ActiveTab, icon: TrendingUp, label: 'Goals' },
  { id: 'analytics' as ActiveTab, icon: BarChart3, label: 'Analytics' },
  { id: 'journal' as ActiveTab, icon: PenTool, label: 'Journal' },
];

export function Sidebar({ activeTab, onTabChange, theme, onThemeToggle }: SidebarProps) {
  return (
    <div className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">FocusFlow</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">OS</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => onTabChange(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 shadow-sm'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : ''}`} />
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Theme Toggle */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={onThemeToggle}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-200"
        >
          {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          <span className="font-medium">{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
        </button>
      </div>
    </div>
  );
}