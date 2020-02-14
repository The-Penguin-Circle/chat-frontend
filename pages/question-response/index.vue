<template>
  <div class="question-response">
    <div class="selectedQuestion">
    </div>
    <textarea v-model="questionResponse" cols="30" rows="10">
    </textarea>

  </div>
</template>

<script>
export default {
  props: [
    'questionId'
  ],
  data: () => {
    return {
      questionResponse: ''
    }
  },
  methods: {
  }
}
</script>

<style>
</style>
