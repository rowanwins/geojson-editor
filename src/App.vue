<template>
  <Row id="app">
    <Map />
    <Sidebar :loading-github-user="loadingGithubUser" />
    <Properties />
  </Row>
</template>

<script>
import axios from 'axios'
import Map from './components/Map.vue'
import Sidebar from './components/Sidebar.vue'
import Properties from './components/Properties.vue'
import store from './store'

export default {
  name: 'App',
  store: store,
  components: {
    Map,
    Sidebar,
    Properties
  },
  data () {
    return {
      loadingGithubUser: false
    }
  },
  mounted: async function () {
    let params = (new URL(document.location)).searchParams;
    if (params.get("data")) {
      let prettyGeojsonString = JSON.stringify(JSON.parse(params.get("data")), null, 2)
      this.$store.commit('setGeoJSON', prettyGeojsonString)
    } else if (params.get("gist")) {
      const d = await axios.get(`https://api.github.com/gists/${params.get("gist")}`)
      const fileNames = Object.keys(d.data.files)
      const data = await axios.get(d.data.files[fileNames[0]].raw_url)
      this.$store.commit('setGeoJSON', data.data)
    }

    this.$Notice.config({
      top: 100,
      duration: 3
    });

    const that = this
    window.oauthCallback = async function (code) {
      that.loadingGithubUser = true
      const resp = await axios.get('https://github-auth-app.glitch.me/tokenGenerator', {
        params: {
          code
        }
      })
      that.$store.commit('setGitHubAccessToken', resp.data.access_token)
      const d = await axios({
        method: 'get',
        url: 'https://api.github.com/user',
        headers: {
          "Authorization": `token ${resp.data.access_token}`
        }
      })
      that.loadingGithubUser = false

      that.$store.commit('setGitHubUsername', d.data)
    }
  }
}
</script>

<style lang="scss">

html, body, #app {
  margin: 0px;
  width: 100%;
  height: 100%;

  .ivu-notice {
    width: 200px;
  }

}
</style>
