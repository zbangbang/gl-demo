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
        20000
      );
      camera.position.set(300, 150, 500);

      var light = new THREE.PointLight( 0xff0000 );
      light.position.set( 1000, 1000, 1000 );
      scene.add(light)

      this.createPlane()

      // 控制
      controls = new OrbitControls(camera, renderer.domElement);
      controls.maxPolarAngle = Math.PI * 0.495;
      controls.target.set(0, 0, 0);
      controls.minDistance = 100.0;
      controls.maxDistance = 5000.0;
      controls.update();

      // 灯光
      this.initLights();
    },
    // ================== 灯光 =============================
    initLights() {
      scene.add(new THREE.AmbientLight(0x0c0c0c));
      //添加材质灯光阴影
      var spotLight1 = new THREE.SpotLight(0xffffff);
      spotLight1.position.set(-50, 100, 0);
      scene.add(spotLight1);

      var spotLight2 = new THREE.SpotLight(0xffffff);
      spotLight2.position.set(550, 500, 0);
      scene.add(spotLight2);

      var spotLight3 = new THREE.SpotLight(0xffffff);
      spotLight3.position.set(150, 50, -200);
      scene.add(spotLight3);

      var spotLight4 = new THREE.SpotLight(0xffffff);
      spotLight4.position.set(150, 50, 200);
      scene.add(spotLight4);

      var spotLight5 = new THREE.SpotLight(0xffffff);
      spotLight5.position.set(-500, 10, 0);
      scene.add(spotLight5);
    },

    createPlane() {
      // var geometry = new THREE.PlaneGeometry( 300, 300 );
      // var material = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
      // var plane = new THREE.Mesh( geometry, material );
      // scene.add( plane );

      let smokeTexture = new THREE.TextureLoader().load( "/textures/640.jpg" );

      const smokeMaterial = new THREE.MeshLambertMaterial({
        color: new THREE.Color(0x00dddd),
        map: smokeTexture,
        transparent: true,
      })
      
      const smokeGeo = new THREE.PlaneGeometry(100, 100)
      for (let p = 0; p < 10; p++) {
        const particle = new THREE.Mesh(smokeGeo, smokeMaterial)
        particle.position.set(Math.random() * 500 - 250, Math.random() * 500 - 250, Math.random() * 1000 - 100)
        particle.rotation.z = Math.random() * 360
        scene.add(particle)
        // smokeParticles.push(particle)
      }
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