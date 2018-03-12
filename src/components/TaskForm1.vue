<template>
  <div>
    <form role="form">
      <div class="from-group top20">
        <label >任务描述</label>
        <input type="text" class="form-control" v-model="taskTree.description" placeholder="请输入任务描述">
      </div>

      <div class="from-group top20">
        <label >选择流程</label>
        <div class="radio row">
          <label class="col-md-2"><input type="radio"  value="splt" v-model="taskTree.type">食品流通环节 </label>
          <label class="col-md-2"><input type="radio"  value="spsc" v-model="taskTree.type">食品生产环节</label>
          <label class="col-md-2"><input type="radio"  value="cy" v-model="taskTree.type">餐饮环节</label>
          <label class="col-md-2"> <input type="radio"  value="qt" v-model="taskTree.type"> 其他环节</label>
        </div>
      </div>

      <div class="from-group top40">
        <label>产品类别</label>
        <ProductCategoryTree :treeData="productCategoryTree" v-model="taskTree.checkCategory"></ProductCategoryTree>
      </div>

      <div class="from-group top20">
        <label>有效日期</label>
        <div class="row">
          <div class="col-md-5">
            <input type="text" class="form-control" placeholder="开始日期" id="startDateIn" v-model="taskTree.startDate">
          </div>
          <div class="col-md-2" style="text-align: center">---</div>
          <div class="col-md-5">
            <input type="text" class="form-control" placeholder="截止日期" id="endDateIn"  v-model="taskTree.endDate">
          </div>
        </div>
      </div>

      <div class="from-group top40">
        <button type="button" @click="selectUnit" class="btn btn-primary">下一步</button>
      </div>

    </form>
    <div class="modal fade" tabindex="-1" id="selectUnitModal" role="dialog">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            <h4 class="modal-title">分配任务·选择单位</h4>
          </div>
          <div class="modal-body">
            <Tree :data="orgTree" v-if="initialized==4"></Tree>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
            <button type="button" class="btn btn-primary" @click="allotTask">下一步</button>
          </div>
        </div><!-- /.modal-content -->
      </div><!-- /.modal-dialog -->
    </div><!-- /.modal -->

    <div class="modal fade" tabindex="1" id="allotTaskModal" role="dialog">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            <h4 class="modal-title">分配任务·详细分配</h4>
          </div>
          <div class="modal-body">
            <TaskForm2 :taskTree="taskTree" :comCategories="comCategories"  v-if="initialized==4"></TaskForm2>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
            <button type="button" @click="selectUnit" class="btn btn-primary">上一步</button>
            <button type="button" class="btn btn-primary" @click="submitTask">确认</button>
          </div>
        </div><!-- /.modal-content -->
      </div><!-- /.modal-dialog -->
    </div><!-- /.modal -->

    <div class="modal fade" tabindex="1" id="taskListModal" role="dialog">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            <h4 class="modal-title">分配任务·提交</h4>
          </div>
          <div class="modal-body">
            <div class="row top20">
              <div class="col-md-2">任务描述:</div>
              <div class="col-md-">任务描述:</div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
            <button type="button" @click="selectUnit" class="btn btn-primary">上一步</button>
            <button type="button" class="btn btn-primary">提交</button>
          </div>
        </div><!-- /.modal-content -->
      </div><!-- /.modal-dialog -->
    </div><!-- /.modal -->

  </div>
</template>

<script>
  import {taskTree,category,comCategories,orgTree} from '../assets/data.js'
  import TaskForm2 from './TaskForm2.vue'
  import Tree from './Tree.vue'
  import ProductCategoryTree from './ProductCategoryTree.vue'
  export default{
    name:'TaskForm1',
    data(){
      var dataObj = {
        taskTree:{
          description:'',
          taskNum:0,
          type:'splt',
          checkCategory:'0001.0001.0002.',
          startDate:'',
          endDate:'',
          units:[],
        },productCategoryTree:[],orgTree:[],comCategories:[],initialized:0}
      return dataObj;
    },
    components:{TaskForm2,Tree,ProductCategoryTree},
    methods:{
      afterLogin(callback){
        window.onmessage = function(e){
          var token = e.data
          if(token == null){
            layer.msg('登录已失效 请重新登录')
            return
          }
          if(callback){
            callback(token)
          }
        }
        parent.postMessage('getToken','http://localhost:8080')
      },
      selectUnit(){
        $('#selectUnitModal').mymodal();
        $('#allotTaskModal').modal('hide');
      }
      ,allotTask(){
        //增强队列遍历树结构
        var q = [];
        q.addAll = function(li){
          for(var i in li){
            this.push(li[i]);
          }
        }

        var units = this.taskTree.units;
        if(!units){
          units = [];
          this.$set(this.taskTree,'units',units);
        }

        //遍历组织架构树，同步选中的组织架构
        var tempOrgLi = [];
        q.addAll(this.orgTree);
        while(q.length>0){
          var org = q.pop();
          if(org.children && org.children instanceof Array){
            q.addAll(org.children);
          }
          if(org.checked){
            var exists = this.getOrgOfCode(units,org.code);
            if(exists){
              tempOrgLi.push(exists)
            }else{
              tempOrgLi.push({name:org.name,code:org.code,taskNum:0,subTasks:[]})
            }
          }
        }
        this.$set(this.taskTree,'units',tempOrgLi);
        $('#selectUnitModal').modal('hide')
        $('#allotTaskModal').mymodal();
      }
      ,copySimpleValue(src,dst){
        for(var i in src){
          var propType = typeof src[i]
          if(dst[i]){
            continue
          }
          if(propType === 'string' || propType === 'number'){
            dst[i] = src[i]
          }
        }
      }
      ,submitTask(){
        var parentTask = {}
        var taskTree =  this.taskTree
        this.copySimpleValue(taskTree,parentTask)

        var submitSubTasks = []
        var units = taskTree.units
        for(var i in units){
          var subTasks = units[i].subTasks
          if(units[i].showDetail){
            for(var j in subTasks){
              var subTask = {}
              this.copySimpleValue(parentTask,subTask)
              this.copySimpleValue(subTask[i],subTask)
              submitSubTasks.push(subTask)
            }
          }else{
            var subTask = {}
            this.copySimpleValue(units[i],subTask)
            this.copySimpleValue(parentTask,subTask)
            submitSubTasks.push(subTask)
          }
        }

        this.afterLogin(function(token){
          var loadingLayer = layer.load(1,{
            shade: [0.1,'#fff'] //0.1透明度的白色背景
          })

          $.ajax({
            url:'http://localhost:8080/jcsys/app/task/create',
            type:'POST',
            beforeSend: function(xhr) {
              xhr.setRequestHeader("authorization", token);
            },
            data:{params:JSON.stringify({parent:parentTask,subTasks:submitSubTasks})},
            success(result){
              layer.close(loadingLayer)
              layer.msg(result.msg)
            },
            error(e){
              layer.close(loadingLayer)
            }
          })
        })
      }
      ,getOrgOfCode(li,code){
        for(var i in li){
          if(li[i].code == code){
            return li[i];
          }
        }
        return null;
      }
      ,loadTaskTree(){
        this.initialized++;
      }
      ,loadProductCategoryTree(){
        this.productCategoryTree = category;
        this.initialized++;
      }
      ,loadOrgTree(){
        this.orgTree = orgTree;
        this.initialized++;
      }
      ,loadComCategories(){
        this.comCategories = comCategories;
        this.initialized++;
      }
    },
    watch:{

    },mounted:function(){

      this.loadTaskTree();
      //加载产品分类
      this.loadProductCategoryTree();
      //加载组织架构
      this.loadOrgTree();
      //加载企业分类
      this.loadComCategories();
      var vthis = this;

      //初始化日期插件
      $('#startDateIn').datetimepicker({
        format: 'yyyy-mm-dd'
        ,minView:2
        ,autoclose:1
        ,language:'zh-CN'
      }).on('changeDate', function(e){
        $("#endDateIn").datetimepicker('setStartDate', e.date);
        vthis.taskTree.startDate = $('#startDateIn').val();
      })
      $('#endDateIn').datetimepicker({
        format: 'yyyy-mm-dd'
        ,minView:2
        ,language:'zh-CN'
        ,autoclose:1
      }).on('changeDate', function(e){
        $("#startDateIn").datetimepicker('setEndDate', e.date);
        vthis.taskTree.endDate = $('#endDateIn').val();
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
