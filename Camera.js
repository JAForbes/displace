function Camera(options){ Basic.call(this,options); }
Camera.prototype = Object.create(Basic.prototype);
_(Camera.prototype).extend({
  tracking: undefined,
  stage: undefined,
  _zoom: 1,

  tick: function(){
    this.track();
  },

  zoom: (function(){
    var lastZoom = 1;//private
    return function(value,duration){
      var time = 0, begin = this._zoom, change = value - this._zoom; duration = duration || 100;
      this.listenTo(stage,'tick',function(){
        this._zoom = tweens.easeInQuad(time++, begin, change, duration);
        time > duration && this.stopListening(stage);
      },this);
    };
  })(), 

  track: function(target){
    this.tracking = target || this.tracking;
   stage.context.scale(this._zoom,this._zoom);
    if(this.tracking){
      stage.context.translate(-this.tracking.x,-this.tracking.y);
    }
  }
});