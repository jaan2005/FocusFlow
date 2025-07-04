import React, { useState, useRef, useEffect } from 'react';
import { Send, Calendar, Trash2, Loader2, Brain, Sparkles, Clock, BookOpen, Lightbulb } from 'lucide-react';
import type { ChatMessage, Task } from '../../types';
import { generateAIResponse, parseScheduleFromText } from '../../utils/aiUtils';

interface AssistantChatProps {
  messages: ChatMessage[];
  onMessagesChange: (messages: ChatMessage[]) => void;
  onScheduleGenerated: (tasks: Task[]) => void;
}

export function AssistantChat({ messages, onMessagesChange, onScheduleGenerated }: AssistantChatProps) {
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      text: text.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    const updatedMessages = [...messages, userMessage];
    onMessagesChange(updatedMessages);
    setInputText('');
    setIsLoading(true);

    try {
      const aiResponse = await generateAIResponse(text, messages);
      
      const assistantMessage: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        text: aiResponse,
        isUser: false,
        timestamp: new Date(),
      };

      onMessagesChange([...updatedMessages, assistantMessage]);

      // Parse and extract tasks from AI response if it contains scheduling
      const tasks = parseScheduleFromText(aiResponse);
      if (tasks.length > 0) {
        onScheduleGenerated(tasks);
      }
    } catch (error) {
      console.error('Error generating AI response:', error);
      const errorMessage: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        text: 'I apologize, but I encountered an error processing your request. Please try again or rephrase your question.',
        isUser: false,
        timestamp: new Date(),
      };
      onMessagesChange([...updatedMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputText);
  };

  const handleQuickAction = (action: string) => {
    const quickActions = {
      'study-night': 'Create a detailed study schedule for tonight starting from 10 PM until 2 AM, focusing on deep learning',
      'morning-routine': 'Design an energizing morning routine from 6 AM to 9 AM for maximum productivity',
      'work-schedule': 'Plan my work day from 9 AM to 6 PM with focus blocks and breaks',
      'evening-relax': 'Create a relaxing evening schedule from 7 PM to 10 PM for unwinding',
      'weekend-plan': 'Suggest a balanced weekend schedule mixing productivity and relaxation',
      'exam-prep': 'Help me create an intensive exam preparation schedule for the next 3 days'
    };
    
    handleSendMessage(quickActions[action as keyof typeof quickActions] || action);
  };

  const clearChat = () => {
    onMessagesChange([]);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-indigo-900">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-900 animate-pulse"></div>
            </div>
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Mini ChatGPT
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm flex items-center">
                <Sparkles className="w-3 h-3 mr-1" />
                AI-powered assistant for everything
              </p>
            </div>
          </div>
          <button
            onClick={clearChat}
            disabled={messages.length === 0}
            className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.length === 0 && (
          <div className="text-center py-12">
            <div className="relative mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-3xl flex items-center justify-center mx-auto shadow-2xl">
                <Brain className="w-10 h-10 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
                <Sparkles className="w-3 h-3 text-yellow-800" />
              </div>
            </div>
            
            <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
              {getGreeting()}! I'm your Mini ChatGPT
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed">
              Ask me anything! I can help with schedules, answer questions, provide advice, explain concepts, 
              solve problems, and much more. I understand context and provide intelligent responses.
            </p>
            
            {/* Enhanced Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-w-4xl mx-auto">
              <button
                onClick={() => handleQuickAction('study-night')}
                className="group p-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
              >
                <Clock className="w-5 h-5 mb-2 mx-auto group-hover:rotate-12 transition-transform" />
                <div className="font-semibold text-sm">Night Study Plan</div>
                <div className="text-xs opacity-90">Late night focus session</div>
              </button>
              
              <button
                onClick={() => handleQuickAction('morning-routine')}
                className="group p-4 bg-gradient-to-r from-yellow-500 to-orange-600 text-white rounded-2xl hover:from-yellow-600 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
              >
                <Calendar className="w-5 h-5 mb-2 mx-auto group-hover:rotate-12 transition-transform" />
                <div className="font-semibold text-sm">Morning Routine</div>
                <div className="text-xs opacity-90">Energizing start</div>
              </button>
              
              <button
                onClick={() => handleQuickAction('work-schedule')}
                className="group p-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
              >
                <BookOpen className="w-5 h-5 mb-2 mx-auto group-hover:rotate-12 transition-transform" />
                <div className="font-semibold text-sm">Work Schedule</div>
                <div className="text-xs opacity-90">Productive day plan</div>
              </button>
              
              <button
                onClick={() => handleQuickAction('evening-relax')}
                className="group p-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-2xl hover:from-purple-600 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
              >
                <Sparkles className="w-5 h-5 mb-2 mx-auto group-hover:rotate-12 transition-transform" />
                <div className="font-semibold text-sm">Evening Relax</div>
                <div className="text-xs opacity-90">Unwind & recharge</div>
              </button>
              
              <button
                onClick={() => handleQuickAction('weekend-plan')}
                className="group p-4 bg-gradient-to-r from-teal-500 to-cyan-600 text-white rounded-2xl hover:from-teal-600 hover:to-cyan-700 transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
              >
                <Calendar className="w-5 h-5 mb-2 mx-auto group-hover:rotate-12 transition-transform" />
                <div className="font-semibold text-sm">Weekend Plan</div>
                <div className="text-xs opacity-90">Balance & fun</div>
              </button>
              
              <button
                onClick={() => handleQuickAction('exam-prep')}
                className="group p-4 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-2xl hover:from-red-600 hover:to-rose-700 transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
              >
                <Lightbulb className="w-5 h-5 mb-2 mx-auto group-hover:rotate-12 transition-transform" />
                <div className="font-semibold text-sm">Exam Prep</div>
                <div className="text-xs opacity-90">Intensive study</div>
              </button>
            </div>

            <div className="mt-8 text-sm text-gray-500 dark:text-gray-400">
              💡 Try asking: "Explain quantum physics", "Plan my day", "What's the weather like?", "Help me learn Spanish"
            </div>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} animate-fade-in`}
          >
            <div className={`flex items-start space-x-3 max-w-4xl ${message.isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
              {/* Avatar */}
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                message.isUser 
                  ? 'bg-gradient-to-br from-indigo-500 to-purple-600' 
                  : 'bg-gradient-to-br from-emerald-500 to-teal-600'
              }`}>
                {message.isUser ? (
                  <span className="text-white text-sm font-semibold">U</span>
                ) : (
                  <Brain className="w-4 h-4 text-white" />
                )}
              </div>

              {/* Message Bubble */}
              <div
                className={`px-6 py-4 rounded-3xl shadow-lg backdrop-blur-sm ${
                  message.isUser
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white'
                    : 'bg-white/90 dark:bg-gray-800/90 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700'
                }`}
              >
                <div className="whitespace-pre-wrap text-sm leading-relaxed">
                  {message.text}
                </div>
                <div
                  className={`text-xs mt-3 opacity-70 ${
                    message.isUser ? 'text-indigo-100' : 'text-gray-500 dark:text-gray-400'
                  }`}
                >
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start animate-fade-in">
            <div className="flex items-start space-x-3 max-w-4xl">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                <Brain className="w-4 h-4 text-white" />
              </div>
              <div className="bg-white/90 dark:bg-gray-800/90 px-6 py-4 rounded-3xl shadow-lg backdrop-blur-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-3">
                  <Loader2 className="w-4 h-4 animate-spin text-indigo-600 dark:text-indigo-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Mini ChatGPT is thinking...</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Enhanced Input */}
      <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        <form onSubmit={handleSubmit} className="flex space-x-4">
          <div className="flex-1 relative">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask me anything... schedules, questions, advice, explanations..."
              disabled={isLoading}
              className="w-full px-6 py-4 border border-gray-300 dark:border-gray-600 rounded-2xl bg-white/90 dark:bg-gray-800/90 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50 backdrop-blur-sm shadow-lg transition-all duration-200"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <Sparkles className="w-4 h-4 text-gray-400" />
            </div>
          </div>
          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2 shadow-lg transform hover:scale-105"
          >
            <Send className="w-5 h-5" />
            <span className="font-semibold">Send</span>
          </button>
        </form>
        
        <div className="mt-3 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Mini ChatGPT can make mistakes. Consider checking important information.
          </p>
        </div>
      </div>
    </div>
  );
}