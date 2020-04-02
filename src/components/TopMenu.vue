<template>
  <Row class="topMenu">
    <Dropdown
      placement="bottom-start"
      class="toolsDropdown"
      @on-click="handleToolClick"
    >
      <a href="javascript:void(0)">
        <Button class="topBtn">
          Tools <Icon type="md-arrow-dropdown" />
        </Button>
      </a>
      <DropdownMenu slot="list">
        <DropdownItem name="createRandomPoints">
          Create Random Points
        </DropdownItem>
        <DropdownItem name="zoomTo">
          Zoom to Features
        </DropdownItem>
        <DropdownItem name="multipartToSinglepart">
          Convert Multipart to Singlepart
        </DropdownItem>
        <Dropdown placement="right-start" @on-click="handleFixClick">
          <DropdownItem>
            Fix Errors <Icon type="ios-arrow-forward"></Icon>
          </DropdownItem>
          <DropdownMenu slot="list">
            <DropdownItem name="addMarks" :disabled="doesntRequireParseFixing">
              Fix Quotation Marks on Keys
            </DropdownItem>
            <DropdownItem name="fixWindingOrder" :disabled="doesntRequireWindingFixing">
              Fix Winding Order
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </DropdownMenu>
    </Dropdown>
    <Button class="topBtn" @click="clearFeatures">
      Clear {{ featureCount }} {{ featureCount !== 1 ? 'features' : 'feature' }}
    </Button>
    <Button
      class="topBtn right"
      :class="{ signedIn: githubUsername }"
      :loading="loadingGithubUser"
      @click="signin"
    >
      <span v-if="githubUsername === null && !loadingGithubUser">
        <Icon type="logo-github" />
        Sign In
      </span>
      <span v-else-if="loadingGithubUser">
        Signing in
      </span>
      <span v-else>
        <Avatar :src="githubImage" size="small" />{{ githubUsername }}
      </span>
    </Button>

    <Modal
      v-model="pointsModalOpen"
      ok-text="Ok"
      cancel-text="Cancel"
      @on-ok="createRandomPoints"
    >
      <p><strong>Number of points to create</strong></p>
      <Input v-model="numberOfPoints" :number="true" placeholder="100" style="width: 300px" />
      <p><strong>Bounding box</strong></p>
      <Input v-model="bbox" style="width: 300px" />
    </Modal>
  </Row>
</template>

<script>
import rewind from '@turf/rewind'
import flatten from '@turf/flatten'
import {randomPoint} from '@turf/random'

import { zoomToFeatures } from '../controllers/leafletMap'
export default {
  name: 'TopMenu',
  props: {
    loadingGithubUser: Boolean
  },
  data () {
    return {
      pointsModalOpen: false,
      numberOfPoints: 100,
      bbox: '-180, -90, 180, 90'
    }
  },
  computed: {
    githubAccessToken: function () {
      return this.$store.state.githubAccessToken
    },
    githubUsername: function () {
        return this.$store.state.githubUsername === null ? null : this.$store.state.githubUsername.login
    },
    githubImage: function () {
        return this.$store.state.githubUsername === null ? null : this.$store.state.githubUsername.avatar_url
    },
    doesntRequireParseFixing () {
      return !this.$store.state.requiresParseFixing
    },
    doesntRequireWindingFixing () {
      return !this.$store.state.requiresWindingOrderFix
    },
    featureCount () {
      return this.$store.getters.featureCount
    },
    currentGeojson () {
      return this.$store.getters.geojson
    }
  },
  methods: {
    clearFeatures: function () {
      this.$store.commit('setGeoJSON', {
        "type": "FeatureCollection",
        "features": []
      })
    },
    signin: async function () {

      const clientId = process.env.NODE_ENV === 'development' ? '66b60b9cad507e50398d' : '31b6608a0ed78122df64'
      window.open(`https://github.com/login/oauth/authorize?client_id=${clientId}&scope=gist,read:user`, 'oauth', `height=400,width=600`)
    },
    handleFixClick: function (e) {
      if (e === 'addMarks') this.addMarks()
      if (e === 'fixWindingOrder') this.fixWindingOrder()
    },
    handleToolClick: function (e) {
      if (e === 'createRandomPoints') this.pointsModalOpen = true
      if (e === 'zoomTo') zoomToFeatures()
      if (e === 'multipartToSinglepart') this.convertMultipart()
    },
    convertMultipart: function () {
      this.$store.commit('setGeoJSON', flatten(this.currentGeojson))
    },
    createRandomPoints: function () {
      if (this.bbox.split(",").length - 1 !== 3) this.bbox = '-180, -90, 180, 90'

      const newPoints = randomPoint(this.numberOfPoints, {bbox: JSON.parse("[" + this.bbox + "]")})
      this.$store.commit('setGeoJSON', {
        type: 'FeatureCollection',
        features: this.currentGeojson.features.concat(newPoints.features)
      })
    },
    addMarks: function () {
      var parsedJson = this.$store.state.dodgyGeoJsonString.replace(/(['"])?([a-zA-Z0-9_]+)(['"])?:([^\/])/g, '"$2":$4') //eslint-disable-line
      this.$store.commit('setDodgyString', '')
      this.$store.commit('setGeoJSON', parsedJson)
      this.$store.commit('setRequiresWindingOrderFix', false)
    },
    fixWindingOrder: function () {
      const newGeojson = rewind(this.$store.getters.geojson)
      this.$store.commit('setGeoJSON', newGeojson)
      this.$store.commit('setRequiresParsingFix', false)
    }
  }
}
</script>

<style lang="scss">
.topMenu{
  padding: 10px;
  background: #FFDC80;
  width: 100%;

  .signedIn {
    font-weight: 600;
    .ivu-avatar-small {
      margin-right: 5px;
      width: 20px;
      height: 20px;
    }
  }

  .toolsDropdown {
    >.ivu-select-dropdown{
      margin-left: 20px;
    }
  }

  .topBtn {
    border: 1px solid white;
    margin-left: 20px;
  }

  .right {
    float: right
  }
}

</style>
