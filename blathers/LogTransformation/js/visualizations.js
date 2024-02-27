class DerivVis{
    constructor(){
        this.xslider = document.getElementById("deriVis_x");
        this.textField = document.getElementById("deriVis_text");

        this.minVal_x = parseFloat(this.xslider.min);
        this.maxVal_x = parseFloat(this.xslider.max);

        this.minVal_y = 0;
        this.maxVal_y = Math.exp(this.maxVal_x);

        this.xslider.addEventListener("input", e => this.drawDerivative());
    }

    initialize(){
        document.getElementById("derivVis").setAttribute("width", 
          Math.min(window.innerWidth * 0.8, 600));
        
        this.canvas = new SVGVisualization(document.getElementById("derivVis"), 
          [-1, this.maxVal_x], 
          [this.minVal_y, this.maxVal_y], 
          [70, 100, 70, 50]);  

        this.drawLogFunction();   
        this.drawDerivative();
    }

    drawOrigo(){
        this.canvas.drawLine([-1, this.maxVal_x], [0, 0]);
        this.canvas.svgElement.
            children[this.canvas.svgElement.children.length - 1].
            setAttribute("stroke", "rgba(0, 0, 0, 0.5)");
        this.canvas.svgElement.
            children[this.canvas.svgElement.children.length - 1].
            setAttribute("stroke-dasharray", [5, 3]);

        this.canvas.drawLine([0, 0], [this.minVal_y, this.maxVal_y]);
        this.canvas.svgElement.
            children[this.canvas.svgElement.children.length - 1].
            setAttribute("stroke", "rgba(0, 0, 0, 0.5)");
        this.canvas.svgElement.
            children[this.canvas.svgElement.children.length - 1].
            setAttribute("stroke-dasharray", [5, 3]);
    }

    drawLogFunction(){
        this.canvas.clearCanvas();
        let NPoints = 100;
        let xcoords = new Array(NPoints);
        let ycoords = new Array(NPoints);
        
        let stepSize = (this.maxVal_x - this.minVal_x) / (NPoints - 1);

        for(let i = 0; i < NPoints; i++){
            xcoords[i] = this.minVal_x + i * stepSize;
            ycoords[i] = Math.exp(xcoords[i]);
        }

        ///

        this.drawOrigo();

        this.canvas.drawAxes();
        
        this.canvas.addYLabel("Constrained");
        this.canvas.addXLabel("Unconstrained");
        this.canvas.addXTickmarks(5);
        this.canvas.addYTickmarks(5);

        this.canvas.drawLines(xcoords, ycoords);
    }

    drawDerivative(){
        if(document.getElementById("derivative") != null) {
            document.getElementById("derivative").remove();
        }
        if(document.getElementById("xline") != null) {
            document.getElementById("xline").remove();
        }

        let range = 1;
        let current_x = parseFloat(this.xslider.value);
        let NPoints = 50;

        let xcoords = new Array(NPoints);
        let ycoords = new Array(NPoints);

        let min_x = Math.max(current_x - range, -1);
        let max_x = current_x + range;

        let slope = Math.exp(current_x);
        let a = Math.exp(current_x) - current_x * slope;
        
        let stepSize = (max_x - min_x) / (NPoints - 1);

        for(let i = 0; i < NPoints; i++){
            xcoords[i] = min_x + i * stepSize;
            ycoords[i] = a + slope * xcoords[i];
        }       

        this.canvas.drawLines(xcoords, ycoords);
        this.canvas.svgElement.
            children[this.canvas.svgElement.children.length - 1].id = "derivative";
        this.canvas.svgElement.
            children[this.canvas.svgElement.children.length - 1].
            setAttribute("stroke", "red");

        this.canvas.drawLine(
            [current_x, current_x], 
            [this.minVal_y, Math.exp(current_x)]);
        this.canvas.svgElement.
            children[this.canvas.svgElement.children.length - 1].id = "xline";
        this.canvas.svgElement.
            children[this.canvas.svgElement.children.length - 1].
            setAttribute("stroke", "red");
        this.canvas.svgElement.
            children[this.canvas.svgElement.children.length - 1].
            setAttribute("stroke-dasharray", [5, 3]);

        this.textField.innerText = "When x is " + 
            current_x.toFixed(2) + " the derivative of exp(x) is " + 
            Math.exp(current_x).toFixed(3);
    }

    drawVisualization(){

    }
}

let dvis = new DerivVis();

function initializeVisualizations(){
  dvis.initialize();
}

window.onload   = initializeVisualizations;
window.onresize = initializeVisualizations;


