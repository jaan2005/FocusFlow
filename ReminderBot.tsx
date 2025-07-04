import React, { useState, useEffect } from 'react';
import { Plus, Bell, Check, Trash2, Clock, Calendar } from 'lucide-react';
import type { Reminder } from '../../types';
import { getTodayDateString, getCurrentTimeString } from '../../utils/timeUtils';

interface ReminderBotProps {
  reminders: Reminder[];
  onRemindersChange: (reminders: Reminder[]) => void;
}

export function ReminderBot({ reminders, onRemindersChange }: ReminderBotProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newReminder, setNewReminder] = useState({
    title: '',
    description: '',
    time: getCurrentTimeString(),
    date: getTodayDateString(),
    recurring: 'none' as const,
  });

  useEffect(() => {
    // Check for due reminders every minute
    const interval = setInterval(checkDueReminders, 60000);
    return () => clearInterval(interval);
  }, [reminders]);

  const checkDueReminders = () => {
    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5);
    const currentDate = now.toISOString().split('T')[0];

    reminders.forEach(reminder => {
      if (
        !reminder.completed &&
        reminder.date === currentDate &&
        reminder.time === currentTime
      ) {
        showNotification(reminder);
      }
    });
  };

  const showNotification = (reminder: Reminder) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(reminder.title, {
        body: reminder.description || 'Reminder notification',
        icon: '/focus-icon.svg',
      });
    }
  };

  const addReminder = () => {
    if (!newReminder.title.trim()) return;

    const reminder: Reminder = {
      id: `reminder-${Date.now()}`,
      title: newReminder.title.trim(),
      description: newReminder.description.trim() || undefined,
      time: newReminder.time,
      date: newReminder.date,
      completed: false,
      recurring: newReminder.recurring,
    };

    onRemindersChange([...reminders, reminder]);
    setNewReminder({
      title: '',
      description: '',
      time: getCurrentTimeString(),
      date: getTodayDateString(),
      recurring: 'none',
    });
    setShowAddForm(false);

    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  };

  const toggleReminder = (reminderId: string) => {
    onRemindersChange(
      reminders.map(reminder =>
        reminder.id === reminderId
          ? { ...reminder, completed: !reminder.completed }
          : reminder
      )
    );
  };

  const deleteReminder = (reminderId: string) => {
    onRemindersChange(reminders.filter(reminder => reminder.id !== reminderId));
  };

  const formatReminderTime = (reminder: Reminder) => {
    const reminderDate = new Date(`${reminder.date}T${reminder.time}`);
    const now = new Date();
    
    if (reminder.date === getTodayDateString()) {
      return `Today at ${reminderDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (reminder.date === new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]) {
      return `Tomorrow at ${reminderDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return `${reminderDate.toLocaleDateString()} at ${reminderDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
  };

  const upcomingReminders = reminders
    .filter(r => !r.completed)
    .sort((a, b) => new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime());

  const completedReminders = reminders.filter(r => r.completed);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Reminder Bot</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {upcomingReminders.length} upcoming reminders
            </p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Reminder</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Upcoming Reminders */}
        {upcomingReminders.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Bell className="w-5 h-5 mr-2" />
              Upcoming Reminders
            </h3>
            <div className="space-y-3">
              {upcomingReminders.map((reminder) => (
                <div
                  key={reminder.id}
                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                        {reminder.title}
                      </h4>
                      {reminder.description && (
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                          {reminder.description}
                        </p>
                      )}
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Clock className="w-4 h-4 mr-1" />
                        {formatReminderTime(reminder)}
                        {reminder.recurring !== 'none' && (
                          <span className="ml-3 px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded text-xs">
                            {reminder.recurring}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => toggleReminder(reminder.id)}
                        className="p-2 text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteReminder(reminder.id)}
                        className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Completed Reminders */}
        {completedReminders.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Check className="w-5 h-5 mr-2" />
              Completed
            </h3>
            <div className="space-y-3">
              {completedReminders.map((reminder) => (
                <div
                  key={reminder.id}
                  className="bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 rounded-xl p-4 opacity-75"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-1 line-through">
                        {reminder.title}
                      </h4>
                      {reminder.description && (
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                          {reminder.description}
                        </p>
                      )}
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Clock className="w-4 h-4 mr-1" />
                        {formatReminderTime(reminder)}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => toggleReminder(reminder.id)}
                        className="p-2 text-green-600 dark:text-green-400 hover:text-gray-400 transition-colors"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteReminder(reminder.id)}
                        className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {reminders.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No reminders yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Create your first reminder to stay on top of your tasks and appointments.
            </p>
            <button
              onClick={() => setShowAddForm(true)}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors inline-flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Create Reminder</span>
            </button>
          </div>
        )}
      </div>

      {/* Add Reminder Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Add New Reminder
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  value={newReminder.title}
                  onChange={(e) => setNewReminder({ ...newReminder, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Reminder title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description (optional)
                </label>
                <textarea
                  value={newReminder.description}
                  onChange={(e) => setNewReminder({ ...newReminder, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Additional details"
                  rows={2}
                />
              </div>
              
              <div className="flex space-x-3">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={newReminder.date}
                    onChange={(e) => setNewReminder({ ...newReminder, date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Time
                  </label>
                  <input
                    type="time"
                    value={newReminder.time}
                    onChange={(e) => setNewReminder({ ...newReminder, time: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Recurring
                </label>
                <select
                  value={newReminder.recurring}
                  onChange={(e) => setNewReminder({ ...newReminder, recurring: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="none">No repeat</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={addReminder}
                disabled={!newReminder.title.trim()}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Add Reminder
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