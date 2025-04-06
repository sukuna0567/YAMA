const generateCode = require('./utils/codeGenerator')

function startBot() {
  // Générer un code de 6 caractères (alphanumérique)
  const code = generateCode()

  console.log('\n>>> Put this code on WhatsApp (Appareils connectés > Utiliser un code) to connect YAMA:')
  console.log(`>>> CODE: ${code}\n`)

  // Logique pour connecter le bot avec WhatsApp ici
  // Exemple de simulation d'une connexion réussie :
  setTimeout(() => {
    console.log('✅ YAMA is now connected to WhatsApp!')
  }, 10000) // La connexion prend 10 secondes ici pour simuler
}

// Exposer la fonction startBot pour qu'on puisse l'utiliser dans index.js
module.exports = { startBot }
