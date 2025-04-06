const { Client, LocalAuth } = require('whatsapp-web.js');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { sessionCode } = require('./configuration');  // Optionnel, si tu as besoin de quelque chose de spécifique

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: { headless: true }
});

// Fonction pour générer un code aléatoire de 6 caractères (chiffres et lettres)
function generateSessionCode() {
    return crypto.randomBytes(3).toString('hex').toUpperCase(); // 6 caractères aléatoires (3 octets = 6 caractères hexadécimaux)
}

client.on('authenticated', (session) => {
    // Sauvegarde du sessionID dans un fichier pour une utilisation future
    fs.writeFileSync(path.join(__dirname, 'session.json'), JSON.stringify(session));
    console.log('Session authentifiée');

    // Envoi d'un message à l'utilisateur pour confirmer la connexion
    client.on('message', (message) => {
        const userPhone = message.from;  // Récupère le numéro de l'utilisateur
        const sessionCodeGenerated = generateSessionCode();
        client.sendMessage(userPhone, `Bot connected successfully on WhatsApp!`);
        client.sendMessage(userPhone, `Please use the code ${sessionCodeGenerated} to connect your bot.`);
    });
});

client.on('message', (message) => {
    // Commande '.menu' - Affiche les commandes disponibles
    if (message.body === '.menu') {
        const menu = `
            *Bot Commands:*
            1. .tagall - Mention all members in the group.
            2. .kick - Kick a user from the group.
            3. .kickall - Kick all members from the group.
            4. .readstatus - Read and react to status messages.
        `;
        client.sendMessage(message.from, menu);
    }

    // Commande '.tagall' - Mentionne tout le groupe (exemple)
    if (message.body === '.tagall') {
        const groupMembers = ['@user1', '@user2', '@user3'];  // Remplacer par les membres du groupe
        client.sendMessage(message.from, `Attention ${groupMembers.join(', ')}`);
    }

    // Autres commandes ici...
});

client.on('ready', () => {
    console.log('Client is ready!');
    // Exemple d'envoi de message de bienvenue après la connexion réussie
    client.sendMessage('<user_phone_number>', 'Bot has been successfully connected!');  // Remplacer par le numéro de téléphone de l'utilisateur
});

client.initialize();
