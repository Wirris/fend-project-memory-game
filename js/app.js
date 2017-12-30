//Our Icons list. Potential to add more if desired.
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


 //Doubles the icons for the Pairs game
var cardList = icons.concat(icons);

var moveCount = 0;
var openCard;
var timer;
var secondsPassed = 0;

/*
 * Using the cardlist and shuffle function we create our random deck.
 * - Adding them to the HTML index.
 */

$(dealCards);
function dealCards() {
  shuffle(cardList);
  var cardHTML = [];

  cardList.forEach(function(card) {
    cardHTML.push($('<li class="card"><i class="fa fa-' + card + '"></i></li>'));
  });

  $('.deck').append(cardHTML);
}

//force restart any time by clicking the repeat icon
$('.restart').on('click', restartGame);

/*
 * Whenever the first card is clicked, it will show its icon providing:
 * - there isn't another card open
 * - it isn't already openCard
 * - it hasn't matched already
 */

$('.deck').on('click', '.card', function() {
   var card = $(this);

   if ($('.open').length > 1 || card.hasClass('open') || card.hasClass('match')) {
     return;
   }

   showCard(card);

/*
 * The timer will start on the first click. Counting in Seconds.
 */

   if (!timer) {
     timer = window.setInterval(incrementTimer, 1000);
   }

/*
 * This function is to match the pairs.
 * - if the classList value is the same as the first card they match
 * - if they match they remove the open show class, and gain the match class.
 * - this locks them out of play
 * - once all cards are matched, the game is complete!
 *
 * If the card doesn't match the openCard,
 * - both are shown for 1 second
 * - then they are both hidden again
 */

   if (!openCard) {
     openCard = card;
   } else {
     incrementMoveCounter();
     if (openCard.children('i')[0].classList.value == card.children('i')[0].classList.value) {
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
   }
 });

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

//shows the card's icon
function showCard(card) {
  card.addClass('open show');
}

//removes the card's icon
function hideCard(card) {
  card.removeClass('open show');
}

//removes all cards from the game (for reset)
function clearCards() {
  $('.card').remove();
  openCard = null;
}

// locks the card out of the game when matched
function matchCard(card) {
  card.removeClass('open show').addClass('match');
}

//keeps track of how many moves the player makes
function incrementMoveCounter() {
  moveCount++;
  updateMoves();
  updateStars();
}

//tracks the move counter
function updateMoves() {
  var counter = $('.moves');
  counter.text(moveCount);
}

//changes the star rating depending on moves taken
function updateStars() {
  if(moveCount > 24) {
    $('.fa-star:eq(1)').addClass('fa-star-o');
  } else if (moveCount > 17) {
    $('.fa-star:eq(2)').addClass('fa-star-o');
  } else {
    $('.fa-star-o').removeClass('fa-star-o');
  }
}

//keeps track of the time in seconds
function incrementTimer() {
  secondsPassed++;
  $('.game-timer').text(secondsPassed);
}

//Specifically resets the timer
function resetTimer() {
  window.clearInterval(timer);
  timer = null;
  secondsPassed = 0;
  $('.game-timer').text(0)
}

//Resets the moves and stars accordingly
function resetMoves() {
  moveCount = 0;
  updateMoves();
  updateStars();
}

// Pops up a modal giving the player their score rating, time taken and moves made
function gameSuccess() {
  window.clearInterval(timer);
  $('.time-display').text(secondsPassed);
  $('.move-display').text(moveCount);
  $('.stars').clone().appendTo('.star-rating');
  $('#successModal').modal();
}

//Stops the stars being recorded when playing the game again
function hideModal() {
  $('#successModal').modal('hide');
  $('.star-rating .stars').remove();
}

//Restarts everything in the game. Without refreshing the page.
function restartGame() {
  hideModal();
  resetMoves();
  resetTimer();
  clearCards();
  dealCards();
}
