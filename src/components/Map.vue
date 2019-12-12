<template>
  <i-col class="mapContainer" :xs="10" :sm="10" :md="14" :lg="14">
    <div id="map" />
  </i-col>
</template>

<script>
import { createMap } from './../controllers/leafletMap'

export default {
  name: 'LeafletMap',
  mounted () {
    createMap()
  }
}
</script>

<style>
.mapContainer {
  height: 100%;
}
#map {
  height: 100%;
  width: 100%;
  float: left;
}
</style>
