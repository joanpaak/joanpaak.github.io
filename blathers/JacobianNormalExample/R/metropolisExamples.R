# INPUT
# posterior : a function for evaluating the unnormalized posterior
# y         : a vector of data
runChain = function(posterior, y){
  NSteps      = 25000
  samples     = matrix(NaN, ncol = 2,  nrow = NSteps)
  samples[1,] = rnorm(2)
  
  for(i in 2:NSteps){
    proposal = rnorm(2, samples[i-1,], 1)
    
    P_accept = posterior(proposal, y) / posterior(samples[i-1,], y)
    
    if(is.nan(P_accept)) P_accept = 0
    
    if(runif(1) < P_accept){
      samples[i,] = proposal
    } else {
      samples[i,] = samples[i-1,]
    }
  }
  return(samples)
}

# INPUT
# theta : c(mu, sigma)
# y     : vector of data
# Note y can be of length zero: in that case we 
# simply are sampling from the prior distribution.
posteriorWoJacobian = function(theta, y){
  # Next we get the prior probabilities for the parameters.
  # Note that since theta[2] has been transformed, we 
  # use the inverse transform to get it back to the
  # original scale:
  
  prior = dnorm(theta[1], 0, 5) * dlnorm(exp(theta[2]), 1.5, 0.5)
  
  # This is just so we can run the Metropolis algorithm
  # with no data:
  
  
  if(length(y) == 0){
    likelihood = 1
  } else {
    likelihood = prod(dnorm(y, theta[1], exp(theta[2])))
  }
  
  
  # We return the product of the prior and likelihood,
  # there's no Jacobian adjustment!
  
  return(prior * likelihood)
}


# INPUT
# theta : c(mu, sigma)
# y     : vector of data
# Note y can be of length zero: in that case we 
# simply are sampling from the prior distribution.
posteriorJacobian = function(theta, y){
  prior = dnorm(theta[1], 0, 5) * dlnorm(exp(theta[2]), 1.5, 0.5)
  
  if(length(y) == 0){
    likelihood = 1
  } else {
    likelihood = prod(dnorm(y, theta[1], exp(theta[2])))
  }
  
  # But now we do the Jacobian adjustment, that is, 
  # multply the density with the absolute value of the 
  # derivative of the inverse transformation. Remember that
  # theta[2] is still on the unconstrained scale! 
  
  return((prior * likelihood) * abs(exp(theta[2])))
}

y = array(dim=0)
samplesWoJacobian = runChain(posteriorWoJacobian, y)
samplesJacobian   = runChain(posteriorJacobian, y)

# The neat plot that's on the web page

svg("../figs/jacobPlot1.svg", width = 10, height = 5)
par(mfrow = c(1,2))

plot(NULL, ylim = c(0, 0.1), xlim = c(-15, 15),
     bty = "l", ylab = "", xlab = "", main = expression(mu))
poly_x = c(seq(-15, 15, length.out = 100), 15, 15, -15, -15)
poly_y = c(dnorm(seq(-15, 15, length.out = 100), 0, 5), -1, -1, -1, -1)
polygon(poly_x, poly_y, col = rgb(1, 0, 0, 0.4), lty = 0)

points(density(samplesWoJacobian[,1]), type = "l", lwd = 2)
points(density(samplesJacobian[,1]), type = "l", lwd = 2, lty = 2)

plot(NULL, ylim = c(0, 0.3), xlim = c(0, 15),
     bty = "l", ylab = "", xlab = "", main = expression(sigma))
poly_x = c(seq(0, 15, length.out = 100), 15, 15, 0, 0)
poly_y = c(dlnorm(seq(0, 15, length.out = 100), 1.5, .5), -1, -1, -1, -1)
polygon(poly_x, poly_y, col = rgb(1, 0, 0, 0.4), lty = 0)

points(density(exp(samplesWoJacobian[,2])), type = "l", lwd = 2)
points(density(exp(samplesJacobian[,2])), type = "l", lwd = 2, lty = 2)
dev.off()
