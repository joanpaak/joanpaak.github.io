"use strict";

/*
settings = {
    NIter    : 1000,
    startVal : 0,
    logTheta    : function(x){
        if(x > 0 & x < 7) return Math.log(1/6);
        return Math.log(0);
    },
    propDist : function(x){
        let y = Math.random();
        if(y <= 0.5) return x + 1;
        return x - 1;
    }  
};

let MCMCChain = metropolisAlgorithm(settings);

*/
let dieSettings = {
    NIter    : 10000,
    startVal : 3,
    logTheta    : function(x){
        if(x > 0 & x < 7) return Math.log(1/6);
        return Math.log(0);
    },
    propDist : function(x){
        let y = Math.random();
        if(y <= 0.5) return x + 1;
        return x - 1;
    }
};

function metropolisAlgorithm(settings){
    
    let NAccepted = 0;
    
    let x = new Array(settings.NIter);
    x[0] = settings.startVal;
    
    let logCurDensity = settings.logTheta(x[0])
    
    for(let i = 1; i < settings.NIter; i++){
        let proposal = settings.propDist(x[i - 1]);
        
        let logPropDensity  = settings.logTheta(proposal);
        
        let logAcceptanceProbability = logPropDensity - logCurDensity;
        
        let s = Math.log(Math.random());
        
        if(s < logAcceptanceProbability){
            x[i] = proposal;
            logCurDensity = logPropDensity;
            NAccepted++;
        } else {
            x[i] = x[i - 1];
        }
    }
    
    return {chain : x,
            AcceptanceProb : NAccepted / settings.NIter};    
}

function counts(x){
    
    let y = new Array(6).fill(0);
    let z = 1.0 / x.length;
    
    for(let i = 0; i < x.length; i++){
        for(let j = 1; j <= 6; j++){
            if(x[i] === j) y[j-1]+=z;
        }        
    }
    return y;
}

let x = metropolisAlgorithm(dieSettings);
let y = counts(x);
