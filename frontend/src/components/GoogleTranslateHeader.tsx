import React, { useEffect, useRef } from 'react';
import './GoogleTranslateHeader.css';

interface GoogleTranslateHeaderProps {
  className?: string;
}

const GoogleTranslateHeader: React.FC<GoogleTranslateHeaderProps> = ({ className = '' }) => {
  const translateRef = useRef<HTMLDivElement>(null);

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

  return (
    <div className={`google-translate-header ${className}`}>
      <span className="translate-label">Language:</span>
      <div ref={translateRef} className="google-translate-widget"></div>
    </div>
  );
};

export default GoogleTranslateHeader; 