$.fn.mymodal = function(){
  var contentHeight = window.innerHeight;
  this.find('.modal-body').css('max-height',contentHeight*0.8+'px').css('overflow-y','scroll');
  return this.modal();
}
