/* A  Box That Moves Towards a target. */
function TargetBox(options){ Box.call(this,options); }
TargetBox.prototype = Object.create(Box.prototype);
_.extend(TargetBox.prototype.defaults,{
    target: { x:0,y:0 },
    stamina: 1,
    stamina_decrement : 0.0015,
    stamina_increment : 0.0015,
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
    if(this.target && utils.distance(this,this.target)> 30){
      var theta = utils.radiansFromCartesian(utils.distanceAsCartesian(this,this.target));
      var u = utils.cartesianFromRadians(theta);
      this.vx = u.x*this.speed * this.stamina;
      this.vy = u.y*this.speed * this.stamina;
      this.tire();
    } else {
      this.rest();
    }  
    this.x += this.vx;
    this.y += this.vy;
    this.vx *= this.friction;
    this.vy *= this.friction;
    this.changeColor();
  },
});