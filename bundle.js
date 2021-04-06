/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./assets/img/bg.jpg":
/*!***************************!*\
  !*** ./assets/img/bg.jpg ***!
  \***************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "8b2f0cf10cdc16c0ee4c.jpg";

/***/ }),

/***/ "./src/ts/animation/scroll-timeline.ts":
/*!*********************************************!*\
  !*** ./src/ts/animation/scroll-timeline.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ScrollTimeline)
/* harmony export */ });
/* harmony import */ var ts_lib_lib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ts/lib/lib */ "./src/ts/lib/lib.ts");
/* harmony import */ var ts_lib_easing_functions__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ts/lib/easing-functions */ "./src/ts/lib/easing-functions.ts");



function clamp(val, min, max) {
  return val < min ? min : val > max ? max : val;
} // TODO: change from frame count to real time


class ScrollTimeline {
  constructor(options) {
    this.COOLDOWN_TIMEOUT = 100;
    this.ANIM_FRAMES = 20;
    this.EASING_FUNCTION = ts_lib_easing_functions__WEBPACK_IMPORTED_MODULE_1__.easeOutCubic;
    this.scrollValue = 0;
    this.scrollStep = 10;
    this.maxScrollValue = 1000;
    this.callbacks = [];
    this.elements = [];
    this.cooldownTimeout = null;
    this.animId = null;
    this.boundElementProperties = {};
    this.animation = {
      startScrollValue: 0,
      targetScrollValue: 0
    };
    this.animationFrames = {
      current: 0,
      start: 0,
      end: this.ANIM_FRAMES
    };
    this.snaps = [];
    this.scrollStep = options.scrollStep;
    this.maxScrollValue = options.maxScrollValue;
    this.snaps = options.snaps;
  }

  addCallback(callback, options) {
    const c = {
      func: callback,
      start: 0,
      end: this.maxScrollValue,
      from: 0,
      to: 1,
      ...options
    };
    this.callbacks.push(c);
  }

  handleCallbacks() {
    this.callbacks.forEach(c => {
      if (this.scrollValue >= c.start && this.scrollValue <= c.end) {
        let value = (0,ts_lib_lib__WEBPACK_IMPORTED_MODULE_0__.mapclamp)(this.scrollValue, c.start, c.end, c.from, c.to);
        c.func(value, (this.scrollValue - c.start) / c.end);
      }
    });
  }

  addElement(selector, property, units, options) {
    let elements = document.querySelectorAll(selector);
    let e = {
      elements,
      property,
      units,
      start: 0,
      end: 0,
      from: this.maxScrollValue,
      to: 1,
      ...options
    };
    this.elements.push(e);
  }

  handleElements() {
    this.elements.forEach(e => {
      e.elements.forEach(e1 => {
        if (this.scrollValue >= e.start && this.scrollValue <= e.end) {
          let value = (0,ts_lib_lib__WEBPACK_IMPORTED_MODULE_0__.mapclamp)(this.scrollValue, e.start, e.end, e.from, e.to);
          e1.style[e.property] = `${value}${e.units}`;
        }
      });
    });
  }

  start() {
    this.handleCallbacks();
    window.addEventListener('wheel', this.handleScroll.bind(this));
  }

  handleScroll(e) {
    let value = e.deltaY;

    if (value > 0) {
      this.setScrollValue(this.animation.targetScrollValue + this.scrollStep);
    } else if (value < 0) {
      this.setScrollValue(this.animation.targetScrollValue - this.scrollStep);
    }
  }

  onCooldown() {
    const closest = this.findClosestSnapValue();

    if (Number.isFinite(closest)) {
      this.setScrollValue(closest);
    }
  }

  findClosestSnapValue() {
    let foundValue = Infinity;
    this.snaps.forEach(snap => {
      if (this.scrollValue <= snap.value && this.scrollValue > snap.value - snap.snapUnder || this.scrollValue >= snap.value && this.scrollValue <= snap.value + snap.snapOver) {
        foundValue = snap.value;
      }
    });
    return Math.abs(foundValue - this.scrollValue) > 0.1 ? foundValue : Infinity;
  }

  setCoolDownTimeout() {
    this.cooldownTimeout = window.setTimeout(() => {
      this.onCooldown();
    }, this.COOLDOWN_TIMEOUT);
  }

  clearCoolDownTimeout() {
    if (this.cooldownTimeout) {
      window.clearTimeout(this.cooldownTimeout);
      this.cooldownTimeout = null;
    }
  }

  setScrollValue(value) {
    value = clamp(value, 0, this.maxScrollValue);
    this.animation.startScrollValue = this.scrollValue;
    this.animation.targetScrollValue = value;
    this.animationFrames.current = 0;
    this.animationFrames.end = this.ANIM_FRAMES * this.scrollTimeGrowCoefficient();

    if (this.animId) {
      cancelAnimationFrame(this.animId);
    }

    this.clearCoolDownTimeout();
    this.animate();
  }

  scrollTimeGrowCoefficient() {
    return 1 + Math.abs(this.animation.targetScrollValue - this.animation.startScrollValue) / this.scrollStep / 2;
  }

  animate() {
    let t = this.EASING_FUNCTION(this.animationFrames.current / this.animationFrames.end);

    if (t > 0.99) {
      t = 1;
    }

    this.scrollValue = this.animation.startScrollValue + (this.animation.targetScrollValue - this.animation.startScrollValue) * t;
    this.animationFrames.current++;

    if (this.animationFrames.current >= this.animationFrames.end) {
      this.setCoolDownTimeout();
      return;
    }

    this.handleCallbacks();
    this.handleElements();
    this.animId = requestAnimationFrame(this.animate.bind(this));
  }

}

/***/ }),

/***/ "./src/ts/components/logo.ts":
/*!***********************************!*\
  !*** ./src/ts/components/logo.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "setFrame": () => (/* binding */ setFrame),
/* harmony export */   "init": () => (/* binding */ init),
/* harmony export */   "setCallback": () => (/* binding */ setCallback),
/* harmony export */   "start": () => (/* binding */ start)
/* harmony export */ });
/* harmony import */ var ts_lib_lib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ts/lib/lib */ "./src/ts/lib/lib.ts");
/* harmony import */ var ts_svg_read__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ts/svg/read */ "./src/ts/svg/read.ts");
/* harmony import */ var ts_svg_tweakshapes__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ts/svg/tweakshapes */ "./src/ts/svg/tweakshapes.ts");
/* harmony import */ var ts_lib_easing_functions__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ts/lib/easing-functions */ "./src/ts/lib/easing-functions.ts");
/* harmony import */ var assets_svg_svg_low_svg__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! assets/svg/svg-low.svg */ "./assets/svg/svg-low.svg");
/* harmony import */ var assets_svg_svg_low_svg__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(assets_svg_svg_low_svg__WEBPACK_IMPORTED_MODULE_4__);





let canvas;
let ctx;
const time = {
  start: Date.now(),
  current: 0,
  duration: 2.0,
  loop: 2.2
};
const size = {
  w: 0,
  h: 0,
  cx: 0,
  cy: 0
};
let points;
let shapes;
let onEnd;
let element;
const transform = {
  scale: 0.3
};
const globalColor = `rgb(243, 20, 57)`;
let animId;
let end = false;

class Shape {
  constructor(points) {
    this.points = [];
    this.start = 0;
    this.end = 1.0;
    this.width = 5;
    this.drawn = 0;
    this.color = `rgb(90, 7, 20)`;
    this.points = points;
  }

  draw(t) {
    if (t < this.start) {
      return;
    }

    t = (t - this.start) / (this.end - this.start);
    let i = Math.floor((this.points.length - 1) * t);

    for (let j = 0; j < i; ++j) {
      const w = this.calculateWidth(j);
      ctx.fillStyle = globalColor;
      ctx.beginPath();
      ctx.arc(size.cx + this.points[j].x * transform.scale, this.points[j].y * transform.scale, w * transform.scale, 0, Math.PI * 2, true); // symmetry

      ctx.arc(size.cx - this.points[j].x * transform.scale, this.points[j].y * transform.scale, w * transform.scale, 0, Math.PI * 2, true);
      ctx.fill();
    }

    this.drawn = i;
  }

  calculateWidth(j) {
    let w = j / (this.points.length - 1);
    w = -w * (w - 1);
    return (0,ts_lib_lib__WEBPACK_IMPORTED_MODULE_0__.mapclamp)(w, 0, 1 / 4, 1, this.width);
  }

}

const handleShapes = function () {
  shapes.forEach(el => {
    let t = time.current / time.duration;
    t = t > 1 ? 1 : t;
    t = (0,ts_lib_easing_functions__WEBPACK_IMPORTED_MODULE_3__.easeOutCubic)(t);
    el.draw(t);
  });
};

const setFrame = function (t) {
  resetCanvas();
  t = (0,ts_lib_easing_functions__WEBPACK_IMPORTED_MODULE_3__.easeOutCubic)(t);
  shapes.forEach(el => {
    el.draw(t);
  });
};

const setCanvasSize = function () {
  size.w = canvas.width = element.clientWidth;
  size.h = canvas.height = element.clientWidth * 0.4;
  transform.scale = element.clientWidth / 1800;
  size.cx = size.w / 2;
  size.cy = size.h / 2;
};

const init = function (el) {
  element = el;
  canvas = document.createElement(`canvas`);
  element.appendChild(canvas);
  canvas.id = 'logo-canvas';
  ctx = canvas.getContext('2d');
  setCanvasSize();
  window.addEventListener(`resize`, () => {
    resetTime();
    resetCanvas();
    setCanvasSize();
  });
  points = (0,ts_svg_read__WEBPACK_IMPORTED_MODULE_1__.default)((assets_svg_svg_low_svg__WEBPACK_IMPORTED_MODULE_4___default()));
  createShapes();
};

const createShapes = function () {
  shapes = points.map((el, index) => {
    let overwrite = {};

    if (ts_svg_tweakshapes__WEBPACK_IMPORTED_MODULE_2__.default[index]) {
      overwrite = ts_svg_tweakshapes__WEBPACK_IMPORTED_MODULE_2__.default[index];
    }

    const shape = new Shape(el);
    Object.assign(shape, overwrite);
    return shape;
  });
};

const resetCanvas = function () {
  ctx.clearRect(0, 0, size.w, size.h);
};

const handleTime = function (resetCallback) {
  time.current = (Date.now() - time.start) / 1000.0;

  if (time.current > time.loop) {
    if (onEnd) {
      window.cancelAnimationFrame(animId);
      onEnd();
      end = true;
    } // resetCallback();
    // resetTime();

  }
};

const resetTime = function () {
  time.start = Date.now();
  time.current = (Date.now() - time.start) / 1000.0;
};

const animate = function () {
  handleTime(resetCanvas);
  resetCanvas();
  handleShapes();

  if (!end) {
    animId = window.requestAnimationFrame(animate);
  }
};

const setCallback = function (callback) {
  onEnd = callback;
};
const start = function (callback) {
  resetTime();
  resetCanvas();
  animate();

  if (callback) {
    onEnd = callback;
  }
};

/***/ }),

/***/ "./src/ts/components/main-background.ts":
/*!**********************************************!*\
  !*** ./src/ts/components/main-background.ts ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var ts_interaction_mouse__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ts/interaction/mouse */ "./src/ts/interaction/mouse.ts");
/* harmony import */ var ts_lib_lib__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ts/lib/lib */ "./src/ts/lib/lib.ts");
/* harmony import */ var ts_webgl_shader__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ts/webgl/shader */ "./src/ts/webgl/shader.ts");
/* harmony import */ var ts_webgl_texture__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ts/webgl/texture */ "./src/ts/webgl/texture.ts");
/* harmony import */ var shaders_rain_vert__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! shaders/rain.vert */ "./src/shaders/rain.vert");
/* harmony import */ var shaders_rain_vert__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(shaders_rain_vert__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var shaders_heatmap_frag__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! shaders/heatmap.frag */ "./src/shaders/heatmap.frag");
/* harmony import */ var shaders_heatmap_frag__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(shaders_heatmap_frag__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var shaders_rain_frag__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! shaders/rain.frag */ "./src/shaders/rain.frag");
/* harmony import */ var shaders_rain_frag__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(shaders_rain_frag__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var assets_img_bg_jpg__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! assets/img/bg.jpg */ "./assets/img/bg.jpg");










class Animation {
  constructor(element) {
    this.cnv = null;
    this.gl = null;
    this.size = {
      w: 0,
      h: 0,
      cx: 0,
      cy: 0
    };
    this.lastFrameTime = 0;
    this.currentFrameTime = 0;
    this.fps = 60;
    this.fpsHistory = [];
    this.proj = [];
    this.psize = 4.0;
    this.startTime = 0.0;
    this.time = 0.0;
    this.texture = null;
    this.texture2 = null;
    this.texture3 = null;
    this.uvmouse = {
      x: 0.0,
      y: 0.0
    };
    this.lastmousepos = {
      x: 0.0,
      y: 0.0
    };
    this.mouseintensity = 0.0;
    this.mouseshift = 0.0;
    this.element = null;
    this.heatmapShader = void 0;
    this.rainShader = void 0;
    this.resolution = 1;
    this.targetTextureWidth = 0;
    this.targetTextureHeight = 0;
    this.frameBuffer = null;
    this.element = element;
    this.createCanvas();
  }

  start() {
    this.updateAnimation();
  }

  calculateMVP() {
    const ratio = this.size.w / this.size.h;
    const left = 0;
    const right = 1;
    const bottom = 1;
    const top = 0;
    const near = 0.0;
    const far = 1.0; // prettier-ignore

    this.proj = [2 / (right - left), 0, 0, -(right + left) / (right - left), 0, 2 / (top - bottom), 0, -(top + bottom) / (top - bottom), 0, 0, 2 / (far - near), -(far + near) / (far - near), 0, 0, 0, 1];
  }

  createCanvas() {
    this.cnv = document.createElement(`canvas`);
    this.element.appendChild(this.cnv);
    this.cnv.id = 'canvas';
    const gl = this.gl = this.cnv.getContext('webgl2');
    this.setCanvasSize();
    window.addEventListener(`resize`, () => {
      this.setCanvasSize();
    });
    this.rainShader = new ts_webgl_shader__WEBPACK_IMPORTED_MODULE_2__.default(gl);
    this.rainShader.createProgram((shaders_rain_vert__WEBPACK_IMPORTED_MODULE_4___default()), (shaders_rain_frag__WEBPACK_IMPORTED_MODULE_6___default()));
    this.heatmapShader = new ts_webgl_shader__WEBPACK_IMPORTED_MODULE_2__.default(gl);
    this.heatmapShader.createProgram((shaders_rain_vert__WEBPACK_IMPORTED_MODULE_4___default()), (shaders_heatmap_frag__WEBPACK_IMPORTED_MODULE_5___default()));
    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer); // prettier-ignore

    const positions = [-1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer); // prettier-ignore

    const indices = [0, 1, 2, 2, 3, 0];
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
    this.heatmapShader.useProgram();
    this.heatmapShader.setPositions('aPos');
    this.heatmapShader.addUniform('u_Sampler', '1i');
    this.heatmapShader.addUniform('u_Mouse', '2f');
    this.heatmapShader.addUniform('u_time', '1f');
    this.heatmapShader.addUniform('u_MVP', '4fv');
    this.heatmapShader.addUniform('u_asp', '1f');
    this.rainShader.useProgram();
    this.rainShader.setPositions('aPos');
    this.rainShader.addUniform('u_MVP', '4fv');
    this.rainShader.addUniform('u_time', '1f');
    this.rainShader.addUniform('u_Size', '1f');
    this.rainShader.addUniform('u_Sampler', '1i');
    this.rainShader.addUniform('u_SamplerH', '1i');
    this.rainShader.addUniform('u_Mouse', '2f');
    this.rainShader.addUniform('u_MouseInt', '1f');
    this.rainShader.addUniform('u_asp', '1f');
    this.rainShader.addUniform('u_mouseshift', '1f');
    this.startTime = Date.now();
    this.texture = new ts_webgl_texture__WEBPACK_IMPORTED_MODULE_3__.default(gl).fromUrl(assets_img_bg_jpg__WEBPACK_IMPORTED_MODULE_7__); // TODO: should be 1 dimentional

    this.targetTextureWidth = this.size.w;
    this.targetTextureHeight = this.size.h;
    this.texture2 = new ts_webgl_texture__WEBPACK_IMPORTED_MODULE_3__.default(gl).empty(256, 256);
    this.texture3 = new ts_webgl_texture__WEBPACK_IMPORTED_MODULE_3__.default(gl).empty(256, 256); // Create and bind the framebuffer

    this.frameBuffer = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer); // attach the texture as the first color attachment

    const attachmentPoint = gl.COLOR_ATTACHMENT0;
    gl.framebufferTexture2D(gl.FRAMEBUFFER, attachmentPoint, gl.TEXTURE_2D, this.texture2, 0);
  }

  updateCanvas() {
    this.time = (Date.now() - this.startTime) / 1000.0;
    this.calculateMVP();
    this.getMouse();
    this.drawHeatMap();
    this.drawImage();
    this.swapTextures();
  }

  drawImage() {
    const gl = this.gl;
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    this.rainShader.useProgram();
    this.rainShader.setUniform('u_MVP', this.proj);
    this.rainShader.setUniform('u_time', this.time);
    this.rainShader.setUniform('u_Size', this.psize);
    this.rainShader.setUniform('u_Mouse', this.uvmouse.x, this.uvmouse.y);
    this.rainShader.setUniform('u_MouseInt', this.mouseintensity);
    this.rainShader.setUniform('u_asp', this.size.w / this.size.h);
    this.rainShader.setUniform('u_mouseshift', this.mouseshift);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    this.rainShader.setUniform('u_Sampler', 0);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, this.texture2);
    this.rainShader.setUniform('u_SamplerH', 1);
    this.gl.viewport(0, 0, this.size.w, this.size.h);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
  }

  drawHeatMap() {
    const gl = this.gl;
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.texture2);
    const attachmentPoint = gl.COLOR_ATTACHMENT0;
    gl.framebufferTexture2D(gl.FRAMEBUFFER, attachmentPoint, gl.TEXTURE_2D, this.texture2, 0);
    this.heatmapShader.useProgram();
    this.heatmapShader.setUniform('u_Mouse', this.uvmouse.x, this.uvmouse.y);
    this.heatmapShader.setUniform('u_time', this.time);
    this.heatmapShader.setUniform('u_MVP', this.proj);
    this.heatmapShader.setUniform('u_asp', this.size.w / this.size.h);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, this.texture3);
    this.heatmapShader.setUniform('u_Sampler', 1);
    gl.viewport(0, 0, this.targetTextureWidth / 4, this.targetTextureHeight / 4);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, null);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  }

  swapTextures() {
    const tmp = this.texture2;
    this.texture2 = this.texture3;
    this.texture3 = tmp;
  }

  setCanvasSize() {
    const width = this.element.clientWidth;
    const height = this.element.clientHeight;
    this.cnv.style.width = `${width}px`;
    this.cnv.style.height = `${height}px`;
    this.size.w = this.cnv.width = width / this.resolution;
    this.size.h = this.cnv.height = height / this.resolution;
    this.size.cx = this.size.w / 2;
    this.size.cy = this.size.h / 2;
    this.gl.viewport(0, 0, this.size.w, this.size.h);
  }

  getMouse() {
    const mouse = (0,ts_interaction_mouse__WEBPACK_IMPORTED_MODULE_0__.default)();
    const x = mouse.x;
    const y = mouse.y; // TODO: tweak

    if (x > 0 && x < this.size.w && y > 0 && y < this.size.h) {
      this.uvmouse = {
        x: (0,ts_lib_lib__WEBPACK_IMPORTED_MODULE_1__.mapclamp)(x, 0, this.size.w, 0, 1),
        y: (0,ts_lib_lib__WEBPACK_IMPORTED_MODULE_1__.mapclamp)(y, 0, this.size.h, 0, 1)
      };
      this.mouseshift = (0,ts_lib_lib__WEBPACK_IMPORTED_MODULE_1__.mapclamp)(x - this.size.cx, -this.size.w / 3, this.size.w / 3, -0.05, 0.05);
      return;
    }

    this.uvmouse = {
      x: -1,
      y: -1
    };
    this.mouseshift = 0;
  }

  calculateFps() {
    if (this.lastFrameTime == 0) {
      this.lastFrameTime = this.time;
    } else {
      this.currentFrameTime = this.time - this.lastFrameTime;
      this.fpsHistory.push(1 / this.currentFrameTime);
      this.lastFrameTime = this.time;

      if (this.fpsHistory.length > 20) {
        const sum = this.fpsHistory.reduce((a, b) => a + b, 0);
        const avg = sum / this.fpsHistory.length || 0;
        this.fps = avg;
        this.fpsHistory = []; // console.log("Animation fps ", Math.round(this.fps, 0));
      }
    }
  } // animation loop


  updateAnimation() {
    this.updateCanvas(); // this.calculateFps()

    window.requestAnimationFrame(() => {
      this.updateAnimation();
    });
  }

}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Animation);

/***/ }),

/***/ "./src/ts/interaction/mouse.ts":
/*!*************************************!*\
  !*** ./src/ts/interaction/mouse.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const mouse = {
  x: null,
  y: null
};
window.addEventListener('mousemove', e => {
  mouse.x = e.x;
  mouse.y = e.y; // console.log(`mouse: ${mouse.x}, ${mouse.y}`);
});
/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__() {
  return mouse;
}

/***/ }),

/***/ "./src/ts/lib/easing-functions.ts":
/*!****************************************!*\
  !*** ./src/ts/lib/easing-functions.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "easeInOutQuint": () => (/* binding */ easeInOutQuint),
/* harmony export */   "easeOutCubic": () => (/* binding */ easeOutCubic),
/* harmony export */   "easeInOutQuad": () => (/* binding */ easeInOutQuad),
/* harmony export */   "easeOutBack": () => (/* binding */ easeOutBack)
/* harmony export */ });
function easeInOutQuint(x) {
  return x < 0.5 ? 16 * x * x * x * x * x : 1 - Math.pow(-2 * x + 2, 5) / 2;
}
function easeOutCubic(x) {
  return 1 - Math.pow(1 - x, 3);
}
function easeInOutQuad(x) {
  return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
}
function easeOutBack(x) {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
}

/***/ }),

/***/ "./src/ts/lib/lib.ts":
/*!***************************!*\
  !*** ./src/ts/lib/lib.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "mapclamp": () => (/* binding */ mapclamp),
/* harmony export */   "hexToRgb": () => (/* binding */ hexToRgb),
/* harmony export */   "dist": () => (/* binding */ dist)
/* harmony export */ });
function mapclamp(x, in_start, in_end, out_start, out_end) {
  x = x === undefined ? in_end : x;
  x = x > in_end ? in_end : x;
  x = x < in_start ? in_start : x;
  let out = out_start + (out_end - out_start) / (in_end - in_start) * (x - in_start);
  return out;
}
function hexToRgb(hex) {
  var bigint = parseInt(hex, 16);
  var r = bigint >> 16 & 255;
  var g = bigint >> 8 & 255;
  var b = bigint & 255;
  return r + ',' + g + ',' + b;
}
function dist(a, b) {
  return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
}

/***/ }),

/***/ "./src/ts/setup.ts":
/*!*************************!*\
  !*** ./src/ts/setup.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var ts_animation_scroll_timeline__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ts/animation/scroll-timeline */ "./src/ts/animation/scroll-timeline.ts");
/* harmony import */ var ts_components_main_background__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ts/components/main-background */ "./src/ts/components/main-background.ts");
/* harmony import */ var ts_components_logo__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ts/components/logo */ "./src/ts/components/logo.ts");




window.onload = () => {
  const scrollContainer = document.querySelector('.scroll-container');
  const mainBgCanvasContainer = document.querySelector('#main-bg-canvas-container');
  const logoContainer = document.querySelector('#logo-container');
  const topage1 = document.querySelector('#topage1');
  const topage2 = document.querySelector('#topage2');
  const topage3 = document.querySelector('#topage3');
  const mouseContainer = document.querySelector('.mouse__container');
  const pagerIndicator = document.querySelector('.pager__indicator');
  window.setTimeout(() => {
    ts_components_logo__WEBPACK_IMPORTED_MODULE_2__.init(logoContainer);
    ts_components_logo__WEBPACK_IMPORTED_MODULE_2__.start(() => {
      scrolltimeline.addCallback((value, value1) => {
        ts_components_logo__WEBPACK_IMPORTED_MODULE_2__.setFrame(value);

        if (value1 > 0.1) {
          mouseContainer.classList.add('fade-out');
        } else {
          mouseContainer.classList.remove('fade-out');
        }
      }, {
        start: 0,
        end: 300,
        from: 1,
        to: 0
      });
    });
  }, 400);
  const mainBgAnimation = new ts_components_main_background__WEBPACK_IMPORTED_MODULE_1__.default(mainBgCanvasContainer);
  mainBgAnimation.start();
  const options = {
    scrollStep: 80,
    maxScrollValue: 1800,
    snaps: [{
      value: 0,
      snapOver: 300
    }, {
      value: 900,
      snapUnder: 600,
      snapOver: 200
    }]
  };
  const scrolltimeline = new ts_animation_scroll_timeline__WEBPACK_IMPORTED_MODULE_0__.default(options);
  scrolltimeline.addCallback(value => {
    scrollContainer.style.transform = `translateX(${value}vw)`;
  }, {
    start: 0,
    end: 1800,
    from: 0,
    to: -200
  });
  scrolltimeline.addCallback(value => {
    mainBgCanvasContainer.style.transform = `translateX(${value}vw)`;
  }, {
    start: 0,
    end: 1600,
    from: 0,
    to: -101
  });
  scrolltimeline.addCallback(value => {
    pagerIndicator.style.left = `${value}px`;
  }, {
    start: 0,
    end: 1800,
    from: 5,
    to: 135
  }); // topage1.addEventListener('click', () => {
  //   scrolltimeline.setScrollValue(0)
  // })
  // topage2.addEventListener('click', () => {
  //   scrolltimeline.setScrollValue(900)
  // })
  // topage3.addEventListener('click', () => {
  //   scrolltimeline.setScrollValue(1800)
  // })

  mouseContainer.addEventListener('click', () => {
    scrolltimeline.setScrollValue(900);
  });
  scrolltimeline.start();
};

/***/ }),

/***/ "./src/ts/svg/read.ts":
/*!****************************!*\
  !*** ./src/ts/svg/read.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var ts_svg_smooth__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ts/svg/smooth */ "./src/ts/svg/smooth.ts");

const RegEx = {
  seg: /[A-Za-z][^A-Za-z]+/g
};

const loadSvg = function (data) {
  var element = document.createElement('div');
  element.innerHTML = data;
  const svg = element.firstChild;
  let shapes = collectData(svg);
  shapes = filterData(shapes);
  return (0,ts_svg_smooth__WEBPACK_IMPORTED_MODULE_0__.default)(shapes);
};

const analyzeChunk = function (found, arr) {
  const operation = found[0];
  var d = found.slice(1);

  switch (operation) {
    case 'M':
      return analyzeM(d, arr);

    case 'c':
      return analyzeC(d, arr);

    case 's':
      return analyzeS(d, arr);

    case 'S':
      return analyzeBigS(d, arr);

    case 'C':
      return analyzeBigC(d, arr);
  }
};

const analyzeM = function (found, arr) {
  const [x, y] = found.split(',');
  console.assert(arr.length === 0);
  return {
    x: +x,
    y: +y
  };
};

function globalPreProcess(str) {
  str = str.replace(/\-/g, ',-');
  str = str.replace(/\s/g, '');
  return str;
}

function preprocess(found) {
  if (found[0] === ',') {
    found = found.slice(1);
  }

  return found;
}

const analyzeC = function (found, arr) {
  found = preprocess(found);
  const arr1 = found.split(',');
  let x = 0;
  let y = 0;
  x = +arr1[4];
  y = +arr1[5];
  const last = arr[arr.length - 1];
  x += last.x;
  y += last.y;
  return {
    x,
    y
  };
};

const analyzeS = function (found, arr) {
  found = preprocess(found);
  const arr1 = found.split(',');
  let x = 0;
  let y = 0;
  x = +arr1[2];
  y = +arr1[3];
  const last = arr[arr.length - 1];
  x += last.x;
  y += last.y;
  return {
    x,
    y
  };
};

const analyzeBigS = function (found, arr) {
  found = preprocess(found);
  const arr1 = found.split(',');
  let x = +arr1[2];
  let y = +arr1[3];
  return {
    x,
    y
  };
};

const analyzeBigC = function (found, arr) {
  found = preprocess(found);
  const arr1 = found.split(',');
  let x = +arr1[4];
  let y = +arr1[5];
  return {
    x,
    y
  };
};

function collectData(svg) {
  const result = [];
  const children = [].slice.call(svg.children);
  children.forEach(el => {
    if (el.nodeName === 'g') {
      const children1 = [].slice.call(el.children);
      children1.forEach(el1 => {
        const arr = [];
        let d = el1.getAttribute('d');
        d = globalPreProcess(d);
        let found;
        let i = 0;
        let array1;

        while ((array1 = RegEx.seg.exec(d)) !== null) {
          found = array1[0];
          let res = analyzeChunk(found, arr);

          if (res) {
            arr.push(res);
          } else {
            debugger;
          }

          i++;

          if (i > 100000) {
            break;
          }
        }

        result.push(arr);
      });
    }
  });
  return result.filter(el => el.length > 2);
}

function filterData(shapes) {
  return shapes.map((el1, index) => {
    let lastpoint = null;
    return el1.filter(el2 => {
      if (!lastpoint) {
        lastpoint = el2;
        return;
      }

      let dist = Math.sqrt(Math.pow(el2.x - lastpoint.x, 2) + Math.pow(el2.y - lastpoint.y, 2));

      if (dist < 2) {
        return false;
      }

      lastpoint = el2;
      return true;
    });
  });
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (loadSvg);

/***/ }),

/***/ "./src/ts/svg/smooth.ts":
/*!******************************!*\
  !*** ./src/ts/svg/smooth.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var cubic_spline__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! cubic-spline */ "./node_modules/cubic-spline/index.js");
/* harmony import */ var cubic_spline__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(cubic_spline__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var ts_lib_lib__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ts/lib/lib */ "./src/ts/lib/lib.ts");


const PATH_RESOLUTION = 100;

const smoothShapes = function (shapes) {
  return shapes.map(shape => smoothShape(shape));
};

const smoothShape = function (shape) {
  const length = shape.length;
  let xs = shape.map(el => el.x);
  let ys = shape.map(el => el.y);
  let current = 0;
  let ts = shape.reduce((acc, cur, index, arr) => {
    if (index > 0) {
      current += (0,ts_lib_lib__WEBPACK_IMPORTED_MODULE_1__.dist)(cur, arr[index - 1]);
    }

    acc.push(current);
    return acc;
  }, []);
  let maxlen = ts[ts.length - 1];

  (el, index) => {
    return PATH_RESOLUTION / length * index;
  };

  const splineX = new (cubic_spline__WEBPACK_IMPORTED_MODULE_0___default())(ts, xs);
  const splineY = new (cubic_spline__WEBPACK_IMPORTED_MODULE_0___default())(ts, ys);
  const arr = Array(PATH_RESOLUTION).fill(null);
  return arr.map((el, index) => {
    let t = (0,ts_lib_lib__WEBPACK_IMPORTED_MODULE_1__.mapclamp)(index, 0, PATH_RESOLUTION, 0, maxlen);
    return {
      x: splineX.at(t),
      y: splineY.at(t)
    };
  });
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (smoothShapes);

/***/ }),

/***/ "./src/ts/svg/tweakshapes.ts":
/*!***********************************!*\
  !*** ./src/ts/svg/tweakshapes.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
let tweakshapes = []; // prettier-ignore

{
  tweakshapes[0] = {
    width: 14,
    start: 0.00,
    duration: 0.80
  };
  tweakshapes[1] = {
    width: 16,
    start: 0.28,
    duration: 0.88,
    color: "rgba(255,0,0,1)"
  };
  tweakshapes[2] = {
    width: 9,
    start: 0.46,
    duration: 1.00
  };
  tweakshapes[3] = {
    width: 9,
    start: 0.40,
    duration: 1.00,
    color: "rgba(125,125,255,1)"
  };
  tweakshapes[4] = {
    width: 7,
    start: 0.32,
    duration: 0.60,
    color: "rgba(125,255,255,1)"
  };
  tweakshapes[5] = {
    width: 4,
    start: 0.72,
    duration: 0.88
  };
  tweakshapes[6] = {
    width: 10,
    start: 0.72,
    duration: 1.00,
    color: "rgba(0,125,0,1)"
  };
  tweakshapes[7] = {
    width: 6,
    start: 0.44,
    duration: 0.64
  };
  tweakshapes[8] = {
    width: 10,
    start: 0.40,
    duration: 0.80,
    color: "rgba(255,125,0,1)"
  };
  tweakshapes[9] = {
    width: 7,
    start: 0.50,
    duration: 0.82,
    color: "rgba(0,0,125,1)"
  };
  tweakshapes[10] = {
    width: 7,
    start: 0.44,
    duration: 0.76,
    color: "rgba(125,255,125,1)"
  };
  tweakshapes[11] = {
    width: 4,
    start: 0.56,
    duration: 0.76
  };
  tweakshapes[12] = {
    width: 7,
    start: 0.34,
    duration: 0.74,
    color: "rgba(255,255,125,1)"
  };
  tweakshapes[13] = {
    width: 4,
    start: 0.42,
    duration: 0.58
  };
  tweakshapes[14] = {
    width: 5,
    start: 0.66,
    duration: 0.90
  };
  tweakshapes[15] = {
    width: 6,
    start: 0.64,
    duration: 1.00
  };
  tweakshapes[16] = {
    width: 4,
    start: 0.74,
    duration: 0.98
  };
  tweakshapes[17] = {
    width: 5,
    start: 0.68,
    duration: 0.96,
    color: "rgba(255,125,125,1)"
  };
  tweakshapes[18] = {
    width: 6,
    start: 0.50,
    duration: 0.70
  };
  tweakshapes[19] = {
    width: 6,
    start: 0.56,
    duration: 0.76
  };
  tweakshapes[20] = {
    width: 4,
    start: 0.72,
    duration: 0.88
  };
  tweakshapes[21] = {
    width: 5,
    start: 0.68,
    duration: 0.84
  };
  tweakshapes[22] = {
    width: 4,
    start: 0.72,
    duration: 0.94
  };
  tweakshapes[23] = {
    width: 6,
    start: 0.36,
    duration: 0.76
  };
  tweakshapes[24] = {
    width: 6,
    start: 0.66,
    duration: 0.86,
    color: "rgba(0,0,255,1)"
  };
  tweakshapes[25] = {
    width: 8,
    start: 0.64,
    duration: 0.84,
    color: "rgba(0,125,255,1)"
  };
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (tweakshapes);

/***/ }),

/***/ "./src/ts/webgl/shader.ts":
/*!********************************!*\
  !*** ./src/ts/webgl/shader.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Shader)
/* harmony export */ });
class Shader {
  constructor(gl) {
    this.gl = gl;
    this.uniforms = [];
    this.positionLocation = null;
  }

  createProgram(vertexSource, fragmentSource) {
    const gl = this.gl;
    const vertShader = gl.createShader(gl.VERTEX_SHADER);
    const fragShader = gl.createShader(gl.FRAGMENT_SHADER);
    const vertSrc = gl.shaderSource(vertShader, vertexSource);
    const fragSrc = gl.shaderSource(fragShader, fragmentSource);
    gl.compileShader(vertShader, vertSrc);

    if (!gl.getShaderParameter(vertShader, gl.COMPILE_STATUS)) {
      alert("Error compiling vertex shader");
      console.log(gl.getShaderInfoLog(vertShader));
    }

    gl.compileShader(fragShader, fragSrc);

    if (!gl.getShaderParameter(fragShader, gl.COMPILE_STATUS)) {
      alert("Error compiling fragment shader");
      console.log(gl.getShaderInfoLog(fragShader));
    }

    const program = gl.createProgram();
    gl.attachShader(program, vertShader);
    gl.attachShader(program, fragShader);
    gl.linkProgram(program);
    gl.validateProgram(program);

    if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
      console.log("Error validating program ", gl.getProgramInfoLog(program));
      return;
    }

    this.program = program;
  }

  useProgram() {
    this.gl.useProgram(this.program);
  }

  addUniform(name, type) {
    const uniform = this.gl.getUniformLocation(this.program, name);
    const u = {
      name,
      type,
      uniform
    };
    this.uniforms.push(u);
  }

  setUniform() {
    const name = arguments[0];
    const u = this.uniforms.find(u => u.name === name);

    if (u) {
      switch (u.type) {
        case "4fv":
          this.gl.uniformMatrix4fv(u.uniform, false, arguments[1]);
          return;

        case "1f":
          this.gl.uniform1f(u.uniform, arguments[1]);
          return;

        case "2f":
          this.gl.uniform2f(u.uniform, arguments[1], arguments[2]);
          return;

        case "1i":
          this.gl.uniform1i(u.uniform, arguments[1]);
          return;
      }
    }
  }

  setPositions(name) {
    this.positionLocation = this.gl.getAttribLocation(this.program, name);
    this.gl.enableVertexAttribArray(this.positionLocation);
    this.gl.vertexAttribPointer(this.positionLocation, 2, this.gl.FLOAT, false, 0, 0);
  }

}

/***/ }),

/***/ "./src/ts/webgl/texture.ts":
/*!*********************************!*\
  !*** ./src/ts/webgl/texture.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Texture)
/* harmony export */ });
class Texture {
  constructor(gl) {
    this.texture = null;
    this.gl = null;
    this.level = 0;
    this.internalFormat = 0;
    this.border = 0;
    this.format = 0;
    this.srcFormat = 0;
    this.type = 0;
    this.data = null;
    this.srcType = 0;
    this.pixel = null;
    this.width = 0;
    this.height = 0;
    this.targetTextureWidth = 0;
    this.targetTextureHeight = 0;
    this.gl = gl;
    this.pixel = new Uint8Array([106, 163, 149, 255]);
    this.internalFormat = this.gl.RGBA;
    this.format = this.gl.RGBA;
    this.srcFormat = this.gl.RGBA;
    this.type = this.gl.UNSIGNED_BYTE;
    this.srcType = this.gl.UNSIGNED_BYTE;
  }

  fromUrl(url) {
    const gl = this.gl;
    this.texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.texImage2D(gl.TEXTURE_2D, this.level, this.internalFormat, this.width, this.height, this.border, this.srcFormat, this.srcType, this.pixel);
    const image = new Image();

    image.onload = () => {
      gl.bindTexture(gl.TEXTURE_2D, this.texture);
      gl.texImage2D(gl.TEXTURE_2D, this.level, this.internalFormat, this.srcFormat, this.srcType, image);
      gl.generateMipmap(gl.TEXTURE_2D);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    };

    image.src = url;
    return this.texture;
  }

  empty(targetTextureWidth, targetTextureHeight) {
    const gl = this.gl;
    this.texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    this.data = null;
    this.targetTextureWidth = targetTextureWidth;
    this.targetTextureHeight = targetTextureHeight;
    gl.texImage2D(gl.TEXTURE_2D, this.level, this.internalFormat, this.targetTextureWidth, this.targetTextureHeight, this.border, this.srcFormat, this.srcType, this.data); // set the filtering so we don't need mips

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    return this.texture;
  }

}

/***/ }),

/***/ "./node_modules/cubic-spline/index.js":
/*!********************************************!*\
  !*** ./node_modules/cubic-spline/index.js ***!
  \********************************************/
/***/ ((module) => {

module.exports = class Spline {
  constructor(xs, ys) {
    this.xs = xs;
    this.ys = ys;
    this.ks = this.getNaturalKs(new Float64Array(this.xs.length));
  }

  getNaturalKs(ks) {
    const n = this.xs.length - 1;
    const A = zerosMat(n + 1, n + 2);

    for (
      let i = 1;
      i < n;
      i++ // rows
    ) {
      A[i][i - 1] = 1 / (this.xs[i] - this.xs[i - 1]);
      A[i][i] =
        2 *
        (1 / (this.xs[i] - this.xs[i - 1]) + 1 / (this.xs[i + 1] - this.xs[i]));
      A[i][i + 1] = 1 / (this.xs[i + 1] - this.xs[i]);
      A[i][n + 1] =
        3 *
        ((this.ys[i] - this.ys[i - 1]) /
          ((this.xs[i] - this.xs[i - 1]) * (this.xs[i] - this.xs[i - 1])) +
          (this.ys[i + 1] - this.ys[i]) /
            ((this.xs[i + 1] - this.xs[i]) * (this.xs[i + 1] - this.xs[i])));
    }

    A[0][0] = 2 / (this.xs[1] - this.xs[0]);
    A[0][1] = 1 / (this.xs[1] - this.xs[0]);
    A[0][n + 1] =
      (3 * (this.ys[1] - this.ys[0])) /
      ((this.xs[1] - this.xs[0]) * (this.xs[1] - this.xs[0]));

    A[n][n - 1] = 1 / (this.xs[n] - this.xs[n - 1]);
    A[n][n] = 2 / (this.xs[n] - this.xs[n - 1]);
    A[n][n + 1] =
      (3 * (this.ys[n] - this.ys[n - 1])) /
      ((this.xs[n] - this.xs[n - 1]) * (this.xs[n] - this.xs[n - 1]));

    return solve(A, ks);
  }

  /**
   * inspired by https://stackoverflow.com/a/40850313/4417327
   */
  getIndexBefore(target) {
    let low = 0;
    let high = this.xs.length;
    let mid = 0;
    while (low < high) {
      mid = Math.floor((low + high) / 2);
      if (this.xs[mid] < target && mid !== low) {
        low = mid;
      } else if (this.xs[mid] >= target && mid !== high) {
        high = mid;
      } else {
        high = low;
      }
    }
    return low + 1;
  }

  at(x) {
    let i = this.getIndexBefore(x);
    const t = (x - this.xs[i - 1]) / (this.xs[i] - this.xs[i - 1]);
    const a =
      this.ks[i - 1] * (this.xs[i] - this.xs[i - 1]) -
      (this.ys[i] - this.ys[i - 1]);
    const b =
      -this.ks[i] * (this.xs[i] - this.xs[i - 1]) +
      (this.ys[i] - this.ys[i - 1]);
    const q =
      (1 - t) * this.ys[i - 1] +
      t * this.ys[i] +
      t * (1 - t) * (a * (1 - t) + b * t);
    return q;
  }
};

function solve(A, ks) {
  const m = A.length;
  let h = 0;
  let k = 0;
  while (h < m && k <= m) {
    let i_max = 0;
    let max = -Infinity;
    for (let i = h; i < m; i++) {
      const v = Math.abs(A[i][k]);
      if (v > max) {
        i_max = i;
        max = v;
      }
    }

    if (A[i_max][k] === 0) {
      k++;
    } else {
      swapRows(A, h, i_max);
      for (let i = h + 1; i < m; i++) {
        const f = A[i][k] / A[h][k];
        A[i][k] = 0;
        for (let j = k + 1; j <= m; j++) A[i][j] -= A[h][j] * f;
      }
      h++;
      k++;
    }
  }

  for (
    let i = m - 1;
    i >= 0;
    i-- // rows = columns
  ) {
    var v = 0;
    if (A[i][i]) {
      v = A[i][m] / A[i][i];
    }
    ks[i] = v;
    for (
      let j = i - 1;
      j >= 0;
      j-- // rows
    ) {
      A[j][m] -= A[j][i] * v;
      A[j][i] = 0;
    }
  }
  return ks;
}

function zerosMat(r, c) {
  const A = [];
  for (let i = 0; i < r; i++) A.push(new Float64Array(c));
  return A;
}

function swapRows(m, k, l) {
  let p = m[k];
  m[k] = m[l];
  m[l] = p;
}


/***/ }),

/***/ "./src/css/global.scss":
/*!*****************************!*\
  !*** ./src/css/global.scss ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/css/mouse.scss":
/*!****************************!*\
  !*** ./src/css/mouse.scss ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/css/null.scss":
/*!***************************!*\
  !*** ./src/css/null.scss ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/css/page1.scss":
/*!****************************!*\
  !*** ./src/css/page1.scss ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/css/page2.scss":
/*!****************************!*\
  !*** ./src/css/page2.scss ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/css/pager.scss":
/*!****************************!*\
  !*** ./src/css/pager.scss ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/shaders/heatmap.frag":
/*!**********************************!*\
  !*** ./src/shaders/heatmap.frag ***!
  \**********************************/
/***/ ((module) => {

module.exports = "#version 300 es\r\n\r\nprecision highp float;\r\n\r\n#define S(a, b, t) smoothstep(a, b, t)\r\n#define _2PI 6.28318530718\r\n\r\nout vec4 FragColor;\r\nin vec2 uv;\r\n\r\nuniform float u_time;\r\nuniform sampler2D u_Sampler;\r\nuniform float u_asp;\r\nuniform vec2 u_Mouse;\r\n\r\nfloat N21(vec2 p) {\r\n  p = fract(p * vec2(123.34f, 345.45f));      \r\n  p += dot(p, p + 34.345f);\r\n  return fract(p.x * p.y);      \r\n}\r\n\r\nvec4 SampleBlur(sampler2D u_Sampler, vec2 sampleuv, float Directions, float Quality, float Size, vec2 Radius, float mip) {\r\n  vec4 Color = texture(u_Sampler, sampleuv, mip);\r\n  for(float d = 0.0; d < _2PI; d += _2PI/Directions) {\r\n    for(float i = 1.0 / Quality; i <= 1.0; i += 1.0 / Quality) {\r\n      Color += texture(u_Sampler, sampleuv + vec2(cos(d), sin(d)) * Radius * i, mip);\t\t\r\n    }\r\n  }\r\n  Color /= Quality * Directions;\r\n  return Color;\r\n}\r\n\r\nvoid main()\r\n{\r\n  vec2 asp = vec2(u_asp / 1.4, 1.0); // texture aspect\r\n  float t = mod(u_time, 72000.0);\r\n  vec2 mouse = u_Mouse;\r\n  vec2 uv1 = uv;\r\n  uv1.y = 1.0 - uv1.y;\r\n\r\n  // Sampler UV Directions Quality Size Radius Mip\r\n  vec4 BlurColor = SampleBlur(u_Sampler, uv1, 6.0, 2.0, 0.5, vec2(0.01), 2.0);\r\n\r\n  float mouseCircle = S(0.3f, 0.0f, length((mouse - uv1) * asp )) ;\r\n\r\n  FragColor = BlurColor + 0.03 * mouseCircle;\r\n  FragColor *= 0.918;\r\n  FragColor = clamp(FragColor, 0.0, 1.0);\r\n}"

/***/ }),

/***/ "./src/shaders/rain.frag":
/*!*******************************!*\
  !*** ./src/shaders/rain.frag ***!
  \*******************************/
/***/ ((module) => {

module.exports = "#version 300 es\r\n\r\nprecision highp float;\r\n\r\n#define S(a, b, t) smoothstep(a, b, t)\r\n#define _2PI 6.28318530718\r\n\r\nout vec4 FragColor;\r\nin vec2 uv;\r\n\r\nuniform float u_time;\r\nuniform float u_Size;\r\nuniform sampler2D u_Sampler;\r\nuniform sampler2D u_SamplerH;\r\nuniform float u_MouseInt;\r\nuniform float u_asp;\r\nuniform vec2 u_Mouse;\r\n\r\nfloat N21(vec2 p) {\r\n  p = fract(p * vec2(123.34f, 345.45f));      \r\n  p += dot(p, p + 34.345f);\r\n  return fract(p.x * p.y);      \r\n}\r\n\r\nfloat blendScreen(float base, float blend) {\r\n\treturn 1.0-((1.0-base)*(1.0-blend));\r\n}\r\n\r\nvec3 blendScreen(vec3 base, vec3 blend) {\r\n\treturn vec3(blendScreen(base.r,blend.r),blendScreen(base.g,blend.g),blendScreen(base.b,blend.b));\r\n}\r\n\r\nvec3 blendScreen(vec3 base, vec3 blend, float opacity) {\r\n\treturn (blendScreen(base, blend) * opacity + base * (1.0 - opacity));\r\n}\r\n\r\nvec4 blendScreen(vec4 base, vec4 blend, float opacity) {\r\n\treturn vec4(blendScreen(base.xyz, blend.xyz, opacity), 1.0);\r\n}\r\n\r\n\r\nvec4 SampleBlur(sampler2D u_Sampler, vec2 sampleuv, float Directions, float Quality, float Size, vec2 Radius, float mip) {\r\n  vec4 Color = texture(u_Sampler, sampleuv, mip);\r\n  for(float d = 0.0; d < _2PI; d += _2PI/Directions) {\r\n    for(float i = 1.0 / Quality; i <= 1.0; i += 1.0 / Quality) {\r\n      Color += texture(u_Sampler, sampleuv + vec2(cos(d), sin(d)) * Radius * i, mip);\t\t\r\n    }\r\n  }\r\n  Color /= Quality * Directions;\r\n  return Color;\r\n}\r\n\r\nvec3 Layer(vec2 UV, float t) {\r\n  \r\n  vec2 asp = vec2(2.0f, 1.0f); // y: 2, x: 1\r\n  vec2 uv1 = UV * u_Size * asp;\r\n  uv1.y = -uv1.y;\r\n  uv1.y += t * .25f;\r\n  vec2 gv = fract(uv1) - .5f;\r\n  vec2 id = floor(uv1);\r\n\r\n  float n = N21(id);\r\n  t += n * 6.2831;\r\n  \r\n  float w = UV.y * 10.0f;\r\n  float x = (n - 0.5f) * .8f;\r\n  x += (.4f - abs(x)) * sin(3.0f * w) * pow(sin(w), 6.0f) * .45f;\r\n\r\n  float y = -sin(t + sin(t + sin(t) * .5f)) * .45f;\r\n  y -= (gv.x - x) * (gv.x - x);\r\n\r\n  vec2 dropPos = (gv - vec2(x, y)) / asp;\r\n  float drop = S(.035f, .025f, length(dropPos));\r\n\r\n  vec2 trailPos = (gv - vec2(x, t * .25f)) / asp;\r\n  trailPos.y = (fract(trailPos.y * 16.0f) - 0.5f) / 16.0f;\r\n  float trail = S(.03f, .001f, length(trailPos)) * .4f;\r\n  float fogTrail = S(-.1f, .1f, dropPos.y);\r\n  fogTrail *= S(.5f, y, gv.y);\r\n  trail *= fogTrail;\r\n  fogTrail *= S(0.03f, 0.02f, abs(dropPos.x));\r\n\r\n  vec2 offs = drop * dropPos * .6 + trail * trailPos * .4;\r\n\r\n  return vec3(offs, fogTrail);\r\n}\r\n\r\nvoid main()\r\n{\r\n  vec2 asp = vec2(u_asp, 1.0);\r\n  // cycle time to avoid precision drop\r\n  float t = mod(u_time, 72000.0);\r\n\r\n  float imgasp = u_asp / 1.4; // image aspect ratio\r\n  vec2 sampleuv;\r\n  if (imgasp > 1.0) { \r\n    sampleuv = (uv - vec2(0.5)) * vec2(1.0, 1.0 / imgasp) + vec2(0.5);\r\n  } else {\r\n    sampleuv = (uv - vec2(0.5)) * vec2(imgasp, 1.0) + vec2(0.5);\r\n  }\r\n\r\n  vec2 uv1 = uv * asp;\r\n\r\n  FragColor = vec4(0.0f);\r\n\r\n  vec3 drops = Layer(uv1, t);\r\n  drops += Layer(uv1 * 1.73f + 1.75f, t + 1.87);\r\n  // drops += Layer(uv1 * 1.13f + 7.03f, t + 3.31);\r\n\r\n  float blur = (1.0f - drops.z);\r\n  vec2 uvoff = sampleuv + drops.xy;\r\n  \r\n  // Sampler UV Directions Quality Size Radius Mip\r\n  // vec4 Color = texture(u_Sampler, sampleuv, 4.0);\r\n  vec4 Color = SampleBlur(u_Sampler, sampleuv, 12.0, 6.0, 2.0, vec2(0.05), 0.0);\r\n  // Color = blendScreen(Color, vec4(1.0), 0.05);\r\n\r\n   float mouseHeat = texture(u_SamplerH, sampleuv).x;\r\n   blur *= (1.0f - mouseHeat);\r\n\r\n  vec4 BaseColor = texture(u_Sampler, uvoff) * 0.9;\r\n  FragColor = mix(BaseColor, Color, blur);\r\n  // FragColor = vec4(mouseHeat);\r\n}"

/***/ }),

/***/ "./src/shaders/rain.vert":
/*!*******************************!*\
  !*** ./src/shaders/rain.vert ***!
  \*******************************/
/***/ ((module) => {

module.exports = "#version 300 es\r\n\r\nprecision highp float;\r\nlayout(location = 0) in vec2 aPos;\r\n\r\nout vec2 uv;\r\n\r\nuniform mat4 u_MVP;\r\n\r\nvoid main() {\r\n  gl_Position = vec4(aPos, .0f, 1.0f);\r\n  vec4 uv_out =  gl_Position * inverse(u_MVP);\r\n  uv = uv_out.xy;\r\n}"

/***/ }),

/***/ "./assets/svg/svg-low.svg":
/*!********************************!*\
  !*** ./assets/svg/svg-low.svg ***!
  \********************************/
/***/ ((module) => {

module.exports = "<svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 1920 1080\" style=\"enable-background:new 0 0 1920 1080;\" xml:space=\"preserve\"><style type=\"text/css\"> .st0{fill:none;stroke:#FF461C;stroke-miterlimit:10;} </style><g><path class=\"st0\" d=\"M91.3,552.2c-2.3,0.3-4.2,1.5-5.5,3.1c-1.4,1.6-2.3,3.7-2.6,5.9c-0.4,2.2-0.3,4.6,0.4,6.8 c0.6,2.2,1.8,4.2,3.5,5.8c1.7,1.5,3.9,2.7,6.4,3.5c2.5,0.8,5.3,1.2,8.1,1.2c2.8,0,5.7-0.5,8.4-1.4s5.2-2.3,7.3-4.1 c3.3-3,5.6-6.8,6.9-11c1.3-4.2,1.5-8.8,0.6-13.4c-0.9-4.6-2.9-9.1-6.1-13.1c-3.2-4-7.6-7.6-13.2-10.2c-4.8-2.2-10-3.7-15.2-4.3 c-5.2-0.6-10.6-0.5-15.8,0.4c-5.2,0.9-10.3,2.5-15,4.9s-9,5.4-12.7,9.2c-4,4.1-7.5,8.7-10.4,13.5c-2.9,4.9-5.1,10.1-6.8,15.4 c-1.7,5.4-2.7,10.9-3.1,16.5c-0.4,5.6-0.1,11.2,0.9,16.8c0.9,5.4,2.3,10.4,4,14.9c1.7,4.5,3.8,8.7,6.2,12.4c2.4,3.7,5,7,7.8,10 c2.8,2.9,5.9,5.5,9.1,7.7c4.6,3.2,9.2,5.7,14,7.7c4.7,2,9.6,3.4,14.6,4.4c5,0.9,10,1.3,15.2,1.2c5.2-0.1,10.5-0.7,16-1.7 c5.5-1,10.3-2.3,14.4-3.8c4.2-1.5,7.8-3.2,11.2-5c3.3-1.8,6.4-3.8,9.3-5.8s5.9-4.1,8.9-6.2c5.5-3.7,11-8.1,16.5-13s10.8-10.3,16-16 c5.2-5.7,10.2-11.6,15-17.6s9.2-12,13.2-17.8c3.8-5.4,7.7-10.8,11.9-15.9c4.1-5.2,8.5-10.1,13-14.9s9.4-9.2,14.4-13.4 s10.4-8,16.1-11.5c6.3-3.9,13.7-6.5,21.6-8.1c7.9-1.6,16.2-2.2,24.5-1.9s16.4,1.3,23.9,2.9c7.5,1.7,14.4,3.9,20,6.6 c6.9,3.3,13.6,7.6,19.5,12.6s11.2,10.9,15.6,17.5c4.3,6.5,7.7,13.7,9.8,21.3c2.1,7.6,2.9,15.8,2,24.2c-0.5,5.2-2,10.2-4.3,15.1 c-2.3,4.8-5.4,9.4-9.1,13.5c-3.7,4.1-8,7.9-12.8,11c-4.8,3.1-10,5.6-15.5,7.4c-1.7,0.5-3.5,1-5.2,1.4c-1.8,0.4-3.6,0.6-5.4,0.7 c-1.8,0.1-3.6,0.1-5.4,0c-1.8-0.1-3.6-0.4-5.4-0.8c-2.5-0.6-5-1.5-7.2-2.7s-4.3-2.7-6.1-4.4s-3.4-3.6-4.6-5.6 c-1.2-2-2.2-4.2-2.7-6.5c-0.6-2.3-0.7-4.6-0.5-6.9c0.2-2.3,0.7-4.6,1.6-6.8s2.1-4.3,3.5-6.2c1.5-1.9,3.3-3.6,5.3-5.1 c1.4-1,2.8-1.8,4.4-2.4s3.1-0.9,4.7-1.1c1.6-0.2,3.2-0.2,4.9,0.1c1.7,0.2,3.3,0.6,5,1.2c1.7,0.6,3.1,1.7,4.2,3.1s1.9,3.1,2.4,4.9 s0.6,3.6,0.4,5.2s-0.8,3-1.9,4\"></path><path class=\"st0\" d=\"M58.7,642.8c4.1,2.7,9.5,4.6,15.5,5.8c6,1.2,12.6,1.6,19.3,1.3c6.6-0.3,13.2-1.4,19.2-3.3s11.2-4.5,15.2-7.9 c6.9-5.8,12.1-11.5,16.1-17.2s6.9-11.3,9-16.9c2.1-5.6,3.5-11.3,4.5-17.1s1.8-11.7,2.7-17.9c0.9-6.3,1.3-12.5,1.2-18.5 s-0.7-11.9-1.8-17.7s-2.5-11.5-4.2-17.2s-3.9-11.3-6.2-16.9c-2.1-4.9-4.8-10.3-8-15.9s-7.1-11.5-11.5-17.5 c-4.4-5.9-9.2-11.9-14.6-17.8c-5.3-5.8-11.1-11.5-17.3-16.9c-7-6-14-12.4-20.7-19c-6.7-6.6-13.2-13.4-19-20.1s-10.9-13.4-15-19.9 c-4.1-6.4-7.2-12.6-8.8-18.4c-2-6.9-3.4-14-4.2-21.1c-0.8-7.1-0.9-14.3-0.3-21.5c0.6-7.1,1.8-14.2,3.8-21s4.6-13.5,8.1-19.8 c3.4-6.3,7.8-12.6,12.9-18.5c5.1-6,10.8-11.7,17-16.9c6.2-5.2,12.8-10,19.5-14.1s13.6-7.5,20.3-10.1c9-3.5,17.9-6,26.5-7.7 c8.6-1.7,16.9-2.5,25-2.4c8.1,0.1,15.9,1.1,23.5,3.1c7.6,1.9,14.8,4.8,21.8,8.6c4.2,2.3,8.5,5.3,12.7,8.8 c4.2,3.5,8.2,7.5,11.9,11.7s7.2,8.7,10.1,13.1c2.9,4.4,5.4,8.9,7.2,13c2.5,5.9,4.5,12.4,5.8,19.2s2.1,13.7,2.3,20.5 c0.2,6.8-0.2,13.5-1.1,19.7c-0.9,6.2-2.3,11.9-4.1,16.7c-1.9,5-4.6,10.1-7.8,15s-7,9.7-11.4,14.3c-4.4,4.5-9.3,8.7-14.7,12.5 c-5.4,3.7-11.3,7-17.6,9.6c-4.4,1.8-9.4,3-14.6,3.6c-5.2,0.6-10.8,0.5-16.4-0.1s-11.3-1.9-16.9-3.6c-5.6-1.8-11-4.1-16-7 c-4.4-2.5-8.5-5.8-12.2-9.6c-3.7-3.8-7-8.2-9.6-12.8c-2.7-4.6-4.8-9.6-6.2-14.5s-2-10-1.8-14.8c0.2-4.8,0.8-9,1.7-12.7 c0.9-3.7,2.2-7,3.9-9.9c1.7-2.9,3.8-5.5,6.4-7.8c2.6-2.3,5.6-4.3,9.1-6.3c2.1-1.1,4.5-2.1,7.2-2.8c2.7-0.7,5.5-1.1,8.4-1.2 c2.9-0.1,5.7,0.1,8.4,0.7c2.7,0.6,5.2,1.6,7.3,3c2.3,1.5,4,3.3,5.1,5.2c1.1,1.9,1.6,3.8,1.6,5.7c-0.1,1.9-0.7,3.7-1.8,5.4 c-1.2,1.6-2.8,3.1-5,4.2\"></path><path class=\"st0\" d=\"M54.7,235.7c4.6-5.2,9.3-10,14.2-14.3s9.9-8.1,15-11.6c5.1-3.5,10.2-6.5,15.2-9.2s10.1-5.1,15-7.2 c5.3-2.3,10.5-5.1,15.5-8.3c5-3.2,9.8-6.9,14.1-10.8c4.3-3.9,8.2-8.1,11.5-12.5c3.3-4.3,5.9-8.8,7.7-13.3c1.6-3.9,2.7-8.2,3.2-12.6 s0.7-9.1,0.3-13.6s-1.3-9-2.7-13.1c-1.4-4.1-3.3-7.8-5.7-10.9c-3.1-3.9-6.4-7.3-9.9-10.2c-3.6-2.9-7.4-5.3-11.5-7.4 c-4.1-2.1-8.5-3.7-13.1-5.1c-4.6-1.4-9.5-2.5-14.7-3.4c-5.3-0.9-10.4-1.1-15.3-0.8c-4.9,0.3-9.6,1.1-13.9,2.3 c-4.4,1.2-8.5,2.6-12.2,4.3c-3.7,1.6-7.1,3.5-10,5.2c-2.4,1.5-4.7,3.3-6.7,5.3s-3.8,4.3-5.5,6.8c-1.6,2.5-3,5.2-4.2,8.1 c-1.2,2.9-2.2,6-3,9.2c-0.5,2.2-0.8,4.7-0.7,7.3s0.4,5.3,1,7.9c0.6,2.7,1.5,5.3,2.6,7.9c1.1,2.5,2.5,4.9,4.2,7 c1.9,2.4,4,4.6,6.3,6.5s4.8,3.5,7.5,4.6s5.6,1.9,8.7,2.2c3.1,0.3,6.4,0.1,10-0.6c3.3-0.7,6.4-1.8,9.1-3.4c2.8-1.5,5.2-3.4,7.2-5.6 c2-2.2,3.7-4.7,4.8-7.4c1.2-2.7,1.8-5.7,1.9-8.7c0.1-2.9-0.6-5.7-1.9-8.1c-1.3-2.4-3.1-4.5-5.2-6.1c-2.1-1.6-4.6-2.7-7.2-3.1 c-2.6-0.5-5.2-0.3-7.7,0.7\"></path><path class=\"st0\" d=\"M75.2,657.8c6,1.2,12,1.8,18.1,2.1c6.1,0.2,12.1,0.1,18.2-0.5c6.1-0.6,12.1-1.5,18.1-2.8 c6-1.3,11.9-2.9,17.6-4.8s10.8-4,15.3-6.2c4.5-2.3,8.6-4.7,12.6-7.3c4-2.6,7.9-5.4,12.1-8.4c4.2-3,8.6-6.2,13.6-9.6 c3-2,6-4.1,9.1-6.2c3-2.1,6.1-4.1,9.2-5.9c3.1-1.9,6.3-3.6,9.6-5.1c3.3-1.5,6.7-2.8,10.2-3.8c3.5-1,7.2-1.6,10.9-1.7 c3.7-0.2,7.3,0.1,10.8,0.8c3.5,0.7,6.8,1.8,9.8,3.5c3,1.6,5.6,3.7,7.7,6.2c1.7,2,3.1,4.2,4.3,6.4s2.1,4.6,2.8,7s1.1,4.8,1.2,7.3 c0.1,2.5,0,5-0.5,7.5c-0.5,2.5-1.4,5-2.7,7.3c-1.3,2.3-3,4.4-5,6.2s-4.1,3.2-6.4,4.3c-2.3,1-4.7,1.6-7,1.5 c-3.2-0.1-6.3-0.4-9.1-1.1c-2.8-0.7-5.4-1.7-7.5-3c-2.2-1.3-4-2.9-5.4-4.7c-1.4-1.9-2.3-4-2.6-6.5c-0.3-2.1-0.2-4.2,0.2-6.2 c0.4-2,1.2-3.8,2.4-5.3c1.2-1.5,2.7-2.8,4.6-3.6c1.9-0.8,4.2-1.3,6.8-1.1c2,0.1,3.8,0.8,5.3,1.8c1.4,1,2.5,2.3,3.2,3.8 c0.7,1.4,0.9,3,0.6,4.4c-0.3,1.4-1.1,2.7-2.5,3.6\"></path><path class=\"st0\" d=\"M110.9,451.3c-4.8-4.3-9.1-8.1-13-11.5c-3.9-3.4-7.5-6.3-10.9-8.8s-6.9-4.6-10.4-6.2 c-3.6-1.7-7.3-2.9-11.5-3.7c-3.6-0.7-7.2-0.8-10.7-0.2c-3.4,0.5-6.7,1.6-9.7,3.2s-5.6,3.7-7.8,6.2s-4,5.4-5.1,8.6 c-0.8,2.3-1.4,4.7-1.7,7.2c-0.3,2.5-0.3,5,0,7.4c0.3,2.4,0.8,4.8,1.7,7s2,4.3,3.4,6.1c1.2,1.5,2.6,2.8,4.2,3.9 c1.6,1.1,3.4,2.1,5.4,2.9s4,1.3,6.1,1.6c2.1,0.3,4.3,0.3,6.4,0.1c1.7-0.2,3.3-0.6,4.7-1.2c1.5-0.6,2.8-1.3,4-2.1 c1.2-0.8,2.2-1.7,3.1-2.7s1.6-2,2.1-3c0.5-1,1-2.2,1.2-3.3c0.3-1.2,0.4-2.4,0.5-3.6s-0.1-2.4-0.4-3.6c-0.3-1.2-0.7-2.3-1.3-3.3 c-0.6-1-1.4-2-2.2-2.8s-1.9-1.4-2.9-1.9c-1.1-0.5-2.2-0.8-3.3-0.8c-1.1-0.1-2.2,0.1-3.3,0.5c-1.1,0.4-2,1.1-2.8,1.9 c-0.8,0.8-1.4,1.9-1.8,3s-0.6,2.3-0.6,3.5c0,1.2,0.3,2.3,0.9,3.4\"></path><path class=\"st0\" d=\"M244.3,316.5c-0.4,3.6-1.1,7.4-2.4,11.1s-2.9,7.5-5.1,10.9c-2.2,3.5-5,6.7-8.3,9.5c-3.3,2.8-7.3,5.1-11.9,6.8 c-1.2,0.4-2.7,0.8-4.3,1.1s-3.5,0.4-5.4,0.4c-1.9,0-3.9-0.1-5.8-0.3s-3.8-0.6-5.6-1.1c-1.7-0.5-3.3-1.2-4.9-2.1 c-1.6-0.9-3.1-2-4.4-3.2c-1.3-1.2-2.5-2.6-3.4-4.2c-0.9-1.5-1.6-3.2-1.9-5c-0.3-1.4-0.3-3.1,0-4.8s0.7-3.6,1.4-5.4 c0.7-1.8,1.6-3.5,2.7-5c1.1-1.5,2.4-2.7,3.9-3.5\"></path><path class=\"st0\" d=\"M371.8,506.6c5.1,2.3,10,5.5,14.6,9.1c4.6,3.6,9,7.6,12.9,11.8c3.9,4.1,7.5,8.4,10.4,12.3 c3,4,5.4,7.7,7.1,10.8c2.8,4.9,5.4,9.8,7.9,14.4c2.5,4.6,4.9,9,7.2,13.2c2.3,4.2,4.4,8.1,6.4,11.6c2,3.6,3.8,6.8,5.5,9.6 c2.7,4.7,5.9,9,9.6,12.8s7.8,7.2,12.4,10c4.6,2.8,9.7,5.1,15.4,6.8c5.7,1.7,11.8,2.7,18.6,3.1c7.2,0.4,14.1-0.2,20.5-1.6 c6.5-1.4,12.5-3.6,17.9-6.2s10.3-5.7,14.5-9c4.1-3.3,7.6-6.7,10.1-10c3.5-4.6,5.9-9.9,7.3-15.4c1.4-5.6,1.7-11.5,1.2-17.2 c-0.5-5.7-1.8-11.3-3.9-16.3s-4.8-9.4-8-12.7c-3.3-3.4-6.9-6.3-10.7-8.8c-3.8-2.5-7.8-4.5-11.8-6s-8.2-2.6-12.3-3.1 c-4.1-0.5-8.1-0.5-12,0.2c-3.5,0.6-7,1.4-10.3,2.6s-6.5,2.6-9.3,4.3s-5.5,3.7-7.7,5.9c-2.3,2.2-4.1,4.7-5.6,7.4 c-1.2,2.2-2.1,4.6-2.9,7.1c-0.7,2.5-1.2,5.2-1.4,8c-0.2,2.8-0.1,5.7,0.4,8.6c0.5,2.9,1.3,5.9,2.5,8.8c1.1,2.6,2.8,5.2,4.7,7.5 s4.3,4.3,6.8,5.9s5.1,2.7,7.6,3.2c2.6,0.5,5.1,0.4,7.3-0.6\"></path><path class=\"st0\" d=\"M61.8,388.9c-7.1-8.3-12-16.7-15.1-24.9c-3.2-8.1-4.6-16-4.7-23.2c-0.1-7.3,1.2-13.9,3.3-19.7 s5.3-10.6,8.9-14.1c3-2.9,6.4-5.3,9.9-7.1c3.5-1.8,7.2-3,10.9-3.6s7.3-0.6,10.6-0.1c3.4,0.5,6.5,1.7,9.1,3.4\"></path><path class=\"st0\" d=\"M180.8,561.4c4.5-7.3,9.1-15.4,13.7-24s9.1-17.6,13.6-26.6c4.5-9,8.9-18,13.1-26.6c4.3-8.6,8.4-16.7,12.3-23.9 s8-14.2,12.5-21c4.4-6.8,9.1-13.3,14.2-19.6c5.1-6.2,10.5-12.2,16.3-17.8c5.8-5.6,12.1-10.8,18.9-15.6c2.8-2,5.6-3.8,8.5-5.6 c2.9-1.8,5.8-3.4,8.9-5s6.1-3,9.2-4.4c3.1-1.4,6.2-2.7,9.4-3.9c5.6-2.1,11.3-4,17.1-5.5c5.8-1.5,11.7-2.8,17.6-3.6 c5.9-0.9,11.9-1.3,17.8-1.4c6,0,11.9,0.4,17.8,1.3c5.9,0.9,11.6,2.4,17.2,4.5s10.8,4.7,15.8,7.7c5,3.1,9.8,6.6,14.2,10.4 c4.5,3.9,8.6,8.1,12.4,12.6c3.4,4.1,6.3,8.4,8.8,12.9c2.5,4.5,4.5,9.1,6,13.7s2.6,9.3,3.1,13.9c0.6,4.6,0.6,9.1,0.2,13.4 c-0.4,3.6-1,6.9-1.8,10.1c-0.9,3.1-2,6-3.4,8.8c-1.4,2.7-3.1,5.3-5.2,7.7c-2.1,2.4-4.4,4.8-7.2,7c-2.5,2-5.4,3.9-8.5,5.4 c-3.1,1.5-6.5,2.7-9.9,3.5c-3.4,0.8-6.9,1.2-10.2,1.1c-3.3-0.1-6.6-0.7-9.5-1.9c-2.8-1.2-5.5-2.7-7.8-4.7c-2.3-1.9-4.3-4.1-6-6.6 c-1.7-2.5-2.9-5.2-3.8-8.1c-0.9-2.9-1.3-5.9-1.3-9.1c0-2.1,0.3-4.2,0.8-6.3c0.5-2.1,1.2-4.2,2.1-6.1c0.9-1.9,2-3.8,3.2-5.4 c1.2-1.6,2.5-3.1,3.9-4.3c1.6-1.4,3.5-2.4,5.4-3.2s4-1.3,6-1.5c2-0.2,4.1-0.2,6,0.1s3.8,0.8,5.5,1.5c1.9,0.8,3.5,1.7,4.9,2.8 s2.6,2.3,3.5,3.7s1.6,2.9,2,4.5c0.4,1.6,0.5,3.4,0.4,5.2c-0.2,1.8-0.9,3.6-2,5.2c-1.1,1.6-2.6,3-4.3,4.1s-3.6,1.9-5.5,2.3 c-1.9,0.4-3.9,0.3-5.7-0.3\"></path><path class=\"st0\" d=\"M208.8,538.3\"></path><path class=\"st0\" d=\"M179.7,563c3.5-4.9,7.2-10.9,10.7-17.6c3.5-6.7,6.8-14,9.7-21.5c2.9-7.4,5.4-15,7.2-22 c1.8-7.1,3-13.7,3.2-19.3c0.2-5.6-0.1-11-1-16.1c-0.9-5.1-2.4-9.8-4.6-14.1c-2.1-4.3-4.9-8.1-8.2-11.3c-3.4-3.2-7.3-5.9-11.9-7.8 c-1.1-0.5-2.6-0.9-4.2-1.2c-1.6-0.3-3.4-0.6-5.1-0.7c-1.8-0.2-3.5-0.2-5.2-0.2s-3.1,0.2-4.3,0.5c-1.2,0.3-2.3,0.8-3.3,1.4 c-1,0.6-1.9,1.4-2.8,2.4c-0.8,0.9-1.5,1.9-2.2,3c-0.6,1.1-1.1,2.2-1.6,3.4c-0.4,1.2-0.6,2.4-0.6,3.5s0.2,2.3,0.5,3.5 s0.8,2.3,1.4,3.4c0.6,1.1,1.3,2.1,2,3.1\"></path><path class=\"st0\" d=\"M196.5,534.9c2.5-5,4.9-9.9,7.4-14.7c2.5-4.8,5-9.5,7.6-14.3c2.6-4.7,5.3-9.5,8.1-14.4s5.8-9.9,8.9-15.1 c2-3.4,4.5-7,7.2-10.7c2.7-3.7,5.6-7.4,8.6-10.9c3-3.6,6-6.9,8.9-10c2.9-3,5.7-5.7,8.2-7.8c3.2-2.7,6.5-5.3,10-7.7 c3.4-2.4,7-4.5,10.8-6.4c3.7-1.9,7.7-3.5,11.8-4.8c4.1-1.3,8.4-2.3,13-3c4.4-0.6,8.6-1,12.5-1c4-0.1,7.7,0.1,11.2,0.6 c3.5,0.5,6.7,1.2,9.6,2.1c2.9,0.9,5.5,2.1,7.7,3.5c2.4,1.5,4.6,3.3,6.7,5.3s3.9,4.3,5.4,6.6c1.6,2.4,2.8,4.9,3.7,7.5 c0.9,2.6,1.5,5.2,1.6,7.8c0.1,1.8-0.1,3.7-0.7,5.7c-0.5,1.9-1.4,3.9-2.6,5.7c-1.2,1.8-2.9,3.5-4.9,4.9c-2,1.4-4.5,2.6-7.4,3.4\"></path><path class=\"st0\" d=\"M306.6,379.4c2.7-1.7,5.5-3.3,8.3-4.8c2.8-1.5,5.7-2.8,8.7-4.1c2.9-1.3,5.9-2.4,8.9-3.5c3-1.1,6.1-2.1,9.1-3 c2.7-0.8,5.4-1.6,8.1-2.2s5.5-1.2,8.2-1.7c2.8-0.5,5.5-0.8,8.3-1c2.8-0.2,5.6-0.2,8.4,0c2.8,0.2,5.6,0.6,8.4,1.2s5.5,1.4,8.1,2.5 c2.6,1.1,5.1,2.3,7.4,3.9c2.3,1.5,4.5,3.3,6.4,5.3s3.6,4.3,5,6.8c1.4,2.5,2.4,5.1,3.1,7.8c0.7,2.7,1,5.5,0.8,8.3s-0.7,5.5-1.7,8.1 c-1,2.6-2.6,5-4.5,7c-1.9,2.1-4.2,3.8-6.7,5s-5.2,2.1-7.9,2.4c-2.7,0.3-5.5,0-8.1-0.9\"></path><path class=\"st0\" d=\"M266,374c2.7-5.2,5.8-10,9-14.6c3.3-4.5,6.7-8.7,10.2-12.5c3.5-3.8,7.1-7.2,10.5-10.2c3.4-3,6.7-5.6,9.7-7.7 c2.8-2,5.7-3.7,8.7-5.3s6.1-3,9.1-4.3c3.1-1.3,6.2-2.5,9.2-3.5s6-2,8.9-2.8c2.8-0.8,6.9-1.6,11.8-2.5c5-0.8,10.8-1.7,17-2.6 c6.2-0.9,12.8-1.9,19.4-3c6.6-1.1,13.1-2.2,19.1-3.5c5.6-1.2,10.6-2.6,15.1-4.3c4.5-1.7,8.4-3.7,11.9-6s6.4-5.1,8.8-8.2 s4.5-6.7,6-10.8c1.3-3.5,2.1-7.3,2.2-11.2c0.1-3.9-0.4-7.9-1.5-11.7s-2.9-7.6-5.4-10.9s-5.5-6.4-9.3-8.8c-3.4-2.2-7.3-3.8-11.3-4.7 c-4-1-8.2-1.3-12.1-1c-3.9,0.3-7.7,1.1-10.8,2.5c-3.2,1.4-5.8,3.4-7.5,6\"></path><path class=\"st0\" d=\"M307.8,326.3c3.7-2.3,7.5-4.4,11.3-6.4c3.9-2,7.8-3.9,11.8-5.6s8-3.3,12.1-4.8c4.1-1.4,8.3-2.7,12.4-3.9 c2.6-0.7,5.3-1.4,8-2.2s5.3-1.6,7.8-2.7c2.5-1,4.9-2.2,7.1-3.7c2.2-1.5,4.2-3.3,5.8-5.4c1.5-1.9,2.6-4.1,3.4-6.5 c0.7-2.3,1.1-4.8,1.1-7.2c0-2.5-0.4-4.9-1.1-7.2c-0.8-2.3-1.9-4.5-3.4-6.5\"></path><path class=\"st0\" d=\"M443.8,367.5c4.2,3,8.3,6.7,12.3,10.8c3.9,4.1,7.7,8.7,11.1,13.5c3.5,4.8,6.6,9.9,9.3,15 c2.7,5.1,5,10.3,6.8,15.4c2.5,7.2,4.4,13.2,6.2,18.5c1.8,5.3,3.3,9.7,5.2,13.9c1.9,4.1,4,7.9,6.9,11.6c2.9,3.8,6.4,7.6,11.2,11.8 c1.6,1.4,3.7,2.9,6,4.2c2.4,1.4,5,2.6,7.8,3.7s5.7,2.1,8.6,2.8c2.9,0.7,5.8,1.2,8.4,1.3c3.7,0.2,7.2,0.1,10.4-0.3 c3.2-0.4,6.1-1.1,8.8-2c2.7-0.9,5.1-2.1,7.2-3.4c2.1-1.3,4-2.9,5.6-4.6c1.8-1.9,3.4-4.2,4.7-6.6c1.3-2.4,2.3-5,3.1-7.7 c0.7-2.7,1.2-5.4,1.3-8.2c0.1-2.8,0-5.5-0.5-8.2c-0.5-2.7-1.6-5.1-3-7.3c-1.5-2.2-3.4-4.1-5.6-5.6c-2.2-1.5-4.6-2.8-7.2-3.6 s-5.3-1.2-8-1.1c-2.7,0.1-5.3,0.9-7.7,2.1c-2.4,1.3-4.5,3-6.3,5.1c-1.7,2.1-3,4.5-3.8,7s-0.9,5.2-0.3,7.8\"></path><path class=\"st0\" d=\"M554.8,643.4c7,0.8,14,0.9,21,0.2c7-0.6,14-1.9,20.7-3.9c6.7-1.9,13.3-4.4,19.5-7.4s12-6.5,17.3-10.5 c6.4-4.7,12.8-8.7,19.3-12c6.5-3.3,12.9-5.8,19.3-7.7s12.6-3,18.7-3.6c6.1-0.5,11.9-0.4,17.5,0.3c5.9,0.8,11.3,1.8,16.4,3.2 s10,3.1,14.8,5.3c4.8,2.1,9.6,4.7,14.4,7.7c4.9,3,9.8,6.5,15.1,10.5c6,4.5,12.1,7.7,18.3,9.9c6.2,2.2,12.3,3.3,18.2,3.5 c5.9,0.2,11.5-0.4,16.6-1.8c5.1-1.3,9.7-3.4,13.5-5.9c1.9-1.2,3.8-2.8,5.7-4.5s3.7-3.8,5.3-6s3-4.5,4.1-7c1.1-2.5,1.8-5.1,2-7.7 c0.3-3.8-0.2-7.4-1.4-10.5c-1.2-3.2-3-5.9-5.2-8.1c-2.2-2.2-4.7-3.8-7.4-4.8c-2.6-0.9-5.4-1.2-7.9-0.6\"></path><path class=\"st0\" d=\"M663.9,597c5.2-2.4,11.6-4.1,18.4-5.4c6.8-1.2,14-2,20.8-2.3c6.8-0.3,13.3-0.3,18.7,0s9.6,0.8,12,1.5 c8.1,2.3,15.8,4.7,23.1,6.7c7.3,2,14.1,3.6,20.1,4.3s11.4,0.3,15.7-1.6s7.7-5.3,10-10.8\"></path><path class=\"st0\" d=\"M590.1,638.3c3.6-0.8,7.2-1.8,10.7-2.9c3.5-1.1,7-2.4,10.4-3.7c3.3-1.4,6.6-2.8,9.6-4.3s5.8-3.1,8.3-4.7 c2.9-1.9,5.5-3.9,7.9-6.1c2.4-2.2,4.6-4.4,6.5-6.6s3.7-4.4,5.2-6.5c1.5-2.1,2.8-4.1,3.8-5.8c1.8-3,3.5-6.3,4.8-9.9 s2.5-7.3,3.2-11.3s1.2-8,1.3-12.3c0.1-4.2-0.2-8.5-0.9-12.9c-0.7-4.3-1.8-8.2-3.4-11.7c-1.5-3.5-3.5-6.6-5.8-9.3 c-2.3-2.7-4.9-4.9-7.7-6.6s-6-3-9.3-3.7c-2.8-0.6-5.6-0.9-8.4-0.9s-5.5,0.4-8.1,1.2s-5,1.9-7.3,3.5c-2.2,1.6-4.2,3.6-5.8,6.1 c-1.2,1.9-2.1,4.1-2.5,6.5s-0.5,4.9-0.3,7.3c0.3,2.5,0.8,4.8,1.7,6.9c0.9,2.1,2.1,3.9,3.5,5.3c1.9,1.7,4.1,2.8,6.4,3.3 s4.6,0.5,6.8,0c2.2-0.5,4.2-1.4,5.8-2.7c1.6-1.3,2.8-2.8,3.4-4.6\"></path><path class=\"st0\" d=\"M28.8,268.6c3.9-8.1,7.7-15.1,11.4-21s7.4-11,11-15.3c3.6-4.3,7.1-7.9,10.6-11.1s6.9-5.9,10.4-8.4 c2.2-1.6,4.8-3.7,7.6-5.9c2.8-2.2,5.7-4.7,8.7-7.1c3-2.4,5.9-4.9,8.6-7.2c2.7-2.3,5.3-4.4,7.4-6.1c3.3-2.7,5.9-5.3,7.9-7.7 c1.9-2.4,3.2-4.8,3.9-7c0.7-2.3,0.8-4.4,0.5-6.5c-0.4-2.1-1.2-4.2-2.5-6.3\"></path><path class=\"st0\" d=\"M156.4,187.4c9.2-0.2,18,0.5,26.1,1.9c8.1,1.4,15.7,3.5,22.6,5.9c6.9,2.4,13.2,5.2,18.8,8 c5.6,2.8,10.6,5.7,14.8,8.2c4.7,2.9,9.1,6.1,13.2,9.2c4.1,3.2,8.1,6.3,12,9.1s7.9,5.3,12,7.1c4.1,1.8,8.5,3,13.2,3.2 c4.8,0.2,9-1,12.4-3.2c3.3-2.2,5.8-5.3,7.1-8.7c1.3-3.5,1.5-7.3,0.4-10.9s-3.7-7-7.9-9.7\"></path><path class=\"st0\" d=\"M152.5,82.8c-2.6-3.6-5.6-6.7-8.9-9.5c-3.3-2.7-6.9-5-10.9-7c-4-2-8.3-3.6-13-5c-4.7-1.4-9.8-2.6-15.4-3.6 c-3-0.6-5.9-1.2-8.7-1.8s-5.5-1.4-8-2.3c-2.5-0.9-4.8-1.9-6.9-3.1c-2.1-1.2-3.9-2.5-5.4-4c-1.5-1.5-2.6-3.3-3.3-5.2 c-0.8-1.9-1.2-3.9-1.4-6c-0.2-2,0-4,0.3-5.9c0.4-1.8,1-3.5,1.8-4.9c0.9-1.5,1.9-2.8,3.2-4c1.2-1.2,2.6-2.2,4.2-3 c1.5-0.8,3.2-1.4,4.9-1.7c1.7-0.3,3.5-0.4,5.4-0.2c2.1,0.2,4.2,1,6,2.1c1.8,1.1,3.3,2.6,4.4,4.3c1,1.7,1.6,3.5,1.5,5.5 s-0.9,3.9-2.6,5.8\"></path><path class=\"st0\" d=\"M473.2,618.8c2.6,0.8,5.3,1.6,8,2.4c2.7,0.7,5.5,1.3,8.2,1.8c2.8,0.4,5.5,0.7,8.2,0.8c2.7,0.1,5.4-0.1,8-0.5 c3-0.5,5.8-1.2,8.6-2.1c2.7-0.9,5.3-1.9,7.8-3.1c2.4-1.2,4.7-2.6,6.8-4.2c2.1-1.6,4-3.4,5.7-5.3c1.5-1.7,2.8-3.7,3.8-5.8 c1-2.1,1.9-4.3,2.4-6.5c0.6-2.2,0.9-4.5,0.9-6.6c0-2.2-0.2-4.3-0.8-6.3c-0.7-2.4-1.7-4.4-3.1-6.1c-1.3-1.7-3-3-4.9-3.9 c-1.9-1-3.9-1.5-6.1-1.8c-2.2-0.2-4.6-0.1-7,0.4\"></path><path class=\"st0\" d=\"M640.7,617.8c2.7-3.1,5.5-5.9,8.4-8.5c2.8-2.6,5.7-5,8.5-7.2c2.8-2.2,5.7-4.2,8.5-5.9s5.5-3.3,8.1-4.7 c1.7-0.9,3.6-1.9,5.7-2.8c2-1,4.2-2,6.5-2.9c2.3-1,4.6-1.9,7-2.7c2.4-0.8,4.9-1.6,7.5-2.2c3.5-0.8,7-1.5,10.5-2.2 c3.5-0.7,6.9-1.3,10.1-2c3.2-0.7,6.3-1.5,9-2.5c2.7-1,5.2-2.2,7.3-3.7c3.1-2.3,5.3-4.8,6.9-7.5c1.6-2.7,2.4-5.6,2.7-8.4 c0.3-2.8,0-5.6-0.6-8.1c-0.7-2.5-1.8-4.8-3.2-6.7\"></path><path class=\"st0\" d=\"M63.5,640.6c-3.5-2.7-6.4-5-8.7-7.1c-2.3-2.1-4.2-4.1-5.7-6s-2.6-3.8-3.6-5.9s-1.8-4.3-2.7-6.9 c-0.5-1.4-0.7-3.1-0.6-5c0-1.9,0.3-4,0.8-6s1.2-4.1,2.1-5.9c0.9-1.8,2-3.5,3.3-4.7c1.3-1.3,3-2.3,4.8-3c1.8-0.7,3.8-1.1,5.9-1.1 c2,0,4.1,0.3,6.1,0.9c2,0.7,3.9,1.7,5.5,3.1c1.8,1.5,3.1,3.3,4,5.2c0.9,1.9,1.3,4,1.3,6s-0.6,4-1.6,5.9c-1,1.8-2.5,3.5-4.5,4.9\"></path><path class=\"st0\" d=\"M102.3,557.4\"></path><path class=\"st0\" d=\"M285.5,517.1c3.8-1.5,8.2-2.7,12.9-3.7s9.7-1.6,14.8-1.9c5.1-0.3,10.3-0.3,15.3,0.1s10,1.1,14.6,2.2 c3.3,0.8,6.7,1.9,9.9,3.2c3.2,1.3,6.3,2.8,9.1,4.5c2.8,1.7,5.3,3.5,7.4,5.4c2.1,1.9,3.8,3.8,5,5.8c1.3,2.2,2.3,4.8,3,7.5 s1,5.6,0.9,8.3s-0.7,5.4-1.7,7.6s-2.7,4.2-4.8,5.5c-2.4,1.4-5.2,2.4-8,2.7c-2.8,0.3-5.6,0.1-8.1-0.9s-4.7-2.6-6.3-5 s-2.6-5.6-2.7-9.6\"></path><path class=\"st0\" d=\"M192.8,217.9c3.7,2,7.3,4.1,10.9,6.5s7,5,10.4,8s6.7,6.2,9.9,9.9c3.2,3.7,6.3,7.7,9.2,12.2 c1.2,1.8,2.4,4.2,3.4,6.9c1.1,2.8,2,5.9,2.6,9.2s1,6.7,0.8,10.1c-0.1,3.4-0.7,6.7-2,9.8c-0.8,2-1.9,4-3.2,5.7 c-1.3,1.7-2.8,3.2-4.5,4.4c-1.7,1.2-3.7,2.1-5.9,2.6c-2.2,0.5-4.6,0.6-7.2,0.2\"></path></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg>"

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		var scriptUrl;
/******/ 		if (__webpack_require__.g.importScripts) scriptUrl = __webpack_require__.g.location + "";
/******/ 		var document = __webpack_require__.g.document;
/******/ 		if (!scriptUrl && document) {
/******/ 			if (document.currentScript)
/******/ 				scriptUrl = document.currentScript.src
/******/ 			if (!scriptUrl) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				if(scripts.length) scriptUrl = scripts[scripts.length - 1].src
/******/ 			}
/******/ 		}
/******/ 		// When supporting browsers where an automatic publicPath is not supported you must specify an output.publicPath manually via configuration
/******/ 		// or pass an empty string ("") and set the __webpack_public_path__ variable from your code to use your own logic.
/******/ 		if (!scriptUrl) throw new Error("Automatic publicPath is not supported in this browser");
/******/ 		scriptUrl = scriptUrl.replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/");
/******/ 		__webpack_require__.p = scriptUrl;
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!*************************!*\
  !*** ./src/ts/index.ts ***!
  \*************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var css_null_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! css/null.scss */ "./src/css/null.scss");
/* harmony import */ var css_page1_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! css/page1.scss */ "./src/css/page1.scss");
/* harmony import */ var css_page2_scss__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! css/page2.scss */ "./src/css/page2.scss");
/* harmony import */ var css_mouse_scss__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! css/mouse.scss */ "./src/css/mouse.scss");
/* harmony import */ var css_pager_scss__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! css/pager.scss */ "./src/css/pager.scss");
/* harmony import */ var css_global_scss__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! css/global.scss */ "./src/css/global.scss");
/* harmony import */ var ts_setup__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ts/setup */ "./src/ts/setup.ts");







})();

/******/ })()
;
//# sourceMappingURL=bundle.js.map