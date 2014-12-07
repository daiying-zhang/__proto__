/**
 * @fileOverview
 * @author daiying.zhang
 */

(function(window, undefined){
    /**
     *
     * @param svgEle
     * @param {Entity} from
     * @param {Entity} to
     * @param index
     * @constructor
     */
    function Relation(svgEle, from, to, index){
        this.from = from;
        this.to = to;
        this.index = index;
        this.svgEle = svgEle;
        this.connectLine = null;
        if(svgEle && from && to){
            this.connect()
        }
    }

    M.extend(Relation.prototype, {
        addEntity : function (entity, type){
            this[type] = entity
        },

        connect : function (lineType){
            var self = this;
            var pos = self.getPosition();
            var path = pos && self.getPath(pos);
            if(path){
                self.createLine(path);
                //self.from.addMoveHandel(function(){
                //    self.updatePath()
                //});
                //self.to.addMoveHandel(function(){
                //    self.updatePath()
                //});
                self.from.on("move", function (){
                    self.updatePath()
                });
                self.from.on("mouseover", function (eve, index, currentLi){
                    if(self.index === index){
                        //Dom.addClass(self.from.dom, "highlight");
                        Dom.addClass(self.to.dom, "highlight");
                    }else{
                        //Dom.removeClass(self.from.dom, "highlight");
                        Dom.removeClass(self.to.dom, "highlight")
                    }
                    //Dom[self.index === index ? "addClass" : "removeClass"](self.to.dom, "highlight");
                });
                self.from.on("mouseout", function(eve){
                    //Dom.removeClass(self.from.dom, "highlight")
                    Dom.removeClass(self.to.dom, "highlight")
                });
                self.to.on("move", function (){
                    self.updatePath()
                });
                self.updateCanvas()
            }
        },

        updatePath : function (){
            var self = this;
            var pos = self.getPosition();
            var path = pos && self.getPath(pos);
            if(path){
                this.connectLine && Dom.attr(this.connectLine, "d", path)
            }
            self.updateCanvas()
        },

        updateCanvas : function (){
            //Dom.css(this.svgEle, {
            //    "width": (document.body.offsetWidth) + "px",
            //    "height": /*document.body.scrollHeight +*/ "1px"
            //})
        },

        createLine : function (path){
            //var svg = document.getElementById('j-svg');
            var svgPath = this.connectLine = document.createElementNS("http://www.w3.org/2000/svg", "path");
            Dom.attr(svgPath, {
                "d": path,
                "stroke" : "black",
                "fill" : "none",
                "stroke-width": "1",
                "marker-end": "url(#markerArrow)"
            });
            this.svgEle.appendChild(svgPath)
        },

        getPosition : function (){
            var from, to, Entity;
            if(this.from && this.to){
                from = this.from.dom;
                to = this.to.dom;
                Entity = this.from.constructor;
                return [
                    // start point
                    {
                        "left" : parseInt(from.style.left) + from.offsetWidth,
                        "top"  : parseInt(from.style.top) + (this.index + 0.5) * Entity.ENTITY_CELL_HEIGHT + Entity.ENTITY_HEADER_HEIGHT
                    },
                    // end point
                    {
                        "left" : parseInt(to.style.left),
                        "top"  : parseInt(to.style.top) + 14
                    }
                ]
            }
            return null
        },

        getPath : function(pos){
            var start = pos[0],
                end = pos[1];

            var startX = start.left,
                startY = start.top,
                endX = end.left < startX ? end.left + Entity.ENTITY_WIDTH + 10 : end.left - 10,
                endY = end.top;

            // 折线
            //return [
            //    //起点
            //    'M' , startX , startY ,
            //        //下中点
            //    'L' ,(endX + startX) / 2 , startY ,
            //        //上中点
            //    'L' , (endX + startX) / 2 , endY ,
            //        //终点
            //    'L' , endX , endY
            //].join(' ');
            // 贝塞尔曲线
            // <path d="M97 336 C288 339 143 55 327 51" />
            // tools http://blogs.sitepointstatic.com/examples/tech/svg-curves/cubic-curve.html
            return ['M' , startX , startY , 'C' , endX, startY, startX, endY, endX, endY].join(' ')

        }
    });

    window.Relation = Relation
})(this);