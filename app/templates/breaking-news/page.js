'use client';
import { useEffect, useState } from 'react';

export default function BreakingNewsTemplate() {
  const [data, setData] = useState({
    badge: 'BREAKING NEWS',
    headline: 'INTERNATIONAL TREATY SIGNED ON ARTIFICIAL INTELLIGENCE SAFETY',
    location: 'GENEVA, SWITZERLAND',
    reporter: 'Marcus Brody'
  });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    window.play = () => setVisible(true);
    window.stop = () => setVisible(false);
    window.update = (str) => {
      try {
        const parsed = typeof str === 'string' ? JSON.parse(str) : str;
        setData(prev => ({ ...prev, ...parsed }));
      } catch (e) {
        console.error("Breaking News Update Error:", e);
      }
    };

    const timer = setTimeout(() => setVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{
      width: '1920px',
      height: '1080px',
      margin: 0,
      padding: 0,
      overflow: 'hidden',
      position: 'relative',
      background: 'transparent',
      fontFamily: "'Inter', sans-serif"
    }}>
      <div style={{
        position: 'absolute',
        bottom: '80px',
        left: '100px',
        right: '100px',
        display: 'flex',
        flexDirection: 'column',
        transform: visible ? 'translateY(0)' : 'translateY(300px)',
        opacity: visible ? 1 : 0,
        transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease'
      }}>
        {/* Red Flashing Header Bar */}
        <div style={{
          background: 'linear-gradient(90deg, #b91c1c, #ef4444, #b91c1c)',
          color: '#ffffff',
          padding: '12px 30px',
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center',
          borderRadius: '8px 8px 0 0',
          boxShadow: '0 -5px 25px rgba(239, 68, 68, 0.5)'
        }}>
          <span style={{
            fontSize: '24px',
            fontWeight: '900',
            letterSpacing: '3px',
            textTransform: 'uppercase'
          }}>
            🔴 {data.badge || 'BREAKING NEWS'}
          </span>
          {data.location && (
            <span style={{
              fontSize: '16px',
              fontWeight: '700',
              letterSpacing: '1px',
              opacity: 0.9
            }}>
              📍 {data.location}
            </span>
          )}
        </div>

        {/* Headline Body */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.96)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderTop: 'none',
          padding: '24px 36px',
          borderRadius: '0 0 8px 8px',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8)'
        }}>
          <div style={{
            color: '#ffffff',
            fontSize: '34px',
            fontWeight: '800',
            lineHeight: 1.2,
            letterSpacing: '-0.5px'
          }}>
            {data.headline || data.f0}
          </div>
          {data.reporter && (
            <div style={{
              color: '#f87171',
              fontSize: '18px',
              fontWeight: '700',
              marginTop: '10px'
            }}>
              REPORTING: {data.reporter}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
