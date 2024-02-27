functions{
  real W_int(real g, real r, real p){
    return -(1 - r)*(1/p)*(2 + p*g)*exp(-p*g) + r*g;
  }
  
  real predThr_dB(real l, 
                  real u, 
                  real K_log, 
                  real r_log, 
                  real p, 
                  real f0_Hz, 
                  real N0_dB){
    
    real r = pow(10, r_log/10);
    real thr_magnitude = 2 * f0_Hz * (W_int(u, r, p) - W_int(l, r, p));
    
    return N0_dB + K_log + 10.0 * log10(thr_magnitude);
  }  
}

data{
  int  N;                   // Number of notch widths
  real nw_Hz[N];            // Notch widths in Hz
  real obsThreshold_dB[N];  // Observed thresholds
  
  real f0_Hz; // Center frequency
  real N0_dB; // Spectrum level of masker
  real bw_Hz; // Distance of the outer edges of the masker
}

parameters{
  // Efficiency of detection:
  real K_log;
  // Parameters of the filter:
  real r_log;
  real<lower = 0> p;
  
  // Error between preditions and observations:
  real<lower = 0> sigma;
}

model{
  real mu;
  
  // Priors for the parameters, change these to suit 
  // your situation:
  K_log  ~ normal(0, 5);
  r_log ~ normal(-40, 20);
  p     ~ gamma(4, 0.13);
  
  sigma ~ gamma(3, 1);
  
  for(i in 1:N){
    mu = predThr_dB(nw_Hz[i]/2/f0_Hz, 
                   (f0_Hz + bw_Hz) / f0_Hz, 
                   K_log, 
                   r_log, 
                   p, 
                   f0_Hz, 
                   N0_dB);
    obsThreshold_dB[i] ~ normal(mu, sigma);
  }
}
