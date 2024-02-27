#
# This shows WHY the range of the predictor
# affects the standard error of the slope
# estimates in linear regression.

width = 8
height = 4
svg("../figs/residualstddev.svg", width = width, height = height)

x_1 = seq(-0.5, 0.5, length.out = 400)
y_1 = rnorm(length(x_1), -0.5 + x_1 * 0.5)

x_2 = seq(-6.5, 6.5, length.out = 400)
y_2 = rnorm(length(x_2), -0.5 + x_2 * 0.5)

par(mfrow  = c(1, 2))
plot(x_1, y_1, bty = "l", xlab = "Predictor", ylab = "Response")
plot(x_2, y_2, bty = "l", xlab = "Predictor", ylab = "Response")

dev.off()