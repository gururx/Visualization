(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define(["d3/d3", "../common/SVGWidget", "../common/Palette", "./ITree", "../common/Text", "../common/FAChar", "css!./SunburstPartition"], factory);
    } else {
        root.SunburstPartition = factory(root.d3, root.SVGWidget, root.Palette, root.ITree, root.Text, root.FAChar);
    }
}(this, function (d3, SVGWidget, Palette, ITree, Text, FAChar) {
    function SunburstPartition(target) {
        SVGWidget.call(this);
        ITree.call(this);

        this._class = "sunburst";
    };
    SunburstPartition.prototype = Object.create(SVGWidget.prototype);
    SunburstPartition.prototype.implements(ITree.prototype);

    SunburstPartition.prototype.d3Color = Palette.ordinal("category20");

    SunburstPartition.prototype.enter = function (domNode, element) {
        var context = this;

        this.radius = Math.min(this.width(), this.height()) / 2;

        this.x = d3.scale.linear()
            .range([0, 2 * Math.PI])
        ;

        this.y = d3.scale.sqrt()
            .range([0, this.radius])
        ;

        this.partition = d3.layout.partition()
            .value(function (d) { return 1; })
        ;

        this.arc = d3.svg.arc()
            .startAngle(function (d) { return Math.max(0, Math.min(2 * Math.PI, context.x(d.x))); })
            .endAngle(function (d) { return Math.max(0, Math.min(2 * Math.PI, context.x(d.x + d.dx))); })
            .innerRadius(function (d) { return Math.max(0, context.y(d.y)); })
            .outerRadius(function (d) { return Math.max(0, context.y(d.y + d.dy)); })
        ;

        this.svg = element.append("g")
        ;
    };

    SunburstPartition.prototype.update = function (domNode, element) {
        var context = this;

        var path = this.svg.selectAll("path")
            .data(this.partition.nodes(this._data))
            .enter().append("path")
            .attr("d", this.arc)
            .style("fill", function (d) { return d.__viz_fill ? d.__viz_fill : context.d3Color(d.label); })
            .style("stroke", function (d) {
                return d.value > 16 ? "white" : "none";
            })
            .on("click", click)
        ;

        path.append("title")
            .text(function (d) { return d.label })
        ;

        function click(d) {
            path.transition()
                .duration(750)
                .attrTween("d", arcTween(d))
            ;
        }

        function arcTween(d) {
            var xd = d3.interpolate(context.x.domain(), [d.x, d.x + d.dx]),
                yd = d3.interpolate(context.y.domain(), [d.y, 1]),
                yr = d3.interpolate(context.y.range(), [d.y ? 20 : 0, context.radius]);
            return function (d, i) {
                return i
                    ? function (t) { return context.arc(d); }
                    : function (t) { context.x.domain(xd(t)); context.y.domain(yd(t)).range(yr(t)); return context.arc(d); };
            };
        }
    };

    return SunburstPartition;
}));
