<template>
  <div class="containerbg w-full min-h-screen h-full">
    <div class="pt-4 pr-2 text-right">
      <div class="border border-whhgrey inline rounded p-2 text-whhgrey">
        Login
      </div>
    </div>

    <div class="text-left sm:ml-20 lg:ml-64 mx-6 my-6">
      <div class="border-4 border-white bg-whhpurple font-bold p-2 text-2xl text-white text-center inline-block w-12 h-12 leading-6 rounded-full">
        1</div>
      <div class="text-2xl text-white inline ml-2">
        Wähle eine Frage
      </div>
    </div>

    <QuestionList />
  </div>
</template>

<script>
import QuestionList from '~/components/select-question/QuestionList'

export default {
  components: {
    QuestionList
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
