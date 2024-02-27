functions{
  real getPCorr(real dprime){
    
    if(dprime > 50){
      return(1.0);
    }
    
    return(Phi_approx(-0.42564703147 +
                       0.77172355802 * dprime +
                      -0.00325445571 * (dprime * dprime)));
  }
}

data {
  int<lower=0> N;
  real<lower = 0> S[N];
  int<lower = 0, upper = 1> R[N];
  
  real priorMus[2];
  real<lower = 0> priorSds[2];
}

parameters {
  real logAlpha;
  real logBeta;
}


model {
  logAlpha ~ normal(priorMus[1], priorSds[1]);
  logBeta  ~ normal(priorMus[2], priorSds[2]);
  
  for(i in 1:N){
    R[i] ~ bernoulli(0.02 * (1.0/3.0) + 0.98 * 
      getPCorr(pow(S[i] / exp(logAlpha), exp(logBeta))));
  }
}

