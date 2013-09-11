document.addEventListener("DOMContentLoaded", function() {
  
  var swipePane = document.querySelector('#swipePane'),
      previousLink = document.querySelector('.previous a'),
      nextLink = document.querySelector('.next a');
  
  Hammer(swipePane).on("swipeleft", function(event) {
    if(previousLink) window.location.href = previousLink.url;
  });
  
  Hammer(swipePane).on("swiperight", function(event) {
    if(nextLink) window.location.href = nextLink.url;
  });
  
});