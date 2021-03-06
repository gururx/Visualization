(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define(["d3/d3", "./XYAxis", "./IBar", "../common/Palette", "css!./Line"], factory);
    } else {
        root.Line = factory(root.d3, root.XYAxis, root.IBar, root.Palette);
    }
}(this, function (d3, XYAxis, IBar, Palette) {
    function Line(target) {
        XYAxis.call(this);
        IBar.call(this);

        this._class = "line";
    };
    Line.prototype = Object.create(XYAxis.prototype);
    Line.prototype.implements(IBar.prototype);

    Line.prototype.d3Color = Palette.ordinal("category20");

    Line.prototype.enter = function (domNode, element) {
        XYAxis.prototype.enter.apply(this, arguments);
        var context = this;
    };

    Line.prototype.updateChart = function (domNode, element, margin, width, height) {
        var context = this;
        var d3Line = d3.svg.line()
            .x(function (d) {
                var label = "" + d.label;
                var d2 = label.substring(0, 4) + "-" + label.substring(4, 6) + "-" + label.substring(6, 8);
                return context.x(d.label) + (context.x.rangeBand ? context.x.rangeBand() / 2 : 0);
            })
            .y(function (d) { return context.y(d.weight); })
        ;

        var line = this.svgData.selectAll(".dataLine")
            .data(this._data)
        ;

        line.enter().append("path")
            .datum(function (d) { return d; })
            .attr("class", "dataLine")
            .style("stroke", function (d, i) { return context.d3Color(i); })
            .attr("d", d3Line)
        ;

        line
            .attr("d", d3Line)
        ;

        line.exit().remove();
    };

    return Line;
}));
