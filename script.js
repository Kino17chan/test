// Utility Functions
function getTodayDateString() {
  const today = new Date();
  return today.toISOString().split('T')[0]; // "YYYY-MM-DD"
}

function getRandomPoints(min = 1, max = 5) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Load data from localStorage on page load
let points = parseInt(localStorage.getItem("points") || "0");
let streak = parseInt(localStorage.getItem("streak") || "0");
let lastLoginDate = localStorage.getItem("lastLoginDate");
let lastSurpriseDate = localStorage.getItem("lastSurpriseDate");
const today = getTodayDateString();

// Update points display
function updatePointsDisplay() {
  document.getElementById("points").innerText = points;
  const progressPercent = Math.min((points % 100) / 100 * 100, 100);
  document.getElementById("progress-bar").style.width = progressPercent + "%";
  updateTier();
  localStorage.setItem("points", points.toString());
}

// Update tier based on points (unchanged per your request)
function updateTier() {
  const tiers = [
    { name: "Pearl Girl", min: 0, class: "pearl" },
    { name: "Bronze Boss", min: 100, class: "bronze" },
    { name: "Silver Star", min: 200, class: "silver" },
    { name: "Gold Trailblazer", min: 300, class: "gold" },
    { name: "Amethyst Adventurer", min: 400, class: "amethyst" },
    { name: "Emerald Enthusiast", min: 500, class: "emerald" },
    { name: "Platinum Powerhouse", min: 600, class: "platinum" },
    { name: "Opal Optimistic", min: 700, class: "opal" }
  ];

  const womanAvatar = document.getElementById("woman-avatar");
  const tierElements = document.querySelectorAll(".tier-path .tier");
  tierElements.forEach(tier => tier.classList.remove("active"));

  for (let i = tiers.length - 1; i >= 0; i--) {
    if (points >= tiers[i].min) {
      const activeTier = document.querySelector(`.tier.${tiers[i].class}`);
      if (activeTier) {
        activeTier.classList.add("active");
        if (womanAvatar && activeTier.contains(womanAvatar)) {
          // Already in correct position
        } else if (womanAvatar && activeTier) {
          activeTier.appendChild(womanAvatar);
        }
      }
      break;
    }
  }
}

// Handle daily streak
function updateStreak() {
  if (lastLoginDate !== today) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];
    if (lastLoginDate === yesterdayStr) {
      streak++;
    } else {
      streak = 1;
    }
    localStorage.setItem("lastLoginDate", today);
    localStorage.setItem("streak", streak.toString());
  }
  document.getElementById("streak").innerText = streak;
}

// Surprise box logic
const surpriseBox = document.getElementById("surprise-box");
if (surpriseBox) {
  surpriseBox.addEventListener("click", () => {
    if (lastSurpriseDate === today) {
      alert("🎁 You've already claimed your surprise today!");
      return;
    }

    const reward = getRandomPoints();
    points += reward;
    localStorage.setItem("points", points);
    localStorage.setItem("lastSurpriseDate", today);
    updatePointsDisplay();

    // Confetti animation
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    alert(`🎉 Surprise! You earned +${reward} points!`);
  });
}

// Activity buttons
function completeActivity(value, dateKey, buttonId) {
  const lastDate = localStorage.getItem(dateKey);
  const button = document.getElementById(buttonId);
  if (lastDate === today) {
    alert("✅ You've already completed this today!");
    return;
  }
  points += value;
  localStorage.setItem(dateKey, today);
  localStorage.setItem("points", points);
  updatePointsDisplay();

  confetti({
    particleCount: 80,
    spread: 60,
    origin: { y: 0.6 }
  });

  alert(`🎊 +${value} points earned!`);
  if (button) {
    button.innerText = "✅ Completed";
    button.disabled = true;
  }
}

// Save bio
function saveBio() {
  const bioInput = document.getElementById("bio-input");
  const bioText = bioInput.value.trim();
  localStorage.setItem("userBio", bioText);
  document.getElementById("bio").innerText = bioText;
  bioInput.style.display = "none";
  document.getElementById("bio-save-btn").style.display = "none";
  alert("📝 Bio saved!");
}

// Load bio if exists
function loadBio() {
  const savedBio = localStorage.getItem("userBio");
  if (savedBio) {
    document.getElementById("bio").innerText = savedBio;
    document.getElementById("bio-input").value = savedBio;
  }
}

// Load user details
function loadUserDetails() {
  const currentUserString = localStorage.getItem("currentUser");
  if (!currentUserString) {
    // No user logged in, do nothing or redirect
    return;
  }
  const currentUser = JSON.parse(currentUserString);

  const nameEl = document.getElementById("name");
  const emailEl = document.getElementById("email");
  const locationEl = document.getElementById("location");

  if (!nameEl || !emailEl || !locationEl) {
    console.warn("Profile elements not found in DOM.");
    return;
  }

  nameEl.innerText = currentUser.username || "";
  emailEl.innerText = currentUser.email || "";

  const locationText = currentUser.state
    ? `${currentUser.state}, ${currentUser.country}`
    : currentUser.country || "";
  locationEl.innerText = locationText;
}

// Logout functionality
const logoutBtn = document.getElementById("logout-btn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "login.html"; // Redirect to login page
  });
}

// Profile photo upload
const uploadPhotoInput = document.getElementById("upload-photo");
if (uploadPhotoInput) {
  uploadPhotoInput.addEventListener("change", function () {
    const file = this.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const photoData = e.target.result;
        localStorage.setItem("profilePhoto", photoData);
        document.getElementById("profile-photo").src = photoData;
      };
      reader.readAsDataURL(file);
    }
  });
}

// Load profile photo if exists
function loadProfilePhoto() {
  const savedPhoto = localStorage.getItem("profilePhoto");
  if (savedPhoto) {
    document.getElementById("profile-photo").src = savedPhoto;
  }
}

// Initialize activity buttons
function initializeActivityButtons() {
  const activities = [
    { id: "btn-forum-comment", key: "lastForumCommentDate" },
    { id: "btn-forum-post", key: "lastForumPostDate" },
    { id: "btn-daily-quiz", key: "lastDailyQuizDate" },
    { id: "btn-superstar-ideas", key: "lastSuperstarIdeasDate" },
    { id: "btn-like-blog", key: "lastLikeBlogDate" },
    { id: "btn-graphics-create", key: "lastGraphicsCreateDate" }
  ];

  activities.forEach(activity => {
    const button = document.getElementById(activity.id);
    const lastDate = localStorage.getItem(activity.key);
    if (lastDate === today && button) {
      button.innerText = "✅ Completed";
      button.disabled = true;
    }
  });
}
function applySelectedFrame() {
  const selectedFrame = localStorage.getItem('selectedFrame');
  const frameOverlay = document.getElementById('avatar-frame-overlay');

  if (frameOverlay) {
    if (selectedFrame) {
      frameOverlay.src = `images/${selectedFrame}`;
      frameOverlay.style.display = 'block'; // make sure it's visible
    } else {
      // If no frame selected, show transparent or hide
      frameOverlay.src = '/images/transparent.jpg'; 
      // Or to hide: frameOverlay.style.display = 'none';
    }
  }
}

// Run on page load
document.addEventListener('DOMContentLoaded', applySelectedFrame);


// Initial setup after DOM loaded
document.addEventListener("DOMContentLoaded", () => {
  updatePointsDisplay();
  updateStreak();
  loadUserDetails();
  loadBio();
  loadProfilePhoto();
  initializeActivityButtons();
});
