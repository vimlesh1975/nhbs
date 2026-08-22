'use client';
import { useEffect, useState } from 'react';

export default function ScoreboardTemplate() {
  const [data, setData] = useState({
    match_name: 'CHAMPIONS LEAGUE FINAL',
    team_a: 'REAL MADRID',
    score_a: '2',
    team_b: 'MAN CITY',
    score_b: '1',
    status: "84' 2ND HALF"
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
        console.error("Scoreboard Update Error:", e);
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
        top: '60px',
        left: '80px',
        display: 'flex',
        flexDirection: 'column',
        transform: visible ? 'scale(1)' : 'scale(0.8) translateY(-100px)',
        opacity: visible ? 1 : 0,
        transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease',
        transformOrigin: 'top left'
      }}>
        {/* Match Header Tag */}
        <div style={{
          background: '#0f172a',
          color: '#38bdf8',
          fontSize: '13px',
          fontWeight: '900',
          letterSpacing: '2px',
          padding: '6px 18px',
          borderRadius: '6px 6px 0 0',
          border: '1px solid #1e293b',
          borderBottom: 'none',
          boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
        }}>
          {data.match_name || 'LIVE SPORTS'}
        </div>

        {/* Scorebug Panel */}
        <div style={{
          display: 'flex',
          alignItems: 'stretch',
          background: 'rgba(15, 23, 42, 0.95)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '0 6px 6px 6px',
          overflow: 'hidden',
          boxShadow: '0 15px 35px rgba(0, 0, 0, 0.7)'
        }}>
          {/* Team A */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            padding: '12px 24px',
            background: 'linear-gradient(135deg, #1e293b, #0f172a)'
          }}>
            <span style={{ color: '#ffffff', fontSize: '22px', fontWeight: '900', letterSpacing: '1px' }}>
              {data.team_a}
            </span>
            <span style={{ color: '#38bdf8', fontSize: '32px', fontWeight: '900', background: '#0284c7', padding: '2px 14px', borderRadius: '4px', color: '#fff' }}>
              {data.score_a}
            </span>
          </div>

          {/* Divider */}
          <div style={{ width: '2px', background: '#334155' }} />

          {/* Team B */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            padding: '12px 24px',
            background: 'linear-gradient(135deg, #1e293b, #0f172a)'
          }}>
            <span style={{ color: '#38bdf8', fontSize: '32px', fontWeight: '900', background: '#0284c7', padding: '2px 14px', borderRadius: '4px', color: '#fff' }}>
              {data.score_b}
            </span>
            <span style={{ color: '#ffffff', fontSize: '22px', fontWeight: '900', letterSpacing: '1px' }}>
              {data.team_b}
            </span>
          </div>

          {/* Game Clock / Status */}
          <div style={{
            background: '#e11d48',
            color: '#ffffff',
            fontWeight: '900',
            fontSize: '15px',
            letterSpacing: '1px',
            padding: '0 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {data.status}
          </div>
        </div>
      </div>
    </div>
  );
}
