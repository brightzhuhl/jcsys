<template>
  <div class="btn-group" style="width: 100%">
    <button class="btn btn-default dropdown-toggle selected-item" type="button"
            id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
      <span style="width:100%;text-align: left">{{currentSelected.text}}</span>
      <span class="caret" style="position:absolute;top:50%;margin-top: -2px;right: 12px"></span>
    </button>
    <ul class="dropdown-menu" aria-labelledby="dropdownMenu1" style="width: 100%">
      <li>
          <div style="margin-left: 5%;width: 90%">
            <input class="form-control" role="textbox" v-model="searchParam.comName" @click.stop="onSearch">
          </div>
      </li>
      <li role="separator" class="divider"></li>
      <li v-if="items.length==0" style="text-align: center">找不到"{{searchParam.comName}}"相关的企业数据</li>
      <li v-for="item in items" :class="item.selected"><a href="javascript:;" @click="onSelect(item)">{{item.text}}</a></li>
    </ul>
  </div>
</template>
<script>
  export default{
    props:['companyCategory'],
    data(){
      return {
        items:[],
        currentSelected:{text:'请选择'},
        searchParam:{
          comName:'',
          page:1,
          rows:10,
          asc:true,
          code:this.companyCategory
        }
      }
    },
    methods:{
      onSearch(){
        return false
      },
      onSelect(item){
        this.currentSelected.selected = ''
        this.$set(item,'selected','selected')
        this.currentSelected = item
        this.$emit('input',item.value)
      },
      loadData(){
        var searchParam = {}
        var vthis = this
        window.loginedPost(
          'http://localhost:8080/jcsys/company/datagrid',
          this.searchParam,
          function(result){
            var items = [],coms = result.rows
            for(var i in coms){
              items.push({text:coms[i].comName,value:coms[i].comId})
            }
            vthis.items = items
            console.log(items)
          }
        )//loginedPost
      }
    },
    watch:{
      searchParam:{
        deep:true,
        handler(){
          this.loadData()
        }
      }
    },
    mounted(){
      this.loadData()
    }
  }
</script>

<style scoped>
  .selected-item{
    text-align: left;
    width: 100%;
    position: relative;
  }
  .selected{
    background-color: rgb(66,139,202);
  }
</style>
