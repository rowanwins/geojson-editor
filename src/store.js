import Vuex from 'vuex'
import Vue from 'vue'
import { modifyGeoJSON } from './controllers/leafletMap'
import { highlightSelectedFeatureInCodeArea } from './controllers/codeMirror'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    selectedProperties: null,
    requiresParseFixing: false,
    requiresWindingOrderFix: false,
    geojsonString: `{
  "type": "FeatureCollection",
  "features": []
}`,
    dodgyGeoJsonString: '',
    githubAccessToken: null,
    githubUsername: null
  },
  mutations: {
    setGitHubUsername (state, name) {
      state.githubUsername = name
    },
    setGitHubAccessToken (state, token) {
      state.githubAccessToken = token
    },
    setGeoJSON (state, newGeojson) {
      if (typeof newGeojson !== 'string') newGeojson = JSON.stringify(newGeojson, null, 2)
      state.geojsonString = newGeojson
      modifyGeoJSON()
    },
    setSelectedProperties (state, feature)  {
      state.selectedProperties = feature.properties
      // highlightSelectedFeatureInCodeArea(feature, state.geojsonString)
    },
    setRequiresParsingFix (state, bool) {
      state.requiresParseFixing = bool
    },
    setRequiresWindingOrderFix (state, bool) {
      state.requiresWindingOrderFix = bool
    },
    setDodgyString (state, dodgyString) {
      state.dodgyGeoJsonString = dodgyString
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
      if (gj.type === 'GeometryCollection') return gj.geometries.length
      if (gj.type === 'Feature' || gj.type === 'Geometry') return 1
      return 0
    }
  }
})
