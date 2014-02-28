Basic = (function(){

  function Constructor(options){ 
    absorb(options,this,_.keys(this.defaults));
    _.defaults(this,this.defaults);
    this.initialize(options);
  }

  function absorb(properties,context,whitelist){
    if(properties && context){
      if(whitelist){
        properties = _(properties).pick(whitelist);
      }
      _.extend(context,properties);
    }
  }

  return Constructor;

})();
_(Basic.prototype).extend(Events,{ defaults : {}, initialize: function(options){} });



function Mouse(options){ Basic.call(this,options); }
Mouse.prototype = Object.create(Basic.prototype);
_(Mouse.prototype).extend({
  
  defaults: {
    stage : undefined,
    x: 0,
    y: 0
  },

  initialize: function(){
    this.handlers();
  },

  handlers : function(){
    var that = this;
    this.stage.$canvas.on('mousemove MSPointerMove touchmove',function(e){
      that.x = e.offsetX - that.stage.translated.x;
      that.y = e.offsetY - that.stage.translated.y;
    });
  }

});


/*
  A Canvas Element That:

    - Fills the parent element to the specified ratio
    - Stays centered to the parent element
*/

function Camera(options){ Basic.call(this,options); }
Camera.prototype = Object.create(Basic.prototype);
_(Camera.prototype).extend({
  tracking: undefined,
  stage: undefined,
  track: function(target){
    this.tracking = target || this.tracking;
    if(this.tracking){
      stage.context.translate(-this.tracking.x,-this.tracking.y);
    }
  }
});

function Stage(options){ Basic.call(this,options); }
Stage.prototype = Object.create(Basic.prototype);
_(Stage.prototype).extend({
  defaults : {
    width_ratio:1,
    height_ratio:1,
    canvas_parent_selector: 'body',//jquery selector of element to contain canvas element
    background_color: '#EEE',//css color of canvas element
    className: 'stage',
    tickRate: 1000/1000, //1000 fps
    width:0,
    height:0,
  },

  initialize: function(options){
    this.buildCanvas();
    this.initMouse();
    var that = this;
    $(window).resize(function(){ that.resize.call(that); });
    this.resize();
    this.resetClock();
    this.camera = new Camera({stage:this});
  },

  translate: function(x,y){
    this.translated = this.translated || {x:0,y:0}
    this.translated.x+=x;
    this.translated.y+=y;
    this.context.translate(x,y);
  },

  buildCanvas: function(){
    this.$parent = $(this.canvas_parent_selector);
    this.$canvas = $('<canvas>');
    this.context = this.$canvas[0].getContext('2d');
    this.$canvas
      .css({
        backgroundColor:this.background_color
      });
    this.resize();
    this.$parent.append(this.$canvas);
  },

  resetClock: function(){
    var that = this;
    clearInterval(this.clockID);
    this.clockID = setInterval(function(){
      that.tick.call(that);
    },this.tickRate);
  },

  tick: function(){
    this.clear();
    this.translate(this.$canvas.width()/2,this.$canvas.height()/2);
    this.camera.track();
    this.trigger('tick');
  },

  initMouse: function(){
    this.mouse = new Mouse({stage:this});
  },

  resize: function(){
    this.width = Math.floor(this.$parent.width()*this.width_ratio);
    this.height = Math.floor(this.$parent.height()*this.height_ratio);
    this.$canvas
      .prop({
        width:this.width,
        height:this.height
      });
    this.center();
    this.trigger('tick');
  },

  clear: function(){
    this.$canvas[0].width = this.$canvas[0].width;
    this.translated = {x:0,y:0};
  },

  center: function(){
    this.$canvas.css({
      x: (this.$parent.width()-this.$canvas.width())/2,
      y: (this.$parent.height()-this.$canvas.height())/2
    });
  },

});


/* A  Box That Moves Towards a target. */
function Box(options){ Basic.call(this,options); }
Box.prototype = Object.create(Basic.prototype);
_(Box.prototype).extend({
  
  defaults: {
    stage : undefined,
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    width: 10,
    height: 10,
    speed: 1,
    color: 'blue'
  },

  initialize: function(){
    this.stage.on('tick',function(){
      this.tick();
    },this);
  },

  tick: function(){
    this.move();
    this.draw();
  },

  move: function(){
    this.x += this.vx;
    this.y += this.vy;
  },

  draw: function(){
    this.stage.context.fillStyle = this.color;
    this.stage.context.fillRect(this.x-this.width/2,this.y-this.height/2,this.width,this.height);
  },

});



/* A  Box That Moves Towards a target. */
function TargetBox(options){ Box.call(this,options); }
TargetBox.prototype = Object.create(Box.prototype);
_.extend(TargetBox.prototype.defaults,{
    target: { x:0,y:0 },
    stamina: 1,
    stamina_decrement : 0.0015,
    stamina_increment : 0.0015
  });
_(TargetBox.prototype).extend({

  setTarget: function(coords){
    this.target = _(coords).pick(['x','y']);
  },

  tire: function(){
    if(this.stamina > 0.2){
      this.stamina -= this.stamina_decrement;
    }
    return this.stamina;
  },

  rest: function(){
    if(this.stamina < 1){
      this.stamina += this.stamina_increment;
    }
    return this.stamina;
  },

  changeColor: function(){
    this.color = 'rgb('+Math.floor(255*(1-this.stamina))+','+Math.floor(255*(this.stamina))+',0)';
  },

  move: function(){
    if(utils.distance(this,this.target)> 30){
      this.x += this.vx;
      this.y += this.vy;
      var theta = utils.radiansFromCartesian(utils.distanceAsCartesian(this,this.target));
      var u = utils.cartesianFromRadians(theta);
      this.vx = u.x*this.speed * this.stamina;
      this.vy = u.y*this.speed * this.stamina;
      this.tire();
    } else {
      vx = 0;
      vy = 0;
      this.rest();
    }
    this.x = this.x;
    this.y = this.y;
    this.changeColor();
  },

});

function maximiseBodyHeight(){
  $('body').height($(window).height());
}

function addRandomBoxes(numberOfBoxes,radius,stage){
  for(var i = 0; i < numberOfBoxes; i++){
    new Box({stage:stage,x:utils.random(radius),y:utils.random(radius)});
  }
}

$(function(){
  $(window).on('resize',maximiseBodyHeight);
  maximiseBodyHeight();
  stage = new Stage({width_ratio:1, height_ratio:1});
  box = new TargetBox({stage:stage});
  other = new TargetBox({stage:stage});

  stage.camera.track(box);
  addRandomBoxes(50,400,stage);
  stage.on('tick',function(){
    box.setTarget(stage.mouse);
    if(utils.distance(box,other.target) < 200){
      other.setTarget({x:utils.random(200),y:utils.random(200)});
    } 
  },this);
});