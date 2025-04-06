// Importer les modules nécessaires
const generateCode = require('./utils/codeGenerator');
const { makeWASocketInstance, authenticateBot, requestPairingCode, sendMessage, sendImage, fetchLatestBaileysVersion } = require('./simple');
const path = require('path');
const chalk = require('chalk');
const Pino = require('pino');  // Importer Pino pour les logs
const { useMultiFileAuthState } = require('@adiwajshing/baileys');  // Exemple d'importation pour l'authentification

// Générer un code de 8 caractères alphanumériques
function startBot() {
  const code = generateCode(8);  // Ici, on génère un code de 8 caractères

  console.log('\n>>> Put this code on WhatsApp (Appareils connectés > Utiliser un code) to connect YAMA:');
  console.log(`>>> CODE: ${code}\n`);

  // Simuler la connexion
  setTimeout(() => {
    console.log('✅ YAMA is now connected to WhatsApp!');
  }, 10000); // La connexion prend 10 secondes ici pour simuler
}

// Exposer la fonction startBot pour l'utiliser dans index.js
module.exports = { startBot };

// Fonction principale pour démarrer le bot
async function start() {
  // Charger l'état d'authentification
  const { state, saveCreds } = await useMultiFileAuthState(path.join(__dirname, './auth')); // Mettez votre chemin ici

  // Récupérer la version la plus récente de Baileys
  let { version, isLatest } = await fetchLatestBaileysVersion();

  // Configuration du bot
  const config = {
    logger: Pino({ level: 'fatal' }).child({ level: 'fatal' }),
    printQRInTerminal: false,
    mobile: false,
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, Pino({ level: 'fatal' }).child({ level: 'fatal' })),
    },
    browser: ["Ubuntu", "Chrome", "20.0.04"],
    markOnlineOnConnect: true,
    generateHighQualityLinkPreview: true,
    msgRetryCounterCache: {},
    defaultQueryTimeoutMs: undefined
  };

  // Créer l'instance du bot
  const XeonBotInc = makeWASocketInstance(config);

  // Authentification de l'utilisateur
  const sender = 'votre-numero-whatsapp';  // Remplacez cela par le numéro correct
  const { state: authState, saveCreds } = await authenticateBot(sender);

  // Si l'utilisateur n'est pas enregistré, demander un code de pairage
  if (!XeonBotInc.authState.creds.registered) {
    setTimeout(async () => {
      let phoneNumber = 'votre-numero-whatsapp';  // Remplacez par le numéro correct
      console.log(chalk.red.bold(`[ Jadibot ] -> (+${phoneNumber})`));

      // Demander le code de pairage
      let code = await requestPairingCode(phoneNumber, XeonBotInc);
      let hasilcode = code?.match(/.{1,4}/g)?.join("-") || code;
      global.codepairing = `${hasilcode}`;
      console.log(`Pairing code generated: ${global.codepairing}`);
    }, 3000);
  }

  // Autres logiques de votre bot...
}

// Lancer le bot
start();
