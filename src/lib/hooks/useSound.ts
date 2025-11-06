// src/lib/hooks/useSound.ts
'use client';

import { useCallback } from 'react';

export function useSound() {
  const playSound = useCallback((frequency: number, duration: number) => {
    if (typeof window === 'undefined') return;
    
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = frequency;
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration);
    } catch (error) {
      console.warn('Sound not supported:', error);
    }
  }, []);

  const playNewOrder = useCallback(() => {
    // Play notification sound (beep beep)
    playSound(800, 0.15);
    setTimeout(() => playSound(800, 0.15), 200);
  }, [playSound]);

  const playOrderReady = useCallback(() => {
    // Play success sound (ascending tones)
    playSound(523, 0.1); // C
    setTimeout(() => playSound(659, 0.1), 100); // E
    setTimeout(() => playSound(784, 0.2), 200); // G
  }, [playSound]);

  return {
    playNewOrder,
    playOrderReady,
  };
}