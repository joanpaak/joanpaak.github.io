
plot(NULL, xlim = c(-5, 5), ylim = c(0, 1.5), axes = F, ylab = "", xlab = "")
axis(side = 1)

x   = c(-2.2, -1, 3) 
mus = c(-2.5,  -0.8, 2.5)
dotHeights = c(0, 0, 0)

for(i in 1:3){
  xcoord = seq(mus[i] - 1, mus[i] + 1, 0.01)
  ycoord = dnorm(xcoord, mus[i], 0.2) * 0.2
  points(x[i], dnorm(x[i], mus[i], 0.2) * 0.2, pch = 19, cex = 0.5)
  points(xcoord, ycoord, type = "l")
}

xcoord = seq(-5, 5, 0.1)
ycoord = dnorm(xcoord, 0, 1.2) * 2 + 0.5
points(xcoord, ycoord, type = "l")

points(mus, dnorm(mus, 0, 1.2) *2 + 0.5, pch = 19, cex = 0.5)

for(i in 1:3){
  lines(
    c(mus[i], mus[i]), 
    c(dnorm(mus[i], mus[i], 0.2) * 0.2, dnorm(mus[i], 0, 1.2) *2 + 0.5))
}

#curve(dnorm(x), -5, 5, bty = "l", ylab = "Density", 
#      xlab = "x")


