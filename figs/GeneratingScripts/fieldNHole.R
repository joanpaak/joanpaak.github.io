png(filename = "fieldHole.png",
    width = 200,
    height = 200, 
    units = "px")

curve(dt(x, 5), -4, 4, bty = "l", axes = FALSE,
      ylab = "", xlab = "")
axis(side = 1)

x1 = seq(-4, qt(0.025, 5), 0.01)
y1 = dt(x1, 5)

x2 = seq(qt(0.975, 5), 4, 0.01)
y2 = dt(x2, 5)

polygon(c(x1, x1[length(x1)], x1[1]),
        c(y1, 0, 0), col = rgb(1, 0.2, 0.1, 0.5),
        border = NA)

polygon(c(x2, x2[length(x1)], x2[1]),
        c(y2, 0, 0), col = rgb(1, 0.2, 0.1, 0.5),
        border = NA)
abline(v = qt(c(0.025, 0.975), 5), lty = 3)

dev.off()