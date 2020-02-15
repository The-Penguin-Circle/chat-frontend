<template>
  <div class="container">
    <div v-if="!showProfile" >
      <div><nuxt-link to="/chats">Alle Chats</nuxt-link></div>
      <div><nuxt-link to="/login">Login</nuxt-link></div>
      <div> {{ selectedQuestion.text }} </div>
        <h1>CHAT MESSAGES</h1>
        <ul v-if="storedChatMessages.length > 0">
          <li v-for="message in storedChatMessages">

            <div @click="navToProfile"><img :src="message.isClientMsg ? currentUser.picString : remotePartner.picString"></div>
            <div>{{ message.isClientMsg ? currentUser.name : remotePartner.name }}</div>
            <div>{{ message.message }}</div>
          </li>
        </ul>
        <textarea v-if="waitingForMatch"
                  v-model="userInputTextarea"
                  @keyup.enter="send"></textarea>
        <div v-if="!waitingForMatch">Wartetext</div>
        <button @click="send">Senden</button>
      </div>

      <!-- <profile /> -->

      <div v-if="showProfile">

        <h2 class="title">Dein Profil</h2>
        <img :src="currentUser.picString">
        <h3 class="subtitle">
          {{ currentUser.name }}
        </h3>
        <button @click="getNewProfile">Neues Profil generieren</button>
        <button @click="navToChat">Fertig</button>
      </div>


    </div>





  </div>
</template>

<script>
// import profile from '~/components/profile/settings'
export default {
  data: () => {
    return {
      remotePartner: { name: '', picString: '' },
      currentUser: { name: '', picString: '' },
      waitingForMatch: false,
      userInputTextarea: '',
      chatMessages: [{ message: '', isFirstResponse: false }],
      identifier: 'zbxgxDbAHu',
      selectedQuestion: '',
      showProfile: false
    }
  },
  // components: {
  //   profile
  // },
  computed: {
    storedChatMessages () {
      return this.$store.state.chat.messages
    }
  },
  mounted () {
    const _this = this
    this.selectedQuestion = this.$store.state.chat.selectedQuestion
    this.setupSocketConnection()
    //this.pushInitialAnswerToChat()
    this.socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        switch (data.type) {
          case 'chat-found':
            _this.handleChatFound(_this, data)
            break
          case 'match-me':
            _this.handleMatchMe(_this, data)
            break
          case 'get-username':
            _this.handleGetUserName(_this, data)
            break
          case 'chat-message':
            _this.handleChatMessage(_this, data)
            break
          default:
            console.log('Unknown message type')
        }
      } catch (error) {
        console.log(error)
      }
    }
  },
  methods: {
    navToProfile () {
      this.showProfile = true
    },
    navToChat () {
      this.showProfile = false
    },
    getNewProfile () {
      this.socket.send(JSON.stringify({type:"get-username",generateNew:true, identifier:this.$store.state.chat.identifier}))
    },
    handleChatFound (_this, data) {
      _this.waitingForMatch = true
      // {"type":"chat-found","data":{"otherUser":{"identifier":"NjVZvQsQDb","username":"Qusuk Koj","image":""},"otherResponse":"saas"}}
      _this.remotePartner.picString = `data:image/jpeg;base64,${data.data.otherUser.image}`
      _this.remotePartner.name = data.data.otherUser.username
      //_this.pushMessageToChat({ message: this.userInputTextarea, isFirstResponse: false, isClientMsg: true })
      //{message: data.data.otherResponse, isFirstResponse: true }
      _this.pushMessageToChat({message: data.data.otherResponse, isFirstResponse: true })
      _this.$store.commit('chat/set', { prop: 'remotePartner', value: _this.remotePartner })
      //_this.$store.commit('chat/addChatMessage', { message: this.userInputTextarea, isFirstResponse: false, isClientMsg: true } )
      //console.log(_this.$store.state.chat.messages + "messages");
      //_this.chatMessages.push({message: data.data.otherResponse, isFirstResponse: true })
    },
    handleMatchMe (_this, data) {
      // save own profile created by the server
      _this.currentUser.name = data.data.username
      _this.currentUser.picString = 'data:image/jpeg;base64,' + data.data.image
      _this.identifier = data.data.identifier
      console.log(data.data.identifier);
      // parse id to the Store, for use in the profile screen and to check if the current page has to create a new entity if the identifier is empty
      _this.$store.commit('chat/set', { prop: 'identifier', value: _this.identifier })
    },
    handleChatMessage (_this, data) {
      //debugger
      _this.pushMessageToChat({ message: data.data.message, isFirstResponse: false })
    //  _this.chatMessages.push({ message: data.data.message, isFirstResponse: false })
    },
    handleGetUserName (_this, data) {
      _this.currentUser.name = data.data.username
      _this.currentUser.picString = "data:image/jpeg;base64," + data.data.image
    },
    setupSocketConnection () {
      const _this = this
    // _this.$store.commit('chat/set', { prop: 'identifier', value: _this.identifier })
      this.socket = new WebSocket('wss://chat.linus.space/websocket')
      this.socket.onopen = function () {
        if (_this.$store.state.chat.hasOwnProperty("identifier") && _this.$store.state.chat.identifier != "") { //identifier =! ""
            _this.socket.send(JSON.stringify({type:"get-username", generateNew:false, identifier:_this.$store.state.chat.identifier}))
            //
        } else {
          // new User
          _this.socket.send(JSON.stringify({ type: 'match-me', questionID: _this.selectedQuestion.id, answer: _this.selectedQuestion.answer }))
          _this.pushInitialAnswerToChat()


        }

      }
    },
    pushInitialAnswerToChat () {
      // push client/current User answer to the chat list
      //this.chatMessages.push({ message: this.selectedQuestion.answer, isFirstUserResponse: true })
      this.pushMessageToChat({ message: this.selectedQuestion.answer, isFirstUserResponse: true, isClientMsg: true })
      //this.$store.commit('chat/set', { prop: 'chatMessages', value: this.chatMessages })

    },
    pushMessageToChat (msg) {
      this.$store.commit('chat/addChatMessage', msg )
    },
    send () {

      const message = { type: 'chat-message', identifier: this.identifier, message: this.userInputTextarea }
      //
      this.pushMessageToChat({ message: this.userInputTextarea, isFirstResponse: false, isClientMsg: true } )
    //  this.$store.commit('chat/addChatMessage', { message: this.userInputTextarea, isFirstResponse: false, isClientMsg: true } )
    //  this.chatMessages.push({ message: this.userInputTextarea, isFirstResponse: false, isClientMsg: true })
      this.socket.send(JSON.stringify(message))
      this.userInputTextarea = ''
    }
  }
}
</script>
<style>
</style>
