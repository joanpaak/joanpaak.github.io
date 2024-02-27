"use strict;"

/* This is the... well, examplar table, that the user can 
   update by clicking the "Add Observation" button. */
class ExampleTable{
    
    constructor(){
        this.N = 0;
        this.NParticles = 20;
        this.table = document.getElementById("particleTable");
        this.addObsBtn = document.getElementById("addObservationBtn");
        this.yContainer = document.getElementById("yContainer");
        
        // Initialize particle set
        
        this.muParticles = new Array(this.NParticles);
        this.sdParticles = new Array(this.NParticles);
        this.weights     = new Array(this.NParticles);
        
        for(let i = 0; i < this.NParticles; i++){
            this.muParticles[i] = genSTDNormalRand();
            this.sdParticles[i] = Math.exp(genSTDNormalRand() * 0.5);
            this.weights[i]     =  1.0/this.NParticles;
        }
        
        this.createTable();
        
        this.addObsBtn.addEventListener("click", e => this.addObservation());
    }
    
    addObservation(){
        if(this.N > 50){
          this.addObsBtn.disabled = true;
        } else{
          this.N++;
          let y = genSTDNormalRand() * 0.7 + 0.5;
          let sumOfWeights = 0;
        
          for(let i = 0; i < this.NParticles; i++){
              this.weights[i] *= normalPDF(y, this.muParticles[i], this.sdParticles[i]);
              sumOfWeights += this.weights[i];
          }
        
          for(let i = 0; i < this.NParticles; i++){
              this.weights[i] /= sumOfWeights;
          }
        
          /* Update table */
          this.clearTable();
          this.createTable();
        
          /* Add observation to array of observations*/
        
          this.yContainer.innerText += (" " + y.toFixed(2) + " |"); 
        }

    }
    
    createTable(){
        this.table.appendChild(this.createRow("Mu", "SD", "Weight"));
        
        for(let i = 0; i < this.NParticles; i++){
          this.table.appendChild(this.createRow(this.muParticles[i], 
                                                this.sdParticles[i],
                                                this.weights[i]));  
        }
    }
    
    clearTable(){
        while(this.table.firstElementChild){
            this.table.firstElementChild.remove();
        }
    }
    
    createRow = function(p1, p2, w) {
        let row    = document.createElement("tr");
        let p1cell = document.createElement("td");
        let p2cell = document.createElement("td");
        let wcell  = document.createElement("td");
        
        if(isNaN(p1)){
           p1cell.innerText = p1;
           p2cell.innerText = p2;
           wcell.innerText  = w;            
        } else {
          p1cell.innerText = p1.toFixed(2);
          p2cell.innerText = p2.toFixed(2);
          wcell.innerText  = w.toFixed(2);            
        }

        
        row.appendChild(p1cell);
        row.appendChild(p2cell);
        row.appendChild(wcell);
        
        return row;
    }
}

let exTab = new ExampleTable();
