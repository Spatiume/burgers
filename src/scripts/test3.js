$(document).ready(function () {
  // We listen to the resize event

  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
  window.addEventListener('resize', () => {
    // We execute the same script as before
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  });

  // box slider
  $('.slidermenu__items').bxSlider();


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
  });



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
    let item = $(e.currentTarget);

    item.closest('.burgermenu__item').toggleClass('burgermenu__item--active');
    item.closest('.burgermenu__item').siblings('.burgermenu__item').removeClass('burgermenu__item--active');

    if ($('.burgermenu__item').hasClass('burgermenu__item--active')) {
      item.closest('.burgermenu__list').css('width', '100%');
    } else {
      item.closest('.burgermenu__list').css('width', 'auto');
    }
  });

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
    const trasitionOver = 500; // время задержки

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
    if (activeSection.index()===6){
      player.pauseVideo();
    };
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
    const tagName = e.target.tagName.toLowerCase();
    const windowScroller = pageScroll();
    const userTypingInInputs = tagName === "input" || tagName === "textarea";

    if (userTypingInInputs) return;

    if (e.key === "ArrowDown") {
      windowScroller.next();
    } else if (e.key === "ArrowUp") {
      windowScroller.prev();
    } else if (e.keyCode === 32) {
      windowScroller.next();
    }

  });

  $('[scroll-to]').on('click', (e) => {
    e.preventDefault();
    // console.log(e.currentTarget);
    let menuIndex = $(e.currentTarget).attr('scroll-to');
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
          windowScroller.next();
        }

        if (direction === 'down') {
          // console.log('down');
          windowScroller.prev();
        }
      }
    });
  }
  //

  //

  // yandex map
  let myMap;

  const init = () => {
    myMap = new ymaps.Map("map", {
      center: [59.938951, 30.315635],
      zoom: 11,
      controls: []
    });

    //отключаем зум колёсиком мышки
    myMap.behaviors.disable('scrollZoom');

    //на мобильных устройствах... (проверяем по userAgent браузера)
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      //... отключаем перетаскивание карты
      myMap.behaviors.disable('drag');
    }

    const coords = [
      [59.888834, 30.321793],
      [59.936620, 30.259454],
      [59.931454, 30.345764],
      [59.861381, 30.398845],
    ];
    const myCollection = new ymaps.GeoObjectCollection({}, {
      draggable: false,
      iconLayout: 'default#image',
      iconImageHref: './img/icons/map-marker.svg',
      iconImageSize: [46, 57],
      iconImageOffset: [-35, -52]
    });

    coords.forEach(coord => {
      myCollection.add(new ymaps.Placemark(coord));
    })

    myMap.geoObjects.add(myCollection);
    myMap.behaviors.disable('scrollZoom');
  };


  ymaps.ready(init);


}); //document ready


/// youtube player

let player;
const playerContainer = $(".player");



let eventsInit = () => {
  $(".player__start").click(e => {
    e.preventDefault();

    if (playerContainer.hasClass("paused")) {
      player.pauseVideo();
    } else {
      player.playVideo();
    }
  });

  $(".player__playback").click(e => {
    const bar = $(e.currentTarget);
    const clickedPosition = e.originalEvent.layerX;
    const newButtonPositionPercent = (clickedPosition / bar.width()) * 100;
    const newPlaybackPositionSec =
      (player.getDuration() / 100) * newButtonPositionPercent;

    $(".player__playback-button").css({
      left: `${newButtonPositionPercent}%`
    });

    player.seekTo(newPlaybackPositionSec);
  });

  $(".player__splash").click(e => {
    player.playVideo();
  })

  $(".player__volume-button").click(e => {
    if (player.isMuted()) {
      player.unMute();
      $(e.currentTarget).parent().removeClass("mute");
      $('.player__volume-level-button').css({
        left: `${(player.getVolume())}%`
      });
    } else {
      player.mute();
      $(e.currentTarget).parent().addClass("mute");
      $('.player__volume-level-button').css({
        left: 0
      });
    }
  });

  $('.player__volume-level').click(e => {
    const volumeLevel = $(e.currentTarget);
    const volumeLevelClickPosition = e.originalEvent.layerX;
    const newVolumeLevel = (volumeLevelClickPosition / volumeLevel.width()) * 100;
    player.setVolume(newVolumeLevel);

    if (newVolumeLevel === 0) {
      player.mute();
      $(".player__volume").addClass("mute");
      $('.player__volume-level-button').css({
        left: 0
      });
    } else {
      player.unMute();
      $(".player__volume").removeClass("mute");
      $('.player__volume-level-button').css({
        left: `${newVolumeLevel}%`
      });
    }
    // const newVolumeLevel = (player.getVolume())


  });

};

const formatTime = timeSec => {
  const roundTime = Math.round(timeSec);

  const minutes = addZero(Math.floor(roundTime / 60));
  const seconds = addZero(roundTime - minutes * 60);

  function addZero(num) {
    return num < 10 ? `0${num}` : num;
  }

  return `${minutes} : ${seconds}`;
};

const onPlayerReady = () => {
  let interval;
  const durationSec = player.getDuration();

  $(".player__duration-estimate").text(formatTime(durationSec));

  if (typeof interval !== "undefined") {
    clearInterval(interval);
  }

  interval = setInterval(() => {
    const completedSec = player.getCurrentTime();
    const completedPercent = (completedSec / durationSec) * 100;

    $(".player__playback-button").css({
      left: `${completedPercent}%`
    });

    $(".player__duration-completed").text(formatTime(completedSec));
  }, 1000);
};

const onPlayerStateChange = event => {
  /*
    -1 (воспроизведение видео не начато)
    0 (воспроизведение видео завершено)
    1 (воспроизведение)
    2 (пауза)
    3 (буферизация)
    5 (видео подают реплики).
  */
  switch (event.data) {
    case 1:
      playerContainer.addClass("active");
      playerContainer.addClass("paused");
      break;

    case 2:
      playerContainer.removeClass("active");
      playerContainer.removeClass("paused");
      break;
  }
};



let playerHeight = $('.player').outerHeight();
let playerWidth = $('.player').outerWidth();



function onYouTubeIframeAPIReady() {

  player = new YT.Player("yt-player", {
    height: playerHeight,
    width: playerWidth,
    videoId: "8paoyY8BTO0",
    events: {
      onReady: onPlayerReady,
      onStateChange: onPlayerStateChange
    },
    playerVars: {
      controls: 0,
      disablekb: 0,
      showinfo: 0,
      rel: 0,
      autoplay: 0,
      modestbranding: 0
    }
  });
}

eventsInit();

