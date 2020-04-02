<template>
  <i-col class="sidebar" :xs="14" :sm="14" :md="10" :lg="10">
    <top-menu :loading-github-user="loadingGithubUser" />
    <code-area />
    <bottom-menu />
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
  },
  props: {
    loadingGithubUser: Boolean
  }
}
</script>

<style>
.sidebar {
  height: 100%;
}
</style>
