setwd("~/Documents/GitHub/joanpaak.github.io/sciency_stuff/Konjugaattiprioreista/R/")

# Uskottavuusfunktio, jota käytetään kaikissa kuvaajissa.
# SYÖTE:
# x : theta-parametrin arvo, välillä 0 ja 1.
# r : havainto, 0 tai 1.
# HUOM: Tämä muoto on vain demonstraatiota varten.
blikelihood = function(x, r){
  if(r == 0){
    return(1 - x)
  } 
  return(x)
}

##

svg("../figs/uskottavuusfunktiot.svg", width = 10, height = 5)
par(mfrow = c(1,2))
curve(blikelihood(x, 1), 0, 1, bty = "l", ylim = c(0, 1), xlim = c(0, 1),
     xlab = expression(theta), ylab = expression(paste("P(y|",theta)), main = "y = 1")
curve(blikelihood(x, 0), 0, 1, bty = "l", ylim = c(0, 1), xlim = c(0, 1),
      xlab = expression(theta), ylab = expression(paste("P(y|",theta)), main = "y = 0")
dev.off()

##

svg("../figs/uskottavuuskonvoluutio_1.svg", width = 5, height = 5)
par(mfrow = c(1,1))
curve(blikelihood(x, 1), 0, 1, bty = "l", ylim = c(0, 1), xlim = c(0, 1),
      xlab = expression(theta), ylab = expression(paste("P(y|",theta)), main = "y = {1}")
dev.off()

svg("../figs/uskottavuuskonvoluutio_2.svg", width = 5, height = 5)
curve(blikelihood(x, 1) * blikelihood(x, 1), 
      0, 1, bty = "l", ylim = c(0, 1), xlim = c(0, 1),
      xlab = expression(theta), ylab = expression(paste("P(y|",theta)), main = "y = {1, 1}")
dev.off()

svg("../figs/uskottavuuskonvoluutio_3.svg", width = 5, height = 5)
curve(blikelihood(x, 1) * blikelihood(x, 1) * blikelihood(x, 0), 
      0, 1, bty = "l", ylim = c(0, 1), xlim = c(0, 1),
      xlab = expression(theta), ylab = expression(paste("P(y|",theta)), main = "y = {1, 1, 0}")
dev.off()

###

P_y = integrate(function(x) {
  blikelihood(x, 1) * blikelihood(x, 1) * blikelihood(x, 0)
}, 0, 1)$value

svg("../figs/betavsuskottavuus.svg", width = 10, height = 5)
par(mfrow = c(1,2))
curve((blikelihood(x, 1) * blikelihood(x, 1) * blikelihood(x, 0)) / P_y, 
      0, 1, bty = "l", ylim = c(0, 2), xlim = c(0, 1),
      xlab = expression(theta), ylab = expression(paste("P(y|",theta)), main = "y = {1, 1, 0}")
curve(dbeta(x, 3, 2), bty = "l", ylab = "Tiheys", xlab = expression(theta), ylim = c(0, 2), main = "Beta-jakauma")
dev.off()

