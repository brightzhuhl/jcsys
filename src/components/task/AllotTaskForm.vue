<template>
  <div class="container top40">
    <div class="row top20" v-for="(taskItem,index) in taskItems ">
      <div class="col-md-4 col-md-offset-3">
        <select class="form-control" v-model="taskItem.targetOrg">
          <option v-for="unit in units" :value="unit.id">{{unit.text}}</option>
        </select>
      </div>
      <div class="col-md-1">
        <input class="form-control" v-model="taskItem.taskNum" placeholder="批次">
      </div>
      <div class="col-md-1">
        <span class="glyphicon glyphicon-minus" v-if="index != 0" @click="reduceTaskItem(index)"></span>
        <span class="glyphicon glyphicon-plus" v-if="index == (taskItems.length -1) && index<(units.length-1)" @click="addTaskItem"></span>
      </div>
    </div>
    <div class="row top20">
      <div class="col-md-2 col-md-offset-3">
        <button type="button" class="btn btn-primary" @click="submitTask">提交</button>
      </div>
    </div>
  </div>
</template>

<script>
  export default{
    data(){
      return {
        parent:{},
        taskItems:[{targetOrg:'', taskNum:0}],
        units:[],
        unitCount:0,
        requestParams:window.getUrlParam()
      }
    },
    methods:{
      loadParentTask(){
        var vthis = this
        var parentTaskId = this.requestParams['taskId']
        if(parentTaskId == null){
          layer.msg('没有任务数据,3s后关闭本页面')
          return
        }
        window.loginedPost('http://localhost:8080/jcsys/app/task/detail',{taskId:parentTaskId},function(result){
          if(result.success){
            var task = result.data
            if(task){
              vthis.parent = task
            }
          }else{
            layer.msg('获取任务数据失败:'+result.msg)
          }
        })
      },
      loadOrgTree(){
        var vthis = this
        window.loginedPost('http://localhost:8080/jcsys/orgstruct/tree',{onlyUnit:true}
          ,function(result){
            var units = result[0].children
            vthis.units = units
          }
        )
      },
      addTaskItem(){
        this.taskItems.push({targetOrg:'', taskNum:0})
      },
      reduceTaskItem(index){
        this.taskItems.splice(index,1)
      },
      submitTask(){
        var taskItems = this.taskItems
        var submitTasks =[]
        for(var i in taskItems){
          var submitTask = {}
          $.extend(submitTask,taskItems[i])
          submitTasks.push(submitTask)
        }
        var submitData = {parentId:this.parent.taskId,subTaskStr:JSON.stringify(submitTasks)}
        window.loginedPost('http://localhost:8080/jcsys/app/task/allot',submitData,function(result){
          layer.msg(result.msg)
        })
      }
    },
    mounted(){
      this.loadOrgTree()
      this.loadParentTask()
    }
  }
</script>


<style scoped>
  .top20{
    margin-top:20px;
  }

  .top40{
    margin-top:40px;
  }

  .control-inline{
    width: auto;
  }
</style>

