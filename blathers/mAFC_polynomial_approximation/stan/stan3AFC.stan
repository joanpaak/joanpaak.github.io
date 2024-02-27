functions{
  real getPCorr(real dprime){
  return(Phi_approx(-4.31232205e-01 +
                     7.77160861e-01 * dprime +
                    -3.97425403e-03 * pow(dprime, 2) +
                    -8.00229228e-05 * pow(dprime, 3) +
                     1.11980344e-05 * pow(dprime, 4)));
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

