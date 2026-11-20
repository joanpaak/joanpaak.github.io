# Figure 1: Data set (w/outlier)
# Figure 2: Data with two regression lines (one without outlier)
# Figure 3: Data, std regression line and both robust models
# Figure 4: Predictions from the std regression and both robust models.

setwd("~/Desktop/GITRepositories/joanpaak.github.io/blathers/RobustRegression/")
set.seed(123)

# Create data set

n = 20

x = runif(n, -6, 6)
y = rnorm(n, x)

x[21] = 6
y[21] = -6

# Fit models

lin_mod = rstan::stan_model("res/linreg.stan")
rob_reg = rstan::stan_model("res/robust_reg.stan")
two_comp = rstan::stan_model("res/two_component.stan")

data_wo_outlier = list(
  n = 20,
  x = x[1:20], 
  y = y[1:20],
  n_rep = 50,
  x_rep = seq(-6, 6, length.out = 50)
)

data = list(
  n = 21,
  x = x, 
  y = y,
  n_rep = 50,
  x_rep = seq(-6, 6, length.out = 50)
)

fit_lin_wo_out = rstan::sampling(lin_mod, data = data_wo_outlier)
fit_lin = rstan::sampling(lin_mod, data = data)
fit_rob = rstan::sampling(rob_reg, data = data)
fit_two = rstan::sampling(two_comp, data = data)

coef_lin_wo_outlier = colMeans(as.matrix(fit_lin_wo_out))
coef_lin = colMeans(as.matrix(fit_lin))
coef_rob = colMeans(as.matrix(fit_rob))
coef_two = colMeans(as.matrix(fit_two))

FIG_WIDTH = 1500
FIG_HEIGHT = 1500
RES = 300

# FIGURE 1:

png(file = "fig/fig1.png", width = FIG_WIDTH, height = FIG_HEIGHT, res = RES)
plot(NULL, ylim = range(y), xlim = range(x), bty = "l", ylab = "y", xlab = "x")
grid()
points(x[1:20], y[1:20], bty = "l", pch = 19)
points(x[21], y[21], bty = "l", pch = 19, col = "red")
dev.off()

# FIGURE 2:

png(file = "fig/fig2.png", width = FIG_WIDTH, height = FIG_HEIGHT, res = RES)
plot(NULL, ylim = range(y), xlim = range(x), bty = "l", ylab = "y", xlab = "x")
grid()
points(x[1:20], y[1:20], bty = "l", pch = 19)
points(x[21], y[21], bty = "l", pch = 19, col = "red")
curve(coef_lin_wo_outlier[1] + 
        coef_lin_wo_outlier[2] * x, add = TRUE, col = "red", lty = 2)
curve(coef_lin[1] + 
        coef_lin[2] * x, add = TRUE, col = "red")
dev.off()

# FIGURE 3:

png(file = "fig/fig3.png", width = FIG_WIDTH, height = FIG_HEIGHT, res = RES)
plot(NULL, ylim = range(y), xlim = range(x), bty = "l", ylab = "y", xlab = "x")
grid()
points(x[1:20], y[1:20], bty = "l", pch = 19)
points(x[21], y[21], bty = "l", pch = 19, col = "red")
curve(coef_lin[1] + 
        coef_lin[2] * x, add = TRUE, col = "red", lty = 2)
curve(coef_rob[1] + 
        coef_rob[2] * x, add = TRUE, col = "red")
curve(coef_two[1] + 
        coef_two[2] * x, add = TRUE, col = "red")
dev.off()

# FIGURE 4a:
png(file = "fig/fig4a.png", width = FIG_WIDTH, height = FIG_HEIGHT, res = RES)

n_rep = 100
y_rep_lin = rstan::extract(fit_lin, pars = c("y_rep"))$y_rep[1:n_rep,]
plot(NULL, xlim = c(-6, 6), ylim = range(y_rep_lin), bty = "l", 
     xlab = "x", ylab = "y", main = "Standard \n linear regression")
grid()
matplot(data$x_rep, t(y_rep_lin), type = "p", 
        col  = rgb(0, 0, 0, 0.1), pch = 19, add = TRUE)
points(x, y, bty = "l", pch = 19, col = "red")
dev.off()

# FIGURE 4b:

png(file = "fig/fig4b.png", width = FIG_WIDTH, height = FIG_HEIGHT, res = RES)

n_rep = 100
y_rep_rob = rstan::extract(fit_rob, pars = c("y_rep"))$y_rep[1:n_rep,]
plot(NULL, xlim = c(-6, 6), ylim = c(-20, 20), bty = "l", 
     xlab = "x", ylab = "y", main = "t-distributed \n errors")
grid()
matplot(data$x_rep, t(y_rep_rob), type = "p", 
        col  = rgb(0, 0, 0, 0.1), pch = 19, add = TRUE)
points(x, y, bty = "l", pch = 19, col = "red")
dev.off()

# FIGURE 4c:

png(file = "fig/fig4c.png", width = FIG_WIDTH, height = FIG_HEIGHT, res = RES)

n_rep = 100
y_rep_two = rstan::extract(fit_two, pars = c("y_rep"))$y_rep[1:n_rep,]
plot(NULL, xlim = c(-6, 6), ylim = range(y_rep_two), bty = "l", 
     xlab = "x", ylab = "y", main = "Two-component \n model")
grid()
matplot(data$x_rep, t(y_rep_two), type = "p", 
        col  = rgb(0, 0, 0, 0.1), pch = 19, add = TRUE)
points(x, y, bty = "l", pch = 19, col = "red")
dev.off()
