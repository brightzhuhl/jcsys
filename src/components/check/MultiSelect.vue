<template>
  <div class="btn-group" style="width: 100%" >
    <button class="btn btn-default dropdown-toggle selected-item" type="button"
           :id="uuid" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
      <span style="width:100%;text-align: left">{{selectedUser}}</span>
      <span class="caret" style="position:absolute;top:50%;margin-top: -2px;right: 12px"></span>
    </button>
    <ul class="dropdown-menu" :aria-labelledby="uuid" style="width: 100%">
      <li>
        <div style="margin-left: 5%;width: 90%">
          <select multiple="multiple" v-model="selectValue" class="form-control" @click.stop="" @change="onSelect">
            <option v-for="user in users" :value="user.userId">{{user.userName}}</option>
          </select>
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
  var insCount = 0;
  export default{
    props:['usersData'],
    data(){
      return {
        selectValue:[],
        users:[],
        userMap:{},
        selectedUser:'请选择检测人员',
        uuid:'multiSelectDropdownMenu'
      }
    },
    methods:{

      onSelect(){
        var userNames = '', selectedVals = this.selectValue
        for(var i in selectedVals){
          userNames += ','+this.userMap[selectedVals[i]]
        }
        this.selectedUser = userNames.substr(1,userNames.length)
        this.$emit('input',selectedVals)
      },
      formatData(){
        var users = [],userMap = {},result = this.usersData
        for(var i in result){
          var uid = result[i].id, uname = result[i].text
          users.push({userId:uid,userName:uname})
          userMap[uid] = uname
        }
        this.users = users
        this.userMap = userMap
      }
    },
    watch:{
      usersData(){
        this.formatData()
      }
    },
    mounted(){
      this.formatData()
      insCount++
      this.uuid += insCount
      var vthis = this
      setTimeout(function(){
        $('#'+vthis.uuid).tooltip({
          title:'按住ctrl可以多选'
        })
      },500)
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
