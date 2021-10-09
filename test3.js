// We listen to the resize event
let vh = window.innerHeight * 0.01;
document.documentElement.style.setProperty('--vh', `${vh}px`);
window.addEventListener('resize', () => {
  // We execute the same script as before
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
});

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

$('.burgermenu__close').on('click', e => {
  e.preventDefault();

  $('.burgermenu__trigger').click();
});
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
      overlayOrder.open();
      overlayOrder.setContent(xhr.response.message);
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


//overlay

// const openOverlay = document.querySelector('#openOverlay');
const tamplateOrder = document.querySelector('#overlayOrder').innerHTML;
const overlayOrder = createOverlay(tamplateOrder, 'tamplateOrder');

// openOverlay.addEventListener('click', e => {
//   overlay.open();
//   overlay.setContent('Vse ok');
// });

function createOverlay(tamplate, classTamplate) {
  const fragment = document.createElement('div');
  fragment.innerHTML = tamplate;

  const overlayElement = fragment.querySelector('.overlay');
  const containerElement = fragment.querySelector('.overlay__container');
  containerElement.classList.add(classTamplate);
  const closeElement = fragment.querySelector('.overlay__close');
  const contentElement = fragment.querySelector('.overlay__content');

  overlayElement.addEventListener('click', e => {
    if (e.target === overlayElement) {
      closeElement.click();
    }
  });

  closeElement.addEventListener('click', (e) => {
    e.preventDefault();
    document.body.removeChild(overlayElement);
  })

  return {
    open() {
      document.body.appendChild(overlayElement);
    },
    close() {
      closeElement.click();
    },
    setContent(content) {
      contentElement.innerHTML = content;
    }
  }

}

// reviews 
const tamplateReview = document.querySelector('#overlayReview').innerHTML;
const overlayReview = createOverlay(tamplateReview);

const reviewOverlayBtn = $('.review__btn');

reviewOverlayBtn.on('click', e => {
  e.preventDefault();
  let reviewContent = $(e.currentTarget).siblings('.review__content').prop('outerHTML');

  overlayReview.open();
  overlayReview.setContent(reviewContent);
})

//one page scroll
const sections = $('.section');
const display = $('.maincontent');

let inScroll = false; // есть ли перемещение


const countSectionPosition = (sectionIndex) => {
  const position = sectionIndex * (-100);
  // console.log(position);
  if (isNaN(position)) {
    console.error("передано не верное значение в countSectionPositon");
  }
  return position;

}

const resetActiveClass = function (section, sectionIndex) {
  section.eq(sectionIndex).addClass('active').siblings().removeClass('active');
  $('.fixed-menu__item').eq(sectionIndex).addClass('active').siblings().removeClass('active');
};

const performTransition = (sectionIndex) => {
  if (inScroll) return; // проверяем , есть ли перемещение сейчас
  inScroll = true; //разрешаем перемещение
  //определяем позицию секции и расчитываем значение перемещения
  const position = countSectionPosition(sectionIndex);
  const trasitionOver = 600; // время задержки

  //меняем активный класс
  resetActiveClass(sections, sectionIndex);

  //перемещяем maincontent на указанную позицию
  display.css({
    transform: `translateY(${position}%)`,
  });

  //устанавливаем время задержки
  setTimeout(() => {
    inScroll = false; //запрещяем перемещение
    // resetActiveClass($(".fixed-menu__item"), sectionEq);
  }, trasitionOver);

}

const pageScroll = function () {
  const activeSection = sections.filter('.active');
  const nextSection = activeSection.next();
  const prevSection = activeSection.prev();

  return {
    next() {
      // есть ли секция снизу
      if (nextSection.length) {
        performTransition(nextSection.index());
      }
    },
    prev() {
      // есть ли секция сверху
      if (prevSection.length) {
        performTransition(prevSection.index());
      }
    }
  }

};

//обработка событий: 

$(document).keydown(e => {
  const targetName = e.target.tagName.toLowerCase();
  const windowScroller = pageScroll();

  if (targetName === 'body') {

    if (e.key === "ArrowDown") {
      // console.log('arrow down');
      windowScroller.next();
    } else if (e.key === "ArrowUp") {
      windowScroller.prev();
      // console.log('arrow up');
    } else if (e.keyCode === 32) {
      // console.log("space");
      windowScroller.next();
    }
  }
});

$('[scroll-to]').on('click', (e) => {
  e.preventDefault();
  // console.log(e.currentTarget);
  let menuIndex = $(e.currentTarget).attr('scroll-to');
  console.log(menuIndex);
  performTransition(menuIndex);
});

$(window).on("wheel", (e) => {
  const deltaY = e.originalEvent.deltaY;
  const windowScroller = pageScroll();

  if (deltaY > 0) {
    windowScroller.next();
  }

  if (deltaY < 0) {
    windowScroller.prev();
  }
});

$('.scroll-down').on('click', e => {
  e.preventDefault();
  performTransition(1);
});



/// http://hgoebl.github.io/mobile-detect.js/
const md = new MobileDetect(window.navigator.userAgent);
const isMobile = md.mobile();
// console.log(isMobile);

if (isMobile) {
  // http://github.com/mattbryson/TouchSwipe-Jquery-Plugin
  $("body").swipe({
    //Generic swipe handler for all directions
    swipe: function (event, direction, distance, duration, fingerCount, fingerData) {
      // console.log("You swiped " + direction );
      const windowScroller = pageScroll();

      if (direction === 'up') {
        // console.log('up');
        windowScroller.prev();
      }

      if (direction === 'down') {
        // console.log('down');
        windowScroller.next();
      }
    }
  });
}