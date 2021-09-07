const left = document.querySelector(".slidermenu__arrow-scroll--left");
const right = document.querySelector(".slidermenu__arrow-scroll--right");
const items = document.querySelector(".slidermenu__items");

const step = 100;
const maxRight = 700;
const minRight = 0;

let currentRight=0;



right.addEventListener("click", function (e) {
  loop("right", e);
});

left.addEventListener("click", function (e) {
  loop("left", e);
});

function loop(direction, e) {
  e.preventDefault();

  if (direction === "right") {
      items.appendChild(items.firstElementChild);
           

    } else {
    items.insertBefore(items.lastElementChild,
      items.firstElementChild);
  }
};

const hamburgerMenu = document.querySelector(".hamburger-menu-link");
const fullScreenMenu= document.querySelector(".fullscreen-menu");
const fullScreenMenuClose= document.querySelector(".fullscreen-menu__close");

hamburgerMenu.addEventListener("click", function(e){
  e.preventDefault();
  fullScreenMenu.style.display = "flex";
});

fullScreenMenuClose.addEventListener("click", function(e){
  e.preventDefault();
  fullScreenMenu.style.display = "none";
});


// const step = 100;
// const maxRight = 700;
// const minRight = 0;

// let currentRight = 0;

// items.style.right = currentRight;

// right.addEventListener("click", function (e) {
//   e.preventDefault();

  // if(currentRight<maxRight){
  //   currentRight+=step;
  //   items.style.right=currentRight+"px";
  // }
// });

// left.addEventListener("click", function(e){
//   e.preventDefault();

//   if(currentRight>minRight){
//     currentRight-=step;
//     items.style.right=currentRight+"px";
//   }
// })