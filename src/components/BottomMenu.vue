<template>
  <Row id="bottomMenu">
    <Tooltip content="Sign in to Github to share" :disabled="hasGhAccessToken" style="float: left; margin-left: 20px">
      <Button
        :disabled="!hasGhAccessToken"
        style="float: left; margin-left: 20px"
        type="info" icon="md-share"
        @click="createShare"
      >
        Share
      </Button>
    </Tooltip>

    <Button
      style="float: left; margin-left: 20px"
      @click="openModal"
    >
      Load from URL
    </Button>
    <ButtonGroup>
      <Button @click="saveToGeojson">
        Save as geojson
      </Button>
      <Dropdown trigger="click" placement="top-end" @on-click="saveInFormats">
        <a href="javascript:void(0)">
          <Button icon="md-arrow-dropup" />
        </a>
        <DropdownMenu slot="list">
          <DropdownItem v-for="format in supportedFormats" :key="format.value" :name="format.value" :disabled="format.disabled">
            {{ format.label }}
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </ButtonGroup>
    <Modal
      v-model="loadDataModal"
      ok-text="Load"
      cancel-text="Cancel"
      @on-ok="loadFromUrl"
    >
      <Input v-model="remoteUrl" placeholder="Url of geojson" style="width: 300px" />
    </Modal>
  </Row>
</template>

<script>
import FileSaver from 'file-saver'
import { topology } from 'topojson-server'
import wkt from 'wellknown'
import shape from 'shp-write'
import axios from 'axios'
import lint from '@mapbox/geojsonhint'
import { zoomToFeatures } from '../controllers/leafletMap'

export default {
  name: 'BottomMenu',
  data () {
    return {
      loadDataModal: false,
      remoteUrl: ''
    }
  },
  computed: {
    hasGhAccessToken: function () {
      return this.$store.state.githubAccessToken !== null
    },
    supportedFormats: function () {
      return [{
        label: 'Shapefile',
        value: 'shp',
        disabled: false
      },
      {
        label: 'TopoJSON',
        value: 'topojson',
        disabled: false
      },
      {
        label: 'WKT',
        value: 'wkt',
        disabled: false
      },
      {
        label: 'Github Gist',
        value: 'gist',
        disabled: !this.hasGhAccessToken
      }
      ]
    }
  },
  methods: {
    openModal: function () {
      this.loadDataModal = true
    },
    loadFromUrl: async function () {
      try {
        const response = await axios.get(this.remoteUrl)
        const errors = lint.hint(response.data)
        let hadParsingError = false
        errors.forEach(function (err) {
          if (err.message.startsWith('Parse error')) {
            hadParsingError = true
          }
        })
        if (hadParsingError) {
          this.$Notice.error({
            title: 'Could not parse geojson',
            desc: 'The specified file could not be parsed as geojson'
          });
          return
        }
        this.$store.commit('setGeoJSON', response.data)
        zoomToFeatures()
      } catch (error) {
        this.$Notice.error({
          title: 'Could not retrieve file',
          desc: 'File could not be retrieved from specified url'
        });
      }
    },
    saveToGeojson: function () {
      var file = new File([this.$store.state.geojsonString], "exported.geojson", {
        type: "text/plain;charset=utf-8"
      });
      FileSaver.saveAs(file);
    },
    createShare: async function () {
      const that = this
      navigator.clipboard.writeText('dksjbdf').then(function() {
        that.$Notice.open({
          title: "Share",
          desc: 'Share copied to clipboard',
        })
      })
    },
    createGist: async function () {
      const that = this;
      return await axios({
          url: 'https://api.github.com/gists',
          method: 'POST',
          headers: {
            Accept: 'application/json',
            Authorization: `token ${that.$store.state.githubAccessToken}`
          },
          data: {
            "description": "GeoJson saved from geojson-editor",
            "public": true,
            "files": {
              "data.geojson": {
                "content": that.$store.state.geojsonString
              }
            }
          }
      })
    },
    saveInFormats: async function (e) {
      let outData = null
      let outName = e

      if (e === 'gist') {
        const r = await this.createGist()
        this.$Notice.open({
          title: 'Gist created',
          desc: r.data.id
        })
        return
      }
      if (e === 'topojson') {
        outData = topology(this.$store.getters.geojson.features)
      }
      if (e === 'wkt') {
        outData = wkt.stringify({
          type: 'GeometryCollection',
          geometries: this.$store.getters.geojson.features.map(function (f) {
            return f.geometry
          })
        })
      }
      if (e === 'shp') {
        var options = {
            folder: 'myshapes',
            types: {
                point: 'mypoints',
                polygon: 'mypolygons',
                line: 'mylines'
            }
        }
        shape.download(this.$store.getters.geojson, options)
        return
      }

      var file = new File([JSON.stringify(outData)], `export.${outName}`, {
        type: "text/plain;charset=utf-8"
      });
      FileSaver.saveAs(file);
    }
  }
}
</script>

<style lang="scss">
#bottomMenu{
  position: absolute;
  height: 50px;
  bottom: 0px;
  padding: 10px;
  background: #F3F3F3;
  width: 100%;
  text-align: right;
  z-index: 1000;
  .pad{
    margin-right: 10px;
  }
}

#bottomMenu .ivu-btn-info {
  background-color: #969696;
  border-color: #969696;
}
</style>
