import Vuex from 'vuex'
import Vue from 'vue'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    selectedProperties: null,
    requiresParseFixing: false,
    requiresWindingOrderFix: false,
    geojsonString: `{
  "type": "FeatureCollection",
  "features": []
}`
  },
  mutations: {
    setGeoJSON (state, newGeojson) {
      if (typeof newGeojson !== 'string') newGeojson = JSON.stringify(newGeojson, null, 2)
      state.geojsonString = newGeojson
    },
    setSelectedProperties (state, newProperties)  {
      state.selectedProperties = newProperties
    },
    setRequiresParsingFix (state, fix) {
      state.requiresParseFixing = fix
    },
    setRequiresWindingOrderFix (state, fix) {
      state.requiresWindingOrderFix = fix
    },
    clearRequiresFixes (state) {
      state.requiresWindingOrderFix = false
      state.requiresParseFixing = false
    }
  },
  getters: {
    geojson: function (state) {
      return JSON.parse(state.geojsonString)
    },
    featureCount: function (state) {
      const gj = JSON.parse(state.geojsonString)
      if (gj.type === 'FeatureCollection') return gj.features.length
      if (gj.type === 'GeometryCollection') return gj.geometrieslength
      if (gj.type === 'Feature') return 1
      if (gj.type === 'Polygon' || gj.type === 'LineString') return 1
      return 0
    }
  }
})
