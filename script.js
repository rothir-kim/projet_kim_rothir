document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('signup-form');
    const errorMessage = document.getElementById('error-message');
    const summaryPage = document.getElementById('summary-page');
    const summaryContent = document.getElementById('summary-content');

    form.addEventListener('submit', (e) => {
        // Empêcher le rechargement automatique de la page
        e.preventDefault();

        // Récupération des valeurs des champs
        const login = document.getElementById('login').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        const nom = document.getElementById('nom').value.trim();
        const prenom = document.getElementById('prenom').value.trim();
        const adresse = document.getElementById('adresse').value.trim();
        const email = document.getElementById('email').value.trim();
        const telephone = document.getElementById('telephone').value.trim();
        const naissance = document.getElementById('naissance').value;

        // Reset du message d'erreur
        errorMessage.textContent = '';
        errorMessage.classList.add('hidden');

        // 1. Vérification que tous les champs sont remplis
        if (!login || !password || !confirmPassword || !nom || !prenom || !adresse || !email || !telephone || !naissance) {
            showError('Veuillez remplir tous les champs du formulaire.');
            return;
        }

        // 2. Vérification de la validité de l'email avec un Regex simple
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showError('Veuillez saisir une adresse email valide.');
            return;
        }

        // 3. Vérification de la correspondance des mots de passe
        if (password !== confirmPassword) {
            showError('Les mots de passe ne correspondent pas.');
            return;
        }

        // Si tout est valide : masquer le formulaire et afficher le récapitulatif
        form.classList.add('hidden');

        // Formater la date en format français (JJ/MM/AAAA)
        const dateFormatted = new Date(naissance).toLocaleDateString('fr-FR');

        // Construction du contenu récapitulatif (sans le mot de passe)
        summaryContent.innerHTML = `
            <div class="summary-item"><strong>Login :</strong> <span>${escapeHtml(login)}</span></div>
            <div class="summary-item"><strong>Nom :</strong> <span>${escapeHtml(nom)}</span></div>
            <div class="summary-item"><strong>Prénom :</strong> <span>${escapeHtml(prenom)}</span></div>
            <div class="summary-item"><strong>Adresse :</strong> <span>${escapeHtml(adresse)}</span></div>
            <div class="summary-item"><strong>Email :</strong> <span>${escapeHtml(email)}</span></div>
            <div class="summary-item"><strong>Téléphone :</strong> <span>${escapeHtml(telephone)}</span></div>
            <div class="summary-item"><strong>Date de naissance :</strong> <span>${dateFormatted}</span></div>
        `;

        summaryPage.classList.remove('hidden');
    });

    // Fonction d'affichage des erreurs
    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.classList.remove('hidden');
    }

    // Sécurisation contre l'injection XSS lors de l'affichage des données
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
});