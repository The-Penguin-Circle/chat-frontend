<template>
  <div class="containerbg w-full min-h-screen h-full">
    <div class="pt-4 pr-2 text-right">
      <div class="border border-whhgrey inline rounded p-2 text-whhgrey">
        Login
      </div>
    </div>

    <div class="text-left sm:ml-20 lg:ml-64 mx-6 my-6">
      <div class="border-4 border-white font-bold p-2 text-2xl text-white text-center inline-block w-12 h-12 leading-6 rounded-full">2</div>
      <div class="text-2xl text-white inline ml-2">
        Schreibe deine Antwort
      </div>
    </div>

    <div class="text-white text-left mx-6 my-2 sm:mx-20 lg:mx-64 leading-snug">
      {{ selectedQuestion.text }}
    </div>

    <div class="sm:mx-20 lg:mx-64 mx-2 mt-4">
      <textarea v-model="questionResponse" class="h-64 p-4 w-full">
      </textarea>
    </div>

    <div class="text-right sm:px-20 lg:px-64 px-2 mt-4">
      <nuxt-link
          to="/chat"
          class="text-white text-lg border rounded border-white p-2 w-20 hover:bg-white hover:text-whhgreen"
        >
          Senden
      </nuxt-link>
    </div>
  </div>
</template>

<script>
export default {
  data: () => {
    return {
      questionResponse: '',
      selectedQuestion: ''
    }
  },
  mounted () {
    this.selectedQuestion = this.$store.state.chat.selectedQuestion
  },
  methods: {
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
