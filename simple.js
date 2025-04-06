const { default: makeWASocket, useMultiFileAuthState, makeCacheableSignalKeyStore, fetchLatestBaileysVersion, Pino, jid } = require('@adiwajshing/baileys'); // Si vous utilisez Baileys
const chalk = require('chalk');
const path = require('path');

// Fonction pour créer la socket
function makeWASocketInstance(config) {
    return makeWASocket(config);
}

// Fonction pour gérer l'authentification
async function authenticateBot(sender) {
    const { state, saveCreds } = await useMultiFileAuthState(path.join(__dirname, `./jadibot/${sender}`), Pino({ level: "silent" }));
    return { state, saveCreds };
}

// Fonction pour demander le code de pairage
async function requestPairingCode(phoneNumber, XeonBotInc) {
    let code = await XeonBotInc.requestPairingCode(phoneNumber);
    let formattedCode = code?.match(/.{1,4}/g)?.join("-") || code;
    return formattedCode;
}

// Fonction pour envoyer un message simple
async function sendMessage(from, text, XeonBotInc) {
    await XeonBotInc.sendMessage(from, { text: text });
}

// Fonction pour envoyer une image
async function sendImage(from, imagePath, caption, XeonBotInc) {
    await XeonBotInc.sendImage(from, imagePath, caption);
}

// Fonction pour obtenir la version la plus récente de Baileys
async function fetchLatestBaileysVersion() {
    return await fetchLatestBaileysVersion();
}

// Exportation des fonctions
module.exports = {
    makeWASocketInstance,
    authenticateBot,
    requestPairingCode,
    sendMessage,
    sendImage,
    fetchLatestBaileysVersion
};
