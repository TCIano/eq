<template>
  <a-layout-sider v-if="isDev" v-model="collapsed" :trigger="null" collapsible width="200px">
    <!-- <div class="logo" /> -->
    <a-menu
        :defaultSelectedKeys="['menuData[0].name']"
        :selectedKeys="[$route.name]"
        mode="inline"
        theme="dark"
    >
      <a-menu-item v-for="item in menuData" :key="item.name">
        <router-link :to="item.path">
          <i :class="item.icon" class="iconfont"></i>
          <span>
                  {{ item.name }}
               </span>
        </router-link>
      </a-menu-item>
    </a-menu>
  </a-layout-sider>
</template>

<script>
export default {
  name: 'sideMenu',
  props: {
    menuData: {
      type: Array,
      required: true,
    },
    theme: {
      type: String,
      required: false,
      default: 'dark',
    },
  },
  data() {
    return {
      collapsed: false,
      isDev: process.env.NODE_ENV === 'development',
      // isDev: true,
    }
  },
  methods: {},
}
</script>

<style scoped>
.menu {
  padding: 16px 0;
}
</style>
