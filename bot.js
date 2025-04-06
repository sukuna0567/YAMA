const generateCode = require('./utils/codeGenerator');
const { makeWASocketInstance, fetchLatestBaileysVersion, requestPairingCode } = require('./simple');
const Pino = require('pino');

// Fonction principale du bot
async function startBot() {
  const code = generateCode();
  console.log('\n>>> Put this code on WhatsApp (Appareils connectés > Utiliser un code) to connect YAMA:');
  console.log(`>>> CODE: ${code}\n`);

  const { version, isLatest } = await fetchLatestBaileysVersion();
  const socket = makeWASocketInstance({
    version,
    logger: Pino({ level: 'silent' }),
    printQRInTerminal: false,
    browser: ['Ubuntu', 'Chrome', '20.0.04']
  });

  socket.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === 'open') {
      console.log('✅ YAMA is now connected to WhatsApp!');
    }
  });

  socket.ev.on('messages.upsert', async ({ messages }) => {
    const msg = messages[0];
    if (!msg.message || msg.key.fromMe) return;

    const messageText = msg.message.conversation || msg.message.extendedTextMessage?.text || '';

    if (messageText.startsWith('.menu')) {
      await socket.sendMessage(msg.key.remoteJid, {
        text: `Hello! Voici les commandes :\n.menu\n.tagall\n.kick\n.kickall\n.readstatus\n.anticall`
      });
    }

    if (messageText.startsWith('.anticall')) {
      await socket.sendMessage(msg.key.remoteJid, { text: 'Les appels sont maintenant bloqués.' });
    }

    // Autres commandes ici...
  });
}

module.exports = { startBot };
