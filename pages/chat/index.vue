<template>
  <div class="containerbg w-full min-h-screen h-full">
    <div class="pt-4 pr-2 text-right">
      <div class="border border-whhgrey inline rounded p-2 text-whhgrey">
        Login
      </div>
    </div>

    <div class="text-left flex sm:ml-20 lg:ml-64 mx-6 mt-6 mb-4">
      <div class="border-4 flex-left flex-shrink-0 border-white bg-whhpurple font-bold p-2 text-2xl text-white text-center inline-block w-12 h-12 leading-6 rounded-full">
        ?</div>
      <div class="text-xl text-white ml-2 mt-3 leading-tight">
        {{ selectedQuestion.text }}
      </div>
    </div>

    <hr class="border-white mx-4 sm:mx-20 lg:mx-64" />

    <ul v-if="storedChatMessages.length > 0">
      <li v-for="message in storedChatMessages" class="float-right">
        <div v-if="message.isFirstResponse || message.isFirstUserResponse">
          <img
            class="w-12 bg-white rounded-full m-2"
            :src="message.isClientMsg ? currentUser.picString : remotePartner.picString"
          >
          <div>{{ message.isClientMsg ? currentUser.name : remotePartner.name }}</div>
          <div>{{ message.message }}</div>
        </div>
      </li>
    </ul>

    <ul v-if="storedChatMessages.length > 0">
      <li v-for="message in storedChatMessages" class="float-right">
        <div v-if="!message.isFirstResponse && !message.isFirstUserResponse">
          <img
            class="w-12 bg-white rounded-full m-2"
            :src="message.isClientMsg ? currentUser.picString : remotePartner.picString"
          >
          <div>{{ message.isClientMsg ? currentUser.name : remotePartner.name }}</div>
          <div>{{ message.message }}</div>
        </div>
      </li>
    </ul>

    <div v-if="!waitingForMatch">Wartetext</div>

    <div class="w-full fixed bottom-0 right-0 p-2">
      <textarea 
        v-model="userInputTextarea"
        @keyup.enter="send"
        style="resize: none"
        class="h-auto p-4 rounded w-full bg-white text-whhgreen"
      ></textarea>
    </div>
  </div>
</template>

<script>

//v-if="waitingForMatch"
//<button v-if="waitingForMatch" @click="send">Senden</button>

export default {
  data: () => {
    return {
      remotePartner: { name: '', picString: '' },
      currentUser: { name: '', picString: '' },
      waitingForMatch: false,
      userInputTextarea: '',
      chatMessages: [{ message: '', isFirstResponse: false }],
      identifier: 'zbxgxDbAHu',
      selectedQuestion: ''
    }
  },
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
.containerbg {
  margin: 0 auto;
  text-align: center;
  background-color: #339933;
  background-image: linear-gradient(20deg, #2EA672 0%, #82A62E 100%);
}
</style>
