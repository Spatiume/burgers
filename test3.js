// // slidermenu my

// const left = document.querySelector(".slidermenu__arrow-scroll--left");
// const right = document.querySelector(".slidermenu__arrow-scroll--right");
// const items = document.querySelector(".slidermenu__items");

// right.addEventListener("click", function (e) {
//   loop("right", e);
// });

// left.addEventListener("click", function (e) {
//   loop("left", e);
// });

// function loop(direction, e) {
//   e.preventDefault();

//   if (direction === "right") {
//     items.appendChild(items.firstElementChild);
//   } else {
//     items.insertBefore(items.lastElementChild,
//       items.firstElementChild);
//   }
// };

// box slider
$(document).ready(function () {
  $('.slidermenu__items').bxSlider();
});

// fullscreen menu

const hamburgerMenu = document.querySelector(".hamburger-menu-link");
const fullScreenMenu = document.querySelector(".fullscreen-menu");
const fullScreenMenuClose = document.querySelector(".fullscreen-menu__close");

hamburgerMenu.addEventListener("click", function (e) {
  e.preventDefault();
  fullScreenMenu.style.display = "flex";
});

fullScreenMenuClose.addEventListener("click", function (e) {
  e.preventDefault();
  fullScreenMenu.style.display = "none";
});

$(".menu__link").on('click', e => {
  $(fullScreenMenu).css({ 'display': 'none' });
})



// team section
let teamItems = $('.team__item');
let teamItemLink = $('.team__link');

$('.team__link').on('click', (e) => {
  e.preventDefault();

  $(e.currentTarget).closest('.team__item').toggleClass('team__item--active');
  $(e.currentTarget).closest('.team__item').siblings('.team__item').removeClass('team__item--active');
})

//burger menu

$('.burgermenu__trigger').on('click', e => {
  e.preventDefault();

  $(e.currentTarget).closest('.burgermenu__item').toggleClass('burgermenu__item--active');
  $(e.currentTarget).closest('.burgermenu__item').siblings('.burgermenu__item').removeClass('burgermenu__item--active');
})

// order menu

const orderForm = document.querySelector('.orderForm');
const orderBtn = document.querySelector('#order__btn');

orderBtn.addEventListener('click', (e) => {
  e.preventDefault();
  // console.log(orderForm.elements.name.value);
  if (validateForm(orderForm)) {
    // console.log('vsew ok');
    const data = {
      name: orderForm.elements.name.value,
      phone: orderForm.elements.phone.value,
      comment: orderForm.elements.comment.value,
      to: 'some-mail@mail.com' // По заданию сервер принимает четыре параметра, включая email. 
      // Но по макету в форме email он отсутствует.
    }
    const xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.open('POST', 'https://webdev-api.loftschool.com/sendmail');
    xhr.setRequestHeader('content-type', 'application/json');
    xhr.send(JSON.stringify(data));
    xhr.addEventListener('load', () => {
      console.log(xhr.response.message);
    });
  }
});

function validateForm(form) {
  let valid = true;

  if (!validateField(form.elements.name)) {
    valid = false;
  }

  if (!validateField(form.elements.phone)) {
    valid = false;
  }

  if (!validateField(form.elements.comment)) {
    valid = false;
  }

  return valid;
}

function validateField(field) {
  // field.nextElementSibling.textContent = field.validationMessage;
  if (field.checkValidity()) {
    $(field).css('border-color', 'transparent');
  } else {
    $(field).css('border-color', 'red');
  }
  return field.checkValidity();
}
