simulateConfidenceIntervals = function(nsims, nobservations){
  confInts = matrix(NaN, ncol = 2, nrow = nsims)
  ciLength = rep(NaN, nsims)
  containsZero  = rep(0, nsims)
  
  for(i in 1:nsims){
    x = rnorm(nobservations)
    confInts[i,] = t.test(x)$conf.int
    ciLength[i] = diff(confInts[i,])
  }
  
  inds = intersect(which(confInts[,1] < 0), which(confInts[,2] > 0))
  containsZero[inds] = 1
  
  bounds = seq(min(ciLength) - 0.001, max(ciLength) + 0.001, length.out = 20)
  ciCenters = rep(NaN, length(bounds) - 1)
  sums = rep(NaN, length(bounds) - 1)
  totals = rep(NaN, length(bounds) - 1)
  
  for(i in 1:(length(bounds) - 1)){
    inds = intersect(which(ciLength > bounds[i]),
                     which(ciLength < bounds[i+1]))
    
    ciCenters[i] = (bounds[i] + bounds[i + 1]) / 2
    sums[i] = sum(containsZero[inds])
    totals[i] = length(inds)
  }
  
  return(list(ciCenters = ciCenters, sums = sums, totals = totals))
}

plotSimulation = function(sim, mainLab){
  ciLow  = qbeta(0.025, 1 + sim$sums, 1 + sim$totals - sim$sums)
  ciHigh = qbeta(0.975, 1 + sim$sums, 1 + sim$totals - sim$sums)
  
  plot(NULL, ylim = c(0, 1), xlim = range(sim$ciCenters), bty = "l",
       ylab = "P(Sisältää nollan)", 
       xlab = "Luottamusvälin pituus",
       main = mainLab)
  
  for(i in 1:length(ciLow)){
    lines(c(sim$ciCenters[i], sim$ciCenters[i]), c(ciLow[i], ciHigh[i]), 
          lwd = 4, lend = 1, col = rgb(0.0, 0, 0, 1))
  }
  
  points(sim$ciCenters, sim$sums / sim$totals, type = "l", lty = 3)
  abline(h = 0.95, lty = 3, lwd = 1, col = "red")
}

sim10  = simulateConfidenceIntervals(800000, 10)
sim100 = simulateConfidenceIntervals(800000, 100)

png(filename = "simulaatio10.png", res = 100)
par(family = "Linux Libertine")
plotSimulation(sim10, "N = 10")
dev.off()

png(filename = "simulaatio100.png", res = 100)
par(family = "Linux Libertine")
plotSimulation(sim100, "N = 100")
dev.off()


