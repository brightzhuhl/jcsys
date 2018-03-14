<template>
  <div class="row">
    <div class="col-md-3 ">
      <select class="form-control" :value="bigVal" @change="onNodeSelect($event.target.value,5)">
        <option value="">请选择</option>
        <option v-for="bigCate in bigCateLi" :value="bigCate.code">{{bigCate.name}}</option>
      </select>
    </div>
    <div class="col-md-3 ">
      <select class="form-control" :value="subVal" @change="onNodeSelect($event.target.value,10)">
        <option value="">请选择</option>
        <option v-for="subCate in subCateLi" :value="subCate.code">{{subCate.name}}</option>
      </select>
    </div>
    <div class="col-md-3 ">
      <select class="form-control" :value="normalVal" @change="onNodeSelect($event.target.value,15)">
        <option value="">请选择</option>
        <option v-for="normalCate in normalCateLi" :value="normalCate.code">{{normalCate.name}}</option>
      </select>
    </div>
    <div class="col-md-3 ">
      <select class="form-control" :value="smallVal" @change="onNodeSelect($event.target.value,20)">
        <option value="">请选择</option>
        <option v-for="smallCate in smallCateLi" :value="smallCate.code">{{smallCate.name}}</option>
      </select>
    </div>
  </div>
</template>

<script>
  export default{
    props:{
      //父组件传入的树结构产品分类数据
      treeData:{
        type:Array,
        default:[]
      },
      //选中的产品分类code
      value:{
        type:String,
        default:''
      }
    }
    ,data(){

      var dataObj = {
        //保存每级分类列表
        bigCateLi:[],subCateLi:[],normalCateLi:[],smallCateLi:[]
        //value的副本
        ,selected:this.value
      }
      return dataObj
    }
    ,methods:{
      //从分类列表中选出code值为给定值的分类项，返回该分类项的children列表
      getChildrenByCode(code,li){
        for(var i in li){
          if(li[i].code === code){
            return li[i].children
          }
        }
        return []
      }
      //用户选择select框触发，用来将标记当前选中的code
      ,onNodeSelect(value,bit){
        var selected = value
        if(value == ''){
          selected = this.selected.substr(0,bit-5)
        }
        this.selected = selected
        this.$emit('input',selected)
      }
      //用于计算属性根据被选中分类的code计算出每级分类的code和对应分类列表
      ,setupNode(bit,liKey,childLiKey){
        var code = this.selected
        if(code.length < bit){
          return ''
        }
        var currentCode = code.substr(0,bit)
        this[childLiKey] = this.getChildrenByCode(currentCode,this[liKey])
        console.log()
        return currentCode
      }
    }
    ,computed:{
      bigVal(){
        return this.setupNode(5,'bigCateLi','subCateLi')
      },subVal(){
        return this.setupNode(10,'subCateLi','normalCateLi')
      },normalVal(){
        return this.setupNode(15,'normalCateLi','smallCateLi')
      },smallVal(){
        return this.selected.length == 20 ? this.selected : '';
      }
    }
    ,watch:{
      //监听父元素数据变化
      treeData(){
        this.bigCateLi = this.treeData
      }
      ,value(){
        this.selected = this.value
      }
    }
    ,mounted(){
    }
  }
</script>
