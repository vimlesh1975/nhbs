import { NextResponse } from 'next/server';
import { sendAmcpCommand } from '../../../../lib/casparcg';

export async function POST(request) {
  try {
    const body = await request.json();
    const { action, channel = 1, layer = 2, templateName = 'lower-third', templateData = {}, rawCommand = '', host = '127.0.0.1', port = 5250 } = body;

    let amcpCommand = '';

    if (rawCommand && rawCommand.trim()) {
      amcpCommand = rawCommand.trim();
    } else {
      // Escape JSON payload for CasparCG AMCP standard
      const jsonPayload = JSON.stringify(templateData).replace(/"/g, '\\"');

      // Resolve template path to full HTTP URL for CasparCG HTML Producer
      let templateUrl = templateName;
      if (!templateName.startsWith('http://') && !templateName.startsWith('https://')) {
        const textValue = templateData.f0 || templateData.headline || templateData.script || '';
        const catValue = templateData.f1 || templateData.category || 'HEADLINE';
        const queryStr = `?f0=${encodeURIComponent(textValue)}&f1=${encodeURIComponent(catValue)}`;
        templateUrl = `http://${host}:3000/templates/${templateName}${queryStr}`;
      }

      // Normalize action name to handle both CG_ADD and ADD_PLAY, STOP, MIXER, etc.
      const normAction = (action || '').toUpperCase();

      switch (normAction) {
        case 'CG_ADD':
        case 'ADD':
          amcpCommand = `CG ${channel}-${layer} ADD 1 "${templateUrl}" 1 "${jsonPayload}"`;
          break;

        case 'CG_ADD_AND_PLAY':
        case 'ADD_PLAY':
        case 'ADD_AND_PLAY':
          amcpCommand = `CG ${channel}-${layer} ADD 1 "${templateUrl}" 1 "${jsonPayload}"`;
          break;

        case 'CG_PLAY':
        case 'PLAY':
          amcpCommand = `CG ${channel}-${layer} PLAY 1`;
          break;

        case 'CG_STOP':
        case 'STOP':
          amcpCommand = `CG ${channel}-${layer} STOP 1`;
          break;

        case 'CG_UPDATE':
        case 'UPDATE':
          amcpCommand = `CG ${channel}-${layer} UPDATE 1 "${jsonPayload}"`;
          break;

        case 'CG_REMOVE':
        case 'REMOVE':
          amcpCommand = `CG ${channel}-${layer} REMOVE 1`;
          break;

        case 'MIXER_FILL':
        case 'MIXER_POS':
        case 'MIXER':
          const mx = templateData.x !== undefined ? templateData.x : 0;
          const my = templateData.y !== undefined ? templateData.y : 0;
          const mw = templateData.width !== undefined ? templateData.width : 1;
          const mh = templateData.height !== undefined ? templateData.height : 1;
          amcpCommand = `MIXER ${channel}-${layer} FILL ${mx} ${my} ${mw} ${mh}`;
          break;

        case 'MIXER_CLEAR':
          amcpCommand = `MIXER ${channel}-${layer} CLEAR`;
          break;

        case 'CLEAR_CHANNEL':
        case 'CLEAR':
          amcpCommand = `CLEAR ${channel}`;
          break;

        default:
          amcpCommand = `CG ${channel}-${layer} ADD 1 "${templateUrl}" 1 "${jsonPayload}"`;
          break;
      }
    }

    // Send AMCP command over TCP socket
    const result = await sendAmcpCommand(amcpCommand, host, port);

    return NextResponse.json({
      success: result.success,
      commandSent: amcpCommand,
      casparcgResponse: result.response,
      code: result.code,
      connected: result.connected,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
