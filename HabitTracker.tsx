import React, { useState } from 'react';
import { Plus, Target, Flame, Trophy, Calendar, Trash2, Edit3, Star } from 'lucide-react';
import type { Habit, HabitCompletion } from '../../types';
import { getTodayDateString } from '../../utils/timeUtils';

interface HabitTrackerProps {
  habits: Habit[];
  onHabitsChange: (habits: Habit[]) => void;
  habitCompletions: HabitCompletion[];
  onCompletionsChange: (completions: HabitCompletion[]) => void;
}

const HABIT_COLORS = [
  'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-pink-500', 
  'bg-yellow-500', 'bg-indigo-500', 'bg-red-500', 'bg-teal-500'
];

export function HabitTracker({ habits, onHabitsChange, habitCompletions, onCompletionsChange }: HabitTrackerProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newHabit, setNewHabit] = useState({
    name: '',
    description: '',
    category: 'personal' as const,
    targetFrequency: 'daily' as const,
    targetCount: 1,
    color: HABIT_COLORS[0],
  });

  const addHabit = () => {
    if (!newHabit.name.trim()) return;

    const habit: Habit = {
      id: `habit-${Date.now()}`,
      name: newHabit.name.trim(),
      description: newHabit.description.trim() || undefined,
      category: newHabit.category,
      targetFrequency: newHabit.targetFrequency,
      targetCount: newHabit.targetCount,
      color: newHabit.color,
      icon: 'Target',
      createdAt: new Date(),
      streak: 0,
      completions: [],
      xp: 0,
    };

    onHabitsChange([...habits, habit]);
    setNewHabit({
      name: '',
      description: '',
      category: 'personal',
      targetFrequency: 'daily',
      targetCount: 1,
      color: HABIT_COLORS[0],
    });
    setShowAddForm(false);
  };

  const toggleHabitCompletion = (habitId: string) => {
    const today = getTodayDateString();
    const existingCompletion = habitCompletions.find(
      c => c.habitId === habitId && c.date === today
    );

    if (existingCompletion) {
      const updatedCompletions = habitCompletions.filter(c => c.id !== existingCompletion.id);
      onCompletionsChange(updatedCompletions);
      
      const updatedHabits = habits.map(habit => {
        if (habit.id === habitId) {
          return {
            ...habit,
            streak: Math.max(0, habit.streak - 1),
            xp: Math.max(0, habit.xp - 10),
          };
        }
        return habit;
      });
      onHabitsChange(updatedHabits);
    } else {
      const completion: HabitCompletion = {
        id: `completion-${Date.now()}`,
        habitId,
        date: today,
        completed: true,
        timestamp: new Date(),
      };
      onCompletionsChange([...habitCompletions, completion]);
      
      const updatedHabits = habits.map(habit => {
        if (habit.id === habitId) {
          const newStreak = habit.streak + 1;
          const bonusXP = newStreak % 7 === 0 ? 50 : 0;
          return {
            ...habit,
            streak: newStreak,
            xp: habit.xp + 10 + bonusXP,
          };
        }
        return habit;
      });
      onHabitsChange(updatedHabits);
    }
  };

  const deleteHabit = (habitId: string) => {
    onHabitsChange(habits.filter(h => h.id !== habitId));
    onCompletionsChange(habitCompletions.filter(c => c.habitId !== habitId));
  };

  const isHabitCompletedToday = (habitId: string) => {
    const today = getTodayDateString();
    return habitCompletions.some(c => c.habitId === habitId && c.date === today && c.completed);
  };

  const getTotalXP = () => {
    return habits.reduce((total, habit) => total + habit.xp, 0);
  };

  const getCompletedHabitsToday = () => {
    const today = getTodayDateString();
    return habitCompletions.filter(c => c.date === today && c.completed).length;
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Habit Tracker</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {getCompletedHabitsToday()}/{habits.length} habits completed today
            </p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Habit</span>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg p-4 text-white">
            <div className="flex items-center space-x-2">
              <Star className="w-5 h-5" />
              <span className="text-sm font-medium">Total XP</span>
            </div>
            <div className="text-2xl font-bold">{getTotalXP()}</div>
          </div>
          <div className="bg-gradient-to-r from-green-400 to-emerald-500 rounded-lg p-4 text-white">
            <div className="flex items-center space-x-2">
              <Trophy className="w-5 h-5" />
              <span className="text-sm font-medium">Completed</span>
            </div>
            <div className="text-2xl font-bold">{getCompletedHabitsToday()}</div>
          </div>
          <div className="bg-gradient-to-r from-red-400 to-pink-500 rounded-lg p-4 text-white">
            <div className="flex items-center space-x-2">
              <Flame className="w-5 h-5" />
              <span className="text-sm font-medium">Best Streak</span>
            </div>
            <div className="text-2xl font-bold">
              {habits.length > 0 ? Math.max(...habits.map(h => h.streak)) : 0}
            </div>
          </div>
        </div>
      </div>

      {/* Habits List */}
      <div className="flex-1 overflow-y-auto p-6">
        {habits.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No habits yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Start building positive habits to improve your daily routine.
            </p>
            <button
              onClick={() => setShowAddForm(true)}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Create Your First Habit
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {habits.map((habit) => {
              const isCompleted = isHabitCompletedToday(habit.id);
              return (
                <div
                  key={habit.id}
                  className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 transition-all ${
                    isCompleted ? 'ring-2 ring-green-500 bg-green-50 dark:bg-green-900/10' : 'hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => toggleHabitCompletion(habit.id)}
                        className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                          isCompleted
                            ? 'bg-green-500 text-white'
                            : `${habit.color} text-white hover:opacity-80`
                        }`}
                      >
                        {isCompleted ? <Trophy className="w-6 h-6" /> : <Target className="w-6 h-6" />}
                      </button>
                      
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {habit.name}
                        </h3>
                        {habit.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {habit.description}
                          </p>
                        )}
                        <div className="flex items-center space-x-4 mt-2">
                          <div className="flex items-center space-x-1">
                            <Flame className="w-4 h-4 text-orange-500" />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              {habit.streak} day streak
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-500" />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              {habit.xp} XP
                            </span>
                          </div>
                          <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs rounded-full text-gray-600 dark:text-gray-400 capitalize">
                            {habit.category}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => deleteHabit(habit.id)}
                      className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Habit Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Add New Habit
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Habit Name *
                </label>
                <input
                  type="text"
                  value={newHabit.name}
                  onChange={(e) => setNewHabit({ ...newHabit, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g., Drink 8 glasses of water"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description (optional)
                </label>
                <textarea
                  value={newHabit.description}
                  onChange={(e) => setNewHabit({ ...newHabit, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Why is this habit important?"
                  rows={2}
                />
              </div>
              
              <div className="flex space-x-3">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Category
                  </label>
                  <select
                    value={newHabit.category}
                    onChange={(e) => setNewHabit({ ...newHabit, category: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="health">Health</option>
                    <option value="work">Work</option>
                    <option value="personal">Personal</option>
                    <option value="learning">Learning</option>
                    <option value="fitness">Fitness</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Frequency
                  </label>
                  <select
                    value={newHabit.targetFrequency}
                    onChange={(e) => setNewHabit({ ...newHabit, targetFrequency: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Color
                </label>
                <div className="flex space-x-2">
                  {HABIT_COLORS.map((color) => (
                    <button
                      key={color}
                      onClick={() => setNewHabit({ ...newHabit, color })}
                      className={`w-8 h-8 rounded-full ${color} ${
                        newHabit.color === color ? 'ring-2 ring-gray-400' : ''
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={addHabit}
                disabled={!newHabit.name.trim()}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Add Habit
              </button>
              <button
                onClick={() => setShowAddForm(false)}
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