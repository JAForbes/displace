function Mouse(options){ Box.call(this,options); }
Mouse.prototype = Object.create(Box.prototype);
_(Mouse.prototype).extend({

  initialize: function(){
    Box.prototype.initialize.call(this)
    this.handlers();
  },

  handlers : function(){
    var that = this;
    this.stage.$canvas.on('mousemove MSPointerMove touchmove',function(e){
      var tracking = stage.camera.tracking;
      that.x = (-stage.$canvas.width()/2 + e.offsetX) * 1/that.stage.camera._zoom;
      that.y = (-stage.$canvas.height()/2 + e.offsetY) * 1/that.stage.camera._zoom;
      

      that.x += tracking && tracking.x || 0
      that.y += tracking && tracking.y || 0 
    });
  }

});