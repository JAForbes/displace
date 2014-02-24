utils = {
  radians : function(deg) {
    return deg * (Math.PI / 180);
  },

  degrees : function(rad) {
    return rad * (180 / Math.PI);
  },

  radiansFromCartesian: function(vector){
    return Math.atan2(vector.y,vector.x);
  },

  degreesFromCartesian: function(vector){
    return utils.degrees(utils.radiansFromCartesian(vector));
  },
  
  cartesianFromRadians: function(theta){
    return {x:Math.cos(theta),y:Math.sin(theta)};
  },

  unitVectorFromVector: function(vector){
    return Math.sqrt((vector.x*vector.x)+(vector.y*vector.y));
  },

  distanceAsCartesian: function(p1,p2){
    return {x:p2.x - p1.x,y:p2.y - p1.y};
  },

  distance: function(p1, p2) {
    var xs, ys;
    xs = ys = 0;
    xs = p2.x - p1.x;
    xs = xs * xs;
    ys = p2.y - p1.y;
    ys = ys * ys;
    return Math.sqrt(xs + ys);
  },

  /*Positive and negative numbers in a given boundary*/
  random: function(boundary){
    boundary = boundary || 1;
    return Math.random()*boundary*(Math.random()>0.5 ? 1 : -1);
  },


};