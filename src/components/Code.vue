<template>
  <Row class="codeArea">
    <codemirror ref="myCm" :value="code" :options="cmOptions" @input="onCmCodeChange"></codemirror>
  </Row>
</template>

<script>
import { modifyGeoJSON } from './../controllers/leafletMap'
import { codemirror } from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/base16-light.css'
import'codemirror/addon/selection/active-line.js'
import 'codemirror/mode/javascript/javascript.js'

var lint = require('@mapbox/geojsonhint') //eslint-disable-line
var FileSaver = require('file-saver') //eslint-disable-line

export default {
  name: 'CodeArea',
  data () {
    return {
      errorLines: [],
      requiresParseFixing: false,
      errors: {},
      cmOptions: {
        tabSize: 2,
        cursorScrollMargin: 50,
        mode: 'text/javascript',
        styleActiveLine: true,
        lineNumbers: true,
        line: true,
      }
    }
  },
  computed: {
    code: function () {
      return this.$store.state.geojson
    }
  },
  methods: {
    onCmCodeChange: function (newGeoJSON) {
      this.cleanErrorMarks()

      this.errorLines = []

      this.errors = lint.hint(newGeoJSON)
      this.errors.forEach(function (err) {
        if (err.message.startsWith('Parse error')) {
          this.$store.commit('setRequiresParsingFix', true)
        } else if (err.message.startsWith('Polygons and MultiPolygons')) {
          this.$store.commit('setRequiresWindingOrderFix', true)
        }
        else {
          this.$store.commit('setRequiresParsingFix', false)
        }
        this.errorLines.push(err.line)
      }, this)

      if (this.errors.length === 0) modifyGeoJSON(JSON.parse(newGeoJSON))
      if (newGeoJSON !== this.code) this.$store.commit('setGeoJSON', newGeoJSON)
      this.markErrors()
    },
    markErrors () {
      this.errors.forEach(function (err) {
        this.$refs.myCm.codemirror.doc.addLineClass(err.line + 1, 'gutter', 'geojsonError')
      }, this)
    },
    cleanErrorMarks () {
      this.errorLines.forEach(function (line) {
        this.$refs.myCm.codemirror.doc.removeLineClass(line + 1, 'gutter', 'geojsonError')
      }, this)
    }
  },
  components: {
    codemirror
  }
}
</script>

<style>
.codeArea {
  height: calc(100vh - 100px);
}
.vue-codemirror, .CodeMirror{
  height: 100%;
}
.geojsonError{
  background: #e14d0d;
}
.geojsonError .CodeMirror-linenumber{
  color: white;
}
.cm-s-default .cm-string {
  color: #4F5D75;
}
.cm-s-default .cm-number {
  color: #EF8354;
}
.CodeMirror-activeline-background{
  background: #bfc0c026;
}
</style>