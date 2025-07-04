import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2 } from 'lucide-react';

interface VoiceInputProps {
  onVoiceCommand: (command: string) => void;
  isListening?: boolean;
}

export function VoiceInput({ onVoiceCommand, isListening = false }: VoiceInputProps) {
  const [isSupported, setIsSupported] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [transcript, setTranscript] = useState('');

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setIsSupported(true);
      
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onstart = () => {
        setIsActive(true);
        setTranscript('');
      };

      recognitionInstance.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        setTranscript(finalTranscript || interimTranscript);

        if (finalTranscript) {
          onVoiceCommand(finalTranscript);
          setIsActive(false);
        }
      };

      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsActive(false);
      };

      recognitionInstance.onend = () => {
        setIsActive(false);
      };

      setRecognition(recognitionInstance);
    }
  }, [onVoiceCommand]);

  const toggleListening = () => {
    if (!recognition) return;

    if (isActive) {
      recognition.stop();
    } else {
      recognition.start();
    }
  };

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  if (!isSupported) {
    return null;
  }

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={toggleListening}
        className={`p-2 rounded-full transition-colors ${
          isActive
            ? 'bg-red-500 text-white animate-pulse'
            : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600'
        }`}
        title={isActive ? 'Stop listening' : 'Start voice input'}
      >
        {isActive ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
      </button>

      {transcript && (
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            "{transcript}"
          </span>
          <button
            onClick={() => speak(transcript)}
            className="p-1 rounded text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            title="Speak transcript"
          >
            <Volume2 className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  );
}

// Extend the Window interface to include speech recognition
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}