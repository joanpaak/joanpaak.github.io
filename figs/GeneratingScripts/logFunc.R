
curve(10 * exp(x * 0.25), 0, 10,
      bty = "l", xlab = "Aika",
      ylab = "Bakteerit (lkm)")
abline(h = pretty(c(0, 120)), lty = 3, col = rgb(0, 0, 0, 0.5))
abline(v = pretty(c(0, 10)), lty = 3, col = rgb(0, 0, 0, 0.5))
