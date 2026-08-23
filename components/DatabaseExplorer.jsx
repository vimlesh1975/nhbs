'use client';
import { useState, useEffect } from 'react';
import { FileCode, Play, Plus, Radio as RadioIcon, Sliders, Square } from 'lucide-react';

const DEFAULT_SAMPLE_TEXT = "This is test data. \u0939\u093e \u091a\u093e\u091a\u0923\u0940 \u0921\u0947\u091f\u093e \u0906\u0939\u0947.";

export default function DatabaseExplorer({ 
  onSelectDataRecord, 
  activeRecordId,
  selectedDate,
  selectedBulletin,
  onExecuteAction,
  refreshTrigger,
  setLoadingScripts
}) {
  // States for Headlines, Oneliner, and Twoliner scripts with bilingual test data defaults
  const [headlineLines, setHeadlineLines] = useState([
    `${DEFAULT_SAMPLE_TEXT} 1`,
    `${DEFAULT_SAMPLE_TEXT} 2`,
    `${DEFAULT_SAMPLE_TEXT} 3`
  ]);
  const [onelinerLines, setOnelinerLines] = useState([
    `${DEFAULT_SAMPLE_TEXT} 1`,
    `${DEFAULT_SAMPLE_TEXT} 2`,
    `${DEFAULT_SAMPLE_TEXT} 3`
  ]);
  const [twolinerLines, setTwolinerLines] = useState([
    { name: DEFAULT_SAMPLE_TEXT, designation: DEFAULT_SAMPLE_TEXT },
    { name: `${DEFAULT_SAMPLE_TEXT} 2`, designation: `${DEFAULT_SAMPLE_TEXT} 2` },
    { name: `${DEFAULT_SAMPLE_TEXT} 3`, designation: `${DEFAULT_SAMPLE_TEXT} 3` }
  ]);
  const [loading, setLoading] = useState(false);
  const [activeLineKey, setActiveLineKey] = useState(null);

  const [mounted, setMounted] = useState(false);

  // Unified Mixer Position & Scale State for Layer 2
  const [mixerPos, setMixerPos] = useState({
    2: { x: 0, y: 0, scaleX: 1, scaleY: 1 }
  });

  // Restore mixer position safely after client mount
  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem('casparcg_mixer_pos');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed[2]) {
          setMixerPos({ 2: parsed[2] });
        } else if (parsed[1]) {
          setMixerPos({ 2: parsed[1] });
        }
      }
    } catch (err) {}
  }, []);

  // Save mixerPos state to localStorage on change once mounted
  useEffect(() => {
    if (mounted && mixerPos) {
      try {
        localStorage.setItem('casparcg_mixer_pos', JSON.stringify(mixerPos));
      } catch (err) {}
    }
  }, [mixerPos, mounted]);

  // Fetch Script text for HEADLINES, ONELINER, and TWOLINER
  const fetchScripts = async () => {
    setLoading(true);
    if (setLoadingScripts) setLoadingScripts(true);
    try {
      const targetBulletin = selectedBulletin || '0830';
      const targetDate = selectedDate || new Date().toISOString().split('T')[0];

      // 1. Fetch Headlines (SlugName = 'headlines')
      const resHeadlines = await fetch(`/api/db/script?bulletin=${encodeURIComponent(targetBulletin)}&date=${encodeURIComponent(targetDate)}&slug=headlines`);
      const jsonHeadlines = await resHeadlines.json();
      if (jsonHeadlines && jsonHeadlines.script) {
        const parsed = jsonHeadlines.script.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
        setHeadlineLines(parsed.length > 0 ? parsed : [DEFAULT_SAMPLE_TEXT]);
      } else {
        setHeadlineLines([`${DEFAULT_SAMPLE_TEXT} 1`, `${DEFAULT_SAMPLE_TEXT} 2`, `${DEFAULT_SAMPLE_TEXT} 3`]);
      }

      // 2. Fetch Oneliner (SlugName = 'oneliner')
      const resOneliner = await fetch(`/api/db/script?bulletin=${encodeURIComponent(targetBulletin)}&date=${encodeURIComponent(targetDate)}&slug=oneliner`);
      const jsonOneliner = await resOneliner.json();
      if (jsonOneliner && jsonOneliner.script) {
        const parsed = jsonOneliner.script.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
        setOnelinerLines(parsed.length > 0 ? parsed : [DEFAULT_SAMPLE_TEXT]);
      } else {
        setOnelinerLines([`${DEFAULT_SAMPLE_TEXT} 1`, `${DEFAULT_SAMPLE_TEXT} 2`, `${DEFAULT_SAMPLE_TEXT} 3`]);
      }

      // 3. Fetch Twoliner (SlugName = 'twoliner')
      const resTwoliner = await fetch(`/api/db/script?bulletin=${encodeURIComponent(targetBulletin)}&date=${encodeURIComponent(targetDate)}&slug=twoliner`);
      const jsonTwoliner = await resTwoliner.json();
      if (jsonTwoliner && jsonTwoliner.script) {
        const parsed = jsonTwoliner.script.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
        const twolinerObjects = parsed.map(line => {
          if (line.includes('$$$$')) {
            const parts = line.split('$$$$');
            return { name: parts[0].trim(), designation: parts[1].trim() };
          }
          return { name: line, designation: DEFAULT_SAMPLE_TEXT };
        });
        setTwolinerLines(twolinerObjects.length > 0 ? twolinerObjects : [{ name: DEFAULT_SAMPLE_TEXT, designation: DEFAULT_SAMPLE_TEXT }]);
      } else {
        setTwolinerLines([
          { name: DEFAULT_SAMPLE_TEXT, designation: DEFAULT_SAMPLE_TEXT },
          { name: `${DEFAULT_SAMPLE_TEXT} 2`, designation: `${DEFAULT_SAMPLE_TEXT} 2` },
          { name: `${DEFAULT_SAMPLE_TEXT} 3`, designation: `${DEFAULT_SAMPLE_TEXT} 3` }
        ]);
      }
    } catch (err) {
      console.error("Fetch scripts error, populating fallback test data:", err);
      setHeadlineLines([`${DEFAULT_SAMPLE_TEXT} 1`, `${DEFAULT_SAMPLE_TEXT} 2`, `${DEFAULT_SAMPLE_TEXT} 3`]);
      setOnelinerLines([`${DEFAULT_SAMPLE_TEXT} 1`, `${DEFAULT_SAMPLE_TEXT} 2`, `${DEFAULT_SAMPLE_TEXT} 3`]);
      setTwolinerLines([
        { name: DEFAULT_SAMPLE_TEXT, designation: DEFAULT_SAMPLE_TEXT },
        { name: `${DEFAULT_SAMPLE_TEXT} 2`, designation: `${DEFAULT_SAMPLE_TEXT} 2` },
        { name: `${DEFAULT_SAMPLE_TEXT} 3`, designation: `${DEFAULT_SAMPLE_TEXT} 3` }
      ]);
    } finally {
      setLoading(false);
      if (setLoadingScripts) setLoadingScripts(false);
    }
  };

  useEffect(() => {
    fetchScripts();
  }, [selectedDate, selectedBulletin, refreshTrigger]);

  // Handlers for Headlines
  const handleHeadlineChange = (index, value) => {
    const updated = [...headlineLines];
    updated[index] = value;
    setHeadlineLines(updated);
  };

  const handleAddHeadline = () => {
    setHeadlineLines(prev => [...prev, DEFAULT_SAMPLE_TEXT]);
  };

  // Handlers for Oneliner
  const handleOnelinerChange = (index, value) => {
    const updated = [...onelinerLines];
    updated[index] = value;
    setOnelinerLines(updated);
  };

  const handleAddOneliner = () => {
    setOnelinerLines(prev => [...prev, DEFAULT_SAMPLE_TEXT]);
  };

  // Handlers for Twoliner fields (Name & Designation)
  const handleTwolinerFieldChange = (index, field, value) => {
    const updated = [...twolinerLines];
    updated[index] = { ...updated[index], [field]: value };
    setTwolinerLines(updated);
  };

  const handleAddTwoliner = () => {
    setTwolinerLines(prev => [...prev, { name: DEFAULT_SAMPLE_TEXT, designation: DEFAULT_SAMPLE_TEXT }]);
  };

  // Mixer X, Y, ScaleX, and ScaleY Handlers for Layer 2 - Auto-sends LIVE while changing
  const handleMixerPosChange = (field, val) => {
    const defaultVal = (field === 'scaleX' || field === 'scaleY') ? 1 : 0;
    const numVal = val !== '' ? (parseFloat(val) || defaultVal) : defaultVal;
    const currentPos = mixerPos[2] || { x: 0, y: 0, scaleX: 1, scaleY: 1 };

    const updatedX = field === 'x' ? numVal : currentPos.x;
    const updatedY = field === 'y' ? numVal : currentPos.y;
    const updatedScaleX = field === 'scaleX' ? numVal : (currentPos.scaleX ?? 1);
    const updatedScaleY = field === 'scaleY' ? numVal : (currentPos.scaleY ?? 1);

    setMixerPos({
      2: { x: updatedX, y: updatedY, scaleX: updatedScaleX, scaleY: updatedScaleY }
    });

    const rawMixerCmd = `MIXER 1-2 FILL ${updatedX} ${updatedY} ${updatedScaleX} ${updatedScaleY}`;
    if (onExecuteAction) {
      onExecuteAction('MIXER_FILL', rawMixerCmd, { x: updatedX, y: updatedY, width: updatedScaleX, height: updatedScaleY }, null, 2);
    }
  };

  const handleResetMixer = () => {
    setMixerPos({ 2: { x: 0, y: 0, scaleX: 1, scaleY: 1 } });
    const rawClearCmd = `MIXER 1-2 CLEAR`;
    if (onExecuteAction) {
      onExecuteAction('MIXER_CLEAR', rawClearCmd, {}, null, 2);
    }
  };

  // Single Master STOP Button Handler for Layer 2
  const handleStopGraphic = () => {
    setActiveLineKey(null);
    if (onExecuteAction) {
      onExecuteAction('STOP', '', null, null, 2);
    }
  };

  // Play Headlines on Layer 2
  const handlePlayHeadline = (lineText, index) => {
    const lineKey = `headline-${index}`;
    setActiveLineKey(lineKey);

    const linePayload = { f0: lineText || DEFAULT_SAMPLE_TEXT };

    if (onSelectDataRecord) {
      onSelectDataRecord('headlines', linePayload, lineText || DEFAULT_SAMPLE_TEXT, lineKey);
    }
    if (onExecuteAction) {
      onExecuteAction('ADD_PLAY', '', linePayload, 'headlines', 2);
    }
  };

  // Play Oneliner on Layer 2
  const handlePlayOneliner = (lineText, index) => {
    const lineKey = `oneliner-${index}`;
    setActiveLineKey(lineKey);

    const linePayload = { f0: lineText || DEFAULT_SAMPLE_TEXT };

    if (onSelectDataRecord) {
      onSelectDataRecord('oneliner', linePayload, lineText || DEFAULT_SAMPLE_TEXT, lineKey);
    }
    if (onExecuteAction) {
      onExecuteAction('ADD_PLAY', '', linePayload, 'oneliner', 2);
    }
  };

  // Play 2-line Twoliner row (Name & Designation) on Layer 2
  const handlePlayTwolinerRow = (item, index) => {
    const lineKey = `twoliner-${index}`;
    setActiveLineKey(lineKey);

    const linePayload = {
      f0: item.name || DEFAULT_SAMPLE_TEXT,
      f1: item.designation || DEFAULT_SAMPLE_TEXT
    };

    if (onSelectDataRecord) {
      onSelectDataRecord('twoliner', linePayload, item.name || DEFAULT_SAMPLE_TEXT, lineKey);
    }
    if (onExecuteAction) {
      onExecuteAction('ADD_PLAY', '', linePayload, 'twoliner', 2);
    }
  };

  return (
    <div className="glass-panel p-5 mb-6 border-l-4 border-l-cyan-400 bg-white/90 dark:bg-slate-950/80 transition-colors duration-200">
      
      {/* UNIFIED MASTER TOP CONTROL BAR: SINGLE STOP BUTTON + LAYER 2 MIXER */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 p-3 rounded-xl bg-slate-100/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm">
        
        {/* Left: Layer 2 Badge & Single Master STOP Button */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-blue-600 text-white text-[11px] font-black font-mono rounded shadow-xs">
              LAYER 2
            </span>
            <span className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider hidden sm:inline">
              Broadcast Board
            </span>
          </div>

          {/* SINGLE MASTER STOP BUTTON */}
          <button
            onClick={handleStopGraphic}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-500 active:scale-95 text-white text-xs font-black rounded-lg flex items-center gap-2 transition-all shadow-md shadow-rose-600/30 ring-1 ring-rose-400 cursor-pointer"
            title="Stop all graphics currently on Layer 2"
          >
            <Square className="w-4 h-4 fill-current" />
            <span>STOP GRAPHIC</span>
          </button>
        </div>

        {/* Right: LIVE AUTO-SEND MIXER POS & SCALE (X, Y, SX, SY) CONTROLS FOR LAYER 2 */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1">
            <Sliders className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 font-mono">MIXER (L2):</span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <div className="flex items-center gap-0.5 bg-white dark:bg-slate-950 px-2 py-1 rounded-md border border-slate-300 dark:border-slate-800 shadow-xs" title="X Position">
              <span className="text-[10px] font-mono font-bold text-cyan-600 dark:text-cyan-400">X:</span>
              <input
                type="number"
                step="0.01"
                value={mixerPos[2]?.x ?? 0}
                onChange={(e) => handleMixerPosChange('x', e.target.value)}
                className="w-16 bg-transparent text-sm font-mono text-slate-900 dark:text-white focus:outline-none font-bold"
              />
            </div>

            <div className="flex items-center gap-0.5 bg-white dark:bg-slate-950 px-2 py-1 rounded-md border border-slate-300 dark:border-slate-800 shadow-xs" title="Y Position">
              <span className="text-[10px] font-mono font-bold text-cyan-600 dark:text-cyan-400">Y:</span>
              <input
                type="number"
                step="0.01"
                value={mixerPos[2]?.y ?? 0}
                onChange={(e) => handleMixerPosChange('y', e.target.value)}
                className="w-16 bg-transparent text-sm font-mono text-slate-900 dark:text-white focus:outline-none font-bold"
              />
            </div>

            <div className="flex items-center gap-0.5 bg-white dark:bg-slate-950 px-2 py-1 rounded-md border border-slate-300 dark:border-slate-800 shadow-xs" title="Scale X">
              <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400">SX:</span>
              <input
                type="number"
                step="0.05"
                value={mixerPos[2]?.scaleX ?? 1}
                onChange={(e) => handleMixerPosChange('scaleX', e.target.value)}
                className="w-16 bg-transparent text-sm font-mono text-slate-900 dark:text-white focus:outline-none font-bold"
              />
            </div>

            <div className="flex items-center gap-0.5 bg-white dark:bg-slate-950 px-2 py-1 rounded-md border border-slate-300 dark:border-slate-800 shadow-xs" title="Scale Y">
              <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400">SY:</span>
              <input
                type="number"
                step="0.05"
                value={mixerPos[2]?.scaleY ?? 1}
                onChange={(e) => handleMixerPosChange('scaleY', e.target.value)}
                className="w-16 bg-transparent text-sm font-mono text-slate-900 dark:text-white focus:outline-none font-bold"
              />
            </div>

            <button
              onClick={handleResetMixer}
              className="px-2.5 py-1 rounded-md bg-slate-200 hover:bg-slate-300 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 font-bold text-[10px] transition-all cursor-pointer shadow-xs"
              title="Reset MIXER 1-2 CLEAR"
            >
              RST
            </button>
          </div>
        </div>
      </div>

      {/* 3-COLUMN SIDE-BY-SIDE GRID: HEADLINES | ONELINER | TWOLINER */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* COLUMN 1: HEADLINES (LAYER 2) */}
        <div className="bg-slate-50 dark:bg-slate-950/90 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between gap-2 mb-2.5 pb-2 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-1.5">
              <FileCode className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
              <div>
                <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                  <span>HEADLINES</span>
                  <span className="px-1.5 py-0.2 bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-500/40 text-[9px] font-mono rounded">
                    L2
                  </span>
                </h3>
              </div>
            </div>

            <button
              onClick={handleAddHeadline}
              className="px-2.5 py-1 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-md flex items-center gap-1 transition-all shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>

          {loading ? (
            <div className="p-4 text-center text-slate-500 text-sm font-mono">
              Loading...
            </div>
          ) : (
            <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
              {headlineLines.map((lineText, idx) => {
                const isActive = activeLineKey === `headline-${idx}`;

                return (
                  <div
                    key={idx}
                    className={`flex items-center gap-2 p-2 rounded-lg border transition-all ${
                      isActive
                        ? 'bg-cyan-50 border-cyan-400 shadow-md shadow-cyan-900/20 dark:bg-cyan-950/80 dark:border-cyan-400 dark:shadow-cyan-950 ring-1 ring-cyan-400'
                        : 'bg-white border-slate-200 hover:border-slate-300 dark:bg-slate-900/80 dark:border-slate-800 dark:hover:border-slate-700 shadow-xs'
                    }`}
                  >
                    <span className="w-8 text-center py-1.5 rounded-md bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-xs font-mono text-cyan-700 dark:text-cyan-300 font-extrabold shrink-0">
                      L{idx + 1}
                    </span>

                    <input
                      type="text"
                      value={lineText}
                      onChange={(e) => handleHeadlineChange(idx, e.target.value)}
                      placeholder="Headline text..."
                      className="flex-1 min-w-[100px] bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-md px-3 py-2 text-base text-slate-900 dark:text-white font-bold focus:outline-none focus:border-cyan-400 focus:bg-white dark:focus:bg-slate-900 transition-colors"
                    />

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => handlePlayHeadline(lineText, idx)}
                        className="px-3 py-2 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 transition-all shadow"
                        title={`Play Headline Line ${idx + 1} on Layer 2`}
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>PLAY</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* COLUMN 2: ONELINER (LAYER 2) */}
        <div className="bg-slate-50 dark:bg-slate-950/90 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between gap-2 mb-2.5 pb-2 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-1.5">
              <FileCode className="w-4 h-4 text-cyan-500 dark:text-cyan-400" />
              <div>
                <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                  <span>ONELINER</span>
                  <span className="px-1.5 py-0.2 bg-cyan-500/20 text-cyan-700 dark:text-cyan-400 border border-cyan-500/40 text-[9px] font-mono rounded">
                    L2
                  </span>
                </h3>
              </div>
            </div>

            <button
              onClick={handleAddOneliner}
              className="px-2.5 py-1 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-md flex items-center gap-1 transition-all shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>

          {loading ? (
            <div className="p-4 text-center text-slate-500 text-sm font-mono">
              Loading...
            </div>
          ) : (
            <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
              {onelinerLines.map((lineText, idx) => {
                const isActive = activeLineKey === `oneliner-${idx}`;

                return (
                  <div
                    key={idx}
                    className={`flex items-center gap-2 p-2 rounded-lg border transition-all ${
                      isActive
                        ? 'bg-cyan-50 border-cyan-400 shadow-md shadow-cyan-900/20 dark:bg-cyan-950/80 dark:border-cyan-400 dark:shadow-cyan-950 ring-1 ring-cyan-400'
                        : 'bg-white border-slate-200 hover:border-slate-300 dark:bg-slate-900/80 dark:border-slate-800 dark:hover:border-slate-700 shadow-xs'
                    }`}
                  >
                    <span className="w-8 text-center py-1.5 rounded-md bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-xs font-mono text-cyan-700 dark:text-cyan-300 font-extrabold shrink-0">
                      L{idx + 1}
                    </span>

                    <input
                      type="text"
                      value={lineText}
                      onChange={(e) => handleOnelinerChange(idx, e.target.value)}
                      placeholder="Oneliner text..."
                      className="flex-1 min-w-[100px] bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-md px-3 py-2 text-base text-slate-900 dark:text-white font-bold focus:outline-none focus:border-cyan-400 focus:bg-white dark:focus:bg-slate-900 transition-colors"
                    />

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => handlePlayOneliner(lineText, idx)}
                        className="px-3 py-2 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 transition-all shadow"
                        title={`Play Oneliner Line ${idx + 1} on Layer 2`}
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>PLAY</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* COLUMN 3: TWOLINER (LAYER 2) */}
        <div className="bg-slate-50 dark:bg-slate-950/90 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between gap-2 mb-2.5 pb-2 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-1.5">
              <FileCode className="w-4 h-4 text-blue-500 dark:text-blue-400" />
              <div>
                <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                  <span>TWOLINER</span>
                  <span className="px-1.5 py-0.2 bg-blue-500/20 text-blue-700 dark:text-blue-400 border border-blue-500/40 text-[9px] font-mono rounded">
                    L2
                  </span>
                </h3>
              </div>
            </div>

            <button
              onClick={handleAddTwoliner}
              className="px-2.5 py-1 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-md flex items-center gap-1 transition-all shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>

          {loading ? (
            <div className="p-4 text-center text-slate-500 text-sm font-mono">
              Loading...
            </div>
          ) : (
            <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
              {twolinerLines.map((item, idx) => {
                const isActive = activeLineKey === `twoliner-${idx}`;

                return (
                  <div
                    key={idx}
                    className={`p-2.5 rounded-lg border transition-all ${
                      isActive
                        ? 'bg-cyan-50 border-cyan-400 shadow-md shadow-cyan-900/20 dark:bg-cyan-950/80 dark:border-cyan-400 dark:shadow-cyan-950 ring-1 ring-cyan-400'
                        : 'bg-white border-slate-200 hover:border-slate-300 dark:bg-slate-900/80 dark:border-slate-800 dark:hover:border-slate-700 shadow-xs'
                    }`}
                  >
                    {/* Row Header with Badge & Playout Buttons */}
                    <div className="flex items-center justify-between gap-1.5 mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <span className="w-7 text-center py-1 rounded-md bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-xs font-mono text-cyan-700 dark:text-cyan-300 font-extrabold shrink-0">
                          L{idx + 1}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-mono italic">Name & Designation</span>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => handlePlayTwolinerRow(item, idx)}
                          className="px-2.5 py-1 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 transition-all shadow"
                          title={`Play Twoliner Line ${idx + 1} on Layer 2`}
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>PLAY</span>
                        </button>
                      </div>
                    </div>

                    {/* 2 Stacked Input Boxes: Line 1 (Name) & Line 2 (Designation) */}
                    <div className="space-y-1.5">
                      <input
                        type="text"
                        value={item.name || ''}
                        onChange={(e) => handleTwolinerFieldChange(idx, 'name', e.target.value)}
                        placeholder="Line 1: Name..."
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-md px-3 py-1.5 text-sm text-slate-900 dark:text-white font-bold focus:outline-none focus:border-cyan-400 focus:bg-white dark:focus:bg-slate-900 transition-colors"
                      />
                      <input
                        type="text"
                        value={item.designation || ''}
                        onChange={(e) => handleTwolinerFieldChange(idx, 'designation', e.target.value)}
                        placeholder="Line 2: Designation..."
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-md px-3 py-1.5 text-xs text-cyan-700 dark:text-cyan-300 font-semibold focus:outline-none focus:border-cyan-500 focus:bg-white dark:focus:bg-slate-900 transition-colors"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
