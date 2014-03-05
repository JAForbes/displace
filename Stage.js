/*
  A Canvas Element That:

    - Fills the parent element to the specified ratio
    - Stays centered to the parent element
*/
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
    this.translated = this.translated || {x:0,y:0};
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
    this.camera.tick();
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