<template>
  <Row id="bottomMenu">
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
  </Row>
</template>

<script>
import FileSaver from 'file-saver'
import { topology } from 'topojson-server'
import wkt from 'wellknown'
import shape from 'shp-write'

export default {
  name: 'BottomMenu',
  data () {
    return {
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
    copy: function () {
      const el = document.createElement('textarea');
      el.value = this.$store.state.geojson;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);

      this.$Notice.open({
        title: 'Copied to clipboard',
        duration: 2.5,
      })

    },
    saveToGeojson: function () {
      var file = new File([this.code], "exported.geojson", {
        type: "text/plain;charset=utf-8"
      });
      FileSaver.saveAs(file);
    },
    saveInFormats: function (e) {
      let outData = null
      let outName = e
      if (e === 'topo') {
        outData = topojson.topology(this.$store.state.geojson)
      }
      if (e === 'wkt') {
        outData = wkt.stringify({
          type: 'GeometryCollection',
          geometries: JSON.parse(this.$store.state.geojson).features.map(function (f) {
            return f.geometry
          })
        })
      }
      if (e == 'shp') {
        var options = {
            folder: 'myshapes',
            types: {
                point: 'mypoints',
                polygon: 'mypolygons',
                line: 'mylines'
            }
        }
        shape.download(JSON.parse(this.$store.state.geojson), options)
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
</style>
