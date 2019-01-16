<template>
  <i-row class="bottomMenu">
    <Button v-on:click="copy" class="pad">Copy to clipboard</Button> 

    <ButtonGroup>
      <Button v-on:click="save">Save as geojson</Button>
      <Dropdown trigger="click" placement="top-end" @on-click="saveInFormats">
        <a href="javascript:void(0)">
          <Button icon="arrow-up-b"></Button>
        </a>
        <DropdownMenu slot="list">
          <DropdownItem  name="shp" >Shapefile</DropdownItem>
          <DropdownItem  name="wkt" >WKT</DropdownItem>
          <DropdownItem  name="topo" >TopoJSON</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </ButtonGroup>
  </i-row>
</template>

<script>
var FileSaver = require('file-saver') //eslint-disable-line
var topojson = require('topojson')
var wkt = require('wellknown');

export default {
  name: 'BottomMenu',
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
    save: function () {
      var file = new File([this.code], "exported.geojson", {
        type: "text/plain;charset=utf-8"
      });
      FileSaver.saveAs(file);
    },
    saveInFormats: function (e) {
      let outData = null
      let outName = null
      if (e === 'topo') {
        outData = topojson.topology(this.$store.state.geojson)
        outName = 'topojson'
      }
      if (e === 'wkt') {
        outData = wkt.stringify({
          type: 'GeometryCollection',
          geometries: JSON.parse(this.$store.state.geojson).features.map(function (f) {
            return f.geometry
          })
        })
        outName = 'wkt'
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
.bottomMenu{
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