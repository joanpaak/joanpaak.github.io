alpha = seq(0, 10, length.out = 20)
beta  = seq(0.5, 2.0, length.out = 20)
p     = rep(1, length(alpha) * length(beta))

prior = cbind(expand.grid(alpha, beta), p)

s = seq(0, 10, length.out = 50)
h = rep(NaN, length(s))

for(i in 1:length(s)){
  posterior_0 = prior
  posterior_1 = prior
  
  dprime = (s[i] / prior[,1])^prior[,2]
  
  pyes = pnorm(dprime)
  pno  = 1 - pyes
  
  posterior_0[,3] = posterior_0[,3] * pno
  posterior_1[,3] = posterior_1[,3] * pyes
  
  posterior_0[,3] = posterior_0[,3] / sum(posterior_0[,3])
  posterior_1[,3] = posterior_1[,3] / sum(posterior_1[,3])
  
  h_0 = -sum(posterior_0[,3] * log(posterior_0[,3]), na.rm = T)
  h_1 = -sum(posterior_1[,3] * log(posterior_1[,3]), na.rm = T)
  
  h[i] = mean(pno) * h_0 + mean(pyes) * h_1
}

plot(s, h, type = "l", bty = "l",
     xlab  = "Stimulus", ylab  = "E[Entropy]")
