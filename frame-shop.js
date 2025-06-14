const POINTS_KEY = 'points';

const pointsEl = document.getElementById('points');
const frameList = document.getElementById('frame-list');

let points = parseInt(localStorage.getItem(POINTS_KEY)) || 0;
let ownedFrames = JSON.parse(localStorage.getItem('ownedFrames')) || [];

pointsEl.textContent = points;

for (let i = 1; i <= 16; i++) {
  const cost = 15 + i * 5;
  const frameName = `${i}.svg`;

  const frameCard = document.createElement('div');
  frameCard.className = 'frame-card';

  const frameWrapper = document.createElement('div');
  frameWrapper.className = 'frame-wrapper';

  const frameImg = document.createElement('img');
  frameImg.src = `images/${frameName}`;
  frameImg.className = 'framed-image';

  const frameOverlay = document.createElement('div');
  frameOverlay.className = 'frame-overlay';

  frameWrapper.appendChild(frameImg);
  frameWrapper.appendChild(frameOverlay);

  const btn = document.createElement('button');

  if (ownedFrames.includes(frameName)) {
    if (localStorage.getItem('selectedFrame') === frameName) {
      btn.textContent = 'Applied ✅';
      btn.disabled = true;
    } else {
      btn.textContent = 'Apply';
      btn.disabled = false;
    }
  } else {
    btn.textContent = `Buy (${cost} pts)`;
    btn.disabled = points < cost;
  }

  btn.addEventListener('click', () => {
    if (ownedFrames.includes(frameName)) {
      localStorage.setItem('selectedFrame', frameName);
      alert(`Frame ${i} applied!`);
      refreshFrameButtons();
    } else if (points >= cost) {
      points -= cost;
      ownedFrames.push(frameName);
      localStorage.setItem(POINTS_KEY, points);
      localStorage.setItem('ownedFrames', JSON.stringify(ownedFrames));
      pointsEl.textContent = points;
      alert(`You bought frame ${i}!`);
      localStorage.setItem('selectedFrame', frameName);
      refreshFrameButtons();
    }
  });

  frameCard.appendChild(frameWrapper);
  frameCard.appendChild(btn);
  frameList.appendChild(frameCard);
}

function refreshFrameButtons() {
  points = parseInt(localStorage.getItem(POINTS_KEY)) || 0;

  frameList.innerHTML = '';
  pointsEl.textContent = points;

  for (let i = 1; i <= 16; i++) {
    const cost = 15 + i * 5;
    const frameName = `${i}.svg`;

    const frameCard = document.createElement('div');
    frameCard.className = 'frame-card';

    const frameWrapper = document.createElement('div');
    frameWrapper.className = 'frame-wrapper';

    const frameImg = document.createElement('img');
    frameImg.src = `images/${frameName}`;
    frameImg.className = 'framed-image';

    const frameOverlay = document.createElement('div');
    frameOverlay.className = 'frame-overlay';

    frameWrapper.appendChild(frameImg);
    frameWrapper.appendChild(frameOverlay);

    const btn = document.createElement('button');

    if (ownedFrames.includes(frameName)) {
      if (localStorage.getItem('selectedFrame') === frameName) {
        btn.textContent = 'Applied ✅';
        btn.disabled = true;
      } else {
        btn.textContent = 'Apply';
        btn.disabled = false;
      }
    } else {
      btn.textContent = `Buy (${cost} pts)`;
      btn.disabled = points < cost;
    }

    btn.addEventListener('click', () => {
      if (ownedFrames.includes(frameName)) {
        localStorage.setItem('selectedFrame', frameName);
        alert(`Frame ${i} applied!`);
        refreshFrameButtons();
      } else if (points >= cost) {
        points -= cost;
        ownedFrames.push(frameName);
        localStorage.setItem(POINTS_KEY, points);
        localStorage.setItem('ownedFrames', JSON.stringify(ownedFrames));
        pointsEl.textContent = points;
        alert(`You bought frame ${i}!`);
        localStorage.setItem('selectedFrame', frameName);
        refreshFrameButtons();
      }
    });

    frameCard.appendChild(frameWrapper);
    frameCard.appendChild(btn);
    frameList.appendChild(frameCard);
  }
}

refreshFrameButtons();