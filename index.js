const { spawnSync, spawn } = require('child_process');
const { existsSync, writeFileSync } = require('fs');
const path = require('path');
require('./chemin/vers/bot') // par exemple './src/bot' si c’est dans un dossier 'src'
// L'utilisateur devra modifier ceci avec le numéro WhatsApp
const PHONE_NUMBER = '+50948162936'; // Exemple. À modifier dynamiquement.
const SESSION_CODE = generateSessionCode(); // Code de connexion unique

function generateSessionCode() {
  return Math.random().toString(36).substr(2, 6).toUpperCase();
}

// Fonction pour installer les dépendances si nécessaire
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

// Vérifier les dépendances du projet
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

// Cloner le repository si nécessaire
function cloneRepository() {
  const cloneResult = spawnSync(
    'git',
    ['clone', 'https://github.com/sukuna0567/yama.git', 'yama'],
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

// Démarrer PM2 pour la gestion des processus
function startPm2() {
  const pm2 = spawn('yarn', ['pm2', 'start', 'bot.js', '--name', 'yama-bot', '--attach'], {
    cwd: 'yama',
    stdio: ['pipe', 'pipe', 'pipe'],
  });

  pm2.on('exit', (code) => {
    if (code !== 0) {
      console.log('PM2 process exited with error, restarting bot...');
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
      console.log(output);
    });
  }

  if (pm2.stdout) {
    pm2.stdout.on('data', (data) => {
      const output = data.toString();
      console.log(output);
    });
  }
}

// Vérifier si le projet existe déjà ou cloner
if (!existsSync('yama')) {
  cloneRepository();
  checkDependencies();
} else {
  checkDependencies();
}

// Importer les fonctions du bot
const { startBot } = require('./bot');

console.log('Starting YAMA Bot...');

// Démarrer le bot
startBot();

// Lancer PM2 pour la gestion du bot
startPm2();
