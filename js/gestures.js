document.addEventListener("DOMContentLoaded", function() {

  var swipePane = document.querySelector('#swipePane'),
      previousLink = document.querySelector('.previous a'),
      nextLink = document.querySelector('.next a'),
      screenshot = document.querySelector('.screenshot'),
      previousOverlay = document.querySelector('.previousOverlay'),
      nextOverlay = document.querySelector('.nextOverlay');
      
  var transitionPropNames = ['transition', 'OTransition', 'MSTransition', 'MozTransition', 'WebkitTransition'];
  var transformPropNames = ['transform', 'OTransform', 'MSTransform', 'MozTransform', 'WebkitTransform'];
      
  function getCSSPropName(propNameSearchArray, defaultPropName) {
    var el = document.createElement('div');
    var style = el.style;
    for (var i = 0, l = propNameSearchArray.length; i < l; i++) {
      if( style[ propNameSearchArray[i] ] !== undefined ) {
        return propNameSearchArray[i];
      }
    }
    return defaultPropName; // fallback to standard prop name
  }

  var transitionCSSPropName = getCSSPropName(transitionPropNames, 'transition');
  var transformCSSPropName = getCSSPropName(transformPropNames, 'transform');

  var startX, startY;
  var hChange = 0, vChange = 0;
  var navInvoked = false;
  
  // Disable object dragging
  swipePane.addEventListener('dragstart', function(evt) {
    evt.preventDefault();
  });
  
  // Prevent element clicking in desktop user agents if 
  // navigation actions have been invoked
  swipePane.addEventListener('click', function(evt) {
    if(navInvoked) {
      navInvoked = false;
      evt.preventDefault();
    }
  });
  
  function moveHandler(evt) {
    hChange = evt.changedTouches[0].pageX - startX;
    vChange = evt.changedTouches[0].pageY - startY;

    // Disable horizontal scroll but enable vertical scrolling
    if(Math.abs(hChange)>10 && Math.abs(hChange) > Math.abs(vChange)) {
      // Only prevent default behavior if a previous or next link is available
      if ((hChange > 0 && previousLink) || (hChange < 0 && nextLink)) {
        evt.preventDefault();
      }
    }
    
    // Animate prev/next overlay elements
    if (previousLink && hChange > 20) {
      if(hChange < 150) {
        previousOverlay.style[transformCSSPropName] = 'translate3d(' + hChange + 'px,0,0)';
        previousOverlay.style.opacity = hChange / 150;
        previousOverlay.style.backgroundColor = '#3c3c3c';
      } else {
        previousOverlay.style.opacity = 0.9;
        previousOverlay.style[transformCSSPropName] = 'translate3d(150px,0,0)';
        previousOverlay.style.backgroundColor = '#000';
      }
    } else if (nextLink && hChange < 20) {
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
  }

  swipePane.addEventListener('touchstart', function(evt) {
    startX = evt.touches[0].pageX;
    startY = evt.touches[0].pageY;
    
    // Start page navigation drag tracking
    swipePane.addEventListener('touchmove', moveHandler);
  });
  
  swipePane.addEventListener('touchend', function(evt) {
    // Stop page navigation drag tracking
    swipePane.removeEventListener('touchmove', moveHandler);
    
    if(hChange > 10) {
      navInvoked = true;
      if(hChange >= 150) {
        if(previousLink) {
          previousOverlay.style.width = '100%';
          window.location.href = previousLink.href;
        }
      } else {
        previousOverlay.style[transitionCSSPropName] = "all 0.3s ease";
        setTimeout(function() {
          previousOverlay.style[transitionCSSPropName] = null;
        }, 350);
        previousOverlay.style[transformCSSPropName] = 'translate3d(0,0,0)';
      }
    } else if (hChange < -10) {
      navInvoked = true;
      if(hChange <= -150) {
        if(nextLink) {
          nextOverlay.style.width = '100%';
          window.location.href = nextLink.href;
        }
      } else {
        nextOverlay.style[transitionCSSPropName] = "all 0.3s ease";
        setTimeout(function() {
          nextOverlay.style[transitionCSSPropName] = null;
        }, 350);
        nextOverlay.style[transformCSSPropName] = 'translate3d(0,0,0)';
      }
    } else {
      navInvoked = false;
    }
    
    hChange = vChange = 0;
  });

});