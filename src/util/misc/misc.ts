//@ts-nocheck
import { fabric } from '../../../HEADER';
import { cos } from './cos';
import { sin } from './sin';
import { rotateVector, createVector, calcAngleBetweenVectors, getHatVector, getBisector } from './vectors';
import { degreesToRadians, radiansToDegrees } from './radiansDegreesConversion';
import { rotatePoint } from './rotatePoint';
import { getRandomInt, removeFromArray } from '../internals';
import { projectStrokeOnPoints } from './projectStroke';
import {
  transformPoint,
  invertTransform,
  composeMatrix,
  qrDecompose,
  calcDimensionsMatrix,
  calcRotateMatrix,
  multiplyTransformMatrices,
} from './matrix';
import { stylesFromArray, stylesToArray, hasStyleChanged } from './textStyles';
import { clone, extend } from '../lang_object';
import { createCanvasElement, createImage, copyCanvasElement, toDataURL } from './dom';
import { toFixed } from './toFixed';
import {
  matrixToSVG,
  parsePreserveAspectRatioAttribute,
  groupSVGElements,
  parseUnit,
  getSvgAttributes,
} from './svgParsing';
import { findScaleToFit, findScaleToCover } from './findScaleTo';
import { capValue } from './capValue';
import {
  saveObjectTransform,
  resetObjectTransform,
  addTransformToObject,
  applyTransformToObject,
  removeTransformFromObject,
  sizeAfterTransform,
} from './objectTransforms';
import { makeBoundingBoxFromPoints } from './boundingBoxFromPoints';
import {
  sendPointToPlane,
  transformPointRelativeToCanvas,
  sendObjectToPlane,
} from './planeChange';
import {
  camelize,
  capitalize,
  escapeXml,
  graphemeSplit,
} from '../lang_string';
import {
  getKlass,
  loadImage,
  enlivenObjects,
  enlivenObjectEnlivables,
} from './objectEnlive';
import {
  min,
  max,
} from '../lang_array';
import { pick } from './pick';
import {
  joinPath,
  parsePath,
  makePathSimpler,
  getSmoothPathFromPoints,
  getPathSegmentsInfo,
  getBoundsOfCurve,
  getPointOnPath,
  transformPath,
  getRegularPolygonPath,
} from '../path';
import { setStyle } from '../dom_style';
import { request } from '../dom_request';
import {
  isTouchEvent,
  getPointer,
  removeListener,
  addListener,
} from '../dom_event';
import {
  wrapElement,
  getScrollLeftTop,
  getElementOffset,
  getNodeCanvas,
  cleanUpJsdomNode,
  makeElementUnselectable,
  makeElementSelectable,
} from '../dom_misc';
import { isTransparent } from './isTransparent';
import { mergeClipPaths } from './mergeClipPaths';
import * as ease from '../anim_ease';
import { animateColor } from '../animate_color';
import {
  animate,
  requestAnimFrame,
  cancelAnimFrame,
} from '../animate';
import { createClass } from '../lang_class';
/**
 * @namespace fabric.util
 */
fabric.util = {
  cos,
  sin,
  rotateVector,
  createVector,
  calcAngleBetweenVectors,
  getHatVector,
  getBisector,
  degreesToRadians,
  radiansToDegrees,
  rotatePoint,
  // probably we should stop exposing this from the interface
  getRandomInt,
  removeFromArray,
  projectStrokeOnPoints,
  // matrix.ts file
  transformPoint,
  invertTransform,
  composeMatrix,
  qrDecompose,
  calcDimensionsMatrix,
  calcRotateMatrix,
  multiplyTransformMatrices,
  // textStyles.ts file
  stylesFromArray,
  stylesToArray,
  hasStyleChanged,
  object: {
    clone,
    extend,
  },
  createCanvasElement,
  createImage,
  copyCanvasElement,
  toDataURL,
  toFixed,
  matrixToSVG,
  parsePreserveAspectRatioAttribute,
  groupSVGElements,
  parseUnit,
  getSvgAttributes,
  findScaleToFit,
  findScaleToCover,
  capValue,
  saveObjectTransform,
  resetObjectTransform,
  addTransformToObject,
  applyTransformToObject,
  removeTransformFromObject,
  makeBoundingBoxFromPoints,
  sendPointToPlane,
  transformPointRelativeToCanvas,
  sendObjectToPlane,
  string: {
    camelize,
    capitalize,
    escapeXml,
    graphemeSplit,
  },
  getKlass,
  loadImage,
  enlivenObjects,
  enlivenObjectEnlivables,
  array: {
    min,
    max,
  },
  pick,
  joinPath,
  parsePath,
  makePathSimpler,
  getSmoothPathFromPoints,
  getPathSegmentsInfo,
  getBoundsOfCurve,
  getPointOnPath,
  transformPath,
  getRegularPolygonPath,
  request,
  setStyle,
  isTouchEvent,
  getPointer,
  removeListener,
  addListener,
  wrapElement,
  getScrollLeftTop,
  getElementOffset,
  getNodeCanvas,
  cleanUpJsdomNode,
  makeElementUnselectable,
  makeElementSelectable,
  isTransparent,
  sizeAfterTransform,
  mergeClipPaths,
  ease,
  animateColor,
  animate,
  requestAnimFrame,
  cancelAnimFrame,
  createClass,
};


/* Putting some tests here so i m sure i m in this build environemnt */

// NORMAL CLASSES

class testObject {
  constructor(opts) {
    Object.assign(this, opts);
  }
	type = 'fobject'
  prop = 'a string to log'
  log() {
    console.log(this.prop);
  }
}

class testRect extends testObject {
  constructor(opts = {}) {
    super(opts);
  }
	type = 'fRect'
  prop = 'a rect thing to log'
  height = 100
}

class testCube extends testRect {
  type = 'fCube'
  prop = 'a cuve thing to log'
  depth = 300

}

testCube.prototype.log = function() {
  console.log('mine');
}

// FUNCTION CLASSES WITHOUT MAGIC CREATE CLASS
// CALLSUPER IS NOT AVAILABLE


function funcObject (props) {
  Object.assign(this, props);
}

funcObject.prototype = {
	type: 'fobject',
  prop: 'a string to log',
  log() {
    console.log(this.prop);
  },
}

function funcRect (props) {
  Object.assign(this, props);
}

funcRect.prototype = {
	type: 'fRect',
  prop: 'a rect thing to log',
  height: 100,
  __proto__: funcObject.prototype,
}

function funcCube (props) {
  Object.assign(this, props);
}

funcCube.prototype = {
	type: 'fRect',
  prop: 'a cube thing to log',
  depth: 100,
  log() {
    console.log('a totally different log function')
  },
  __proto__: funcRect.prototype,
}

Object.assign(fabric, {
	testObject,
  testRect,
  testCube,
  funcObject,
  funcRect,
});
