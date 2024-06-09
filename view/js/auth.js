document.addEventListener('DOMContentLoaded', () => {
    const authBtn = document.getElementById('auth-btn');
    const mainContent = document.getElementById('main-content');

    function checkLogin() {
        const user = localStorage.getItem('user');
        try {
            return user ? JSON.parse(user) : null;
        } catch (error) {
            console.error('Error parsing user data:', error);
            return null;
        }
    }

    function updateAuthButton(user) {
        if (!authBtn) return; // authBtn이 null인 경우 함수 종료

        if (user) {
            authBtn.textContent = 'Logout';
            authBtn.classList.add('logout-btn');
        } else {
            authBtn.textContent = 'Sign in / up';
            authBtn.classList.remove('logout-btn');
        }
    }

    function toggleAuthForm(formType) {
        const authPopup = document.getElementById('auth-popup');
        const loginForm = document.getElementById('login-form');
        const registerForm = document.getElementById('register-form');

        if (formType === 'login') {
            loginForm.style.display = 'block';
            registerForm.style.display = 'none';
        } else {
            loginForm.style.display = 'none';
            registerForm.style.display = 'block';
        }

        mainContent.classList.add('blurred');
        authPopup.classList.add('active');
    }

    function closeAuthForm() {
        const authPopup = document.getElementById('auth-popup');
        mainContent.classList.remove('blurred');
        authPopup.classList.remove('active');
    }

    function validateEmail(email) {
        return email.includes('@');
    }

    function validatePassword(password) {
        return password.length >= 4;
    }

    async function login() {
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        if (!validateEmail(email)) {
            alert('Invalid email. Please include "@" in the email address.');
            return;
        }

        if (!validatePassword(password)) {
            alert('Password must be at least 4 characters long.');
            return;
        }

        try {
            const response = await fetch('/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('user', JSON.stringify(data.user));
                localStorage.setItem('token', data.token);
                closeAuthForm();
                location.reload();
            } else {
                alert('Login failed');
            }
        } catch (error) {
            console.error('Error during login:', error);
            alert('An error occurred during login');
        }
    }

    async function register() {
        const name = document.getElementById('register-name').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;

        if (!validateEmail(email)) {
            alert('Invalid email. Please include "@" in the email address.');
            return;
        }

        if (!validatePassword(password)) {
            alert('Password must be at least 4 characters long.');
            return;
        }

        try {
            const response = await fetch('/api/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email, password })
            });

            if (response.ok) {
                alert('회원가입이 완료되었습니다. 로그인 해주세요.');
                toggleAuthForm('login');
            } else {
                alert('회원가입에 실패했습니다.');
            }
        } catch (error) {
            console.error('Error during registration:', error);
            alert('An error occurred during registration');
        }
    }

    function logout() {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        location.reload();
    }

    const user = checkLogin();
    updateAuthButton(user);

    if (authBtn) {
        authBtn.addEventListener('click', () => {
            if (user) {
                logout();
            } else {
                toggleAuthForm('login');
            }
        });
    }

    window.toggleAuthForm = toggleAuthForm;
    window.closeAuthForm = closeAuthForm;
    window.login = login;
    window.register = register;
    window.checkLogin = checkLogin;
    window.updateAuthButton = updateAuthButton;
    window.logout = logout;
});
