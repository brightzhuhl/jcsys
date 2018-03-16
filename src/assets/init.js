(function(window){
  //检测localStorage
  var localStorage = window.localStorage
  if(!localStorage){
    layer.msg('您的浏览器版本过低,请升级后使用')
    return
  }
  localStorage.clear()
  function doCallback(callback,token){
    if(callback){
      callback(token)
    }
  }
  //使用token发送请求
  var requestToken = false
  const callbacks = []
  const tokenKey = 'jcsysLoginToken'
  var oldOnmessage = window.onmessage
  window.onmessage = function(e){
    var data = e.data;
    if(data.type != 'setToken'){
      if(oldOnmessage){
        oldOnmessage(e)
      }
      return
    }
    var token = data.data
    if(token == null){
      layer.msg('登录已失效 请重新登录')
      return
    }
    localStorage.setItem(tokenKey,token)
    while(callbacks.length>0){
      doCallback(callbacks.pop(),token)
    }

  }
  window.afterLogin = function(callback){
    var token = localStorage.getItem(tokenKey);
    if(token == null){
      callbacks.push(callback)

      if(!requestToken){
        requestToken = true
        parent.postMessage('getToken','http://localhost:8080')
        /*window.postMessage({type:'setToken',data:'eyJhbGciOiJIUzI1NiJ9.eyJleHAiOjE1MjE1NDI1NDQsInVzZXJjb2RlIjoiYWRtaW4iLCJwYXNzd29yZCI6IjEiLCJzZXRrZXkiOiJrZXkwIn0.T_3FY461CwAS_-fZveh7ldxaI0MrIemWv8DOTGHoWpc'},
          'http://localhost:8081')*/
      }

    }else{
      doCallback(callback,token)
    }
  }


  window.loginedPost = function(url,data,success){
    var myUrl = url
    var executor = function(token){
      $.ajax({
        url:myUrl,
        type:'POST',
        headers:{
          authorization:token,
          'X-Requested-With':'XMLHttpRequest'
        },
        data:data,
        success:function(result){
          success(result)
        },
        error:function(e){
          console.log(e)
          layer.msg('网络错误')
        }
      })
    }
    window.afterLogin(executor)
  }
})(window)
