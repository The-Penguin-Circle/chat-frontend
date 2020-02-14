<template>
  <div class="containerbg w-full min-h-screen h-full">

    <div class="text-5xl m-4 mt-0 pt-20 font-sans text-white">
      Troca
    </div>

    <img class="w-2/5 m-4 sm:w-1/3 lg:w-1/6 text-center inline" src="logo.png"/>

    <div class="flex justify-center">
      <div class="text-left sm:2/3 lg:w-1/3 text-white mx-8 my-12">
        Mit Troca kannst du dich mit Menschen aus dem globalen Süden vernetzen.
        Beantworte eine Frage deiner Wahl und erhalte eine Antwort zur selben Frage von einem zufälligen Chatpartner.
      </div>
    </div>

    <nuxt-link
      to="/select-question"
      class="border rounded p-3 mt-12 text-xl text-white hover:text-whhgreen hover:bg-white"
    >
      Los geht's
    </nuxt-link>
  </div>
</template>

<script>
export default {}
</script>

<style>
.containerbg {
  margin: 0 auto;
  text-align: center;
  background-color: #339933;
  background-image: linear-gradient(20deg, #2EA672 0%, #82A62E 100%);
}
</style>
