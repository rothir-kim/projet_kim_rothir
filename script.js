document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('signup-form');
    const errorMessage = document.getElementById('error-message');
    const summaryPage = document.getElementById('summary-page');
    const summaryContent = document.getElementById('summary-content');

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const login = document.getElementById('login').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        const nom = document.getElementById('nom').value.trim();
        const prenom = document.getElementById('prenom').value.trim();
        const adresse = document.getElementById('adresse').value.trim();
        const email = document.getElementById('email').value.trim();
        const telephone = document.getElementById('telephone').value.trim();
        const naissance = document.getElementById('naissance').value;

        errorMessage.textContent = '';
        errorMessage.classList.add('hidden');

        if (!login || !password || !confirmPassword || !nom || !prenom || !adresse || !email || !telephone || !naissance) {
            showError('Veuillez remplir tous les champs du formulaire.');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showError('Veuillez saisir une adresse email valide.');
            return;
        }

        if (password !== confirmPassword) {
            showError('Les mots de passe ne correspondent pas.');
            return;
        }

        form.classList.add('hidden');

        const dateFormatted = new Date(naissance).toLocaleDateString('fr-FR');

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
        summaryPage.focus?.();
    });

    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.classList.remove('hidden');
    }

    // Empêche l'injection de HTML/JS dans le récapitulatif (protection XSS)
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
});