<template>
   <a-layout id="components-layout-demo-custom-trigger" style="min-height: 100%">
      <SideMenu :menuData="sideMenuData"></SideMenu>
      <a-layout :style="{
         // minHeight: '100%',
         // minWidth: '1330px',
      }">
         <a-layout-content :style="{
            padding: '20px 20px 0px 20px',
            background: '#fff',
         }">

            <keep-alive :include='keepAliveList'>
               <router-view>
               </router-view>
            </keep-alive>

         </a-layout-content>
      </a-layout>
   </a-layout>
</template>

<script>
import SideMenu from '@/components/menu/SideMenu.vue'
export default {
   components: { SideMenu },
   data() {
      return {
         keepAliveList: ['eqTrain'],//给训练页面添加缓存
      }
   },
   watch: {
      menuData() { },
   },
   computed: {
      sideMenuData() {
         //过滤菜单路由
         let isDisplayRouter = this.$store.getters['setting/menuData'].filter(
            item => item.display !== false
         )
         // console.log(isDisplayRouter)
         return isDisplayRouter
      },
   },
   created() {
      console.log(this.$route);
   },
}
</script>

<style scoped lang="less">
.admin-layout {
   .side-menu {
      &.fixed-side {
         position: fixed;
         height: 100vh;
         left: 0;
         top: 0;
      }
   }
}

#components-layout-demo-custom-trigger .trigger {
   font-size: 18px;
   line-height: 64px;
   padding: 0 24px;
   cursor: pointer;
   transition: color 0.3s;
}

#components-layout-demo-custom-trigger .trigger:hover {
   color: #1890ff;
}

#components-layout-demo-custom-trigger .logo {
   height: 32px;
   background: rgba(255, 255, 255, 0.2);
   margin: 16px;
}
</style>
