export const Shader = {
  data() {
    return {
      // canvas
      canvas: null,
      // gl对象
      gl: null,
    }
  },
  mounted() {
    this.canvas = document.getElementById('webgl-new');
    this.gl = this.canvas.getContext('webgl');
  },
  methods: {
    initShaders(gl, vertexShaderSource, fragmentShaderSource) {
      //创建顶点着色器对象
      let vertexShader = gl.createShader(gl.VERTEX_SHADER);
      //创建片元着色器对象
      let fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

      //引入顶点、片元着色器源代码
      gl.shaderSource(vertexShader, vertexShaderSource)
      gl.shaderSource(fragmentShader, fragmentShaderSource)

      //编译顶点、片元着色器
      gl.compileShader(vertexShader);
      gl.compileShader(fragmentShader);

      //创建程序对象program
      let program = gl.createProgram();
      //附着顶点着色器和片元着色器到program
      gl.attachShader(program,vertexShader);
      gl.attachShader(program,fragmentShader);
      //链接program
      gl.linkProgram(program);
      //使用program
      gl.useProgram(program);

      return program
    },
  }
}