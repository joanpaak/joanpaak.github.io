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
}

model{
  a ~ normal(0, 10);
  n ~ normal(0, 10);
  sigma ~ gamma(2, 0.25);
  
  for(i in 1:n){
    y[i] ~ normal(a + b * x[i], sigma);
  }
}

generated quantities{
  array[n_rep] real y_rep;
  
  for(i in 1:n_rep){
    y_rep[i] = normal_rng(a + b * x_rep[i], sigma);
  }
}
