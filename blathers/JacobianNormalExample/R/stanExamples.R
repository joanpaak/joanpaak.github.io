setwd("~/Documents/GitHub/joanpaak.github.io/tutorials/JacobianNormalExample/R/")

# Explicit exponentiation:
mdl_1 = rstan::stan_model("../stan/stanModel_1.stan")
# Stan's constraint:
mdl_2 = rstan::stan_model("../stan/stanModel_2.stan")
# Prior on log scale:
mdl_3 = rstan::stan_model("../stan/stanModel_3.stan")

# Sample from the prior

fit_1_wo_Jacob = rstan::sampling(mdl_1, 
                   data = list(y = array(dim = 0), 
                               N = 0,
                               includeJacobian = 0))

fit_1_Jacob = rstan::sampling(mdl_1, 
                     data = list(y = array(dim = 0), 
                                 N = 0,
                                 includeJacobian = 1))

fit_2 = rstan::sampling(mdl_2, 
                        data = list(y = array(dim = 0), 
                                    N = 0))

fit_3 = rstan::sampling(mdl_3, 
                        data = list(y = array(dim = 0), 
                                    N = 0))

### Figure: Stan, when is Jacobian needed and when not?

createPanel = function(stanFit, invtrans, mainTitle){
  plot(NULL, ylim = c(0, 0.3), xlim = c(0, 15),
       bty = "l", ylab = "", xlab = "", main = mainTitle)
  poly_x = c(seq(0, 15, length.out = 100), 15, 15, 0, 0)
  poly_y = c(dlnorm(seq(0, 15, length.out = 100), 1.5, .5), -1, -1, -1, -1)
  polygon(poly_x, poly_y, col = rgb(1, 0, 0, 0.4), lty = 0)
  points(density(invtrans(as.matrix(stanFit)[,2])), type = "l")
  
}

svg("../figs/stanJacobian.svg", height = 10, width = 10)
par(mfrow = c(2,2))
createPanel(fit_1_wo_Jacob, exp, "Model 1, No Jacobian")
createPanel(fit_1_Jacob, exp, "Model 1, Jacobian")
createPanel(fit_2, identity, "Model 2, Stan's Jacobian")
createPanel(fit_3, exp, "Model 3, Prior on log scale")
dev.off()


# Effect of increasing N

N = c(0, 5, 10, 50, 75, 100)
m = 10

differences = matrix(NaN, ncol = m, nrow = length(N))

for(i in 1:length(N)){
  for(j in 1:m){
    if(N[i] == 0){
      y = array(dim = 0)
    } else {
      y = rnorm(N[i], 2, 8)
    }
    
    fit_wo_Jacob = rstan::sampling(mdl_1, 
                                     data = list(y = y, 
                                                 N = N[i],
                                                 includeJacobian = 0))
    
    fit_Jacob = rstan::sampling(mdl_1, 
                                  data = list(y = y, 
                                              N = N[i],
                                              includeJacobian = 1))
    
    mu_wo_jacob = mean(exp(as.matrix(fit_wo_Jacob)[,2]))
    mu_jacob    = mean(exp(as.matrix(fit_Jacob)[,2]))
    
    differences[i,j] = mu_wo_jacob - mu_jacob
  }
}

svg("../figs/effectOfJacob.svg", width = 5, height = 5)
par(mfrow = c(1,1))
plot(NULL, xlim = range(N), ylim = range(abs(differences)),
     bty = "l", ylab = "Abs. difference in mean", xlab = "N")

for(i in 1:m){
  points(N, abs(differences[,i]), type = "b", lty = 2)
}
dev.off()
