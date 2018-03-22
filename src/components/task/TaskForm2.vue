<template>
  <form class="form-horizontal">
    <div class="form-group top20">
      <div class="col-md-2">
        <input type="checkbox" true-value="true" false-value="false" v-model="autoCompute">自动分配
      </div>
    </div>

    <div class="form-group top20" v-if="taskTree.units.length>0">
      <label class="col-md-2"><span class="redStar">*</span>任务数量</label>
      <div class="col-md-4">
        <input type="text"  :value="taskTree.taskNum" @keyup="inputSum($event)" class="form-control">
      </div>
    </div>

    <div v-for="unit in taskTree.units" class="form-group top40">
      <label class="col-md-2">{{unit.name}}</label>
      <div class="col-md-4">
        <input :value="unit.taskNum" @keyup="inputUnitSum(unit,$event)" class="form-control" placeholder="任务数量">
      </div>
      <div class="col-md-3">
        详细分配 &nbsp;
        <i v-if="unit.showDetail" class="glyphicon glyphicon-tasks" @click.stop="switchDetail(unit)" style="color:red"></i>
        <i v-if="!unit.showDetail" class="glyphicon glyphicon-tasks" @click.stop="switchDetail(unit)"></i>
      </div>
      <div v-if="taskTree.invalid" class="col-md-3">
        {{taskTree.diffDetail}}<span  style="color: red">{{taskTree.diff}}</span>
      </div>
      <div class="clearfix"></div>

      <div v-for="subTask in unit.subTasks" v-if="unit.showDetail" class="row top20">
        <div class="col-md-2 col-md-offset-1">{{subTask.comCategoryName}}</div>
        <div class="col-md-2"><input class="form-control" :value="subTask.taskNum"
                                     @keyup="inputDetailSum(subTask,unit,$event)"></div>
        <div class="col-md-1">或</div>
        <div class="col-md-2"><input class="form-control"  :value="subTask.percent"
                                     @keyup="inputDetailPercent(subTask,unit,$event)"></div>
        <div class="col-md-1">%</div>
        <div v-if="unit.invalid" class="col-md-3">
          {{unit.diffDetail}}<span  style="color: red">{{unit.diff}}</span>
        </div>
        <div class="clearfix"></div>
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
      //过滤输入的非数字字符
      nonNumericFilter(e){
        var e = e || window.event || arguments.callee.caller.arguments[0];
        var val = e.target.value
        val = val.replace(/^0$/,'').replace(/[^\d]/g,'')
        e.target.value = val == '' ? '0' : val

      },
      //输入taskTree.taskNum:
      // 1.将taskTree.taskNum平均分配到unit.taskNum
      // 2.验证输入unit.taskNum之和是否和taskTree.taskNum相等，不相等给出提示
      inputSum(e){
        this.nonNumericFilter(e)
        var val = parseInt(e.target.value)
        this.taskTree.taskNum = val
        this.averageSum()
        this.validateUnitsSum()
      },
      //输入unit.taskNum:
      //1.将unit.taskNum平均分配到subTask.taskNum
      //2.1.验证输入unit.taskNum之和是否和taskTree.taskNum相等，不相等给出提示
      //2.2.验证输入unit.taskNum是否和subTask.taskNum相等之和相等，不相等给出提示
      inputUnitSum(unit,e){
        this.nonNumericFilter(e)
        var val = parseInt(e.target.value)
        unit.taskNum = val
        this.averageUnitSum(unit)
        this.validateUnitsSum()
        this.validateDetailSum(unit)
      },
      //输入subTask.taskNum:
      //1.验证unit.taskNum是否和subTask.taskNum相等之和相等，不相等给出提示
      //2.计算百分比
      inputDetailSum(subTask,unit,e){
        this.nonNumericFilter(e)
        var val = parseInt(e.target.value)
        subTask.taskNum = val
        //根据任务数计算百分比
        subTask.percent = val*100/unit.taskNum
        this.validateDetailSum(unit)
      },
      //输入subTask.percent
      //1.验证unit.taskNum是否和subTask.taskNum相等之和相等，不相等给出提示
      //2.计算任务数
      inputDetailPercent(subTask,unit,e){
        this.nonNumericFilter(e)
        var val = parseInt(e.target.value)
        subTask.percent = val
        //根据百分比计算任务数
        subTask.taskNum = parseInt(unit.taskNum/100*val)
        this.validateDetailSum(unit)
      },
      //平均分配taskTree.taskNum到每个unit
      averageSum(){
        if(this.autoCompute=='false'){
          return;
        }
        var units = this.taskTree.units;
        var val = parseInt(this.taskTree.taskNum/units.length);
        for(var i in units){
          units[i].taskNum = val
          this.averageUnitSum(units[i])
          this.validateDetailSum(units[i])
        }
      },
      //平均分配unit.TaskNum到每个subTask
      averageUnitSum(unit){
        if(this.autoCompute=='false'){
          return;
        }
        var sum = unit.taskNum
        var subTasks = unit.subTasks
        var l = subTasks.length, subVal = parseInt(sum/ l), subPercent = parseInt(subVal*100/sum)
        subTasks.forEach(function(subTask){
          subTask.taskNum = subVal
          subTask.percent = subPercent
        })
      },
      validateUnitsSum(){
        var units = this.taskTree.units;
        var unitsSum = units.reduce(function(total,item){return total+=item.taskNum},0)
        var diff = this.taskTree.taskNum - unitsSum
        this.taskTree.invalid = !(diff == 0)
        this.taskTree.diff = Math.abs(diff)
        this.taskTree.diffDetail = diff>0 ? '还差' : '超出'
      },
      validateDetailSum(unit){
        var detailsSum = unit.subTasks.reduce(function(total,subTask){return total+=subTask.taskNum},0)
        var diff = unit.taskNum - detailsSum
        unit.invalid = !(diff == 0)
        unit.diff = Math.abs(diff)
        unit.diffDetail = diff>0 ? '还差' : '超出'
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
            return tasks[i];
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
    }
    ,mounted:function(){
    }
  }
</script>

