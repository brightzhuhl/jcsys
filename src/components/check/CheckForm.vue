<template>
  <form role="form" class="form-horizontal">
    <div class="form-group top40">
      <label class="col-md-2">任务来源：</label>
      <div class="col-md-10">{{parent.createOrgName}}</div>
    </div>
    <div class="form-group top20">
      <label class="col-md-2">任务名称：</label>
      <div class="col-md-10">{{parent.description}}</div>
    </div>
    <div class="form-group top40">
      <label class="col-md-2">检测性质：</label>
      <div class="col-md-3">
        <select class="form-control" v-model:number="checkTask.nature">
          <option value="0">抽检</option>
          <option value="1">送检</option>
        </select>
      </div>
    </div>

    <div class="form-group top20">
      <label class="col-md-2">项目类型：</label>
      <div class="col-md-3">
        <select class="form-control" v-model:number="checkTask.type" id="test">
          <option value="1">农残检测</option>
          <option value="2">单通道比色</option>
          <option value="3">金标</option>
          <option value="4">电化学</option>
          <option value="5">滴定</option>
        </select>
      </div>
    </div>

    <div class="form-group top20">
      <label class="col-md-2">项目名称：</label>
      <div class="col-md-7">
        <input class="form-control" v-model="checkTask.description">
      </div>
    </div>

    <div class="form-group top20">
      <label class="col-md-2">被检单位：</label>
      <div class="col-md-3">
        <SearchPanel v-model="checkTask.comId"></SearchPanel>
      </div>
    </div>

    <div class="form-group top20">
      <label class="col-md-2">检测人员：</label>
      <div class="col-md-3">
        <select class="form-control" v-model="checkTask.userId">
          <option value="">请选择</option>
          <option v-for="user in users" :value="user.userId">{{user.userName}}</option>
        </select>
      </div>
    </div>

    <div class="form-group top20">
      <label class="col-md-2">检测内容：</label>
      <div class="col-md-7">
        <textarea class="form-control" rows="4" v-model="checkTask.checkContent"></textarea>
      </div>
    </div>

    <div class="form-group top20">
      <label class="col-md-2">有效日期：</label>
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

    <div clas="form-group top20">
      <button type="button" @click="submitTask" class="btn btn-primary">提交</button>
    </div>
  </form>
</template>

<script>
  import SearchPanel from './SearchPanel.vue'
  export default{
    data(){
      return {
        parent:{},
        checkTask:{
          startDate:'',
          endDate:'',
          comId:'',
          userId:''
        },
        users:[],
        requestParams:window.getUrlParam()
      }
    },
    components:{SearchPanel},
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
      loadUsers(){
        var vthis = this
        window.loginedPost('http://localhost:8080/jcsys/user/users2',{direct:true},function(result){
          var users = []
          for(var i in result){
            users.push({userId:result[i].id,userName:result[i].text})
          }
          vthis.users = users
        })
      },
      submitTask(){
        this.checkTask.taskNum = this.parent.taskNum
        var submitData = {parentId:this.parent.taskId,subTaskStr:JSON.stringify(this.checkTask)}
        window.loginedPost('http://localhost:8080/jcsys/app/task/allot/check',submitData,function(result){
          layer.msg(result.msg)
        })
      }
    }
    , mounted(){
      //加载父任务数据
      this.loadParentTask()
      //加载可分配人员数据
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
