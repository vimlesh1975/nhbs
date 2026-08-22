import net from 'net';

/**
 * Sends a raw AMCP (Advanced Media Control Protocol) command to CasparCG Server via TCP Socket.
 * Standard CasparCG AMCP port is 5250.
 * 
 * @param {string} command - AMCP command string (e.g. 'CG 1-1 ADD 1 "LOWER_THIRD" 1 "{\\"f0\\":\\"John\\"}"')
 * @param {string} host - CasparCG Server IP address (default: 127.0.0.1)
 * @param {number} port - CasparCG Server AMCP port (default: 5250)
 * @returns {Promise<{success: boolean, response: string, commandSent: string, code: number}>}
 */
export async function sendAmcpCommand(command, host = process.env.CASPARCG_HOST || '127.0.0.1', port = parseInt(process.env.CASPARCG_PORT || '5250', 10)) {
  return new Promise((resolve) => {
    const formattedCommand = command.trim() + '\r\n';
    let responseData = '';
    let isResolved = false;

    const socket = new net.Socket();

    // Socket timeout after 3 seconds
    socket.setTimeout(3000);

    socket.connect(port, host, () => {
      socket.write(formattedCommand);
    });

    socket.on('data', (data) => {
      responseData += data.toString('utf-8');
      
      // AMCP responses typically end with \r\n
      if (responseData.includes('\r\n')) {
        socket.destroy();
        if (!isResolved) {
          isResolved = true;
          const lines = responseData.trim().split('\r\n');
          const firstLine = lines[0] || '';
          const codeMatch = firstLine.match(/^(\d{3})/);
          const code = codeMatch ? parseInt(codeMatch[1], 10) : 200;

          resolve({
            success: code >= 200 && code < 400,
            response: responseData.trim(),
            commandSent: command,
            code,
            connected: true,
          });
        }
      }
    });

    socket.on('timeout', () => {
      socket.destroy();
      if (!isResolved) {
        isResolved = true;
        resolve({
          success: false,
          response: 'CasparCG TCP socket connection timed out.',
          commandSent: command,
          code: 504,
          connected: false,
        });
      }
    });

    socket.on('error', (err) => {
      socket.destroy();
      if (!isResolved) {
        isResolved = true;
        resolve({
          success: false,
          response: `CasparCG Connection Error: ${err.message} (${host}:${port})`,
          commandSent: command,
          code: 500,
          connected: false,
        });
      }
    });
  });
}

/**
 * Checks CasparCG Server TCP availability by sending AMCP 'VERSION' or 'INFO'
 */
export async function checkCasparCgStatus(host = process.env.CASPARCG_HOST || '127.0.0.1', port = parseInt(process.env.CASPARCG_PORT || '5250', 10)) {
  return sendAmcpCommand('VERSION', host, port);
}
