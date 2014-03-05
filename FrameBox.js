function FrameBox(options){ Box.call(this,options); }
FrameBox.prototype = Object.create(Box.prototype);
_(FrameBox.prototype.defaults).extend({
	img: undefined,
});
_(FrameBox.prototype).extend({
	initialize: function(options){
		this.frame = new Frame();
		this.frame.reset(this.img);
		this.frame.playspeed(0.02);
		this.frame.scale(8);
		Box.prototype.initialize.call(this,options);
	},

	draw: function(){
		this.frame.x = this.x;
		this.frame.y = this.y;
		this.frame.next();
	},
});