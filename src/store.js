import Vuex from 'vuex'
import Vue from 'vue'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    selectedProperties: null,
    requiresParseFixing: false,
    requiresWindingOrderFix: false,
    geojson: `{
  "type": "FeatureCollection",
  "features": []
}`
  },
  mutations: {
    setGeoJSON (state, newGeojson) {
      if (typeof newGeojson !== 'string') newGeojson = JSON.stringify(newGeojson, null, 2)
      state.geojson = newGeojson
    },
    setSelectedProperties (state, newProperties)  {
      state.selectedProperties = newProperties
    },
    setRequiresParsingFix (state, fix) {
      state.requiresParseFixing = fix
    },
    setRequiresWindingOrderFix (state, fix) {
      state.requiresWindingOrderFix = fix
    }
  }
})