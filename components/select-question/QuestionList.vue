<template>
  <div>
    <div class="m-6">
      <button
        @click="startChatWithQuestion('rand')"
        class="text-white text-lg border rounded border-white p-2 sm:w-1/3 lg:1/5 w-2/3 hover:bg-white hover:text-whhgreen"
      >
        Zufallsfrage
      </button>
    </div>
    <div
      v-for="question in questions"
      :key="question.id"
    >
      <div
        @click="startChatWithQuestion(question.id)"
        class="text-white text-left px-4 py-2 sm:mx-20 lg:mx-64 leading-snug cursor-pointer hover:text-whhgreen hover:bg-white"
      >
        {{ question.text }}
      </div>
      <hr v-if="question.id != questions.length" class="border-white mx-2 sm:mx-20 lg:mx-64">
    </div>
  </div>
</template>

<script>
export default {
  data: () => {
    return {
      cyka: 1
    }
  },
  computed: {
    questions () {
      return [
        { text: 'Wenn du ein Buch schreiben müsstest, wovon würde es handeln?', id: 1 },
        { text: 'Bist du ein Konkurrenzdenker?', id: 2 },
        { text: 'Welchen nahen Verwandten magst du am wenigsten? Warum?', id: 3 },
        { text: 'Bist du mit deinen bisherigen Errungenschaften im Leben zufrieden?', id: 4 },
        { text: 'Was macht dich neidisch?', id: 5 }]
    }
  },
  methods: {
    startChatWithQuestion (id) {
      if (id === 'rand') {
        id = Math.floor(Math.random() * this.questions.length + 1)
      }
      //this.$store.commit('chat/set', { prop: 'selectedQuestion', value: id })
    }
  }
}
</script>

<style>
</style>
