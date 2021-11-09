const TrangleShader = {
  vertexShaderSource:  `
    attribute vec2 a_Position;
    uniform mat3 u_Matrix;
    varying vec4 v_Color;
    void main() {
      gl_Position = vec4((u_Matrix * vec3(a_Position, 1)).xy, 0, 1);
      v_Color = gl_Position * 0.5 + 0.5;
    }
  `,
  fragmentShaderSource: `
    precision mediump float;
    varying vec4 v_Color;
    void main() {
      gl_FragColor = v_Color;
    }
  `
}

export { TrangleShader }