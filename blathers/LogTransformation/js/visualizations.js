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
        
        this.canvas = new Plot(
			document.getElementById("derivVis"), 
			null,
			{ 
				xlim : [-1, this.maxVal_x],
				ylim : [this.minVal_y, this.maxVal_y],
				ylab : "Constrained",
				xlab : "Unconstrained"
			});  

		this.canvas.hline(0, {"stroke-dasharray" : [4, 4], "stroke" : "black"});
		this.canvas.vline(0, {"stroke-dasharray" : [4, 4], "stroke" : "black"})
        this.drawLogFunction();   
        this.drawDerivative();
    }

    drawLogFunction(){
		if(this.logFunc) this.logFunc.remove();
        let NPoints = 100;
        let xcoords = new Array(NPoints);
        let ycoords = new Array(NPoints);
        
        let stepSize = (this.maxVal_x - this.minVal_x) / (NPoints - 1);

        for(let i = 0; i < NPoints; i++){
            xcoords[i] = this.minVal_x + i * stepSize;
            ycoords[i] = Math.exp(xcoords[i]);
        }
        
        this.logFunc = this.canvas.drawLines(xcoords, ycoords);
    }

    drawDerivative(){
		if(this.tangentLine) this.tangentLine.remove();
		if(this.xline) this.xline.remove();

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

        this.tangentLine = this.canvas.drawLines(
			xcoords, 
			ycoords,
			{
				"stroke" : "black"
			});
        this.xline = this.canvas.drawLine(
            [current_x, current_x], 
            [this.minVal_y, Math.exp(current_x)],
            {
				"stroke-dasharray" : [4, 4],
				"stroke" : "red"
			});

        this.textField.innerText = "When x is " + 
            current_x.toFixed(2) + " the derivative of exp(x) is " + 
            Math.exp(current_x).toFixed(3);
    }
}

let dvis = new DerivVis();

function initializeVisualizations(){
  dvis.initialize();
}

window.onload   = initializeVisualizations;
window.onresize = initializeVisualizations;


