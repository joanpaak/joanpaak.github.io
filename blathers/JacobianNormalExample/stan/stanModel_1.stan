data{
  int N;
  vector[N] y;
  int includeJacobian;
}

parameters{
  real mu;
  real logSD;
}

model{
  mu ~ normal(0, 5);
  exp(logSD) ~ lognormal(1.5, 0.5);
  
  // For sampling from the prior. In R use "y = array(dim=0))"
  if(N > 0){
    y ~ normal(mu, exp(logSD));
  } 
  
  if(includeJacobian == 1){
    target += log(exp(logSD));
  }
}

