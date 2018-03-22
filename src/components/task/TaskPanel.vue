<template>
  <div>
    <ul id="myTab" class="nav nav-pills top40 affix-top">
      <li v-for="(link,index) in checkedLinks" :class="isActive(link) ? 'active' : ''"><a :href="'#'+link.id" @click="activeLink=link.id">{{link.name}}</a></li>
      <li><a href="javascript:;" @click="showLinkModal"><span class="glyphicon glyphicon-pencil"></span></a></li>
      <li class="pull-right">
        <a href="javascript:;"><button type="button" class="btn btn-primary" @click="submit">全部提交</button></a></li>
    </ul>
    <div class="tab-content">
        <div v-for="(link,index) in checkedLinks" :id="'#'+link.id" :class="isActive(link) ? 'tab-pane active' : 'tab-pane'">
          <TaskForm @input="taskTrees[index] = arguments[0]"></TaskForm>
        </div>
    </div>

    <div class="modal fade" tabindex="-1" id="selectLinkModal"  role="dialog">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            <h4 class="modal-title">选择环节</h4>
          </div>
          <div class="modal-body">
            <form class="form-horizontal">
              <div v-for="(link,key) in links" class="form-group">
                <div class="col-md-3">
                  <input type="checkbox" :value="link.id" :checked="link.checked" @change="link.checked = !link.checked">{{link.name}}
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" data-dismiss="modal">确定</button>
          </div>
        </div><!-- /.modal-content -->
      </div><!-- /.modal-dialog -->
    </div><!-- /.modal -->
  </div>
</template>

<script>
  import TaskForm from './TaskForm.vue'
  export default{
    components:{TaskForm},
    data(){
      return {
        taskTrees:[],
        links:[{
            id:'productLink',
            name:'食品生产环节',
            checked:true
          },{
            id:'cateringLink',
            name:'餐饮环节',
            checked:false
          },{
            id:'otherLink',
            name:'其他环节',
            checked:false
          },{
            id:'transferLink',
            name:'食品流通环节',
            checked:false
        }],
        activeLink:'productLink',
      }
    },
    computed:{
      checkedLinks(){
        var result = [];
        for(var i in this.links){
          var link = this.links[i]
          if(link.checked){
            result.push(link)
          }
        }
        return result
      }
    },
    methods:{
      isActive(item){
        return this.activeLink === item.id
      },
      showLinkModal(){
        $('#selectLinkModal').modal()
      },
      copySimpleValue(src,dst){
        for(var i in src){
          var propType = typeof src[i]
          if(dst[i]){
            continue
          }
          if(propType === 'string' || propType === 'number'){
            dst[i] = src[i]
          }
        }
      },
      formatSubmitTask(taskTree){
        var parentTask = {}
        this.copySimpleValue(taskTree,parentTask)

        var submitSubTasks = []
        var units = taskTree.units
        for(var i in units){
          units[i].targetOrg = units[i].id
          var subTasks = units[i].subTasks
          if(units[i].showDetail){
            for(var j in subTasks){
              if(subTasks[j].taskNum > 0){
                var subTask = {}
                this.copySimpleValue(subTasks[j],subTask)
                this.copySimpleValue(parentTask,subTask)
                subTask.targetOrg = units[i].targetOrg
                submitSubTasks.push(subTask)
              }
            }
          }else{
            var subTask = {}
            this.copySimpleValue(units[i],subTask)
            this.copySimpleValue(parentTask,subTask)
            delete subTask.id
            submitSubTasks.push(subTask)
          }
        }
        return {parent:parentTask,subTasks:submitSubTasks}
      },
      submit(){
        var selLinks = []
        this.links.forEach(function(v){
          if(v.checked){
            selLinks.push(v.name)
          }
        })
        for(var i in selLinks){
          var taskTree = this.taskTrees[i]
          if(taskTree.invalid || taskTree.description.trim() === '' || taskTree.startDate.trim()==='' || taskTree.endDate.trim() === ''){
            layer.msg(selLinks[i]+'数据填写不完整，无法提交')
            return
          }
          taskTree.linkName = selLinks[i]
        }
        var submitData = []
        var taskTrees = this.taskTrees
        for(var i in taskTrees){
          submitData.push(this.formatSubmitTask(taskTrees[i]))
        }
        var loadingLayer = layer.load(1,{
          shade: [0.1,'#fff'] //0.1透明度的白色背景
        })
        var vthis = this
        window.loginedPost(
          'http://localhost:8080/jcsys/app/task/create'
          ,{params:JSON.stringify(submitData)}
          ,function(result){
            layer.close(loadingLayer)
            var errors = result.data
            if(errors.length==0){
              layer.msg(result.msg,function(){
                window.location.reload()
              })
            }else{
              vthis.links.forEach(function(v,index){
                if(!errors.includes(index)){
                  v.checked = false
                }
              })
              layer.open({
                type:1,
                closeBtn:1,
                title:'警告',
                content:result.msg
              })
            }
          })
      }
    }
  }
</script>


<style scoped>

</style>
