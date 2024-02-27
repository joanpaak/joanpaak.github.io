# First we define two target distributions:
target_wo_jacobian = function(theta){
    dgamma(exp(theta), 3, 1)
}

target_w_jacobian = function(theta){
    dgamma(exp(theta), 3, 1) * abs(exp(theta))
}

runChain = function(target){
    NIter = 50000
    x     = rep(NaN, NIter)
    x[1]  = log(runif(1, 1, 10))
       
    for(i in 2:NIter){
        proposal = rnorm(1, x[i-1], 1)
          
        P_accept = target(proposal) / target(x[i-1])
          
        if(runif(1) < P_accept){
            x[i] = proposal
        } else {
            x[i] = x[i - 1]
        }
    }
    return(x)
}
      
samples_wo_jacobian = runChain(target_wo_jacobian)
samples_w_jacobian  = runChain(target_w_jacobian)

par(mfrow = c(1,2))
hist(exp(samples_wo_jacobian), prob = T, main = "No Jacobian",
    breaks = 30, xlab = "x")
curve(dgamma(x, 3, 1), add = T, col  = "red", lwd = 2)
    
hist(exp(samples_w_jacobian), prob = T, main = "Jacobian", 
    breaks = 30, xlab = "x")
curve(dgamma(x, 3, 1), add = T, col  = "red", lwd = 2) 


