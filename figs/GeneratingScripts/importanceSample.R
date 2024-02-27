curve(dgamma(x, 3, 1), 0, 10, bty = "l", 
      ylab  = "Density", xlab = "")
x = runif(30, 0, 10)
y = dgamma(x, 3, 1)

points(x, y, pch = 19)

for(i in 1:length(x)){
  lines(c(x[i], x[i]), c(0, y[i]), lty = 3)
}
