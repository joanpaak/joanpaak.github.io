setwd("~/Desktop/GithubIO/joanpaak.github.io-main/blathers/NormaaliUskotattavuus/")

y = c(1, 0, 1, 1, 0) 

likelihood = function(y, theta){
  likelihoods = rep(NaN, length(y))
  
  for(i in 1:length(y)){
    if(y[i] == 0){
      likelihoods[i] = 1 - theta
    } else if(y[i] == 1){
      likelihoods[i] = theta
    }
  }
  
  return(prod(likelihoods))
}

gridMin  = 0
gridMax  = 1
gridStep = 0.01

gridTheta = seq(from = gridMin, to = gridMax, by = gridStep)  

likelihoods = rep(NaN, length(gridTheta))          

for(i in 1:length(gridTheta)){
  likelihoods[i] = likelihood(y, gridTheta[i])
}    

plot(gridTheta, likelihoods, type = "l")  