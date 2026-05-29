/* ===== CalcHub — Password Generator ===== */

document.addEventListener('DOMContentLoaded', () => {
  initPasswordGenerator();
});

function initPasswordGenerator() {
  const passwordDisplay = document.getElementById('passwordDisplay');
  const copyBtn = document.getElementById('copyPasswordBtn');
  const generateBtn = document.getElementById('generateBtn');
  const lengthSlider = document.getElementById('passwordLength');
  const lengthValue = document.getElementById('lengthValue');
  const includeUppercase = document.getElementById('includeUppercase');
  const includeLowercase = document.getElementById('includeLowercase');
  const includeNumbers = document.getElementById('includeNumbers');
  const includeSymbols = document.getElementById('includeSymbols');

  const strengthBars = [
    document.getElementById('strengthBar1'),
    document.getElementById('strengthBar2'),
    document.getElementById('strengthBar3'),
    document.getElementById('strengthBar4')
  ];
  const strengthText = document.getElementById('strengthText');

  // Character sets
  const CHAR_SETS = {
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    numbers: '0123456789',
    symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?/~`'
  };

  /**
   * Generate a cryptographically secure random password
   */
  function generatePassword() {
    const length = parseInt(lengthSlider.value);
    let charset = '';
    const requiredChars = [];

    if (includeUppercase.checked) {
      charset += CHAR_SETS.uppercase;
      requiredChars.push(getSecureRandom(CHAR_SETS.uppercase));
    }
    if (includeLowercase.checked) {
      charset += CHAR_SETS.lowercase;
      requiredChars.push(getSecureRandom(CHAR_SETS.lowercase));
    }
    if (includeNumbers.checked) {
      charset += CHAR_SETS.numbers;
      requiredChars.push(getSecureRandom(CHAR_SETS.numbers));
    }
    if (includeSymbols.checked) {
      charset += CHAR_SETS.symbols;
      requiredChars.push(getSecureRandom(CHAR_SETS.symbols));
    }

    // If nothing is checked, default to lowercase
    if (charset === '') {
      includeLowercase.checked = true;
      charset = CHAR_SETS.lowercase;
      requiredChars.push(getSecureRandom(CHAR_SETS.lowercase));
    }

    // Generate random characters for the remaining length
    const remainingLength = length - requiredChars.length;
    const randomChars = [];
    for (let i = 0; i < remainingLength; i++) {
      randomChars.push(getSecureRandom(charset));
    }

    // Combine required + random and shuffle
    const allChars = [...requiredChars, ...randomChars];
    shuffleArray(allChars);

    const password = allChars.join('');
    passwordDisplay.value = password;

    // Update strength meter
    updateStrengthMeter(password, charset.length);

    // Animate the display
    passwordDisplay.style.animation = 'none';
    passwordDisplay.offsetHeight; // trigger reflow
    passwordDisplay.style.animation = 'fadeIn 0.3s ease';
  }

  /**
   * Get a cryptographically secure random character from a string
   */
  function getSecureRandom(chars) {
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    return chars[array[0] % chars.length];
  }

  /**
   * Fisher-Yates shuffle using crypto random
   */
  function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const array = new Uint32Array(1);
      crypto.getRandomValues(array);
      const j = array[0] % (i + 1);
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }

  /**
   * Calculate and display password strength
   */
  function updateStrengthMeter(password, poolSize) {
    const length = password.length;

    // Calculate entropy: log2(poolSize^length) = length * log2(poolSize)
    const entropy = length * Math.log2(poolSize);

    let strength, label, color;

    if (entropy < 36) {
      strength = 1;
      label = 'Weak — Easy to crack';
      color = 'weak';
    } else if (entropy < 60) {
      strength = 2;
      label = 'Fair — Could be stronger';
      color = 'fair';
    } else if (entropy < 80) {
      strength = 3;
      label = 'Good — Reasonably secure';
      color = 'good';
    } else {
      strength = 4;
      label = 'Strong — Excellent security';
      color = 'strong';
    }

    // Update bars
    strengthBars.forEach((bar, index) => {
      bar.className = 'strength-bar';
      if (index < strength) {
        bar.classList.add('active', color);
      }
    });

    // Update label
    strengthText.textContent = label;
    const colorMap = {
      weak: 'var(--error)',
      fair: 'var(--warning)',
      good: 'var(--info)',
      strong: 'var(--success)'
    };
    strengthText.style.color = colorMap[color];
  }

  // ===== Event Listeners =====

  // Generate button
  generateBtn.addEventListener('click', generatePassword);

  // Copy button
  copyBtn.addEventListener('click', () => {
    const password = passwordDisplay.value;
    if (password) {
      copyToClipboard(password, copyBtn);
    }
  });

  // Length slider — update display and auto-generate
  lengthSlider.addEventListener('input', () => {
    lengthValue.textContent = lengthSlider.value;
    generatePassword();
  });

  // Auto-generate on checkbox change
  [includeUppercase, includeLowercase, includeNumbers, includeSymbols].forEach(checkbox => {
    checkbox.addEventListener('change', () => {
      // Ensure at least one option is checked
      const anyChecked = includeUppercase.checked || includeLowercase.checked ||
                         includeNumbers.checked || includeSymbols.checked;
      if (!anyChecked) {
        checkbox.checked = true;
        return;
      }
      generatePassword();
    });
  });

  // Generate on page load
  generatePassword();
}
