import { TClassProperties } from '../typedefs';
import { BaseFilter } from './base_filter.class';
import { T2DPipelineState, TWebGLUniformLocationMap } from './typedefs';

/**
 * Saturate filter class
 * @example
 * var filter = new fabric.Image.Saturation({
 *   saturation: 1
 * });
 * object.filters.push(filter);
 * object.applyFilters();
 */
export class Saturation extends BaseFilter {
  /**
   * Saturation value, from -1 to 1.
   * Increases/decreases the color saturation.
   * A value of 0 has no effect.
   *
   * @param {Number} saturation
   * @default
   */
  saturation: number;

  /**
   * Apply the Saturation operation to a Uint8ClampedArray representing the pixels of an image.
   *
   * @param {Object} options
   * @param {ImageData} options.imageData The Uint8ClampedArray to be filtered.
   */
  applyTo2d({ imageData: { data } }: T2DPipelineState) {
    if (this.saturation === 0) {
      return;
    }
    const adjust = -this.saturation;
    for (let i = 0; i < data.length; i += 4) {
      const max = Math.max(data[i], data[i + 1], data[i + 2]);
      data[i] += max !== data[i] ? (max - data[i]) * adjust : 0;
      data[i + 1] += max !== data[i + 1] ? (max - data[i + 1]) * adjust : 0;
      data[i + 2] += max !== data[i + 2] ? (max - data[i + 2]) * adjust : 0;
    }
  }

  /**
   * Return WebGL uniform locations for this filter's shader.
   *
   * @param {WebGLRenderingContext} gl The GL canvas context used to compile this filter's shader.
   * @param {WebGLShaderProgram} program This filter's compiled shader program.
   */
  getUniformLocations(
    gl: WebGLRenderingContext,
    program: WebGLProgram
  ): TWebGLUniformLocationMap {
    return {
      uSaturation: gl.getUniformLocation(program, 'uSaturation'),
    };
  }

  /**
   * Send data from this filter to its shader program's uniforms.
   *
   * @param {WebGLRenderingContext} gl The GL canvas context used to compile this filter's shader.
   * @param {Object} uniformLocations A map of string uniform names to WebGLUniformLocation objects
   */
  sendUniformData(
    gl: WebGLRenderingContext,
    uniformLocations: TWebGLUniformLocationMap
  ) {
    gl.uniform1f(uniformLocations.uSaturation, -this.saturation);
  }
}

export const saturationDefaultValues: Partial<TClassProperties<Saturation>> = {
  type: 'Saturation',
  fragmentSource:
    'precision highp float;\n' +
    'uniform sampler2D uTexture;\n' +
    'uniform float uSaturation;\n' +
    'varying vec2 vTexCoord;\n' +
    'void main() {\n' +
    'vec4 color = texture2D(uTexture, vTexCoord);\n' +
    'float rgMax = max(color.r, color.g);\n' +
    'float rgbMax = max(rgMax, color.b);\n' +
    'color.r += rgbMax != color.r ? (rgbMax - color.r) * uSaturation : 0.00;\n' +
    'color.g += rgbMax != color.g ? (rgbMax - color.g) * uSaturation : 0.00;\n' +
    'color.b += rgbMax != color.b ? (rgbMax - color.b) * uSaturation : 0.00;\n' +
    'gl_FragColor = color;\n' +
    '}',
  saturation: 0,
  mainParameter: 'saturation',
};

Object.assign(Saturation.prototype, saturationDefaultValues);
