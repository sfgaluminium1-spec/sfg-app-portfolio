
'use client';

import { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Square } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'react-hot-toast';

interface VoiceDictationProps {
  onTranscript: (text: string) => void;
  placeholder?: string;
  className?: string;
}

declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

export function VoiceDictation({ onTranscript, placeholder = "Tap to speak...", className = "" }: VoiceDictationProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const [transcript, setTranscript] = useState('');

  useEffect(() => {
    // Check if speech recognition is supported
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      setIsSupported(true);
      
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'en-GB'; // UK English for SFG Aluminium
      
      recognitionInstance.onstart = () => {
        setIsListening(true);
        toast.success('🎤 Listening... Speak now');
      };
      
      recognitionInstance.onresult = (event: any) => {
        let finalTranscript = '';
        let interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcriptPart = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcriptPart;
          } else {
            interimTranscript += transcriptPart;
          }
        }
        
        const currentTranscript = finalTranscript || interimTranscript;
        setTranscript(currentTranscript);
        
        if (finalTranscript) {
          onTranscript(finalTranscript.trim());
          toast.success('✅ Voice note recorded');
        }
      };
      
      recognitionInstance.onerror = (event: any) => {
        setIsListening(false);
        console.error('Speech recognition error:', event.error);
        
        switch (event.error) {
          case 'no-speech':
            toast.error('No speech detected. Please try again.');
            break;
          case 'audio-capture':
            toast.error('Microphone not accessible. Check permissions.');
            break;
          case 'not-allowed':
            toast.error('Microphone access denied. Enable in browser settings.');
            break;
          case 'network':
            toast.error('Network error. Check your connection.');
            break;
          default:
            toast.error('Speech recognition error. Please try again.');
        }
      };
      
      recognitionInstance.onend = () => {
        setIsListening(false);
        setTranscript('');
      };
      
      setRecognition(recognitionInstance);
    } else {
      setIsSupported(false);
      console.warn('Speech Recognition not supported in this browser');
    }
  }, [onTranscript]);

  const startListening = useCallback(() => {
    if (recognition && !isListening) {
      try {
        setTranscript('');
        recognition.start();
      } catch (error) {
        console.error('Error starting speech recognition:', error);
        toast.error('Failed to start voice recording');
      }
    }
  }, [recognition, isListening]);

  const stopListening = useCallback(() => {
    if (recognition && isListening) {
      recognition.stop();
    }
  }, [recognition, isListening]);

  if (!isSupported) {
    return (
      <div className={`text-center p-2 text-gray-500 text-sm ${className}`}>
        <p>Voice dictation not supported in this browser</p>
      </div>
    );
  }

  return (
    <div className={`voice-dictation ${className}`}>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant={isListening ? "destructive" : "outline"}
          size="sm"
          onClick={isListening ? stopListening : startListening}
          className={`flex items-center gap-2 ${
            isListening 
              ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse' 
              : 'border-warren-blue-300 hover:bg-warren-blue-50'
          }`}
          disabled={!isSupported}
        >
          {isListening ? (
            <>
              <Square className="w-4 h-4" />
              Stop
            </>
          ) : (
            <>
              <Mic className="w-4 h-4" />
              Voice
            </>
          )}
        </Button>
        
        {isListening && (
          <Badge variant="secondary" className="bg-red-100 text-red-800">
            Recording...
          </Badge>
        )}
      </div>
      
      {/* Live transcript display */}
      {isListening && transcript && (
        <div className="mt-2 p-2 bg-gray-50 dark:bg-warren-gray-800 rounded text-sm text-gray-700 dark:text-warren-gray-300 border-l-4 border-warren-blue-500">
          <p className="text-xs text-gray-500 dark:text-warren-gray-500 mb-1">Live transcript:</p>
          <p>"{transcript}"</p>
        </div>
      )}
      
      {/* Usage hint */}
      <div className="mt-1 text-xs text-gray-500 dark:text-warren-gray-500">
        💡 Tip: Speak clearly for 2-3 seconds for best results
      </div>
    </div>
  );
}
