import { H, W, cellH, cellW, glyphBars, type HandCoinScene } from './handCoinScene'
import type { HandCoinRenderer, HandCoinSurface, HandCoinViewport } from './handCoinTypes'

// One instanced quad per cell. Animation runs in the vertex shader; the fragment
// shader draws the same pixel-snapped bitmap bars and alpha overlaps as Canvas 2D.
const vertexSource = `#version 300 es
precision highp float;
precision highp int;
layout(location = 0) in vec4 a_cell;
layout(location = 1) in vec4 a_light;
layout(location = 2) in float a_phase;
layout(location = 3) in vec4 a_one;
layout(location = 4) in vec4 a_top;
layout(location = 5) in vec4 a_bottom;
layout(location = 6) in vec4 a_left;
layout(location = 7) in vec4 a_right;
uniform vec2 u_size;
uniform vec2 u_scale;
uniform float u_offset;
uniform float u_time;
uniform vec4 u_palette[29];
uniform vec4 u_background[13];
flat out vec4 v_bars[5];
flat out vec4 v_first;
flat out vec4 v_second;
flat out ivec2 v_digits;

uint hashAt(uvec3 p) {
  uint h = p.x * 374761393u + p.y * 668265263u + p.z * 2246822519u;
  h = (h ^ (h >> 13u)) * 1274126177u;
  return h ^ (h >> 16u);
}
vec4 colorAt(int level) {
  return a_cell.z == 3.0 ? u_background[level] : u_palette[level];
}
void main() {
  vec2 origin = a_cell.xy * vec2(5.0, 6.25);
  v_bars = vec4[5](a_one, a_top, a_bottom, a_left, a_right);
  float t = u_time * 0.0007;
  float tw = t * 2.2, tb = t * 0.35;
  float ph = t * 0.375 + a_phase;
  uint cycle = uint(floor(ph));
  int d0 = hashAt(uvec3(a_cell.xy, cycle * 7u)) < 2147483648u ? 0 : 1;
  int d1 = hashAt(uvec3(a_cell.xy, cycle * 7u + 7u)) < 2147483648u ? 0 : 1;
  float f = fract(ph);
  float mixAmount = smoothstep(0.65, 1.0, f);
  float level;
  bool visible = a_cell.z > 0.0;
  if (a_cell.z == 3.0) {
    float field = 0.5 + 0.5 * sin(origin.x * 0.006 + tb + 0.8 * sin(origin.y * 0.004 - tb * 0.6))
      * (0.5 + 0.5 * cos(origin.y * 0.005 - tb * 0.8 + origin.x * 0.002));
    float density = 0.12 + 0.45 * field * field;
    float alpha = a_light.y;
    if (a_light.w < density) alpha = max(alpha, 0.02 + 0.06 * field * (0.5 + 0.5 * sin(a_light.z + tb * 2.0)));
    visible = visible && alpha >= 0.02;
    level = min(12.0, floor(alpha / 0.3 * 12.0 + 0.5));
  } else {
    float lum = a_cell.w;
    if (a_light.x < 0.5) {
      float rowWave = 0.6 * sin(origin.y * 0.02 + tw * 0.7);
      float shimmer = 0.5 + 0.5 * sin(origin.x * 0.045 - tw * 2.2 + rowWave)
        * (0.6 + 0.4 * sin(origin.x * 0.012 + tw * 0.9 + origin.y * 0.006));
      lum *= 0.7 + 0.8 * pow(shimmer, 1.6);
    } else lum *= 1.5;
    visible = visible && lum >= 0.05;
    level = floor(min(1.0, lum / 1.15) * 28.0 + 0.5);
  }
  v_digits = ivec2(d0, d1);
  v_first = vec4(0.0);
  v_second = vec4(0.0);
  if (visible) {
    if (d0 == d1 || mixAmount == 0.0) v_first = colorAt(int(level));
    else {
      int l0 = int(floor(level * (1.0 - mixAmount) + 0.5));
      int l1 = int(floor(level * mixAmount + 0.5));
      if (l0 > 0) v_first = colorAt(l0);
      if (l1 > 0) v_second = colorAt(l1);
      // Canvas flushes ascending colour levels, then ones before zeros.
      if (l0 > l1 || (l0 == l1 && d0 == 0)) {
        vec4 temp = v_first; v_first = v_second; v_second = temp;
        v_digits = ivec2(d1, d0);
      }
    }
  }
  vec2 corners[6] = vec2[6](vec2(0,0), vec2(1,0), vec2(0,1), vec2(0,1), vec2(1,0), vec2(1,1));
  vec2 pixel = floor((origin + corners[gl_VertexID] * vec2(5.0, 6.25)) * u_scale + 0.5);
  pixel.x -= u_offset;
  gl_Position = vec4(pixel / u_size * vec2(2.0, -2.0) + vec2(-1.0, 1.0), 0.0, 1.0);
}`

const fragmentSource = `#version 300 es
precision highp float;
precision highp int;
uniform vec2 u_size;
flat in vec4 v_bars[5];
flat in vec4 v_first;
flat in vec4 v_second;
flat in ivec2 v_digits;
out vec4 outColor;

bool bar(int index, vec2 pixel) {
  return all(greaterThanEqual(pixel, v_bars[index].xy)) && all(lessThan(pixel, v_bars[index].zw));
}
vec4 over(vec4 below, vec4 color) {
  return vec4(color.rgb * color.a, color.a) + below * (1.0 - color.a);
}
vec4 glyph(vec4 below, vec4 color, int digit, vec2 pixel) {
  if (color.a == 0.0) return below;
  if (digit == 1) {
    if (bar(0, pixel)) below = over(below, color);
  } else {
    if (bar(1, pixel) || bar(2, pixel)) below = over(below, color);
    if (bar(3, pixel) || bar(4, pixel)) below = over(below, color);
  }
  return below;
}
void main() {
  vec2 pixel = vec2(gl_FragCoord.x, u_size.y - gl_FragCoord.y);
  outColor = glyph(glyph(vec4(0.0), v_first, v_digits.x, pixel), v_second, v_digits.y, pixel);
}`

export function createHandCoinWebGL(canvas: HandCoinSurface, scene: HandCoinScene): HandCoinRenderer | null {
  const gl = canvas.getContext('webgl2', { alpha: true, antialias: false, depth: false, stencil: false, premultipliedAlpha: true }) as WebGL2RenderingContext | null
  if (!gl) return null
  const shaders: WebGLShader[] = []
  const program = gl.createProgram()
  const buffer = gl.createBuffer()
  const vao = gl.createVertexArray()
  const dispose = () => {
    gl.deleteBuffer(buffer)
    gl.deleteVertexArray(vao)
    gl.deleteProgram(program)
    shaders.forEach(shader => gl.deleteShader(shader))
  }
  try {
    if (!program || !buffer || !vao) throw new Error('WebGL resources unavailable')
    for (const [type, source] of [[gl.VERTEX_SHADER, vertexSource], [gl.FRAGMENT_SHADER, fragmentSource]] as const) {
      const shader = gl.createShader(type)
      if (!shader) throw new Error('WebGL shader unavailable')
      shaders.push(shader)
      gl.shaderSource(shader, source)
      gl.compileShader(shader)
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(shader) || 'Shader compilation failed')
      gl.attachShader(program, shader)
    }
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program) || 'Shader linking failed')
    gl.useProgram(program)
    gl.bindVertexArray(vao)
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    const stride = 29;
    for (const [index, size, offset] of [[0, 4, 0], [1, 4, 4], [2, 1, 8], [3, 4, 9], [4, 4, 13], [5, 4, 17], [6, 4, 21], [7, 4, 25]]) {
      gl.enableVertexAttribArray(index)
      gl.vertexAttribPointer(index, size, gl.FLOAT, false, stride * 4, offset * 4)
      gl.vertexAttribDivisor(index, 1)
    }
    const colors = (palette: string[]) => new Float32Array(palette.flatMap(color => {
      const [r, g, b, a] = color.slice(5, -1).split(',').map(Number)
      return [r / 255, g / 255, b / 255, a]
    }))
    gl.uniform4fv(gl.getUniformLocation(program, 'u_palette[0]'), colors(scene.palette))
    gl.uniform4fv(gl.getUniformLocation(program, 'u_background[0]'), colors(scene.bgPal))
    const size = gl.getUniformLocation(program, 'u_size')
    const scale = gl.getUniformLocation(program, 'u_scale')
    const offset = gl.getUniformLocation(program, 'u_offset')
    const time = gl.getUniformLocation(program, 'u_time')
    let count = 0
    const resize = ({ width, height, sceneWidth, offsetX }: HandCoinViewport) => {
      if (canvas.width !== width) canvas.width = width
      if (canvas.height !== height) canvas.height = height
      gl.viewport(0, 0, width, height)
      gl.uniform2f(size, width, height)
      gl.uniform2f(scale, sceneWidth / W, height / H)
      gl.uniform1f(offset, offsetX)
      const first = Math.max(0, Math.floor(offsetX / sceneWidth * W / cellW))
      const last = Math.min(scene.cols, Math.ceil((offsetX + width) / sceneWidth * W / cellW))
      count = Math.max(0, last - first) * scene.rows
      const visible = new Float32Array(count * stride)
      const sx = sceneWidth / W, sy = height / H
      for (let row = 0; row < scene.rows; row++) {
        for (let col = first; col < last; col++) {
          const start = (row * (last - first) + col - first) * stride
          const k = row * scene.cols + col
          visible.set(scene.instances.subarray(k * 9, k * 9 + 9), start)
          for (let shape = 0; shape < glyphBars.length; shape++) {
            const [x, y, w, h] = glyphBars[shape]
            const left = Math.round((col * cellW + x) * sx)
            const top = Math.round((row * cellH + y) * sy)
            visible.set([left - offsetX, top,
              Math.max(left + 1, Math.round((col * cellW + x + w) * sx)) - offsetX,
              Math.max(top + 1, Math.round((row * cellH + y + h) * sy))], start + 9 + shape * 4)
          }
        }
      }
      gl.bufferData(gl.ARRAY_BUFFER, visible, gl.STATIC_DRAW)
    }
    return {
      backend: 'webgl2', resize, dispose,
      draw(elapsedMs) {
        gl.clear(gl.COLOR_BUFFER_BIT)
        gl.uniform1f(time, elapsedMs)
        gl.drawArraysInstanced(gl.TRIANGLES, 0, 6, count)
      },
    }
  } catch {
    dispose()
    return null
  }
}
