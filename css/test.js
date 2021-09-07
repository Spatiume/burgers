const left = document.querySelector("#left");
const right = document.querySelector("#right");
const items = document.querySelector("#items");

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