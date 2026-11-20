data{
  int n;
  array[n] real x;
  array[n] real y;
  
  int n_rep;
  array[n_rep] real x_rep;
}

parameters{
  real a;
  real b;
  real<lower = 0> sigma;
  real<lower = 0, upper = 1> delta;
}

model{
  a ~ normal(0, 10);
  n ~ normal(0, 10);
  sigma ~ gamma(2, 0.25);
  delta ~ beta(1, 1);
  
  for(i in 1:n){
    target += log(delta * exp(normal_lpdf(y[i] | 0, 100)) + 
      (1.0 - delta) * exp(normal_lpdf(y[i] | a + b * x[i], sigma)));
  }
}

// When generating predictions, we only use the 
// linear component:
generated quantities{
  array[n_rep] real y_rep;
  
  for(i in 1:n_rep){
    y_rep[i] = normal_rng(a + b * x_rep[i], sigma);
  } 
}
