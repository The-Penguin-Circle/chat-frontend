<template>
  <div class="container">
    <div>
      <div><nuxt-link to="/chats">Alle Chats</nuxt-link></div>
      <div><nuxt-link to="/login">Login</nuxt-link></div>
      <div> {{ selectedQuestion.text }} </div>
        <ul>
          <li v-for="item in chatMessages">
            <div>{{ remotePartner.picString }}</div>
            <div>{{ remotePartner.name }}</div>
            <div>{{ item.message }}</div>
          </li>
        </ul>
        <textarea v-if="!waitingForMatch"
                  v-model="userInputTextarea"
                  @keyup.enter="send"></textarea>
        <div v-if="waitingForMatch">Wartetext</div>
        <button @click="send">Senden</button>
      </div>
    </div>
  </div>
</template>

<script>

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
  mounted () {
    const _this = this
    this.selectedQuestion = this.$store.state.chat.selectedQuestion
    this.setupSocketConnection()
    this.pushInitialAnswerToChat()
    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data)
      switch (data.data.type) {
        case 'chat-found':
          _this.handleChatFound(_this, data)
          break
        case 'match-me':
          _this.handleMatchMe(_this, data)
          break
        case 'chat-message':
          _this.handleChatMessage(_this, data)
          break
        default:
          console.log('Unknown message type')
      }
    }
  },
  methods: {
    handleChatFound (_this, data) {
      _this.waitingForMatch = true
        // {"type":"chat-found","data":{"otherUser":{"identifier":"NjVZvQsQDb","username":"Qusuk Koj","image":""},"otherResponse":"saas"}}
        _this.remotePartner.picString = data.data.otherUser.image
        _this.remotePartner.name = data.data.otherUser.username

        _this.chatMessages.push({message: data.data.otherResponse,isFirstResponse: true})
    },
    handleMatchMe (_this, data) {
      _this.currentUser.name = data.data.username
      _this.currentUser.picString = 'data:image/jpeg;base64,' + data.data.image
      _this.$store.commit('chat/set', { prop: 'identifier', value: _this.identifier })
    },
    handleChatMessage (_this, data) {
      _this.chatMessages.push({ message: data.data.message, isFirstResponse: false })
    },
    setupSocketConnection () {
      const _this = this
      const matchMe = { type: 'match-me', questionID: this.selectedQuestion.id, answer: this.selectedQuestion.answer }
      this.socket = new WebSocket('ws://chat.linus.space/websocket')
      this.socket.onopen = function () {
        _this.socket.send(JSON.stringify(matchMe))
      }
    },
    pushInitialAnswerToChat () {
      this.chatMessages.push({ message: this.selectedQuestion.answer, isFirstUserResponse: true })
    },
    send () {
      const message = { type: 'chat-message', identifier: this.identifier, message: this.userInputTextarea }
      this.chatMessages.push({ message: this.userInputTextarea, isFirstResponse: false })
      this.socket.send(JSON.stringify(message))
      this.userInputTextarea = ''
    }
  }
}
</script>
<style>
</style>
