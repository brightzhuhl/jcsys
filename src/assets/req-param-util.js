/**
 * Created by Administrator on 2018/3/13.
 */
window.getUrlParam = function(){
  var params = {}
  var searchParam = window.location.search
  if(!searchParam || searchParam.trim()===''){
    return params
  }

  var kvPairs = searchParam.substr(1,searchParam.length).split("&")
  for(var i in kvPairs){
    var kvPair = kvPairs[i]
    if(kvPair.search('=')>=0){
      var kv = kvPair.split('=')
      params[kv[0]] = kv[1]
    }
  }
  return params
}
