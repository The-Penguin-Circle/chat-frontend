<template>
  <div class="questions-list">
    <div class="random-question" style="margin-bottom: 2rem;">
      <button @click="startChatWithQuestion('rand')">
        Zufallsfrage
      </button>
    </div>
    <div v-for="question in questions" :key="question.id" class="question" @click="startChatWithQuestion(question.id)">
      {{ question.text }}
    </div>
  </div>
</template>

<script>
export default {
  data: () => {
    return {}
  },
  computed: {
    questions () {
      return [
        { text: 'Frage 1', id: 1 },
        { text: 'Frage 2', id: 2 },
        { text: 'Frage 3', id: 3 },
        { text: 'Frage 4', id: 4 },
        { text: 'Frage 5', id: 5 }]
    }
  },
  methods: {
    startChatWithQuestion (id) {
      if (id === 'rand') {
        id = Math.floor(Math.random() * this.questions.length + 1)
      }
    }
  }
}
</script>

<style>
</style>
