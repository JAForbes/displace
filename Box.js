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
    color: 'blue',
    friction: 0.968,
  },

  initialize: function(){
    this.handlers();
    this.stage.on('tick',function(){
      this.tick();
    },this);
  },

  handlers: function(){
  
  },

  actions: function(){

  },

  tick: function(){
    this.actions();
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