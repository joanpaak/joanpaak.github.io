x = seq(-pi * 2, pi * 2, length.out = 100)
y = sin(x)
y[1:50] = y[1:50] + runif(50, -0.4, 0.4) 

plot(x, y , bty  = "l",
      xlab  = "t", ylab = "", type = "l")
polygon(c(-8, -8, 0, 0, -8), c(-2, 2, 2, -2, -2), 
        col = rgb(1, 0, 0, 0.4), border = NA)
