
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Crown, Lock, Unlock } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SimpleAuthProps {
  children: React.ReactNode;
  onAuthenticated?: () => void;
}

export default function SimpleAuth({ children, onAuthenticated }: SimpleAuthProps) {
  const [sequence, setSequence] = useState<number[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [showHint, setShowHint] = useState(false);

  // Simple pattern: Top-left, Top-right, Bottom-right, Bottom-left (draw a "square")
  const correctSequence = [1, 3, 9, 7]; // Grid positions 1-9

  const handleButtonClick = (position: number) => {
    const newSequence = [...sequence, position];
    setSequence(newSequence);

    // Check if pattern matches
    if (newSequence.length === correctSequence.length) {
      if (JSON.stringify(newSequence) === JSON.stringify(correctSequence)) {
        setIsAuthenticated(true);
        onAuthenticated?.();
      } else {
        setAttempts(prev => prev + 1);
        setSequence([]);
        
        // Show hint after 2 failed attempts
        if (attempts >= 1) {
          setShowHint(true);
        }
      }
    }
  };

  const resetSequence = () => {
    setSequence([]);
  };

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-900/20 via-black to-orange-900/20">
      <div className="max-w-md mx-auto p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="warren-card rounded-2xl p-8 text-center relative overflow-hidden"
        >
          {/* Background Effects */}
          <div className="absolute inset-0 diamond-dust opacity-20"></div>
          
          <div className="relative z-10">
            <motion.div
              animate={{ rotateY: [0, 360] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="mb-6"
            >
              <Crown className="w-16 h-16 text-yellow-400 mx-auto neon-glow" />
            </motion.div>

            <h2 className="font-orbitron text-2xl font-bold text-yellow-400 mb-2 neon-text">
              Executive Access
            </h2>
            <p className="text-gray-300 mb-6">
              Draw your signature pattern to access premium content
            </p>

            {/* 3x3 Grid */}
            <div className="grid grid-cols-3 gap-3 mb-6 max-w-xs mx-auto">
              {Array.from({ length: 9 }, (_, i) => i + 1).map((position) => (
                <Button
                  key={position}
                  variant="outline"
                  className={`
                    w-16 h-16 border-2 rounded-lg transition-all duration-200
                    ${sequence.includes(position) 
                      ? 'bg-yellow-500/20 border-yellow-400 text-yellow-400' 
                      : 'border-gray-600 text-gray-400 hover:border-yellow-500/50'
                    }
                  `}
                  onClick={() => handleButtonClick(position)}
                >
                  {sequence.includes(position) && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-3 h-3 bg-yellow-400 rounded-full"
                    />
                  )}
                </Button>
              ))}
            </div>

            {/* Progress Indicator */}
            <div className="flex justify-center mb-4 space-x-2">
              {correctSequence.map((_, i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    i < sequence.length ? 'bg-yellow-400' : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>

            {/* Hint */}
            {showHint && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg"
              >
                <p className="text-sm text-yellow-300">
                  💡 Hint: Draw a square starting from top-left
                </p>
              </motion.div>
            )}

            {/* Controls */}
            <div className="flex justify-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={resetSequence}
                className="border-gray-600 text-gray-400 hover:border-yellow-500/50"
              >
                Reset
              </Button>
              
              {attempts >= 3 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowHint(true)}
                  className="border-yellow-500/50 text-yellow-400"
                >
                  Show Hint
                </Button>
              )}
            </div>

            {attempts > 0 && (
              <p className="text-sm text-gray-400 mt-4">
                Attempts: {attempts} • Pattern: {sequence.length}/{correctSequence.length}
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
