import store from '../store'

let codeMirror = null

export function setupCodeMirrorRefs (cmRef) {
  codeMirror = cmRef
}

export function highlightSelectedFeatureInCodeArea (feature, geojson) {
  const substring = JSON.stringify(feature, null, 2)
  const l = lineOf(geojson, substring)
  codeMirror.codemirror.scrollIntoView({
    line: l, char:0
  }, 200)
}

function lineOf(text, substring) {
  var index = text.search(substring);
  var tempString = text.substring(0, index);
  return tempString.split('\n').length;
}
