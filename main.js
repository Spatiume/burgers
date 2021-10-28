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
    if (activeSection.index() === 6) {
      checkActivePlayer();
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

function checkActivePlayer() {
  if (playerContainer.hasClass("paused")) {
    $(".player__start").click();
  }
}


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


//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRlc3QzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24gKCkge1xyXG4gIC8vIFdlIGxpc3RlbiB0byB0aGUgcmVzaXplIGV2ZW50XHJcblxyXG4gIGxldCB2aCA9IHdpbmRvdy5pbm5lckhlaWdodCAqIDAuMDE7XHJcbiAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnN0eWxlLnNldFByb3BlcnR5KCctLXZoJywgYCR7dmh9cHhgKTtcclxuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgKCkgPT4ge1xyXG4gICAgLy8gV2UgZXhlY3V0ZSB0aGUgc2FtZSBzY3JpcHQgYXMgYmVmb3JlXHJcbiAgICBsZXQgdmggPSB3aW5kb3cuaW5uZXJIZWlnaHQgKiAwLjAxO1xyXG4gICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnN0eWxlLnNldFByb3BlcnR5KCctLXZoJywgYCR7dmh9cHhgKTtcclxuICB9KTtcclxuXHJcbiAgLy8gYm94IHNsaWRlclxyXG4gICQoJy5zbGlkZXJtZW51X19pdGVtcycpLmJ4U2xpZGVyKCk7XHJcblxyXG5cclxuICAvLyBmdWxsc2NyZWVuIG1lbnVcclxuXHJcbiAgY29uc3QgaGFtYnVyZ2VyTWVudSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuaGFtYnVyZ2VyLW1lbnUtbGlua1wiKTtcclxuICBjb25zdCBmdWxsU2NyZWVuTWVudSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZnVsbHNjcmVlbi1tZW51XCIpO1xyXG4gIGNvbnN0IGZ1bGxTY3JlZW5NZW51Q2xvc2UgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmZ1bGxzY3JlZW4tbWVudV9fY2xvc2VcIik7XHJcblxyXG4gIGhhbWJ1cmdlck1lbnUuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICBmdWxsU2NyZWVuTWVudS5zdHlsZS5kaXNwbGF5ID0gXCJmbGV4XCI7XHJcbiAgfSk7XHJcblxyXG4gIGZ1bGxTY3JlZW5NZW51Q2xvc2UuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICBmdWxsU2NyZWVuTWVudS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcbiAgfSk7XHJcblxyXG4gICQoXCIubWVudV9fbGlua1wiKS5vbignY2xpY2snLCBlID0+IHtcclxuICAgICQoZnVsbFNjcmVlbk1lbnUpLmNzcyh7ICdkaXNwbGF5JzogJ25vbmUnIH0pO1xyXG4gIH0pO1xyXG5cclxuXHJcblxyXG4gIC8vIHRlYW0gc2VjdGlvblxyXG4gIGxldCB0ZWFtSXRlbXMgPSAkKCcudGVhbV9faXRlbScpO1xyXG4gIGxldCB0ZWFtSXRlbUxpbmsgPSAkKCcudGVhbV9fbGluaycpO1xyXG5cclxuICAkKCcudGVhbV9fbGluaycpLm9uKCdjbGljaycsIChlKSA9PiB7XHJcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgJChlLmN1cnJlbnRUYXJnZXQpLmNsb3Nlc3QoJy50ZWFtX19pdGVtJykudG9nZ2xlQ2xhc3MoJ3RlYW1fX2l0ZW0tLWFjdGl2ZScpO1xyXG4gICAgJChlLmN1cnJlbnRUYXJnZXQpLmNsb3Nlc3QoJy50ZWFtX19pdGVtJykuc2libGluZ3MoJy50ZWFtX19pdGVtJykucmVtb3ZlQ2xhc3MoJ3RlYW1fX2l0ZW0tLWFjdGl2ZScpO1xyXG4gIH0pXHJcblxyXG4gIC8vYnVyZ2VyIG1lbnVcclxuICAkKCcuYnVyZ2VybWVudV9fdHJpZ2dlcicpLm9uKCdjbGljaycsIGUgPT4ge1xyXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgbGV0IGl0ZW0gPSAkKGUuY3VycmVudFRhcmdldCk7XHJcblxyXG4gICAgaXRlbS5jbG9zZXN0KCcuYnVyZ2VybWVudV9faXRlbScpLnRvZ2dsZUNsYXNzKCdidXJnZXJtZW51X19pdGVtLS1hY3RpdmUnKTtcclxuICAgIGl0ZW0uY2xvc2VzdCgnLmJ1cmdlcm1lbnVfX2l0ZW0nKS5zaWJsaW5ncygnLmJ1cmdlcm1lbnVfX2l0ZW0nKS5yZW1vdmVDbGFzcygnYnVyZ2VybWVudV9faXRlbS0tYWN0aXZlJyk7XHJcblxyXG4gICAgaWYgKCQoJy5idXJnZXJtZW51X19pdGVtJykuaGFzQ2xhc3MoJ2J1cmdlcm1lbnVfX2l0ZW0tLWFjdGl2ZScpKSB7XHJcbiAgICAgIGl0ZW0uY2xvc2VzdCgnLmJ1cmdlcm1lbnVfX2xpc3QnKS5jc3MoJ3dpZHRoJywgJzEwMCUnKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGl0ZW0uY2xvc2VzdCgnLmJ1cmdlcm1lbnVfX2xpc3QnKS5jc3MoJ3dpZHRoJywgJ2F1dG8nKTtcclxuICAgIH1cclxuICB9KTtcclxuXHJcbiAgJCgnLmJ1cmdlcm1lbnVfX2Nsb3NlJykub24oJ2NsaWNrJywgZSA9PiB7XHJcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAkKCcuYnVyZ2VybWVudV9fdHJpZ2dlcicpLmNsaWNrKCk7XHJcbiAgfSk7XHJcbiAgLy8gb3JkZXIgbWVudVxyXG5cclxuXHJcbiAgY29uc3Qgb3JkZXJGb3JtID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm9yZGVyRm9ybScpO1xyXG4gIGNvbnN0IG9yZGVyQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI29yZGVyX19idG4nKTtcclxuXHJcbiAgb3JkZXJCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xyXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgLy8gY29uc29sZS5sb2cob3JkZXJGb3JtLmVsZW1lbnRzLm5hbWUudmFsdWUpO1xyXG4gICAgaWYgKHZhbGlkYXRlRm9ybShvcmRlckZvcm0pKSB7XHJcbiAgICAgIC8vIGNvbnNvbGUubG9nKCd2c2V3IG9rJyk7XHJcbiAgICAgIGNvbnN0IGRhdGEgPSB7XHJcbiAgICAgICAgbmFtZTogb3JkZXJGb3JtLmVsZW1lbnRzLm5hbWUudmFsdWUsXHJcbiAgICAgICAgcGhvbmU6IG9yZGVyRm9ybS5lbGVtZW50cy5waG9uZS52YWx1ZSxcclxuICAgICAgICBjb21tZW50OiBvcmRlckZvcm0uZWxlbWVudHMuY29tbWVudC52YWx1ZSxcclxuICAgICAgICB0bzogJ3NvbWUtbWFpbEBtYWlsLmNvbScgLy8g0J/QviDQt9Cw0LTQsNC90LjRjiDRgdC10YDQstC10YAg0L/RgNC40L3QuNC80LDQtdGCINGH0LXRgtGL0YDQtSDQv9Cw0YDQsNC80LXRgtGA0LAsINCy0LrQu9GO0YfQsNGPIGVtYWlsLiBcclxuICAgICAgICAvLyDQndC+INC/0L4g0LzQsNC60LXRgtGDINCyINGE0L7RgNC80LUgZW1haWwg0L7QvSDQvtGC0YHRg9GC0YHRgtCy0YPQtdGCLlxyXG4gICAgICB9XHJcbiAgICAgIGNvbnN0IHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG4gICAgICB4aHIucmVzcG9uc2VUeXBlID0gJ2pzb24nO1xyXG4gICAgICB4aHIub3BlbignUE9TVCcsICdodHRwczovL3dlYmRldi1hcGkubG9mdHNjaG9vbC5jb20vc2VuZG1haWwnKTtcclxuICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoJ2NvbnRlbnQtdHlwZScsICdhcHBsaWNhdGlvbi9qc29uJyk7XHJcbiAgICAgIHhoci5zZW5kKEpTT04uc3RyaW5naWZ5KGRhdGEpKTtcclxuICAgICAgeGhyLmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCAoKSA9PiB7XHJcbiAgICAgICAgY29uc29sZS5sb2coeGhyLnJlc3BvbnNlLm1lc3NhZ2UpO1xyXG4gICAgICAgIG92ZXJsYXlPcmRlci5vcGVuKCk7XHJcbiAgICAgICAgb3ZlcmxheU9yZGVyLnNldENvbnRlbnQoeGhyLnJlc3BvbnNlLm1lc3NhZ2UpO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9KTtcclxuXHJcbiAgZnVuY3Rpb24gdmFsaWRhdGVGb3JtKGZvcm0pIHtcclxuICAgIGxldCB2YWxpZCA9IHRydWU7XHJcblxyXG4gICAgaWYgKCF2YWxpZGF0ZUZpZWxkKGZvcm0uZWxlbWVudHMubmFtZSkpIHtcclxuICAgICAgdmFsaWQgPSBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoIXZhbGlkYXRlRmllbGQoZm9ybS5lbGVtZW50cy5waG9uZSkpIHtcclxuICAgICAgdmFsaWQgPSBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoIXZhbGlkYXRlRmllbGQoZm9ybS5lbGVtZW50cy5jb21tZW50KSkge1xyXG4gICAgICB2YWxpZCA9IGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB2YWxpZDtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIHZhbGlkYXRlRmllbGQoZmllbGQpIHtcclxuICAgIC8vIGZpZWxkLm5leHRFbGVtZW50U2libGluZy50ZXh0Q29udGVudCA9IGZpZWxkLnZhbGlkYXRpb25NZXNzYWdlO1xyXG4gICAgaWYgKGZpZWxkLmNoZWNrVmFsaWRpdHkoKSkge1xyXG4gICAgICAkKGZpZWxkKS5jc3MoJ2JvcmRlci1jb2xvcicsICd0cmFuc3BhcmVudCcpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgJChmaWVsZCkuY3NzKCdib3JkZXItY29sb3InLCAncmVkJyk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZmllbGQuY2hlY2tWYWxpZGl0eSgpO1xyXG4gIH1cclxuXHJcblxyXG4gIC8vb3ZlcmxheVxyXG5cclxuICAvLyBjb25zdCBvcGVuT3ZlcmxheSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNvcGVuT3ZlcmxheScpO1xyXG4gIGNvbnN0IHRhbXBsYXRlT3JkZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjb3ZlcmxheU9yZGVyJykuaW5uZXJIVE1MO1xyXG4gIGNvbnN0IG92ZXJsYXlPcmRlciA9IGNyZWF0ZU92ZXJsYXkodGFtcGxhdGVPcmRlciwgJ3RhbXBsYXRlT3JkZXInKTtcclxuXHJcbiAgLy8gb3Blbk92ZXJsYXkuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBlID0+IHtcclxuICAvLyAgIG92ZXJsYXkub3BlbigpO1xyXG4gIC8vICAgb3ZlcmxheS5zZXRDb250ZW50KCdWc2Ugb2snKTtcclxuICAvLyB9KTtcclxuXHJcbiAgZnVuY3Rpb24gY3JlYXRlT3ZlcmxheSh0YW1wbGF0ZSwgY2xhc3NUYW1wbGF0ZSkge1xyXG4gICAgY29uc3QgZnJhZ21lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgIGZyYWdtZW50LmlubmVySFRNTCA9IHRhbXBsYXRlO1xyXG5cclxuICAgIGNvbnN0IG92ZXJsYXlFbGVtZW50ID0gZnJhZ21lbnQucXVlcnlTZWxlY3RvcignLm92ZXJsYXknKTtcclxuICAgIGNvbnN0IGNvbnRhaW5lckVsZW1lbnQgPSBmcmFnbWVudC5xdWVyeVNlbGVjdG9yKCcub3ZlcmxheV9fY29udGFpbmVyJyk7XHJcbiAgICBjb250YWluZXJFbGVtZW50LmNsYXNzTGlzdC5hZGQoY2xhc3NUYW1wbGF0ZSk7XHJcbiAgICBjb25zdCBjbG9zZUVsZW1lbnQgPSBmcmFnbWVudC5xdWVyeVNlbGVjdG9yKCcub3ZlcmxheV9fY2xvc2UnKTtcclxuICAgIGNvbnN0IGNvbnRlbnRFbGVtZW50ID0gZnJhZ21lbnQucXVlcnlTZWxlY3RvcignLm92ZXJsYXlfX2NvbnRlbnQnKTtcclxuXHJcbiAgICBvdmVybGF5RWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGUgPT4ge1xyXG4gICAgICBpZiAoZS50YXJnZXQgPT09IG92ZXJsYXlFbGVtZW50KSB7XHJcbiAgICAgICAgY2xvc2VFbGVtZW50LmNsaWNrKCk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIGNsb3NlRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XHJcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChvdmVybGF5RWxlbWVudCk7XHJcbiAgICB9KVxyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgIG9wZW4oKSB7XHJcbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChvdmVybGF5RWxlbWVudCk7XHJcbiAgICAgIH0sXHJcbiAgICAgIGNsb3NlKCkge1xyXG4gICAgICAgIGNsb3NlRWxlbWVudC5jbGljaygpO1xyXG4gICAgICB9LFxyXG4gICAgICBzZXRDb250ZW50KGNvbnRlbnQpIHtcclxuICAgICAgICBjb250ZW50RWxlbWVudC5pbm5lckhUTUwgPSBjb250ZW50O1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gIH1cclxuXHJcbiAgLy8gcmV2aWV3cyBcclxuICBjb25zdCB0YW1wbGF0ZVJldmlldyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNvdmVybGF5UmV2aWV3JykuaW5uZXJIVE1MO1xyXG4gIGNvbnN0IG92ZXJsYXlSZXZpZXcgPSBjcmVhdGVPdmVybGF5KHRhbXBsYXRlUmV2aWV3KTtcclxuXHJcbiAgY29uc3QgcmV2aWV3T3ZlcmxheUJ0biA9ICQoJy5yZXZpZXdfX2J0bicpO1xyXG5cclxuICByZXZpZXdPdmVybGF5QnRuLm9uKCdjbGljaycsIGUgPT4ge1xyXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgbGV0IHJldmlld0NvbnRlbnQgPSAkKGUuY3VycmVudFRhcmdldCkuc2libGluZ3MoJy5yZXZpZXdfX2NvbnRlbnQnKS5wcm9wKCdvdXRlckhUTUwnKTtcclxuXHJcbiAgICBvdmVybGF5UmV2aWV3Lm9wZW4oKTtcclxuICAgIG92ZXJsYXlSZXZpZXcuc2V0Q29udGVudChyZXZpZXdDb250ZW50KTtcclxuICB9KVxyXG5cclxuICAvL29uZSBwYWdlIHNjcm9sbFxyXG4gIGNvbnN0IHNlY3Rpb25zID0gJCgnLnNlY3Rpb24nKTtcclxuICBjb25zdCBkaXNwbGF5ID0gJCgnLm1haW5jb250ZW50Jyk7XHJcblxyXG4gIGxldCBpblNjcm9sbCA9IGZhbHNlOyAvLyDQtdGB0YLRjCDQu9C4INC/0LXRgNC10LzQtdGJ0LXQvdC40LVcclxuXHJcblxyXG4gIGNvbnN0IGNvdW50U2VjdGlvblBvc2l0aW9uID0gKHNlY3Rpb25JbmRleCkgPT4ge1xyXG4gICAgY29uc3QgcG9zaXRpb24gPSBzZWN0aW9uSW5kZXggKiAoLTEwMCk7XHJcbiAgICAvLyBjb25zb2xlLmxvZyhwb3NpdGlvbik7XHJcbiAgICBpZiAoaXNOYU4ocG9zaXRpb24pKSB7XHJcbiAgICAgIGNvbnNvbGUuZXJyb3IoXCLQv9C10YDQtdC00LDQvdC+INC90LUg0LLQtdGA0L3QvtC1INC30L3QsNGH0LXQvdC40LUg0LIgY291bnRTZWN0aW9uUG9zaXRvblwiKTtcclxuICAgIH1cclxuICAgIHJldHVybiBwb3NpdGlvbjtcclxuXHJcbiAgfVxyXG5cclxuICBjb25zdCByZXNldEFjdGl2ZUNsYXNzID0gZnVuY3Rpb24gKHNlY3Rpb24sIHNlY3Rpb25JbmRleCkge1xyXG4gICAgc2VjdGlvbi5lcShzZWN0aW9uSW5kZXgpLmFkZENsYXNzKCdhY3RpdmUnKS5zaWJsaW5ncygpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuICAgICQoJy5maXhlZC1tZW51X19pdGVtJykuZXEoc2VjdGlvbkluZGV4KS5hZGRDbGFzcygnYWN0aXZlJykuc2libGluZ3MoKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XHJcbiAgfTtcclxuXHJcblxyXG4gIGNvbnN0IHBlcmZvcm1UcmFuc2l0aW9uID0gKHNlY3Rpb25JbmRleCkgPT4ge1xyXG4gICAgaWYgKGluU2Nyb2xsKSByZXR1cm47IC8vINC/0YDQvtCy0LXRgNGP0LXQvCAsINC10YHRgtGMINC70Lgg0L/QtdGA0LXQvNC10YnQtdC90LjQtSDRgdC10LnRh9Cw0YFcclxuICAgIGluU2Nyb2xsID0gdHJ1ZTsgLy/RgNCw0LfRgNC10YjQsNC10Lwg0L/QtdGA0LXQvNC10YnQtdC90LjQtVxyXG4gICAgLy/QvtC/0YDQtdC00LXQu9GP0LXQvCDQv9C+0LfQuNGG0LjRjiDRgdC10LrRhtC40Lgg0Lgg0YDQsNGB0YfQuNGC0YvQstCw0LXQvCDQt9C90LDRh9C10L3QuNC1INC/0LXRgNC10LzQtdGJ0LXQvdC40Y9cclxuICAgIGNvbnN0IHBvc2l0aW9uID0gY291bnRTZWN0aW9uUG9zaXRpb24oc2VjdGlvbkluZGV4KTtcclxuICAgIGNvbnN0IHRyYXNpdGlvbk92ZXIgPSA1MDA7IC8vINCy0YDQtdC80Y8g0LfQsNC00LXRgNC20LrQuFxyXG5cclxuICAgIC8v0LzQtdC90Y/QtdC8INCw0LrRgtC40LLQvdGL0Lkg0LrQu9Cw0YHRgVxyXG4gICAgcmVzZXRBY3RpdmVDbGFzcyhzZWN0aW9ucywgc2VjdGlvbkluZGV4KTtcclxuICAgIC8v0L/QtdGA0LXQvNC10YnRj9C10LwgbWFpbmNvbnRlbnQg0L3QsCDRg9C60LDQt9Cw0L3QvdGD0Y4g0L/QvtC30LjRhtC40Y5cclxuICAgIGRpc3BsYXkuY3NzKHtcclxuICAgICAgdHJhbnNmb3JtOiBgdHJhbnNsYXRlWSgke3Bvc2l0aW9ufSUpYCxcclxuICAgIH0pO1xyXG5cclxuICAgIC8v0YPRgdGC0LDQvdCw0LLQu9C40LLQsNC10Lwg0LLRgNC10LzRjyDQt9Cw0LTQtdGA0LbQutC4XHJcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgaW5TY3JvbGwgPSBmYWxzZTsgLy/Qt9Cw0L/RgNC10YnRj9C10Lwg0L/QtdGA0LXQvNC10YnQtdC90LjQtVxyXG4gICAgICAvLyByZXNldEFjdGl2ZUNsYXNzKCQoXCIuZml4ZWQtbWVudV9faXRlbVwiKSwgc2VjdGlvbkVxKTtcclxuICAgIH0sIHRyYXNpdGlvbk92ZXIpO1xyXG5cclxuICB9XHJcblxyXG4gIGNvbnN0IHBhZ2VTY3JvbGwgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICBjb25zdCBhY3RpdmVTZWN0aW9uID0gc2VjdGlvbnMuZmlsdGVyKCcuYWN0aXZlJyk7XHJcbiAgICBpZiAoYWN0aXZlU2VjdGlvbi5pbmRleCgpID09PSA2KSB7XHJcbiAgICAgIGNoZWNrQWN0aXZlUGxheWVyKCk7XHJcbiAgICB9O1xyXG4gICAgY29uc3QgbmV4dFNlY3Rpb24gPSBhY3RpdmVTZWN0aW9uLm5leHQoKTtcclxuICAgIGNvbnN0IHByZXZTZWN0aW9uID0gYWN0aXZlU2VjdGlvbi5wcmV2KCk7XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgbmV4dCgpIHtcclxuICAgICAgICAvLyDQtdGB0YLRjCDQu9C4INGB0LXQutGG0LjRjyDRgdC90LjQt9GDXHJcbiAgICAgICAgaWYgKG5leHRTZWN0aW9uLmxlbmd0aCkge1xyXG4gICAgICAgICAgcGVyZm9ybVRyYW5zaXRpb24obmV4dFNlY3Rpb24uaW5kZXgoKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgICBwcmV2KCkge1xyXG4gICAgICAgIC8vINC10YHRgtGMINC70Lgg0YHQtdC60YbQuNGPINGB0LLQtdGA0YXRg1xyXG4gICAgICAgIGlmIChwcmV2U2VjdGlvbi5sZW5ndGgpIHtcclxuICAgICAgICAgIHBlcmZvcm1UcmFuc2l0aW9uKHByZXZTZWN0aW9uLmluZGV4KCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICB9O1xyXG5cclxuICAvL9C+0LHRgNCw0LHQvtGC0LrQsCDRgdC+0LHRi9GC0LjQuTogXHJcblxyXG4gICQoZG9jdW1lbnQpLmtleWRvd24oZSA9PiB7XHJcbiAgICBjb25zdCB0YWdOYW1lID0gZS50YXJnZXQudGFnTmFtZS50b0xvd2VyQ2FzZSgpO1xyXG4gICAgY29uc3Qgd2luZG93U2Nyb2xsZXIgPSBwYWdlU2Nyb2xsKCk7XHJcbiAgICBjb25zdCB1c2VyVHlwaW5nSW5JbnB1dHMgPSB0YWdOYW1lID09PSBcImlucHV0XCIgfHwgdGFnTmFtZSA9PT0gXCJ0ZXh0YXJlYVwiO1xyXG5cclxuICAgIGlmICh1c2VyVHlwaW5nSW5JbnB1dHMpIHJldHVybjtcclxuXHJcbiAgICBpZiAoZS5rZXkgPT09IFwiQXJyb3dEb3duXCIpIHtcclxuICAgICAgd2luZG93U2Nyb2xsZXIubmV4dCgpO1xyXG4gICAgfSBlbHNlIGlmIChlLmtleSA9PT0gXCJBcnJvd1VwXCIpIHtcclxuICAgICAgd2luZG93U2Nyb2xsZXIucHJldigpO1xyXG4gICAgfSBlbHNlIGlmIChlLmtleUNvZGUgPT09IDMyKSB7XHJcbiAgICAgIHdpbmRvd1Njcm9sbGVyLm5leHQoKTtcclxuICAgIH1cclxuXHJcbiAgfSk7XHJcblxyXG4gICQoJ1tzY3JvbGwtdG9dJykub24oJ2NsaWNrJywgKGUpID0+IHtcclxuICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgIC8vIGNvbnNvbGUubG9nKGUuY3VycmVudFRhcmdldCk7XHJcbiAgICBsZXQgbWVudUluZGV4ID0gJChlLmN1cnJlbnRUYXJnZXQpLmF0dHIoJ3Njcm9sbC10bycpO1xyXG4gICAgcGVyZm9ybVRyYW5zaXRpb24obWVudUluZGV4KTtcclxuICB9KTtcclxuXHJcbiAgJCh3aW5kb3cpLm9uKFwid2hlZWxcIiwgKGUpID0+IHtcclxuICAgIGNvbnN0IGRlbHRhWSA9IGUub3JpZ2luYWxFdmVudC5kZWx0YVk7XHJcbiAgICBjb25zdCB3aW5kb3dTY3JvbGxlciA9IHBhZ2VTY3JvbGwoKTtcclxuXHJcbiAgICBpZiAoZGVsdGFZID4gMCkge1xyXG4gICAgICB3aW5kb3dTY3JvbGxlci5uZXh0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGRlbHRhWSA8IDApIHtcclxuICAgICAgd2luZG93U2Nyb2xsZXIucHJldigpO1xyXG4gICAgfVxyXG4gIH0pO1xyXG5cclxuICAkKCcuc2Nyb2xsLWRvd24nKS5vbignY2xpY2snLCBlID0+IHtcclxuICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgIHBlcmZvcm1UcmFuc2l0aW9uKDEpO1xyXG4gIH0pO1xyXG5cclxuXHJcblxyXG4gIC8vLyBodHRwOi8vaGdvZWJsLmdpdGh1Yi5pby9tb2JpbGUtZGV0ZWN0LmpzL1xyXG4gIGNvbnN0IG1kID0gbmV3IE1vYmlsZURldGVjdCh3aW5kb3cubmF2aWdhdG9yLnVzZXJBZ2VudCk7XHJcbiAgY29uc3QgaXNNb2JpbGUgPSBtZC5tb2JpbGUoKTtcclxuICAvLyBjb25zb2xlLmxvZyhpc01vYmlsZSk7XHJcblxyXG4gIGlmIChpc01vYmlsZSkge1xyXG4gICAgLy8gaHR0cDovL2dpdGh1Yi5jb20vbWF0dGJyeXNvbi9Ub3VjaFN3aXBlLUpxdWVyeS1QbHVnaW5cclxuICAgICQoXCJib2R5XCIpLnN3aXBlKHtcclxuICAgICAgLy9HZW5lcmljIHN3aXBlIGhhbmRsZXIgZm9yIGFsbCBkaXJlY3Rpb25zXHJcbiAgICAgIHN3aXBlOiBmdW5jdGlvbiAoZXZlbnQsIGRpcmVjdGlvbiwgZGlzdGFuY2UsIGR1cmF0aW9uLCBmaW5nZXJDb3VudCwgZmluZ2VyRGF0YSkge1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwiWW91IHN3aXBlZCBcIiArIGRpcmVjdGlvbiApO1xyXG4gICAgICAgIGNvbnN0IHdpbmRvd1Njcm9sbGVyID0gcGFnZVNjcm9sbCgpO1xyXG5cclxuICAgICAgICBpZiAoZGlyZWN0aW9uID09PSAndXAnKSB7XHJcbiAgICAgICAgICAvLyBjb25zb2xlLmxvZygndXAnKTtcclxuICAgICAgICAgIHdpbmRvd1Njcm9sbGVyLm5leHQoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChkaXJlY3Rpb24gPT09ICdkb3duJykge1xyXG4gICAgICAgICAgLy8gY29uc29sZS5sb2coJ2Rvd24nKTtcclxuICAgICAgICAgIHdpbmRvd1Njcm9sbGVyLnByZXYoKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuICAvL1xyXG5cclxuICAvL1xyXG5cclxuICAvLyB5YW5kZXggbWFwXHJcbiAgbGV0IG15TWFwO1xyXG5cclxuICBjb25zdCBpbml0ID0gKCkgPT4ge1xyXG4gICAgbXlNYXAgPSBuZXcgeW1hcHMuTWFwKFwibWFwXCIsIHtcclxuICAgICAgY2VudGVyOiBbNTkuOTM4OTUxLCAzMC4zMTU2MzVdLFxyXG4gICAgICB6b29tOiAxMSxcclxuICAgICAgY29udHJvbHM6IFtdXHJcbiAgICB9KTtcclxuXHJcbiAgICAvL9C+0YLQutC70Y7Rh9Cw0LXQvCDQt9GD0Lwg0LrQvtC70ZHRgdC40LrQvtC8INC80YvRiNC60LhcclxuICAgIG15TWFwLmJlaGF2aW9ycy5kaXNhYmxlKCdzY3JvbGxab29tJyk7XHJcblxyXG4gICAgLy/QvdCwINC80L7QsdC40LvRjNC90YvRhSDRg9GB0YLRgNC+0LnRgdGC0LLQsNGFLi4uICjQv9GA0L7QstC10YDRj9C10Lwg0L/QviB1c2VyQWdlbnQg0LHRgNCw0YPQt9C10YDQsClcclxuICAgIGlmICgvQW5kcm9pZHx3ZWJPU3xpUGhvbmV8aVBhZHxpUG9kfEJsYWNrQmVycnl8SUVNb2JpbGV8T3BlcmEgTWluaS9pLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCkpIHtcclxuICAgICAgLy8uLi4g0L7RgtC60LvRjtGH0LDQtdC8INC/0LXRgNC10YLQsNGB0LrQuNCy0LDQvdC40LUg0LrQsNGA0YLRi1xyXG4gICAgICBteU1hcC5iZWhhdmlvcnMuZGlzYWJsZSgnZHJhZycpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGNvb3JkcyA9IFtcclxuICAgICAgWzU5Ljg4ODgzNCwgMzAuMzIxNzkzXSxcclxuICAgICAgWzU5LjkzNjYyMCwgMzAuMjU5NDU0XSxcclxuICAgICAgWzU5LjkzMTQ1NCwgMzAuMzQ1NzY0XSxcclxuICAgICAgWzU5Ljg2MTM4MSwgMzAuMzk4ODQ1XSxcclxuICAgIF07XHJcbiAgICBjb25zdCBteUNvbGxlY3Rpb24gPSBuZXcgeW1hcHMuR2VvT2JqZWN0Q29sbGVjdGlvbih7fSwge1xyXG4gICAgICBkcmFnZ2FibGU6IGZhbHNlLFxyXG4gICAgICBpY29uTGF5b3V0OiAnZGVmYXVsdCNpbWFnZScsXHJcbiAgICAgIGljb25JbWFnZUhyZWY6ICcuL2ltZy9pY29ucy9tYXAtbWFya2VyLnN2ZycsXHJcbiAgICAgIGljb25JbWFnZVNpemU6IFs0NiwgNTddLFxyXG4gICAgICBpY29uSW1hZ2VPZmZzZXQ6IFstMzUsIC01Ml1cclxuICAgIH0pO1xyXG5cclxuICAgIGNvb3Jkcy5mb3JFYWNoKGNvb3JkID0+IHtcclxuICAgICAgbXlDb2xsZWN0aW9uLmFkZChuZXcgeW1hcHMuUGxhY2VtYXJrKGNvb3JkKSk7XHJcbiAgICB9KVxyXG5cclxuICAgIG15TWFwLmdlb09iamVjdHMuYWRkKG15Q29sbGVjdGlvbik7XHJcbiAgICBteU1hcC5iZWhhdmlvcnMuZGlzYWJsZSgnc2Nyb2xsWm9vbScpO1xyXG4gIH07XHJcblxyXG5cclxuICB5bWFwcy5yZWFkeShpbml0KTtcclxuXHJcblxyXG59KTsgLy9kb2N1bWVudCByZWFkeVxyXG5cclxuXHJcbi8vLyB5b3V0dWJlIHBsYXllclxyXG5cclxubGV0IHBsYXllcjtcclxuY29uc3QgcGxheWVyQ29udGFpbmVyID0gJChcIi5wbGF5ZXJcIik7XHJcblxyXG5mdW5jdGlvbiBjaGVja0FjdGl2ZVBsYXllcigpIHtcclxuICBpZiAocGxheWVyQ29udGFpbmVyLmhhc0NsYXNzKFwicGF1c2VkXCIpKSB7XHJcbiAgICAkKFwiLnBsYXllcl9fc3RhcnRcIikuY2xpY2soKTtcclxuICB9XHJcbn1cclxuXHJcblxyXG5sZXQgZXZlbnRzSW5pdCA9ICgpID0+IHtcclxuICAkKFwiLnBsYXllcl9fc3RhcnRcIikuY2xpY2soZSA9PiB7XHJcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgaWYgKHBsYXllckNvbnRhaW5lci5oYXNDbGFzcyhcInBhdXNlZFwiKSkge1xyXG4gICAgICBwbGF5ZXIucGF1c2VWaWRlbygpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcGxheWVyLnBsYXlWaWRlbygpO1xyXG4gICAgfVxyXG4gIH0pO1xyXG5cclxuICAkKFwiLnBsYXllcl9fcGxheWJhY2tcIikuY2xpY2soZSA9PiB7XHJcbiAgICBjb25zdCBiYXIgPSAkKGUuY3VycmVudFRhcmdldCk7XHJcbiAgICBjb25zdCBjbGlja2VkUG9zaXRpb24gPSBlLm9yaWdpbmFsRXZlbnQubGF5ZXJYO1xyXG4gICAgY29uc3QgbmV3QnV0dG9uUG9zaXRpb25QZXJjZW50ID0gKGNsaWNrZWRQb3NpdGlvbiAvIGJhci53aWR0aCgpKSAqIDEwMDtcclxuICAgIGNvbnN0IG5ld1BsYXliYWNrUG9zaXRpb25TZWMgPVxyXG4gICAgICAocGxheWVyLmdldER1cmF0aW9uKCkgLyAxMDApICogbmV3QnV0dG9uUG9zaXRpb25QZXJjZW50O1xyXG5cclxuICAgICQoXCIucGxheWVyX19wbGF5YmFjay1idXR0b25cIikuY3NzKHtcclxuICAgICAgbGVmdDogYCR7bmV3QnV0dG9uUG9zaXRpb25QZXJjZW50fSVgXHJcbiAgICB9KTtcclxuXHJcbiAgICBwbGF5ZXIuc2Vla1RvKG5ld1BsYXliYWNrUG9zaXRpb25TZWMpO1xyXG4gIH0pO1xyXG5cclxuICAkKFwiLnBsYXllcl9fc3BsYXNoXCIpLmNsaWNrKGUgPT4ge1xyXG4gICAgcGxheWVyLnBsYXlWaWRlbygpO1xyXG4gIH0pXHJcblxyXG4gICQoXCIucGxheWVyX192b2x1bWUtYnV0dG9uXCIpLmNsaWNrKGUgPT4ge1xyXG4gICAgaWYgKHBsYXllci5pc011dGVkKCkpIHtcclxuICAgICAgcGxheWVyLnVuTXV0ZSgpO1xyXG4gICAgICAkKGUuY3VycmVudFRhcmdldCkucGFyZW50KCkucmVtb3ZlQ2xhc3MoXCJtdXRlXCIpO1xyXG4gICAgICAkKCcucGxheWVyX192b2x1bWUtbGV2ZWwtYnV0dG9uJykuY3NzKHtcclxuICAgICAgICBsZWZ0OiBgJHsocGxheWVyLmdldFZvbHVtZSgpKX0lYFxyXG4gICAgICB9KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHBsYXllci5tdXRlKCk7XHJcbiAgICAgICQoZS5jdXJyZW50VGFyZ2V0KS5wYXJlbnQoKS5hZGRDbGFzcyhcIm11dGVcIik7XHJcbiAgICAgICQoJy5wbGF5ZXJfX3ZvbHVtZS1sZXZlbC1idXR0b24nKS5jc3Moe1xyXG4gICAgICAgIGxlZnQ6IDBcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfSk7XHJcblxyXG4gICQoJy5wbGF5ZXJfX3ZvbHVtZS1sZXZlbCcpLmNsaWNrKGUgPT4ge1xyXG4gICAgY29uc3Qgdm9sdW1lTGV2ZWwgPSAkKGUuY3VycmVudFRhcmdldCk7XHJcbiAgICBjb25zdCB2b2x1bWVMZXZlbENsaWNrUG9zaXRpb24gPSBlLm9yaWdpbmFsRXZlbnQubGF5ZXJYO1xyXG4gICAgY29uc3QgbmV3Vm9sdW1lTGV2ZWwgPSAodm9sdW1lTGV2ZWxDbGlja1Bvc2l0aW9uIC8gdm9sdW1lTGV2ZWwud2lkdGgoKSkgKiAxMDA7XHJcbiAgICBwbGF5ZXIuc2V0Vm9sdW1lKG5ld1ZvbHVtZUxldmVsKTtcclxuXHJcbiAgICBpZiAobmV3Vm9sdW1lTGV2ZWwgPT09IDApIHtcclxuICAgICAgcGxheWVyLm11dGUoKTtcclxuICAgICAgJChcIi5wbGF5ZXJfX3ZvbHVtZVwiKS5hZGRDbGFzcyhcIm11dGVcIik7XHJcbiAgICAgICQoJy5wbGF5ZXJfX3ZvbHVtZS1sZXZlbC1idXR0b24nKS5jc3Moe1xyXG4gICAgICAgIGxlZnQ6IDBcclxuICAgICAgfSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBwbGF5ZXIudW5NdXRlKCk7XHJcbiAgICAgICQoXCIucGxheWVyX192b2x1bWVcIikucmVtb3ZlQ2xhc3MoXCJtdXRlXCIpO1xyXG4gICAgICAkKCcucGxheWVyX192b2x1bWUtbGV2ZWwtYnV0dG9uJykuY3NzKHtcclxuICAgICAgICBsZWZ0OiBgJHtuZXdWb2x1bWVMZXZlbH0lYFxyXG4gICAgICB9KTtcclxuICAgIH1cclxuICAgIC8vIGNvbnN0IG5ld1ZvbHVtZUxldmVsID0gKHBsYXllci5nZXRWb2x1bWUoKSlcclxuXHJcblxyXG4gIH0pO1xyXG5cclxufTtcclxuXHJcbmNvbnN0IGZvcm1hdFRpbWUgPSB0aW1lU2VjID0+IHtcclxuICBjb25zdCByb3VuZFRpbWUgPSBNYXRoLnJvdW5kKHRpbWVTZWMpO1xyXG5cclxuICBjb25zdCBtaW51dGVzID0gYWRkWmVybyhNYXRoLmZsb29yKHJvdW5kVGltZSAvIDYwKSk7XHJcbiAgY29uc3Qgc2Vjb25kcyA9IGFkZFplcm8ocm91bmRUaW1lIC0gbWludXRlcyAqIDYwKTtcclxuXHJcbiAgZnVuY3Rpb24gYWRkWmVybyhudW0pIHtcclxuICAgIHJldHVybiBudW0gPCAxMCA/IGAwJHtudW19YCA6IG51bTtcclxuICB9XHJcblxyXG4gIHJldHVybiBgJHttaW51dGVzfSA6ICR7c2Vjb25kc31gO1xyXG59O1xyXG5cclxuY29uc3Qgb25QbGF5ZXJSZWFkeSA9ICgpID0+IHtcclxuICBsZXQgaW50ZXJ2YWw7XHJcbiAgY29uc3QgZHVyYXRpb25TZWMgPSBwbGF5ZXIuZ2V0RHVyYXRpb24oKTtcclxuXHJcbiAgJChcIi5wbGF5ZXJfX2R1cmF0aW9uLWVzdGltYXRlXCIpLnRleHQoZm9ybWF0VGltZShkdXJhdGlvblNlYykpO1xyXG5cclxuICBpZiAodHlwZW9mIGludGVydmFsICE9PSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgICBjbGVhckludGVydmFsKGludGVydmFsKTtcclxuICB9XHJcblxyXG4gIGludGVydmFsID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xyXG4gICAgY29uc3QgY29tcGxldGVkU2VjID0gcGxheWVyLmdldEN1cnJlbnRUaW1lKCk7XHJcbiAgICBjb25zdCBjb21wbGV0ZWRQZXJjZW50ID0gKGNvbXBsZXRlZFNlYyAvIGR1cmF0aW9uU2VjKSAqIDEwMDtcclxuXHJcbiAgICAkKFwiLnBsYXllcl9fcGxheWJhY2stYnV0dG9uXCIpLmNzcyh7XHJcbiAgICAgIGxlZnQ6IGAke2NvbXBsZXRlZFBlcmNlbnR9JWBcclxuICAgIH0pO1xyXG5cclxuICAgICQoXCIucGxheWVyX19kdXJhdGlvbi1jb21wbGV0ZWRcIikudGV4dChmb3JtYXRUaW1lKGNvbXBsZXRlZFNlYykpO1xyXG4gIH0sIDEwMDApO1xyXG59O1xyXG5cclxuY29uc3Qgb25QbGF5ZXJTdGF0ZUNoYW5nZSA9IGV2ZW50ID0+IHtcclxuICAvKlxyXG4gICAgLTEgKNCy0L7RgdC/0YDQvtC40LfQstC10LTQtdC90LjQtSDQstC40LTQtdC+INC90LUg0L3QsNGH0LDRgtC+KVxyXG4gICAgMCAo0LLQvtGB0L/RgNC+0LjQt9Cy0LXQtNC10L3QuNC1INCy0LjQtNC10L4g0LfQsNCy0LXRgNGI0LXQvdC+KVxyXG4gICAgMSAo0LLQvtGB0L/RgNC+0LjQt9Cy0LXQtNC10L3QuNC1KVxyXG4gICAgMiAo0L/QsNGD0LfQsClcclxuICAgIDMgKNCx0YPRhNC10YDQuNC30LDRhtC40Y8pXHJcbiAgICA1ICjQstC40LTQtdC+INC/0L7QtNCw0Y7RgiDRgNC10L/Qu9C40LrQuCkuXHJcbiAgKi9cclxuICBzd2l0Y2ggKGV2ZW50LmRhdGEpIHtcclxuICAgIGNhc2UgMTpcclxuICAgICAgcGxheWVyQ29udGFpbmVyLmFkZENsYXNzKFwiYWN0aXZlXCIpO1xyXG4gICAgICBwbGF5ZXJDb250YWluZXIuYWRkQ2xhc3MoXCJwYXVzZWRcIik7XHJcbiAgICAgIGJyZWFrO1xyXG5cclxuICAgIGNhc2UgMjpcclxuICAgICAgcGxheWVyQ29udGFpbmVyLnJlbW92ZUNsYXNzKFwiYWN0aXZlXCIpO1xyXG4gICAgICBwbGF5ZXJDb250YWluZXIucmVtb3ZlQ2xhc3MoXCJwYXVzZWRcIik7XHJcbiAgICAgIGJyZWFrO1xyXG4gIH1cclxufTtcclxuXHJcblxyXG5cclxubGV0IHBsYXllckhlaWdodCA9ICQoJy5wbGF5ZXInKS5vdXRlckhlaWdodCgpO1xyXG5sZXQgcGxheWVyV2lkdGggPSAkKCcucGxheWVyJykub3V0ZXJXaWR0aCgpO1xyXG5cclxuXHJcblxyXG5mdW5jdGlvbiBvbllvdVR1YmVJZnJhbWVBUElSZWFkeSgpIHtcclxuXHJcbiAgcGxheWVyID0gbmV3IFlULlBsYXllcihcInl0LXBsYXllclwiLCB7XHJcbiAgICBoZWlnaHQ6IHBsYXllckhlaWdodCxcclxuICAgIHdpZHRoOiBwbGF5ZXJXaWR0aCxcclxuICAgIHZpZGVvSWQ6IFwiOHBhb3lZOEJUTzBcIixcclxuICAgIGV2ZW50czoge1xyXG4gICAgICBvblJlYWR5OiBvblBsYXllclJlYWR5LFxyXG4gICAgICBvblN0YXRlQ2hhbmdlOiBvblBsYXllclN0YXRlQ2hhbmdlXHJcbiAgICB9LFxyXG4gICAgcGxheWVyVmFyczoge1xyXG4gICAgICBjb250cm9sczogMCxcclxuICAgICAgZGlzYWJsZWtiOiAwLFxyXG4gICAgICBzaG93aW5mbzogMCxcclxuICAgICAgcmVsOiAwLFxyXG4gICAgICBhdXRvcGxheTogMCxcclxuICAgICAgbW9kZXN0YnJhbmRpbmc6IDBcclxuICAgIH1cclxuICB9KTtcclxufVxyXG5cclxuXHJcbmV2ZW50c0luaXQoKTtcclxuXHJcbiJdfQ==
