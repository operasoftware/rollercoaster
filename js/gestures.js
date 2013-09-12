document.addEventListener("DOMContentLoaded", function() {

	var swipePane = document.querySelector('#swipePane'),
			previousLink = document.querySelector('.previous a'),
			nextLink = document.querySelector('.next a');
	
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
	
	var navInvoked = false;
	
	function goBack() {
	  if(navInvoked) return;
	  navInvoked = true;
	  if(previousLink) window.location.href = previousLink.href;
	}
	
	function goForward() {
	  if(navInvoked) return;
	  navInvoked = true;
	  if(nextLink) window.location.href = nextLink.href;
	}
	
	var dragOptions = { drag_min_distance: 100 };

	Hammer(swipePane).on("swiperight", goBack);
	Hammer(swipePane, dragOptions).on("dragright", goBack);

	Hammer(swipePane).on("swipeleft", goForward);
	Hammer(swipePane, dragOptions).on("dragleft", goForward);

});