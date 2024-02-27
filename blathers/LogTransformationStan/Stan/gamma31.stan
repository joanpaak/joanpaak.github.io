data {
    int s;
}
      
parameters {
    real theta;
}
      
model {
    if(s == 0){
        // Model 1: No transformation, will result in divergences
        target += gamma_lpdf(theta | 3, 1);
    } else if(s == 1){
        // Model 2: Transformation but no Jacobian
        target += gamma_lpdf(exp(theta) | 3, 1);
    } else if(s == 2){
        // Model 3: Transformation and Jacobian:
        target += gamma_lpdf(exp(theta) | 3, 1);
        target += log(fabs(exp(theta)));
    }
}
