import AuthService from '../services/AuthService.js';

document.addEventListener('DOMContentLoaded', () => {
    // Redirect if already logged in
    if (AuthService.isAuthenticated()) {
        window.location.href = 'index.html';
    }

    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            try {
                await AuthService.login(email, password);
                window.location.href = 'index.html';
            } catch (err) {
                alert(err.message);
            }
        });
    }
});
