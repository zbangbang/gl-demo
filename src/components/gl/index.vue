<template>
  <div class="gl_content">
    <div class="left_btn">
      <div
        v-for="(item, index) in glBtnList"
        :key="index"
        :class="{ btn: true, btn_active: item.active }"
        @click.stop="chooseDrawItem(item, index)"
      >
        {{ item.label }}
      </div>
    </div>
    <!-- <div class="right_content"> -->
      <canvas class="right_content" id="webgl"></canvas>
    <!-- </div> -->
  </div>
</template>

<script>
import { mapState } from "vuex";
import axios from 'axios';
import { PointShader, TriangleShader, TriangleMatrixShader } from '@/utils/gl/point.js';
import Cuboid from '@/utils/cube/cuboid.js';
import Terrain from '@/utils/cube/terrain.js';

let canvas = null;
let gl = null;
export default {
  data() {
    return {
      glBtnList: [
        {
          label: "HelloPoint",
          value: "HelloPoint",
          active: false,
        },
        {
          label: "Triangle",
          value: "Triangle",
          active: false,
        },
        {
          label: "Triangle_Matrix",
          value: "Triangle_Matrix",
          active: false,
        },
        {
          label: "Cuboid",
          value: "Cuboid",
          active: false,
        },
        {
          label: "Terrain",
          value: "Terrain",
          active: false,
        },
      ],

      animation: null,

      // x,y轴旋转角度
      currentAngle: [0.0, 0.0],
      // 当前缩放比例
      curScale: 1.0,
    };
  },
  mounted() {
    canvas = document.getElementById('webgl');
    gl = canvas.getContext('webgl');
    gl.canvas.width = canvas.clientWidth
    gl.canvas.height = canvas.clientHeight
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
  },
  watch: {},
  methods: {
    // 选择按钮
    chooseDrawItem(item, index) {
      this.clearAll();
      if (item.active) {
        item.active = false;
        return;
      } else {
        this.glBtnList.forEach(btn => btn.active = false);
        item.active = true;
      }

      switch (item.value) {
        case 'HelloPoint':
          this.drawOrRemoveHelloPoint()
          break;
        case 'Triangle':
          this.drawOrRemoveTriangle()
          break;
        case 'Triangle_Matrix':
          this.drawOrRemoveTriangleMatrix()
          break;
        case 'Cuboid':
          this.drawCuboid()
          break;
        case 'Terrain':
          this.drawTerrain()
          break;
      
        default:
          break;
      }
    },

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

    clearAll() {
      cancelAnimationFrame(this.animation)
      this.animation = null
      gl.clearColor(1.0, 1.0, 1.0, 1.0);
      gl.clear(gl.COLOR_BUFFER_BIT);
    },

    // 点
    drawOrRemoveHelloPoint() {
      let program = this.initShaders(gl, PointShader.vertexShaderSource, PointShader.fragmentShaderSource)
      if (!program) {
        this.$message.warning('初始化shaders失败');
        return;
      }

      // 位置
      let a_Position = gl.getAttribLocation(program, 'a_Position')
      gl.vertexAttrib3f(a_Position, 0.5, 0.5, 0.0)

      let u_FragColor = gl.getUniformLocation(program, 'u_FragColor')
      gl.uniform4f(u_FragColor, 0.0, 0.8, 0.0, 1.0)

      // gl.clearColor(1.0, 1.0, 1.0, 1.0);
      // gl.clear(gl.COLOR_BUFFER_BIT);
      let y = 0;
      let draw = () => {
        y += 0.001
        let a_Position = gl.getAttribLocation(program, 'a_Position')
        gl.vertexAttrib3f(a_Position, 0.5, y, 0.0)
        this.animation = requestAnimationFrame(draw)
        gl.drawArrays(gl.POINTS, 0, 1);
      }
      draw()
      // gl.drawArrays(gl.POINTS, 0, 1);
    },

    // 绘制三角形
    drawOrRemoveTriangle() {
      let program = this.initShaders(gl, TriangleShader.vertexShaderSource, TriangleShader.fragmentShaderSource)
      if (!program) {
        this.$message.warning('初始化shaders失败');
        return;
      }

      // 位置
      let verticesAndColor = new Float32Array([
        0, 0.5, 0.0, 0.0, 1.0, 1.0,
        -0.5, -0.5, 0.0, 1.0, 0.0, 1.0,
        0.5, -0.5, 1.0, 0.0, 0.0, 1.0,
      ])

      // 数组中每个元素的字节数
      const FSIZE = verticesAndColor.BYTES_PER_ELEMENT;

      let a_Position = gl.getAttribLocation(program, 'a_Position')
      let vertexBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
      gl.bufferData(gl.ARRAY_BUFFER, verticesAndColor, gl.STATIC_DRAW)
      gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 6 * FSIZE, 0)
      gl.enableVertexAttribArray(a_Position)

      // 颜色
      let a_Color = gl.getAttribLocation(program, 'a_Color')
      // let colorBuffer = gl.createBuffer()
      // gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer)
      // gl.bufferData(gl.ARRAY_BUFFER, verticesAndColor, gl.STATIC_DRAW)
      gl.vertexAttribPointer(a_Color, 4, gl.FLOAT, false, 6 * FSIZE, 2 * FSIZE)
      gl.enableVertexAttribArray(a_Color)

      // 指定清空<canvas>的颜色
      gl.clearColor(0.0, 0.0, 0.0, 1.0);
      // 清空<canvas>
      gl.clear(gl.COLOR_BUFFER_BIT);
      // 绘制三角形
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    },

    // 绘制空间中多个三角形
    drawOrRemoveTriangleMatrix() {
      let program = this.initShaders(gl, TriangleMatrixShader.vertexShaderSource, TriangleMatrixShader.fragmentShaderSource)
      if (!program) {
        this.$message.warning('初始化shaders失败');
        return;
      }

      let verticesAndColor = new Float32Array([
        2.0, 0.0, 0.0, 0.4, 1.0, 0.4,
        5.0, 0.0, 0.0, 0.4, 1.0, 0.4,
        3.0, 4.0, 0.0, 1.0, 0.4, 0.4,

        1.0, 0.0, -1.0, 1.0, 1.0, 0.4,
        4.0, 0.0, -1.0, 1.0, 1.0, 0.4,
        2.0, 4.0, -1.0, 1.0, 0.4, 0.4,

        0.0, 0.0, -2.0, 0.4, 0.4, 1.0,
        3.0, 0.0, -2.0, 0.4, 0.4, 1.0,
        1.0, 4.0, -2.0, 1.0, 0.4, 0.4

        // 0.0, 1.0, -4.0, 0.4, 1.0, 0.4,  //绿色在后
        // -0.5, -1.0, -4.0, 0.4, 1.0, 0.4,
        // 0.5, -1.0, -4.0, 1.0, 0.4, 0.4,

        // 0.0, 1.0, -2.0, 1.0, 1.0, 0.4, //黄色在中
        // -0.5, -1.0, -2.0, 1.0, 1.0, 0.4,
        // 0.5, -1.0, -2.0, 1.0, 0.4, 0.4,

        // 0.0, 1.0, 0.0, 0.4, 0.4, 1.0,  //蓝色在前
        // -0.5, -1.0, 0.0, 0.4, 0.4, 1.0,
        // 0.5, -1.0, 0.0, 1.0, 0.4, 0.4,
      ])
      let FSIZE = verticesAndColor.BYTES_PER_ELEMENT

      let a_Position = gl.getAttribLocation(program, 'a_Position')
      let vertexBuffer = gl.createBuffer()
      gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
      gl.bufferData(gl.ARRAY_BUFFER, verticesAndColor, gl.STATIC_DRAW)
      gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 6 * FSIZE, 0)
      gl.enableVertexAttribArray(a_Position)
      
      let a_Color = gl.getAttribLocation(program, 'a_Color')
      // let colorBuffer = gl.createBuffer()
      // gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer)
      // gl.bufferData(gl.ARRAY_BUFFER, verticesAndColor, gl.STATIC_DRAW)
      gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, 6 * FSIZE, 3 * FSIZE)
      gl.enableVertexAttribArray(a_Color)

      gl.bindBuffer(gl.ARRAY_BUFFER, null)

      this.setMVPMatrix(program)

      gl.clearColor(1.0, 1.0, 1.0, 1.0)
      gl.enable(gl.DEPTH_TEST)
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
      gl.drawArrays(gl.TRIANGLES, 0, 9)
    },
    setMVPMatrix(program) {
      let u_MvpMatrix = gl.getUniformLocation(program, 'u_MvpMatrix')

      // 模型矩阵
      let modelMatrix = new Matrix4();
      modelMatrix.setTranslate(0.75, 0, 0)

      // 视图矩阵
      let viewMatrix = new Matrix4();
      viewMatrix.setLookAt(0, 0, 15, 0, 0, -100, 0, 1, 0)

      // 投影矩阵
      let projMatrix = new Matrix4();
      projMatrix.setPerspective(30, canvas.width / canvas.height, 1, 100)

      // MVP矩阵
      let mvpMatrix = new Matrix4();
      mvpMatrix.set(projMatrix).multiply(viewMatrix).multiply(modelMatrix)

      gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements)
    },

    // 矩形
    drawCuboid() {
      let program = this.initShaders(gl, TriangleMatrixShader.vertexShaderSource, TriangleMatrixShader.fragmentShaderSource)
      if (!program) {
        this.$message.warning('初始化shaders失败');
        return;
      }

      let cuboid = new Cuboid(399589.072, 400469.072, 3995118.062, 3997558.062, 732, 1268)
      let n = this.initVertex(program, cuboid)

      // 鼠标监听
      this.initEventHandler()

      gl.enable(gl.DEPTH_TEST)

      let draw = () => {
        this.setMVPMatrixMutiple(program, cuboid)
        //清空颜色和深度缓冲区
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0)
        requestAnimationFrame(draw)
      }

      draw()
    },
    initEventHandler() {
      let dragging = false
      let lastX = -1
      let lastY = -1

      canvas.onmousedown = ev => {
        let x = ev.clientX
        let y = ev.clientY
        let rect = ev.target.getBoundingClientRect()
        if (rect.left <= x && x < rect.right && rect.top <= y && y < rect.bottom) {
          lastX = x
          lastY = y
          dragging = true
        }
      }

      canvas.onmouseleave = ev => {
        dragging = false
      }
      canvas.onmouseup = ev => {
        dragging = false
      }

      canvas.onmousemove = ev => {
        let x = ev.clientX
        let y = ev.clientY

        if (dragging) {
          let factor = 100 / canvas.height
          let dx = factor * (x - lastX)
          let dy = factor * (y - lastY)
          this.currentAngle[0] += dy
          this.currentAngle[1] += dx
        }
        lastX = x
        lastY = y
      }

      canvas.onmousewheel = ev => {
        if (ev.wheelDelta > 0) {
          this.curScale *= 1.1
        } else {
          this.curScale *= 0.9
        }
      }
    },
    // 初始化矩形顶点和片元
    initVertex(program, cuboid) {
      let vertexAndColor = new Float32Array([
        cuboid.maxX, cuboid.maxY, cuboid.maxZ, 1.0, 1.0, 1.0,  // v0 White
        cuboid.minX, cuboid.maxY, cuboid.maxZ, 1.0, 0.0, 1.0,  // v1 Magenta
        cuboid.minX, cuboid.minY, cuboid.maxZ, 1.0, 0.0, 0.0,  // v2 Red
        cuboid.maxX, cuboid.minY, cuboid.maxZ, 1.0, 1.0, 0.0,  // v3 Yellow
        cuboid.maxX, cuboid.minY, cuboid.minZ, 0.0, 1.0, 0.0,  // v4 Green
        cuboid.maxX, cuboid.maxY, cuboid.minZ, 0.0, 1.0, 1.0,  // v5 Cyan
        cuboid.minX, cuboid.maxY, cuboid.minZ, 0.0, 0.0, 1.0,  // v6 Blue
        cuboid.minX, cuboid.minY, cuboid.minZ, 1.0, 0.0, 1.0   // v7 Black
      ])

      let indices = new Uint8Array([
        0, 1, 2, 0, 2, 3,
        0, 3, 4, 0, 4, 5,    // 右
        0, 5, 6, 0, 6, 1,    // 上
        1, 6, 7, 1, 7, 2,    // 左
        7, 4, 3, 7, 3, 2,    // 下
        4, 7, 6, 4, 6, 5     // 后
      ])

      const FSIZE = vertexAndColor.BYTES_PER_ELEMENT;

      let a_Position = gl.getAttribLocation(program, 'a_Position')
      let a_Color = gl.getAttribLocation(program, 'a_Color')

      let vertexColorBuffer = gl.createBuffer()
      gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer)
      gl.bufferData(gl.ARRAY_BUFFER, vertexAndColor, gl.STATIC_DRAW)
      gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 6, 0)
      gl.enableVertexAttribArray(a_Position)

      gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3)
      gl.enableVertexAttribArray(a_Color)

      let indexBuffer = gl.createBuffer()
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW)

      return indices.length
    },
    setMVPMatrixMutiple(program, cuboid) {
      let u_MvpMatrix = gl.getUniformLocation(program, 'u_MvpMatrix')

      // 模型矩阵
      let modelMatrix = new Matrix4();
      modelMatrix.scale(this.curScale, this.curScale, this.curScale)
      modelMatrix.rotate(this.currentAngle[0], 1.0, 0.0, 0.0)
      modelMatrix.rotate(this.currentAngle[1], 0.0, 1.0, 0.0)
      modelMatrix.translate(-cuboid.CenterX(), -cuboid.CenterY(), -cuboid.CenterZ())

      let fovy = 60
      let near = 1
      // 视图矩阵
      let angle = fovy / 2 * Math.PI / 180
      let eyeHeight = cuboid.LengthY() * 1.2 / 2.0 / angle
      let viewMatrix = new Matrix4();
      viewMatrix.setLookAt(0, 0, eyeHeight, 0, 0, 0, 0, 1, 0)

      // 投影矩阵
      let projMatrix = new Matrix4();
      projMatrix.setPerspective(fovy, canvas.width / canvas.height, 1, 10000)

      // MVP矩阵
      let mvpMatrix = new Matrix4();
      mvpMatrix.set(projMatrix).multiply(viewMatrix).multiply(modelMatrix)

      gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements)
    },

    // 绘制地形
    drawTerrain() {
      let program = this.initShaders(gl, TriangleMatrixShader.vertexShaderSource, TriangleMatrixShader.fragmentShaderSource)
      if (!program) {
        this.$message.warning('初始化shaders失败');
        return;
      }

      gl.enable(gl.DEPTH_TEST)

      axios.get('/dem/DEM.dem').then(res => {
        let terrain = new Terrain()
        if (!this.readDEMFile(res.data, terrain)) {
          this.$message.error('文件读取错误')
          return
        }

        this.onDraw(program, terrain)
      })
    },
    onDraw(program, terrain) {
      let n = this.initTerrainVertex(program, terrain)

      this.initEventHandler()

      let tick = () => {
        this.setMVPMatrixMutiple(program, terrain.cuboid)

        //清空颜色和深度缓冲区
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_SHORT, 0)

        requestAnimationFrame(tick)
      }

      tick()
    },
    initTerrainVertex(program, terrain) {
      let col = terrain.col
      let row = terrain.row
      let indices = new Uint16Array((row - 1) * (col - 1) * 6)

      let rc = 0
      for (let r = 0; r < row - 1; r++) {
        for (let c = 0; c < col -1; c++) {
          indices[rc * 6] = r * col + c
          indices[rc * 6 + 1] = (r + 1) * col + c
          indices[rc * 6 + 2] = r * col + c + 1
          indices[rc * 6 + 3] = (r + 1) * col + c
          indices[rc * 6 + 4] = (r + 1) * col + c + 1
          indices[rc * 6 + 5] = r * col + c + 1
          rc++
        }
      }

      let vertexAndColor = terrain.verticesColors
      const FSIZE = vertexAndColor.BYTES_PER_ELEMENT;

      let a_Position = gl.getAttribLocation(program, 'a_Position')
      let a_Color = gl.getAttribLocation(program, 'a_Color')

      let vertexColorBuffer = gl.createBuffer()
      gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer)
      gl.bufferData(gl.ARRAY_BUFFER, vertexAndColor, gl.STATIC_DRAW)
      gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 6, 0)
      gl.enableVertexAttribArray(a_Position)

      gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3)
      gl.enableVertexAttribArray(a_Color)

      let indexBuffer = gl.createBuffer()
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW)

      return indices.length
    },
    readDEMFile(result, terrain) {
      let stringlines = result.split("\n");
      if (!stringlines || stringlines.length <= 0) {
        return false;
      }

      //读取头信息
      let subline = stringlines[0].split("\t");
      if (subline.length != 6) {
        return false;
      }
      let col = parseInt(subline[4]);       //DEM宽
      let row = parseInt(subline[5]);      //DEM高
      let verticeNum = col * row;
      if (verticeNum + 1 > stringlines.length) {
        return false;
      }
      terrain.setWH(col, row);

      //读取点信息
      let ci = 0;
      terrain.verticesColors = new Float32Array(verticeNum * 6);
      for (let i = 1; i < stringlines.length; i++) {
        if (!stringlines[i]) {
          continue;
        }

        let subline = stringlines[i].split(',');
        if (subline.length != 9) {
          continue;
        }

        for (let j = 0; j < 6; j++) {
          terrain.verticesColors[ci] = parseFloat(subline[j]);
          ci++;
        }
      }

      if (ci !== verticeNum * 6) {
        return false;
      }

      //包围盒
      let minX = terrain.verticesColors[0];
      let maxX = terrain.verticesColors[0];
      let minY = terrain.verticesColors[1];
      let maxY = terrain.verticesColors[1];
      let minZ = terrain.verticesColors[2];
      let maxZ = terrain.verticesColors[2];
      for (let i = 0; i < verticeNum; i++) {
        minX = Math.min(minX, terrain.verticesColors[i * 6]);
        maxX = Math.max(maxX, terrain.verticesColors[i * 6]);
        minY = Math.min(minY, terrain.verticesColors[i * 6 + 1]);
        maxY = Math.max(maxY, terrain.verticesColors[i * 6 + 1]);
        minZ = Math.min(minZ, terrain.verticesColors[i * 6 + 2]);
        maxZ = Math.max(maxZ, terrain.verticesColors[i * 6 + 2]);
      }

      terrain.cuboid = new Cuboid(minX, maxX, minY, maxY, minZ, maxZ);

      return true;
    }
  }
};
</script>

<style lang="less" scoped>
.gl_content {
  width: 80%;
  height: 80%;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border: 1px solid;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;

  .left_btn {
    flex: 1;
    height: 100%;
    // border: 1px solid;
    margin-right: 15px;

    display: flex;
    flex-flow: column nowrap;
    justify-content: flex-start;
    align-items: center;

    .btn {
      padding: 5px 8px;
      border: 1px solid #666;
      border-radius: 10px;
      margin: 10px 0;

      &:hover {
        cursor: pointer;
      }
    }

    .btn_active {
      color: #fff;
      background: #981a00;
    }
  }

  .right_content {
    // flex: 1;
    width: 1200px;
    height: 100%;
    border: 1px solid;
  }
}
</style>