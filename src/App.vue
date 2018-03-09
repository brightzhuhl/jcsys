<template>
  <div id="app" class="bbb">
    <TaskForm1 :taskForm1Data="appData"></TaskForm1>
  </div>
</template>

<script>
import TaskForm1 from './components/TaskForm1'

export default {
  name: 'App',
  components: {
    TaskForm1
  },
  props:['appData']
}
</script>

<style>

</style>
