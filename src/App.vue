<template>
  <Row id="app">
    <Map />
    <Sidebar />
    <Properties />
  </Row>
</template>

<script>
import Map from './components/Map.vue'
import Sidebar from './components/Sidebar.vue'
import Properties from './components/Properties.vue'
import store from './store'

export default {
  name: 'App',
  store: store,
  components: {
    Map,
    Sidebar,
    Properties
  },
  mounted: function () {
    let params = (new URL(document.location)).searchParams;
    let data = params.get("data");
    if (data) {
      let prettyGeojsonString = JSON.stringify(JSON.parse(data), null, 2)
      this.$store.commit('setGeoJSON', prettyGeojsonString)
    }
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
