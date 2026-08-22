import { NextResponse } from 'next/server';
import { sendAmcpCommand } from '../../../../lib/casparcg';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const body = await request.json();
    const { action, channel = 1, layer = 2, templateName = 'headlines', templateData = {}, rawCommand = '', host = '127.0.0.1', port = 5250 } = body;

    let amcpCommand = '';

    if (rawCommand && rawCommand.trim()) {
      amcpCommand = rawCommand.trim();
    } else {
      // Extract text and category values
      const textValue = templateData.f0 || templateData.ccgf0 || templateData.headline || templateData.script || templateData.text || '';
      const catValue = templateData.f1 || templateData.ccgf1 || templateData.category || 'HEADLINE';

      // 1. JSON Payload format (for Next.js React templates)
      const enrichedData = {
        ...templateData,
        f0: textValue,
        ccgf0: textValue,
        f1: catValue,
        ccgf1: catValue
      };
      const jsonPayload = JSON.stringify(enrichedData).replace(/"/g, '\\"');

      // 2. XML Payload format (for standard RCC / CasparCG HTML templates expecting XML templateData)
      const escXml = (s) => String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
      let xmlPayload = '<templateData>';
      xmlPayload += `<componentData id="f0"><data id="text" value="${escXml(textValue)}"/></componentData>`;
      xmlPayload += `<componentData id="ccgf0"><data id="text" value="${escXml(textValue)}"/></componentData>`;
      if (catValue) {
        xmlPayload += `<componentData id="f1"><data id="text" value="${escXml(catValue)}"/></componentData>`;
        xmlPayload += `<componentData id="ccgf1"><data id="text" value="${escXml(catValue)}"/></componentData>`;
      }
      xmlPayload += '</templateData>';

      // Choose payload format: XML for .html static templates, JSON for React routes
      const amcpDataPayload = templateName.endsWith('.html') ? xmlPayload.replace(/"/g, '\\"') : jsonPayload;

      // Resolve template path to full HTTP URL for CasparCG HTML Producer
      let templateUrl = templateName;
      if (!templateName.startsWith('http://') && !templateName.startsWith('https://')) {
        const queryStr = `?f0=${encodeURIComponent(textValue)}&ccgf0=${encodeURIComponent(textValue)}&f1=${encodeURIComponent(catValue)}&ccgf1=${encodeURIComponent(catValue)}`;
        templateUrl = `http://${host}:22000/templates/${templateName}${queryStr}`;
      }

      // Normalize action name to handle both CG_ADD and ADD_PLAY, STOP, MIXER, etc.
      const normAction = (action || '').toUpperCase();

      const mx = templateData.x !== undefined ? templateData.x : 0;
      const my = templateData.y !== undefined ? templateData.y : 0;
      const mw = templateData.scaleX !== undefined ? templateData.scaleX : (templateData.width !== undefined ? templateData.width : 1);
      const mh = templateData.scaleY !== undefined ? templateData.scaleY : (templateData.height !== undefined ? templateData.height : 1);
      const mixerCmd = `MIXER ${channel}-${layer} FILL ${mx} ${my} ${mw} ${mh}`;

      switch (normAction) {
        case 'CG_ADD':
        case 'ADD':
        case 'CG_ADD_AND_PLAY':
        case 'ADD_PLAY':
        case 'ADD_AND_PLAY':
          amcpCommand = `CG ${channel}-${layer} ADD 1 "${templateUrl}" 1 "${amcpDataPayload}"\r\n${mixerCmd}`;
          break;

        case 'CG_PLAY':
        case 'PLAY':
          amcpCommand = `CG ${channel}-${layer} PLAY 1\r\n${mixerCmd}`;
          break;

        case 'CG_STOP':
        case 'STOP':
          amcpCommand = `CG ${channel}-${layer} STOP 1`;
          break;

        case 'CG_UPDATE':
        case 'UPDATE':
          amcpCommand = `CG ${channel}-${layer} UPDATE 1 "${amcpDataPayload}"`;
          break;

        case 'CG_REMOVE':
        case 'REMOVE':
          amcpCommand = `CG ${channel}-${layer} REMOVE 1`;
          break;

        case 'MIXER_FILL':
        case 'MIXER_POS':
        case 'MIXER':
          amcpCommand = mixerCmd;
          break;

        case 'MIXER_CLEAR':
          amcpCommand = `MIXER ${channel}-${layer} CLEAR`;
          break;

        case 'CLEAR_CHANNEL':
        case 'CLEAR':
          amcpCommand = `CLEAR ${channel}`;
          break;

        default:
          amcpCommand = `CG ${channel}-${layer} ADD 1 "${templateUrl}" 1 "${amcpDataPayload}"\r\n${mixerCmd}`;
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
