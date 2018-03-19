
<template>
  <form role="form">
    <div class="from-group top20">
      <input type="checkbox" true-value="true" false-value="false" v-model="autoCompute">自动分配
    </div>
    <div class="from-group top20">
      <label>任务数量</label>
      <div class="row">
        <div class="col-md-4">
          <input type="text"  v-model.number="taskTree.taskNum" class="form-control">
        </div>
        <div class="col-md-4">
          <label>未分配:{{remainTask}}</label>
        </div>
      </div>

    </div>
    <div v-for="unit in taskTree.units" class="from-group top40">
      <label>{{unit.name}}</label>
      <div class="row">
        <div class="col-md-4">
          <input v-model="unit.taskNum" class="form-control" placeholder="任务数量">
        </div>
        <div class="col-md-3">
          详细分配 &nbsp;
          <i v-if="unit.showDetail" class="glyphicon glyphicon-tasks" @click.stop="switchDetail(unit)" style="color:red"></i>
          <i v-if="!unit.showDetail" class="glyphicon glyphicon-tasks" @click.stop="switchDetail(unit)"></i>
        </div>
      </div>
      <div v-if="unit.showDetail" class="from-group">
        <div v-for="subTask in unit.subTasks" class="row top20">
          <div class="col-md-3 col-md-offset-1">{{subTask.comCategoryName}}</div>
          <div class="col-md-2"><input class="form-control" :value="subTask.taskNum"
                                       @input="inputTaskNum(subTask,unit.taskNum,$event)" @keyup="nonNumericFilter($event)"></div>
          <div class="col-md-1">或</div>
          <div class="col-md-2"><input class="form-control"  :value="subTask.percent"
                                       @input="inputTaskPercent(subTask,unit.taskNum,$event)" @keyup="nonNumericFilter($event)"></div>
          <div class="col-md-1">%</div>
        </div>
      </div>
    </div>
  </form>
</template>

<script>
  export default{
    props:{
      taskTree:{
        default:{
          taskNum:0,
          units:[]
        }
      },comCategories:{
        type:Array,
        default:[]
      }}
    ,data(){
      return {autoCompute:'true'}
    }
    ,methods:{
      validateDetail(unit,e){
        console.log(e)
      },
      validateSum(e){
        console.log(e)
      },
      nonNumericFilter(e){
        var e = e || window.event || arguments.callee.caller.arguments[0];
        var val = e.target.value
        e.target.value = val.replace(/^0$/,'').replace(/[^\d]/g,'')
      },
      inputTaskNum(subTask,sum,e){
        var reg = /^[1-9]\d*$/
        var val = e.target.value
        if(reg.test(e.target.value)){
          var  intVal = parseInt(val)
          subTask.percent = intVal * 100 / sum
          subTask.taskNum = intVal
          return true
        }else{
          return false
        }
      },
      inputTaskPercent(subTask,sum,e){

      },
      //切换详细分配项隐藏或显示
      switchDetail(unit){
        this.$set(unit,'showDetail',!unit.showDetail);
      },
      getTaskOfCode(tasks, code){
        if(!tasks || !(tasks instanceof Array)){
          return;
        }
        for(var i in tasks){
          if(tasks[i].comCategory === code){
            return task[i];
          }
        }
        return null;
      },
      formatData(){
        var tree = this.taskTree;
        var categories = this.comCategories;
        var units = tree.units;
        for(var i in units){
          var subTasks = units[i].subTasks;
          var tempTasks = [];

          for(var j in categories){
            var task = this.getTaskOfCode(subTasks,categories[j].code);
            if(task == null){
              task = {taskNum:0,percent:0}
            }
            task.comCategory=categories[j].code;
            task.comCategoryName = categories[j].name;
            tempTasks.push(task);
          }

          this.$set(units[i],'subTasks',tempTasks);
        }

      }
    }
    ,computed:{
      remainTask(){
        var units = this.taskTree.units;
        var sum = 0;
        for(var i in units){
          sum += units[i].taskNum;
        }
        return this.taskTree.taskNum - sum;
      }
    }
    ,watch:{
      //更新数据
      'taskTree.units':{
        handler(old,value){
          this.formatData();
        }
      }
      ,comCategories:{
        handler(old,value){
          this.formatData();
        }
      }
      //填写总量后平均分配到各个单位
      ,'taskTree.taskNum':{
        handler(){
          if(this.autoCompute=='false'){
            return;
          }
          var units = this.taskTree.units;
          var val = parseInt(this.taskTree.taskNum/units.length);
          for(var i in units){
              units[i].taskNum = val
          }
        }

      }
    }
    ,mounted:function(){
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
