'use client';

import { useState, useEffect } from 'react';
import Header from '../components/Header';
import ChannelMatrix from '../components/ChannelMatrix';
import DatabaseExplorer from '../components/DatabaseExplorer';
import LivePreviewModal from '../components/LivePreviewModal';

export default function BroadcastDashboard() {
  // Connection states
  const [casparHost, setCasparHost] = useState('127.0.0.1');
  const [casparPort, setCasparPort] = useState(5250);
  const [casparConnected, setCasparConnected] = useState(false);
  const [dbStatus, setDbStatus] = useState({ connected: false, isMock: true });

  // Global Date Selector State (Default Today's Date)
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);

  // Playout Routing
  const [channel, setChannel] = useState(1);
  const [layer, setLayer] = useState(2);
  const [selectedTemplate, setSelectedTemplate] = useState('headlines');
  const [activeRecordId, setActiveRecordId] = useState(null);

  // Graphics Payload Data (mapped dynamically from active user script line)
  const [payloadData, setPayloadData] = useState({
    headline: '',
    f0: '',
    f1: '',
    category: ''
  });

  // Track on-air layers
  const [activeLayers, setActiveLayers] = useState({});

  // AMCP Console Log History
  const [logs, setLogs] = useState([]);

  // Preview Modal
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  // Check CasparCG Server TCP socket status
  const checkCasparServer = async () => {
    try {
      const res = await fetch(`/api/casparcg/status?host=${casparHost}&port=${casparPort}`);
      const json = await res.json();
      setCasparConnected(json.connected);
    } catch (err) {
      setCasparConnected(false);
    }
  };

  // Check MySQL DB connection status
  const checkDatabase = async () => {
    try {
      const res = await fetch('/api/db/test');
      const json = await res.json();
      setDbStatus(json);
    } catch (err) {
      setDbStatus({ connected: false, isMock: true });
    }
  };

  useEffect(() => {
    checkCasparServer();
    checkDatabase();
  }, [casparHost, casparPort]);

  // Execute AMCP Command helper
  const handleExecuteAction = async (action, rawCmd = '', customPayload = null, customTemplate = null, customLayer = null) => {
    try {
      const dataToSend = customPayload || payloadData;
      let templateToSend = customTemplate || selectedTemplate;

      const targetLayer = customLayer !== null && customLayer !== undefined ? customLayer : layer;

      // Retrieve layer mixer position from localStorage if available
      let layerMixer = { x: 0, y: 0, scaleX: 1, scaleY: 1 };
      if (typeof window !== 'undefined') {
        try {
          const savedMixer = localStorage.getItem('casparcg_mixer_pos');
          if (savedMixer) {
            const parsed = JSON.parse(savedMixer);
            if (parsed && parsed[targetLayer]) {
              layerMixer = parsed[targetLayer];
            }
          }
        } catch (e) {}
      }

      const mergedTemplateData = {
        x: layerMixer.x ?? 0,
        y: layerMixer.y ?? 0,
        scaleX: layerMixer.scaleX ?? 1,
        scaleY: layerMixer.scaleY ?? 1,
        ...dataToSend
      };

      const res = await fetch('/api/casparcg/command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          channel,
          layer: targetLayer,
          templateName: templateToSend,
          templateData: mergedTemplateData,
          rawCommand: rawCmd,
          host: casparHost,
          port: casparPort
        })
      });

      const json = await res.json();

      // Append command output to live terminal logs
      setLogs(prev => [
        {
          timestamp: new Date().toLocaleTimeString(),
          commandSent: json.commandSent || rawCmd,
          casparcgResponse: json.casparcgResponse,
          code: json.code,
          success: json.success
        },
        ...prev.slice(0, 49) // Keep last 50 logs
      ]);

      // Update active layer on-air tracking
      const layerKey = `${channel}-${targetLayer}`;
      const normAct = (action || '').toUpperCase();
      if (normAct.includes('ADD') || normAct.includes('PLAY')) {
        setActiveLayers(prev => ({ ...prev, [layerKey]: true }));
      } else if (normAct.includes('STOP') || normAct.includes('REMOVE') || normAct.includes('CLEAR')) {
        setActiveLayers(prev => ({ ...prev, [layerKey]: false }));
      }
    } catch (err) {
      console.error("AMCP Execution Error:", err);
    }
  };

  // When a database row or split line is clicked in DatabaseExplorer, parse fields into active graphics payload
  const handleSelectDataRecord = (tableName, record, lineText = '', uniqueKey = null) => {
    setActiveRecordId(uniqueKey || record.id);

    const activeText = lineText || record.headline || record.name || record.title || record.match_name || '';

    // Auto-switch template preset depending on table type
    if (tableName === 'headlines') {
      setSelectedTemplate('headlines');
      setPayloadData({
        headline: activeText,
        f0: activeText,
        f1: record.category || 'HEADLINE',
        category: record.category || 'NEWS'
      });
    } else if (tableName === 'oneliner') {
      setSelectedTemplate('oneliner');
      setPayloadData({
        headline: activeText,
        f0: activeText,
        category: record.category || 'ONELINER'
      });
    } else if (tableName === 'twoliner') {
      setSelectedTemplate('twoliner');
      setPayloadData({
        f0: activeText || record.name || '',
        f1: record.title || record.designation || '',
        category: record.category || 'TWOLINER'
      });
    } else {
      // Arbitrary user custom table
      setPayloadData({
        headline: activeText,
        f0: activeText,
        f1: `Source Table: ${tableName}`,
        category: tableName.toUpperCase()
      });
    }
  };

  const handleClearChannel = async (chNum = 1) => {
    const targetChannel = chNum || channel;
    const appLayers = [2, 3, 4]; // Only layers used in this app (Headlines L2, Oneliner L3, Twoliner L4)

    for (const l of appLayers) {
      await handleExecuteAction('STOP', `CG ${targetChannel}-${l} STOP 1`, null, null, l);
      await handleExecuteAction('CLEAR', `CLEAR ${targetChannel}-${l}`, null, null, l);
    }

    setActiveLayers({
      [`${targetChannel}-2`]: false,
      [`${targetChannel}-3`]: false,
      [`${targetChannel}-4`]: false
    });
  };

  return (
    <div className="min-h-screen pb-12 bg-slate-100 text-slate-900 dark:bg-[#070a12] dark:text-slate-100 transition-colors duration-200">
      {/* Header Bar with Integrated Channel Matrix */}
      <Header
        casparConnected={casparConnected}
        dbStatus={dbStatus}
        onRefreshDb={checkDatabase}
        onCheckCaspar={checkCasparServer}
        casparHost={casparHost}
        setCasparHost={setCasparHost}
        casparPort={casparPort}
        setCasparPort={setCasparPort}
        channel={channel}
        activeLayers={activeLayers}
        onClearChannel={handleClearChannel}
      />

      {/* Main Studio Container */}
      <main className="max-w-[1800px] mx-auto px-6">
        {/* Headlines, Script & Bulletin DataGrid Parser */}
        <DatabaseExplorer
          onSelectDataRecord={handleSelectDataRecord}
          activeRecordId={activeRecordId}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          onExecuteAction={handleExecuteAction}
        />
      </main>

      {/* Interactive Web Preview Drawer */}
      {showPreviewModal && (
        <LivePreviewModal
          templateId={selectedTemplate}
          payloadData={payloadData}
          onClose={() => setShowPreviewModal(false)}
        />
      )}
    </div>
  );
}
