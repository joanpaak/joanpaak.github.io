"use strict;"


/**/
g = function(f, f0){
    return Math.abs(f - f0) / f0;
}

/*
Magnitude response of the ROEX(g, r, p) filter
INPUT: 
 g : normalized frequency: |f - f0| / f0
 r : sharpness of the filter
 r : minimum value
*/
W = function(g, r, p){
    if(g < 0){
        throw "g < 0 in W(g, r, p)!";
    }
    return (1.0 - r) * (1.0 + p * g) * Math.exp(-p * g) + r;
}

/* Tail integral of the magnitude response, W, defined above. 
   NOTE: Since the integral is divergent, don't use this 
   as is, but ONLY as a part of calculating bounded integrals! 
  
INPUT:
 lim  : limit of the integration in normalized frequency (see above)
 r, p : parameters of the filter (see above) 
OUTPUT:
Integral of the filter, roex(r, p), from 0 to lim. 
*/
W_int = function(lim, r, p){ 
   return -(1 - r) * (1.0 / p) * (2 + p * lim) * Math.exp(-p * lim) + r * lim; 
}

/* Definite integral for the ROEX(r, p) filter*/
W_def_int = function(lim_u, lim_l, r, p){
    return W_int(lim_u, r, p) - W_int(lim_l, r, p);
}

/*
W_int = function(lowlim, uplim, r, p){
  let d = ((-p * Math.exp(-p*uplim)*uplim-2*Math.exp(-p*uplim)) / p) - ((-p*Math.exp(-p*lowlim)*lowlim-2*Math.exp(-p*lowlim)) /p);
  return (uplim - lowlim) * r + (1 - r) * d;
}*/
    

/*Predicted threshold
INPUT
 variables:
  nw : notch width
 constants:
  f0 : center frequency
  N0 : power spectral density
  bw : bandwidth of noise
 parameters of the model:
  K  : efficiency of detection
  r  : minimum level of the filter
  p  : sharpness of the filter
*/
P_S = function(nw, f0, N0, bw, K, r, p){
    /* The "outer edges" of the noise masker. Since it's symmetric, 
       we can calculate just one */
    let outerEdge = (f0 + bw) / f0; 
    /* The "inner edges" of the noise masker. Again, since it is 
       symmetric, we can calculate just one. Note that it is halved, 
       since again we are calculating one half of a symmetric notch. */
    let innerEdge = (nw / 2.0) / f0; 
    
    /* ERROR
    if(K_and_r_log){
        K = Math.pow(10, K/10.0);
        
    }*/
    let areaOfMasker = W_int(outerEdge, innerEdge, r, p);
    //let areaOfMasker = W_int(innerEdge, outerEdge, r, p);
    
    return 2.0 * K * N0 * W_def_int(outerEdge, innerEdge, r, p);
}
