# Examples of how changing the intercepts affects 
# the location of the sigmoid curve in logistic 
# regression

width = 5
height = 5

svg("../figs/intercept_30.svg", width = width, height = height)
curve(plogis(-30 + x), 10, 70, bty = "l", 
      ylab = "P(Detection)", 
      xlab ="Stimulus strength (dB)", 
      main = "Intercept = 30 dB")
abline(v = 30, lty = 2)
dev.off()

svg("../figs/intercept_45.svg", width = width, height = height)
curve(plogis(-45 + x), 10, 70, bty = "l", 
      ylab = "P(Detection)", 
      xlab ="Stimulus strength (dB)", 
      main = "Intercept = 45 dB")
abline(v = 45, lty = 2)
dev.off()

svg("../figs/intercept_60.svg", width = width, height = height)
curve(plogis(-60 + x), 10, 70, bty = "l", 
      ylab = "P(Detection)", 
      xlab ="Stimulus strength (dB)", 
      main = "Intercept = 60 dB")
abline(v = 60, lty = 2)
dev.off()
