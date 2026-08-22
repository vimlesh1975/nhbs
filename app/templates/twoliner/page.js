'use client';
import { useEffect, useState } from 'react';

export default function TwolinerDataStripTemplate() {
  const [data, setData] = useState({
    f0: '',
    f1: ''
  });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Read URL query parameters immediately on load
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const f0Param = urlParams.get('f0') || urlParams.get('headline') || urlParams.get('name');
      const f1Param = urlParams.get('f1') || urlParams.get('designation') || urlParams.get('sub');
      if (f0Param || f1Param) {
        setData(prev => ({
          ...prev,
          ...(f0Param ? { f0: f0Param } : {}),
          ...(f1Param ? { f1: f1Param } : {})
        }));
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
            if (trimmed.includes('$$$$')) {
              const parts = trimmed.split('$$$$');
              parsed = { f0: parts[0].trim(), f1: parts[1].trim() };
            } else {
              parsed = { f0: trimmed };
            }
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

  // Format line 1 (Name) and line 2 (Designation)
  let nameText = data.f0 || '';
  let designationText = data.f1 || '';

  // If f0 itself contains $$$$, split it automatically into name & designation
  if (nameText.includes('$$$$')) {
    const parts = nameText.split('$$$$');
    nameText = parts[0].trim();
    designationText = parts[1].trim();
  }

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
      {/* Twoliner Graphic Background Strip Bar (Name & Designation) */}
      {nameText && (
        <div style={{
          position: 'absolute',
          bottom: '75px',
          left: '80px',
          transform: visible ? 'translateX(0px)' : 'translateX(-1500px)',
          opacity: visible ? 1 : 0,
          transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.35s ease',
          boxShadow: '0 20px 45px rgba(0, 0, 0, 0.85)',
          background: 'linear-gradient(90deg, rgba(15, 23, 42, 0.96) 0%, rgba(30, 41, 59, 0.94) 100%)',
          backdropFilter: 'blur(16px)',
          borderLeft: '6px solid #3b82f6',
          borderRight: '6px solid #3b82f6',
          borderRadius: '8px',
          padding: '16px 36px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: '4px',
          maxWidth: '1650px',
          minWidth: '400px'
        }}>
          {/* Line 1: Name */}
          <span style={{
            color: '#ffffff',
            fontSize: '34px',
            fontWeight: '800',
            letterSpacing: '-0.3px',
            // lineHeight: 1.15,
            textShadow: '0 2px 6px rgba(0, 0, 0, 0.7)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
            {nameText}
          </span>

          {/* Line 2: Designation */}
          {designationText && (
            <span style={{
              color: '#f8eb38ff',
              fontSize: '22px',
              fontWeight: '600',
              letterSpacing: '0px',
              // lineHeight: 1.15,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {designationText}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
