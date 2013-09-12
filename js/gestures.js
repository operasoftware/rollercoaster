document.addEventListener("DOMContentLoaded", function() {

	var swipePane = document.querySelector('#swipePane'),
			previousLink = document.querySelector('.previous a'),
			nextLink = document.querySelector('.next a');

  // Disable object dragging
	swipePane.addEventListener('dragstart', function(evt) {
    evt.preventDefault();
  });
	
	var startX, startY;
	
	swipePane.addEventListener('touchstart', function(evt) {
		startX = evt.touches[0].pageX;
		startY = evt.touches[0].pageY;
	});
	
	// Disable horizontal scroll but enable vertical scrolling
	swipePane.addEventListener('touchmove', function(evt) {
			var hChange = evt.changedTouches[0].pageX - startX;
			var vChange = evt.changedTouches[0].pageY - startY;
			
			if(Math.abs(hChange)>10 && Math.abs(hChange) > Math.abs(vChange)) {
				evt.preventDefault();
			}
	});
	
	var pageSwipe = Hammer(swipePane, { swipe_velocity: 0.05 });
	
	pageSwipe.on("swiperight", function() {
	  if(previousLink) window.location.href = previousLink.href;
	});

	pageSwipe.on("swipeleft", function() {
	  if(nextLink) window.location.href = nextLink.href;
	});

});