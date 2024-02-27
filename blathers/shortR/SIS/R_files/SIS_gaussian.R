# Sequential Importance Sampling for a simple Gaussian model

# Prior probability of theta.
# theta[1] = mu
# theta[2] = sd
prior = function(theta){
  dnorm(theta[1], 0, 1) * dlnorm(theta[2], 0, 0.5)
}

likelihood = function(y, theta){
  dnorm(y, theta[1], theta[2])
}

# Posterior probability of theta
posterior = function(theta, y){
   likelihood(y, theta) * prior(theta)
}

# Generate data set:
N = 10                   # Number of observations
y = rep(NaN, N)          # Vector for storing obs.
trueTheta = c(0.5, 0.7)  # Generating values 

# Initialize SIS

NParticles = 10000
particles  = matrix(NaN, ncol = 2, nrow = NParticles)
weights    = rep(1/NParticles, NParticles)

# Initial particle set is generated from the prior:
particles[,1] = rnorm(NParticles, 0, 2)
particles[,2] = rlnorm(NParticles, 0, 0.5)

# Initialize arrays for storing stuff (see inside)
# the main loop for explanation):
E_mu  = rep(NaN, N) 
E_sd  = rep(NaN, N)
SD_mu = rep(NaN, N)
SD_sd = rep(NaN, N)
N_eff = rep(NaN, N)

for(t in 1:N){
  # 1) Observe a data point
  y[t] = rnorm(1, trueTheta[1], trueTheta[2])
  
  # 2) Reweight the particle set based on the observation
  for(i in 1:NParticles){
    weights[i] = weights[i] * likelihood(y[t], particles[i,])
  }
  
  # 3) Normalize weights
  weights = weights / sum(weights)
  
  # We could store the full particle sets on each iteration, 
  # and that might be necessary for some applications, 
  # but here I am saving only the marginal expecations
  # and standard deviations - and effective sample sizes
  # so we can monitor particle degeneracy
  
  # Expected values (marginal posterior means):
  E_mu[t] = sum(weights * particles[,1])
  E_sd[t] = sum(weights * particles[,2])
  
  # Standard deviations (marginal posterior SD's)
  SD_mu[t] = sqrt(sum((E_mu[t] - particles[,1])^2 * weights))
  SD_sd[t] = sqrt(sum((E_sd[t] - particles[,2])^2 * weights))
  
  # Effective sample size:
  N_eff[t] = 1 / sum(weights^2)
}

# We can plot the trial-by-trial errors in posterior means: 
plot(E_mu - trueTheta[1], type = "b"); abline(h = 0, lty = 2)
plot(E_sd - trueTheta[2], type = "b"); abline(h = 0, lty = 2)
#...or the raw posterior means::
plot(E_mu, type = "b"); abline(h = trueTheta[1], lty = 2)
plot(E_sd, type = "b"); abline(h = trueTheta[2], lty = 2)

# Or the final marginals (note that the weights are supplied for the density function):
plot(density(particles[,1], weights = weights)); abline(v = trueTheta[1], lty = 2) 
plot(density(particles[,2], weights = weights)); abline(v = trueTheta[2], lty = 2)

# By plotting the effective sample size, we can see that the proportion 
# of particles that have non-neglible weights get small very fast:
plot(N_eff / NParticles, type = "b")

# For this reason, it is usually a good idea to rejuvenate the particle set
# every now and then, for example when the effective sample size drops below
# half of the original.
#
# Of course the speed at which the particle set degenerates depends on 
# the specifics of the situation: if the prior would be tighter, then 
# the more particles would be generated near the high-probability areas
# of the posterior, and their weights would degenerate slower.
