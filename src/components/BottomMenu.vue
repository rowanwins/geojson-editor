<template>
  <Row class="bottomMenu">
    <Button v-on:click="copy" class="pad">Copy to clipboard</Button> 

    <ButtonGroup>
      <Button v-on:click="save">Save as geojson</Button>
      <Dropdown trigger="click" placement="top-end">
        <a href="javascript:void(0)">
          <Button icon="arrow-up-b"></Button>
        </a>
        <DropdownMenu slot="list">
          <DropdownItem>Shapefile</DropdownItem>
          <DropdownItem>WKT</DropdownItem>
          <DropdownItem>TopoJSON</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </ButtonGroup>
  </Row>
</template>

<script>
var FileSaver = require('file-saver') //eslint-disable-line

export default {
  name: 'BottomMenu',
  methods: {
    copy: function () {
      this.$store.state.geojson.select()
      document.execCommand('copy')
    },
    save: function () {
      var file = new File([this.code], "geojson.geojson", {type: "text/plain;charset=utf-8"});
      FileSaver.saveAs(file);
    }
  }
}
</script>

<style>
.bottomMenu{
  position: absolute;
  bottom: 0px;
  padding: 10px;
  background: #ebebeb;
  width: 100%;
  text-align: right;
}
.pad{
  margin-right: 10px;
}
</style>