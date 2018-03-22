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
  function doAfterLogin(token){
    if(token == null){
      layer.msg('登录已失效 请重新登录')
      return
    }
    localStorage.setItem(tokenKey,token)
    while(callbacks.length>0){
      doCallback(callbacks.pop(),token)
    }
  }
  window.onmessage = function(e){
    var data = e.data;
    if(data.type == 'setToken'){
      doAfterLogin(data.data)
    }
    if(oldOnmessage){
      oldOnmessage(e)
    }
    return
  }
  window.parentDo = function(method){
    parent.postMessage(method,'http://localhost:8080')
  }

  window.afterLogin = function(callback){
    var token = localStorage.getItem(tokenKey);
    if(token == null){
      callbacks.push(callback)

      if(!requestToken){
        requestToken = true
        window.parentDo('getToken')
        /*window.postMessage({type:'setToken',data:'eyJhbGciOiJIUzI1NiJ9.eyJleHAiOjE1MjIyMDIxNzQsInVzZXJjb2RlIjoiYWRtaW4iLCJwYXNzd29yZCI6IjEiLCJzZXRrZXkiOiJrZXkwIn0.iscDfAQofA9Xf8F0sC07gR1Vh-HYc9HMK4Rc3Oxgr0U'},
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
