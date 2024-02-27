setwd("~/Documents/GitHub/joanpaak.github.io/tutorials/LogTransformationStan/R/")

mdl = rstan::stan_model("../Stan/gamma31.stan")
mdl_constraint = rstan::stan_model("../Stan/gamma_w_constraint.stan")

fit_0 = rstan::sampling(mdl, data = list(s = 0))
fit_1 = rstan::sampling(mdl, data = list(s = 1))
fit_2 = rstan::sampling(mdl, data = list(s = 2))
fit_c = rstan::sampling(mdl_constraint)

svg(file = "../figs/results.svg", width = 10, height = 10)
par(mfrow = c(2,2))
hist(as.matrix(fit_0)[,1], prob = T,
     main = "1) No transformation", ylim = c(0, 0.3))
curve(dgamma(x, 3, 1), add = T, col  = "red", lwd = 2)

hist(exp(as.matrix(fit_1)[,1]), prob = T,
     main = "2) Transformation / No Jacobian ", ylim = c(0, 0.3))
curve(dgamma(x, 3, 1), add = T, col  = "red", lwd = 2)

hist(exp(as.matrix(fit_2)[,1]), prob = T,
     main = "3) Transformation / Jacobian", ylim = c(0, 0.3))
curve(dgamma(x, 3, 1), add = T, col  = "red", lwd = 2)

hist(as.matrix(fit_c)[,1], prob = T,
     main = "4) Stan's built-in constraint", ylim = c(0, 0.3))
curve(dgamma(x, 3, 1), add = T, col  = "red", lwd = 2)
dev.off()
