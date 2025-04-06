const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
require('dotenv').config();

// Import des commandes
const tagAll = require('./commands/tagall');
const kick = require('./commands/kick');
const kickAll = require('./commands/kickall');
const readStatus = require('./commands/readstatus');
const showMenu = require('./commands/menu');

const client = new Client({
    authStrategy: new LocalAuth({ clientId: process.env.WHATSAPP_SESSION || 'yama-session' }),
    puppeteer: { headless: true }
});

// QR code terminal
client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
    console.log("Scan the QR Code to log in.");
});

// Bot prêt
client.on('ready', async () => {
    console.log('YAMA is online!');

    // Met à jour la photo de profil si un lien est fourni
    if (process.env.BOT_IMAGE_URL) {
        try {
            const media = await MessageMedia.fromUrl(process.env.BOT_IMAGE_URL);
            await client.setProfilePicture(media);
            console.log("Bot profile picture updated.");
        } catch (err) {
            console.log("Error setting profile picture:", err);
        }
    }
});

// Commandes
client.on('message', async msg => {
    const command = msg.body.toLowerCase();

    if (command === '.tagall') {
        await tagAll(client, msg);
    } else if (command === '.kick' && msg.hasQuotedMsg) {
        await kick(client, msg);
    } else if (command === '.kickall') {
        await kickAll(client, msg);
    } else if (command === '.readstatus') {
        await readStatus(client);
    } else if (command === '.menu') {
        await showMenu(client, msg);
    }
});

client.initialize();
