<template>
   <a-layout-sider v-model="collapsed" :trigger="null" width="200px" collapsible v-if="isDev">
      <!-- <div class="logo" /> -->
      <a-menu
         mode="inline"
         theme="dark"
         :defaultSelectedKeys="['menuData[0].name']"
         :selectedKeys="[$route.name]"
      >
         <a-menu-item v-for="item in menuData" :key="item.name">
            <router-link :to="item.path">
               <i class="iconfont" :class="item.icon"></i>
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
