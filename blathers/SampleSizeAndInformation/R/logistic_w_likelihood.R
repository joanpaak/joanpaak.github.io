#
# An example of how Bayesian updating works
# in the context of an intercept-only 
# logistic regression.
#

width = 5
height = 5
xlabText = "Threshold (dB)"

svg("../figs/step_0.svg", width = width, height = height)
curve(dnorm(x, 40, 10) / dnorm(40, 40, 10), 10, 70, 
      ylab  = "", xlab = xlabText, axes = F)
axis(side = 1)
dev.off()

svg("../figs/step_1.svg", width = width, height = height)
curve(dnorm(x, 40, 10) / dnorm(40, 40, 10), 10, 70, 
      ylab  = "", xlab = xlabText, axes = F)
curve(plogis(50 - x), add = T, col  = "red")
axis(side = 1)
dev.off()

svg("../figs/step_2.svg", width = width, height = height)
curve(dnorm(x, 40, 10) * plogis(50 - x), 10, 70, axes = FALSE, 
      ylab  = "", xlab = xlabText)
axis(side = 1)
dev.off()

svg("../figs/step_3.svg", width = width, height = height)
curve(dnorm(x, 40, 10) * plogis(50 - x), 10, 70, axes = FALSE, 
      ylab  = "", xlab = xlabText)
curve((1 - plogis(40 - x)) * .04, add = T, col  = "red")
axis(side = 1)
dev.off()

svg("../figs/step_4.svg", width = width, height = height)
curve(dnorm(x, 40, 10) * plogis(50 - x) * (1 - plogis(40 - x)), 10, 70, axes = FALSE, 
      ylab  = "", xlab = xlabText)
axis(side = 1)
dev.off()

svg("../figs/step_5.svg", width = width, height = height)
curve(dnorm(x, 40, 10) * plogis(50 - x) * (1 - plogis(40 - x)), 10, 70, axes = FALSE, 
      ylab  = "", xlab = xlabText)
axis(side = 1)
curve(plogis(60 - x) * .0365, add = T, col  = "red")
dev.off()

svg("../figs/step_6.svg", width = width, height = height)
curve(dnorm(x, 40, 10) * plogis(50 - x) * 
        (1 - plogis(40 - x)) * plogis(60 - x), 10, 70, axes = FALSE, 
      ylab  = "", xlab = xlabText)
axis(side = 1)
dev.off()
