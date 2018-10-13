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
  background: #bfc0c07d;
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