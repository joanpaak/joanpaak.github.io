x = seq(-5, 5, length.out = 100)
y = matrix(NaN, ncol = length(x), nrow = 3) 

y[1,] = 1 - plogis(1.2 + x / 2)
y[2,] = (1 - plogis(0 + x / 2)) - y[1,]
y[3,] = 1 - y[1,] - y[2,]

plot(x, y[1,], type = "l", ylim = c(0, 1), bty = "l",
     xlab = "S", ylab = "R = x")
points(x, y[2,], type = "l", col = "red")
points(x, y[3,], type = "l", col = "blue")
abline(h = c(0, 0.4, 0.8), lty = 3, col = rgb(0, 0, 0, 0.4))
abline(v = c(-4, -2, 0, 2, 4), lty = 3, col = rgb(0, 0, 0, 0.4))