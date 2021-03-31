import smoothShapes from "js/svg/smooth";

const RegEx = { seg: /[A-Za-z][^A-Za-z]+/g };

const loadSvg = function (data) {
  var element = document.createElement("div");
  element.innerHTML = data;
  const svg = element.firstChild;

  let shapes = collectData(svg);
  shapes = filterData(shapes);
  return smoothShapes(shapes);
};

const analyzeChunk = function (found, arr) {
  const operation = found[0];
  var d = found.slice(1);
  switch (operation) {
    case "M":
      return analyzeM(d, arr);
    case "c":
      return analyzeC(d, arr);
    case "s":
      return analyzeS(d, arr);
    case "S":
      return analyzeBigS(d, arr);
    case "C":
      return analyzeBigC(d, arr);
  }
};

const analyzeM = function (found, arr) {
  const [x, y] = found.split(",");
  console.assert(arr.length === 0);
  return { x: +x, y: +y };
};

function globalPreProcess(str) {
  str = str.replace(/\-/g, ",-");
  str = str.replace(/\s/g, "");
  return str;
}

function preprocess(found) {
  if (found[0] === ",") {
    found = found.slice(1);
  }
  return found;
}

const analyzeC = function (found, arr) {
  found = preprocess(found);
  const arr1 = found.split(",");
  let x = 0;
  let y = 0;
  x = +arr1[4];
  y = +arr1[5];
  const last = arr[arr.length - 1];
  x += last.x;
  y += last.y;
  return { x, y };
};

const analyzeS = function (found, arr) {
  found = preprocess(found);
  const arr1 = found.split(",");
  let x = 0;
  let y = 0;
  x = +arr1[2];
  y = +arr1[3];
  const last = arr[arr.length - 1];
  x += last.x;
  y += last.y;
  return { x, y };
};

const analyzeBigS = function (found, arr) {
  found = preprocess(found);
  const arr1 = found.split(",");
  let x = +arr1[2];
  let y = +arr1[3];
  return { x, y };
};

const analyzeBigC = function (found, arr) {
  found = preprocess(found);
  const arr1 = found.split(",");
  let x = +arr1[4];
  let y = +arr1[5];
  return { x, y };
};

function collectData(svg) {
  const result = [];

  const children = [].slice.call(svg.children);
  children.forEach((el) => {
    if (el.nodeName === "g") {
      const children1 = [].slice.call(el.children);
      children1.forEach((el1) => {
        const arr = [];
        let d = el1.getAttribute("d");
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
  return result.filter((el) => el.length > 2);
}

function filterData(shapes) {
  return shapes.map((el1, index) => {
    let lastpoint = null;
    return el1.filter((el2) => {
      if (!lastpoint) {
        lastpoint = el2;
        return;
      }
      let dist = Math.sqrt(
        Math.pow(el2.x - lastpoint.x, 2) + Math.pow(el2.y - lastpoint.y, 2)
      );
      if (dist < 2) {
        return false;
      }
      lastpoint = el2;
      return true;
    });
  });
}

export default loadSvg;
