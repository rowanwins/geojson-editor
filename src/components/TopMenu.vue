<template>
  <Row class="topMenu">
    <Dropdown placement="bottom-start" @on-click="handleFixClick">
      <a href="javascript:void(0)">
        <Button class="topBtn">
          Fix Errors <Icon type="arrow-down-b" />
        </Button>
      </a>
      <DropdownMenu slot="list">
        <DropdownItem name="addMarks" :disabled="doesntRequireParseFixing">
          Fix Quotation Marks on Keys
        </DropdownItem>
        <DropdownItem name="fixWindingOrder" :disabled="doesntRequireWindingFixing">
          Fix Winding Order
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
    <Dropdown placement="bottom-start" @on-click="handleToolClick">
      <a href="javascript:void(0)">
        <Button class="topBtn">
          Tools <Icon type="arrow-down-b" />
        </Button>
      </a>
      <DropdownMenu slot="list">
        <DropdownItem name="createRandomPoints">
          Create Random Points
        </DropdownItem>
        <DropdownItem name="zoomTo">
          Zoom to Features
        </DropdownItem>
        <DropdownItem name="multipartToSinglepart">
          Convert Multipart to Singlepart geometries
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
    <Button class="topBtn right" @click="clearFeatures">
      Clear {{ featureCount }} {{ featureCount !== 1 ? 'features' : 'feature' }}
    </Button>
  </Row>
</template>

<script>
import rewind from '@turf/rewind'
import flatten from '@turf/flatten'
import {randomPoint} from '@turf/random'

import { zoomToFeatures } from '../controllers/leafletMap'
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
    },
    currentGeojson () {
      return this.$store.getters.geojson
    }
  },
  methods: {
    clearFeatures: function () {
      this.$store.commit('setGeoJSON', {
        "type": "FeatureCollection",
        "features": []
      })
    },
    handleFixClick: function (e) {
      if (e === 'addMarks') this.addMarks()
      if (e === 'fixWindingOrder') this.fixWindingOrder()
    },
    handleToolClick: function (e) {
      if (e === 'createRandomPoints') this.createRandomPoints()
      if (e === 'zoomTo') zoomToFeatures()
      if (e === 'multipartToSinglepart') this.convertMultipart()
    },
    convertMultipart: function () {
      this.$store.commit('setGeoJSON', flatten(this.currentGeojson))
    },
    createRandomPoints: function () {
      const newPoints = randomPoint(25, {bbox: [-180, -90, 180, 90]})
      this.$store.commit('setGeoJSON', {
        type: 'FeatureCollection',
        features: this.currentGeojson.features.concat(newPoints.features)
      })
    },
    addMarks: function () {
      var parsedJson = this.$store.state.geojson.replace(/(['"])?([a-zA-Z0-9_]+)(['"])?:([^\/])/g, '"$2":$4') //eslint-disable-line
      this.$store.commit('setGeoJSON', parsedJson)
    },
    fixWindingOrder: function () {
      const newGeojson = rewind(this.$store.getters.geojson)
      this.$store.commit('setGeoJSON', newGeojson)
    }
  }
}
</script>

<style>
.topMenu{
  padding: 10px;
  background: #FFDC80;
  width: 100%;
}
.topBtn {
  background-color: transparent;
  color: #182438;
  border: 1px solid white;
  margin-left: 20px;
}
.ivu-dropdown .ivu-select-dropdown{
  margin-left: 20px;
}
.right {
  float: right
}
</style>
