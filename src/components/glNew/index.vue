<template>
  <div class="gl_content">
    <div class="left_btn">
      <div v-for="(item, index) in glBtnList"
          :key="index"
          :class="{ btn: true, btn_active: item.active }"
          @click.stop="chooseDrawItem(item, index)">
        {{ item.label }}
      </div>
    </div>
    <canvas class="right_content"
            id="webgl-new"></canvas>
  </div>
</template>

<script>
import { Shader } from "@/mixins/shaders.js"
import { TrangleShader } from '@/utils/gl/glNew.js';

export default {
  mixins: [Shader],
  data () {
    return {
      glBtnList: [
        {
          label: "Trangle",
          value: "Trangle",
          active: false,
        },
      ],

    };
  },
  mounted () {
    const gl = this.gl;
    // 纠正canvas画布的宽高
    webglUtils.resizeCanvasToDisplaySize(gl.canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  },
  watch: {},
  methods: {
    // 选择按钮
    chooseDrawItem (item, index) {
      this.clearAll();
      if (item.active) {
        item.active = false;
        return;
      } else {
        this.glBtnList.forEach(btn => btn.active = false);
        item.active = true;
      }

      switch (item.value) {
        case 'Trangle':
          this.drawTrangle()
          break;

        default:
          break;
      }
    },

    clearAll () {
      this.gl.clearColor(1.0, 1.0, 1.0, 1.0);
      this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    },

    // 绘制三角形
    drawTrangle () {
      const gl = this.gl
      let program = this.initShaders(gl, TrangleShader.vertexShaderSource, TrangleShader.fragmentShaderSource)

      let posArr = new Float32Array([
        0, -100,
        150, 125,
        -175, 100
      ])

      let matrix = m3.projection(gl.canvas.clientWidth, gl.canvas.clientHeight)
      matrix = m3.translate(matrix, 200, 150);
      matrix = m3.rotate(matrix, 0);
      matrix = m3.scale(matrix, 1, 1);
      let u_Matrix = gl.getUniformLocation(program, 'u_Matrix')
      gl.uniformMatrix3fv(u_Matrix, false, matrix)

      let a_Position = gl.getAttribLocation(program, 'a_Position')
      let posBuffer = gl.createBuffer()
      gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer)
      gl.bufferData(gl.ARRAY_BUFFER, posArr, gl.STATIC_DRAW)
      gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0)
      gl.enableVertexAttribArray(a_Position)

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 3)
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
    width: 100px;
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
    flex: 1;
    // height: 100%;
    border: 1px solid;
  }
}
</style>