"use strict";

/*
NOTE: classes extending this 
*/
class ROEXDrawer{
    constructor(visName){
        
        this.visName = visName;
        
        /* Define controls*/
        this.rSlider = document.getElementById(this.visName + "_r");
        this.pSlider = document.getElementById(this.visName + "_p");
        
        this.rText = document.getElementById(this.visName + "_r_text");
        this.pText = document.getElementById(this.visName + "_p_text");
        
        this.rSlider.addEventListener("input", e => this.drawVisualization());
        this.pSlider.addEventListener("input", e => this.drawVisualization());        
    }
    
    
    initialize(){
        
        if(this.x === undefined){
            this.f0    = 1000;
            if(this.min_x === undefined) this.min_x = 500;
            if(this.max_x === undefined) this.max_x = 1500;
            
            this.N = 200; 
            this.stepSize = (this.max_x - this.min_x) / (this.N - 1);
            
            this.x = new Array(this.N);
            
            for(let i = 0; i < this.N; i++){
                this.x[i] = this.min_x + i * this.stepSize;
            }            
        }
                     
        document.getElementById(this.visName).setAttribute("width", 
          Math.min(window.innerWidth * 0.8, 600));
        this.canvas = new SVGVisualization(document.getElementById(this.visName), 
          [this.min_x, this.max_x], [0, 1], [70, 70, 70, 50]);
          
        this.drawVisualization();
    }
    
    drawFilter(){
        this.canvas.clearCanvas();
        this.canvas.drawAxes();
        
        let r = parseFloat(this.rSlider.value);
        let p = parseFloat(this.pSlider.value);
        
        this.rText.innerText = r.toFixed(2);
        this.pText.innerText = p.toFixed(2);
        
        /* Calculate the filter */
        
        /* Magnitude of the filter's response */
        let respMagn = new Array(this.N);
        
        for(let i = 0; i < this.N; i++){
            respMagn[i] = W(g(this.x[i], this.f0), Math.pow(10, r/10), p);
        }
        
        this.canvas.drawLines(this.x, respMagn);
        this.canvas.addTitleToLastElement("Weight of the filter");
        this.canvas.drawLine([this.f0, this.f0], [0, 1]);
        this.canvas.addTitleToLastElement("Center frequency of the filter");
        
        this.canvas.addXLabel("Frequency (Hz)");
        this.canvas.addYLabel("Weight");
        this.canvas.addMainLabel("Roex(r, p)")
        
        this.canvas.addYTickmarks(3, [0, 0.5, 1], ["0.0", "0.5", "1.0"]);
        this.canvas.addXTickmarks(5, undefined, undefined, 0);  
    }   
}

/* This is the first visualization which just shows how the parameters affect the filter */
class ROEXVis extends ROEXDrawer{
    
    constructor(visName){        
        super(visName);     
    }
        
    drawVisualization(){
        this.drawFilter();
    }   
}

/* This is actually the "notched noise" visualization. Confusing! */ 
class ThresholdVis extends ROEXDrawer{
    constructor(visName){
        super(visName);
        this.noiseWidth = 800;

        this.min_x = 100;
        this.max_x = 1900;
         
        this.nwSlider = document.getElementById("thresholdVis_NW");
        this.nwSlider.addEventListener("input", e => this.drawVisualization());
    }
    
    drawVisualization(){
        this.drawFilter();
        this.drawNoisemasker();
    }
    
    drawNoisemasker(){
        let nw = parseFloat(this.nwSlider.value);
        let r = Math.pow(10, parseFloat(this.rSlider.value)/10);
        let p = parseFloat(this.pSlider.value);
        
        let N0 = 0.7;
        
        /* Edges of the notched noise masker:*/
        let edge_1 = this.f0 - this.noiseWidth;
        let edge_2 = this.f0 - nw;
        
        let edge_3 = this.f0 + nw;
        let edge_4 = this.f0 + this.noiseWidth;
        
        let N = 100;
        let stepSize = (edge_2 - edge_1) / (N - 1);
        
        /* Noise masker (nm) 1 and 2*/ 
        let nm_1_x = new Array(N);
        let nm_1_y = new Array(N);
        
        let nm_2_x = new Array(N);
        let nm_2_y = new Array(N);
        
        for(let i = 0; i < N; i++){
            nm_1_x[i] = edge_1 + i * stepSize;
            nm_1_y[i] = N0 * W(g(nm_1_x[i], this.f0), r, p);
            
            nm_2_x[i] = edge_3 + i * stepSize;
            nm_2_y[i] = N0 * W(g(nm_2_x[i], this.f0), r, p);
        }
        
        this.canvas.drawPolygon([edge_1, edge_1, edge_2, edge_2], [0, N0, N0, 0]);
        this.canvas.setAttributeOfLastElement("fill-opacity", "0.4");
        this.canvas.addTitleToLastElement("This rectangle represents one side of the notched noise masker");

        this.canvas.drawPolygon([edge_3, edge_3, edge_4, edge_4], [0, N0, N0, 0]);
        this.canvas.setAttributeOfLastElement("fill-opacity", "0.4");
        this.canvas.addTitleToLastElement("This rectangle represents one side of the notched noise masker");        
        
        this.canvas.drawPolygon([edge_1, ...nm_1_x, edge_2], [0, ...nm_1_y, 0]);
        this.canvas.setAttributeOfLastElement("fill-opacity", "0.4");
        this.canvas.addTitleToLastElement("This part of the noise contributes to masking");

        this.canvas.drawPolygon([edge_3, ...nm_2_x, edge_4], [0, ...nm_2_y, 0]);
        this.canvas.setAttributeOfLastElement("fill-opacity", "0.4");
        this.canvas.addTitleToLastElement("This part of the noise contributes to masking");        
    }   
}

class PredThresholdVis{
    constructor(){
        
        this.rSlider = document.getElementById("predThresholdVis_r");
        this.pSlider = document.getElementById("predThresholdVis_p");
        this.kSlider = document.getElementById("predThresholdVis_k");
        
        this.rText = document.getElementById("predThresholdVis_r_text");
        this.pText = document.getElementById("predThresholdVis_p_text");
        this.kText = document.getElementById("predThresholdVis_k_text");
        
        this.rSlider.addEventListener("input", e => this.drawVisualization());
        this.pSlider.addEventListener("input", e => this.drawVisualization());
        this.kSlider.addEventListener("input", e => this.drawVisualization());
        
     
        /* Create arrays for calculating the threshold curve */
        this.maxNW = 1200
        this.res = 100;
        this.nws = new Array(this.res);

        let sz = this.maxNW / (this.res - 1);

        for(let i = 0; i < this.res; i++){
          this.nws[i] = i * sz;
        }

        /* Define constants*/
        this.notchWidths = [0, 50, 100, 200, 400, 800]; // For the "simulated thresholds"
        this.f0 = 1000;
        this.N0 = 1.5e-5; // Uniform noise with max(abs(x)) = 1
        this.bw = 800;        
    }
    

    initialize(){
        document.getElementById("predThresholdVis").setAttribute("width", 
          Math.min(window.innerWidth * 0.8, 600));
        
        let ylim = [-115, -40];
      
        this.canvas = new SVGVisualization(document.getElementById("predThresholdVis"), 
          [0, this.maxNW], ylim, [70, 100, 70, 50]);
        
        this.drawVisualization();
    }
    
    drawVisualization(){
        this.canvas.clearCanvas();
        
        this.canvas.drawAxes();
        //this.canvas.addMainLabel("Predicted thresholds");
        this.canvas.addXLabel("Notch width (Hz)");
        this.canvas.addYLabel("Threshold (dB)");    
        
        this.canvas.addXTickmarks(5, undefined, undefined, 0);
        this.canvas.addYTickmarks(5, undefined, undefined, 0);

        let K = parseFloat(this.kSlider.value);
        let r = parseFloat(this.rSlider.value);
        let p = parseFloat(this.pSlider.value);
        
        this.kText.innerText = K.toFixed(2);
        this.rText.innerText = r.toFixed(4);
        this.pText.innerText = p.toFixed(2);         

        this.canvas.drawLines(this.nws, this.calculateThresholds(this.nws, K, Math.pow(10, (r/10)), p), true);
        this.canvas.setAttributeOfLastElement("stroke-dasharray", [2, 4]);
        this.canvas.drawPoints(this.notchWidths, this.calculateThresholds(this.notchWidths, 1, 0.0001, 20));  
    }
    
    /* Calculates thresholds
       INPUT:
     */
    calculateThresholds(nws, K, r, p){
        let thresholds  = new Array(nws.length);
             
        for(let i = 0; i < nws.length; i++){
            thresholds[i] = P_S(nws[i], this.f0, this.N0, this.bw, K, r, p);    
            thresholds[i] = 10 * Math.log10(thresholds[i]);
            
        }
        
        return thresholds;
    }
}

class RectNoiseVis{
    constructor(){
        this.uBoundSlider = document.getElementById("rectVisuBoundSlider");
        this.lBoundSlider = document.getElementById("rectVislBoundSlider");
        this.N0Slider = document.getElementById("rectVisN0Slider");
        this.f0Slider = document.getElementById("rectVisf0Slider");
        
        this.textBox = document.getElementById("totalAreaTextBox");
        
        this.scale = "linear";
        this.f0Slider.disabled = true;
        
        this.linFreqBtn  = document.getElementById("rectVisLinFreq");
        this.normFreqBtn = document.getElementById("rectVisNormFreq");
        
        this.linFreqBtn.addEventListener("change", e => this.switchScale());
        this.normFreqBtn.addEventListener("change", e => this.switchScale());
        
        this.uBoundSlider.addEventListener("input", e => this.drawVisualization()); 
        this.lBoundSlider.addEventListener("input", e => this.drawVisualization()); 
        this.N0Slider.addEventListener("input", e => this.drawVisualization());
        this.f0Slider.addEventListener("input", e => this.drawVisualization());
    }
    
    switchScale(){
        if(this.scale === "linear"){
            this.scale = "normalized";
            this.f0Slider.disabled = false;
        } else if(this.scale = "normalized"){
            this.scale = "linear";
            this.f0Slider.disabled = true;
        }
        
        this.drawVisualization();
    }
    
    initialize(){
        document.getElementById("rectNoiseVis").setAttribute("width", 
          Math.min(window.innerWidth * 0.8, 600));
        
        this.canvas = new SVGVisualization(document.getElementById("rectNoiseVis"), 
          [1000, 2000], [0, 1], [70, 100, 70, 50]);  

        this.drawVisualization();         
    }
    
    drawVisualization(){
        let uppEdge = parseFloat(this.uBoundSlider.value);
        let lowEdge = parseFloat(this.lBoundSlider.value);
        let N0 = parseFloat(this.N0Slider.value);
        let f0 = parseFloat(this.f0Slider.value);
        
        this.canvas.clearCanvas();
        this.canvas.drawAxes();
        
        this.canvas.addYLabel("Magnitude");
        
        this.canvas.drawPolygon([lowEdge, lowEdge, uppEdge, uppEdge, lowEdge], [0, N0, N0, 0, 0]);
        this.canvas.setAttributeOfLastElement("fill-opacity", "0.4");
        this.canvas.addTitleToLastElement("The noise masker");

        this.canvas.drawLine([lowEdge, lowEdge], [0, 1]);
        this.canvas.addTitleToLastElement("Lower edge of the noise masker");
        this.canvas.setAttributeOfLastElement("stroke-width", "3.0");
             
        this.canvas.drawLine([uppEdge, uppEdge], [0, 1]);
        this.canvas.addTitleToLastElement("Upper edge of the noise masker");
        this.canvas.setAttributeOfLastElement("stroke-width", "3.0");
        
        this.canvas.addText("Lower", lowEdge, 1.05);
        this.canvas.addText("Upper", uppEdge, 1.05);
        this.canvas.addText("Bounds", (uppEdge + lowEdge) / 2, 1.15);
        
        this.canvas.drawLine([lowEdge, uppEdge], [1.10, 1.10]);
        this.canvas.setAttributeOfLastElement("stroke", "black");
        
        this.canvas.drawLine([lowEdge, uppEdge + 5], [N0, N0]);
        this.canvas.setAttributeOfLastElement("stroke", "black");
        
        this.canvas.addText("N0", uppEdge + 10, N0);
        this.canvas.setAttributeOfLastElement("text-anchor", "start");
        
        
        /* Construct x axis labels:*/
        let xvals = [1000, 1200, 1400, 1600, 1800, 2000];
        
        let xlabs = new Array(xvals.length);
        
        for(let i = 0; i < xvals.length; i++){
          xlabs[i] = xvals[i] + " / " + g(xvals[i], f0).toFixed(2);
        }
        if(this.scale === "linear"){
            this.canvas.addXTickmarks(xvals.length, xvals, xvals);
            this.canvas.addXLabel("Frequency (Hz)");
            
            this.textBox.innerText = "Area: " + ((uppEdge - lowEdge) * N0).toFixed(2);
            
        } else if(this.scale === "normalized"){
            let gvals = new Array(xvals.length);
             
            for(let i = 0; i < xvals.length; i++){
               gvals[i] = g(xvals[i], f0).toFixed(2);
            }
            
            this.canvas.addXTickmarks(xvals.length, xvals, gvals);
            this.canvas.addXLabel("Normalized frequency");
            
            this.textBox.innerText = "Area: " + ((g(uppEdge, f0) - g(lowEdge, f0)) * N0).toFixed(3);
        }
        
        this.canvas.addYTickmarks(5);

    }
}

class AreaVis{
    constructor(){
        this.N    = 100;
        this.maxG = 1.2;
        this.g    = new Array(this.N);
        
        let stepSize = this.maxG / (this.N - 1);
       
        for(let i = 0; i < this.N; i++){
            this.g[i] = i * stepSize;
        }
        //
        this.uBoundSlider = document.getElementById("uBoundSlider");
        this.lBoundSlider = document.getElementById("lBoundSlider");
        this.N0Slider     = document.getElementById("N0Slider");
        
        this.rSlider = document.getElementById("areaVis_r");
        this.pSlider = document.getElementById("areaVis_p");
        
        this.uBoundSlider.addEventListener("input", e => this.drawVisualization());
        this.lBoundSlider.addEventListener("input", e => this.drawVisualization());
        this.N0Slider.addEventListener("input", e => this.drawVisualization());
        this.rSlider.addEventListener("input", e => this.drawVisualization());
        this.pSlider.addEventListener("input", e => this.drawVisualization());
    }
    
    initialize(){
        document.getElementById("areaVis").setAttribute("width", 
          Math.min(window.innerWidth * 0.8, 600));
        
        this.canvas = new SVGVisualization(document.getElementById("areaVis"), 
          [0, this.maxG], [0, 1], [70, 100, 70, 50]);  

        this.drawVisualization();          
    }
    
    drawVisualization(){
        this.canvas.clearCanvas();
        this.canvas.drawAxes();
        
        let r = parseFloat(this.rSlider.value);
        let p = parseFloat(this.pSlider.value); 
        
        let N0 = parseFloat(this.N0Slider.value);
        let lowEdge = parseFloat(this.lBoundSlider.value);
        let uppEdge = parseFloat(this.uBoundSlider.value);
        
        let magnitude = new Array(this.N);
        
        for(let i = 0; i < this.N; i++){
            magnitude[i] = W(this.g[i], Math.pow(10, r/10), p);
        }
                        
        /* The polygon that corresponds to the integral: */
       
        let area_x = new Array(50);
        let area_y = new Array(area_x.length);
        
        let stepSize = (uppEdge - lowEdge) / (area_x.length - 1);
        
        for(let i = 0; i < area_x.length; i++){
            area_x[i] = lowEdge + i * stepSize;
            area_y[i] = N0 * W(area_x[i], Math.pow(10, r/10), p);
        }
        
        this.canvas.drawPolygon([lowEdge, lowEdge, uppEdge, uppEdge], [0, N0, N0, 0]);
        this.canvas.setAttributeOfLastElement("fill-opacity", "0.4");
        this.canvas.addTitleToLastElement("The noise masker");
        
        this.canvas.drawPolygon([area_x[0], ...area_x, area_x[area_x.length - 1]], [0,...area_y, 0]);
        this.canvas.setAttributeOfLastElement("fill-opacity", "0.8");
        this.canvas.addTitleToLastElement("Noise that passes through the filter, this is what we want to calculate");
        
        this.canvas.drawLines(this.g, magnitude);
        this.canvas.addTitleToLastElement("W(g, r, p)");
        
        this.canvas.drawLine([lowEdge, lowEdge], [0, 1]);
        this.canvas.addTitleToLastElement("Lower edge of the noise masker");
        this.canvas.setAttributeOfLastElement("stroke-width", "3.0");
             
        this.canvas.drawLine([uppEdge, uppEdge], [0, 1]);
        this.canvas.addTitleToLastElement("Upper edge of the noise masker");
        this.canvas.setAttributeOfLastElement("stroke-width", "3.0");
        
        this.canvas.addText("Lower", lowEdge, 1.05);
        this.canvas.addText("Upper", uppEdge, 1.05);
        this.canvas.addText("Bounds", (uppEdge + lowEdge) / 2, 1.15);
        
        this.canvas.drawLine([lowEdge, uppEdge], [1.10, 1.10]);
        this.canvas.setAttributeOfLastElement("stroke", "black");
        
        this.canvas.drawLine([lowEdge, uppEdge + 0.01], [N0, N0]);
        this.canvas.setAttributeOfLastElement("stroke", "black");
        
        this.canvas.addText("N0", uppEdge + 0.01, N0);
        this.canvas.setAttributeOfLastElement("text-anchor", "start");
        
        this.canvas.addXTickmarks(4);
        this.canvas.addYTickmarks(4);
        this.canvas.addYLabel("Magnitude/Weight");
        this.canvas.addXLabel("Normalized frequency")
        
    }
}


///////////////////////////////////


let roexVis      = new ROEXVis("roexVis");
let thresholdVis = new ThresholdVis("thresholdVis")

let rectNoiseVis = new RectNoiseVis();
let areaVis      = new AreaVis();

let predThresholdVis = new PredThresholdVis();

function initializeVisualizations(){
    roexVis.initialize();
    thresholdVis.initialize();
    rectNoiseVis.initialize();
    areaVis.initialize();
    predThresholdVis.initialize();
}

window.onload   = initializeVisualizations;
window.onresize = initializeVisualizations;
