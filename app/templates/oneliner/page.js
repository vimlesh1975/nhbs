'use client';
import { useEffect, useState } from 'react';

export default function OnelinerDataStripTemplate() {
  const [data, setData] = useState({
    f0: '',
    headline: '',
    text: ''
  });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Read URL query parameters immediately on load
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const f0Param = urlParams.get('f0') || urlParams.get('headline') || urlParams.get('text');
      if (f0Param) {
        setData(prev => ({ ...prev, f0: f0Param }));
      }
    }

    // Expose CasparCG Standard HTML Template API functions to window object
    window.play = function() {
      setVisible(true);
    };

    window.stop = function() {
      setVisible(false);
    };

    window.update = function(str) {
      try {
        let parsed = str;
        if (typeof str === 'string') {
          const trimmed = str.trim();
          if (trimmed.startsWith('{')) {
            parsed = JSON.parse(trimmed);
          } else {
            parsed = { f0: str };
          }
        }
        setData(prev => ({ ...prev, ...parsed }));
      } catch (e) {
        console.error("Template Update Error:", e);
      }
    };

    // Reveal graphic on load
    const timer = setTimeout(() => {
      setVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const displayText = data.f0 || data.headline || data.script || data.text || '';

  return (
    <div style={{
      width: '1920px',
      height: '1080px',
      margin: 0,
      padding: 0,
      overflow: 'hidden',
      position: 'relative',
      background: 'transparent',
      fontFamily: "'Outfit', 'Inter', system-ui, sans-serif"
    }}>
      {/* Main Oneliner Graphic Background Strip Bar (ONLY DATA AND ITS STRIP) */}
      {displayText && (
        <div style={{
          position: 'absolute',
          bottom: '75px',
          left: '80px',
          transform: visible ? 'translateX(0px)' : 'translateX(-1500px)',
          opacity: visible ? 1 : 0,
          transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.35s ease',
          boxShadow: '0 20px 45px rgba(0, 0, 0, 0.8)',
          background: 'linear-gradient(90deg, rgba(15, 23, 42, 0.96) 0%, rgba(30, 41, 59, 0.94) 100%)',
          backdropFilter: 'blur(16px)',
          borderLeft: '5px solid #06b6d4',
          borderRight: '5px solid #06b6d4',
          borderRadius: '8px',
          padding: '16px 36px',
          display: 'flex',
          alignItems: 'center',
          maxWidth: '1650px',
          minWidth: '350px'
        }}>
          <span style={{
            color: '#ffffff',
            fontSize: '34px',
            fontWeight: '800',
            letterSpacing: '-0.3px',
            lineHeight: 1.2,
            textShadow: '0 2px 6px rgba(0, 0, 0, 0.7)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
            {displayText}
          </span>
        </div>
      )}
    </div>
  );
}
