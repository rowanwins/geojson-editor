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
      gutterErrors: [],
      requiresParseFixing: false,
      errors: {},
      cmOptions: {
        tabSize: 2,
        cursorScrollMargin: 50,
        mode: 'text/javascript',
        styleActiveLine: true,
        lineNumbers: true,
        line: true,
        gutters: ["CodeMirror-lint-markers"]
      }
    }
  },
  computed: {
    code: function () {
      return !this.$store.state.requiresParseFixing ? this.$store.state.geojsonString :this.$store.state.dodgyGeoJsonString
    }
  },
  methods: {
    onCmCodeChange: function (newGeojsonString) {
      this.cleanErrorMarks()

      this.errorLines = []

      this.errors = lint.hint(newGeojsonString)

      let hadParsingError = false
      this.errors.forEach(function (err) {
        if (err.message.startsWith('Parse error')) {
          hadParsingError = true
          this.$store.commit('setDodgyString', newGeojsonString)
        } else if (err.message.startsWith('Polygons and MultiPolygons')) {
          this.$store.commit('setRequiresWindingOrderFix', true)
        }
        this.errorLines.push(err.line)
      }, this)
      this.$store.commit('setRequiresParsingFix', hadParsingError)

      if (this.errors.length === 0 || !hadParsingError) {
        this.$store.commit('setGeoJSON', newGeojsonString)
        this.gutterErrors.forEach(function (tooltip) {
          tooltip.remove()
        })
      }

      this.markErrors()
    },
    markErrors () {

      if (this.gutterErrors.length > 0) {
        this.gutterErrors.forEach(function (tooltip) {
          tooltip.remove()
        })
      }

      this.errors.forEach(function (err) {
        this.$refs.myCm.codemirror.doc.addLineClass(err.line, 'gutter', 'geojsonError')

        var tooltip = document.createElement("div");
        tooltip.classList.add('tooltip');

        const p = tooltip.appendChild(document.createElement("span"));
        p.classList.add('tooltiptext')
        p.innerHTML = err.message;
        this.gutterErrors.push(tooltip)
        this.$refs.myCm.codemirror.addWidget({
          line: err.line - 1,
          ch: 0}, tooltip, false)
      }, this)
    },
    cleanErrorMarks () {
      this.errorLines.forEach(function (line) {
        this.$refs.myCm.codemirror.doc.removeLineClass(line, 'gutter', 'geojsonError')
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

.tooltip {
  width: 30px;
  height: 20px;
  z-index: 10;
  margin-left: -30px;
}

.tooltip .tooltiptext {
  visibility: hidden;
  width: 200px;
  z-index: 1000;
  position: absolute;
  background-color: #464646;
  color: #fff;
  text-align: center;
  padding: 5px 0;
  top: 50%;
  transform:translate(0, -50%);
  border-radius: 6px;
  left: 105%;
  opacity: 0;
  transition: opacity 0.3s;
}

.tooltip .tooltiptext::after {
  content: "";
  position: absolute;
  top: 50%;
  right: 100%;
  margin-top: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: transparent #464646 transparent transparent;
}

.tooltip:hover .tooltiptext {
  visibility: visible;
  opacity: 1;
}
</style>
