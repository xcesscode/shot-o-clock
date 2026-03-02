// ===== SHOOTERS - NEON RAVE DRINKING GAME =====
const addBtn = document.getElementById("addBtn");
const resetBtn = document.getElementById("resetBtn");
const nextBtn = document.getElementById("nextBtn");
const action = document.getElementById("action");
const player = document.getElementById("player");
const result = document.getElementById("result");
const cardsContainer = document.getElementById("cardsContainer");

let turnCounter = 0;
let cardFlipCounter = 0;
const SPECIAL_CARD_NUMBER = 15;
let specialDareTriggered = false;
let currentDares = [];
let cardsRevealed = false;

// ===== CAMERA FUNCTIONS =====
let mediaStream = null;
let mediaRecorder = null;
let recordedChunks = [];

function startCameraFlow() {
  // Show the camera UI
  document.getElementById("cameraUI").style.display = "flex";

  // Reset UI state
  document.getElementById("countdownDisplay").style.display = "block";
  document.getElementById("startRecordingBtn").style.display = "inline-block";
  document.getElementById("liveCamera").style.display = "none";
  document.getElementById("videoPreviewArea").style.display = "none";
  document.getElementById("countdownDisplay").textContent = "5";
}

async function requestCamera() {
  try {
    mediaStream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: "user",
        width: { ideal: 640 },
        height: { ideal: 480 },
      },
      audio: true,
    });

    const liveVideo = document.getElementById("liveCamera");
    liveVideo.srcObject = mediaStream;
    liveVideo.style.display = "block";

    return true;
  } catch (error) {
    alert(
      "📸 Camera access needed for the 15th card moment! Please allow camera permissions.",
    );
    console.error("Camera error:", error);
    return false;
  }
}

function startCountdown() {
  let count = 5;
  const countdownEl = document.getElementById("countdownDisplay");

  const countdownInterval = setInterval(() => {
    count--;
    countdownEl.textContent = count;

    if (count === 0) {
      clearInterval(countdownInterval);
      countdownEl.style.display = "none";
      startRecording();
    }
  }, 1000);
}

function startRecording() {
  if (!mediaStream) return;

  recordedChunks = [];
  mediaRecorder = new MediaRecorder(mediaStream);

  mediaRecorder.ondataavailable = (event) => {
    if (event.data.size > 0) {
      recordedChunks.push(event.data);
    }
  };

  mediaRecorder.onstop = () => {
    const blob = new Blob(recordedChunks, { type: "video/mp4" });
    const videoUrl = URL.createObjectURL(blob);

    const recordedVideo = document.getElementById("recordedVideo");
    recordedVideo.src = videoUrl;

    window.lastRecordedVideo = {
      blob: blob,
      url: videoUrl,
    };

    document.getElementById("liveCamera").style.display = "none";
    document.getElementById("videoPreviewArea").style.display = "block";

    if (mediaStream) {
      mediaStream.getTracks().forEach((track) => track.stop());
      mediaStream = null;
    }
  };

  mediaRecorder.start();

  setTimeout(() => {
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      mediaRecorder.stop();
    }
  }, 3000);
}

function closeCameraUI() {
  document.getElementById("cameraUI").style.display = "none";

  if (mediaRecorder && mediaRecorder.state !== "inactive") {
    mediaRecorder.stop();
  }

  if (mediaStream) {
    mediaStream.getTracks().forEach((track) => track.stop());
    mediaStream = null;
  }
}

function shareVideo(platform) {
  if (!window.lastRecordedVideo) return;

  const videoBlob = window.lastRecordedVideo.blob;
  const videoFile = new File([videoBlob], "shotsoclock-15th-card.mp4", {
    type: "video/mp4",
  });

  const shareText = "We just hit the 15th card on Shots O'Clock! 🎬🔫";
  const shareUrl = "https://shotsoclock.co.za";
  const hashtag = "#shotsoclock";

  if (platform === "whatsapp") {
    // WhatsApp - Works perfectly
    if (navigator.share && navigator.canShare({ files: [videoFile] })) {
      navigator
        .share({
          title: "Shots O'Clock",
          text: shareText,
          url: shareUrl,
          files: [videoFile],
        })
        .catch(() => {
          window.open(
            `https://wa.me/?text=${encodeURIComponent(shareText + " " + shareUrl + " " + hashtag)}`,
          );
        });
    } else {
      window.open(
        `https://wa.me/?text=${encodeURIComponent(shareText + " " + shareUrl + " " + hashtag)}`,
      );
    }
  } else if (platform === "tiktok") {
    // TikTok - Best possible flow
    downloadVideo();

    // Copy hashtag to clipboard
    navigator.clipboard
      .writeText(hashtag)
      .then(() => {
        // Ask user what's next
        if (
          confirm(
            "📱 Video saved! Hashtag copied to clipboard. Open TikTok now?",
          )
        ) {
          window.open("tiktok://");
        } else {
          alert("✅ Hashtag copied! Open TikTok and paste it when you upload.");
        }
      })
      .catch(() => {
        // Fallback if clipboard fails
        if (confirm("📱 Video saved! Open TikTok to upload now?")) {
          window.open("tiktok://");
        }
      });
  }
}

function downloadVideo() {
  if (!window.lastRecordedVideo) return;

  const a = document.createElement("a");
  a.href = window.lastRecordedVideo.url;
  a.download = `shotsoclock-15th-card-${new Date().getTime()}.mp4`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

// ===== AGE VERIFICATION =====
window.verifyAge = function (isOfAge) {
  if (isOfAge) {
    document.getElementById("ageGate").style.opacity = "0";
    setTimeout(() => {
      document.getElementById("ageGate").style.display = "none";
    }, 500);
  } else {
    alert("🔞 SORRY, YOU MUST BE 18 OR OLDER TO ENTER. DRINK RESPONSIBLY!");
    window.location.href = "https://www.responsibility.org";
  }
};

// ===== DARES DATABASE =====
const daresDatabase = [
  "🔮 TAKE A SHOT - CHUG! CHUG!",
  "🎯 CHOOSE SOMEONE TO TAKE A SHOT",
  "💃 PERSON TO YOUR RIGHT TAKES A SHOT",
  "🕺 PERSON TO YOUR LEFT TAKES A SHOT",
  "🔥 EVERYBODY DRINKS! HOUSE ROUND!",
  "⚡ FIRST TO LAUGH = 2 SHOTS",
  "💀 FINISH YOUR DRINK. NOW.",
  "👑 MAKE A RULE. EVERYONE OBEYS.",
  "🌊 WATERFALL - DON'T STOP!",
  "🎪 GIVE 2 SHOTS TO ANY PLAYER",
  "🤘 NON-DOMINANT HAND SHOT",
  "🎤 LAST TO RAISE HAND = DRINK",
  "🎬 EVERYONE SHOUT SHOTS O'CLOCK! (Camera moment)",
  "📿 TELL A JOKE. NO LAUGH = 2 SHOTS",
  "🔄 SWAP DRINKS WITH SOMEONE",
  "🎭 RHYME TIME - YOU START",
  "🩰 MAKE SOMEONE DANCE OR DRINK",
  "👁️ BLINDFOLDED SHOT",
  "📞 CALL A RANDOM NUMBER AND SING HAPPY BIRTHDAY",
  "💪 ARM WRESTLE WITH THE PERSON DIRECTLY OPPOSITE YOU. LOSER DRINKS",
  "🤸 5 PUSH-UPS OR DRINK",
  "🧠 SPELL YOUR NAME BACKWARDS OR DRINK",
  "🎪 ONE-LEGGED SHOT",
  "🍻 TOAST THE GROUP",
  "🧩 CREATE A NEW RULE",
  "💘 DRINK IF YOU'RE SINGLE",
  "💍 DRINK IF YOU'RE TAKEN",
  "🎰 ROCK PAPER SCISSORS WITH ANYONE - TAKES A SHOT",
  "🎨 FUNNY FACE - FIRST LAUGH DRINKS",
  "👃 SIP FROM EVERYONE'S DRINK",
  "🎲 GROUP CHEERS - EVERYONE SIPS",
  "🎱 TRUTH OR DARE - YOU GO FIRST",
  "🎮 LAST TO TOUCH THE FLOOR DRINKS",
  "🎯 COMPLIMENT EVERYONE OR DRINK",
  "🎤 SHOT WITH NO HANDS",
  "⚡ EVERYONE TAKES SHOTS EXCEPT YOU",
  "🌀 YOU AND RIGHT PERSON DRINK",
  "🌀 YOU AND LEFT PERSON DRINK",
  "🆙 NEVER HAVE I EVER - LOSERS DRINK",
  "🎪 HAND STACK - LAST HAND DRINKS",
  "🎭 ENDLESS CHEERS - FIRST TO STOP DRINKS",
  "🔵 TOUCH SOMETHING BLUE. LAST 3 DRINK",
  "🔥 ROAST YOURSELF. FIRST LAUGH DRINKS",
  "🎪 SIMON SAYS - FIRST MISTAKE DRINKS",
  "📖 ONE WORD STORY - BREAK THE FLOW = DRINK",
  "🤫 MUTE: SPEAK IN 30 SEC = 3 SHOTS",
  "🎲 FLIP A COIN - HEADS YOU DRINK",
  "🌈 EVERYONE WITH BLUE EYES DRINK",
  "THE FIRST PERSON TO ACKNOWLEDGE YOU TAKES A SHOT",
  "EVERYBODY WEARING JEANS DRINKS",
];

const playersList = [];

// Initialize the NEON cards
initializeCards();

// ===== ADD PLAYER =====
addBtn.onclick = function () {
  const playerName = window.prompt("🎉 ENTER PLAYER NAME:");
  if (playerName && playerName.trim() !== "") {
    playersList.push(playerName.trim().toUpperCase());
    if (playersList.length === 1) {
      player.textContent = playersList[0];
      player.classList.add("neon-text-pink");
    }
    action.textContent = `${playersList[playersList.length - 1]} JOINED THE RAVE!`;
    action.classList.add("neon-text-green");
    setTimeout(() => {
      action.textContent = `CHOOSE A CARD!`;
      action.classList.remove("neon-text-green");
      action.classList.add("neon-text-blue");
    }, 1500);
  }
};

// ===== NEXT PLAYER =====
nextBtn.onclick = function () {
  if (playersList.length === 0) {
    action.textContent = "⚠️ ADD PLAYERS FIRST!";
    action.classList.add("neon-text-pink");
    return;
  }

  turnCounter++;
  if (turnCounter >= playersList.length) {
    turnCounter = 0;
  }

  player.textContent = playersList[turnCounter];
  player.classList.add("neon-text-pink");
  resetCards();
  cardsRevealed = false;
  action.textContent = `${player.textContent}, YOUR TURN!`;
  action.classList.add("neon-text-green");
  result.innerHTML = "";
};

// ===== RESET GAME =====
resetBtn.onclick = function () {
  playersList.length = 0;
  turnCounter = 0;
  cardFlipCounter = 0;
  specialDareTriggered = false;

  player.textContent = "ADD PLAYERS";
  action.textContent = "ADD PLAYERS TO BEGIN";
  action.classList.add("neon-text-blue");
  result.innerHTML = "";
  resetCards();
  cardsRevealed = false;
};

// ===== INITIALIZE NEON CARDS =====
function initializeCards() {
  cardsContainer.innerHTML = "";

  for (let i = 0; i < 3; i++) {
    const card = document.createElement("div");
    card.className = "card";
    card.dataset.index = i;

    const cardInner = document.createElement("div");
    cardInner.className = "card-inner";

    const cardFront = document.createElement("div");
    cardFront.className = "card-front";

    const cardNumber = document.createElement("div");
    cardNumber.className = "card-number";
    cardNumber.textContent = `CARD ${i + 1}`;
    cardFront.appendChild(cardNumber);

    const cardBack = document.createElement("div");
    cardBack.className = "card-back";

    cardInner.appendChild(cardFront);
    cardInner.appendChild(cardBack);
    card.appendChild(cardInner);

    card.addEventListener("click", () => selectCard(i));

    cardsContainer.appendChild(card);
  }

  selectRandomDares();
}

// ===== SELECT A CARD =====
function selectCard(cardIndex) {
  if (cardsRevealed || playersList.length === 0) return;

  cardFlipCounter++;

  const card = document.querySelector(`.card[data-index="${cardIndex}"]`);
  const cardBack = card.querySelector(".card-back");

  card.classList.add("flipped");

  // Check if this is the 15th card
  if (cardFlipCounter === SPECIAL_CARD_NUMBER && !specialDareTriggered) {
    const specialDare =
      "🎬 15TH CARD SPECIAL! EVERYONE SHOUT SHOTS O'CLOCK! 📸";
    cardBack.textContent = specialDare;
    result.innerHTML = `<div class="result-text">${specialDare}</div>`;

    startCameraFlow();
    specialDareTriggered = true;
  } else {
    const dare = currentDares[cardIndex];
    cardBack.textContent = dare;
    result.innerHTML = `<div class="result-text">${dare}</div>`;
  }

  cardsRevealed = true;
  action.textContent = "🎲 PERFORM THE DARE! 🎲";
  action.classList.add("neon-text-green");
}

// ===== SELECT RANDOM DARES =====
function selectRandomDares() {
  currentDares = [];
  const shuffled = [...daresDatabase].sort(() => 0.5 - Math.random());

  for (let i = 0; i < 3; i++) {
    currentDares.push(shuffled[i]);
  }
}

// ===== RESET CARDS =====
function resetCards() {
  document.querySelectorAll(".card").forEach((card) => {
    card.classList.remove("flipped");
  });

  selectRandomDares();

  document.querySelectorAll(".card-back").forEach((cardBack) => {
    cardBack.textContent = "";
  });
}
