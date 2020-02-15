<template>
  <div class="containerbg w-full min-h-screen h-full">
    <div class="pt-4 pr-2 text-right">
      <div class="border border-whhgrey inline rounded p-2 text-whhgrey">
        Login
      </div>
    </div>

    <div class="text-left sm:ml-20 lg:ml-64 mx-6 my-6">
      <div class="border-4 border-white bg-whhpurple font-bold p-2 text-2xl text-white text-center inline-block w-12 h-12 leading-6 rounded-full">2</div>
      <div class="text-2xl text-white inline ml-2">
        Schreibe deine Antwort
      </div>
    </div>

    <div class="text-white text-left mx-6 my-2 sm:mx-20 lg:mx-64 leading-snug">
      {{ selectedQuestion.text }}
    </div>

    <div class="sm:mx-20 lg:mx-64 mx-2 mt-4">
      <textarea  v-model="questionResponse"
                class="h-64 p-4 w-full rounded bg-white text-whhgreen"
                @keyup.enter="answerQuestion"
                style="resize: none" >
      </textarea>
    </div>

    <div class="text-right sm:px-20 lg:px-64 px-2 mt-4">
      <button :disabled="formInvalid"
          class="text-white text-lg border rounded border-white bg-whhpurple p-2 w-20 hover:bg-white hover:text-whhpurple"
          @click="answerQuestion"
        >
          Senden
      </button>
    </div>
  </div>
</template>

<script>
export default {
  data: () => {
    return {
      questionResponse: '',
      selectedQuestion: '',
      formInvalid: false
    }
  },
  mounted () {
    this.selectedQuestion = this.$store.state.chat.selectedQuestion
  },
  methods: {
    answerQuestion () {
      if (this.questionResponse == "" || this.questionResponse == "\n" ) {
        //this.formInvalid = true
        return
      } else {
          this.setInitialQuestionAnswer()
          this.$router.push('/chat')
      }


    },
    setInitialQuestionAnswer () {
      const question = this.selectedQuestion
      question.answer = this.questionResponse
      this.$store.commit('chat/set', { prop: 'selectedQuestion', value: question })
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
