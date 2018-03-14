<template>
  <div :id="'treeIns'+treeIndex">
    <ul v-if="data instanceof Array">
      <li v-for="(node,index) in data" >
        <div class="row" style="margin:1em 0;background-color: #dddddd;">
          <div class="col-md-1 vertical-middle">
            <div >
              <i v-if="node.open" @click.stop="switchOpen(node)" class="glyphicon glyphicon-chevron-up"></i>
              <i v-if="!node.open" @click.stop="switchOpen(node)" class="glyphicon glyphicon-chevron-down"></i>
            </div>

          </div>
          <div class="col-md-1">
            <input type="checkbox" name="treeNodeCheck" @click.stop="switchChecked(node)" :value="node.checked"  style="zoom:120%">
          </div>
          <div class="col-md-10 vertical-middle">
            <div >{{node.text}}</div>
          </div>
        </div>

        <Tree v-if="node.children && node.open" :data="node.children"></Tree>
      </li>
    </ul>
  </div>
</template>

<script>
  var treeInsCount = 0;
  export default{
    name:'Tree'
    ,props:['data']
    ,data(){
      treeInsCount++;
      return {selectedItem:'',treeIndex:treeInsCount};
    }
    ,methods:{
      switchOpen(node){
        this.selectedItem = node;
        this.$set(node,'open',!node.open);
      },switchChecked(node){
        this.$set(node,'checked', !node.checked);
      }
    }
    ,mounted:function(){

    }
  }
</script>

<style scoped>
  ul{
    list-style: none;
    cursor: pointer;
    margin: 0;
    padding: 0 0 0 1em;
  }
  li{
    margin: 0;
    padding:0;
  }
  .vertical-middle {
    display: flex;
    flex-flow: row nowrap;
    align-content: center;
  }
</style>
