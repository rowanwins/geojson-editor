<template>
   <i-col span="14" class="mapContainer">
    <div id="map"></div>
  </i-col>
</template>

<script>
import {createMap} from './../controllers/leafletMap'

export default {
  name: 'LeafletMap',
  mounted () {
    createMap()
  }
}
</script>

<style>
.mapContainer{
  height: 100%;
}
#map {
  height: 100%;
  width: 100%;
  float: left;
}
</style>