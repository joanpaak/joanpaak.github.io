n = 50
x = runif(n, -5, 5)
y = rbinom(n, 1, pnorm(x))

curve(plogis(x), -5, 5, bty = "l", 
      ylab = "P(R = 1)", xlab = "x")
points(x, y, pch = 19)
