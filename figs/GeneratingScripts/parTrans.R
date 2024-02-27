curve(exp(x), -2, 2, bty = "l", 
      ylab = "Constrained", xlab = "Unconstrained")

x = c(-2, -1.5, -1, -0.5, 0, 0.5, 1, 1.5, 2)

for(i in 1:length((x))){
  lines(c(x[i], x[i], min(x)), c(0, exp(x[i]), exp(x[i])), lty = 3)
}
