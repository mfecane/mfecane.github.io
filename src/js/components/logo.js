import { mapclamp } from "js/lib/lib";

import svgfile from "assets/svg/svg-low.svg";
import loadSvg from "js/svg/read";
import tweakshapes from "js/svg/tweakshapes";
import { easeOutCubic } from "js/lib/easing-functions";

let canvas;
let ctx;
const time = { start: Date.now(), current: 0, duration: 2.0, loop: 6 };
const size = { w: 0, h: 0, cx: 0, cy: 0 };
let points;
let shapes;
let onEnd;
let element;
let transform = {
  scale: 0.4,
};

class Shape {
  constructor(points) {
    this.points = points;
    this.start = 0;
    this.end = 1.0;
    this.width = 5;
    this.drawn = 0;
    this.color = `rgba(255,70,28,1)`;
  }

  draw(t) {
    if (t < this.start) {
      return;
    }
    t = (t - this.start) / (this.end - this.start);
    let i = Math.floor((this.points.length - 1) * t);
    for (let j = this.drawn; j < i; ++j) {
      let w = this.calculateWidth(j);
      const color = this.color;
      color = "rgba(255,70,28,1)";
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(
        size.cx + this.points[j].x * transform.scale,
        this.points[j].y * transform.scale,
        w * transform.scale,
        0,
        Math.PI * 2,
        true
      );
      // symmetry
      ctx.arc(
        size.cx - this.points[j].x * transform.scale,
        this.points[j].y * transform.scale,
        w * transform.scale,
        0,
        Math.PI * 2,
        true
      );
      ctx.fill();
    }
    this.drawn = i;
  }

  calculateWidth(j) {
    let w = j / (this.points.length - 1);
    w = -w * (w - 1);
    return mapclamp(w, 0, 1 / 4, 1, this.width);
  }
}

const handleShapes = function () {
  shapes.forEach((el) => {
    let t = time.current / time.duration;
    t = t > 1 ? 1 : t;
    t = easeOutCubic(t);
    el.draw(t);
  });
};

const setFrame = function (t) {
  shapes.forEach((el) => {
    t = easeOutCubic(t);
    el.draw(t);
  });
};

const setCanvasSize = function () {
  size.w = canvas.width = element.clientWidth;
  size.h = canvas.height = element.clientHeight;
  size.cx = size.w / 2;
  size.cy = size.h / 2;
};

export const init = function (el) {
  element = el;
  canvas = document.createElement(`canvas`);
  element.appendChild(canvas);
  canvas.id = "logo-canvas";
  ctx = canvas.getContext("2d");

  setCanvasSize();
  window.addEventListener(`resize`, () => {
    resetTime();
    resetCanvas();
    setCanvasSize();
  });

  points = loadSvg(svgfile);
  createShapes();
  return this;
};

const createShapes = function () {
  shapes = points.map((el, index) => {
    let overwrite = {};
    if (tweakshapes[index]) {
      overwrite = tweakshapes[index];
    }
    let shape = new Shape(el);
    Object.assign(shape, overwrite);
    return shape;
  });
};

const resetCanvas = function () {
  ctx.fillStyle = `rgba(0,0,0,0)`;
  ctx.fillRect(0, 0, size.w, size.h);
};

const handleTime = function (resetCallback) {
  time.current = (Date.now() - time.start) / 1000.0;
  if (time.current > time.loop) {
    onEnd();
    // resetCallback();
    // resetTime();
  }
};

const resetTime = function () {
  time.start = Date.now();
  time.current = (Date.now() - time.start) / 1000.0;
};

const animate = function () {
  handleTime(resetCanvas);
  handleShapes();
  window.requestAnimationFrame(animate);
};

export const setCallback = function (callback) {
  onEnd = callback;
};

export const start = function (callback) {
  resetTime();
  resetCanvas();
  animate();
  onEnd = callback;
};
