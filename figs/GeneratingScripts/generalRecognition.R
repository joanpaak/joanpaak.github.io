drawCircle = function(cx, cy, r){
  
  angles = seq(0, 2 * pi, 0.01)
  #r = 1
  #cx = -1
  #cy = 1
  x = rep(NaN, length(angles))
  y = rep(NaN, length(angles))
  
  for(i in 1:length(angles)){
    x[i] = cx + cos(angles[i]) * r
    y[i] = cy + sin(angles[i]) * r
  }
  polygon(x, y, col = rgb(0, 0, 0, 0.1))
}

plot(NULL, xlim = c(-5, 5), ylim = c(-5, 5), xlab = "Pitch", ylab = "Timbre",
     bty = "l")

abline(h = 0, lty = 3)
abline(v = 0, lty = 3)

drawCircle(-2, -2, 3)
drawCircle(2, -3.5, 2)
drawCircle(1.5, 2, 3)
drawCircle(-1.75, 2, 2.5)
