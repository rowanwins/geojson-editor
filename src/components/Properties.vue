<template>
  <div v-if="selectedProperties !== null" class="featureProperties leaflet-bar">
    <h3 v-if="propertyKeys.length === 0">
      No properties on feature
    </h3>
    <Table v-else stripe :columns="cols" :data="tableProperties" />
  </div>
</template>

<script>
export default {
  name: 'Properties',
  data: function () {
    return {
      cols: [{
        title: 'Property',
        key: 'property'
      }, {
        title: 'Value',
        key: 'value'
      }]
    }
  },
  computed: {
    selectedProperties: function () {
      return this.$store.state.selectedProperties
    },
    propertyKeys: function () {
      return Object.keys(this.selectedProperties)
    },
    tableProperties: function () {
      return this.propertyKeys.map(key => {
        return {property: key, value: this.selectedProperties[key]}
      });
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
    max-height: 200px;
    overflow: auto;
  }
</style>
