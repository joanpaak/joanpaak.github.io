/* 
Plotting library for Javascript inspired by base R.
*/

/*
Idea pyöristämiseen: etsi desimaalipisteen jälkeen ensimmäinen nolla! 
 */

function numberWang(x){
    x = `${x};`
    let b = x.split(".");
    if(b.length === 1) return 0;

    let nDecimals = b[1].indexOf("0");

    /* Ei ole näin yksinkertaista... ensin pitää 
       löytää ensmmäinen merkitsevä numero, sitten 
       siitä katsoa ns. taaksepäin*/

    return nDecimals;
}

class FigUtils{
    /**
     * Given the minimum and maximum values, this method
     * suggests reasonable tick places for drawing the 
     * x and y axes.
     * @param {Number} min 
     * @param {Number} max 
     * @returns Array of tick places
     */
    static calculateTickPlaces(min, max){
        let divisor = FigUtils.findOptimalDivisor(min, max);

        let tickMin = Math.round(min / divisor) * divisor;
        let tickMax = Math.round(max / divisor) * divisor;
        let nTicks = Math.round((tickMax - tickMin) / divisor);

        let ticks = new Array(nTicks);

        let magnitude = Math.floor(Math.log10(max - min));
        let scale = Math.max(0, -magnitude + 1);

        for(let i = 0; i <= nTicks; i++){
            ticks[i] = (tickMin + divisor * i).toFixed(scale);
        }

        return ticks;
    }

    /**
     * Tries to find a pretty divisor that would divide the range 
     * between the input min and max values into about five 
     * intervals.
     * @param {Number} max
     * @param {Number} min  
     * @returns The optimal divisor
     */
    static findOptimalDivisor(min, max){
        // ERROR: Prune this array. (But I don't want to think about it...). Just do it!!!! 
        let divisors = [0.1, 0.2, 0.25, 0.5, 1, 2, 2.5, 5, 10, 15, 20, 25, 50];
        let range = max - min;
        let scale = Math.floor(Math.log10(range));
    
        if(scale != 0){
            let scaler = Math.pow(10, scale);
            for(let i = 0; i < divisors.length; i++){
                divisors[i] *= scaler;
                // ERROR: What in the fuck is going on with that scaler/10 business?! 
                // It's SHIT!!!!
                divisors[i] = Math.round(divisors[i] / (scaler / 10)) * (scaler / 10);
            }
        }
    
        let ndivisions = new Array(divisors.length);
    
        for(let i = 0; i < divisors.length; i++){
            ndivisions[i] = Math.ceil(range / divisors[i]);
        }
    
        let curDivisor = divisors[0];
        let curMin     = Math.abs(ndivisions[0] - 5);
    
        for(let i = 1; i < divisors.length; i++){
            let ndiv = Math.abs(ndivisions[i] - 5);
    
            if(ndiv < curMin){
                curMin = ndiv;
                curDivisor = divisors[i];
            }
        }
    
        return curDivisor;
    }

    /* ERROR This is yet to be implemented
    static pointIsInsideRectangle(
        pointx, pointy, rectBottom, rectTop, rectLeft, rectRight){
            if(
                pointx > rectLeft && 
                pointx < rectRight && 
                pointy < rectTop && 
                pointy > rectBottom){
                    return true;
            }

            return false;
    }

    static elementsOverlap(element1, element2){
        let rect1 = element1.getBoundingClientRect();
        let rect2 = element2.getBoundingClientRect();

        if(rect1.x, rect2.y, rect2.bottom, rect2.top, rect2.left, rect2.right){
            return true;
        }

        return false;

    }*/
}

class Plot{
    constructor(svgElement, data, options){
        if(svgElement === undefined){
            throw "You must supply the svg element!";
        }

        if(svgElement.children.length > 0){
            console.warn("SVG element is not empty, " +  
             "are you sure you want to initialize plot " +
             "to element id " + svgElement.id);
        }

        this.opt = {
            type : "p",
            xlab : "x",
            ylab : "y",
            main : "",
            mar  : [80, 80, 50, 50],
            coerceToExponential : true,
            tickMarkFontSize : "min(3vw, 12pt)",
            labelFontSize : "min(3vw, 12pt)",
            textFontSize : "min(3vw, 12pt)",
            mainTitleFontSize : "22pt" ,
            pointColor : "rgb(240, 140, 20)",
            lineColor  : "rgb(240, 140, 20)",
            fillColor  : "rgb(240, 60, 10)",
            pointSize : 2.5,
            lineWidth : 1.25,
            axisWidth : 1.25,
            tickWidth : 1.25,
            axisColor : "black",
            lineType : "solid",
            lty2 : "4 4", // ERROR SHOULD BE CALCULATED FROM DATA?!
            lty3 : "2 2",
            xlim : undefined,
            ylim : undefined,
            ncurvePoints : 100 // ERROR not in use?!
        };

        if(options != undefined){
            Object.keys(options).forEach(option => {
                this.opt[option] = options[option];
            });
        }

        /* Handle cases in which either x or y or both are missing. 
           In practice there are two branches: one "dataless" branch in
           which we initialize an empty plot and one branch with data. */

        if(data === null || data === undefined){
            if(this.opt.xlim === undefined || this.opt.ylim === undefined){
                throw "When not supplying data, you must supply x and y limits";
            }
        } else {
            if(data.y === undefined){
                data.y = data.x;
                data.x = undefined;
            }
            if(data.x === undefined){
                data.x = new Array(data.y.length);

                for(let i  = 0; i < data.y.length; i++){
                    data.x[i] = i + 1;
                }
            }
        }
        
        /* Calculate limits for x and y and so on */

        if(this.opt.xlim === undefined){
            this.opt.xlim = [
                Math.min(...data.x),
                Math.max(...data.x)
            ];
        }

        if(this.opt.ylim === undefined){
            this.opt.ylim = [
                Math.min(...data.y),
                Math.max(...data.y)
            ];
        }

        /* The point of this part is to add some "leeway": we 
           want the plotting area to be slightly larger than
           the range of the data.  */
        let xdivisor = FigUtils.findOptimalDivisor(
            this.opt.xlim[0], this.opt.xlim[1]);
        let ydivisor = FigUtils.findOptimalDivisor(
            this.opt.ylim[0], this.opt.ylim[1]);

        this.figLimX = [
            this.opt.xlim[0] - xdivisor / 2,
            this.opt.xlim[1] + xdivisor / 2
        ];

        this.figLimY = [
            this.opt.ylim[0] - ydivisor / 2,
            this.opt.ylim[1] + ydivisor / 2
        ];

        this.svgElement = svgElement;
        this.dataGroup = 
            document.createElementNS("http://www.w3.org/2000/svg", "g");
        this.xaxisGroup = 
            document.createElementNS("http://www.w3.org/2000/svg", "g");
        this.yaxisGroup = 
            document.createElementNS("http://www.w3.org/2000/svg", "g");
        
        this.svgElement.replaceChildren(
                this.dataGroup,
                this.xaxisGroup,
                this.yaxisGroup 
        );

        this.height = parseFloat(svgElement.clientHeight);
        this.width  = parseFloat(svgElement.clientWidth);
     	
        this.canvasInnerHeight = this.height - 
            (this.opt.mar[0] + this.opt.mar[2]);
        this.canvasInnerWidth  = this.width  - 
            (this.opt.mar[1] + this.opt.mar[3]);
        
        this.range_x = this.figLimX[1] - this.figLimX[0];
        this.stepSize_x = this.canvasInnerWidth / this.range_x;
        
        this.range_y = this.figLimY[1] - this.figLimY[0];
        this.stepSize_y = this.canvasInnerHeight / this.range_y;
 
        /* */

        if(this.opt.xtickPlaces === undefined){
            this.opt.xtickPlaces = FigUtils.calculateTickPlaces(this.opt.xlim[0], this.opt.xlim[1]);
        }

        if(this.opt.ytickPlaces === undefined){
            this.opt.ytickPlaces = FigUtils.calculateTickPlaces(this.opt.ylim[0], this.opt.ylim[1]);
        }

        this.drawXAxis(
            {
                label : this.opt.xlab,
                tickPlaces : this.opt.xtickPlaces
            }
        );
        this.drawYAxis(
            {
                label : this.opt.ylab,
                tickPlaces : this.opt.ytickPlaces
            }
        );

        this.addMainTitle(this.opt.main);
        
        /* ERROR: I don't like at all that this is tested
           again here, but oh well...*/
        if(data != null || data != undefined){
            if(this.opt.type === "l"){
                this.drawLines(data.x, data.y);
            } else if(this.opt.type === "p"){
                this.drawPoints(data.x, data.y);
            }
        } 
    }

    /*  AXES */

    /* ERROR: rename. What this does is that it checks if the 
      ticklanel is too long and if it is it changes it into the 
      exponential format. 10000 -> 1e5*/
    checkTicklabels(tickLabels){
        let longerThanFour = false;

        for(let i = 0; i < tickLabels.length; i++){
            let l = Math.abs(Math.log10(parseFloat(tickLabels[i])));
            if(tickLabels[i] != 0 & l >= 4){
                longerThanFour = true;
                break;
            }
        }

        if(longerThanFour){
            for(let i = 0; i < tickLabels.length; i++){
                tickLabels[i] = parseFloat(tickLabels[i]).toExponential();
            }
        }

        return tickLabels;
    }

    drawXAxis(options){
        if(options.tickPlaces === undefined){
            options.tickPlaces = 
            FigUtils.calculateTickPlaces(this.opt.xlim[0], this.opt.xlim[1])
        }

        this.clearAxis("x");
        this.drawXAxisLine();
        this.drawXTickmarks(options.tickPlaces, options.tickMarks)
        this.addXLabel(options.label);
    }

    drawXAxisLine(){
        const axis = document.createElementNS("http://www.w3.org/2000/svg", "line");
        axis.setAttribute("x1", this.opt.mar[1]);
        axis.setAttribute("y1", this.height - this.opt.mar[0]);
        axis.setAttribute("x2", this.width - this.opt.mar[3]);
        axis.setAttribute("y2", this.height - this.opt.mar[0]);
        axis.setAttribute("stroke", this.opt.axisColor);
        axis.setAttribute("stroke-width", this.opt.axisWidth);
        
        this.xaxisGroup.appendChild(axis);   
    }

    drawXTickmarks(tickPlaces, tickLabels){
        if(tickLabels === undefined) {
            tickLabels = Array.from(tickPlaces);
            tickLabels = this.checkTicklabels(tickLabels);
        }

        for(let i = 0; i < tickPlaces.length; i++){
            const tmark = document.createElementNS("http://www.w3.org/2000/svg", "line");
            const tmarkText = document.createElementNS("http://www.w3.org/2000/svg", "text");
            
            tmarkText.textContent = tickLabels[i];
            tmarkText.setAttribute("x", this.transformXCoordinate(tickPlaces[i]));
            tmarkText.setAttribute("y", this.height - this.opt.mar[0] + 20); // ERROR GET RID OF THIS CONSTANT
            tmarkText.setAttribute("text-anchor", "middle")
            tmarkText.setAttribute("font-size", this.opt.tickMarkFontSize);
            tmarkText.classList.add("tickmarkText");
            
            tmark.setAttribute("x1", this.transformXCoordinate(tickPlaces[i]));
            tmark.setAttribute("y1", this.height - this.opt.mar[0] - 5); // ERROR GET RID OF CONSTANT
            tmark.setAttribute("x2", this.transformXCoordinate(tickPlaces[i]));
            tmark.setAttribute("y2", this.height - this.opt.mar[0] + 5); // ERROR GET RID OF CONSTANT
            tmark.setAttribute("stroke", "black");
            tmark.setAttribute("stroke-width", this.opt.tickWidth);
            tmark.classList.add("tickmark");
            
            this.xaxisGroup.appendChild(tmark);
            this.xaxisGroup.appendChild(tmarkText);
        }
    }

    addXLabel(labText){
        if(this.xaxisGroup.getElementsByClassName("axisLabel").length > 0){
            this.xaxisGroup.getElementsByClassName("axisLabel")[0].remove();
        }

        const axisLabel = 
            document.createElementNS("http://www.w3.org/2000/svg", "text");
        axisLabel.setAttribute("y",  
            this.height - this.opt.mar[0] + 40); // ERROR GET RID OF THIS CONSTANT
        axisLabel.setAttribute("x", 
            this.transformXCoordinate((this.figLimX[0] + this.figLimX[1]) / 2.0));
        axisLabel.setAttribute("text-anchor", "middle");
        axisLabel.setAttribute("font-size", this.opt.labelFontSize);
        axisLabel.classList.add("axisLabel");
        
        axisLabel.textContent = labText;
        this.xaxisGroup.appendChild(axisLabel);
    }

    drawYAxis(options){
        if(options.tickPlaces === undefined){
            options.tickPlaces = 
            FigUtils.calculateTickPlaces(this.opt.ylim[0], this.opt.ylim[1])
        }
        this.clearAxis("y");
        this.drawYAxisLine();
        this.drawYTickmarks(options.tickPlaces, options.tickMarks)
        this.addYLabel(options.label);
    }
    drawYAxisLine(){
        const axis = document.createElementNS("http://www.w3.org/2000/svg", "line");
        axis.setAttribute("x1", this.opt.mar[1]);
        axis.setAttribute("y1", this.height - this.opt.mar[0]);
        axis.setAttribute("x2", this.opt.mar[1]);
        axis.setAttribute("y2", this.opt.mar[2]);
        axis.setAttribute("stroke", this.opt.axisColor);
        axis.setAttribute("stroke-width", this.opt.axisWidth);
        
        this.yaxisGroup.appendChild(axis);         
    }
    
    drawYTickmarks(tickPlaces, tickLabels){    
        if(tickLabels === undefined) {
            tickLabels = Array.from(tickPlaces);
            tickLabels = this.checkTicklabels(tickLabels);
        }
            
        for(let i = 0; i < tickPlaces.length; i++){
            const tmark = document.createElementNS("http://www.w3.org/2000/svg", "line");
            const tmarkText = document.createElementNS("http://www.w3.org/2000/svg", "text");
            
            tmarkText.textContent = tickLabels[i];
            tmarkText.setAttribute("x", this.opt.mar[1] / 1.35); // ERRROR: GET RID OF THAT CONSTANT
            tmarkText.setAttribute("y", this.transformYCoordinate(tickPlaces[i]));
            tmarkText.setAttribute("text-anchor", "middle");
            tmarkText.setAttribute("dominant-baseline", "middle");
            tmarkText.setAttribute("transform", 
               `rotate(270 ${this.opt.mar[1] / 1.35} ${this.transformYCoordinate(tickPlaces[i])})`);
            tmarkText.classList.add("tickMarkText");   
            
            tmark.setAttribute("x1", this.opt.mar[1] - 5); // ERROR GET RID OF CONSTANT
            tmark.setAttribute("y1", this.transformYCoordinate(tickPlaces[i]));
            tmark.setAttribute("x2", this.opt.mar[1] + 5 ); // ERROR GET RID OF CONSTANT
            tmark.setAttribute("y2", this.transformYCoordinate(tickPlaces[i]));
            tmark.setAttribute("stroke", "black");
            tmark.setAttribute("stroke-width", this.opt.tickWidth);
            tmark.classList.add("tickMark");
            
            this.yaxisGroup.appendChild(tmark);
            this.yaxisGroup.appendChild(tmarkText);
        }
    }

    addYLabel(labText){
        const axisLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
       
        let xcoord = this.opt.mar[1] / 2;
        let ycoord = this.transformYCoordinate((this.figLimY[1] + this.figLimY[0]) / 2.0); 
        axisLabel.textContent = labText;
        axisLabel.setAttribute("font-size", this.opt.labelFontSize);
        axisLabel.setAttribute("x",xcoord);
        axisLabel.setAttribute("y",ycoord);
        axisLabel.setAttribute("transform", "rotate(270," + xcoord + "," + ycoord + ")");
        axisLabel.setAttribute("text-anchor", "middle");
        
        this.yaxisGroup.appendChild(axisLabel);      
    }

    /* DATA */

    drawPoint(x, y, addTooltip){
        const point = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        point.setAttribute("cx", this.transformXCoordinate(x));
        point.setAttribute("cy", this.transformYCoordinate(y));
        point.setAttribute("r", this.opt.pointSize);
        point.setAttribute("fill", this.opt.pointColor);
        
        if(addTooltip){
            const title = document.createElementNS("http://www.w3.org/2000/svg", "title");
            title.textContent = "X: " + x + " | Y: " + y;
            point.appendChild(title);
        }
        
        this.dataGroup.appendChild(point);
        
        return point;
        
    }
    
    drawPoints(x, y, addTooltip){
        if(x === undefined || y === undefined){
            throw "Error in drawPoints -- x or y undefined";
        }

        if(x.length != y.length){
          throw "Error in drawing points: x and y coordinates differ in length";
        }

        // ERROR: DO SOMETHING FOR THESE... UGH!! 
        if(addTooltip === undefined) addTooltip = true;
        
        for(let i = 0; i < x.length; i++){
            this.drawPoint(x[i], y[i], addTooltip);
        }
    }

    /**
     * 
     * @param {Number[]} x 
     * @param {Number[]} y 
     * @param {*} col 
     * @returns The line SVG element
     */
    drawLine(x, y, opt){

        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("x1", this.transformXCoordinate(x[0]));
        line.setAttribute("y1", this.transformYCoordinate(y[0]));
        line.setAttribute("x2", this.transformXCoordinate(x[1]));
        line.setAttribute("y2", this.transformYCoordinate(y[1]));
        line.setAttribute("stroke", this.opt.lineColor);
        line.setAttribute("stroke-width", this.opt.lineWidth);

        if(opt != undefined){
            if(opt.lty === 2){
                line.setAttribute("stroke-dasharray", this.opt.lty2);
            }
            if(opt.lty === 3){
                line.setAttribute("stroke-dasharray", this.opt.lty3);
            }

            Object.keys(opt).forEach(key => {
                line.setAttribute(key, opt[key]);
            });
        }

        this.dataGroup.appendChild(line);        
        this.applyCustomOptions(line);

        return line;
    }

    drawLines(x, y, opt){
         if(x.length != y.length){
          throw "Error in drawing lines: x and y coordinates differ in length";
        }   
        
        let d = "";
        
        d += "M" + this.transformXCoordinate(x[0]) + " " + this.transformYCoordinate(y[0]);
        
        for(let i = 1; i < x.length; i++){
            d += "L" + this.transformXCoordinate(x[i]) + " " + this.transformYCoordinate(y[i]); 
        }
        
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", d);
        path.setAttribute("fill", "none");
        path.setAttribute("stroke", this.opt.lineColor);
        path.setAttribute("stroke-width", this.opt.lineWidth);

        this.applyCustomOptions(path, opt);
        
        this.dataGroup.appendChild(path);
        return path;
    }

    drawPolygon(x, y, opt){
        if(x.length != y.length){
          throw "Error in drawing a polygon: x and y coordinates differ in length";
        }
        
        const polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
        
        for(let i = 0; i < x.length; i++){
            let newPoint = this.svgElement.createSVGPoint();
            newPoint.x = this.transformXCoordinate(x[i]);
            newPoint.y = this.transformYCoordinate(y[i]);
            polygon.points.appendItem(newPoint);
        }
        
        this.dataGroup.appendChild(polygon);  
        this.applyCustomOptions(polygon, opt);

        return polygon; 
    }

    drawCurve(f, min, max, opt){
        let n = 100;
        let x = new Array(n);
        let y = new Array(n);

        let stepSize = (max - min) / (n - 1);

        for(let i = 0; i < n; i++){
            x[i] = min + i * stepSize;
            y[i] = f.call(null, x[i]);
        }

        let line = this.drawLines(x, y, opt);
        return line;
    }

    hline(ycoord, opt){
        let line = this.drawLine(this.figLimX, [ycoord, ycoord], opt);
        return line;
    }

    vline(xcoord, opt){
        let line = this.drawLine([xcoord, xcoord], this.figLimY, opt);
        return line;
    }

    addText(text, x, y, opt){
        const newTextEl = document.createElementNS("http://www.w3.org/2000/svg", "text");
        
        newTextEl.textContent = text;
        newTextEl.setAttribute("y", this.transformYCoordinate(y));
        newTextEl.setAttribute("x", this.transformXCoordinate(x));
        newTextEl.setAttribute("text-anchor", "middle");
        newTextEl.setAttribute("alignment-baseline", "middle");
        newTextEl.setAttribute("font-size", this.opt.textFontSize);

        this.applyCustomOptions(newTextEl, opt);

        this.dataGroup.appendChild(newTextEl);

        return newTextEl;
    }

    /*  */

    addMainTitle(labText){
        const axisLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
        axisLabel.setAttribute("y",  this.opt.mar[2] / 2.0); // ERROR: Get rid of that division
        axisLabel.setAttribute("x", this.transformXCoordinate((this.figLimX[1] + this.figLimX[0]) / 2.0))
        axisLabel.setAttribute("text-anchor", "middle");
        axisLabel.textContent = labText;
        axisLabel.setAttribute("font-size", this.opt.mainTitleFontSize);

        this.svgElement.appendChild(axisLabel);   
    }


     /* UTLIITY FUNCTIONS */


     /* ERROR: How values beyond x and y limits are handled now is GARBAGE. 
       It's fine for something like a line that goes beyond the limits but 
       it does not make any sense for e.g. points. Why should a point that's 
       beyond the limits be transported to the drawing area?! GARBAGE!!!!  */
    transformXCoordinate(x){
        let coord = this.opt.mar[1] + (x - this.figLimX[0]) * this.stepSize_x;

        if(x < this.figLimX[0]) return this.transformXCoordinate(this.figLimX[0]);
        if(x > this.figLimX[1]) return this.transformXCoordinate(this.figLimX[1]);
        
        return coord;
    }
    
    transformYCoordinate(y){
        let coord = this.height - this.opt.mar[0] - 
            (y - this.figLimY[0]) * this.stepSize_y;

        if(y < this.figLimY[0]) return this.transformYCoordinate(this.figLimY[0]);
        if(y > this.figLimY[1]) return this.transformYCoordinate(this.figLimY[1]);

        return coord;
    }

    // ERROR: Have everything be in their own groups!
    clearAxis(axis){
        if(axis === "x"){
            this.xaxisGroup.replaceChildren([]);
        } else if(axis === "y"){
            this.yaxisGroup.replaceChildren([]);
        } else {
            throw "Unable to clear axis " + axis;
        }
    }

    clearData(){
        this.dataGroup.replaceChildren([]);
    }

    clearCanvas(){
        // ERROR: Should clear everything EXCEPT the groups! 
        this.svgElement.replaceChildren([]);
    }

    applyCustomOptions(element, opt){
        if(opt != undefined){
            if(opt.lty === 2){
                element.setAttribute("stroke-dasharray", this.opt.lty2);
            }

            if(opt.lty === 3){
                element.setAttribute("stroke-dasharray", this.opt.lty3);
            }

            Object.keys(opt).forEach(key => {
                element.setAttribute(key, opt[key]);
            });

            if(opt.label != undefined){
                let lab = document.createElementNS("http://www.w3.org/2000/svg", "title");
                lab.textContent = opt.label;
                element.appendChild(lab);
            } 

            if(opt.rotation != undefined){
                // ERROR: This is shit and works like shit!!!!!!

                let pt = element.getAttribute("transform");
                let bcr1 = this.svgElement.getBoundingClientRect();
                let bcr2 = element.getBoundingClientRect();
                element.setAttribute(
                    "transform",  
                    pt + `rotate(${opt.rotation} ${bcr2.x - bcr1.x} ${bcr2.y - bcr1.y})`);
            }
        }
    }
}

/*

ERROR: This are to be implemented sometime in the future.

const kernelFunctions = {
    gaussian : function(x, x0, h){
        return 1 / Math.sqrt(2 * Math.PI * h) * 
            Math.exp(-0.5 * Math.pow((x - x0)/h, 2));
    },

    rectangular : function(x, x0, h){
        if(Math.abs(x - x0) < h){
            return 1.0 / h;
        } else {
            return 0.0;
        }
    }
}

function density(x, kernel, options){

    // ERROR This does not work this linearly
    let opt = {
        n : 100, 
        min : Math.min(...x) - 1.0,
        max : Math.max(...x) - 1.0,
        h : 1.0 // ERROR
    };

    let k;

    if(kernel === undefined){
        k = kernelFunctions.gaussian;
    } else {
        k = kernel;
    }

    if(options != undefined){
        Object.keys(options).forEach(option => {
            opt[option] = options[option];
        });
    }

    let stepSize = (opt.max - opt.min) / (opt.n - 1);

    let densityX = new Array(opt.n);
    let densityY = new Array(opt.n).fill(0);

    for(let i = 0; i < opt.n; i++){
        densityX[i] = opt.min + i * stepSize;

        for(let j = 0; j < x.length; j++){
            densityY[i] += k.call(null, x[j], densityX[i], opt.h);
        }

        densityY[i] /=  x.length;
    }

    return {
        x : densityX,
        y : densityY
    };
}

class KDE extends Plot{
    constructor(data, options){
        if(options.kernel === "undefined"){
            options.kernel = "gaussian";
        }

        let x = new Array(options.nKdePoints);
    }

}

class Histogram extends Plot{
    constructor(data, options){
        
    }

    createBins(){

    }
}
*/