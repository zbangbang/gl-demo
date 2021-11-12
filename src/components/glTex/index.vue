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
            id="webgl-tex"></canvas>
  </div>
</template>

<script>
import { TexShader } from "@/mixins/texShaders.js"
import { TexCoordShader } from '@/utils/gl/glTex.js';

export default {
  mixins: [TexShader],
  data () {
    return {
      glBtnList: [
        {
          label: "TexCoord",
          value: "TexCoord",
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
        case 'TexCoord':
          this.drawTexCoord()
          break;

        default:
          break;
      }
    },

    clearAll () {
      this.gl.clearColor(1.0, 1.0, 1.0, 1.0);
      this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    },

    // 材质
    drawTexCoord() {
      const gl = this.gl
      let program = this.initShaders(gl, TexCoordShader.vertexShaderSource, TexCoordShader.fragmentShaderSource)

      let a_Position = gl.getAttribLocation(program, 'a_Position')
      let verticesSizes = new Float32Array([
        //四个顶点的位置和纹理数据
        -0.5, 0.5, -0.3, 1.7,
        -0.5, -0.5, -0.3, -0.2,
        0.5, 0.5, 1.7, 1.7,
        0.5, -0.5, 1.7, -0.2
        // -0.5, 0.5, 0.0, 1.0,
        // -0.5, -0.5, 0.0, 0.0,
        // 0.5, 0.5, 1.0, 1.0,
        // 0.5, -0.5, 1.0, 0.0
      ])

      let vertexSizeBuffer = gl.createBuffer()
      gl.bindBuffer(gl.ARRAY_BUFFER, vertexSizeBuffer)
      gl.bufferData(gl.ARRAY_BUFFER, verticesSizes, gl.STATIC_DRAW)
      let FSIZE = verticesSizes.BYTES_PER_ELEMENT
      gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 4, 0)
      gl.enableVertexAttribArray(a_Position)

      // 纹理
      let a_TexCoord = gl.getAttribLocation(program, 'a_TexCoord')
      gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT, false, FSIZE * 4, FSIZE * 2)
      gl.enableVertexAttribArray(a_TexCoord)

      this.initTexture(gl, program)
    },

    initTexture(gl, program) {
      let texture = gl.createTexture()

      let u_Sampler = gl.getUniformLocation(program, 'u_Sampler')
      let image = new Image()
      image.src = require('@/assets/images/sky.jpg')
      image.onload = () => {
        this.loadTexture(gl, texture, u_Sampler, image)
      }
    },
    loadTexture(gl, texture, u_Sampler, image) {
      // y轴反转，图片坐标系和gl坐标系不同
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1)
      // 开启0号纹理单元
      gl.activeTexture(gl.TEXTURE0)
      //绑定纹理数据
      gl.bindTexture(gl.TEXTURE_2D, texture)
      // 配置纹理参数
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
      // 配置纹理图像
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image)
      // 将0号纹理传递给着色器
      gl.uniform1i(u_Sampler, 0)

      gl.clearColor(0.0, 0.0, 0.0, 1.0)
      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
    },
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