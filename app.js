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
_(Mouse.prototype).extend(Basic.prototype,{
  
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
    this.stage.$canvas.on('mousemove MSPointerMove',function(e){
      that.x = e.offsetX - that.stage.$canvas.width()/2;
      that.y = e.offsetY - that.stage.$canvas.height()/2;
    });
  }

});


/*
  A Canvas Element That:

    - Fills the parent element to the specified ratio
    - Stays centered to the parent element
*/

function Stage(options){ Basic.call(this,options); }

_(Stage.prototype).extend(Basic.prototype, {
  defaults : {
    width_ratio:1,
    height_ratio:1,
    canvas_parent_selector: 'body',//jquery selector of element to contain canvas element
    background_color: '#EEE',//css color of canvas element
    className: 'stage',
    tickRate: 1000/60, //60 fps
  },

  initialize: function(options){
    this.buildCanvas();
    this.initMouse();
    var that = this;
    $(window).resize(function(){ that.resize.call(that); });
    this.resize();
    this.resetClock();
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
    this.context.translate(this.$canvas.width()/2,this.$canvas.height()/2);
    this.trigger('tick');
  },

  initMouse: function(){
    this.mouse = new Mouse({stage:this});
  },

  resize: function(){
    this.$canvas
      .prop({
        width:this.$parent.width()*this.width_ratio,
        height:this.$parent.height()*this.height_ratio
      });
    this.center();
    this.trigger('tick');
  },

  clear: function(){
    this.$canvas[0].width = this.$canvas[0].width;
  },

  center: function(){
    this.$canvas.css({
      x: (this.$parent.width()-this.$canvas.width())/2,
      y: (this.$parent.height()-this.$canvas.height())/2
    });
  },

});

function Box(options){ Basic.call(this,options); }
_(Box.prototype).extend(Basic.prototype,{
  
  defaults: {
    stage : undefined,
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    target: { x:0,y:0 },
    width: 20,
    height: 20,
    acceleration: 4
  },

  initialize: function(){
    this.stage.on('tick',function(){
      this.tick();
    },this);
  },

  setTarget: function(coords){
    this.target = _(coords).pick(['x','y']);
  },

  tick: function(){
    this.move();
    this.draw();
  },

  move: function(){
    this.x += this.vx;
    this.y += this.vy;
    var theta = utils.radiansFromCartesian(utils.distanceAsCartesian(this,this.target));
    var u = utils.cartesianFromRadians(theta);
    this.vx = u.x*this.acceleration;
    this.vy = u.y*this.acceleration;
  },

  draw: function(){
    this.stage.context.fillRect(this.x,this.y,this.width,this.height);
  },

});


$(function(){
  stage = new Stage({width_ratio:0.8, height_ratio:0.8});
  box = new Box({stage:stage});
  stage.on('tick',function(){
    box.setTarget(stage.mouse);
  },this);
});