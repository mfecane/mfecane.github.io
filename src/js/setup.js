import ScrollTimeline from "js/animation/scroll-timeline";
import MainBgAnimation from "js/components/main-background";
import * as logo from "js/components/logo";

window.onload = () => {
  const scrollContainer = document.querySelector(".scroll-container");
  const navBackground = document.querySelector(".nav-background");
  const mainBgCanvasContainer = document.querySelector(
    "#main-bg-canvas-container"
  );
  const logoContainer = document.querySelector("#logo-container");
  const logoGroupContainer = document.querySelector(".logo-group__container");
  const navLinks = document.querySelectorAll(".nav__link");

  const mainBgAnimation = new MainBgAnimation(mainBgCanvasContainer);

  mainBgAnimation.start();

  logo.init(logoContainer);
  window.setTimeout(
    () =>
      logo.start(
        scrolltimeline.addCallback(
          (value) => {
            logo.start();
          },
          {
            start: 0,
            end: 100,
            from: 0,
            to: 0,
          }
        )
      ),
    400
  );

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
      navBackground.style.transform = `translateX(${value}vw)`;
    },
    {
      start: 0,
      end: 600,
      from: -21,
      to: 0,
    }
  );

  scrolltimeline.addCallback(
    (value) => {
      mainBgCanvasContainer.style.transform = `translateX(${value}vw)`;
    },
    {
      start: 0,
      end: 1600,
      from: 0,
      to: -101,
    }
  );

  scrolltimeline.addCallback(
    (value, value1) => {
      logoGroupContainer.style.left = `${20 - 20 * value1}vw`;
      logoContainer.style.width = `${value}vw`;
      navLinks.forEach((el) => {
        el.style.fontSize = `${3 - value1}rem`;
      });
    },
    {
      start: 0,
      end: 900,
      from: 40,
      to: 20,
    }
  );

  scrolltimeline.start();
};
