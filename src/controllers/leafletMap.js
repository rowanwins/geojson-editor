import L from 'leaflet'
import "leaflet/dist/leaflet.css"
import "leaflet-draw/dist/leaflet.draw.css"
require('leaflet-draw') //eslint-disable-line

import store from '../store'

let drawnItems = null

export function createMap () {
  var map = L.map('map').setView([51.505, -0.09], 13)

  L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
    subdomains: 'abcd',
    maxZoom: 19
  }).addTo(map)

  drawnItems = L.geoJSON().addTo(map)
  map.addControl(new L.Control.Draw({
    edit: {
      featureGroup: drawnItems,
      poly: {
        allowIntersection: false
      }
    },
    draw: {
      polygon: {
        allowIntersection: false
      },
      circlemarker: false,
      circle: false
    }
  }))

  map.on(L.Draw.Event.CREATED, function (event) {
    drawnItems.addLayer(event.layer)
    parseGeoJSONAndSendToStore(drawnItems.toGeoJSON())
  })

  map.on(L.Draw.Event.EDITED, function () {
    parseGeoJSONAndSendToStore(drawnItems.toGeoJSON())
  })

  map.on(L.Draw.Event.DELETED, function () {
    parseGeoJSONAndSendToStore(drawnItems.toGeoJSON())
  })

}

function parseGeoJSONAndSendToStore (geojson) {
  store.commit('setGeoJSON', geojson)
}

function openPopup(e) {
  var feature = e.target.toGeoJSON()
  store.commit('setSelectedProperties', feature.properties)
}

export function modifyGeoJSON (newGeoJSON) {
  drawnItems.clearLayers()
  drawnItems.addData(newGeoJSON)
  drawnItems.eachLayer(function (layer) {
    layer.on('click', openPopup)
  })
}