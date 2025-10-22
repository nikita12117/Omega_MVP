import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Brain, Loader2 } from 'lucide-react';

/**
 * Long-press confirmation button for v-9 transformations
 * Requires 2-second hold to confirm action
 * Shows left-to-right color fill animation during hold
 */
const V9TransformButton = ({ 
  onClick, 
  disabled = false, 
  isTransforming = false,
  className = "",
  children
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const [fillProgress, setFillProgress] = useState(0);
  const pressTimerRef = useRef(null);
  const progressIntervalRef = useRef(null);

  const startPress = () => {
    if (disabled || isTransforming) return;
    
    setIsPressed(true);
    setFillProgress(0);
    
    // Progress animation (0-100 over 2 seconds)
    const startTime = Date.now();
    progressIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min((elapsed / 2000) * 100, 100);
      setFillProgress(progress);
    }, 16); // ~60fps
    
    // Trigger action after 2 seconds
    pressTimerRef.current = setTimeout(() => {
      setIsPressed(false);
      setFillProgress(0);
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
      onClick && onClick();
    }, 2000);
  };

  const cancelPress = () => {
    if (pressTimerRef.current) {
      clearTimeout(pressTimerRef.current);
    }
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }
    setIsPressed(false);
    setFillProgress(0);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (pressTimerRef.current) clearTimeout(pressTimerRef.current);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, []);

  return (
    <Button
      onMouseDown={startPress}
      onMouseUp={cancelPress}
      onMouseLeave={cancelPress}
      onTouchStart={startPress}
      onTouchEnd={cancelPress}
      disabled={disabled || isTransforming}
      className={`relative overflow-hidden ${className}`}
      style={{ WebkitUserSelect: 'none', userSelect: 'none' }}
    >
      {/* Background fill animation */}
      <div 
        className="absolute inset-0 bg-gradient-to-r from-[#1e3a8a] to-[#06d6a0] transition-transform origin-left"
        style={{ 
          transform: `scaleX(${fillProgress / 100})`,
          transitionDuration: '0ms'
        }}
      />
      
      {/* Button content */}
      <span className="relative z-10 flex items-center justify-center">
        {isTransforming ? (
          <>
            <Loader2 className="mr-2 h-3 w-3 animate-spin" />
            Transformuji...
          </>
        ) : (
          <>
            <Brain className="mr-2 h-3 w-3" />
            {children || 'v-9 Transformace'}
          </>
        )}
      </span>

      {/* Edge indicators (only visible when not pressed) */}
      {!isPressed && !isTransforming && (
        <>
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-r from-[#06d6a0] to-transparent" />
          <div className="absolute right-0 top-0 bottom-0 w-1 bg-gradient-to-l from-[#06d6a0] to-transparent" />
        </>
      )}
    </Button>
  );
};

export default V9TransformButton;
