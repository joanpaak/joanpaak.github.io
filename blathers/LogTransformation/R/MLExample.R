# Grab the dataset:
y = datasets::trees[,2]

# Define negative log likelihood
negLogLikelihood = function(theta, y){
  negLL = -sum(dnorm(y, theta[1], exp(theta[2]), log = T))
  return(negLL)
} 

# Use base R's BFGS optimizer to find numerical 
# estimates for the ML estimates:
fit = optim(c(83, 0), method = "BFGS", negLogLikelihood, y = y)

# Calculate ML estimates analytically:
p = rep(1/length(y), length(y))
E = sum(y * p)
SD = sqrt(sum((E - y)^2 * p))

# Print results. First the numerical estimates:
fit$par[1]
exp(fit$par[2])

# Then the analytical:
E
SD

