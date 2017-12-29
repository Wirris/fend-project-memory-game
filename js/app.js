/*
 * Create a list that holds all of your cards
 */
var icons = [
  "diamond",
  "paper-plane-o",
  "anchor",
  "bolt",
  "leaf",
  "bicycle",
  "bomb",
  "cube"
];
var cardList = icons.concat(icons);

var moveCount = 0;

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */
shuffle(cardList);
var cardHTML = [];

cardList.forEach(function(card) {
  cardHTML.push($('<li class="card"><i class="fa fa-' + card + '"></i></li>'));
});

$('.deck').append(cardHTML);

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
var openCard;

$('.card').on('click', function() {
   // if first card start timer
   // if last card end timer and show completion
   var card = $(this);
   if (card.hasClass('open') || card.hasClass('match')) {
     return;
   }

   showCard(card);

   if(!openCard) {
     openCard = card;
   } else {
     if(openCard.children('i')[0].classList.value == card.children('i')[0].classList.value) {
       matchCard(openCard);
       matchCard(card);
       if ($('.match').length === cardList.length) {
         gameSuccess();
       }
     } else {
       window.setTimeout(function(card1, card2) {
         hideCard(card1);
         hideCard(card2);
       }, 1000, openCard, card);
     }
     openCard = null;
     incrementMoveCounter();
   }
 });

function showCard(card) {
  card.addClass('open show');
}

function hideCard(card) {
  card.removeClass('open show');
}

function matchCard(card) {
  card.removeClass('open show').addClass('match');
}

function incrementMoveCounter() {
  var counter = $('.moves');
  var current = parseInt(counter.text());
  counter.text(current + 1);
}

function gameSuccess() {
  $('#successModal').modal();
}

$('.restart').on('click', restartGame);

function restartGame() {
  $('#successModal').modal('hide');
  $('.moves').text('0');
  window.clearInterval(timer);
  timer = null;
  secondsPassed = 0;
  clearCards();
  dealCards();
}
