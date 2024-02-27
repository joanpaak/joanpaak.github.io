setwd("C:/Users/Joni/Documents/GitHub/joanpaak.github.io/sciency_stuff/mAFC_polynomial_approximation/R")

integrand = function(x, dprime, m){
  pnorm(x)^(m-1) * dnorm(x, dprime)
}

degrees = c(2, 3, 4, 5, 6, 7)
m_vals  = seq(3, 50, 1)

med_err = matrix(NaN, nrow = length(m_vals), ncol = length(degrees))
min_err = matrix(NaN, nrow = length(m_vals), ncol = length(degrees))
max_err = matrix(NaN, nrow = length(m_vals), ncol = length(degrees))

dprimes = seq(0, 7, length.out = 500)

fitind = seq(1, 500, 5)

for(k in 1:length(degrees)){
  
  for(j in 1:length(m_vals)){
    
    pcorr = rep(NaN, length(dprimes))
    
    for(i in 1:length(dprimes)){
      pcorr[i] = integrate(integrand, 
                           dprime = dprimes[i], m = m_vals[j],
                           rel.tol = 1e-13,
                           abs.tol = 0, 
                           -Inf, Inf)$value
    }
    pcorr[pcorr > 1.0] = 1.0
    
    # The predictor is assigned to a new variable, or the "predict" function
    # gets angry.
    dps = dprimes[fitind]
    
    fit = lm(qnorm(pcorr[fitind]) ~ poly(dps, degree = degrees[k], raw = TRUE))
    pred_p = pnorm(predict(fit, newdata = data.frame(dps = dprimes)))
    abs_e = abs(pcorr - pred_p)
    med_err[j,k] = median(abs_e)
    min_err[j,k] = min(abs_e)
    max_err[j,k] = max(abs_e)
  }
}

# Save the figures

createPlot = function(){
  par(mfrow=c(2,3))
  for(i in 1:length(degrees)){
    plot(m_vals, med_err[,i], main = paste("Deg. poly.", degrees[i]),
         xlab ="m", ylab = "Abs. err.", log = "y",
         ylim = range(c(min_err, max_err)),
         type = "l")
    
    points(m_vals, min_err[,i], type = "l")
    points(m_vals, max_err[,i], type = "l")
  }  
}


png(filename = "../figures/abs_error_degree_small.png", 
    width = 1100 * 0.8, height = 800 * 0.8, pointsize = 16)
createPlot()
dev.off()


png(filename = "../figures/abs_error_degree_big.png", 
    width = 1100, height = 800, pointsize = 20)
createPlot()
dev.off()

pdf("../figures/abs_error_degree_big.pdf")
createPlot()
dev.off()