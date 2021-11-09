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
let scene, camera, renderer, controls, container, animationID;
let glbModel,engineShip;
let clock, tuniform, water, sun, modelMesh;
// Threejs
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import { Water } from "three/examples/jsm/objects/Water.js";
import { Sky } from "three/examples/jsm/objects/Sky.js";
export default {
  data() {
    return {
      glBtnList: [
        {
          label: "hm模型",
          value: "hm_model",
          active: false,
        },
        {
          label: "jt模型",
          value: "jt_model",
          active: false,
        },
        {
          label: "dd模型",
          value: "dd_model",
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
        case 'hm_model':
          if (modelMesh) {
            scene.remove(modelMesh)
            modelMesh = null
          };
          this.loadHmModel()
          break;
        case 'jt_model':
          if (modelMesh) {
            scene.remove(modelMesh)
            modelMesh = null
          };
          this.loadJtModel()
          break;
        case 'dd_model':
          if (modelMesh) {
            scene.remove(modelMesh)
          };
          this.loadDdModel()
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
        55,
        container.clientWidth / container.clientHeight,
        1,
        20000
      );
      camera.position.set(30, 30, 100);

      //

      sun = new THREE.Vector3();
      // Water
      const waterGeometry = new THREE.PlaneGeometry(10000, 10000);
      water = new Water(waterGeometry, {
        textureWidth: 512,
        textureHeight: 512,
        waterNormals: new THREE.TextureLoader().load(
          "textures/waternormals.jpg",
          function (texture) {
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
          }
        ),
        sunDirection: new THREE.Vector3(),
        sunColor: 0xffffff,
        waterColor: 0x001e0f,
        distortionScale: 3.7,
        fog: scene.fog !== undefined,
      });
      water.rotation.x = -Math.PI / 2;
      scene.add(water);

      // Skybox
      const sky = new Sky();
      sky.scale.setScalar(10000);
      scene.add(sky);

      const parameters = {
        elevation: 2,
        azimuth: 180,
      };

      const pmremGenerator = new THREE.PMREMGenerator(renderer);
      function updateSun() {
        const phi = THREE.MathUtils.degToRad(90 - parameters.elevation);
        const theta = THREE.MathUtils.degToRad(parameters.azimuth);
        sun.setFromSphericalCoords(1, phi, theta);
        sky.material.uniforms["sunPosition"].value.copy(sun);
        water.material.uniforms["sunDirection"].value.copy(sun).normalize();
        scene.environment = pmremGenerator.fromScene(sky).texture;
      }

      updateSun();

      // 控制
      controls = new OrbitControls(camera, renderer.domElement);
      controls.maxPolarAngle = Math.PI * 0.495;
      controls.target.set(0, 10, 0);
      controls.minDistance = 400.0;
      controls.maxDistance = 2000.0;
      controls.update();

      // 灯光
      this.initLights();

      // let mtlLoader = new MTLLoader();
      // mtlLoader.setPath('gltf/ship/');
      // mtlLoader.load('engineShip.mtl', materials => {
      //   materials.preload();
      //   let objLoader = new OBJLoader();
      //   objLoader.setMaterials(materials);
      //   objLoader.setPath('gltf/ship/');
      //   objLoader.load('engineShip.obj', obj => {
      //     obj.position.x = -50;
      //     obj.position.z = -50;
      //     obj.position.y = 0;
      //     obj.scale.set(0.005, 0.005, 0.005);
      //     obj.name = 'engineShip';
      //     engineShip = obj
      //     scene.add(obj);
      //   }, undefined, error => {
      //     console.log('======error', error);
      //   })
      // })
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

      water.material.uniforms["time"].value += 5.0 / 60.0;
      renderer.render(scene, camera);
    },

    // 加载hm模型
    loadHmModel() {
      let stlLoader = new STLLoader();
      stlLoader.load('stl/LiaoNingHaoHangMu.stl', geometry => {
        const material = new THREE.MeshPhongMaterial({ color: 0xcccccc, specular: 0x111111 });
        modelMesh = new THREE.Mesh( geometry, material );

        modelMesh.position.set( 0, 35, 0 );
        modelMesh.rotation.set( -Math.PI / 2, 0, 0 );
        modelMesh.scale.set( 5, 5, 5 );

        modelMesh.castShadow = true;
        modelMesh.receiveShadow = true;

        scene.add( modelMesh );
      })
    },

    // 加载jt模型
    loadJtModel() {
      let stlLoader = new STLLoader();
      stlLoader.load('stl/POLA_QuZhuJian.stl', geometry => {
        const material = new THREE.MeshPhongMaterial({ color: 0xcccccc, specular: 0x111111 });
        modelMesh = new THREE.modelMesh( geometry, material );

        modelMesh.position.set( 0, 35, 0 );
        modelMesh.rotation.set( -Math.PI / 2, 0, 0 );
        modelMesh.scale.set( 5, 5, 5 );

        modelMesh.castShadow = true;
        modelMesh.receiveShadow = true;

        scene.add( modelMesh );
      })
    },

    // 加载dd模型
    loadDdModel() {
      console.log('加载dd模型');
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