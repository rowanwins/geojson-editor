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
  },
  mounted: function () {
    let params = (new URL(document.location)).searchParams;
    let data = params.get("data");
    let geojson = JSON.parse(data)

    this.$store.commit('setGeoJSON', JSON.stringify(geojson, null, 2))
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
