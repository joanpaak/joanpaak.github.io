curve(x * 1, bty = "l", ylab = "P(y = x)/(Density", xlab = expression(theta), 
      ylim = c(0, 2), lty = 3)
curve(1 + x * -1, bty = "l", add = T, lty = 3)
curve(((x * 1) * (1 + x * -1)) / 0.167, add = T)

