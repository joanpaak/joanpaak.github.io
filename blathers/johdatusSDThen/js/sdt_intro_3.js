"use strict";

/*
Tikkujenluokittelukoneen visuaalisaatiot:
  vis_0 = Skemaattinen esitys tikkujenluokittelukoneesta
  vis_1 = Tikkujenluokittelukoneen "psykometrinen funktio"

Jauhosäkkienluokittelukoneen visuaalisaatiot:
  vis_2 = Normaalijakauma (mu = 0)
  vis_3 = Säkkien luokittelu, normaalijakauma
  vis_4 = Jauhosäkkien "psykometrinen funktio"
  
Taajuuserojen havaitseminen:
  vis_5 = Normaalisti jakautuneet "vaikutelmat"
  vis_6 = Psykometrinen funktio
   
*/

const vis_1 = new Plot(
  document.getElementById("vis_1"),
  null,
  {
    xlim : [100, 120],
    ylim : [0, 1],
    mar : [80, 70, 10, 30],
    ylab: "P(Suuri)",
    xlab : "Todellinen määrä"
  });


    
const vis_2 = new Plot(
  document.getElementById("vis_2"),
  null,
  {
    xlim : [-10, 10],  
    ylim : [0, 1], 
    mar : [50, 80, 10, 30],
    ylab : "Tiheys",
    xlab : "Virheiden suuruus (g)"
  });
  
const vis_3 = new Plot(
  document.getElementById("vis_3"),
  null,
  {
    xlim : [40, 60], 
    ylim : [0, 1], 
    mar : [50, 80, 10, 30],
    ylab : "Tiheys",
    xlab : "Paino (g)"
  });
  
const vis_4 = new Plot(
  document.getElementById("vis_4"),
  null, 
  {
    xlim : [50, 80], 
    ylim : [0, 1], 
    mar : [50, 80, 10, 30],
    xlab : "Todellinen paino (g)",
    ylab : "P(Suuri)"
  });

const vis_5 = new Plot(
  document.getElementById("vis_5"),
  null,
  {
    xlim : [0, 10], 
    ylim : [0, 1], 
    mar : [50, 80, 10, 30],
    xlab : "Vaikutelma",
    ylab : "Tiheys"
  });
  
const vis_6 = new Plot(
  document.getElementById("vis_6"),
  null, {
    xlim : [0, 10], 
    ylim : [0, 1], 
    mar : [50, 80, 10, 30],
    xlab : "Taajuusero (Hz)",
    ylab : "P(Kyllä)"
  });

///  

drawVis1();
drawVis2();
drawVis3();
drawVis4();
drawVis5();
drawVis6();

// This part adds the number in parentheses after each input slider:

let inputs = document.getElementsByTagName("input");

for(let i = 0;  i < inputs.length; i++){
  inputs[i].addEventListener("input", function() {addQuantityToLabel(inputs[i])}, false);
  addQuantityToLabel(inputs[i]);  
}

function addQuantityToLabel(e){
    let nDecimals;
    
    if(e.getAttribute("step") < 1){
        nDecimals = 2;
    } else{
        nDecimals = 0;
    }
    
    e.nextElementSibling.innerText = "(" + e.valueAsNumber.toFixed(nDecimals) + ")";
}

function seq(start, end, length){
    let x = new Array(length);
    let stepSize = (end - start) / (length - 1);
    
    for(let i = 0; i < length; i++){
      x[i] = start + i * stepSize;  
    }
    
    return x;
}

/* Tulitikkukoneen "psykometrinen funktio" */
function drawVis1(){
    let variance  = parseFloat(document.getElementById("vis_1_variance").value);
    let criterion = parseFloat(document.getElementById("vis_1_crit").value);
    
    let x = new Array(21);
    
    for(let i = 0;  i <= 20; i++){
      x[i] = i + 100;    
    }
    
    let y = new Array(x.length);
    
    for(let i = 0; i < x.length; i++){
      y[i] = PLarger(x[i], [variance, criterion]);
    }
    
    vis_1.clearData();
    
    vis_1.hline(0, {stroke : "black", lty : 2});
    vis_1.drawLine([criterion, criterion], [0,1]);
    vis_1.drawLines(x, y);
    vis_1.drawPoints(x, y);
}

/////////
/* Jauhosäkkien virheet: normaalijakauma, jonka mu = 0*/
function drawVis2(){
    let variance = parseFloat(document.getElementById("vis_2_variance").value);
    
    let x = seq(-10, 10, 200);
    
    let y = new Array(x.length);
    
    for(let i = 0; i < x.length; i++){
      y[i] = normalPDF(x[i], 0, variance);
    }
    
    vis_2.clearData();
    vis_2.hline(0, {stroke : "black", lty : 2});
    vis_2.drawLines(x, y);   
}

/* Säkkien luokitelu, normaalijakauma*/
function drawVis3(){
   
    let mu    = parseFloat(document.getElementById("vis_3_true").value);
    let sigma = parseFloat(document.getElementById("vis_3_variance").value);
    // Range: 40,60  
    /* These are calculated in two parts, so that they 
       don't have to be recalculated for drawing the polygon: */
    let x_before_crit = seq(40, 49.5, 75);
    let x_after_crit  = seq(49.5, 60, 75);
    
    let y_before_crit = new Array(x_before_crit.length);
    let y_after_crit = new Array(x_after_crit.length);
    
    for(let i = 0; i < x_before_crit.length; i++){
        y_before_crit[i] = normalPDF(x_before_crit[i], mu, sigma);
    }
    
    for(let i = 0; i < x_after_crit.length; i++){
        y_after_crit[i] = normalPDF(x_after_crit[i], mu, sigma);
    }
       
    vis_3.clearData();

    vis_3.hline(0, {stroke : "black", lty : 2});

    vis_3.drawLines([...x_before_crit,...x_after_crit], 
     [...y_before_crit,...y_after_crit]);
     
    vis_3.drawPolygon([49.5, ...x_after_crit, 60], [0, ...y_after_crit, 0]);
    vis_3.drawPolygon(
      [40, ...x_before_crit, 49.5], 
      [0, ...y_before_crit, 0], 
      {
        col : "rgba(255,255,255,0)"
      });
    
    vis_3.drawLine([49.5, 49.5], [0, 1]);
    
    vis_3.drawLine(
      [mu,mu],
      [0, normalPDF(mu, mu, sigma)],
      {
        "stroke-dasharray": 4
      });
    
    let probSmall = normalCDFApprox((49.5 - mu) / sigma);
    let probLarge = 1.0 - probSmall;
    
    // ERROR: Fix this!
    let pgons = vis_3.svgElement.getElementsByTagName("polygon");
    
    const title_1 = document.createElementNS("http://www.w3.org/2000/svg", "title");
    const title_2 = document.createElementNS("http://www.w3.org/2000/svg", "title");
    
    title_1.textContent = "P(painava) = " + probLarge.toFixed(2);
    title_2.textContent = "P(kevyt) = " + probSmall.toFixed(2);
    
    pgons[0].appendChild(title_1);
    pgons[1].appendChild(title_2);
    
    document.getElementById("vis_3_probs").innerText = 
       "Todennäköisyys että säkki luokitellaan painavaksi on " + probLarge.toFixed(2) + 
       " ja kevyeksi on " + probSmall.toFixed(2) + ". (Huomaa mahdolliset pyöristysvirheet).";        
}

function drawVis4(){
    vis_4.clearData();
    
    let x = seq(50, 80, 200);
    let y = new Array(x.length);
    
    for(let i = 0; i < x.length; i++){
      y[i] = pLarge(x[i], parseFloat(document.getElementById("vis_4_crit").value), 
        parseFloat(document.getElementById("vis_4_var").value));
    }
    
    vis_4.hline(0, {stroke : "black", lty : 2});
    vis_4.drawLines(x, y);
    vis_4.drawLine(
      [parseFloat(document.getElementById("vis_4_crit").value), 
       parseFloat(document.getElementById("vis_4_crit").value)], 
      [0,1], 
      {
        "stroke-dasharray" : 4
      });     
}

function drawVis5(){
    let mu    = parseFloat(document.getElementById("vis_5_true").value);
    let sigma = parseFloat(document.getElementById("vis_5_var").value);
    
    /* These are calculated in two parts, so that they 
       don't have to be recalculated for drawing the polygon: */
    let x_before_crit = seq(0, 3.0, 30);
    let x_after_crit  = seq(3.0, 10, 70);
    
    let y_before_crit = new Array(x_before_crit.length);
    let y_after_crit = new Array(x_after_crit.length);
    
    for(let i = 0; i < x_before_crit.length; i++){
        y_before_crit[i] = normalPDF(x_before_crit[i], mu, sigma);
    }
    
    for(let i = 0; i < x_after_crit.length; i++){
        y_after_crit[i] = normalPDF(x_after_crit[i], mu, sigma);
    }
    
    vis_5.clearData();
    
    vis_5.hline(0, {stroke : "black", lty : 2});
    vis_5.drawPolygon([3.0, ...x_after_crit, 10], [0, ...y_after_crit, 0]);
    vis_5.drawPolygon(
      [0.0, ...x_before_crit, 3.0], 
      [0.0, ...y_before_crit, 0], 
      {
        col : "rgba(255,255,255,0)"
      });

    vis_5.drawLines([...x_before_crit,...x_after_crit], 
     [...y_before_crit,...y_after_crit]);
     
    vis_5.drawLine([3.0, 3.0], [0, 1]);
    
    vis_5.drawLine(
      [mu,mu],
      [0, normalPDF(mu, mu, sigma)], 
      {
        "stroke-dasharray" : 4
      });

    let probSmall = normalCDFApprox((3.0 - mu) / sigma);
    let probLarge = 1.0 - probSmall;
    
    // ERROR: Fix this
    let pgons = vis_5.svgElement.getElementsByTagName("polygon");
    
    const title_1 = document.createElementNS("http://www.w3.org/2000/svg", "title");
    const title_2 = document.createElementNS("http://www.w3.org/2000/svg", "title");
    
    title_1.textContent = "P(Kyllä) = " + probLarge.toFixed(2);
    title_2.textContent = "P(Ei) = " + probSmall.toFixed(2);
    
    pgons[0].appendChild(title_1);
    pgons[1].appendChild(title_2);    
    document.getElementById("vis_5_probs").innerText = 
       "Todennäköisyys että vastaus on 'kyllä' on " + probLarge.toFixed(2) + 
       " ja 'ei' on " + probSmall.toFixed(2) + ". (Huomaa mahdolliset pyöristysvirheet).";        
}

function drawVis6(){
    let criterion = parseFloat(document.getElementById("vis_6_crit").value);
    let variance  = parseFloat(document.getElementById("vis_6_variance").value);
    
    let x = seq(0, 10, 100);
    
    let y = new Array(x.length);
    
    for(let i = 0; i < x.length; i++){
      y[i] = logisticCDF(x[i], criterion, variance);
    }
    
    vis_6.clearData();
    vis_6.hline(0, {stroke : "black", lty : 2});
    vis_6.drawLines(x, y);
}


//////

// SDT GAME

class SDTGame{
    constructor(){
      // These are used for drawing the game:
      this.x = seq(100, 120, 21);
      
      this.curve_y  = new Array(this.x.length);
      this.trueParameters = new Array(2);
      this.x_measured  = new Array(2);
      this.target_y    = new Array(2);
      
      //
      
      this.varianceInput  = document.getElementById("sdt_game_variance");
      this.criterionInput = document.getElementById("sdt_game_criterion");
      
      //

      this.gameVis = new Plot(
        document.getElementById("sdt_game"),
        null, 
        {
          xlim : [100, 120], 
          ylim : [0, 1], 
          mar : [50, 80, 10, 30],
          xlab : "Todellinen määrä",
          ylab : "P(Suuri)"
        });
      
      
      this.infoTextField = document.getElementById("sdt_game_info_text");
    }
    
    initializeNewSDTGame(){
      this.trueParameters = [Math.round(Math.random() * 13 + 2),
                             Math.round(Math.random() * 15 + 102)];
      
      let xMin = Math.max(this.trueParameters[1] - this.trueParameters[0], 100);
      let xMax = Math.min(this.trueParameters[1] + this.trueParameters[0], 120);
      
      this.x_measured = [xMin + 1, xMax - 1];

      for(let i = 0; i < this.x_measured.length; i++){
          this.target_y[i] = PLarger(this.x_measured[i], this.trueParameters);
      }      
    }
    
    drawSDTGame(){
      let variance  = parseFloat(this.varianceInput.value);
      let criterion = parseFloat(this.criterionInput.value);
      
      for(let i = 0; i < this.x.length; i++){    
        this.curve_y[i] = PLarger(this.x[i], [variance, criterion]);
      }
      
      // Draw everything:
      
      this.gameVis.clearData();
      this.gameVis.drawLines(this.x, this.curve_y);
      this.gameVis.drawPoints(this.x_measured, this.target_y);
      
      /*this.gameVis.ctx.setLineDash([4,2]);
      
      for(let i = 0; i < this.x_measured.length; i++){
        this.gameVis.drawLine([this.x_measured[i], this.x_measured[i]], 
        [PLarger(this.x_measured[i], [variance, criterion]), this.target_y[i]]);
          
      }
      
      this.gameVis.ctx.setLineDash([]);
      */
      //
              
          
      // Check for winning condition
      
      if(variance === this.trueParameters[0] & criterion === this.trueParameters[1]){      
          this.infoTextField.innerText = 
              "Onnitteluni! Löysit oikeat arvot!";             
      } else{
          this.infoTextField.innerText = 
              "Yritä saada käyrä kulkemaan pallojen kautta.";            
      }        
    }
}

const sdtGame = new SDTGame();

function initializeSDTGame(){
    sdtGame.initializeNewSDTGame();
    sdtGame.drawSDTGame();
}

function drawSDTGame(){
    sdtGame.drawSDTGame();
}

///// AUXILIARY FUNCTIONS ////

/*
Probability that the bundle of matches is categorized as being "large".
Input:
  S     : true count
  theta : [variance, criterion]
*/
function PLarger(S, theta){
    // theta[0] = "variance"
    // theta[1] = criterion
    
    // When variance  = 0, this only works because e.g. -3/0 is -Infinity and 3/0 is Infinity.
    // If that behaviour changes, or is different on different browsers etc. this breaks.
    let p = Math.max(0.0, Math.min(1.0, ((S + theta[0]) - theta[1] + 1) / (theta[0] * 2 + 1)));
    
    if(isNaN(p)) p = 1.0;
    
    return p;
}

/* Probability that a bag that will be categorized as large.

INPUT:
  weight    : the true weight of the bag
  criterion : criterion between categories (small/large)
  sigma     : standard deviation of errors in measuring the weight
  
OUTPUT:
  probability that the bag will be categorized as large
*/
function pLarge(weight, criterion, sigma){
    return 1.0 - normalCDFApprox((criterion - weight) / sigma);
}

