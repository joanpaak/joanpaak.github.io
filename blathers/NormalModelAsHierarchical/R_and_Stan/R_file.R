setwd("~/Documents/GitHub/joanpaak.github.io/sciency_stuff/NormalModelAsHierarchical/R_and_Stan/")

# Compile stan models:
normalModel             = rstan::stan_model("normalModel.stan")
normalModelHierarchical = rstan::stan_model("normalModelHierarchical.stan")

# Generate some synthetic data:
set.seed(1312)

N = 100
y = rnorm(N, 0, 1)

dataForStanSmallTau = list(N = N,
                           y = y,
                           priorMu_mu = 1.0,
                           priorSD_mu = 1.0, 
                           tau = 0.01)

dataForStanLargeTau = list(N = N,
                           y = y,
                           priorMu_mu = 1.0,
                           priorSD_mu = 1.0, 
                           tau = 1.5)

# Fit models!
fitNormal = rstan::sampling(normalModel, dataForStanSmallTau)
fitHieraSmallTau = rstan::sampling(normalModelHierarchical, dataForStanSmallTau)
fitHieraLargeTau = rstan::sampling(normalModelHierarchical, dataForStanLargeTau)

## Plot results


# Uncomment this and the dev.off lines when writing
# the plot to a file
#png(file = "../figs/posteriors.png")
plot(density(as.matrix(fitNormal)[,"mu"]), type = "l", lwd = 2, 
     xlab = expression(mu), ylab = "Density", axes = F, main = "")
points(density(as.matrix(fitHieraSmallTau)[,"priorMu"]), type = "l", lwd = 2,
       lty = 2)
points(density(as.matrix(fitHieraLargeTau)[,"priorMu"]), type = "l", lwd = 2,
       lty = 2)
axis(side = 1); axis(side = 2)
#dev.off()


##### Plot 2:

# Indices for the columns that have posterior draws
# for the individual mus
inds = which(grepl("mus", colnames(as.matrix(fitHieraSmallTau))))

# Uncomment this and the dev.off lines when writing
# the plot to a file
# png(file = "../figs/mu_posteriors.png",
    width = 480*2, height = 480)
par(mfrow = c(1,2))
plot(y, colMeans(as.matrix(fitHieraSmallTau)[,inds]),
     xlab = "y", ylab = "Posterior means", axes = F,
     ylim = range(y), xlim = range(y),
     main = expression(paste("Small ", tau)))
abline(0, 1)
axis(side = 1); axis(side = 2)

plot(y, colMeans(as.matrix(fitHieraLargeTau)[,inds]),
     xlab = "y", ylab = "Posterior means", axes = F,
     ylim = range(y), xlim = range(y),
     main = expression(paste("Large ", tau)))
abline(0, 1)
axis(side = 1); axis(side = 2)
# dev.off()
