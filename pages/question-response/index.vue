<template>
  <div class="question-response">
    <div class="selectedQuestion">
      {{ selectedQuestion.text }}
    </div>
    <textarea v-model="questionResponse" cols="30" rows="10">
    </textarea>
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
</style>
