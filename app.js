const numOfCards = 12;
let cardImgs = [
  'yukiko.gif',
  'yu.gif',
  'sonic.gif',
  'ryu.gif',
  'ds.gif',
  'adol.gif'
];
let cardTracker = []; //keeps track of cards that are flipped
const winScore = 6; //to win the game the winscore must be half of the number of cards
let score = 0; //internal score not seen by the user
let clicked = 0;

const cardSection = document.querySelector('.card-section');
//p elements in header
const gameClicks = document.querySelector('.click-number');
const lowestClicks = document.querySelector('.lowest-clicks-number');
const winnerDialog = document.querySelector('#winner-dialog');
//p elements in dialog
const userClicks = document.querySelector('.my-clicks');
const localClicks = document.querySelector('.local-clicks');
const newGameBtn = document.querySelector('.new-game-btn');

start();

function start() {
  if (!localStorage.lowestClicks) {
    localStorage.setItem('lowestClicks', 0);
  }
  lowestClicks.innerText = localStorage.lowestClicks;
  createGame();
  cardSection.addEventListener('click', flipCard);
  newGameBtn.addEventListener('click', resetGame);
}

//creates the cards used for the game
function createGame() {
  let cardImgShuffled = shuffle(cardImgs);
  let j = 0;
  for (let i = 0; i < numOfCards; i++) {
    const card = document.createElement('DIV');
    const cardBody = document.createElement('DIV');
    const cardFront = document.createElement('DIV');
    const cardBack = document.createElement('DIV');
    const imgFront = new Image();
    const imgBack = new Image();

    card.classList.add('card');
    cardBody.classList.add('card-body');
    cardBody.dataset.card = cardImgShuffled[j];
    cardFront.classList.add('card-front');
    cardBack.classList.add('card-back');
    imgFront.src = 'imgs/11854.png';
    imgFront.classList.add('card-front-img', 'card-img');
    imgBack.src = `imgs/${cardImgShuffled[j]}`;
    imgBack.classList.add('card-img');

    card.append(cardBody);
    cardBody.append(cardFront, cardBack);
    cardFront.append(imgFront);
    cardBack.append(imgBack);
    cardSection.append(card);

    //checking if the array of card images do not exceed its length
    if (j === cardImgShuffled.length - 1) {
      j = 0;
    } else {
      j++;
    }
  }
}

function flipCard(event) {
  if (event.target.className === 'card-front-img card-img') {
    // clicked++;
    gameClicks.innerText = ++clicked;
    const cardBody = event.target.parentNode.parentNode; //getting the card body so it can be flipped
    cardBody.classList.add('flip');
    //check to make sure that the same card do not get pushed into the card tracker and no more than 2 cards kept track at a time
    if (cardTracker.length < 2 && cardTracker[0] !== cardBody) {
      cardTracker.push(cardBody);
    }
    if (cardTracker.length === 2) {
      cardFlipped(cardTracker);
    }
  }
}

function cardFlipped(cards) {
  //disable all pointer events on the cardsection
  // cardSection.style.pointerEvents = 'none';
  cardSection.removeEventListener('click', flipCard);
  const cardDataOne = cards[0].getAttribute('data-card');
  const cardDataTwo = cards[1].getAttribute('data-card');
  if (
    cards[0].classList.contains('flip') &&
    cards[1].classList.contains('flip')
  ) {
    if (cardDataOne !== cardDataTwo) {
      setTimeout(function() {
        cards[0].classList.remove('flip');
        cards[1].classList.remove('flip');
        // cardSection.style.pointerEvents = 'auto'; //turning the pointer events back on.
        cardTracker = [];
        cardSection.addEventListener('click', flipCard);
      }, 1000);
    } else {
      // cardSection.style.pointerEvents = 'auto';
      cardSection.addEventListener('click', flipCard);
      cardTracker = [];
      isWinner();
    }
  }
}

function isWinner() {
  score++;
  if (score === winScore) {
    let lowestClicks = parseInt(localStorage.lowestClicks);
    userClicks.innerText = clicked;
    if (lowestClicks === 0 || lowestClicks > clicked) {
      localStorage.setItem('lowestClicks', clicked);
    }

    localClicks.innerText = localStorage.lowestClicks;
    //give a little delay so the card can finish flipping
    setTimeout(function() {
      console.dir(winnerDialog);
      $('#winner-dialog').dialog();
    }, 100);
  }
}

function resetGame() {
  $('#winner-dialog').dialog('close');
  cardSection.textContent = '';
  clicked = 0;
  score = 0;
  gameClicks.innerText = 0;
  start();
}

//using Fisher-Yates shuffle algorithm to shuffle the array for each new game
function shuffle(arr) {
  let currentIndex = arr.length - 1;
  let tempVal;
  let randomIndex;
  while (currentIndex >= 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    tempVal = arr[currentIndex];
    arr[currentIndex] = arr[randomIndex];
    arr[randomIndex] = tempVal;
    currentIndex--;
  }

  return arr;
}
