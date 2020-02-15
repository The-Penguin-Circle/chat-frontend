<template>
  <div class="container">
    <div>
      <div> <nuxt-link to="/chat">Zurück</nuxt-link></div>
      <div> <nuxt-link to="/login">Login</nuxt-link></div>
      <img :src="picString">
      <h2 class="title">
      </h2>
      <h3 class="subtitle">
        {{ name }}
      </h3>
      <div>
        <button @click="getNewProfile">Neues Profil generieren</button>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  data: () => {
    return {
      picString: "",
      name: "",
      socket: null
    }
  },
   methods: {
    // getNewProfile () {
    //   //var getUsername = ;
    //   //const = _this.$store.state.chat.identifier != "" ? "_this.$store.state.chat.identifier"
    //   this.socket.send(JSON.stringify({type:"get-username",generateNew:true, identifier:this.$store.state.chat.identifier})) // "pUSbnITRHe"
    // }
  },
  mounted() {

    // var _this = this
    // this.socket = new WebSocket('wss://chat.linus.space/websocket');
    // this.socket.onopen = function(e) {
    //   //alert(_this.$store.state.chat.identifier)
    //   _this.socket.send(JSON.stringify({type:"get-username", generateNew:false, identifier:_this.$store.state.chat.identifier})) // _this.$store.state.chat.identifier
    // }
    //
    // this.socket.onmessage = function(event) {
    //
    //     var data = JSON.parse(event.data)
    //     //alert(event.data)
    //     if (data.type == "get-username") {
    //       _this.name = data.data.username
    //       _this.picString = "data:image/jpeg;base64," + data.data.image
    //     }
    // };
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
