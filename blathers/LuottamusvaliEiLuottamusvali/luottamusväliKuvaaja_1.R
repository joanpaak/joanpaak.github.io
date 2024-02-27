#
# A classic... tree type plot of ci's.
#

nsim    = 100
nsample = 5
cis     = matrix(NaN, ncol = 2, nrow = nsim)
sds     = rep(NaN, nsim) 

for(i in 1:nsim){
  x = rnorm(nsample)
  sds[i] = sd(x)
  cis[i,] = t.test(x, conf.level = 0.85)$conf.int
}

cis = cis[order(sds),]
inds1 = intersect(which(cis[,1] < 0), which(cis[,2] > 0))
inds0 = setdiff(1:nsim, inds1)

png(filename = "klassinenPylpyrä.png", height = 1200, width = 1200, res = 300)
par(family = "Linux Libertine")
plot(NULL, ylim = c(0, nsim + 1), xlim = range(cis) * 1.1,
     axes = T, 
     ylab = "Luottamusvälin pituus", 
     xlab  = "Luottamusväli", 
     bty = "l",
     yaxt = "n")

axis(
  side = 2, 
  at = c(1, 100), 
  labels = c("Lyhyt", "Pitkä"))


abline(v = pretty(range(cis)), lty = 3, col = rgb(0, 0, 0, 0.4))

for(i in inds1){
  lines(cis[i,], c(i, i))
}

for(i in inds0){
  lines(cis[i,], c(i, i), col = "red")
}

dev.off()


