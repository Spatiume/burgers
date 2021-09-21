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

$(".menu__link").on('click', e =>{
  $(fullScreenMenu).css({'display': 'none'});
})

    let teamItems = $('.team__item');
    let teamItemLink = $('.team__link');

    $('.team__link').on('click', (e)=>{
      e.preventDefault();

      $(e.currentTarget).closest('.team__item').toggleClass('team__item--active');
      $(e.currentTarget).closest('.team__item').siblings('.team__item').removeClass('team__item--active');      
    })

    

    $('.burgermenu__trigger').on('click', e =>{
      e.preventDefault();

      $(e.currentTarget).closest('.burgermenu__item').toggleClass('burgermenu__item--active');
      $(e.currentTarget).closest('.burgermenu__item').siblings('.burgermenu__item').removeClass('burgermenu__item--active');
    })