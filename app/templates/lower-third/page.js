'use client';
import { useEffect, useState } from 'react';

export default function PureTextCenteredTemplate() {
  const [data, setData] = useState({
    f0: ''
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
    window.play = function () {
      setVisible(true);
    };

    window.stop = function () {
      setVisible(false);
    };

    window.update = function (str) {
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
      {/* Title Positioned Up Higher (top: 25%) with Doubled Font Size (96px) */}
      {displayText && (
        <div style={{
          position: 'absolute',
          top: '82%',
          left: '46%',
          transform: visible ? 'translate(-50%, -50%) scale(1)' : 'translate(-50%, -50%) scale(0.85)',
          opacity: visible ? 1 : 0,
          transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.35s ease',
          textAlign: 'center',
          maxWidth: '1850px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <span style={{
            color: '#ffffff',
            fontSize: '60px',
            fontWeight: '900',
            letterSpacing: '-1px',
            // lineHeight: 1.1,
            textAlign: 'center',
            // textShadow: '0 8px 30px rgba(0, 0, 0, 0.98), 0 4px 12px rgba(0, 0, 0, 0.95), -4px -4px 0 #000, 4px -4px 0 #000, -4px 4px 0 #000, 4px 4px 0 #000',
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
