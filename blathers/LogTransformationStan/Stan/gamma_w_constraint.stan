data {
}

parameters {
  real<lower = 0> theta;
}

model {
  target += gamma_lpdf(theta | 3, 1);
}

