<template>
   <i-col span="10" class="sidebar">
    <top-menu></top-menu>
    <code-area></code-area>
    <bottom-menu></bottom-menu>
  </i-col>
</template>

<script>
import CodeArea from './Code.vue'
import TopMenu from './TopMenu.vue'
import BottomMenu from './BottomMenu.vue'

export default {
  name: 'Sidebar',
  components: {
    CodeArea,
    BottomMenu,
    TopMenu
  }
}
</script>

<style>
.sidebar {
  height: 100%;
}
</style>