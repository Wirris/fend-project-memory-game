/*
 * A list containing the Stars for the star rating. In this case 3. But can add more easily.
 */

var stars = [
  "star",
  "star",
  "star"
];

/*
 * A list that contains potential favicon icons
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

/*
 * Doubles the icons for the Pairs game
 */

var cardList = icons.concat(icons);

var moveCount = 0;

/*
 * Assigning the star rating to the HTML index.
 */

starTotal();
function starTotal() {
  var starHTML = [];

  stars.forEach(function(){
    starHTML.push($('<li class="star"><i class="fa fa-star"></i></li>'));
  });

  $('.stars').append(starHTML);
}


/*
 * Using the cardlist and shuffle function we create our random deck.
 * Adding them to the HTML index.
 */

dealCards();
function dealCards() {
  shuffle(cardList);
  var cardHTML = [];

  cardList.forEach(function(card) {
    cardHTML.push($('<li class="card"><i class="fa fa-' + card + '"></i></li>'));
  });

  $('.deck').append(cardHTML);
}

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

var openCard;
var timer;
var secondsPassed = 0;

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
   $('.game-timer').text(secondsPassed);

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

//shows the card's favicon
function showCard(card) {
  card.addClass('open show');
}

//removes the card's favicon
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
  var counter = $('.moves');
  var current = parseInt(counter.text());
  counter.text(current + 1);
}

//keeps track of the time in seconds
function incrementTimer() {
  secondsPassed++;
}

//removes a star from the star rating
function removeStar() {
  stars.pop();
}

// Pops up a modal giving the player their score rating, time taken and moves made
function gameSuccess() {
  window.clearInterval(timer);
  $('.time-display').text(secondsPassed);
  $('.move-display').text($('.moves').text());
  $('#successModal').modal();
}

//force restart any time by clicking the repeat favicon
$('.restart').on('click', restartGame);

//Restarts everything in the game. Without refreshing the page.
function restartGame() {
  $('#successModal').modal('hide');
  $('.moves').text('0');
  window.clearInterval(timer);
  timer = null;
  secondsPassed = 0;
  clearCards();
  dealCards();
}
