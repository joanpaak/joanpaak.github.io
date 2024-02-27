#### ASETA ENSIKSI TYÖKANSIOKSI HTML-TIEDOSTON SISÄLTÄVÄ KANSIO


#### DATASETIT ####

# Taulukot 1 ja 3 sivuilta 15 ja 19.
# Lasten vastaukset kyselyihin (kaudet ovat näissä objekteissa 
# aikajärjestyksessä):

lk3Kysely = data.frame("Musiikiton"   = c(46.1, 51.1, 64.2, 50.8, 64.7, 50.4),
                       "Digitaalinen" = c(36.3, 44.5, 49.7, 40.4, 46.6, 43.3),
                       "Analoginen"   = c(36.2, 41.4, 47.4, 37.9, 47.2, 45.7))

lk6Kysely = data.frame("Digitaalinen" = c(60.8, 65.9, 68.8, 54.2, 71.5, 55.9),
                       "Musiikiton"   = c(54.3, 57.3, 65.5, 47.6, 70.8, 52.1),
                       "Analoginen"   = c(54.6, 56.2, 62.9, 48.3, 67.7, 53.9))


# Taulukot 2 ja 4 sivuilta 16 20
# Opettajien arviot sosioemotionaalisesta kompetenssista. Myös 
# näissä kaudet ovat aikajärjestyksessä.

sosEmot3lk = data.frame("Musiikiton" = c(71, 74, 65, 71, 74, 72, 65, 63, 47, 
                                         39, 47, 39, 46, 43, 54, 73, 55),
                        "Analoginen" = c(68, 77, 66, 79, 79, 74, 64, 67, 
                                            37, 33, 38, 31, 40, 32, 47, 74, 50))


sosEmot6lk = data.frame("Musiikiton" = c(66, 61, 60, 68, 68, 78, 78, 76, 36, 
                                         28, 41, 30, 40, 44, 50, 72, 61),
                        "Analoginen" = c(64, 76, 67, 71, 78, 81, 75, 75, 
                                            38, 27, 42, 36, 55, 52, 51, 78, 60))

# Sosioemotionaalisen kompetenssin arvioinnissa kukin itemi saattoi olla 
# "positiivinen" tai "negatiivinen", tämä vektori kuvaa sitä.
# Esimerkiksi avun tarjoaminen on positiivinen ja härnääminen negatiivinen:
posneg = c(1, 1, 1, 1, 1, 1, 1, 1, -1, -1, 
           -1, -1, -1, -1, -1, 1, -1)


#### Muutetaan luvut keskiarvoiksi ####
# Molemmissa dataseteissä luvut ovat summamuuttujia. Käytän keskiarvoja, joten 
# jaan nämä luokkien koilla:

lk3Kysely = lk3Kysely / 24
lk6Kysely = lk6Kysely / 25

sosEmot3lk = sosEmot3lk / 24
sosEmot6lk = sosEmot6lk / 25


##### KYSELYIDEN VISUALISOINTI #####

# INPUT:
# kyselydata : jompikumpi yllä olevista kyselydataseteistä
# mainTitle  : kuvaajan pääotsikko
teeKuvaajaKyselyDatasta = function(kyselydata, mainTitle){
  plot(NULL, xlim = c(0.5, 3.5), ylim = c(1, 6), axes = F,
       ylab = "Pistemäärä", xlab = "Kausi", main = mainTitle)
  abline(h = seq(1, 6, 1), lty = 3, col = rgb(0.1, 0.1, 0.1))
  abline(v = 1:3, lty = 2)
  axis(side = 2)
  axis(side = 1, at = 1:3, 
       labels = colnames(kyselydata))
  
  for(i in 1:6){
    lines(1:3, as.matrix(kyselydata)[i,])
    points(1:3, as.matrix(kyselydata)[i,], pch = 19)
  }
  
  mtext("<- Parempi | Huonompi ->", 2, line = 2)
}


png(filename = "figs/kyselyt.png", width = 480*2)
par(mfrow = c(1,2))

teeKuvaajaKyselyDatasta(lk3Kysely, "3. luokka")
teeKuvaajaKyselyDatasta(lk6Kysely, "6. luokka")

dev.off()

#### OPETTAJIEN ARVIOT SOSIOEMOTIONAALISESTA OSAAMISESTA ####

# INPUT:
# data      : jompikumpi ylläolevista sosemot-dataseteistä
# posneg    : itemien positiivisuus/negatiivisuus
# mainTitle : kuvaajan pääotsikko
teeKuvaajaSosemotDatasta = function(data, posneg, mainTitle){
  plot(NULL, xlim = c(0.5, 2.5), ylim = c(0, 4), axes = F,
       ylab = "Pistemäärä", xlab = "Kausi", main = mainTitle)
  abline(h = seq(0, 4, 1), lty = 3, col = rgb(0.1, 0.1, 0.1))
  abline(v = 1:2, lty = 2)
  axis(side = 2)
  axis(side = 1, at = 1:2, 
       labels = colnames(data))
  
  for(i in 1:nrow(data)){
    if(posneg[i] == 1){
      col = rgb(1, 0, 0)
      pchnum = 19
      ltynum = 1
    } else{
      col = rgb(0, 0, 1)
      pchnum = 4
      ltynum = 2
    }
    
    lines(1:2, as.matrix(data)[i,], col  = col, lty = ltynum)
    points(1:2, as.matrix(data)[i,], pch = pchnum, col = col)
  }
}

png(filename = "figs/sosemot.png", width = 480*2)
par(mfrow = c(1,2))

teeKuvaajaSosemotDatasta(sosEmot3lk, posneg, "3. luokka")
teeKuvaajaSosemotDatasta(sosEmot6lk, posneg, "6. luokka")

dev.off()

