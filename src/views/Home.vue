<template>
<div>
  <div class="menu">
    <div
      class="menu_item"
      v-for="(item, index) in menuList"
      :key="index"
      :class="{ bg: item.active }"
      @click.stop="changeMenu(item)"
    >{{item.label}}</div>
  </div>
  <!-- gl组件 -->
  <gl  v-if="glShow"></gl>
  <three  v-if="threeShow"></three>
</div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import gl from '@/components/gl/index.vue';
import three from '@/components/three/index.vue';
export default {
  name: "Home",
  components: {
    gl,
    three
  },
  data() {
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
          label: "t2",
          value: "t2",
          active: false,
        },
      ],
    };
  },
  computed: {
    ...mapState({
      glShow: state => state.menu.glShow,
      threeShow: state => state.menu.threeShow,
    }),
  },
  methods: {
    ...mapMutations({
      setGlShow: 'setGlShow',
      setThreeShow: 'setThreeShow',
    }),
    changeMenu(item) {
      item.active = !item.active

      switch (item.value) {
        case 'gl':
          this.setGlShow(item.active)
          break;
        case 'three':
          this.setThreeShow(item.active)
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