<template>
  <div class="container">
    <div>
      <div> <nuxt-link to="/login">Login</nuxt-link></div>
      <img :src="picString">
      <h2 class="title">

      </h2>
      <h3 class="subtitle">
        {{ name }}
      </h3>
      <div>
        <button @click="getProfileName">Neues Profil generieren</button>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  data: () => {
    return {
      picString: "",
      name: "Thomas",
      socket: null
    }
  },
  // components: {
  //
  // },
   methods: {

    getProfileName () {
      // link
      // websocket req


      var matchMe = {type:"match-me", questionID:1, answer:"Test"};
      // json parse
      this.socket.send(JSON.stringify(matchMe))




      //this.name = "Baum"
      //this.picString = "http://i.ytimg.com/vi/Uk1RPEQI8mI/maxresdefault.jpg"
      //return
      // return image string
    }

  },
  mounted() {
    var _this = this
    var matchMe = {type:"match-me", questionID:1, answer:"Test"};
    this.socket = new WebSocket('ws://chat.linus.space/websocket');
    this.socket.onopen = function(e) {

      //alert("[open] Connection established")
      //
      console.log(JSON.stringify(matchMe));
      _this.socket.send(JSON.stringify(matchMe))
    }
    this.socket.onmessage = function(event) {
        //alert(`[message] Data received from server: ${event.data}`);
        var data = JSON.parse(event.data)
        _this.name = data.username
        _this.picString = "data:image/jpeg;base64," + data.image
        console.log(data.identifier + ", " + data.username)
    } ;
  },
  created() {



      // this.socket.onopen = function(e) {
      //   alert("[open] Connection established")
      //   alert("Sending to server")
      //   socket.send("My name is John")
      // }
      //this.getProfileName()
  }
}
</script>
<style>
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>
