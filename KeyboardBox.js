function KeyboardBox(options){ Box.call(this,options); }
KeyboardBox.prototype = Object.create(Box.prototype);
_(KeyboardBox.prototype).extend({

  actions: function(){
    Keys.down(this.UP) && (this.vy -= this.speed/100);
    Keys.down(this.LEFT) && (this.vx -= this.speed/100);
    Keys.down(this.DOWN) && (this.vy += this.speed/100);
    Keys.down(this.RIGHT) && (this.vx += this.speed/100);
    this.vx *= this.friction;
    this.vy *= this.friction;
  },

});
_(KeyboardBox.prototype.defaults).extend({
  UP: Keys.W,
  LEFT: Keys.A,
  RIGHT: Keys.D,
  DOWN: Keys.S,
  ACTION: Keys.SPACE
});