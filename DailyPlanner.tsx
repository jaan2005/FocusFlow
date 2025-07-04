import React, { useState } from 'react';
import { Plus, Check, Edit3, Trash2, Clock } from 'lucide-react';
import type { Task } from '../../types';

interface DailyPlannerProps {
  tasks: Task[];
  onTasksChange: (tasks: Task[]) => void;
}

export function DailyPlanner({ tasks, onTasksChange }: DailyPlannerProps) {
  const [newTaskText, setNewTaskText] = useState('');
  const [editingTask, setEditingTask] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  const addTask = () => {
    if (!newTaskText.trim()) return;

    const newTask: Task = {
      id: `task-${Date.now()}`,
      text: newTaskText.trim(),
      completed: false,
      priority: 'medium',
    };

    onTasksChange([...tasks, newTask]);
    setNewTaskText('');
  };

  const toggleTask = (taskId: string) => {
    onTasksChange(
      tasks.map(task =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (taskId: string) => {
    onTasksChange(tasks.filter(task => task.id !== taskId));
  };

  const startEdit = (task: Task) => {
    setEditingTask(task.id);
    setEditText(task.text);
  };

  const saveEdit = (taskId: string) => {
    if (!editText.trim()) return;

    onTasksChange(
      tasks.map(task =>
        task.id === taskId ? { ...task, text: editText.trim() } : task
      )
    );
    setEditingTask(null);
    setEditText('');
  };

  const cancelEdit = () => {
    setEditingTask(null);
    setEditText('');
  };

  const getTodayString = () => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const completedTasks = tasks.filter(task => task.completed).length;
  const progressPercentage = tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Daily Planner</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">{getTodayString()}</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
              {completedTasks}/{tasks.length}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">tasks completed</div>
          </div>
        </div>

        {/* Progress Bar */}
        {tasks.length > 0 && (
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        )}
      </div>

      {/* Add Task */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex space-x-3">
          <input
            type="text"
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            placeholder="Add a new task..."
            onKeyPress={(e) => e.key === 'Enter' && addTask()}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          <button
            onClick={addTask}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add</span>
          </button>
        </div>
      </div>

      {/* Task Timeline */}
      <div className="flex-1 overflow-y-auto p-6">
        {tasks.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No tasks scheduled yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Add tasks manually or ask the AI assistant to generate a schedule for you.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {tasks.map((task, index) => (
              <div
                key={task.id}
                className={`relative flex items-start space-x-4 p-4 rounded-xl border transition-all duration-200 ${
                  task.completed
                    ? 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800'
                    : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-md'
                }`}
              >
                {/* Timeline dot */}
                <div className="flex flex-col items-center">
                  <button
                    onClick={() => toggleTask(task.id)}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                      task.completed
                        ? 'bg-green-500 border-green-500 text-white'
                        : 'border-gray-300 dark:border-gray-600 hover:border-indigo-500'
                    }`}
                  >
                    {task.completed && <Check className="w-3 h-3" />}
                  </button>
                  {index < tasks.length - 1 && (
                    <div className="w-0.5 h-12 bg-gray-200 dark:bg-gray-700 mt-2" />
                  )}
                </div>

                {/* Task content */}
                <div className="flex-1 min-w-0">
                  {task.startTime && task.endTime && (
                    <div className="text-sm font-medium text-indigo-600 dark:text-indigo-400 mb-1">
                      {task.startTime} - {task.endTime}
                    </div>
                  )}
                  
                  {editingTask === task.id ? (
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') saveEdit(task.id);
                          if (e.key === 'Escape') cancelEdit();
                        }}
                        className="flex-1 px-3 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        autoFocus
                      />
                      <button
                        onClick={() => saveEdit(task.id)}
                        className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                      >
                        Save
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-gray-900 dark:text-white ${
                          task.completed ? 'line-through opacity-75' : ''
                        }`}
                      >
                        {task.text}
                      </span>
                      <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => startEdit(task)}
                          className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteTask(task.id)}
                          className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}