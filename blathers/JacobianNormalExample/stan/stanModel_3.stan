data{
  int N;
  vector[N] y;
}

parameters{
  real mu;
  real logSD;
}

model{
  mu    ~ normal(0, 5);
  logSD ~ normal(1.5, 0.5);
  
  // For sampling from the prior. In R use "y = array(dim=0))"
  if(N > 0){
    y ~ normal(mu, exp(logSD));
  } 
}

