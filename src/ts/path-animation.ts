import { sortBy } from "lodash";
import { mapclamp } from "ts/lib/lib";

let startTime: number;
let locked = true;
const ANIMATION_TIME = 5000;
const ANIMATION_TIMEOUT = 500;
const PATHS_LENGTH = 36;

interface Path {
  element: SVGPathElement;
  length: number;
}

let paths: Path[];

const init = (): void => {
  const els: (SVGLineElement | SVGPathElement)[] = [
    ...document.querySelectorAll(".hero-image path, .hero-image line"),
  ] as (SVGLineElement | SVGPathElement)[];
  paths = Array.from(els).map((path) => {
    const length = path.getTotalLength();
    path.style.strokeDasharray = length + " " + length;
    path.style.strokeDashoffset = "" + length;
    return {
      element: path,
      length,
    };
  });
  paths = sortBy(paths, (el: Path) => el.length).reverse();
};

const _update = (value: number): void => {
  paths.forEach((path) => {
    path.element.style.strokeDashoffset = (
      path.length *
      (1 - value)
    ).toString();
  });
};

const _update2 = (value: number): void => {
  const offset = 0.9 / PATHS_LENGTH;
  const maxOffset = offset * PATHS_LENGTH;
  paths.forEach((path, index) => {
    const offset = 0.01 * index;
    const val = mapclamp(value, offset, 1.0 - maxOffset + offset, 0, 1);
    path.element.style.strokeDashoffset = (path.length * (1 - val)).toString();
  });
};

const update = (value: number): void => {
  if (locked) return;
  _update(value);
};

const _run = (): Promise<void> => {
  return new Promise((resolve) => {
    locked = true;
    startTime = Date.now();
    const drawFrame = () => {
      const time = Date.now() - startTime;
      if (time > ANIMATION_TIME) {
        locked = false;
        return resolve();
      }
      const val = mapclamp(time, 200, ANIMATION_TIME, 0, 1);
      _update2(val);

      requestAnimationFrame(drawFrame);
    };
    _update2(0);
    drawFrame();
  });
};

const run = (): void => {
  setTimeout(_run, ANIMATION_TIMEOUT);
};

export default {
  init,
  update,
  run,
};
