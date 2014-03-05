Keys = new function(){
  var active = {};

  //Initialize named key codes
    this.RETURN = this.ENTER = 13;
    this.CTRL = this.CONTROL = 17;
    this.SHIFT = 16;
    this.ALT = this.OPTION = 18;
    this[' '] = this.SPACE = 32;
    this['~'] = this.TILDE = 126;

    _.each(_.range(this.SPACE,this.TILDE),function(i){
      this[String.fromCharCode(i)] = i;
    },this);
  
  var that = this;
  $(window).on('keydown',function(e){
    active[e.keyCode] = active[e.keyCode] || 0;
    active[e.keyCode]++;
  });
  $(window).on('keyup',function(e){
    delete active[e.keyCode];
  });

  this.down = function(keycode){
    return keycode in active;
  };
};
