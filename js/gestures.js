document.addEventListener("DOMContentLoaded", function() {

  var swipePane = document.querySelector('#swipePane'),
      previousLink = document.querySelector('.previous a'),
      nextLink = document.querySelector('.next a'),
      screenshot = document.querySelector('.screenshot'),
      previousOverlay = document.querySelector('.previousOverlay'),
      nextOverlay = document.querySelector('.nextOverlay');

  var cssPropNamePrefixes = ['O', 'MS', 'Moz', 'Webkit'];

  function getCSSPropertyName(cssDefaultPropName) {
    var cssPropNameSuffix = cssDefaultPropName.charAt(0).toUpperCase() + cssDefaultPropName.slice(1);
    var el = document.createElement('div');
    var style = el.style;
    for (var i = 0, l = cssPropNamePrefixes.length; i < l; i++) {
      var cssPrefixedPropName = cssPropNamePrefixes[i] + cssPropNameSuffix;
      if( style[ cssPrefixedPropName ] !== undefined ) {
        return cssPrefixedPropName;
      }
    }
    return cssDefaultPropName; // fallback to standard prop name
  }

  var transitionCSSPropName = getCSSPropertyName('transition');
  var transformCSSPropName = getCSSPropertyName('transform');
  var filterCSSPropName = getCSSPropertyName('filter');

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
    if(navState === 3) { // invoked state
      navState = 0; // reset to pending state
      evt.preventDefault();
    }
  });

  function startHandler(evt) {
    if(navState !== 0) {
      return;
    }
    
    navState = 1; // started state
    
    if(evt.type == 'touchstart') {
      startX = evt.touches[0].pageX;
      startY = evt.touches[0].pageY;
    } else { // mousedown
      startX = evt.clientX;
      startY = evt.clientY;
    }

    // Start page navigation drag tracking
    swipePane.addEventListener(evt.type == 'touchstart' ? 'touchmove' : 'mousemove', moveHandler);
  }

  function moveHandler(evt) {
    if(navState === 1) { // started state
      navState = 2; // running state
      swipePane.addEventListener(evt.type == 'touchmove' ? 'touchend' : 'mouseup', endHandler);
    } else if(navState !== 2) { // running state
      return;
    }
    
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

    // Only take action when movement is in a horizontal direction
    if(Math.abs(hChange) > Math.abs(vChange)) {

      // Animate previous overlay element
      if(previousLink && hChange > 9) {
        evt.preventDefault(); // Disable horizontal scroll
        if(hChange < 150) {
          var effectVal = hChange / 180;
          previousOverlay.style[transformCSSPropName] = 'translate3d(' + hChange + 'px,0,0)';
          previousOverlay.style.opacity = effectVal;
          previousOverlay.style.backgroundColor = '#3c3c3c';
          screenshot.style[filterCSSPropName] = 'grayscale(' + effectVal + ')';
        } else {
          previousOverlay.style.opacity = 0.95;
          previousOverlay.style[transformCSSPropName] = 'translate3d(150px,0,0)';
          previousOverlay.style.backgroundColor = '#000';
          screenshot.style[filterCSSPropName] = 'grayscale(1)';
        }
      } else if(nextLink && hChange < -9) { // Animate next overlay element
        evt.preventDefault(); // Disable horizontal scroll
        if(hChange > -150) {
          var effectVal = hChange / -180;
          nextOverlay.style[transformCSSPropName] = 'translate3d(' + hChange + 'px,0,0)';
          nextOverlay.style.opacity = effectVal;
          nextOverlay.style.backgroundColor = '#3c3c3c';
          screenshot.style[filterCSSPropName] = 'grayscale(' + effectVal + ')';
        } else {
          nextOverlay.style[transformCSSPropName] = 'translate3d(-150px,0,0)';
          nextOverlay.style.opacity = 0.95;
          nextOverlay.style.backgroundColor = '#000';
          screenshot.style[filterCSSPropName] = 'grayscale(1)';
        }
      }
      
    } else {
      previousOverlay.style[transformCSSPropName] = nextOverlay.style[transformCSSPropName] = 'translate3d(0,0,0)';
      screenshot.style[filterCSSPropName] = 'none';
    }
    
  }

  function endHandler(evt) {
    if(navState !== 2) {
      return;
    }
    
    // Stop page navigation drag tracking
    swipePane.removeEventListener(evt.type == 'touchend' ? 'touchmove' : 'mousemove', moveHandler);
    // Remove self
    swipePane.removeEventListener(evt.type == 'touchend' ? 'touchend' : 'mouseup', endHandler);

    if(previousLink && hChange > 149) {
      navState = 3; // invoked state

      previousOverlay.style.width = '100%';
      
      window.location.href = previousLink.href; // navigate to previous url
      
    } else if(nextLink && hChange < -149) {
      navState = 3; // invoked state

      nextOverlay.style.width = '100%';
      
      window.location.href = nextLink.href; // navigate to next url
      
    } else {
      navState = 0; // pending state
      
      previousOverlay.style[transitionCSSPropName] = nextOverlay.style[transitionCSSPropName] = "all 0.2s ease";
      setTimeout(function() {
        previousOverlay.style[transitionCSSPropName] = nextOverlay.style[transitionCSSPropName] = null;
      }, 250);
      previousOverlay.style[transformCSSPropName] = nextOverlay.style[transformCSSPropName] = 'translate3d(0,0,0)';
      screenshot.style[filterCSSPropName] = 'none';
    }
    
  }

  swipePane.addEventListener('touchstart', startHandler);
  swipePane.addEventListener('mousedown', startHandler);

});