"use strict";

class ParticleTable{
    constructor(){
        this.table      = document.getElementById("particleTable");
        this.addObsBtn  = document.getElementById("addObservationBtn");
        this.yContainer = document.getElementById("yContainer");

        this.addObsBtn.addEventListener("click", () => this.addObservation());
        
        //

        this.nObservations = 0;
        this.maxNObservations = 50;
        this.nParticles = 20;

        //
        this.initializeParticleSet();
        this.initializeTable();
    }

    addObservation(){
        let curY = genSTDNormalRand() * 0.7 + 0.5;
        this.nObservations++;
        
        this.yContainer.innerText += ` ${curY.toFixed(2)}, `;
        this.updateWeights(curY);
        
        if(this.nObservations >= this.maxNObservations){
            this.addObsBtn.disabled = true;
        }
    }
    
    updateWeights(y){
        let sumOfWeights = 0;
    
        for(let i = 0; i < this.nParticles; i++){
            this.weights[i] *= normalPDF(y, this.muParticles[i], this.sdParticles[i]);
            sumOfWeights += this.weights[i];
        }
    
        for(let i = 0; i < this.nParticles; i++){
            this.weights[i] /= sumOfWeights;
            this.wCells[i].innerText = this.weights[i].toFixed(2);

            if(this.weights[i] < 0.009){
                Array.from(this.table.children[i+1].children).forEach(e => {
                    e.style.color = "red";
                });
            }
        }
    }

    initializeParticleSet(){
        this.muParticles = new Array(this.nParticles);
        this.sdParticles = new Array(this.nParticles);
        this.weights     = new Array(this.nParticles);

        for(let i = 0; i < this.nParticles; i++){
            this.muParticles[i] = genSTDNormalRand();
            this.sdParticles[i] = Math.exp(genSTDNormalRand() * 0.5);
            this.weights[i]     =  1.0/this.nParticles;            
        }
    }

    initializeTable(){
        let headerRow = document.createElement("tr");

        let headRow1 = document.createElement("th");
        let headRow2 = document.createElement("th");
        let headRow3 = document.createElement("th");

        headRow1.innerText = "Mu";
        headRow2.innerText = "SD";
        headRow3.innerText = "Weight";

        headerRow.replaceChildren(
            headRow1, headRow2, headRow3
        );

        this.table.appendChild(headerRow);

        this.wCells = new Array(this.nParticles);

        for(let i = 0; i < this.nParticles; i++){
            let curRow = document.createElement("tr");
            let muCell = document.createElement("td");
            let sdCell = document.createElement("td");
            let wCell  = document.createElement("td"); 

            muCell.innerText = this.muParticles[i].toFixed(2);
            sdCell.innerText = this.sdParticles[i].toFixed(2);
            wCell.innerText = this.weights[i].toFixed(2);

            this.wCells[i] = wCell;

            curRow.replaceChildren(
                muCell, sdCell, wCell
            );

            this.table.appendChild(curRow);
        }
    }
}

let particleTable = new ParticleTable();