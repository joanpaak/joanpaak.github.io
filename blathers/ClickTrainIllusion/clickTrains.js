class Player{
    constructor(){
        this.startBtn = document.getElementById("startBtn");
        this.stopBtn = document.getElementById("stopBtn");

        this.lengthInput = document.getElementById("lengthInput");
        this.tempoInput = document.getElementById("tempoInput");
        this.slopeInput = document.getElementById("slopeInput");

        this.audioCtx = null;

        this.startBtn.addEventListener("click", e => this.start());
        this.stopBtn.addEventListener("click", e => this.stop());
    }

    getAttributes(){
        let errMsg = "";

        let length = parseFloat(this.lengthInput.value);
        let tempo  = parseFloat(this.tempoInput.value);

        if(isNaN(length) || length < 0 || length > 60){
            errMsg += `Length was ${length} but must be between 0 - 60 \n`;
        }

        if(isNaN(tempo) || tempo < 1 || tempo > 10000){
            errMsg += `Tempo was ${tempo} but must be between 1 - 10000 \n`;
        }

        if(errMsg.length > 0){
            alert(errMsg);
            return -1;
        }

        return {
            length : length,
            tempo : tempo
        };
    }

    stop(){
        if(this.audioCtx != null){
            this.audioCtx.close();
            this.audioCtx = null;
        }
    }

    start(){
        if(this.audioCtx != null){
            this.stop();
        }

        let attrs = this.getAttributes();

        if(attrs === -1){
            return;
        }

        this.audioCtx = new window.AudioContext();
        const clickTrainFreq = attrs.tempo;
        const clickTrainLengthSec = attrs.length;
        const clickTrainLengthSmpls = clickTrainLengthSec * this.audioCtx.sampleRate;
    
        const timeStepSmpls = Math.round(this.audioCtx.sampleRate / clickTrainFreq);
        
        let clickTrain = new Float32Array(clickTrainLengthSmpls).fill(0);
        
        /* The idea was to have the amplitude as something the user could change 
           but obviously that idea was scrapped. But if you're up to it, it's easy
           to implement... */
        let amplitude = 0.25
        let counter = 1;
        
        for (let i = 0; i < clickTrainLengthSmpls; i = i + timeStepSmpls) {
            if(counter === 1){
                clickTrain[i] = 1.0 * amplitude;
                counter = 2;
            } else if(counter === 2){
            /* I wanted the amplitude change to be logarithmic so that's why this
               is done is such a convoluted way */
                let curAmplitude = Math.log(1 + i/clickTrainLengthSmpls) 
                  / Math.log(2);
                clickTrain[i] = 1 * curAmplitude * amplitude
                counter = 1;
            }
        }
    
        let bufferSource = this.audioCtx.createBufferSource();
        let buffer = this.audioCtx.createBuffer(
            1, clickTrainLengthSmpls, this.audioCtx.sampleRate);
        buffer.getChannelData(0).set(clickTrain);
        bufferSource.buffer = buffer;
        bufferSource.connect(this.audioCtx.destination);
        bufferSource.start();

        bufferSource.addEventListener("ended", e => this.stop());
    }
}

let player = new Player();
