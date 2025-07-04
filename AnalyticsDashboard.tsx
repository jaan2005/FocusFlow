import React, { useMemo } from 'react';
import { BarChart3, TrendingUp, Clock, Target, Zap, Calendar, Award, CheckCircle2, Brain, Star } from 'lucide-react';
import type { Task, Habit, HabitCompletion, Goal, FocusSession } from '../../types';
import { getTodayDateString, getThisWeekDates } from '../../utils/timeUtils';

interface AnalyticsDashboardProps {
  tasks: Task[];
  habits: Habit[];
  habitCompletions: HabitCompletion[];
  goals: Goal[];
  focusSessions: FocusSession[];
}

export function AnalyticsDashboard({ tasks, habits, habitCompletions, goals, focusSessions }: AnalyticsDashboardProps) {
  const analytics = useMemo(() => {
    const today = getTodayDateString();
    const thisWeek = getThisWeekDates();
    
    // Calculate total focus time from study sessions
    const totalFocusTime = focusSessions
      .filter(session => session.completed)
      .reduce((total, session) => total + session.duration, 0);
    
    // Tasks analytics
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.completed).length;
    const tasksCompletionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    
    // Today's tasks
    const todayTasks = tasks.filter(task => {
      if (!task.startTime) return false;
      const taskDate = new Date().toISOString().split('T')[0];
      return taskDate === today;
    });
    const todayCompletedTasks = todayTasks.filter(task => task.completed).length;
    
    // Habits analytics
    const totalHabits = habits.length;
    const habitsCompletedToday = habitCompletions.filter(
      completion => completion.date === today && completion.completed
    ).length;
    const habitCompletionRate = totalHabits > 0 ? (habitsCompletedToday / totalHabits) * 100 : 0;
    
    // Best streak calculation
    const bestStreak = habits.length > 0 ? Math.max(...habits.map(h => h.streak), 0) : 0;
    
    // Goals analytics
    const totalGoals = goals.length;
    const completedGoals = goals.filter(goal => goal.status === 'completed').length;
    const activeGoals = goals.filter(goal => goal.status === 'active').length;
    const averageGoalProgress = goals.length > 0 
      ? goals.reduce((acc, goal) => acc + goal.progress, 0) / goals.length 
      : 0;
    
    // XP calculation
    const totalXP = habits.reduce((total, habit) => total + habit.xp, 0);
    
    // Productivity score calculation (0-100)
    const productivityScore = Math.round(
      (tasksCompletionRate * 0.3 + 
       habitCompletionRate * 0.3 + 
       averageGoalProgress * 0.2 + 
       Math.min(bestStreak * 2, 20) * 0.2)
    );
    
    // Category breakdown for tasks
    const categoryBreakdown = tasks.reduce((acc, task) => {
      const category = task.category || 'uncategorized';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    // Weekly trends calculation
    const weeklyTrends = thisWeek.map(date => {
      // Tasks completed on this date
      const dayTasks = tasks.filter(task => {
        if (!task.startTime) return false;
        return task.completed && task.startTime.includes(date);
      }).length;
      
      // Focus time on this date
      const dayFocusTime = focusSessions
        .filter(session => {
          if (!session.completed) return false;
          const sessionDate = session.startTime.toISOString().split('T')[0];
          return sessionDate === date;
        })
        .reduce((total, session) => total + session.duration, 0);
      
      // Habits completed on this date
      const dayHabits = habitCompletions.filter(
        completion => completion.date === date && completion.completed
      ).length;
      
      return {
        date,
        focusTime: dayFocusTime,
        tasks: dayTasks,
        habits: dayHabits,
      };
    });
    
    // Habit category breakdown
    const habitCategoryBreakdown = habits.reduce((acc, habit) => {
      acc[habit.category] = (acc[habit.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    // Goal category breakdown
    const goalCategoryBreakdown = goals.reduce((acc, goal) => {
      acc[goal.category] = (acc[goal.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    // Performance metrics
    const weeklyTasksCompleted = weeklyTrends.reduce((sum, day) => sum + day.tasks, 0);
    const weeklyHabitsCompleted = weeklyTrends.reduce((sum, day) => sum + day.habits, 0);
    const weeklyFocusTime = weeklyTrends.reduce((sum, day) => sum + day.focusTime, 0);
    
    // Consistency score (how many days this week had activity)
    const activeDays = weeklyTrends.filter(day => day.tasks > 0 || day.habits > 0 || day.focusTime > 0).length;
    const consistencyScore = Math.round((activeDays / 7) * 100);
    
    return {
      totalFocusTime,
      totalTasks,
      completedTasks,
      tasksCompletionRate,
      todayCompletedTasks: todayCompletedTasks,
      totalHabits,
      habitsCompletedToday,
      habitCompletionRate,
      bestStreak,
      totalGoals,
      completedGoals,
      activeGoals,
      averageGoalProgress,
      totalXP,
      productivityScore,
      categoryBreakdown,
      habitCategoryBreakdown,
      goalCategoryBreakdown,
      weeklyTrends,
      weeklyTasksCompleted,
      weeklyHabitsCompleted,
      weeklyFocusTime,
      consistencyScore,
    };
  }, [tasks, habits, habitCompletions, goals, focusSessions]);

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getInsights = () => {
    const insights = [];
    
    // Productivity insights
    if (analytics.productivityScore >= 90) {
      insights.push("🏆 Outstanding productivity! You're in the top 1% of performers. Keep this momentum!");
    } else if (analytics.productivityScore >= 80) {
      insights.push("🎉 Excellent productivity! You're crushing your goals and maintaining great habits.");
    } else if (analytics.productivityScore >= 70) {
      insights.push("👍 Great progress! You're building strong momentum. Focus on consistency.");
    } else if (analytics.productivityScore >= 60) {
      insights.push("📈 Good foundation! Keep building your habits and completing tasks regularly.");
    } else if (analytics.productivityScore >= 40) {
      insights.push("💪 You're making progress! Focus on completing more tasks and building habit streaks.");
    } else {
      insights.push("🌱 Every journey starts with a single step. Start small and build momentum gradually.");
    }
    
    // Consistency insights
    if (analytics.consistencyScore >= 85) {
      insights.push(`⭐ Amazing consistency! You've been active ${Math.round(analytics.consistencyScore)}% of this week.`);
    } else if (analytics.consistencyScore >= 70) {
      insights.push(`🔄 Good consistency at ${analytics.consistencyScore}%. Try to be active every day this week.`);
    } else if (analytics.consistencyScore > 0) {
      insights.push(`📅 Work on consistency - you've been active ${analytics.consistencyScore}% of days. Aim for daily progress.`);
    }
    
    // Streak insights
    if (analytics.bestStreak >= 30) {
      insights.push(`🔥 Incredible ${analytics.bestStreak}-day streak! You've mastered the art of consistency.`);
    } else if (analytics.bestStreak >= 21) {
      insights.push(`🌟 Amazing ${analytics.bestStreak}-day streak! You've built a strong habit foundation.`);
    } else if (analytics.bestStreak >= 14) {
      insights.push(`⚡ Great ${analytics.bestStreak}-day streak! You're developing excellent habits.`);
    } else if (analytics.bestStreak >= 7) {
      insights.push(`🎯 Nice ${analytics.bestStreak}-day streak! Keep going to build even stronger habits.`);
    } else if (analytics.bestStreak >= 3) {
      insights.push(`🌱 Good ${analytics.bestStreak}-day streak! You're on the right track.`);
    }
    
    // Focus time insights
    if (analytics.totalFocusTime >= 300) {
      insights.push("⏰ Exceptional focus time! You're dedicating serious time to deep work and learning.");
    } else if (analytics.totalFocusTime >= 180) {
      insights.push("👌 Excellent focus time! You're building strong concentration habits.");
    } else if (analytics.totalFocusTime >= 120) {
      insights.push("⏱️ Good focus time! Try to reach 3+ hours daily for maximum productivity.");
    } else if (analytics.totalFocusTime > 0) {
      insights.push("🎯 Start increasing your focus time. Even 25-minute sessions can make a big difference.");
    } else {
      insights.push("⏰ Begin using the focus timer to track your deep work sessions and build concentration.");
    }
    
    // Task completion insights
    if (analytics.tasksCompletionRate >= 90) {
      insights.push("✅ Outstanding task completion rate! You're highly effective at execution.");
    } else if (analytics.tasksCompletionRate >= 80) {
      insights.push("📋 Excellent task completion! You're great at getting things done.");
    } else if (analytics.tasksCompletionRate >= 70) {
      insights.push("✔️ Good task completion rate! Focus on prioritizing your most important tasks.");
    } else if (analytics.totalTasks > 0) {
      insights.push("📝 Break large tasks into smaller, manageable steps for better completion rates.");
    }
    
    // Habit insights
    if (analytics.habitCompletionRate >= 90) {
      insights.push("🎯 Perfect habit consistency! You're building an incredibly strong foundation.");
    } else if (analytics.habitCompletionRate >= 80) {
      insights.push("🔄 Excellent habit consistency! You're on track for long-term success.");
    } else if (analytics.totalHabits > 0) {
      insights.push("💫 Focus on completing your daily habits. Small consistent actions lead to big results.");
    }
    
    // Goal insights
    if (analytics.averageGoalProgress >= 90) {
      insights.push("🚀 Outstanding goal progress! You're well on your way to achieving everything you set out to do.");
    } else if (analytics.averageGoalProgress >= 75) {
      insights.push("🎯 Great progress on your goals! Keep up the momentum.");
    } else if (analytics.totalGoals > 0) {
      insights.push("📊 Break your goals into smaller subtasks to maintain steady progress.");
    }
    
    // XP and gamification insights
    if (analytics.totalXP >= 1000) {
      insights.push(`🏆 Incredible! You've earned ${analytics.totalXP} XP. You're a productivity champion!`);
    } else if (analytics.totalXP >= 500) {
      insights.push(`⭐ Amazing! ${analytics.totalXP} XP earned. You're building serious momentum!`);
    } else if (analytics.totalXP >= 100) {
      insights.push(`🌟 Great job! ${analytics.totalXP} XP earned. Keep building those habits!`);
    } else if (analytics.totalXP > 0) {
      insights.push(`🎮 You've earned ${analytics.totalXP} XP! Complete more habits to level up.`);
    }
    
    // Weekly performance insights
    if (analytics.weeklyTasksCompleted >= 20) {
      insights.push(`📈 Productive week! You completed ${analytics.weeklyTasksCompleted} tasks this week.`);
    }
    
    if (analytics.weeklyFocusTime >= 600) {
      insights.push(`⏰ Focused week! You spent ${formatTime(analytics.weeklyFocusTime)} in deep work this week.`);
    }
    
    // Category insights
    const topTaskCategory = Object.entries(analytics.categoryBreakdown)
      .sort(([,a], [,b]) => b - a)[0];
    
    if (topTaskCategory && topTaskCategory[1] > 0) {
      insights.push(`📊 You're most active in ${topTaskCategory[0]} with ${topTaskCategory[1]} tasks.`);
    }
    
    return insights.slice(0, 8); // Limit to 8 insights for better readability
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-indigo-900">
      {/* Enhanced Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Analytics Dashboard
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Track your productivity, habits, and progress
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              {analytics.productivityScore}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center justify-end">
              <Star className="w-3 h-3 mr-1" />
              Productivity Score
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {/* Enhanced Key Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-r from-blue-400 to-indigo-500 rounded-2xl p-5 text-white shadow-xl transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center space-x-2 mb-3">
              <Clock className="w-6 h-6" />
              <span className="text-sm font-semibold">Focus Time</span>
            </div>
            <div className="text-3xl font-bold">{formatTime(analytics.totalFocusTime)}</div>
            <div className="text-xs opacity-90 mt-1">Total focused</div>
          </div>
          
          <div className="bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl p-5 text-white shadow-xl transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center space-x-2 mb-3">
              <CheckCircle2 className="w-6 h-6" />
              <span className="text-sm font-semibold">Tasks</span>
            </div>
            <div className="text-3xl font-bold">{analytics.completedTasks}/{analytics.totalTasks}</div>
            <div className="text-xs opacity-90 mt-1">{Math.round(analytics.tasksCompletionRate)}% completed</div>
          </div>
          
          <div className="bg-gradient-to-r from-purple-400 to-pink-500 rounded-2xl p-5 text-white shadow-xl transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center space-x-2 mb-3">
              <Target className="w-6 h-6" />
              <span className="text-sm font-semibold">Habits</span>
            </div>
            <div className="text-3xl font-bold">{analytics.habitsCompletedToday}/{analytics.totalHabits}</div>
            <div className="text-xs opacity-90 mt-1">Today's completion</div>
          </div>
          
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl p-5 text-white shadow-xl transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center space-x-2 mb-3">
              <Award className="w-6 h-6" />
              <span className="text-sm font-semibold">Best Streak</span>
            </div>
            <div className="text-3xl font-bold">{analytics.bestStreak}</div>
            <div className="text-xs opacity-90 mt-1">Days in a row</div>
          </div>
          
          <div className="bg-gradient-to-r from-red-400 to-pink-500 rounded-2xl p-5 text-white shadow-xl transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center space-x-2 mb-3">
              <TrendingUp className="w-6 h-6" />
              <span className="text-sm font-semibold">Goals</span>
            </div>
            <div className="text-3xl font-bold">{analytics.completedGoals}/{analytics.totalGoals}</div>
            <div className="text-xs opacity-90 mt-1">{Math.round(analytics.averageGoalProgress)}% avg progress</div>
          </div>
          
          <div className="bg-gradient-to-r from-indigo-400 to-purple-500 rounded-2xl p-5 text-white shadow-xl transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center space-x-2 mb-3">
              <Zap className="w-6 h-6" />
              <span className="text-sm font-semibold">Total XP</span>
            </div>
            <div className="text-3xl font-bold">{analytics.totalXP}</div>
            <div className="text-xs opacity-90 mt-1">Experience points</div>
          </div>
          
          <div className="bg-gradient-to-r from-teal-400 to-cyan-500 rounded-2xl p-5 text-white shadow-xl transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center space-x-2 mb-3">
              <Calendar className="w-6 h-6" />
              <span className="text-sm font-semibold">Consistency</span>
            </div>
            <div className="text-3xl font-bold">{analytics.consistencyScore}%</div>
            <div className="text-xs opacity-90 mt-1">Weekly activity</div>
          </div>
          
          <div className="bg-gradient-to-r from-emerald-400 to-teal-500 rounded-2xl p-5 text-white shadow-xl transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center space-x-2 mb-3">
              <Brain className="w-6 h-6" />
              <span className="text-sm font-semibold">Today</span>
            </div>
            <div className="text-3xl font-bold">{analytics.todayCompletedTasks}</div>
            <div className="text-xs opacity-90 mt-1">Tasks completed</div>
          </div>
        </div>

        {/* Enhanced Weekly Trends */}
        <div className="bg-white/90 dark:bg-gray-800/90 rounded-2xl p-6 mb-8 border border-gray-200 dark:border-gray-700 shadow-xl backdrop-blur-sm">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <TrendingUp className="w-6 h-6 mr-2 text-indigo-600 dark:text-indigo-400" />
            Weekly Performance Trends
          </h3>
          <div className="space-y-4">
            {analytics.weeklyTrends.map((day, index) => {
              const date = new Date(day.date);
              const isToday = day.date === getTodayDateString();
              const maxTasks = Math.max(...analytics.weeklyTrends.map(d => d.tasks), 1);
              const maxFocusTime = Math.max(...analytics.weeklyTrends.map(d => d.focusTime), 1);
              const maxHabits = Math.max(...analytics.weeklyTrends.map(d => d.habits), 1);
              
              return (
                <div key={day.date} className={`flex items-center space-x-4 p-3 rounded-xl transition-all ${
                  isToday ? 'bg-indigo-50 dark:bg-indigo-900/20 ring-2 ring-indigo-500' : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                }`}>
                  <div className={`w-20 text-sm font-semibold ${
                    isToday ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-600 dark:text-gray-400'
                  }`}>
                    {date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                  </div>
                  
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center space-x-3">
                      <span className="text-xs text-gray-500 dark:text-gray-400 w-12">Tasks</span>
                      <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                        <div
                          className="bg-gradient-to-r from-green-400 to-emerald-500 h-3 rounded-full transition-all duration-500"
                          style={{ width: `${(day.tasks / maxTasks) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-600 dark:text-gray-400 w-8 font-semibold">{day.tasks}</span>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <span className="text-xs text-gray-500 dark:text-gray-400 w-12">Focus</span>
                      <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                        <div
                          className="bg-gradient-to-r from-blue-400 to-indigo-500 h-3 rounded-full transition-all duration-500"
                          style={{ width: `${(day.focusTime / maxFocusTime) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-600 dark:text-gray-400 w-8 font-semibold">{formatTime(day.focusTime)}</span>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <span className="text-xs text-gray-500 dark:text-gray-400 w-12">Habits</span>
                      <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                        <div
                          className="bg-gradient-to-r from-purple-400 to-pink-500 h-3 rounded-full transition-all duration-500"
                          style={{ width: `${(day.habits / maxHabits) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-600 dark:text-gray-400 w-8 font-semibold">{day.habits}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Enhanced Category Breakdowns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Task Categories */}
          <div className="bg-white/90 dark:bg-gray-800/90 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-xl backdrop-blur-sm">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
              <CheckCircle2 className="w-5 h-5 mr-2 text-indigo-600 dark:text-indigo-400" />
              Task Categories
            </h3>
            <div className="space-y-3">
              {Object.entries(analytics.categoryBreakdown).map(([category, count]) => {
                const total = Object.values(analytics.categoryBreakdown).reduce((a, b) => a + b, 0);
                const percentage = total > 0 ? (count / total) * 100 : 0;
                
                return (
                  <div key={category} className="flex items-center space-x-3">
                    <div className="w-20 text-sm text-gray-600 dark:text-gray-400 capitalize font-medium">
                      {category}
                    </div>
                    <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                      <div
                        className="bg-gradient-to-r from-indigo-400 to-purple-500 h-4 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <div className="w-12 text-sm text-gray-600 dark:text-gray-400 text-right font-semibold">
                      {count}
                    </div>
                  </div>
                );
              })}
              {Object.keys(analytics.categoryBreakdown).length === 0 && (
                <p className="text-gray-500 dark:text-gray-400 text-sm text-center py-4">No task data available</p>
              )}
            </div>
          </div>

          {/* Habit Categories */}
          <div className="bg-white/90 dark:bg-gray-800/90 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-xl backdrop-blur-sm">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
              <Target className="w-5 h-5 mr-2 text-purple-600 dark:text-purple-400" />
              Habit Categories
            </h3>
            <div className="space-y-3">
              {Object.entries(analytics.habitCategoryBreakdown).map(([category, count]) => {
                const total = Object.values(analytics.habitCategoryBreakdown).reduce((a, b) => a + b, 0);
                const percentage = total > 0 ? (count / total) * 100 : 0;
                
                return (
                  <div key={category} className="flex items-center space-x-3">
                    <div className="w-20 text-sm text-gray-600 dark:text-gray-400 capitalize font-medium">
                      {category}
                    </div>
                    <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                      <div
                        className="bg-gradient-to-r from-purple-400 to-pink-500 h-4 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <div className="w-12 text-sm text-gray-600 dark:text-gray-400 text-right font-semibold">
                      {count}
                    </div>
                  </div>
                );
              })}
              {Object.keys(analytics.habitCategoryBreakdown).length === 0 && (
                <p className="text-gray-500 dark:text-gray-400 text-sm text-center py-4">No habit data available</p>
              )}
            </div>
          </div>

          {/* Goal Categories */}
          <div className="bg-white/90 dark:bg-gray-800/90 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-xl backdrop-blur-sm">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-emerald-600 dark:text-emerald-400" />
              Goal Categories
            </h3>
            <div className="space-y-3">
              {Object.entries(analytics.goalCategoryBreakdown).map(([category, count]) => {
                const total = Object.values(analytics.goalCategoryBreakdown).reduce((a, b) => a + b, 0);
                const percentage = total > 0 ? (count / total) * 100 : 0;
                
                return (
                  <div key={category} className="flex items-center space-x-3">
                    <div className="w-20 text-sm text-gray-600 dark:text-gray-400 capitalize font-medium">
                      {category}
                    </div>
                    <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                      <div
                        className="bg-gradient-to-r from-emerald-400 to-teal-500 h-4 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <div className="w-12 text-sm text-gray-600 dark:text-gray-400 text-right font-semibold">
                      {count}
                    </div>
                  </div>
                );
              })}
              {Object.keys(analytics.goalCategoryBreakdown).length === 0 && (
                <p className="text-gray-500 dark:text-gray-400 text-sm text-center py-4">No goal data available</p>
              )}
            </div>
          </div>
        </div>

        {/* Enhanced AI Insights */}
        <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-900/20 dark:via-purple-900/20 dark:to-pink-900/20 rounded-2xl p-6 border border-indigo-200 dark:border-indigo-800 shadow-xl">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <Brain className="w-6 h-6 mr-2 text-indigo-600 dark:text-indigo-400" />
            AI Insights & Recommendations
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {getInsights().map((insight, index) => (
              <div key={index} className="bg-white/70 dark:bg-gray-800/70 rounded-xl p-4 backdrop-blur-sm border border-white/50 dark:border-gray-700/50 hover:bg-white/90 dark:hover:bg-gray-800/90 transition-all duration-300">
                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                  {insight}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}