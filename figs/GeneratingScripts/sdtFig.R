curve(dnorm(x), -3, 6, bty = "l", ylab = "",
      xlab = "Internal level")
curve(dnorm(x, 2), add = T)

x = seq(2, 6, 0.01)
y = dnorm(x, 2)
y2 = dnorm(x, 0)

polygon(c(x, 2), c(y, 0), col = rgb(1, 0, 0, 0.4), border = NA)
polygon(c(x, 2), c(y2, 0), col = rgb(1, 0, 0, 0.4), border = NA)

abline(v = 2, lty = 2)