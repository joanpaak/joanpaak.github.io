setwd("~/Documents/GitHub/joanpaak.github.io/tutorials/auditory_filters/ROEX/ROEX_pr/")


# This is the integral given by Patterson et. al. (1982)
# which represents, up to a constant, integral
# of W(g, r, p) from 0 to g
#
W_int = function(g, r, p){
  return(-(1 - r)*(1/p)*(2 + p*g)*exp(-p*g) + r*g)
}

#Predicted threshold in decibels
#
# INPUT:
# Variables: 
# nw : width of the notch
#
# Non-filter related parameters:
# K  : Efficiency of detection
#
# Parameters of the filter:
# r_log : Minimum value (log scale)
# p     : sharpness of the filter
#
# Experimental constants:
# f0 : Center frequency
# N0 : Power spectral density of the noise masker
# bw : Distance of the outer edges of the noise masker
#      from the center frequency
#
# OUPUT:
# Predicted threshold in decibels
predThr_dB = function(nw_Hz, 
                      K_log, 
                      r_log, 
                      p, 
                      f0_Hz, 
                      N0_dB, 
                      bw_Hz){
  r = 10^(r_log/10)
  # The "lower edge" of the noise masker
  low_lim = (nw_Hz/2) / f0_Hz
  # Upper edge
  upp_lim = (f0_Hz + bw_Hz) / f0_Hz
  
  thr_mag = f0_Hz * 2 * (W_int(upp_lim, r, p) - W_int(low_lim, r, p))
  thr_decibels = N0_dB + K_log + 10 * log10(thr_mag)
  
  return(thr_decibels)
}

##### ####

# Constants
f0_Hz = 1000
bw_Hz = 800
N0_dB = 10 * log10(1.5e-5)

# Since we aren't simulating the "full 2AFC task", we don't
# need signal strengths (those would be used for determining
# responses on individual trials)
notchWidths_Hz = c(0, 100, 200, 400, 600)

# Generating parameters
gen_K     = 0.8
gen_r_log = -50
gen_p     = 25
gen_sigma = 2

# Notice that since both the predThr_db and the rnorm functions are 
# vectorized, we don't have to loop through the notch widths.

trueThresholds =  predThr_dB(notchWidths_Hz, 
                             gen_K, 
                             gen_r_log, 
                             gen_p, 
                             f0_Hz, 
                             N0_dB, 
                             bw_Hz)
observedThresholds_dB = rnorm(length(notchWidths_Hz), trueThresholds, gen_sigma)


plot(notchWidths_Hz, observedThresholds_dB, type = "b",
     pch = 19, axes = F, ylab = "Threshold (dB)", 
     xlab = "Notch width (Hz)")
axis(side = 1); axis(side =2)

####

roex_pr_trad_with_k = rstan::stan_model("Stan/roex_pr_trad_with_K.stan")

fit  = rstan::sampling(roex_pr_trad_with_k, 
                data = list(N = length(notchWidths_Hz),
                            nw_Hz = notchWidths_Hz,
                            f0_Hz = f0_Hz,
                            N0_dB = N0_dB,
                            bw_Hz = bw_Hz,
                            obsThreshold_dB = observedThresholds_dB))


postSamples = as.matrix(fit)

par(mfrow = c(2,3))
plot(postSamples[, c(1,2)])
plot(postSamples[, c(1,3)])
plot(postSamples[, c(2,3)])

hist(postSamples[,1], prob = T, main = "10log(K)")
hist(postSamples[,2], prob = T, main  ="10log(r)")
hist(postSamples[,3], prob = T, main = "p")

NSim = 500

simData = matrix(NaN, nrow = NSim, ncol = length(notchWidths_Hz))

for(i in 1:NSim){
    mu = predThr_dB(notchWidths_Hz, 
                    postSamples[i,"K_log"], 
                    postSamples[i,"r_log"], 
                    postSamples[i,"p"], 
                    f0_Hz, 
                    N0_dB, 
                    bw_Hz) 
    simData[i,] = rnorm(length(notchWidths_Hz), mu, postSamples[i,"sigma"])
}

plot(NULL, xlim = range(notchWidths_Hz), ylim = range(simData),
     ylab = "Threshold (dB)", xlab = "Notch width (Hz)", axes = F)

for(i in 1:length(notchWidths_Hz)){
  points(rep(notchWidths_Hz[i], NSim), 
         simData[,i], col = rgb(0, 0, 0, 0.1), pch = 19)
}

points(notchWidths_Hz, observedThresholds_dB, pch = 19, col = "red", type = "b")
axis(side = 1); axis(side = 2) 


##### 

# Function for normalizing frequencies 
# wrt some center frequency.
#
# INPUT
# f  : frequency to be normalized
# f0 : center frequency
# OUTPUT
# normalized frequency
g = function(f, f0){
  return(abs(f - f0) / f0)
}

# Weighting function of the ROEX(r, p) filter.
#
# INPUT
# g     : normalized frequency
# r_log : minimum magnitude response (log scale)
# p     : sharpness of the filter
# OUTPUT
# Weight of the filter, as defined
# by the parameters r and p, at the specified g.
W = function(g, r_log, p){
  r = 10^(r_log/10)
  return((1 - r) * (1 + p * g) * exp(-p * g) + r)
}


par(mfrow = c(1,1))
curve(W(g(x, f0_Hz), postSamples[1,"r_log"], postSamples[1,"p"]), 700, 1300,
      col = rgb(0, 0, 0, 0.1), xlab = "Frequency (Hz)", ylab = "Weight")

for(i in 2:500){
  curve(W(g(x, f0_Hz), postSamples[i,"r_log"], postSamples[i,"p"]), add = T,
        col = rgb(0, 0, 0, 0.1))
}




