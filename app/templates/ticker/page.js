'use client';
import { useEffect, useState } from 'react';

export default function TickerTemplate() {
  const [data, setData] = useState({
    headline: 'GLOBAL MARKETS REACH RECORD HIGH AS TECH SECTOR SURGES ACROSS INTERNATIONAL EXCHANGES',
    category: 'BUSINESS',
    priority: 'HIGH'
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
        console.error("Ticker Update Error:", e);
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
        bottom: '0',
        left: '0',
        width: '100%',
        height: '60px',
        background: 'rgba(10, 15, 26, 0.95)',
        borderTop: '3px solid #ef4444',
        display: 'flex',
        alignItems: 'center',
        transform: visible ? 'translateY(0)' : 'translateY(70px)',
        transition: 'transform 0.5s ease-out',
        boxShadow: '0 -10px 30px rgba(0,0,0,0.7)'
      }}>
        {/* Badge */}
        <div style={{
          height: '100%',
          background: 'linear-gradient(90deg, #dc2626, #991b1b)',
          color: '#ffffff',
          fontWeight: '900',
          fontSize: '18px',
          padding: '0 28px',
          display: 'flex',
          alignItems: 'center',
          letterSpacing: '2px',
          zIndex: 10,
          boxShadow: '4px 0 15px rgba(0,0,0,0.5)'
        }}>
          {data.category || 'NEWS TICKER'}
        </div>

        {/* Marquee Headline */}
        <div style={{
          flex: 1,
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          color: '#f8fafc',
          fontSize: '22px',
          fontWeight: '600',
          paddingLeft: '20px'
        }}>
          <span style={{
            display: 'inline-block',
            animation: 'marquee 22s linear infinite',
            paddingRight: '100%'
          }}>
            ⚡ {data.headline || data.f0}
          </span>
        </div>

        {/* Clock */}
        <div style={{
          height: '100%',
          background: '#1e293b',
          color: '#cbd5e1',
          fontWeight: '700',
          fontSize: '16px',
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          letterSpacing: '1px',
          borderLeft: '1px solid #334155'
        }}>
          LIVE HD
        </div>
      </div>

      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
      `}</style>
    </div>
  );
}
