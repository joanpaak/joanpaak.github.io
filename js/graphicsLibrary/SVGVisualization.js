class SVGVisualization{
    constructor(svgElement, lim_x, lim_y, mar){
        
        if(svgElement === undefined){
          throw "You did not supply an svg element";  
        }
        
        if(lim_x == undefined){
            throw "You did not supply x limits";
        }
        
        if(lim_y === undefined){
            throw "You did not supply y limits";
        }
        
        if(mar === undefined){
            throw "You did not supply marginals";
        }
        
        if(mar.length != 4){
            throw "Incorrect number of marginals";
        }
        
        if(lim_x.length != 2){
            throw "Incorrect number of x limits";
        }
        
        if(lim_y.length != 2){
            throw "Incorrect number of y limits";
        }
        
        /**/
        
        this.svgElement = svgElement;
        
        this.height = parseFloat(svgElement.getAttribute("height"));
        //this.width = parseFloat(svgElement.getAttribute("width"));
        this.width = parseFloat(svgElement.width.baseVal.value);
        this.mar = mar;
        
        // Calculate the size of the inner canvas (the actual 
        // plotting area):
        this.canvasInnerHeight = this.height - (mar[0] + mar[2]);
        this.canvasInnerWidth  = this.width  - (mar[1] + mar[3]);
        
        // Calculate ranges and "stepsizes" for both axes, that is
        // how much one "data step" is in "canvas steps".
        
        /* ERROR: These might fail without any warning*/
        this.min_x   = lim_x[0];
        this.max_x   = lim_x[1];
        this.range_x = this.max_x - this.min_x;
        this.stepSize_x = this.canvasInnerWidth / this.range_x;
        
        this.min_y   = lim_y[0];
        this.max_y   = lim_y[1];
        this.range_y = this.max_y - this.min_y;
        this.stepSize_y = this.canvasInnerHeight / this.range_y;
        
        /**/
        
        this.defaultLineCol = "rgb(240, 140, 20)";
        this.defaultFillCol = "rgb(240, 60, 10)";
        this.defaultFontSize = "min(3vw, 12pt)"; // used to be 16pt, but this is slightly more general
        // Default numfont size for stuff on the y-axis
        // Th y-axis is - I think - in more dire need of scaling
        // since that's how things usually are scaled.
        this.defaultNumFontSize = "min(3vw, 12pt)";
        
    }
    
    drawXAxis(){
        const axis = document.createElementNS("http://www.w3.org/2000/svg", "line");
        axis.setAttribute("x1", this.mar[1]);
        axis.setAttribute("y1", this.height - this.mar[0]);
        axis.setAttribute("x2", this.width - this.mar[3]);
        axis.setAttribute("y2", this.height - this.mar[0]);
        axis.setAttribute("stroke", "black");
        axis.setAttribute("stroke-width", 2);
        
        this.svgElement.appendChild(axis);   
    }
    
    /* Axes, labels, tickmarks*/
    
    drawYAxis(){
        const axis = document.createElementNS("http://www.w3.org/2000/svg", "line");
        axis.setAttribute("x1", this.mar[1]);
        axis.setAttribute("y1", this.height - this.mar[0]);
        axis.setAttribute("x2", this.mar[1]);
        axis.setAttribute("y2", this.mar[2]);
        axis.setAttribute("stroke", "black");
        axis.setAttribute("stroke-width", 2);
        
        this.svgElement.appendChild(axis);         
    }
    
    drawAxes(){
        this.drawXAxis();
        this.drawYAxis();
    }
    
    addXLabel(labText){
       const axisLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
       axisLabel.setAttribute("y",  this.height - this.mar[0] + 40);
       axisLabel.setAttribute("x", this.transformXCoordinate((this.max_x + this.min_x) / 2.0));
       
       axisLabel.setAttribute("text-anchor", "middle");
       axisLabel.setAttribute("font-size", this.defaultFontSize);
       
       axisLabel.textContent = labText;
       this.svgElement.appendChild(axisLabel);
    }
    
    addYLabel(labText){
       const axisLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
       
       let xcoord = this.mar[1] / 2;
       let ycoord = this.transformYCoordinate((this.min_y + this.max_y) / 2.0);
       axisLabel.textContent = labText;
       axisLabel.setAttribute("font-size", this.defaultFontSize);
       axisLabel.setAttribute("x",xcoord);
       axisLabel.setAttribute("y",ycoord);
       axisLabel.setAttribute("transform", "rotate(270," + xcoord + "," + ycoord + ")");
       
       axisLabel.setAttribute("text-anchor", "middle");
       
       this.svgElement.appendChild(axisLabel);        
    }
    
    addMainLabel(labText){
       const axisLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
       axisLabel.setAttribute("y",  this.mar[2] / 2.0);
       axisLabel.setAttribute("x", this.transformXCoordinate((this.max_x + this.min_x) / 2.0));
       
       axisLabel.setAttribute("text-anchor", "middle");
       axisLabel.textContent = labText;
       axisLabel.setAttribute("font-size", "22pt");
       this.svgElement.appendChild(axisLabel);        
    }
    
    
    /*
     ERROR!!!! TRANSFORMATIONS ARE DONE ON THE INPUT ARRAYS
     WHICH ARE PASSED BY REFERENCE!! CLONE EVERYTHING!
     E.G Array.from(x)!!!!
     
     This is now done, but is a bit hacky.
    */
    
    addXTickmarks(NTicks, tickPlaces, tickLabels, NDecimals){
        let stepSize = this.canvasInnerWidth / (NTicks - 1);
        let stepSizeData = (this.max_x - this.min_x) / (NTicks - 1);
        
        if(NDecimals === undefined) NDecimals = 2;
        
        /*ERROR ADD SOME TESTS FOR THE INPUT HERE*/

        let tickPlaces_;
/* ERROR: This is a horrible hack! */
        if(tickPlaces === undefined){
            tickPlaces_ = new Array(NTicks);

            for(let i = 0; i < NTicks; i++){
                tickPlaces_[i] = this.mar[1] + i * stepSize;
              }   

        } else{
            tickPlaces_ = Array.from(tickPlaces)

            for(let i = 0; i < NTicks; i++){
               tickPlaces_[i] = tickPlaces_[i].toFixed(NDecimals);
               tickPlaces_[i] = this.transformXCoordinate(tickPlaces_[i]);                
            }

        }

        /*
        if(tickPlaces === undefined){
           tickPlaces = new Array(NTicks);
           
           for(let i = 0; i < NTicks; i++){
             tickPlaces[i] = this.mar[1] + i * stepSize;
           }         
        } else {
            
            tickPlaces = Array.from(tickPlaces);
            tickPlaces = new Array(NTicks);
            
            for(let i = 0; i < NTicks; i++){
               tickPlaces[i] = tickPlaces[i].toFixed(NDecimals);
               tickPlaces[i] = this.transformXCoordinate(tickPlaces[i]); 
            }
        }*/
        
        if(tickLabels === undefined){
            tickLabels = new Array(NTicks);
            
            for(let i = 0; i < NTicks; i++){
                let newlabel  = this.min_x + i * stepSizeData;
                tickLabels[i] = newlabel.toFixed(NDecimals); 
            }
        }

        // Now we start to actually draw the tick marks:
        
        for(let i = 0; i < NTicks; i++){
            const tmark = document.createElementNS("http://www.w3.org/2000/svg", "line");
            const tmarkText = document.createElementNS("http://www.w3.org/2000/svg", "text");
            
            tmarkText.textContent = tickLabels[i];
            tmarkText.setAttribute("x", tickPlaces_[i]);
            tmarkText.setAttribute("y", this.height - this.mar[0] + 20);
            tmarkText.setAttribute("text-anchor", "middle");
            
            tmarkText.setAttribute("font-size", this.defaultNumFontSize);
            
            tmark.setAttribute("x1", tickPlaces_[i]);
            tmark.setAttribute("y1", this.height - this.mar[0] - 5);
            tmark.setAttribute("x2", tickPlaces_[i]);
            tmark.setAttribute("y2", this.height - this.mar[0] + 5);
            tmark.setAttribute("stroke", "black");
            tmark.setAttribute("stroke-width", 2);
            
            this.svgElement.appendChild(tmark);
            this.svgElement.appendChild(tmarkText);
        }
    }
    
    addYTickmarks(NTicks, tickPlaces, tickLabels, NDecimals){
        let stepSize = this.canvasInnerHeight / (NTicks - 1);
        let stepSizeData = (this.max_y - this.min_y) / (NTicks - 1);
        if(NDecimals === undefined) NDecimals = 2;
        
        if(tickPlaces === undefined){
           tickPlaces = new Array(NTicks);
           
           for(let i = 0; i < NTicks; i++){
             tickPlaces[i] = this.height - this.mar[0] - i * stepSize;
           }         
        } else {
            /* ERROR: This is a horrible hack! */
            tickPlaces = Array.from(tickPlaces);
            tickLabels = new Array(NTicks);
         
            for(let i = 0; i < NTicks; i++){
               tickLabels[i] = tickPlaces[i].toFixed(NDecimals);
               
               tickPlaces[i] = this.transformYCoordinate(tickPlaces[i]);
               
            }
            
            

        }
        
        if(tickLabels === undefined){
            tickLabels = new Array(NTicks);
            
            for(let i = 0; i < NTicks; i++){
                let newlabel  = this.min_y + i * stepSizeData;
                tickLabels[i] = newlabel.toFixed(NDecimals); 
            }
        }
        // Now we start to actually draw the tick marks:
        
        for(let i = 0; i < NTicks; i++){
            const tmark = document.createElementNS("http://www.w3.org/2000/svg", "line");
            const tmarkText = document.createElementNS("http://www.w3.org/2000/svg", "text");
            
            tmarkText.textContent = tickLabels[i];
            tmarkText.setAttribute("y", tickPlaces[i]);
            tmarkText.setAttribute("x", this.mar[1] / 1.35);
            tmarkText.setAttribute("text-anchor", "middle");
            tmarkText.setAttribute("dominant-baseline", "middle");
            
            tmark.setAttribute("x1", this.mar[1] - 5);
            tmark.setAttribute("y1", tickPlaces[i]);
            tmark.setAttribute("x2", this.mar[1] + 5 );
            tmark.setAttribute("y2", tickPlaces[i]);
            tmark.setAttribute("stroke", "black");
            tmark.setAttribute("stroke-width", 2);
            
            this.svgElement.appendChild(tmark);
            this.svgElement.appendChild(tmarkText);
        }
    }
    
 
    /* These are the coordinate transforms to be used everywhere. If these don't work - then everything is fu... dged */
    
    transformXCoordinate(x){
        return this.mar[1] + (x - this.min_x) * this.stepSize_x;
    }
    
    transformYCoordinate(y){
        //return this.min_y + this.stepSize_y + this.height - this.mar[0] - y * this.stepSize_y;
        return this.min_y * this.stepSize_y + this.height - this.mar[0] - y * this.stepSize_y;
    }
    
    /**/
    
    clearCanvas(){
        while(this.svgElement.childElementCount > 0){
            this.svgElement.removeChild(this.svgElement.firstChild);
        }
    }
    
    /**/
    
    drawPoint(x, y, addTooltip){
        const point = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        point.setAttribute("cx", this.transformXCoordinate(x));
        point.setAttribute("cy", this.transformYCoordinate(y));
        point.setAttribute("r", 4);
        point.setAttribute("fill", "rgb(240, 140, 20)");
        
        if(addTooltip){
            const title = document.createElementNS("http://www.w3.org/2000/svg", "title");
            title.textContent = "X: " + x + " | Y: " + y;
            point.appendChild(title);
        }
        
        this.svgElement.appendChild(point);   
    }
    
    drawPoints(x, y, addTooltip){
        /*ERROR ADD EXCEPTIONS*/
        
        if(x.length != y.length){
          throw "Error in drawing points: x and y coordinates differ in length";
        }
        
        for(let i = 0; i < x.length; i++){
            this.drawPoint(x[i], y[i], addTooltip);
        }
    }
    
    drawLine(x, y, col){
        
        if(col === undefined) col = this.defaultLineCol;
        
        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("x1", this.transformXCoordinate(x[0]));
        line.setAttribute("y1", this.transformYCoordinate(y[0]));
        line.setAttribute("x2", this.transformXCoordinate(x[1]));
        line.setAttribute("y2", this.transformYCoordinate(y[1]));
        line.setAttribute("stroke", col);
        line.setAttribute("stroke-width", 2);
        
        this.svgElement.appendChild(line);        
    }

    drawLines(x, y, col){
    
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
        path.setAttribute("stroke", this.defaultLineCol);
        path.setAttribute("stroke-width", 2);
        
        this.svgElement.appendChild(path);
    }
    
    drawPolygon(x, y, col){
        if(col === undefined) col = this.defaultFillCol;
        
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
        
        polygon.setAttribute("fill", col);
        this.svgElement.appendChild(polygon);
        
    }
    
    addText(textToAdd, x, y){
        const newTextEl = document.createElementNS("http://www.w3.org/2000/svg", "text");
        
        newTextEl.textContent = textToAdd;
        newTextEl.setAttribute("y", this.transformYCoordinate(y));
        newTextEl.setAttribute("x", this.transformXCoordinate(x));
        newTextEl.setAttribute("text-anchor", "middle");
        newTextEl.setAttribute("alignment-baseline", "middle");
        newTextEl.setAttribute("font-size", this.defaultFontSize);

        this.svgElement.appendChild(newTextEl);        
    }
    
    /**/
    
    hline(y_){
    
        let y = this.transformYCoordinate(y_);
        this.drawLine([this.min_x, this.max_x], [y, y], 
          "rgba(0, 0, 0, 0.1)");
    }
    
    
    /* ERROR: Add vline*/
    
    /*
    ADD TITLES OR IDS TO ELEMENTS
    */
    
    /* Adds a title to the last element added */
    
    addTitleToLastElement(titleToAdd){
        const title = document.createElementNS("http://www.w3.org/2000/svg", "title");
        title.textContent = titleToAdd;
        this.svgElement.lastElementChild.appendChild(title);        
    }
    
    addIDToLastElement(idToAdd){
        this.svgElement.lastElementChild.setAttribute("id", idToAdd);
    }
    
    /*
    fill-opacity
    fill
    */
    setAttributeOfLastElement(attribute, value){
        this.svgElement.lastElementChild.setAttribute(attribute, value);
    }
}
