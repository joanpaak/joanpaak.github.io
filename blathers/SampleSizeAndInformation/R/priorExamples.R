
width = 8
height = 4
svg("../figs/priorExamples.svg", width = width, height = height)
par(mfrow = c(1,2))
curve(dnorm(x, 40, 10), 10, 70, bty = "l", 
      ylab = "", 
      xlab ="Threshold (dB)")

curve(dnorm(x, 50, 5), 10, 70, bty = "l", 
      ylab = "", 
      xlab ="Threshold (dB)")
dev.off()
