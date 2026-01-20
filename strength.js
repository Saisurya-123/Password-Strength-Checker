        const passwordInput = document.getElementById('password');
        const strengthBar = document.getElementById('strengthBar');
        const strengthText = document.getElementById('strengthText');
        const submitBtn = document.getElementById('submitBtn');
        const messageDiv = document.getElementById('message');
        const form = document.getElementById('passwordForm');

        // Requirements elements
        const reqLength = document.getElementById('req-length');
        const reqUppercase = document.getElementById('req-uppercase');
        const reqLowercase = document.getElementById('req-lowercase');
        const reqNumber = document.getElementById('req-number');
        const reqSpecial = document.getElementById('req-special');

        function togglePassword() {
            const type = passwordInput.type === 'password' ? 'text' : 'password';
            passwordInput.type = type;
        }

        function checkPasswordStrength(password) {
            let score = 0;
            const checks = {
                length: password.length >= 8,
                uppercase: /[A-Z]/.test(password),
                lowercase: /[a-z]/.test(password),
                number: /[0-9]/.test(password),
                special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
            };

            // Update requirement indicators
            reqLength.classList.toggle('met', checks.length);
            reqUppercase.classList.toggle('met', checks.uppercase);
            reqLowercase.classList.toggle('met', checks.lowercase);
            reqNumber.classList.toggle('met', checks.number);
            reqSpecial.classList.toggle('met', checks.special);

            // Calculate score
            Object.values(checks).forEach(check => {
                if (check) score++;
            });

            // Additional scoring for length
            if (password.length >= 12) score++;
            if (password.length >= 16) score++;

            return { score, checks };
        }

        function updateStrengthMeter(password) {
            if (!password) {
                strengthBar.parentElement.className = 'strength-bar';
                strengthText.textContent = '';
                submitBtn.disabled = true;
                return;
            }

            const { score, checks } = checkPasswordStrength(password);
            const allRequirementsMet = Object.values(checks).every(check => check);

            // Update strength display
            if (score <= 2) {
                strengthBar.parentElement.className = 'strength-bar strength-weak';
                strengthText.textContent = 'Weak';
                strengthText.style.color = '#ff4757';
            } else if (score <= 4) {
                strengthBar.parentElement.className = 'strength-bar strength-medium';
                strengthText.textContent = 'Medium';
                strengthText.style.color = '#ffa502';
            } else {
                strengthBar.parentElement.className = 'strength-bar strength-strong';
                strengthText.textContent = 'Strong';
                strengthText.style.color = '#2ed573';
            }

            // Enable submit only if all requirements met
            submitBtn.disabled = !allRequirementsMet;
        }

        passwordInput.addEventListener('input', (e) => {
            updateStrengthMeter(e.target.value);
            messageDiv.classList.remove('show');
        });

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const password = passwordInput.value;
            
            // Frontend validation
            const { checks } = checkPasswordStrength(password);
            const allRequirementsMet = Object.values(checks).every(check => check);
            
            if (!allRequirementsMet) {
                showMessage('Please meet all password requirements', 'error');
                return;
            }

            // Simulate backend validation (PHP)
            // In a real application, this would be an AJAX call to a PHP script
            validatePasswordBackend(password);
        });

        function validatePasswordBackend(password) {
            // Simulating PHP backend validation
            // In production, this would be: fetch('validate.php', { method: 'POST', body: ... })
            
            submitBtn.disabled = true;
            submitBtn.textContent = 'Validating...';

            setTimeout(() => {
                // Simulate backend response
                const backendValidation = simulatePHPValidation(password);
                
                if (backendValidation.valid) {
                    showMessage('✓ Password is strong and valid!', 'success');
                } else {
                    showMessage('✗ ' + backendValidation.message, 'error');
                }
                
                submitBtn.disabled = false;
                submitBtn.textContent = 'Validate Password';
            }, 1000);
        }

        function simulatePHPValidation(password) {
            // This simulates what the PHP backend would check
            const validation = {
                valid: true,
                message: ''
            };

            // Check length
            if (password.length < 8) {
                validation.valid = false;
                validation.message = 'Password must be at least 8 characters';
                return validation;
            }

            // Check for uppercase
            if (!/[A-Z]/.test(password)) {
                validation.valid = false;
                validation.message = 'Password must contain at least one uppercase letter';
                return validation;
            }

            // Check for lowercase
            if (!/[a-z]/.test(password)) {
                validation.valid = false;
                validation.message = 'Password must contain at least one lowercase letter';
                return validation;
            }

            // Check for number
            if (!/[0-9]/.test(password)) {
                validation.valid = false;
                validation.message = 'Password must contain at least one number';
                return validation;
            }

            // Check for special character
            if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
                validation.valid = false;
                validation.message = 'Password must contain at least one special character';
                return validation;
            }

            // Check for common passwords (basic blacklist)
            const commonPasswords = ['password123', '12345678', 'qwerty123'];
            if (commonPasswords.includes(password.toLowerCase())) {
                validation.valid = false;
                validation.message = 'This password is too common. Please choose a different one';
                return validation;
            }

            return validation;
        }

        function showMessage(text, type) {
            messageDiv.textContent = text;
            messageDiv.className = `message ${type} show`;
        }
