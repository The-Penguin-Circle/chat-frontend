<template>
  <div class="containerbg w-full min-h-screen h-full">
    <div v-if="!showProfile">
      <div class="pt-4 pr-2 text-right">
        <div class="border border-whhgrey inline rounded p-2 text-whhgrey">Login</div>
      </div>

      <div class="text-left flex sm:ml-20 lg:ml-64 mx-6 mb-4">
        <div
          class="border-4 flex-left flex-shrink-0 border-white bg-whhpurple font-bold p-2 text-2xl text-white text-center inline-block w-12 h-12 leading-6 rounded-full"
        >?</div>
        <div class="text-xl text-white ml-2 mt-3 leading-tight">{{ selectedQuestion.text }}</div>
      </div>

      <hr class="border-white mx-4 mt-4 sm:mx-20 lg:mx-64" />

      <div class="absolute w-full overflow-scroll pt-4" style="max-height: calc(100vh - 12rem)">

        <div v-if="storedChatMessages.length > 0" class="flex items-start flex-row-reverse sm:mx-20 lg:mx-64 mx-4">
          <div
            v-for="message in storedChatMessages"
            class="grid grid-flow-row grid-gap-4 flex-grow flex-1"
            :class="{'ml-4 col-r': message.isFirstUserResponse, 'col-l': message.isFirstResponse}"
            v-if="message.isFirstResponse || message.isFirstUserResponse"
          >
            <img
              class="w-12 bg-white rounded-full m-2 sm:row-span-2 row-start-1 cursor-pointer"
              :class="{'col-start-2': message.isFirstUserResponse}"
              @click="navToProfile(message.isClientMsg)"
              :src="message.isClientMsg ? currentUser.picString : remotePartner.picString"
            />
            <div class="text-white text sm:pt-0" :class="{'text-right': message.isFirstUserResponse, 'text-left': message.isFirstResponse}">
              {{ message.isClientMsg ? currentUser.name : remotePartner.name }}
            </div>
            <div class="text-white col-span-2 sm:col-span-1 p-2 text-left bg-white rounded text-whhgreen">
              {{ message.message }}
            </div>
          </div>
          <div v-if="!waitingForMatch" class="lds-ripple mx-10 sm:mx-20">
            <div></div>
            <div></div>
          </div>
        </div>

        <hr class="border-white mx-4 my-4 sm:mx-20 lg:mx-64" />

        <ul v-if="storedChatMessages.length > 0">
          <li v-for="message in storedChatMessages" class="my-4 mx-4">
            <div class="sm:mx-20 lg:mx-64 flex self-end " :class="{ 'justify-end': message.isClientMsg }" v-if="!message.isFirstResponse && !message.isFirstUserResponse" >
              <div class="align-left" v-if="!message.isClientMsg">
                <img
                  class="w-12 bg-white rounded-full mr-4 cursor-pointer"
                  style="min-width: 3rem"
                  @click="navToProfile(message.isClientMsg)"
                  :src="message.isClientMsg ? currentUser.picString : remotePartner.picString"
                />
              </div>
              <div class="p-2 bg-white rounded self-start flex">
                <div class="w-full text-left text-whhgreen">{{ message.message }}</div>
              </div>
              <div class="align-left" v-if="message.isClientMsg">
                <img
                  class="w-12 bg-white rounded-full ml-4 cursor-pointer"
                  style="min-width: 3rem"
                  @click="navToProfile(message.isClientMsg)"
                  :src="message.isClientMsg ? currentUser.picString : remotePartner.picString"
                />
              </div>
            </div>
          </li>
        </ul>

      </div>

      <div class="w-full fixed bottom-0 right-0 p-2 sm:px-20 lg:px-64">
        <textarea required
          v-model="userInputTextarea"
          v-if="waitingForMatch"
          @keyup.enter="send"
          style="resize: none"
          rows="1"
          class="p-4 rounded w-full bg-white text-whhgreen"
        ></textarea>
      </div>
    </div>

    <!-- <profile /> -->
    <div v-if="showProfile">
      <h2 class="text-white text-4xl pt-20 mb-6">Profil</h2>
      <img :src="currentUser.picString" class="rounded-full bg-white w-2/3 inline"/>
      <h3 class="text-xl text-white mx-4 my-6">{{ currentUser.name }}</h3>
      <button @click="getNewProfile" class="border border-white rounded no-underline p-3 mt-12 text-xl bg-whhpurple text-white hover:text-whhpurple hover:bg-white">Neu generieren</button>
      <button @click="navToChat" class="border border-white rounded no-underline p-3 mt-12 text-xl text-white hover:text-whhpurple hover:bg-white">Fertig</button>
    </div>
  </div>
</template>

<script>

export default {
  data: () => {
    return {
      remotePartner: { name: "", picString: "" },
      currentUser: { name: "", picString: "" },
      waitingForMatch: false,
      userInputTextarea: "",
      chatMessages: [{ message: "", isFirstResponse: false }],
      identifier: "zbxgxDbAHu",
      selectedQuestion: "",
      showProfile: false
    };
  },
  // components: {
  //   profile
  // },
  computed: {
    storedChatMessages() {
      return this.$store.state.chat.messages;
    }
  },
  mounted () {
    const _this = this

    if(!this.$store.state.chat.hasOwnProperty("selectedQuestion")){// && !(this.$store.state.chat.selectedQuestion == "" || this.$store.state.chat.selectedQuestion === undefined) ){
      //console.log(this.$store.state.chat.selectedQuestion);

      return this.$router.push("/")
    } else {
      this.selectedQuestion = this.$store.state.chat.selectedQuestion
      this.setupSocketConnection()
      //this.pushInitialAnswerToChat()
      this.socket.onmessage = (event) => {
        try {
          //console.log(event.data);
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
    }


  },
  methods: {
    navToProfile(isClientMsg) {
      this.showProfile = isClientMsg;
    },
    navToChat() {
      this.showProfile = false;
    },
    getNewProfile() {
      this.socket.send(
        JSON.stringify({
          type: "get-username",
          generateNew: true,
          identifier: this.$store.state.chat.identifier
        })
      );
    },
    handleChatFound(_this, data) {
      _this.waitingForMatch = true;
      // {"type":"chat-found","data":{"otherUser":{"identifier":"NjVZvQsQDb","username":"Qusuk Koj","image":""},"otherResponse":"saas"}}
      _this.remotePartner.picString = `data:image/jpeg;base64,${data.data.otherUser.image}`;
      _this.remotePartner.name = data.data.otherUser.username;
      //_this.pushMessageToChat({ message: this.userInputTextarea, isFirstResponse: false, isClientMsg: true })
      //{message: data.data.otherResponse, isFirstResponse: true }
      _this.pushMessageToChat({
        message: data.data.otherResponse,
        isFirstResponse: true
      });
      _this.$store.commit("chat/set", {
        prop: "remotePartner",
        value: _this.remotePartner
      });
      //_this.$store.commit('chat/addChatMessage', { message: this.userInputTextarea, isFirstResponse: false, isClientMsg: true } )
      //console.log(_this.$store.state.chat.messages + "messages");
      //_this.chatMessages.push({message: data.data.otherResponse, isFirstResponse: true })
    },
    handleMatchMe(_this, data) {
      // save own profile created by the server
      _this.currentUser.name = data.data.username;
      _this.currentUser.picString = "data:image/jpeg;base64," + data.data.image;
      _this.identifier = data.data.identifier;
      // parse id to the Store, for use in the profile screen and to check if the current page has to create a new entity if the identifier is empty
      _this.$store.commit("chat/set", {
        prop: "identifier",
        value: _this.identifier
      });
    },
    handleChatMessage(_this, data) {
      //debugger
      _this.pushMessageToChat({
        message: data.data.message,
        isFirstResponse: false
      });
      //  _this.chatMessages.push({ message: data.data.message, isFirstResponse: false })
    },
    handleGetUserName(_this, data) {
      _this.currentUser.name = data.data.username;
      _this.currentUser.picString = "data:image/jpeg;base64," + data.data.image;
    },
    setupSocketConnection() {
      const _this = this;
      // _this.$store.commit('chat/set', { prop: 'identifier', value: _this.identifier })
      this.socket = new WebSocket("wss://chat.linus.space/websocket");
      this.socket.onopen = function() {
        if (
          _this.$store.state.chat.hasOwnProperty("identifier") &&
          _this.$store.state.chat.identifier != ""
        ) {
          //identifier =! ""
          _this.socket.send(
            JSON.stringify({
              type: "get-username",
              generateNew: false,
              identifier: _this.$store.state.chat.identifier
            })
          );
          //
        } else {
          // new User
          _this.socket.send(
            JSON.stringify({
              type: "match-me",
              questionID: _this.selectedQuestion.id,
              answer: _this.selectedQuestion.answer
            })
          );
          _this.pushInitialAnswerToChat();
        }
      };
    },
    pushInitialAnswerToChat() {
      // push client/current User answer to the chat list
      //this.chatMessages.push({ message: this.selectedQuestion.answer, isFirstUserResponse: true })
      this.pushMessageToChat({
        message: this.selectedQuestion.answer,
        isFirstUserResponse: true,
        isClientMsg: true
      });
      //this.$store.commit('chat/set', { prop: 'chatMessages', value: this.chatMessages })
    },
    pushMessageToChat(msg) {
      this.$store.commit("chat/addChatMessage", msg);
    },
    send() {
      if (this.userInputTextarea != "" && this.userInputTextarea != "\n") {
        const message = {
          type: "chat-message",
          identifier: this.identifier,
          message: this.userInputTextarea
        };
        //
        this.pushMessageToChat({
          message: this.userInputTextarea,
          isFirstResponse: false,
          isClientMsg: true
        });
        //  this.$store.commit('chat/addChatMessage', { message: this.userInputTextarea, isFirstResponse: false, isClientMsg: true } )
        //  this.chatMessages.push({ message: this.userInputTextarea, isFirstResponse: false, isClientMsg: true })
        this.socket.send(JSON.stringify(message));
        this.userInputTextarea = "";
      } else {
        // nikes
      }

    }
  }
};
</script>
<style>
.border-left {
  border-left: 1px white;
}
.col-r {
  grid-template-columns: 1fr 4rem;
}
.col-l {
  grid-template-columns: 4rem 1fr;
}
.containerbg {
  margin: 0 auto;
  text-align: center;
  background-color: #339933;
  background-image: linear-gradient(20deg, #2ea672 0%, #82a62e 100%);
}
.lds-ripple {
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;
}
.lds-ripple div {
  position: absolute;
  border: 4px solid #fff;
  opacity: 1;
  border-radius: 50%;
  animation: lds-ripple 1s cubic-bezier(0, 0.2, 0.8, 1) infinite;
}
.lds-ripple div:nth-child(2) {
  animation-delay: -0.5s;
}
@keyframes lds-ripple {
  0% {
    top: 36px;
    left: 36px;
    width: 0;
    height: 0;
    opacity: 1;
  }
  100% {
    top: 0px;
    left: 0px;
    width: 72px;
    height: 72px;
    opacity: 0;
  }
}
</style>
