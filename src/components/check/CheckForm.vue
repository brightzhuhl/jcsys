<template>
  <div>
    <form role="form" class="form-horizontal">
      <div class="form-group top40">
        <label class="col-md-2">任务来源：</label>
        <div class="col-md-10">{{parent.etc.source.name}}</div>
      </div>
      <div class="form-group top20">
        <label class="col-md-2">任务名称：</label>
        <div class="col-md-10">{{parent.description}}</div>
      </div>
      <div class="form-group top40">
        <label class="col-md-2">检测性质：</label>
        <div class="col-md-3">
          <select class="form-control" v-model.number="checkTask.nature">
            <option value="0">抽检</option>
            <option value="1">送检</option>
          </select>
        </div>
      </div>

      <div class="form-group top20">
        <label class="col-md-2">项目类型：</label>
        <div class="col-md-3">
          <select class="form-control" v-model.number="checkTask.checkType" id="test">
            <option value="1">农残检测</option>
            <option value="2">单通道比色</option>
            <option value="3">金标</option>
            <option value="4">电化学</option>
            <option value="5">滴定</option>
          </select>
        </div>
      </div>

      <div class="form-group top20">
        <label class="col-md-2"><span class="redStar">*</span>项目名称：</label>
        <div class="col-md-7">
          <input class="form-control" v-model="checkTask.description">
        </div>
      </div>



      <div class="form-group top20">
        <label class="col-md-2"><span class="redStar">*</span>检测内容：</label>
        <div class="col-md-7">
          <textarea class="form-control" rows="4" v-model="checkTask.checkContent"></textarea>
        </div>
      </div>

      <div class="form-group top20">
        <label class="col-md-2"><span class="redStar">*</span>有效日期：</label>
        <div class="col-md-3">
          <input type="text" class="form-control" placeholder="开始日期" id="startDateIn" v-model="checkTask.startDate">
        </div>
        <div class="col-md-1" style="text-align: center">
          ---
        </div>
        <div class="col-md-3">
          <input type="text" class="form-control" placeholder="截止日期" id="endDateIn"  v-model="checkTask.endDate">
        </div>
      </div>

      <div class="form-group top40">
        <label class="col-md-2"><span class="redStar">*</span>检测分配：</label>
        <div class="col-md-3">
          上级下发任务总批次:{{parent.taskNum}}
        </div>
        <div v-if="checkTask.invalid" class="col-md-2">
          当前{{checkTask.diffDetail}}<span style="color: red">{{checkTask.diff}}</span>
        </div>
      </div>
    </form>
    <form role="form">
      <div class="form-group top40">
        <div class="row top20" v-for="(taskItem,index) in taskItems">
          <div class="col-md-3 col-md-offset-2">
            <SearchPanel v-model="taskItem.comId"></SearchPanel>
          </div>
          <div class="col-md-2" v-if="taskItem.showShop">
            <select class="form-control" v-model="taskItem.shopId">
              <option value="" disabled selected>请选择摊位</option>
              <option v-for="shop in taskItem.shops" :value="shop.shopId">{{shop.code}}.{{shop.owner}}</option>
            </select>
          </div>
          <div class="col-md-3">
            <MultiSelect :usersData="users" v-model="taskItem.userIds"></MultiSelect>
          </div>
          <div class="col-md-1">
            <input class="form-control" :value="taskItem.taskNum" @keyup="inputTaskNum(taskItem,$event)" placeholder="批次">
          </div>
          <div class="col-md-1">
            <span class="glyphicon glyphicon-minus" v-if="index != 0" @click="reduceTaskItem(index)"></span>
            <span class="glyphicon glyphicon-plus" v-if="index == (taskItems.length -1)" @click="addTaskItem"></span>
          </div>
        </div>
      </div>

      <div clas="form-group top20">
        <button type="button" @click="submitTask" class="btn btn-primary">提交</button>
      </div>
    </form>
  </div>
</template>

<script>
  import SearchPanel from './SearchPanel.vue'
  import MultiSelect from './MultiSelect.vue'
  export default{
    data(){
      return {
        parent:{
          etc:{source:{}}
        },
        checkTask:{
          description:'',
          startDate:'',
          endDate:''
        },
        taskItems:[{
          comId:'',
          userIds:[],
          taskNum:0
        }],
        users:[],
        requestParams:window.getUrlParam()
      }
    },
    components:{SearchPanel,MultiSelect},
    methods:{
      nonNumericFilter(e){
        var e = e || window.event || arguments.callee.caller.arguments[0];
        var val = e.target.value
        val = val.replace(/^0$/,'').replace(/[^\d]/g,'')
        e.target.value = val == '' ? '0' : val
      },
      inputTaskNum(taskItem,e){
        this.nonNumericFilter(e)
        var val = parseInt(e.target.value)
        taskItem.taskNum = val
        this.validateTaskSum()
      },
      validateTaskSum(){
        var parentTaskNum = this.parent.taskNum
        var taskSum = this.taskItems.reduce(function(total,item){return total+=item.taskNum},0)
        var diff = parentTaskNum - taskSum
        this.$set(this.checkTask,'invalid',!(taskSum == parentTaskNum))
        //this.checkTask.invalid = !(taskSum == parentTaskNum)
        this.$set(this.checkTask,'diff',Math.abs(diff))
        //this.checkTask.diff = Math.abs(diff)
        this.$set(this.checkTask,'diffDetail',diff>0 ? '还差' : '超出')
        //this.checkTask.diffDetail = diff>0 ? '还差' : '超出'
      },
      loadParentTask(){
        var vthis = this
        var parentTaskId = this.requestParams['taskId']
        if(parentTaskId == null){
          return
        }
        window.loginedPost('http://localhost:8080/jcsys/app/task/detail',{taskId:parentTaskId},function(result){
          if(result.success){
            var task = result.data
            if(task){
              vthis.parent = task
              vthis.validateTaskSum()
            }
          }else{
            layer.msg('获取任务数据失败:'+result.msg)
          }
        })
      },
      loadUsers(){
        var vthis = this
        window.loginedPost('http://localhost:8080/jcsys/user/users2',{direct:true},function(result){
          vthis.users = result
        })
      },
      addTaskItem(){
        this.taskItems.push({comId:'', userIds:[]})
      },
      onShowShop(showShop,taskItem){
        taskItem.showShop = showShop
        window.loginedPost('http://localhost:8080/jcsys/fmshop/list',{fmId:taskItem.comId},function(result){
          taskItem.shops = result
        })
      },
      reduceTaskItem(index){
        this.taskItems.splice(index,1)
      },
      submitTask(){
        var checkTask = this.checkTask
        if(checkTask.invalid || checkTask.description.trim() === '' || checkTask.startDate.trim()==='' || checkTask.endDate.trim() === ''){
          layer.msg('请将必填项填写完整')
          return
        }
        var taskItems = this.taskItems
        var submitTasks =[]
        for(var i in taskItems){
          var submitTask = {}
          $.extend(submitTask,taskItems[i],this.checkTask)
          submitTasks.push(submitTask)
          delete submitTask.shops
        }
        var submitData = {parentId:this.parent.taskId,subTaskStr:JSON.stringify(submitTasks)}
        window.loginedPost('http://localhost:8080/jcsys/app/task/allot/check',submitData,function(result){
          layer.msg(result.msg,function(){
            if(result.success){
              window.parentDo('closeCurrent')
            }
          })
        })
      }
    }
    , mounted(){
      //加载父任务数据
      this.loadParentTask()
      //加载可分配检测人员数据
      this.loadUsers()
      //初始化日期插件
      var vthis = this;
      $('#startDateIn').datetimepicker({
        format: 'yyyy-mm-dd'
        ,minView:2
        ,autoclose:1
        ,language:'zh-CN'
      }).on('changeDate', function(e){
        $("#endDateIn").datetimepicker('setStartDate', e.date);
        vthis.checkTask.startDate = $('#startDateIn').val();
      })
      $('#endDateIn').datetimepicker({
        format: 'yyyy-mm-dd'
        ,minView:2
        ,language:'zh-CN'
        ,autoclose:1
      }).on('changeDate', function(e){
        $("#startDateIn").datetimepicker('setEndDate', e.date);
        vthis.checkTask.endDate = $('#endDateIn').val();
      })

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
