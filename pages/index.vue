<template>
  <div class="container w-full min-h-screen h-full">

    <div class="text-5xl m-4 mt-0 pt-20 font-sans text-white">
      Penguin Chat
    </div>

    <img class="w-2/5 m-4 text-center inline" src="logo.png"/>

    <div class="text-left text-white mx-8 my-12">
      Mit Penguin Chat kannst du dich mit Menschen aus dem globalen Süden vernetzen.
      Beantworte eine Frage deiner Wahl und erhalte eine Antwort zur selben Frage von einem zufälligen Chatpartner.
    </div>

    <nuxt-link
      to="/select-question"
      class="border rounded p-3 mt-12 text-xl text-white hover:text-black hover:bg-white"
    >
      Los geht's
    </nuxt-link>
  </div>
</template>

<script>
export default {}
</script>

<style>
/* Sample `apply` at-rules with Tailwind CSS
.container {
  @apply min-h-screen flex justify-center items-center text-center mx-auto;
}
*/
.container {
  margin: 0 auto;
  text-align: center;
  background-color: #339933;
  background-image: linear-gradient(20deg, #2EA672 0%, #82A62E 100%);
}
</style>
