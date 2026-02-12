// ===== SHOOTERS - NEON RAVE DRINKING GAME =====
const addBtn = document.getElementById("addBtn");
const resetBtn = document.getElementById("resetBtn");
// const newRoundBtn = document.getElementById("newRoundBtn");
const nextBtn = document.getElementById("nextBtn");
const action = document.getElementById("action");
const player = document.getElementById("player");
const result = document.getElementById("result");
const cardsContainer = document.getElementById("cardsContainer");

let turnCounter = 0;
let currentDares = [];
let cardsRevealed = false;

// ===== AGE VERIFICATION =====
// ===== AGE VERIFICATION - YES/NO =====
window.verifyAge = function (isOfAge) {
  if (isOfAge) {
    // User is 21+ - fade out gate
    document.getElementById("ageGate").style.opacity = "0";
    setTimeout(() => {
      document.getElementById("ageGate").style.display = "none";
    }, 500);
  } else {
    // User is under 21 - redirect or alert
    alert("🔞 SORRY, YOU MUST BE 21 OR OLDER TO ENTER. DRINK RESPONSIBLY!");
    window.location.href = "https://www.responsibility.org"; // Optional redirect
  }
};

// 🎉 50+ NEON DARES - SHOOTERS EDITION 🎉
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

// ===== NEW ROUND =====
// newRoundBtn.onclick = function () {
//   if (playersList.length === 0) {
//     action.textContent = "⚠️ ADD PLAYERS FIRST!";
//     action.classList.add("neon-text-pink");
//     return;
//   }
//   resetCards();
//   cardsRevealed = false;
//   action.textContent = `${player.textContent}, PICK YOUR DESTINY!`;
//   action.classList.add("neon-text-blue");
//   result.innerHTML = "";
//   newRoundBtn.disabled = false;
//   nextBtn.disabled = false;
// };

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
  newRoundBtn.disabled = false;
  nextBtn.disabled = false;
};

// ===== RESET GAME =====
resetBtn.onclick = function () {
  playersList.length = 0;
  turnCounter = 0;
  player.textContent = "PLAYER 1";
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

  const card = document.querySelector(`.card[data-index="${cardIndex}"]`);
  const cardBack = card.querySelector(".card-back");

  card.classList.add("flipped");

  const dare = currentDares[cardIndex];
  cardBack.textContent = dare;

  result.innerHTML = `<div class="result-text">${dare}</div>`;

  cardsRevealed = true;
  action.textContent = "🎲 PERFORM THE DARE! 🎲";
  action.classList.add("neon-text-green");

  newRoundBtn.disabled = true;
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
