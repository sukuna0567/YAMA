const { Client, LocalAuth } = require('whatsapp-web.js');
const fs = require('fs');  // Pour manipuler les fichiers

// Créer une instance de client WhatsApp
const client = new Client({
    authStrategy: new LocalAuth(),  // Authentification locale pour stocker les sessions
});

// Lorsque le client est prêt, il s'affiche dans la console
client.on('ready', () => {
    console.log('Le bot est connecté !');
    client.sendMessage('your-phone-number@c.us', 'Bot successfully connected!');
});

// Lorsque le client reçoit un message
client.on('message', message => {
    console.log(message.body);
    
    // Si le message contient '.start', l'utilisateur doit entrer son numéro
    if (message.body.startsWith('.start')) {
        const phoneNumber = message.body.split(' ')[1]; // Récupère le numéro depuis la commande

        // Vérifie que le numéro est bien formaté (ex: +50948162936)
        if (phoneNumber && phoneNumber.match(/^\+?\d{10,15}$/)) {
            // Génère un code de session unique à 6 caractères (chiffres et lettres)
            const sessionCode = Math.random().toString(36).substr(2, 6).toUpperCase();
            console.log(`Code de session pour ${phoneNumber} : ${sessionCode}`);
            
            // Envoie le code à l'utilisateur
            message.reply(`Votre code de session pour connecter le bot à WhatsApp est : ${sessionCode}`);
            
            // Sauvegarde le code dans un fichier (optionnel)
            fs.writeFileSync('sessionCode.txt', sessionCode);
            console.log('Code de session enregistré dans sessionCode.txt');
        } else {
            message.reply('Numéro invalide, veuillez entrer un numéro WhatsApp valide (ex: +50948162936).');
        }
    }

    // Si le message contient '.menu', envoie le menu des commandes
    if (message.body === '.menu') {
        message.reply("Voici les commandes disponibles :\n- .start <numéro WhatsApp>\n- .tagall\n- .kick\n- .kickall\n- .readstatus");
    }
});

// Démarre le client WhatsApp
client.initialize();

// Exportation du client pour une utilisation dans d'autres fichiers
module.exports = {
    client,
};
