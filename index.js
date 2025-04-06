const { Client, LocalAuth } = require('whatsapp-web.js');
const fs = require('fs');
const path = require('path');
const QRCode = require('qrcode-terminal');
const { sessionID } = require('./configuration');  // Importation du sessionID depuis configuration.js

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: { headless: true }
});

// Vérification si un sessionID est fourni dans configuration.js
if (sessionID) {
    client.loadAuthInfo(sessionID);  // Charger le sessionID à partir du fichier de configuration
    console.log('Session chargée avec succès !');
} else {
    console.log('Aucun sessionID trouvé dans configuration.js.');
}

client.on('qr', (qr) => {
    // Affiche le QR code si aucune sessionID n'est trouvée
    QRCode.generate(qr, { small: true });
});

client.on('authenticated', (session) => {
    // Sauvegarde du sessionID si l'authentification réussie
    fs.writeFileSync(path.join(__dirname, 'session.json'), JSON.stringify(session));
    console.log('Session authentifiée');
    
    // Envoi du sessionID à l'utilisateur sur WhatsApp
    client.sendMessage('YOUR_WHATSAPP_NUMBER@c.us', `Votre session ID est : ${JSON.stringify(session)}`);
    client.sendMessage('YOUR_WHATSAPP_NUMBER@c.us', 'Session authentifiée avec succès ! Vous pouvez maintenant copier ce sessionID et le mettre dans le fichier configuration.js.');
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.initialize();
