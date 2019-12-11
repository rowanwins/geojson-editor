<template>
  <Row id="bottomMenu">
    <Button class="pad" style="float: left; margin-left: 50px" type="info" @click="openModal">
      Load from url
    </Button>
    <Button class="pad" @click="copy">
      Copy to clipboard
    </Button>
    <ButtonGroup>
      <Button @click="saveToGeojson">
        Save as geojson
      </Button>
      <Dropdown trigger="click" placement="top-end" @on-click="saveInFormats">
        <a href="javascript:void(0)">
          <Button icon="arrow-up-b" />
        </a>
        <DropdownMenu slot="list">
          <DropdownItem v-for="format in supportedFormats" :key="format.value" :name="format.value">
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
      remoteUrl: '',
      supportedFormats: [{
        label: 'Shapefile',
        value: 'shp'
      },
      {
        label: 'TopoJSON',
        value: 'topojson'
      },
      {
        label: 'WKT',
        value: 'wkt'
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
    copy: function () {

      const that = this
      // This API isn't available in older browsers
      navigator.clipboard.writeText(this.$store.state.geojsonString).then(function() {
        that.$Notice.open({
          title: 'Copied to clipboard',
          duration: 2.5,
        })
      }, function (err) {
        // If we fail fallback to the old slow way
        const el = document.createElement('textarea');
        el.value = this.$store.state.geojsonString;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);xw
        this.$Notice.open({
          title: 'Copied to clipboard',
          duration: 2.5,
        })
      });

    },
    saveToGeojson: function () {
      var file = new File([this.$store.state.geojsonString], "exported.geojson", {
        type: "text/plain;charset=utf-8"
      });
      FileSaver.saveAs(file);
    },
    saveInFormats: function (e) {
      let outData = null
      let outName = e
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

<style>
#bottomMenu{
  position: absolute;
  height: 50px;
  bottom: 0px;
  padding: 10px;
  background: #F3F3F3;
  width: 100%;
  text-align: right;
  z-index: 1000;
}
.pad{
  margin-right: 10px;
}
.ivu-notice {
  top: calc(100vh - 115px)!important;
  width: 200px;
}
.ivu-notice-with-normal:after{
  background: #BFC0C0;
}

#bottomMenu .ivu-btn-info {
  background-color: #969696;
  border-color: #969696;
}
</style>
