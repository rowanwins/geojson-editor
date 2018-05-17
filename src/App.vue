<template>
  <Row id="app">
    <Map/>
    <Sidebar/>
  </Row>
</template>

<script>
import Map from './components/Map.vue'
import Sidebar from './components/Sidebar.vue'
import Properties from './components/Properties.vue'
import store from './store'

export default {
  name: 'app',
  store: store,
  components: {
    Map,
    Sidebar,
    Properties
  }
}
</script>

<style>

html, body, #app {
  margin: 0px;
  width: 100%;
  height: 100%;
}
</style>
