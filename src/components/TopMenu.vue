<template>
  <Row class="topMenu">
        <Dropdown @on-click="handleClick" placement="bottom-start">
        <a href="javascript:void(0)">
          <Button class="topBtn">
            Fix Errors
            <Icon type="arrow-down-b"></Icon>
          </Button>
        </a>
        <DropdownMenu slot="list">
          <DropdownItem name="addMarks" :disabled="doesntRequireParseFixing">Fix Quotation Marks on Keys</DropdownItem>
          <DropdownItem name="fixWindingOrder" :disabled="doesntRequireWindingFixing">Fix Winding Order</DropdownItem>
        </DropdownMenu>
    </Dropdown>
    <Button class="topBtn right" @click="clearFeatures">
      Clear {{featureCount}} {{ featureCount > 1 ? 'features' : 'feature' }}
    </Button>
  </Row>
</template>

<script>
import rewind from '@turf/rewind'
export default {
  name: 'TopMenu',
  computed: {
    doesntRequireParseFixing () {
      return !this.$store.state.requiresParseFixing
    },
    doesntRequireWindingFixing () {
      return !this.$store.state.requiresWindingOrderFix
    },
    featureCount () {
      return this.$store.getters.featureCount
    }
  },
  methods: {
    clearFeatures: function () {
      this.$store.commit('setGeoJSON', {
        "type": "FeatureCollection",
        "features": []
      })
    },
    handleClick: function (e) {
      if (e === 'addMarks') this.addMarks()
      if (e === 'fixWindingOrder') this.fixWindingOrder()
    },
    addMarks: function () {
      var parsedJson = this.$store.state.geojson.replace(/(['"])?([a-zA-Z0-9_]+)(['"])?:([^\/])/g, '"$2":$4') //eslint-disable-line
      this.$store.commit('setRequiresParsingFix', false)
      this.$store.commit('setGeoJSON', parsedJson)
    },
    fixWindingOrder: function () {
      const newGeojson = rewind(JSON.parse(this.$store.state.geojson))
      this.$store.commit('setGeoJSON', newGeojson)
      this.$store.commit('setRequiresWindingOrderFix', false)
    }
  }
}
</script>

<style>
.topMenu{
  padding: 10px;
  background: #EF8354;
  width: 100%;
}
.topBtn {
  background-color: #4F5D75;
  color: white;
  border: none;
}
.right {
  float: right
}
</style>