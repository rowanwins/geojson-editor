<template>
  <div v-if="selectedProperties !== null" class="featureProperties leaflet-bar">
    <h3>Feature Properties</h3>
    
  </div>
</template>

<script>
export default {
  name: 'Properties',
  computed: {
    selectedProperties: function () {
      return this.$store.state.selectedProperties
    }
  }
}
</script>

<style>
  .featureProperties{
    position: absolute;
    bottom: 30px;
    left: 10px;
    background-color: white;
    width: 300px;
    font-family: Arial;
    z-index: 10000;
    padding: 10px;
  }
</style>