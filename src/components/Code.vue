<template>
  <Row id="codeArea">
    <codemirror
      ref="myCm"
      :value="code"
      :options="cmOptions"
      @input="onCmCodeChange"
    />
  </Row>
</template>

<script>
import { modifyGeoJSON } from './../controllers/leafletMap'
import { codemirror } from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/base16-light.css'
import 'codemirror/addon/selection/active-line.js'
import 'codemirror/mode/javascript/javascript.js'

import lint from '@mapbox/geojsonhint'

export default {
  name: 'CodeArea',
  components: {
    codemirror
  },
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
      return this.$store.state.dodgyGeoJsonString === '' ? this.$store.state.geojsonString :this.$store.state.dodgyGeoJsonString
    }
  },
  methods: {
    onCmCodeChange: function (newGeojsonString) {
      this.cleanErrorMarks()

      this.errorLines = []

      this.errors = lint.hint(newGeojsonString)

      this.errors.forEach(function (err) {
        if (err.message.startsWith('Parse error')) {
          this.$store.commit('setRequiresParsingFix', true)
          this.$store.commit('setDodgyString', newGeojsonString)
        } else if (err.message.startsWith('Polygons and MultiPolygons')) {
          this.$store.commit('setRequiresWindingOrderFix', true)
        }
        else {
          this.$store.commit('setRequiresParsingFix', false)
        }
        this.errorLines.push(err.line)
      }, this)

      if (this.errors.length === 0) {
        modifyGeoJSON(JSON.parse(newGeojsonString))
        this.$store.commit('setGeoJSON', newGeojsonString)
      }
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
      this.$store.commit('clearRequiresFixes')
    }
  }
}
</script>

<style>
#codeArea {
  height: calc(100vh - 100px);
}
.vue-codemirror, .CodeMirror {
  height: 100%;
}
.geojsonError {
  background: #E36A70;
}
.geojsonError .CodeMirror-linenumber {
  color: white;
}
.cm-s-default .cm-string {
  color: #1A273A;
}
.cm-s-default .cm-number {
  color: #333E4E;
}
.CodeMirror-activeline-background {
  background: #bfc0c026;
}
</style>
