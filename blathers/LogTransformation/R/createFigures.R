# Log stretching/squeezing

svg(file = "../figs/logStretch2.svg", width = 7, height = 3)

x = seq(0.01, 80, 0.4)
log_x = log(x)

plot(NULL, xlim = c(-3, 4), ylim = c(-1, 1), axes = F, xlab = "", ylab = "")

for(i in 1:length(x)){
  lines(c(x[i], log_x[i]), c(1.1, -1.1), lty = 2)
}

axis(side = 1, at = c(-3, -2, -1, 0, 1, 2, 3, 4))
axis(side = 3, at = c(0, 1, 2, 3, 4))
mtext("log(x)", 1, 2)
mtext("x", 3, 2, adj = 0.7)

dev.off()



# Log function as... eh, function.
svg("../figs/logAsFunction.svg", width = 5, height = 5)
par(mfrow = c(1,1))
curve(log(x), 0.1, 5, xlab = "Original", ylab = "Logarithmic", bty = "l")

xToPlot = 1
lines(c(xToPlot, xToPlot), c(log(0.1) - 1, log(xToPlot)), lty = 3, col = "red")
lines(c(-1, xToPlot), c(log(xToPlot), log(xToPlot)), lty = 3, col = "red")

xToPlot = 2
lines(c(xToPlot, xToPlot), c(log(0.1) - 1, log(xToPlot)), lty = 3, col = "red")
lines(c(-1, xToPlot), c(log(xToPlot), log(xToPlot)), lty = 3, col = "red")

xToPlot = 3
lines(c(xToPlot, xToPlot), c(log(0.1) - 1, log(xToPlot)), lty = 3, col = "red")
lines(c(-1, xToPlot), c(log(xToPlot), log(xToPlot)), lty = 3, col = "red")

dev.off()

# Gamma distribution
svg("../figs/gammaDistribution.svg", width = 5, height = 5)
curve(dgamma(x, 3, 1), bty = "l", -5, 10, 
      ylab = "Density")
dev.off()

# Gamma w/correction
svg("../figs/gammaWCorrection.svg", width = 5, height = 5)
par(mfrow = c(1,1))
curve(dgamma(x, 3, 1) / abs(1/x), 0, 10, col = "red", bty = "l", 
      ylab = "density", lwd = 2)
curve(dgamma(x, 3, 1), add = T, lwd = 2)
dev.off()


