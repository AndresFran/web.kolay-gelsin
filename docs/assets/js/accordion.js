function slide(link) {
  
    var down = function (callback, time) {
      var subMenu = link.nextElementSibling;
      var height = subMenu.clientHeight; 
      var part = height / 100;
      
      var paddingTop = parseInt(window.getComputedStyle(subMenu, null).getPropertyValue('padding-top'));
      var paddingBottom = parseInt(window.getComputedStyle(subMenu, null).getPropertyValue('padding-bottom'));
      var paddingTopPart = parseInt(paddingTop) / 50;
      var paddingBottomPart = parseInt(paddingBottom) / 30;
      
      (function innerFunc(i, t, b) {
  
        subMenu.style.height = i + 'px';
        
        i += part;
        
        if(t < paddingTop) {
        
          t += paddingTopPart;
          subMenu.style.paddingTop = t + 'px';
            
        } else if(b < paddingBottom) {
  
          b += paddingBottomPart;
          subMenu.style.paddingBottom = b + 'px';
        }
        
        if(i < height) { 
        
          setTimeout(function() {
              
              innerFunc(i, t, b);
              
          }, time / 100);
            
        } else { 
            
          subMenu.removeAttribute('style');
          callback();
        }
          
      })(0, 0, 0);
    },
    
    up = function (callback, time) {
        
      var subMenu = link.nextElementSibling;
      var height = subMenu.clientHeight; 
      var part = subMenu.clientHeight / 100;
      var paddingTop = parseInt(window.getComputedStyle(subMenu).paddingTop);
      var paddingBottom = parseInt(window.getComputedStyle(subMenu).paddingBottom);
      var paddingTopPart = parseInt(paddingTop) / 30;
      var paddingBottomPart = parseInt(paddingBottom) / 50;
  
      (function innerFunc(i, t, b) {
  
        subMenu.style.height = i + 'px';
        
        i -= part;
        i = i.toFixed(2);
  
        if(b > 0) {
            
          b -= paddingBottomPart;
          b = b.toFixed(1);                
          subMenu.style.paddingBottom = b + 'px';
            
        } else if(t > 0) {
            
          t -= paddingTopPart;
          t = t.toFixed(1); 
          subMenu.style.paddingTop = t + 'px';
        }
        
        if(i > 0) { 
        
          setTimeout(function() {
              
              innerFunc(i, t, b);
              
          }, time / 100);
            
        } else {
            
          subMenu.removeAttribute('style');
          callback(); 
        }
          
      })(height, paddingTop, paddingBottom);
    }
        
    return {
      down: down,
      up: up
    }
  } 
      
  var accordion = (function() {
  
      var menu = document.querySelectorAll('.accordion');
      var activeClass = 'accordion__link_active';
      var arr = [];
      var timer = 100;
      
      for(let i = 0; i < menu.length; i++) {
  
          for(let p = 0; p < menu[i].children.length; p++) {
  
              var link = menu[i].children[p].firstElementChild;
              
              if(link.classList.contains(activeClass)) {
                  arr[i] = link;
              }
          }
      }
         
      function accordionInner(i) {
              
        var clicked = false;
        
        menu[i].addEventListener('click', function(e) {
  
          if(e.target.tagName === 'A' && !clicked) {
  
            clicked = true;
  
            if(e.target.classList.contains(activeClass)) {
                
              slide(e.target).up(function() {
                  
                clicked = false;
                
                e.target.classList.remove(activeClass);
                
                console.log('slide up of accordion ' + i + ' is done');
              
              }, timer);
                
            } else {
  
              if(arr.length > 0) {
                  
                slide(arr[i-1]).up(function() {
                    
                  arr[i-1].classList.remove(activeClass);
                  
                  arr[i-1] = e.target;
                  
                  console.log('slide up of accordion ' + i + ' is done');
  
                }, timer);
              }
  
              e.target.classList.add(activeClass);
              
              slide(e.target).down(function() {
                
                clicked = false;
                
                arr[i-1] = e.target;
                
                console.log('slide down of accordion ' + i + ' is done');
              
              }, timer);
            }
          }
        });
        
        i++;
        
        if(i < menu.length) { accordionInner(i); }
          
      } accordionInner(0);
  })();