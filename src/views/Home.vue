<template>
  <div>
    <div class="menu">
      <div class="menu_item"
           v-for="(item, index) in menuList"
           :key="index"
           :class="{ bg: item.active }"
           @click.stop="changeMenu(item)">{{item.label}}</div>
    </div>
    <!-- gl组件 -->
    <gl v-if="glShow"></gl>
    <three v-if="threeShow"></three>
    <!-- <gl-new v-if="glNewShow"></gl-new> -->
    <glNew v-if="glNewShow"></glNew>
    <glTex v-if="glTexShow"></glTex>
    <Plane v-if="planeShow"></Plane>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import gl from '@/components/gl/index.vue';
import three from '@/components/three/index.vue';
import glNew from '@/components/glNew/index.vue';
import glTex from '@/components/glTex/index.vue';
import Plane from '@/components/plane/index.vue';
export default {
  name: "Home",
  components: {
    gl,
    three,
    glNew,
    glTex,
    Plane,
  },
  data () {
    return {
      menuList: [
        {
          label: "webGL",
          value: "gl",
          active: false,
        },
        {
          label: "three",
          value: "three",
          active: false,
        },
        {
          label: "gl-new",
          value: "gl-new",
          active: false,
        },
        {
          label: "gl-tex",
          value: "gl-tex",
          active: false,
        },
        {
          label: "plane",
          value: "plane",
          active: false,
        },
      ],
    };
  },
  computed: {
    ...mapState({
      glShow: state => state.menu.glShow,
      threeShow: state => state.menu.threeShow,
      glNewShow: state => state.menu.glNewShow,
      glTexShow: state => state.menu.glTexShow,
      planeShow: state => state.menu.planeShow,
    }),
  },
  methods: {
    ...mapMutations({
      setAllFalse: 'setAllFalse',
      setGlShow: 'setGlShow',
      setThreeShow: 'setThreeShow',
      setGlNewShow: 'setGlNewShow',
      setGlTexShow: 'setGlTexShow',
      setPlaneShow: 'setPlaneShow',
    }),
    changeMenu (item) {
      this.setAllFalse()
      if (item.active) {
        item.active = false
      } else {
        this.menuList.forEach(menuItem => menuItem.active = false)
        item.active = true
      }

      switch (item.value) {
        case 'gl':
          this.setGlShow(item.active)
          break;
        case 'three':
          this.setThreeShow(item.active)
          break;
        case 'gl-new':
          this.setGlNewShow(item.active)
          break;
        case 'gl-tex':
          this.setGlTexShow(item.active)
          break;
        case 'plane':
          this.setPlaneShow(item.active)
          break;

        default:
          break;
      }
    }
  },
};
</script>

<style lang="less" scoped>
.menu {
  width: 80%;
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  margin: 15px 0;
  display: flex;

  .menu_item {
    min-width: 80px;
    min-height: 35px;
    margin: 0 10px;
    border-radius: 10px;
    background: rgba(0, 0, 0, 0.2);
    display: flex;
    justify-content: center;
    align-items: center;

    &:hover {
      cursor: pointer;
    }
  }
  .bg {
    color: #fff;
    background: #981a00;
  }
}
</style>