<template>
  <div>
    <form role="form">
      <div class="from-group top20">
        <label><span class="redStar">*</span>任务名称</label>
        <input type="text" class="form-control" v-model="taskTree.description" placeholder="请输入任务名称">
      </div>

      <div class="from-group top40">
        <label>产品类别</label>
        <ProductCategoryTree :treeData="productCategoryTree" v-model="taskTree.checkCategory"></ProductCategoryTree>
      </div>

      <div class="from-group top40">
        <label><span class="redStar">*</span>有效日期</label>
        <div class="row">
          <div class="col-md-5">
            <input type="text" class="form-control" placeholder="开始日期" :id="'startDateIn'+insCount" v-model="taskTree.startDate">
          </div>
          <div class="col-md-2" style="text-align: center">---</div>
          <div class="col-md-5">
            <input type="text" class="form-control" placeholder="截止日期" :id="'endDateIn'+insCount"  v-model="taskTree.endDate">
          </div>
        </div>
      </div>
    </form>
    <form class="form-horizontal">
      <div class="form-group top40">
        <label class="col-md-2"><span class="redStar">*</span>任务分配&nbsp;&nbsp;<span class="glyphicon glyphicon-plus" @click="selectUnit"></span></label>
      </div>
    </form>
    <TaskForm2 :taskTree="taskTree" :comCategories="comCategories"  v-if="initialized==4"></TaskForm2>




    <div class="modal fade" tabindex="-1" :id="modalId" role="dialog">
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
  </div>
</template>

<script>

  import {taskTree,category,comCategories,orgTree} from '../../assets/data.js'
  import TaskForm2 from './TaskForm2.vue'
  import Tree from './Tree.vue'
  import ProductCategoryTree from './ProductCategoryTree.vue'
  var insCount = 0
  export default{
    name:'TaskForm1',
    data(){
      insCount++
      var dataObj = {
        taskTree:{
          description:'',
          taskNum:0,
          type:'splt',
          checkCategory:'',
          startDate:'',
          endDate:'',
          units:[],
        },insCount:insCount,productCategoryTree:[],orgTree:[],comCategories:[],initialized:0,modalId:'selectUnitModal'+insCount}
      return dataObj;
    },
    components:{TaskForm2,Tree,ProductCategoryTree},
    methods:{
      selectUnit(){
        $('#'+this.modalId).mymodal();
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
            var exists = this.getOrgOfCode(units,org.id);
            if(exists){
              tempOrgLi.push(exists)
            }else{
              tempOrgLi.push({name:org.text,id:org.id,taskNum:0,subTasks:[]})
            }
          }
        }
        this.$set(this.taskTree,'units',tempOrgLi);
        $('#'+this.modalId).modal('hide')
      }

      ,getOrgOfCode(li,id){
        for(var i in li){
          if(li[i].id == id){
            return li[i];
          }
        }
        return null;
      }
      ,loadTaskTree(){
        this.initialized++;
      }
      ,loadProductCategoryTree(){
        var vthis = this
        window.loginedPost('http://localhost:8080/jcsys/product/category/list',{}
          ,function(result){
            vthis.productCategoryTree = result;
            vthis.initialized++;
          }
        )
      }
      ,loadOrgTree(){
        var vthis = this
        window.loginedPost('http://localhost:8080/jcsys/orgstruct/tree',{onlyUnit:true}
          ,function(result){
            vthis.orgTree = result[0].children;
            vthis.initialized++;
          }
        )
      }
      ,loadComCategories(){
        var vthis = this
        window.loginedPost('http://localhost:8080/jcsys/company/category/datagrid',{}
          ,function(result){
            vthis.comCategories = result;
            vthis.initialized++;
          }
        )
      }
    },
    watch:{

    },mounted:function(){
      this.$emit('input',this.taskTree)
      this.loadTaskTree();
      //加载产品分类
      this.loadProductCategoryTree();
      //加载组织架构
      this.loadOrgTree();
      //加载企业分类
      this.loadComCategories();
      var vthis = this;

      //初始化日期插件
      var startDateId = '#startDateIn'+this.insCount,endDateId = '#endDateIn'+this.insCount
      $(startDateId).datetimepicker({
        format: 'yyyy-mm-dd'
        ,minView:2
        ,autoclose:1
        ,language:'zh-CN'
      }).on('changeDate', function(e){
        $(endDateId).datetimepicker('setStartDate', e.date);
        vthis.taskTree.startDate = $(startDateId).val();
      })

      $(startDateId).datetimepicker('setStartDate',new Date())
      $(endDateId).datetimepicker({
        format: 'yyyy-mm-dd'
        ,minView:2
        ,language:'zh-CN'
        ,autoclose:1
      }).on('changeDate', function(e){
        $(startDateId).datetimepicker('setEndDate', e.date);
        vthis.taskTree.endDate = $(endDateId).val();
      })
    }
  }
</script>
