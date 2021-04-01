import ScrollTimeline from "js/animation/scroll-timeline";

const scrollContainer = document.querySelector(".scroll-container");
const nav = document.querySelector(".nav");

let options = {
  scrollStep: 80,
  maxScrollValue: 1800,
  snaps: [
    { value: 0, snapOver: 300 },
    { value: 900, snapUnder: 600, snapOver: 200 },
  ],
};

const scrolltimeline = new ScrollTimeline(options);

scrolltimeline.addCallback(
  (value) => {
    scrollContainer.style.transform = `translateX(${value}vw)`;
  },
  {
    start: 0,
    end: 1800,
    from: 0,
    to: -200,
  }
);


scrolltimeline.addCallback(
  (value) => {
    nav.style.transform = `translateX(${value}px)`;
  },
  {
    start: 0,
    end: 600,
    from: -305,
    to: 0,
  }
);

scrolltimeline.start();
