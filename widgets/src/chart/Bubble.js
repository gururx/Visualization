(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define(["d3/d3", "../common/SVGWidget", "./I2DChart", "../common/Palette", "../common/Text", "../common/FAChar", "css!./Bubble"], factory);
    } else {
        root.Bubble = factory(root.d3, root.SVGWidget, root.I2DChart, root.Palette, root.Text, root.FAChar);
    }
}(this, function (d3, SVGWidget, I2DChart, Palette, Text, FAChar) {
    function Bubble(target) {
        SVGWidget.call(this);
        I2DChart.call(this);

        this._class = "bubble";

        this.labelWidgets = {};

        this.d3Pack = d3.layout.pack()
            .sort(function (a, b) { return a < b ? -1 : a > b ? 1 : 0; })
            .size([this.width(), this.height()])
            .value(function (d) { return d.weight; })
        ;
    };
    Bubble.prototype = Object.create(SVGWidget.prototype);
    Bubble.prototype.implements(I2DChart.prototype);

    Bubble.prototype.d3Color = Palette.ordinal("category20");

    Bubble.prototype.size = function (_) {
        var retVal = SVGWidget.prototype.size.apply(this, arguments);
        if (arguments.length) {
            this.d3Pack
                .size([this.width(), this.height()])
            ;
        }
        return retVal;
    };

    Bubble.prototype.update = function (domNode, element) {
        var context = this;

        var node = element.selectAll(".node")
            .data(this._data.length ? this.d3Pack.nodes({ children: this._data }).filter(function (d) { return !d.children; }) : [], function (d) { return d.label; })            
        ;

        //  Enter  ---
        node.enter().append("g")
            .attr("class", "node")
            .attr("opacity", 0)
            .on("click", function (d) {
                context.click(d);
            })
            .each(function (d) {
                var element = d3.select(this);
                element.append("circle")
                    .attr("r", function (d) { return d.r; })
                    .style("fill", function (d) { return context.d3Color(d.label); })
                    .append("title")
                ;
                if (d.__viz_faChar) {
                    context.labelWidgets[d.label] = new FAChar()
                        .char(d.__viz_faChar)
                        .target(this)
                        .render()
                    ;
                } else {
                    context.labelWidgets[d.label] = new Text()
                        .text(d.label)
                        .target(this)
                        .render()
                    ;
                }
            })
        ;

        //  Update  ---
        node.transition()
            .attr("opacity", 1)
            .each(function (d) {
                var element = d3.select(this);
                var pos = { x: d.x - context._size.width / 2, y: d.y - context._size.height / 2 }
                element.select("circle").transition()
                    .attr("transform", function (d) { return "translate(" + pos.x + "," + pos.y + ")"; })
                    .attr("r", function (d) { return d.r; })
                    .select("title")
                        .text(function (d) { return d.label + " (" + d.weight + ")"; })
                ;
                if (d.__viz_faChar) {
                    context.labelWidgets[d.label]
                        .pos(pos)
                        .render()
                    ;
                } else {
                    var label = d.label;
                    var labelWidth = context.labelWidgets[d.label].getBBox().width;
                    if (d.r * 2 < 16) {
                        label = "";
                    } else if (d.r * 2 < labelWidth) {
                        label = label[0] + "...";
                    }
                    context.labelWidgets[d.label]
                        .pos(pos)
                        .text(label)
                        .render()
                    ;
                }
            })
        ;

        //  Exit  ---
        node.exit().transition()
            .style("opacity", 0)
            .remove()
        ;
    };

    return Bubble;
}));
