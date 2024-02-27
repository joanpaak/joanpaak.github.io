///////
/////// LOGISTIC AND LOGIT STUFF

"use strict";

// https://en.wikipedia.org/wiki/Logit
// (-Inf Inf) -> (0, 1)
function inverseLogit(x){
    return 1.0 / (1.0 + Math.exp(-x));
}

function logisticPDF(x, s){
    return Math.max(0.0, Math.exp(-x/s) / (s * Math.pow(1 + Math.exp(-x/s), 2)));
}

function logisticPDFNormalized(x, s){   
    return logisticPDF(x, s) / logisticPDF(0, s);   
}

function logisticCDF(x, mu, sd){
    // theta[0] = variance
    // theta[1] = criterion
    
    if(!isSigmaValid(sd, "logisticCDF")) return undefined;
    
    let p = (1.0 / (1.0 + Math.exp(-(x - mu) / sd)));
    
    //if(isNaN(p)) p = 1.0;
    
    return Math.max(0.0, Math.min(1.0, p));
}

///////
/////// NORMAL DISTRIBUTION STUFF

function normalPDF(x, mu, sigma){
    
    if(!isSigmaValid(sigma, "normalPDF")) return undefined
    
    let coeff = 1.0 / (sigma * Math.sqrt(2 * Math.PI));
    let d = Math.exp(-0.5 * Math.pow((x - mu) / sigma, 2));
    
    return Math.max(0.0, coeff * d);
}

function normalPDFNormalized(x, mu, sigma){
    if(!isSigmaValid(sigma, "normalPDFNormalized")) return undefined
    
    return normalPDF(x, mu, sigma) / normalPDF(mu, mu, sigma);
}

// From stan math
//https://github.com/stan-dev/monostan/blob/master/stan/math/fwd/scal/fun/Phi_approx.hpp

function normalCDFApprox(x){
  let x_cubed = x * x * x;
  return Math.min(1.0, Math.max(0.0, inverseLogit(0.07056 * x_cubed + 1.5976 * x)));
}

// From Wikipedia:
// https://en.wikipedia.org/wiki/Normal_distribution#Numerical_approximations_for_the_normal_CDF_and_normal_quantile_function
function normalICDFApprox(x){

    if(x < 0 || x > 1) return NaN;

    if(x < 0.001) return -Infinity;
    if(x >0.999) return Infinity;
 
    if(x >= 0.5){
        return 5.5556 * (1 - Math.pow((1 - x) / x, 0.1186));
    }
    x = (1 - x);
    return -(5.5556 * (1 - Math.pow((1 - x) / x, 0.1186)));

}

/**
 * Generates a random standard normal deviate using the Box-Muller method.
 * http://www.mat.ufrgs.br/~viali/estatistica/mat2274/material/textos/p376-muller.pdf
 */ 
function genSTDNormalRand() {
	let U1 = Math.random();
	let U2 = Math.random();
	
	// TODO: Math.log(0) might cause problems.  Actually what I think happens 
    // is that positive infinity will be returned by the function. That might
    // be slightly awkward.
	
	return Math.pow(-2.0 * Math.log(U1), 0.5) * Math.cos(2.0 * Math.PI * U2);
}


/// https://en.wikipedia.org/wiki/Stirling%27s_approximation#Versions_suitable_for_calculators
/// 
function gammaFunctionApprox(x){
    return Math.sqrt((2 * Math.PI) / x) * Math.pow((1.0 / Math.E) * (x + 1.0 / (12 * x - 1.0 / (10 * x))) , x);   
}

/* THIS IS THE VERSION THAT R USES BY DEFAULT 
   https://en.wikipedia.org/wiki/Gamma_distribution
   Shape/rate parameterization of the gamma distribution
*/
function gammaPDF(x, alpha, beta){
    if(alpha < 0 || beta < 0) console.log("Error in gammaPDF: parameters must be > 0.");    
    if(x < 0) return 0;
    
    return (Math.pow(beta, alpha) / gammaFunctionApprox(alpha)) * 
      Math.pow(x, alpha - 1) * Math.exp(- beta * x);
}

/* Shape/scale parameterization of the 
   https://en.wikipedia.org/wiki/Gamma_distribution
   gamma function */
function gammaPDF_2(x, k, theta){
    if(x < 0 ) return 0;
    return (1.0 / (gammaFunctionApprox(k) * Math.pow(theta, k))) * Math.pow(x, k - 1) * Math.exp(-(x / theta));
}

////

function betaPDF(x, alpha, beta){
    if(alpha <= 0 || beta <= 0) console.log("Problem in beta distribution: parameter value(s) incorrect");
    if(x < 0 || x > 1.0) console.log("Problem in beta distribution: x < 0 or x > 1");
    
    return (Math.pow(x, alpha - 1) * Math.pow(1 - x,beta - 1)) / ((gammaFunctionApprox(alpha) * gammaFunctionApprox(beta)) / gammaFunctionApprox(alpha + beta));
}

////

/* A convenience function for checking that a vector sums to unity */
function sumsToUnity(x){
    let s = 0;
    const tolerance = Number.MIN_VALUE;
    
    for(let i = 0; i < x.length; i++){
        s += x[i];
    }
    
    if(Math.abs(s - 1) > tolerance){
        return false;
    } else {
        return true;
    }
}

function areAllEntriesPositive(x){
    const tolerance = Number.MIN_VALUE;
    if(x.every((curVal) => curVal > (-tolerance))) return true;
    return false;
}

/* Checks for functions that calculate statistics based on
   weighted random deviates. 
   
   INPUT: 
     x : vector of random deviates
     p : vector of weights
     callingFunction : name of the calling function as a string
     
   OUTPUT:
     true  : if everything checks out
     false : if there are problems
*/

function isWeightVectorValid(x, p, callingFunction){
    if(x.length != p.length) {
        console.log("Error in function '" + callingFunction + "': " +
          "vector of random deviates " + 
          "and vector of weights have different lengths.");
        return false;
    } else if(!areAllEntriesPositive(p)){
        console.log("Error in function '" + callingFunction + "': " + 
         "negative values in weight vector.");
         return false;
    } else if(!sumsToUnity(p)){
        console.log("Error in function '" + callingFunction + "': " + 
          "vector of weights does not sum to unity.");
        return false;
    } else {
        return true;
    }           
}

/* Check sigma */

function isSigmaValid(sigma, callingFunction){
    if(sigma <= 0){
        console.log("Error in '" + callingFunction + "':" + 
          "standard deviation must be > 0.")
        return false;  
    } 
    return true;
}

/* Mean of the vector x. 

   If the vector of weights, p, is not supplied, uniform 
   weights are assumed. The vector of weights should sum 
   to one and be of the same length as x.
*/
function mean(x, p){   
    let s = 0;
    
    if(p === undefined){
        for(let i = 0; i < x.length; i++){
             s += x[i];  
        }
        return s / x.length;   
    } else {
        if(!isWeightVectorValid(x, p, "mean")) return undefined;
       
        for(let i = 0; i < x.length; i++){
             s += x[i] * p[i];  
        }
        return s;              
    }
}

function variance(x, p){
    let m;
    let s = 0;
    
    if(p === undefined){
        m = mean(x);
        
        for(let i = 0; i < x.length; i++){
            let y = x[i] - m;
            
            s += ((x[i] - m) * (x[i] - m));
        }
        
        return s / x.length;        
    } else {
        if(!isWeightVectorValid(x, p, "variance")) return undefined;
        m = mean(x, p);
        
        for(let i = 0; i < x.length; i++){
            let y = x[i] - m;
            
            s += ((x[i] - m) * (x[i] - m)) * p[i];
        }
        
        return s;
    }
}

function sd(x, p){
    if(p === undefined){
        return Math.sqrt(variance(x));
    } else {
        if(!isWeightVectorValid(x, p, "sd")) return undefined;
        return Math.sqrt(variance(x, p));
    }
}

function quantile(x, q){
    let sorted_x = x.sort(function(a, b) {return a - b});
    
    if(q.length === undefined) return sorted_x[Math.round(q * x.length)];
    
    let quantiles = new Array(q.length);
    
    for(let i = 0; i < q.length; i++){
        quantiles[i] = sorted_x[Math.round(q[i] * x.length)];
    }
    
    return quantiles;
}

//// QUANTILES FOR A VECTOR WITH WEIGHTS

/*
The logic here is that in order to sort both the random
deviates AND their associated weights, these are bundled
into "WeightedDeviate" objects, and the array of these 
objects is sorted. What a load of shit that logic is! 
*/

/*
  INPUT:
    x : vector of random deviates
    p : vector of weights
    q : quantiles to compute
*/
function quantile_w(x, p, quants){
    let weightedDeviateArray = toArrayOfWeightedDeviates(x, p);
    weightedDeviateArraySorted = 
      weightedDeviateArray.sort(function(a, b) {return a.x - b.x});
    let q = cumsum(p);
}

function toArrayOfWeightedDeviates(x, p){
    let weightedDeviateArray = new Array(x.length);
    
    for(let i = 0; i < x.length; i++){
        weightedDeviateArray[i] = new WeightedDeviate(x[i], p[i]);
    }
    
    return weightedDeviateArray;
    
}

/* Cumulative sum of the vector x */
function cumsum(x){
    let q = new Array(x.length);
    q[0] = x[0];
    
    for(let i = 1; i < x.length; i++){
        q[i] = q[i - 1] + x[i];
    }
    
    return q;
}

class WeightedDeviate{
    constructor(x, p){
        this.x = x;
        this.p = p;
    }
}


///////

/*
createVectorOfIndices(3) = [0, 1, 2]
*/
function createVectorOfIndices(N){
    let inds = new Array(N);
    
    for(let i = 0; i < N; i++){
        inds[i] = i;
    }

    return(inds);
}

/**/ 
function findFirstIndex(x, inds, lim){
  if(x.length === 1) {
    return inds;
  }
  
  let n = Math.ceil(x.length / 2);
  /* 
  1.1 2.3 3.4 4.2 5.1 6.4 7.1 8.6 9.3 10.7
  0   1   2   3   4   5   6   7   8   9
  
  n = 5 on 2. puoliskon ensimmäinen
  n - 1 on 1. puoliskon viimeinen
  
  */

  if(x[n-1] > lim){
    return findFirstIndex(x.slice(0, n), inds.slice(0, n), lim);
  } else {
    return findFirstIndex(x.slice(n, x.length), inds.slice(n, inds.length), lim);
  }
}

//let ö = [1, 2, 3, 4, 5];

/* 
function findFirstIndex(x, inds, lim){
    if(x.length === 1) {
      return inds;
    }
    
    let n = Math.ceil(x.length / 2);

  
    if(x[n-1] > lim){
      return findFirstIndex(x.slice(0, n),  inds.slice(0, n), lim);
    } else {
      return findFirstIndex(x.slice(n, x.length), inds.slice(n, inds.length), lim);
    }
  }
  */