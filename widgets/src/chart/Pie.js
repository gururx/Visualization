(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define(["d3/d3", "../common/SVGWidget", "../common/Palette", "./IPie", "../common/Text", "../common/FAChar", "css!./Pie", 'goog!visualization,1,packages:[corechart,geochart]'], factory);
    } else {
        root.Pie = factory(root.d3, root.SVGWidget, root.Palette, root.IPie, root.Text, root.FAChar, root.goog);
    }
}(this, function (d3, SVGWidget, Palette, IPie, Text, FAChar,goog) {

    
    function Pie(tget) {
	SVGWidget.call(this);
        IPie.call(this);
    };
    Pie.prototype = Object.create(SVGWidget.prototype);
    Pie.prototype.implements(IPie.prototype);
  
    Pie.prototype.update = function (domNode, element) {
        var context = this;

		var data_arr = [['', '']];
                this._data.forEach(function(row) {
                    data_arr.push([row.label, row.weight]);
                });

		var colors =[];
		for (var i = 0; i < 30; i++) {
	            colors.push(this.randomHexColor());
        	}

		var chartOptions = {
		           // height: 400,
			   // width : 600,
		            colors: colors,
		            is3D: true,
			    legend: {alignment: 'center'}
	        };
	

	     var data = google.visualization.arrayToDataTable(data_arr);
             var chart = new google.visualization.PieChart(document.getElementById(this._target.id));
	     chart.draw(data, chartOptions);

    };

    Pie.prototype.randomHexColor = function(){
	 return '#' + (function co(lor) {
	        return (lor +=
                [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'a', 'b', 'c', 'd', 'e', 'f'][Math.floor(Math.random() * 16)])
                && (lor.length == 6) ? lor : co(lor);
	    })('');
    }

    return Pie;
}));
