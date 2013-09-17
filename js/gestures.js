document.addEventListener("DOMContentLoaded", function() {

  var swipePane = document.querySelector('#swipePane'),
      previousLink = document.querySelector('.previous a'),
      nextLink = document.querySelector('.next a'),
      screenshot = document.querySelector('.screenshot'),
      previousOverlay = document.querySelector('.previousOverlay'),
      nextOverlay = document.querySelector('.nextOverlay');

  var transitionPropNames = ['transition', 'OTransition', 'MSTransition', 'MozTransition', 'WebkitTransition'];
  var transformPropNames = ['transform', 'OTransform', 'MSTransform', 'MozTransform', 'WebkitTransform'];

  function getCSSPropertyName(propNameSearchArray, defaultPropName) {
    var el = document.createElement('div');
    var style = el.style;
    for (var i = 0, l = propNameSearchArray.length; i < l; i++) {
      if( style[ propNameSearchArray[i] ] !== undefined ) {
        return propNameSearchArray[i];
      }
    }
    return defaultPropName; // fallback to standard prop name
  }

  var transitionCSSPropName = getCSSPropertyName(transitionPropNames, 'transition');
  var transformCSSPropName = getCSSPropertyName(transformPropNames, 'transform');

  var startX, startY;
  var hChange = 0, vChange = 0;
  var navState = 0; // pending state

  // Disable object dragging
  swipePane.addEventListener('dragstart', function(evt) {
    evt.preventDefault();
  });

  // Prevent element clicking in desktop user agents if
  // navigation actions have been invoked
  swipePane.addEventListener('click', function(evt) {
    if(navState == 3) { // invoked state
      navState = 0; // pending state
      evt.preventDefault();
    }
  });

  function startHandler(evt) {
    if(evt.type == 'touchstart') {
      startX = evt.touches[0].pageX;
      startY = evt.touches[0].pageY;
    } else { // mousedown
      startX = evt.clientX;
      startY = evt.clientY;
    }

    navState = 1; // started state

    // Start page navigation drag tracking
    swipePane.addEventListener(evt.type == 'touchstart' ? 'touchmove' : 'mousemove', moveHandler);
  }

  function moveHandler(evt) {
    var moveX, moveY;

    if(evt.type == 'touchmove') {
      moveX = evt.changedTouches[0].pageX;
      moveY = evt.changedTouches[0].pageY;
    } else { // mousemove
      moveX = evt.clientX;
      moveY = evt.clientY;
    }

    hChange = moveX - startX;
    vChange = moveY - startY;

    // Disable horizontal scroll but enable vertical scrolling
    if(Math.abs(hChange)>10 && Math.abs(hChange) > Math.abs(vChange)) {
      // Only prevent default behavior if a previous or next link is available
      if((hChange > 0 && previousLink) || (hChange < 0 && nextLink)) {
        evt.preventDefault();
      }

      // Animate prev/next overlay elements
      if (previousLink && hChange > 10) {
        if(hChange < 150) {
          previousOverlay.style[transformCSSPropName] = 'translate3d(' + hChange + 'px,0,0)';
          previousOverlay.style.opacity = hChange / 150;
          previousOverlay.style.backgroundColor = '#3c3c3c';
        } else {
          previousOverlay.style.opacity = 0.9;
          previousOverlay.style[transformCSSPropName] = 'translate3d(150px,0,0)';
          previousOverlay.style.backgroundColor = '#000';
        }
      } else if(nextLink && hChange < -10) {
        if(hChange > -150) {
          nextOverlay.style[transformCSSPropName] = 'translate3d(' + hChange + 'px,0,0)';
          nextOverlay.style.opacity = hChange / -150;
          nextOverlay.style.backgroundColor = '#3c3c3c';
        } else {
          nextOverlay.style.opacity = 0.9;
          nextOverlay.style[transformCSSPropName] = 'translate3d(-150px,0,0)';
          nextOverlay.style.backgroundColor = '#000';
        }
      }
      
      if(navState == 1) { // started state
        swipePane.addEventListener(evt.type == 'touchmove' ? 'touchend' : 'mouseup', endHandler);
        navState = 2; // running state
      }
    } else {
      previousOverlay.style[transformCSSPropName] = nextOverlay.style[transformCSSPropName] = 'translate3d(0,0,0)';
    }
    
  }

  function endHandler(evt) {
    // Stop page navigation drag tracking
    swipePane.removeEventListener(evt.type == 'touchend' ? 'touchmove' : 'mousemove', moveHandler);

    if(Math.abs(hChange) >= 150) {
      if(previousLink && hChange >= 150) {
        navState = 3; // invoked state

        previousOverlay.style.width = '100%';
        window.location.href = previousLink.href;
        return;
      } else if(nextLink && hChange <= -150) {
        navState = 3; // invoked state

        nextOverlay.style.width = '100%';
        window.location.href = nextLink.href;
        return;
      }
    } else {
      navState = 0; // pending state
      
      previousOverlay.style[transitionCSSPropName] = nextOverlay.style[transitionCSSPropName] = "all 0.3s ease";
      setTimeout(function() {
        previousOverlay.style[transitionCSSPropName] = nextOverlay.style[transitionCSSPropName] = null;
      }, 350);
      previousOverlay.style[transformCSSPropName] = nextOverlay.style[transformCSSPropName] = 'translate3d(0,0,0)';
    }

    swipePane.removeEventListener(evt.type == 'touchend' ? 'touchend' : 'mouseup', endHandler);
  }

  swipePane.addEventListener('touchstart', startHandler);
  swipePane.addEventListener('mousedown', startHandler);

});