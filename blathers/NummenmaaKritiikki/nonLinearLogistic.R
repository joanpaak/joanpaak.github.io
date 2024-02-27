setwd("~/Desktop/NummenmaaKritiikki/")

set.seed(666)

n = 100
x = runif(n, -2, 2)
y = rnorm(n,  x * 0.5 + x^2, 0.2)

plot(x, y)
curve(x * 0.5 + x^2, add = T, lty = 1)

y_bin = rep(0, length(y))
y_bin[which(y > median(y))] = 1

plot(x, y_bin)

fit = glm(y_bin ~ x, family=binomial(link=logit))
curve(plogis(coef(fit)[1] + x * coef(fit)[2]), add = T)

negLL = function(theta, x, y){
  p_1 = plogis(theta[1] + theta[2] * x  + theta[3] * x^2)
  p_obs = p_1 * y + (1 - p_1) * (1 - y)
  
  return(-sum(log(p_obs)))
}

fit2 = optim(runif(3, -2, 2), negLL, method = "BFGS", x = x, y = y_bin)
fit2

curve(plogis(fit2$par[1] + fit2$par[2] *  x + fit2$par[3] * x^2), add = T)


plot(x, y)
curve(plogis(fit2$par[1] + fit2$par[2] *  x + fit2$par[3] * x^2), add = T)
curve(fit2$par[1] + fit2$par[2] *  x + fit2$par[3] * x^2, add = T)


#


curve(plogis((x/2)^3), 0, 10, xlab = "Ärsykkeen taso", ylab = "P(Oikein)")
curve(plogis((x/2)^0.95), add = T, lty = 2)

plogis(1)

