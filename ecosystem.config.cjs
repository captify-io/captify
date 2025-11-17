// Load environment variables from .env.local
const fs = require('fs');
const path = require('path');

function loadEnvFile(filePath) {
  const env = {};
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf-8');
    content.split('\n').forEach(line => {
      line = line.trim();
      if (line && !line.startsWith('#')) {
        const [key, ...values] = line.split('=');
        if (key && values.length) {
          env[key.trim()] = values.join('=').trim();
        }
      }
    });
  }
  return env;
}

const localEnv = loadEnvFile(path.join(__dirname, '.env.local'));
const defaultEnv = loadEnvFile(path.join(__dirname, '.env'));

module.exports = {
  apps: [
    {
      name: 'captify',
      script: './node_modules/next/dist/bin/next',
      args: 'start -p 3000',
      cwd: __dirname,
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        ...defaultEnv,
        ...localEnv,
      },
    },
  ],
};
