function maximiseBodyHeight(){
  $('body').height($(window).height());
}

boxes = [];
function addRandomBoxes(numberOfBoxes,radius,stage){
  for(var i = 0; i < numberOfBoxes; i++){
    boxes.push(new Box({stage:stage,x:utils.random(radius),y:utils.random(radius)}));
  }
}

$(function(){
  $(window).on('resize',maximiseBodyHeight);
  maximiseBodyHeight();
  stage = new Stage({width_ratio:1, height_ratio:1});
  box = new TargetBox({stage:stage});
  other = new TargetBox({stage:stage, stamina_decrement: 0.0012 });

  stage.camera._zoom = 0;//start zoomed out
  stage.camera.zoom(1,1000);//zoom in over 1000 ticks
  stage.camera.track(box);
  addRandomBoxes(50,400,stage);
  other.setTarget({x:utils.random(200),y:utils.random(200)});
  stage.on('tick',function(){
    box.setTarget(stage.mouse);
    if(utils.distance(box,other.target) < 200){
      other.setTarget({x:utils.random(200),y:utils.random(200)});
    } 
  },this);
  //test framebox
  var img = $('<img src="https://raw.github.com/JAForbes/spacetoproceed/gh-pages/img/player.png">')[0];
  var fb = new FrameBox({stage:stage,img:img});
});