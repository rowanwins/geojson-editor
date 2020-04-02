<template>
  <Row id="codeArea">
    <Button class="copy" icon="md-copy" @click="copy">
      Copy
    </Button>
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
import { setupCodeMirrorRefs } from '../controllers/codeMirror'


export default {
  name: 'CodeArea',
  components: {
    codemirror
  },
  data () {
    return {
      gutterErrors: [],
      requiresParseFixing: false,
      errors: [],
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
  mounted: function () {
    setupCodeMirrorRefs(this.$refs.myCm)
  },
  methods: {
    copy: function () {
      const that = this
      // This API isn't available in older browsers
      navigator.clipboard.writeText(this.$store.state.geojsonString).then(function() {
        that.$Notice.open({
          desc: 'Copied to clipboard',
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
          desc: 'Copied to clipboard'
        })
      });
    },
    onCmCodeChange: function (newGeojsonString) {
      this.cleanErrorMarks()

      this.errors = lint.hint(newGeojsonString)

      let hadParsingError = false
      this.errors.forEach(function (err) {
        if (err.message.startsWith('Parse error')) {
          hadParsingError = true
          this.$store.commit('setDodgyString', newGeojsonString)
        } else if (err.message.startsWith('Polygons and MultiPolygons')) {
          this.$store.commit('setRequiresWindingOrderFix', true)
        }
      }, this)
      this.$store.commit('setRequiresParsingFix', hadParsingError)

      if (!hadParsingError) {
        this.$store.commit('setGeoJSON', newGeojsonString)
      }
      this.markErrors()
    },
    markErrors () {
      this.errors.forEach(function (err) {
        this.$refs.myCm.codemirror.doc.addLineClass(err.line - 1, 'gutter', 'geojsonError')
        var tooltip = document.createElement("div");
        tooltip.classList.add('tooltip');

        const p = tooltip.appendChild(document.createElement("span"));
        p.classList.add('tooltiptext')
        p.innerHTML = err.message;
        this.gutterErrors.push(tooltip)
        this.$refs.myCm.codemirror.addWidget({
          line: err.line - 2,
          ch: 0}, tooltip, false)
      }, this)

    },
    cleanErrorMarks () {

      this.errors.forEach(function (err) {
        this.$refs.myCm.codemirror.doc.removeLineClass(err.line - 1, 'gutter', 'geojsonError')
      }, this)

      this.gutterErrors.forEach(function (tooltip) {
        tooltip.remove()
      })

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

#codeArea .copy {
  position: absolute;
  right: 20px;
  z-index: 800;
  bottom: 20px;
  color: #969696;
}
</style>
