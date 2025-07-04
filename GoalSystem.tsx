import React, { useState } from 'react';
import { Plus, Target, Calendar, CheckCircle, Clock, Trash2, Edit3, TrendingUp } from 'lucide-react';
import type { Goal, GoalSubtask } from '../../types';

interface GoalSystemProps {
  goals: Goal[];
  onGoalsChange: (goals: Goal[]) => void;
}

export function GoalSystem({ goals, onGoalsChange }: GoalSystemProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    category: 'personal' as const,
    priority: 'medium' as const,
    deadline: '',
  });
  const [newSubtask, setNewSubtask] = useState('');

  const addGoal = () => {
    if (!newGoal.title.trim() || !newGoal.deadline) return;

    const goal: Goal = {
      id: `goal-${Date.now()}`,
      title: newGoal.title.trim(),
      description: newGoal.description.trim() || undefined,
      category: newGoal.category,
      priority: newGoal.priority,
      deadline: new Date(newGoal.deadline),
      progress: 0,
      status: 'active',
      subtasks: [],
      createdAt: new Date(),
    };

    onGoalsChange([...goals, goal]);
    setNewGoal({
      title: '',
      description: '',
      category: 'personal',
      priority: 'medium',
      deadline: '',
    });
    setShowAddForm(false);
  };

  const addSubtask = (goalId: string) => {
    if (!newSubtask.trim()) return;

    const subtask: GoalSubtask = {
      id: `subtask-${Date.now()}`,
      goalId,
      title: newSubtask.trim(),
      completed: false,
      createdAt: new Date(),
    };

    const updatedGoals = goals.map(goal => {
      if (goal.id === goalId) {
        const updatedSubtasks = [...goal.subtasks, subtask];
        const progress = (updatedSubtasks.filter(st => st.completed).length / updatedSubtasks.length) * 100;
        return { ...goal, subtasks: updatedSubtasks, progress };
      }
      return goal;
    });

    onGoalsChange(updatedGoals);
    setNewSubtask('');
  };

  const toggleSubtask = (goalId: string, subtaskId: string) => {
    const updatedGoals = goals.map(goal => {
      if (goal.id === goalId) {
        const updatedSubtasks = goal.subtasks.map(st =>
          st.id === subtaskId ? { ...st, completed: !st.completed } : st
        );
        const progress = updatedSubtasks.length > 0 
          ? (updatedSubtasks.filter(st => st.completed).length / updatedSubtasks.length) * 100 
          : 0;
        const status = progress === 100 ? 'completed' : 'active';
        return { 
          ...goal, 
          subtasks: updatedSubtasks, 
          progress,
          status,
          completedAt: status === 'completed' ? new Date() : undefined
        };
      }
      return goal;
    });

    onGoalsChange(updatedGoals);
  };

  const deleteGoal = (goalId: string) => {
    onGoalsChange(goals.filter(g => g.id !== goalId));
    if (selectedGoal?.id === goalId) {
      setSelectedGoal(null);
    }
  };

  const deleteSubtask = (goalId: string, subtaskId: string) => {
    const updatedGoals = goals.map(goal => {
      if (goal.id === goalId) {
        const updatedSubtasks = goal.subtasks.filter(st => st.id !== subtaskId);
        const progress = updatedSubtasks.length > 0 
          ? (updatedSubtasks.filter(st => st.completed).length / updatedSubtasks.length) * 100 
          : 0;
        return { ...goal, subtasks: updatedSubtasks, progress };
      }
      return goal;
    });

    onGoalsChange(updatedGoals);
  };

  const getDaysUntilDeadline = (deadline: Date) => {
    const today = new Date();
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400';
      case 'medium': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'low': return 'text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400';
      case 'active': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400';
      case 'paused': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'cancelled': return 'text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const activeGoals = goals.filter(g => g.status === 'active');
  const completedGoals = goals.filter(g => g.status === 'completed');

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Goal System</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {activeGoals.length} active goals • {completedGoals.length} completed
            </p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Goal</span>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-gradient-to-r from-blue-400 to-indigo-500 rounded-lg p-4 text-white">
            <div className="flex items-center space-x-2">
              <Target className="w-5 h-5" />
              <span className="text-sm font-medium">Active Goals</span>
            </div>
            <div className="text-2xl font-bold">{activeGoals.length}</div>
          </div>
          <div className="bg-gradient-to-r from-green-400 to-emerald-500 rounded-lg p-4 text-white">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5" />
              <span className="text-sm font-medium">Completed</span>
            </div>
            <div className="text-2xl font-bold">{completedGoals.length}</div>
          </div>
          <div className="bg-gradient-to-r from-purple-400 to-pink-500 rounded-lg p-4 text-white">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5" />
              <span className="text-sm font-medium">Avg Progress</span>
            </div>
            <div className="text-2xl font-bold">
              {goals.length > 0 ? Math.round(goals.reduce((acc, g) => acc + g.progress, 0) / goals.length) : 0}%
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Goals List */}
        <div className="flex-1 overflow-y-auto p-6">
          {goals.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No goals yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Set SMART goals to achieve your dreams and track your progress.
              </p>
              <button
                onClick={() => setShowAddForm(true)}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Create Your First Goal
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {goals.map((goal) => {
                const daysLeft = getDaysUntilDeadline(goal.deadline);
                return (
                  <div
                    key={goal.id}
                    className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 cursor-pointer transition-all hover:shadow-md ${
                      selectedGoal?.id === goal.id ? 'ring-2 ring-indigo-500' : ''
                    }`}
                    onClick={() => setSelectedGoal(goal)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                          {goal.title}
                        </h3>
                        {goal.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            {goal.description}
                          </p>
                        )}
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(goal.priority)}`}>
                            {goal.priority} priority
                          </span>
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(goal.status)}`}>
                            {goal.status}
                          </span>
                          <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs rounded-full text-gray-600 dark:text-gray-400 capitalize">
                            {goal.category}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteGoal(goal.id);
                        }}
                        className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-3">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-gray-600 dark:text-gray-400">Progress</span>
                        <span className="font-medium text-gray-900 dark:text-white">{Math.round(goal.progress)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${goal.progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Deadline */}
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-400">
                        <Calendar className="w-4 h-4" />
                        <span>Due: {goal.deadline.toLocaleDateString()}</span>
                      </div>
                      <div className={`flex items-center space-x-1 ${
                        daysLeft < 0 ? 'text-red-600 dark:text-red-400' : 
                        daysLeft <= 7 ? 'text-yellow-600 dark:text-yellow-400' : 
                        'text-gray-600 dark:text-gray-400'
                      }`}>
                        <Clock className="w-4 h-4" />
                        <span>
                          {daysLeft < 0 ? `${Math.abs(daysLeft)} days overdue` : 
                           daysLeft === 0 ? 'Due today' : 
                           `${daysLeft} days left`}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Goal Details */}
        {selectedGoal && (
          <div className="w-96 border-l border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Subtasks
              </h3>
              <button
                onClick={() => setSelectedGoal(null)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                ×
              </button>
            </div>

            {/* Add Subtask */}
            <div className="flex space-x-2 mb-4">
              <input
                type="text"
                value={newSubtask}
                onChange={(e) => setNewSubtask(e.target.value)}
                placeholder="Add a subtask..."
                onKeyPress={(e) => e.key === 'Enter' && addSubtask(selectedGoal.id)}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                onClick={() => addSubtask(selectedGoal.id)}
                className="px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Subtasks List */}
            <div className="space-y-2">
              {selectedGoal.subtasks.map((subtask) => (
                <div
                  key={subtask.id}
                  className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <button
                    onClick={() => toggleSubtask(selectedGoal.id, subtask.id)}
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                      subtask.completed
                        ? 'bg-green-500 border-green-500 text-white'
                        : 'border-gray-300 dark:border-gray-600 hover:border-indigo-500'
                    }`}
                  >
                    {subtask.completed && <CheckCircle className="w-3 h-3" />}
                  </button>
                  <span
                    className={`flex-1 text-sm ${
                      subtask.completed
                        ? 'line-through text-gray-500 dark:text-gray-400'
                        : 'text-gray-900 dark:text-white'
                    }`}
                  >
                    {subtask.title}
                  </span>
                  <button
                    onClick={() => deleteSubtask(selectedGoal.id, subtask.id)}
                    className="text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>

            {selectedGoal.subtasks.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  No subtasks yet. Break down your goal into smaller, actionable steps.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add Goal Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Add New Goal
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Goal Title *
                </label>
                <input
                  type="text"
                  value={newGoal.title}
                  onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g., Launch my website"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description (optional)
                </label>
                <textarea
                  value={newGoal.description}
                  onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="What does success look like?"
                  rows={2}
                />
              </div>
              
              <div className="flex space-x-3">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Category
                  </label>
                  <select
                    value={newGoal.category}
                    onChange={(e) => setNewGoal({ ...newGoal, category: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="work">Work</option>
                    <option value="personal">Personal</option>
                    <option value="health">Health</option>
                    <option value="learning">Learning</option>
                    <option value="finance">Finance</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Priority
                  </label>
                  <select
                    value={newGoal.priority}
                    onChange={(e) => setNewGoal({ ...newGoal, priority: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Deadline *
                </label>
                <input
                  type="date"
                  value={newGoal.deadline}
                  onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={addGoal}
                disabled={!newGoal.title.trim() || !newGoal.deadline}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Add Goal
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