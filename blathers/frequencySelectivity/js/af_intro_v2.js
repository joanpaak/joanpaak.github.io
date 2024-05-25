"use strict";

/* Color used for drawing the blocks of noise. Why is this a constant here? 
   Guess  I wanted to play around with it, test something... */
const NOISE_COLOR = 'rgba(0, 0, 0, 0.2)';


function frequencyResponse(filter, minFreq, maxFreq, N){
/* Returns the frequency response of filter. 

INPUT:
  filter           : a biquad filter object, with the method .getFrequencyResponse
  minFreq, maxFreq : limits for the range for which to calculate the frequency response
  N                : number of points in the range for which the calculate the response
OUTPUT: Magnitude and frequency, as vectors. Look at the code.
*/

    let freq  = new Float32Array(N);
    let mag   = new Float32Array(N);
    let phase = new Float32Array(N);    
    
    for(let i = 0; i < freq.length; i++){
        freq[i] = minFreq + ((maxFreq - minFreq) / (freq.length - 1)) * i;
    }
    
    filter.getFrequencyResponse(freq, mag, phase);
    
    return {magnitude : mag,
            frequency : freq};
}



/* All of the demos are their own classes. They inherit some stuff from this
   generic class, mainly relating to the button that toggles the sound on and off */
class Demo{  
    constructor(toggleBtn){
        this.demoActive = false;
        this.toggleButton = toggleBtn;
        this.toggleButton.addEventListener("click", e => this.toggleDemo(), 
          false);
    }
    
    toggleDemo(){
        if(this.demoActive){
            this.audioCtx.close()
            this.demoActive = false;
            this.toggleButton.innerText = "Start sound";     
           
            //this.stopSound();
        } else{
            AudioContext = window.AudioContext || window.webkitAudioContext;
            this.audioCtx = new AudioContext();
            this.demoActive = true;
            this.toggleButton.innerText = "Stop sound";
            this.startSound();
        }       
    }
}

class Demo1 extends Demo{
    constructor(){
        super(document.getElementById("demo1Toggle"));

        this.canvas = new Plot(
            document.getElementById("vis_1"),
            null,
            {
                xlim : [50, 2000], 
                ylim : [0, 1], 
                mar : [80, 70, 10, 30],
                xlab : "Frequency (Hz)",
                ylab : "Magnitude"
            });
        
        this.freqSlider = document.getElementById("demo1FreqSlider");
        this.freqSlider.addEventListener("input", e => this.handleFreqChange(), false);
        
        this.drawVisualization();      
    }
    
    startSound(){
        this.volumeControl = this.audioCtx.createGain();
        this.beeper = this.audioCtx.createOscillator();
        
        this.volumeControl.gain.value = 0.05;
        this.beeper.frequency.value = parseFloat(this.freqSlider.value);
        this.beeper.start(0);
        this.beeper.connect(this.volumeControl);
        this.volumeControl.connect(this.audioCtx.destination);    
    }
          
    handleFreqChange(){ 
        if(this.demoActive){
            this.beeper.frequency.value = parseFloat(this.freqSlider.value);
        }
        this.drawVisualization();
    }
    
    drawVisualization(){
        this.canvas.clearData();
        let signalLine = this.canvas.drawLine(
            [parseFloat(this.freqSlider.value), 
                parseFloat(this.freqSlider.value)], 
                [-1, 1]);
        signalLine.classList.add("signalLine"); // ERROR: I don't think this is necessary
        
        const title = document.createElementNS("http://www.w3.org/2000/svg", "title");
        title.textContent = "Signal, the sine wave you (should) hear";

        signalLine.appendChild(title);
    }
}

class Demo2 extends Demo{    
    constructor(){
        super(document.getElementById("demo2Toggle"));

        this.freqSlider = document.getElementById("demo2FreqSlider");
        this.QSlider = document.getElementById("demo2QSlider");
        
        this.freqSlider.addEventListener("input", 
            e => this.handleFreqChange(), false);
        this.QSlider.addEventListener("input", 
            e => this.handleQChange());
        
        this.canvas = new Plot(
            document.getElementById("vis_2"),
            null, 
            {
                xlim : [0, 2000], 
                ylim : [0, 1], 
                mar : [50, 75, 10, 30]
            });
          
        this.drawVisualization();
    }

    startSound(){
        // Create noise masker:
        
        this.noiseMasker = new Float32Array(this.audioCtx.sampleRate * 3);

        for(let i = 0; i < this.noiseMasker.length; i++){
          this.noiseMasker[i] = Math.random() * 2 - 1;
        }
        
        // Create filter: 
        this.filter = this.audioCtx.createBiquadFilter();
        this.filter.type = "bandpass";
        this.getCenterFrequencyFromSlider();
        this.getQValueFromSlider();
        
        // Create buffered source to which the noise is put into:
        this.source = this.audioCtx.createBufferSource(); 
        this.buffer = this.audioCtx.createBuffer(
            1, this.noiseMasker.length, this.audioCtx.sampleRate);
        this.buffer.copyToChannel(this.noiseMasker, 0);
        this.source.loop = true;  
        this.source.buffer = this.buffer;  
        this.source.connect(this.filter);
        this.filter.connect(this.audioCtx.destination);
        this.source.start(0);
        
        //
        this.drawVisualization();
    }
    
    
    getCenterFrequencyFromSlider(){
       this.filter.frequency.value = parseFloat(this.freqSlider.value); 
    }
    
    getQValueFromSlider(){
        this.filter.Q.value = parseFloat(this.QSlider.value);
    }
    
    handleFreqChange(){
        if(this.demoActive){
          this.getCenterFrequencyFromSlider();    
        }
        this.drawVisualization();
    }
    
    handleQChange(){
        if(this.demoActive){
          this.getQValueFromSlider();    
        }
        this.drawVisualization();       
    }
    
    drawVisualization(){
        this.canvas.clearData();
        this.canvas.hline(0, { stroke : "black", "stroke-dasharray" : 4});
        
        if(this.demoActive){
            let fr = frequencyResponse(this.filter, 0, 2000, 100);
        
            let x = new Array(...fr.frequency);   // The Float32 arrays must be 
            let y = new Array(...fr.magnitude);   // cast to normal arrays
        
            x.push(x[x.length-1]); // This just "closes the loop" so that 
            y.push(0);             // the polygon can be drawn correctly.
    
            let poly = this.canvas.drawPolygon(x, y, { fill : NOISE_COLOR});

            //

            const title = document.createElementNS("http://www.w3.org/2000/svg", "title");
            title.textContent = "This grey block represents the noise you hear when this demo is active";
            poly.appendChild(title);            
        }     
    }
}

class Demo3 extends Demo{
    constructor(){
        super(document.getElementById("demo3toggle"));
        
        this.canvas = new Plot(
            document.getElementById("vis_3"),
            null, {
                xlim : [0, 2000], 
                ylim : [0, 1], 
                mar :[50, 75, 10, 30]
            });
        
        this.CFSlider =  document.getElementById("demo3CFSlider");
        this.CFSlider.addEventListener(
            "input", e => this.handleCFChange(), false);

        //
         
        this.filterBandwidth = 200;
        this.drawVisualization();
    }
    
    handleCFChange(){
        if(this.demoActive){
          this.getCFFromSlider();    
        }
        this.drawVisualization();
    }

    getCFFromSlider(){
        this.filter.frequency.value = parseFloat(this.CFSlider.value);
        this.filter.Q.value = this.filter.frequency.value / this.filterBandwidth;
    }
    
    startSound(){
        // Create noise masker: 
        this.noiseMasker = new Float32Array(this.audioCtx.sampleRate * 3);

        for(let i = 0; i < this.noiseMasker.length; i++){
          this.noiseMasker[i] = Math.random() * 2 - 1;
        }

        // Create filter:
        this.filter = this.audioCtx.createBiquadFilter();
        this.filter.type = "bandpass";
        this.getCFFromSlider();

        
        // Signal
        this.volumeControl = this.audioCtx.createGain();
        this.beeper = this.audioCtx.createOscillator();
        this.volumeControl.gain.value = 0.05;
        this.beeper.frequency.value = 1000;
        
        // Noise:
        
        //this.filter.frequency.value = getCFFromSlider();
        this.getCFFromSlider();
        this.source = this.audioCtx.createBufferSource();
        this.buffer = this.audioCtx.createBuffer(
            1, this.noiseMasker.length, this.audioCtx.sampleRate);
        this.buffer.copyToChannel(this.noiseMasker, 0);
        this.source.loop = true;
        this.source.buffer = this.buffer;
        
        // Connect signal and noise to the audio system:
        
        this.beeper.connect(this.volumeControl);
        this.volumeControl.connect(this.audioCtx.destination);
         
        this.beeper.start(0);

        //

        this.source.connect(this.filter);
        this.filter.connect(this.audioCtx.destination);
        this.source.start();

        // 
        this.drawVisualization();   
    }   
    
    drawVisualization(){
        this.canvas.clearData();
        this.canvas.hline(0, { stroke : "black", "stroke-dasharray" : 4});

        if(this.demoActive){
            let fr = frequencyResponse(this.filter, 0, 2000, 100);
            
            let x = new Array(...fr.frequency);   // The Float32 arrays must be 
            let y = new Array(...fr.magnitude);   // cast to normal arrays
            
            x.push(x[x.length-1]); // This just "closes the loop" so that 
            y.push(0);             // the polygon can be drawn correctly.
            
            let poly = this.canvas.drawPolygon(x, y, {fill : NOISE_COLOR});
               
            let sl = this.canvas.drawLine([1000, 1000], [-1, 1]);
            
            //
            const title_1 = document.createElementNS("http://www.w3.org/2000/svg", "title");
            title_1.textContent = "Signal, the sine wave you (should) hear";           

            const title_2 = document.createElementNS("http://www.w3.org/2000/svg", "title");
            title_2.textContent = "This grey block represents the noise you hear when this demo is active";
           
            sl.appendChild(title_1);
            poly.appendChild(title_2);             
        }
    }
}

/*

Beeper -----------------\___ listening filter -> destination
Noise  -> Noise Filter -/

*/


class Demo4 extends Demo{
    
    constructor(){
        super(document.getElementById("demo4toggle"));
        
        this.canvas = new Plot(
            document.getElementById("vis_4"), 
            null, 
            {
                xlim : [0, 2000], 
                ylim : [0, 1.25], 
                mar : [50, 75, 10, 30]
            });
        
        this.QSlider = document.getElementById("demo4QSlider");
        this.QSlider.addEventListener(
            "input", e => this.handleQChange(), false);
             
        this.noiseFilterCF        = 1500;
        this.noiseFilterBandwidth = 1500;
        
        this.listeningFilterCF    = 1000;
        
        this.drawVisualization();
    }
    
    handleQChange(){
        this.getQValueFromSlider();
    }
    
    startSound(){
        // Create noise masker:
        this.noiseMasker = new Float32Array(this.audioCtx.sampleRate * 3);
        
        for(let i = 0; i < this.noiseMasker.length; i++){
            this.noiseMasker[i] = Math.random() * 2 - 1;
        }
        
        // Signal (beeper):
        
        this.volumeControl = this.audioCtx.createGain();
        this.beeper = this.audioCtx.createOscillator();
        this.volumeControl.gain.value = 0.05;
        this.beeper.frequency.value = 1000;
            
        // Noise filter:
        
        this.noiseFilter = this.audioCtx.createBiquadFilter();
        /*this.noiseFilter.type = "bandpass";
        this.noiseFilter.frequency.value = this.noiseFilterCF;*/
        this.noiseFilter.type = "notch";
        this.noiseFilter.frequency.value = 1000;
        this.noiseFilter.Q.value = this.noiseFilterCF / this.noiseFilterBandwidth;
        
        // "Listening filter"
        
        this.listeningFilter = this.audioCtx.createBiquadFilter();
        this.listeningFilter.type = "bandpass";
        this.listeningFilter.frequency.value = this.listeningFilterCF;
        this.getQValueFromSlider();
        
        //
        
        this.source = this.audioCtx.createBufferSource();
        /* Does not really need to be an attribute but oh well: */
        this.buffer = this.audioCtx.createBuffer(1, this.noiseMasker.length, this.audioCtx.sampleRate);
        this.buffer.copyToChannel(this.noiseMasker,  0);
        this.source.loop = true;
        this.source.buffer = this.buffer;
        
        
        // Connect everything:
        this.source.start();
        this.beeper.start(0);
        
        this.beeper.connect(this.volumeControl);
        this.volumeControl.connect(this.listeningFilter);
        
        this.source.connect(this.noiseFilter);
        this.noiseFilter.connect(this.listeningFilter);
        
        //this.noiseFilter.connect(this.audioCtx.destination);
        this.listeningFilter.connect(this.audioCtx.destination);
        this.drawVisualization();        
    }
    
    getQValueFromSlider(){
        this.listeningFilter.Q.value = parseFloat(this.QSlider.value);
        this.drawVisualization();
    }
    
    drawVisualization(){
        this.canvas.clearData();
        this.canvas.hline(0, { stroke : "black", "stroke-dasharray" : 4});

        if(this.demoActive){
            let frNoise = frequencyResponse(this.noiseFilter, 0, 2000, 100);
            
            let xNoise = new Array(...frNoise.frequency);   // The Float32 arrays must be 
            let yNoise = new Array(...frNoise.magnitude);   // cast to normal arrays
            
            
            xNoise.push(xNoise[xNoise.length-1]); // This just "closes the loop" so that 
            yNoise.push(0);                       // the polygon can be drawn correctly.
            xNoise.push(xNoise[0]);
            yNoise.push(0);
            
            this.canvas.drawPolygon(xNoise, yNoise, {fill : 'rgba(0, 0, 0, 0.2)'});
            
            // Listening filter:
            
            let frListening = frequencyResponse(this.listeningFilter, 0,2000,100);
            
            let xListening = new Array(...frListening.frequency);   // The Float32 arrays must be 
            let yListening = new Array(...frListening.magnitude);   // cast to normal arrays
            
            xListening.push(xListening[xListening.length-1]); // This just "closes the loop" so that 
            yListening.push(0);             // the polygon can be drawn correctly.
            
            this.canvas.drawPolygon(
                xListening, 
                yListening, 
                {fill : 'hsla(45, 100%,  50%, 0.6)'});
            
            //
                                
            let sl = this.canvas.drawLine([1000, 1000], [0, 1]);
            
            // Add titles:

            let pgons = this.canvas.svgElement.getElementsByTagName("polygon");
    
            const title_1 = document.createElementNS("http://www.w3.org/2000/svg", "title");
            const title_2 = document.createElementNS("http://www.w3.org/2000/svg", "title");
    
            title_1.textContent = "The notched noise masker.";
            title_2.textContent = "Shape of the filter through which the signal and noise are heard";
    
            pgons[0].appendChild(title_1);
            pgons[1].appendChild(title_2);

            const title_3 = document.createElementNS("http://www.w3.org/2000/svg", "title");
            title_3.textContent = "Signal, the sine wave you (should) hear";

            sl.appendChild(title_3);            
        }        
    }
}

let demo1Object = new Demo1();
let demo2Object = new Demo2();
let demo3Object = new Demo3();
let demo4Object = new Demo4();

