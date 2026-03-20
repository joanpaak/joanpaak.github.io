png(filename = "unitTransform.png", width = 500, height = 300)
drawPoly = function(start, end, color){
  x1 = seq(start, end, length.out = 50)
  y1 = dnorm(x1)
  x1 = c(x1, end, start)
  y1 = c(y1, 0, 0)
  
  polygon(x1, y1, col = color)
}

curve(dnorm(x, 0, 1), -4, 4, bty = "l",
      xlab = "", ylab = "", axes = FALSE, lwd = 1.5)
axis(side = 1)
abline(v = c(-2, 0, 3), lty = 3, lwd = 2)

drawPoly(-4, -2, rgb(1, 1, 0, 0.4))
drawPoly(-2, 0, rgb(1, 0, 1, 0.4))
drawPoly(0, 3, rgb(0, 0, 1, 0.4))
dev.off()