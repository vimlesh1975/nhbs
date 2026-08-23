module.exports = {
  apps: [
    {
      name: 'nhbs-studio',
      script: 'node_modules/next/dist/bin/next',
      args: 'dev -p 22000',
      cwd: __dirname,
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
