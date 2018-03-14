<template>
  <form role="form">
    <div class="form-group">
      <div class="col-md-2">任务描述:</div>
      <div class="col-md-4">{{taskTree.description}}</div>
    </div>

    <div class="form-group">
      <div class="col-md-2">任务流程:</div>
      <div class="col-md-4">{{taskTree.type}}</div>
    </div>

    <div class="form-group">
      <div class="col-md-2">产品类别:</div>
      <div class="col-md-4">{{taskTree.category}}</div>
    </div>

    <div class="form-group">
      <div class="col-md-2">任务批次:</div>
      <div class="col-md-6">{{taskTree.taskNum}}</div>
    </div>

    <div class="form-group" v-for="unit in taskTree.units">
      <div class="row" v-for=" subTask in unit.subTasks">
        <div class="col-md2"></div>
      </div>
    </div>
  </form>
</template>
