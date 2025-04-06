const { spawnSync, spawn } = require('child_process');
const { existsSync, writeFileSync } = require('fs');
const path = require('path');

// L'utilisateur devra modifier ceci avec le numéro WhatsApp
const PHONE_NUMBER = '+50948162936'; // Exemple. À modifier dynamiquement.
const SESSION_CODE = generateSessionCode(); // Code de connexion unique

let nodeRestartCount = 0;
const maxNodeRestarts = 5;
const restartWindow = 30000; // 30 sec
let lastRestartTime = Date.now();

function generateSessionCode() {
  return Math.random().toString(36).substr(2, 6).toUpperCase();
}

function startNode() {
  const child = spawn('node', ['bot.js'], {
    cwd: 'yama',
    stdio: 'inherit',
    env: {
      ...process.env,
      WHATSAPP_NUMBER: PHONE_NUMBER,
      SESSION_CODE: SESSION_CODE,
    },
  });

  child.on('exit', (code) => {
    if (code !== 0) {
      const currentTime = Date.now();
      if (currentTime - lastRestartTime > restartWindow) {
        nodeRestartCount = 0;
      }
      lastRestartTime = currentTime;
      nodeRestartCount++;

      if (nodeRestartCount > maxNodeRestarts) {
        console.error('Bot is restarting too often. Stopping...');
        return;
      }
      console.log(`Bot exited with code ${code}. Restarting (try ${nodeRestartCount})...`);
      startNode();
    }
  });
}

function startPm2() {
  const pm2 = spawn('yarn', ['pm2', 'start', 'bot.js', '--name', 'yama-bot', '--attach'], {
    cwd: 'yama',
    stdio: ['pipe', 'pipe', 'pipe'],
  });

  let restartCount = 0;
  const maxRestarts = 5;

  pm2.on('exit', (code) => {
    if (code !== 0) {
      startNode();
    }
  });

  pm2.on('error', (error) => {
    console.error(`yarn pm2 error: ${error.message}`);
    startNode();
  });

  if (pm2.stderr) {
    pm2.stderr.on('data', (data) => {
      const output = data.toString();
      if (output.includes('restart')) {
        restartCount++;
        if (restartCount > maxRestarts) {
          spawnSync('yarn', ['pm2', 'delete', 'yama-bot'], { cwd: 'yama', stdio: 'inherit' });
          startNode();
        }
      }
    });
  }

  if (pm2.stdout) {
    pm2.stdout.on('data', (data) => {
      const output = data.toString();
      console.log(output);
      if (output.includes('Connecting')) {
        restartCount = 0;
      }
    });
  }
}

function installDependencies() {
  const installResult = spawnSync(
    'yarn',
    ['install', '--force', '--non-interactive', '--network-concurrency', '3'],
    {
      cwd: 'yama',
      stdio: 'inherit',
      env: { ...process.env, CI: 'true' },
    }
  );

  if (installResult.error || installResult.status !== 0) {
    console.error(
      `Install error: ${installResult.error ? installResult.error.message : 'Unknown'}`
    );
    process.exit(1);
  }
}

function checkDependencies() {
  if (!existsSync(path.resolve('yama/package.json'))) {
    console.error('package.json not found!');
    process.exit(1);
  }

  const result = spawnSync('yarn', ['check', '--verify-tree'], {
    cwd: 'yama',
    stdio: 'inherit',
  });

  if (result.status !== 0) {
    console.log('Dependencies missing, installing...');
    installDependencies();
  }
}

function cloneRepository() {
  const cloneResult = spawnSync(
    'git',
    ['clone', 'https://github.com/sukuna0567/YAMA.git', 'yama'],
    { stdio: 'inherit' }
  );

  if (cloneResult.error) {
    throw new Error(`Clone error: ${cloneResult.error.message}`);
  }

  const configPath = 'yama/config.env';
  try {
    writeFileSync(
      configPath,
      `PHONE_NUMBER=${PHONE_NUMBER}\nSESSION_CODE=${SESSION_CODE}\n`
    );
  } catch (err) {
    throw new Error(`Config write error: ${err.message}`);
  }

  installDependencies();
}

if (!existsSync('yama')) {
  cloneRepository();
  checkDependencies();
} else {
  checkDependencies();
}

const { startBot } = require('./bot')

console.log('Starting YAMA Bot...')

// Démarrer le bot
startBot()

startPm2();
