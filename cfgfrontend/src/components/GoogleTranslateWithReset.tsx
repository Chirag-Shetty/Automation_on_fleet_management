import React, { useEffect, useRef, useState } from 'react';
import './GoogleTranslateWithReset.css';

interface GoogleTranslateWithResetProps {
  className?: string;
}

interface Position {
  x: number;
  y: number;
}

const GoogleTranslateWithReset: React.FC<GoogleTranslateWithResetProps> = ({ className = '' }) => {
  const translateRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState<Position>({ x: 20, y: 20 });
  const [dragOffset, setDragOffset] = useState<Position>({ x: 0, y: 0 });
  const [showResetButton, setShowResetButton] = useState(false);

  const defaultPosition = { x: 20, y: 20 };

  // Load saved position from localStorage on component mount
  useEffect(() => {
    const savedPosition = localStorage.getItem('googleTranslatePosition');
    if (savedPosition) {
      try {
        const parsedPosition = JSON.parse(savedPosition);
        setPosition(parsedPosition);
      } catch (error) {
        console.warn('Failed to parse saved position:', error);
      }
    }
  }, []);

  // Save position to localStorage whenever it changes
  useEffect(() => {
    if (!isDragging) {
      localStorage.setItem('googleTranslatePosition', JSON.stringify(position));
    }
  }, [position, isDragging]);

  useEffect(() => {
    // Load Google Translate script
    const script = document.createElement('script');
    script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    document.head.appendChild(script);

    // Initialize Google Translate
    (window as any).googleTranslateElementInit = () => {
      if (translateRef.current) {
        new (window as any).google.translate.TranslateElement({
          pageLanguage: 'en',
          includedLanguages: 'en,ta,hi', // English, Tamil, Hindi
          layout: (window as any).google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false,
          multilanguagePage: true,
          gaTrack: false,
        }, translateRef.current);
      }
    };

    return () => {
      // Cleanup
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
      delete (window as any).googleTranslateElementInit;
    };
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
      setIsDragging(true);
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;
      
      // Get viewport dimensions
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      // Get container dimensions
      const containerWidth = containerRef.current?.offsetWidth || 200;
      const containerHeight = containerRef.current?.offsetHeight || 60;
      
      // Constrain to viewport bounds
      const constrainedX = Math.max(0, Math.min(newX, viewportWidth - containerWidth));
      const constrainedY = Math.max(0, Math.min(newY, viewportHeight - containerHeight));
      
      setPosition({ x: constrainedX, y: constrainedY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleResetPosition = () => {
    setPosition(defaultPosition);
    localStorage.removeItem('googleTranslatePosition');
  };

  const handleMouseEnter = () => {
    setShowResetButton(true);
  };

  const handleMouseLeave = () => {
    setShowResetButton(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragOffset]);

  return (
    <div 
      ref={containerRef}
      className={`google-translate-container ${className} ${isDragging ? 'dragging' : ''}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        cursor: isDragging ? 'grabbing' : 'grab',
      }}
      onMouseDown={handleMouseDown}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="drag-handle">
        <span className="drag-icon">⋮⋮</span>
      </div>
      <div ref={translateRef} className="google-translate-widget"></div>
      {showResetButton && (
        <button 
          className="reset-button"
          onClick={handleResetPosition}
          title="Reset to default position"
        >
          ↺
        </button>
      )}
    </div>
  );
};

export default GoogleTranslateWithReset; 