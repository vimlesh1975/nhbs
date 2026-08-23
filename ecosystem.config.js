module.exports = {
  apps: [
    {
      name: 'nhbs-studio',
      script: 'server.js',
      cwd: __dirname,
      interpreter: 'node',
      windowsHide: true,
      exec_mode: 'fork',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'development',
        PORT: 22000
      }
    }
  ]
};
