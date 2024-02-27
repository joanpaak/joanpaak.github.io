// Normal model with known variance
// Note, this is not optimal wrt performance:
// this is intended to be easy to read.

data{ 
  // Observations are given as an array, 
  // for which the length also needs to be given:
  int<lower = 1> N;
  real y[N];
  
  // Prior information is given as data:
  real priorMu_mu;
  real<lower = 0> priorSD_mu;

  // "Measurement error"
  
  real<lower = 0> tau;
}

parameters{
  real priorMu;

  real mus[N];
}

model{

  priorMu ~ normal(priorMu_mu, priorSD_mu);

  mus ~ normal(priorMu, 1.0);

  for(i in 1:N){
    y[i] ~ normal(mus[i], tau);
  }
}

