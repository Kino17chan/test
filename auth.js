document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('auth-form');
  const loginBtn = document.getElementById('login-btn');
  const countryInput = document.getElementById('country');
  const stateSelect = document.getElementById('state');

  // Show/hide state dropdown based on country input
  countryInput.addEventListener('input', () => {
    const countryValue = countryInput.value.trim().toLowerCase();
    if (countryValue === 'australia') {
      stateSelect.classList.remove('hidden');
      stateSelect.required = true;
    } else {
      stateSelect.classList.add('hidden');
      stateSelect.value = '';
      stateSelect.required = false;
    }
  });

  form.addEventListener('submit', e => {
    e.preventDefault();

    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim().toLowerCase();
    const password = document.getElementById('password').value;
    const dob = document.getElementById('dob').value;
    const country = countryInput.value.trim();
    const state = stateSelect.value;
    const genderInput = document.querySelector('input[name="gender"]:checked');
    const gender = genderInput ? genderInput.value : null;

    // Basic validations
    if (
      !username ||
      !email ||
      !password ||
      !dob ||
      !country ||
      (country.toLowerCase() === 'australia' && !state) ||
      !gender
    ) {
      alert('Please fill in all required fields.');
      return;
    }

    // Redirect men to external page with alert
    if (gender === 'man') {
      alert(
        'This is a women-only platform, but thank you for supporting us ❤️'
      );
      window.location.href = 'https://wictadl.wixsite.com/wictadl';
      return;
    }

    let registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];

    if (registeredUsers.some(user => user.email === email)) {
      alert('This email is already registered. Please login instead.');
      return;
    }

    const newUser = {
      username,
      email,
      password,
      dob,
      country,
      state,
      gender,
      points: 10,
      tier: 'pearl',
      tierName: 'Pearl Girl',
    };

    registeredUsers.push(newUser);
    localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
    localStorage.setItem('currentUser', JSON.stringify(newUser));

    // Show welcome alert and then redirect after user closes alert
    alert(`Welcome, ${username}! You’ve been awarded 10 points and are now a ✨Pearl Girl✨.`);

    // Use setTimeout with 0 delay to allow alert to show before redirecting
    window.location.href = 'main.html';

  });

  loginBtn.addEventListener('click', e => {
    e.preventDefault();
    window.location.href = 'login.html';
  });
});
