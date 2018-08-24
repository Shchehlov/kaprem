 function Diagram(id,values) {

 	var _ = this;

 	_.maxVal = 100;
 	_.context = null;
 	_.startingAngle = 1.5*Math.PI;
 	_.centerX = 112;
 	_.centerY = 112;
 	_.endingAngle = [];

 	_.init = function(id,values) {

 		var canvas = document.getElementById(id);

 		if (canvas && values) {
 			_.context = canvas.getContext('2d');

 			_.context.lineWidth = 2;
 			_.context.strokeStyle = '#eaeaea';

 			_.context.beginPath();
 			_.context.arc(_.centerX, _.centerY, 109, 0, 2*Math.PI);
 			_.context.stroke();

 			_.context.beginPath();
 			_.context.arc(_.centerX, _.centerY, 85, 0, 2*Math.PI);
 			_.context.stroke();

 			_.context.beginPath();
 			_.context.arc(_.centerX, _.centerY, 61, 0, 2*Math.PI);
 			_.context.stroke();
 			

 			for (var i = 0; i < values.length; i++) {
 				_.draw(values[i],i);
 			}

 		}

 	};

 	_.draw = function(val,i) {

 		var endingAngle = _.calcPath(val,i),
 		style = _.pathStyle(i),
 		startingAngle = _.startingAngle;

 		_.endingAngle[i] = endingAngle;

 		if (i) {
 			startingAngle = _.endingAngle[i-1];
 		}

 		_.context.beginPath();
 		_.context.arc(_.centerX, _.centerY, style.r, startingAngle, endingAngle);
 		_.context.lineWidth = 4;
 		_.context.strokeStyle = style.c;
 		_.context.stroke();

 	};

 	_.calcPath = function(val,i) {
 		var pi2 = 2*Math.PI,
 		startingAngle = _.startingAngle;
 		if (i) {
 			startingAngle = _.endingAngle[i-1];
 		}
 		return (pi2*val/_.maxVal+startingAngle);
 	};

 	_.pathStyle = function(i) {
 		var style = {};
 		switch (i) {
 			case 0:
 			style = {r: 109, c: '#d0021b'}
 			break;
 			case 1:
 			style = {r: 85, c: '#e3b757'}
 			break;
 			case 2:
 			style = {r: 61, c: '#9095a3'}
 			break;
 		}
 		return style;
 	};

 	_.init(id,values);
 	
 }

 var diagramObject = [];
 function diagram(id,values) {
 	if (!(diagramObject[id] instanceof Diagram)) {
 		diagramObject[id] = new Diagram(id,values);
 	}
 }


 /*diagram bar*/
 $(document).ready(function() {
 	
 	$('.diagram-bar').each(function(i) {
 		var _$ = $(this),
 		group = _$.attr('data-group'),
 		perc = 0,
 		val = +_$.attr('data-val'),
 		comVal = 0;

 		$('.diagram-bar[data-group="'+ group +'"]').each(function() {
 			var v = +$(this).attr('data-val');
 			comVal += v;
 		});

 		perc = Math.round(val/(comVal/100));

 		var inner = '<div class="diagram-bar__val"><span class="diagram-bar__perc">'+ perc +'</span>% / '+ val +'</div><div class="diagram-bar__bar"><span style="width:'+ perc +'%"></span></div>';

 		_$.html(inner);

 	});
 });