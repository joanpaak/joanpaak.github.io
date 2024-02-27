#
# A simple simulation which shows that how
# the range of the predictor affects 
# the standard error of the slope estimate
#

# Log posterior for a linear model
# with known residual standard deviation.
# Intercept and slope are both given
# a Normal(0, 5) prior.
# Input
# theta : vector [intercept, slope]
# x, y  : vectors of predictors and responses
# Output:
# log posterior density
posterior = function(theta, x, y){
  prior = sum(dnorm(theta, 0, 5, log = T))
  likelihood = sum(dnorm(y, theta[1] + theta[2] * x, 1.0, log = T))
  return(prior + likelihood)
}

# Estimates the posterior distribution on 
# a grid. 
# Input: 
# x, y : vectors of predictors and responses
# posterior : a function for calculating
#   the log posterior of a theta
# Output
# list with the elements
#   avals, bvals : points at which intercepts
#    and slopes were evaluated
#   post : matrix of log posterior values
gridEstimation = function(x, y, posterior){
  NGrid = 100
  
  post = matrix(NaN, ncol = NGrid, nrow = NGrid)
  avals = seq(-4, 5, length.out = NGrid)
  bvals = seq(-4, 5, length.out = NGrid)
  
  for(a in 1:NGrid){
    for(b in 1:NGrid){
      post[a,b] = posterior(c(avals[a], bvals[b]), x, y)
    }
  }
  
  return(list(avals = avals, 
              bvals = bvals, 
              post = post))
}

# Standard error of the slope estimate
# Input:
#  a list from the above function
sdtErrSlope = function(post){
  p = colSums(exp(post$post))
  p = p /sum(p)
  E = sum(post$bvals * p)
  return(sqrt(sum((E - post$bvals)^2*p)))
}

N_obs = seq(20, 400, 40)

sd_slope_1 = rep(NaN, length(N_obs))
sd_slope_2 = rep(NaN, length(N_obs))

for(i in 1:length(N_obs)){
  x_1 = seq(-0.5, 0.5, length.out = N_obs[i])
  y_1 = rnorm(N_obs[i], -0.5 + x_1 * 0.5)

  x_2 = seq(-1.5, 1.5, length.out = N_obs[i])
  y_2 = rnorm(N_obs[i], -0.5 + x_2 * 0.5)
  
  post_1 = gridEstimation(x_1, y_1, posterior)
  post_2 = gridEstimation(x_2, y_2, posterior)
  
  sd_slope_1[i] = sdtErrSlope(post_1)
  sd_slope_2[i] = sdtErrSlope(post_2)
}


###

width = 4
height = 4

svg("../figs/linregslopeStdErr.svg",  width = width, height = height)
par(mfrow = c(1,1))
plot(NULL, xlim = range(N_obs), 
     ylim = range(c(sd_slope_1, sd_slope_2)), bty = "l",
     ylab = "Std. err. of Slope",
     xlab = "N observations")
points(N_obs, sd_slope_1, type = "b", pch = 19)
points(N_obs, sd_slope_2, type = "b", pch = 17, lty = 2)
dev.off()


