"use strict";

function normalize(x){
    let curmax = Math.abs(x[0]);
    
    for(let i = 1; i < x.length; i++){
        if(Math.abs(x[i]) > curmax){
            curmax = Math.abs(x[i]);
        }
    }
    
    for(let i = 0; i < x.length; i++){
        x[i] /= curmax;
    }
}

class SamplingVis{
    
    constructor(){
        this.res  = 20; // The low resolution sampled signal
        this.res2 = 200; // High resolution true signal
        
        document.getElementById("samplingVis").
            setAttribute("width", Math.min(window.innerWidth * 0.8, 600));
        

        this.canvas = new Plot(
            document.getElementById("samplingVis"),
            null,
            {
                xlim : [1, this.res],
                ylim : [-1, 1],
                mar : [80, 110, 10, 30],
                xlab : "Time",
                ylab : "Amplitude"
            }
        );

        /* This is for the low resulution "sampled signal" */
        this.x = new Array(this.res);
        this.y = new Array(this.res);
        
        /* This is for the higher resolution "true" signal*/
        this.x2 = new Array(this.res2);
        this.y2 = new Array(this.res2);
        
        for(let i = 0;  i < this.res; i++){
            this.x[i] = i + 1;
            this.y[i] = Math.sin(i * 0.5);
        }
        
        for(let i = 0;  i < this.res2; i++){
            this.x2[i] = i * (this.res / this.res2) + 1;
            this.y2[i] = Math.sin(i * (this.res / this.res2) * 0.5);
        }
        
        //this.canvas.clearCanvas(); // This is good to do if the visualization is redrawn due to resizing the window
        
        this.canvas.drawLines(this.x2, this.y2);
        
        for(let i = 0; i < this.res; i++){
            let curPoint = this.canvas.drawPoint(this.x[i], this.y[i], true);
            curPoint.addEventListener(
                    "mouseenter", 
                    e => this.addCrosshair(this.x[i], this.y[i]));
                curPoint.addEventListener(
                    "mouseleave", 
                    e => this.removeCrosshair());
        }
        
        /* This part writes the sampled sine wave to the html: */
        
        let stringToBeWritten = "";
        
        for(let i = 0; i < this.res; i++){
            stringToBeWritten += this.y[i].toFixed(2);
            if(i < this.res - 1){
                stringToBeWritten += ", ";
            }
        }
        
        document.getElementById("sampledSine").
            innerText = stringToBeWritten;
    }
    
    /* These crosshair functions are used for adding/removing the crosshair that 
       aims at the point that the user is hovering on */
    addCrosshair(x, y){
        this.verticalCrosshair = this.canvas.drawLines([x, x], [-2, y]);
        this.verticalCrosshair.setAttribute("stroke-dasharray", [2, 2]);
        
        this.horizontalCrosshair = this.canvas.drawLines([-2, x], [y, y]);
        this.horizontalCrosshair.setAttribute("stroke-dasharray", [2, 2]);
    }
    
    removeCrosshair(){
        this.horizontalCrosshair.remove();
        this.verticalCrosshair.remove();
    }   
}

class VarFreqVis{
    constructor(){
        document.getElementById("varFreqVis").
            setAttribute("width", Math.min(window.innerWidth * 0.8, 600));
        
        this.canvas = new Plot(
            document.getElementById("varFreqVis"),
            null,
            {
                xlim : [0, 10],
                ylim : [-1, 1],
                mar  : [50, 120, 50,  0],
                xlab : "Time",
                ylab : "Amplitude"
            }
        );

        this.slider = document.getElementById("varFreqVisSlider");
        this.textBox = document.getElementById("varFreqVisText");
        
        this.x = new Array(200);
        this.y = new Array(this.x.length);
        
        /*Prefill x array*/
        for(let i = 0; i < this.x.length; i++){
            this.x[i] = i * (10.0 / this.x.length);
        }
        
        this.slider.addEventListener("input", e => this.drawVisualization());
        this.drawVisualization();
    }
    
    drawVisualization(){
        let f = parseFloat(this.slider.value);
        
        this.textBox.innerText = "(" + f.toFixed(2) + ")";
        
        for(let i = 0; i < this.x.length; i++){
            this.y[i] = Math.sin(this.x[i] * f);
        }
        
        this.canvas.clearData();
        this.canvas.drawLines(this.x, this.y);        
    }
}

class MixtureVis{
    constructor(){
        
        document.getElementById("mixtureVis").
            setAttribute("width", Math.min(window.innerWidth * 0.8, 600));
        
        this.canvas = new Plot(
            document.getElementById("mixtureVis"),
            null,
            {
                xlim : [0, 10],
                ylim : [-2, 2],
                mar : [50, 50, 0, 0],
                xlab : "Time",
                ylab : "Amplitude"
            }

        );

        this.slider = document.getElementById("mixtureVisSlider");
        
        this.res = 400;
        this.x   = new Array(this.res);
        this.y   = new Array(this.res);
        
        /* Prefill x*/
        
        for(let i = 0; i < this.res; i++){
            this.x[i] = i * (10.0 / this.res);
        }
        
        /* Frequencies for high frequency noise*/
        
        this.hfFreqs = new Array(this.res);
        
        for(let i = 0; i < this.res; i++){
            this.hfFreqs[i] = 19.5 * Math.random();
        }
        
        this.slider.addEventListener("input", e => this.drawVisualization());
        this.drawVisualization();    
    }
    
    drawVisualization(){
        let a = parseFloat(this.slider.value);
        
        this.canvas.clearData();
        
        for(let i = 0; i < this.res; i++){
            this.y[i] = Math.sin(this.x[i] * 2) + 
                a * Math.sin(this.x[i] * this.hfFreqs[i]);
        }
        
        this.canvas.drawLines(this.x, this.y);
    }
}

class FIRVis{
    constructor(){
        this.res = 200;
        
        document.getElementById("firVis").
            setAttribute("width", Math.min(window.innerWidth * 0.8, 600));
        
        this.canvas = new Plot(
            document.getElementById("firVis"),
            null,
            {
                xlim : [0, 10],
                ylim : [-1.5, 1.5],
                mar  :[80, 90, 10, 30]
            }
        );
        
        this.a0     = document.getElementById("firVis_a0");
        this.a1     = document.getElementById("firVis_a1");
        this.a0text = document.getElementById("firVis_a0_text");
        this.a1text = document.getElementById("firVis_a1_text");
        
        this.applyButton = document.getElementById("applyFIR");
        this.filterApplied = 0;
        
        this.a0.addEventListener("input", e => this.updateVis());
        this.a1.addEventListener("input", e => this.updateVis());
        this.applyButton.addEventListener("click", e => this.switchFilter());
        
        /* High frequency noise*/
        
        this.hfFreqs = new Array(this.res);
        
        for(let i = 0; i < this.res; i++){
            this.hfFreqs[i] = 39.5 * Math.random();
        }
        
        /* Unfiltered signal */
        
        let f1 = 2.0;
        
        this.x      = new Array(this.res);
        this.input  = new Array(this.res);
        this.output = new Array(this.res);
        
        for(let i = 0; i < this.res; i++){
            this.x[i] = i * (10.0 / this.res);
        }
        
        for(let i = 0; i < this.res; i++){
            this.input[i] = Math.sin(this.x[i] * f1) + 
                0.4 * Math.sin(this.x[i] * this.hfFreqs[i]);   
        }
        
        normalize(this.input);
        this.updateVis();      
    }
    
    switchFilter(){
        if(this.filterApplied == true){
          this.filterApplied = 0;
          this.applyButton.innerText = "Apply Filter";
        } else {
          this.filterApplied = 1;
          this.applyButton.innerText = "Remove Filter";    
        }
        
        this.updateVis();
    }
    
    updateVis(){
      this.doFiltering();
      this.drawVis();
    }
    
    drawVis(){
      this.canvas.clearData();
      
      if(this.filterApplied == true){
        this.canvas.drawLines(this.x, this.output);
      } else {
        this.canvas.drawLines(this.x, this.input);
      }
    }
    
    doFiltering(){
      let a0 = parseFloat(this.a0.value);
      let a1 = parseFloat(this.a1.value);
      
      this.a0text.innerText = "(" + a0.toFixed(2) + ")";
      this.a1text.innerText = "(" + a1.toFixed(2) + ")";
    
      this.output[0] = this.input[0];
      
      for(let i = 1; i < this.x.length; i++){     
        this.output[i] = this.input[i] * a0 + this.input[i-1] * a1; 
      }
      
      normalize(this.output);
    }
}

class IIRVis{    
    constructor(){
        this.res = 200;

        document.getElementById("iirVis").
            setAttribute("width", Math.min(window.innerWidth * 0.8, 600));
        
        this.canvas = new Plot(
            document.getElementById("iirVis"),
            null,
            {
                xlim : [0, 10],
                ylim : [-1.5, 1.5],
                mar : [80, 90, 10, 30]
            }
        );

        this.a0     = document.getElementById("iirVis_a0");
        this.a1     = document.getElementById("iirVis_a1");
        this.b1     = document.getElementById("iirVis_b1");
        
        this.a0text = document.getElementById("iirVis_a0_text");
        this.a1text = document.getElementById("iirVis_a1_text");
        this.b1text = document.getElementById("iirVis_b1_text");
        
        this.applyButton = document.getElementById("applyIIR");
        this.filterApplied = 0;
        
        this.a0.addEventListener("input", e => this.updateVis());
        this.a1.addEventListener("input", e => this.updateVis());
        this.b1.addEventListener("input", e => this.updateVis());
        
        this.applyButton.addEventListener("click", e => this.switchFilter());

        /* High frequency noise*/
        
        this.hfFreqs = new Array(this.res);
        
        for(let i = 0; i < this.res; i++){
            this.hfFreqs[i] = 39.5 * Math.random();
        }
        
        /* Unfiltered signal */
        
        let f1 = 2.0;
        
        this.x      = new Array(this.res);
        this.input  = new Array(this.res);
        this.output = new Array(this.res);
        
        for(let i = 0; i < this.res; i++){
            this.x[i] = i * (10.0 / this.res);
        }
        
        for(let i = 0; i < this.res; i++){
            this.input[i] = Math.sin(this.x[i] * f1) + 
                0.4 * Math.sin(this.x[i] * this.hfFreqs[i]);   
        }
        
        normalize(this.input);
        this.updateVis();      
    }
    
    switchFilter(){
        if(this.filterApplied == true){
          this.filterApplied = 0;
          this.applyButton.innerText = "Apply Filter";
        } else {
          this.filterApplied = 1;
          this.applyButton.innerText = "Remove Filter";    
        }
        
        this.updateVis();
    }
    
    updateVis(){
      this.doFiltering();
      this.drawVis();
    }
    
    drawVis(){
      this.canvas.clearData();
      
      if(this.filterApplied == true){
        this.canvas.drawLines(this.x, this.output);
      } else {
        this.canvas.drawLines(this.x, this.input);
      }
    }
    
    doFiltering(){
      let a0 = parseFloat(this.a0.value);
      let a1 = parseFloat(this.a1.value);
      let b1 = parseFloat(this.b1.value);
      
      this.a0text.innerText = "(" + a0.toFixed(2) + ")";
      this.a1text.innerText = "(" + a1.toFixed(2) + ")";
      this.b1text.innerText = "(" + b1.toFixed(2) + ")";
    
      this.output[0] = this.input[0];
      
      for(let i = 1; i < this.x.length; i++){
        this.output[i] = this.input[i] * a0 + 
            this.input[i-1] * a1 - this.output[i -1] * b1; 
      }
      
      normalize(this.output);
    }
}

function initilizeVisualizations(){
  let samplingVis = new SamplingVis();
  let varFreqVis  = new VarFreqVis();
  let mixtureVis  = new MixtureVis();
  let firVis      = new FIRVis();
  let iirVis      = new IIRVis();  
}

initilizeVisualizations();

window.onresize = initilizeVisualizations;
