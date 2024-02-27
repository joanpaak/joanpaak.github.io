# Ennen tiedoston ajamista asenna kirjasto "Nummenmaa", josta 
# datasetti löytyy.

hevi = nummenmaa::hevi

plotFeature = function(featureName){
  x = hevi[,featureName]
  
  plot(rep(1:length(x)), x[order(x)], pch = "", xlim = c(-2, 27),
       main = featureName, ylab = "", xlab ="", axes = F)
  axis(side = 1); axis(side = 2)
  text(rep(1:length(x)), x[order(x)], hevi$BANDI[order(x)], cex = 0.8, 
       pos = rep(c(2,4), 12))
}

# Tästä löytyy mahdolliset dimensiot, jotka
# voimme visualisoida:
names(hevi)

svg(file="../figs/virtuositeetti.svg", width = 10, height = 10)
  plotFeature("VIRTUOSITEETTI")
dev.off()

svg(file="../figs/melodisuus.svg", width = 10, height = 10)
plotFeature("MELODISUUS")
dev.off()

svg(file="../figs/maskuliinisuus.svg", width = 10, height = 10)
plotFeature("MASKULIINISUUS")
dev.off()

svg(file="../figs/aggressiivisuus.svg", width = 10, height = 10)
plotFeature("AGGRESSIIVISUUS")
dev.off()



