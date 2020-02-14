<template>
  <div class="container">
    <div>
      <div> <nuxt-link to="/chats">Alle Chats</nuxt-link></div>
      <div> <nuxt-link to="/login">Login</nuxt-link></div>
      <div> {{ selectQ.text }} </div>
        <ul>
          <li v-for="item in items">
            <div>{{ remotePartner.picString }}</div>
            <div>{{ remotePartner.name }}</div>
            <div>{{ item.message }}</div>
          </li>
        </ul>
        <textarea v-if="!isStateOne" v-model="userMessage"></textarea>
        <div v-if="isStateOne">Wartetext</div>
        {{userMessage}}
        <button @click="send">Senden</button>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  data: () => {
    return {
      remotePartner: {name: "",picString: ""},
      currentUser: {name: "",picString: ""},
      isStateOne: false,
      userMessage: "",
      items: [{message: "", isFirstResponse: false}],
      identifier: "zbxgxDbAHu",
      question: ""
    }
  },
   methods: {
    send () {
      // compose obj
      var message = {type:"chat-message", identifier:this.identifier, message:this.userMessage}
      // push to chat
      this.items.push({message: this.userMessage, isFirstResponse: false})
      this.socket.send(JSON.stringify(message))
      this.userMessage = ""


    }

  },
  mounted() {
    // state 1 erkl
    var _this = this
    this.selectQ = this.$store.state.chat.selectedQuestion
    debugger
    // const id = this.$store.state.chat.selectedQuestion.id
    var matchMe = {type:"match-me", questionID: this.selectQ.id, answer:this.selectQ.answer};
    this.socket = new WebSocket('ws://chat.linus.space/websocket');
    this.socket.onopen = function(e) {
      // match
      _this.socket.send(JSON.stringify(matchMe))
    }
    // selectQ.answer
    this.items.push({message:selectQ.answer,isFirstUserResponse: true})

    this.socket.onmessage = function(event) {

        var data = JSON.parse(event.data)
        if (data.data.type == "chat-found") {
          _this.isStateOne = true
          // {"type":"chat-found","data":{"otherUser":{"identifier":"NjVZvQsQDb","username":"Qusuk Koj","image":""},"otherResponse":"saas"}}
          _this.remotePartner.picString = data.data.otherUser.image
          _this.remotePartner.name = data.data.otherUser.username

          _this.items.push({message:data.data.otherResponse,isFirstResponse: true})

          console.log(data.data.identifier + ", " + data.data.username)
          // {"type":"match-me","data":{"identifier":"QIgASOEHFe","username":"Raxoqa Jurew","image":"<base64 image>"}}
        } else if (data.data.type == "match-me") {
          _this.currentUser.name = data.data.username
          _this.currentUser.picString = "data:image/jpeg;base64," + data.data.image
          _this.$store.commit('chat/set', { prop: 'identifier', value: _this.identifier })
        } else if (data.data.type == "chat-message") {
          _this.items.push({message:data.data.message,isFirstResponse: false})

        }
    };
  },
  created() {


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
