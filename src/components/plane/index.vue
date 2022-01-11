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
    <div class="right_content" id="threeport">
    </div>
  </div>
</template>

<script>
import axios from 'axios';
// Threejs
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import { Water } from "three/examples/jsm/objects/Water.js";
import { Sky } from "three/examples/jsm/objects/Sky.js";
let scene, camera, renderer, controls, container, animationID;
let water, sun, modelMesh;
export default {
  data() {
    return {
      glBtnList: [
        {
          label: "地板",
          value: "plane",
          active: false,
        },
      ],

    };
  },
  mounted() {
    this.$nextTick(() => {
      if(scene) return;
      this.init();
      this.animate();
    });
  },
  beforeDestroy() {
    this.clearAll()
  },
  watch: {},
  methods: {
    // 选择按钮
    chooseDrawItem(item, index) {
      // this.clearAll()
      if (item.active) {
        item.active = false;
        return;
      } else {
        this.glBtnList.forEach(btn => btn.active = false);
        item.active = true;
      }

      switch (item.value) {
        case 'plane':
          
          break;
      
        default:
          break;
      }
    },
    clearAll() {
      if (!scene) return;
      scene.clear();
      scene = null;
      cancelAnimationFrame(animationID);
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.content = null;
      renderer.domElement = null;
      renderer = null;
    },

    // 加载模型
    init() {
      container = document.getElementById("threeport");

      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      container.appendChild(renderer.domElement);

      // 创建场景
      scene = new THREE.Scene();

      camera = new THREE.PerspectiveCamera(
        45,
        container.clientWidth / container.clientHeight,
        1,
        5000
      );
      camera.position.set(50, 100, 100);

      const ambientLight = new THREE.AmbientLight(0xffffff)
      scene.add(ambientLight)

      this.createPlane()

      // 控制
      controls = new OrbitControls(camera, renderer.domElement);
      controls.maxPolarAngle = Math.PI * 0.495;
      controls.target.set(0, 0, 0);
      controls.minDistance = 100.0;
      controls.maxDistance = 5000.0;
      controls.update();

    },

    createPlane() {
      var geometry = new THREE.PlaneGeometry( 100, 100, 50, 50 );
      var material = new THREE.MeshBasicMaterial( {color: 0xffff00, wireframe: true} );
      var plane = new THREE.Mesh( geometry, material );
      scene.add(plane);
    },

    onWindowResize() {
      camera.aspect = container.innerWidth / container.innerHeight;
      camera.updateProjectionMatrix();

      renderer.setSize(container.innerWidth, wcontainerindow.innerHeight);
    },

    animate() {
      animationID = requestAnimationFrame(this.animate);
      this.render();
    },

    render() {
      const time = performance.now() * 0.001;

      renderer.render(scene, camera);
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
    height: 100%;
    border: 1px solid;
  }
}
</style>