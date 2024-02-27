W = function(g, r_log, p){
  r = 10^(r_log/10)
  return((1 - r) * (1 + p * g) * exp(-p * g) + r)
}


curve(20 * log10(W(abs(x), -10, 10)), -1, 1, bty = "l",
      ylab = "W(dB)", xlab = "Normalized frequency")
polygon(c(-2, -0.5, -0.5, -2, -2), c(-30, -30, 1, 1, -30), 
        col = rgb(1, 0, 0, 0.2), border = NA)


polygon(c(2, 0.5, 0.5, 2, 2), c(-30, -30, 1, 1, -30), 
        col = rgb(1, 0, 0, 0.2), border = NA)
