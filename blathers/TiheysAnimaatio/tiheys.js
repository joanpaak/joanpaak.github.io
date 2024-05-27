class RectDensity{
    constructor(bw, min, max, n){
        this.stepSize = (max - min) / (n - 1);

        this.bw = bw;
 
        this.n = n;
        this.max = max;
        this.min = min;

        this.x = new Array(n);
        this.y = new Array(n).fill(0);

        for(let i = 0; i < n; i++){
            this.x[i] = min + i * this.stepSize;
        }

        this.nobs = 0;
        this.d = 1 / (this.bw * 2);

        this.step = Math.round(this.bw / this.stepSize);
    }

    addObservation(x){
        let center = Math.round((x - this.min) / this.stepSize);
        let lowLim = center - this.step;
        let uppLim = center + this.step ;


        if(lowLim < 0) lowLim = 0;
        if(uppLim >= this.n) uppLim = this.n - 1;

        for(let i = lowLim; i <= uppLim; i++){
            this.y[i] += this.d;
        }

        this.nobs++;
    }

    getDensity(){
        let d = new Array(this.n);

        for(let i = 0; i < this.n; i++){
            d[i] = this.y[i] / this.nobs;
        }

        return {
            x : this.x,
            y : d
        };
    }
}


class Utilities{
    static dnorm(x, mu, sigma){
        let normconst = 1.0 / (sigma * Math.sqrt(2.0 * Math.PI));
        let d = Math.exp(-0.5 * Math.pow((x - mu) / sigma, 2));
        
        return normconst * d;
    }

    static rnorm(n, mu, sigma){
        // TODO: This could be more efficient...
        let  u = new Array(n);
        let  v = new Array(n);
        let  x = new Array(n);

        for(let i = 0; i < n; i++){
            u[i] = Math.random();
            v[i] = Math.random();
    
            x[i] = Math.sqrt(-2.0 * Math.log(u[i])) * Math.cos(2 * Math.PI * v[i]);
            x[i] = x[i] * sigma + mu;
        }

        return x;
    }
}

/* 
Idea: jos sirontakuvaajasta tulee liian täyteisä, 
pisteet voi ajastaa "sulamaan pois" kuin hiutaleet konsaan! Kaunista!
*/
class DensityDemo{
    constructor(){
        this.plot = new Plot(
            document.getElementById("densityDemo"), 
            null,
            {
                xlim : [-5, 5],
                ylim : [0, 0.5],
                xlab : "x",
                ylab : "Density"
            });

        this.plot.drawCurve(
            x => Utilities.dnorm(x, 0, 1), -7, 7,
        {
            "stroke-dasharray": "4 4"
        });

        document.getElementById("startDensityDemo").
            addEventListener("click", e => this.startDemo());

        this.data = [];
        this.timer = -1;

        this.denst = new RectDensity(0.5, -5, 5, 100);
    }

    startDemo(){
        if(this.timer === -1){
            this.counter = 0;
            this.timer = setInterval(() => {
                this.doIteration();
            }, 5);
        }

    }

    doIteration(){
        this.counter++;

        if(this.counter > 1000){
            clearInterval(this.timer);
            this.timer = -1;
        }

        /* The this.kde this refers to is the density estimation curve:
           we need to remove it so that the plot deoesn'd drown in them. */
        if(this.kde != undefined) this.kde.remove();


        let x = Utilities.rnorm(1, 0, 1);
        let y = Math.random() * Utilities.dnorm(x, 0, 1);

        let np = this.plot.drawPoint(x, y);

        const a = document.createElementNS("http://www.w3.org/2000/svg", "animate");
        a.setAttribute("attributeName", "opacity");
        a.setAttribute("begin", "indefinite");
        a.setAttribute("dur", "5s");
        a.setAttribute("from", "1");
        a.setAttribute("to", "0");
        a.setAttribute("repeatCount", "1");
        a.setAttribute("fill", "freeze");
        a.addEventListener("endEvent", e => {
            np.remove();
        }); 
        np.appendChild(a);
        a.beginElement();

        //this.data.push(x);
        
        this.denst.addObservation(x);
        //let d = density(this.data, 0.5, 40, -5, 5);
        let d = this.denst.getDensity();
        this.kde = this.plot.drawLines(d.x, d.y);
        
    }
}

let densDemo = new DensityDemo();


class UniformDemo{
    constructor(){
        this.plot = new Plot(
            document.getElementById("uniformDemo"),
            null,
            {
                xlim : [-1.5, 1.5],
                ylim : [0, 2],
                ylab : "Density"
            }
        );

        this.uniformDemoWidthText = document.getElementById("uniformDemoWidthText");
        this.uniformDemoSlider = document.getElementById("uniformDemoSlider");
        uniformDemoSlider.addEventListener("input", e => this.draw());

        this.draw();
    }

    draw(){
        this.plot.clearData();

        this.uniformDemoWidthText.innerText = parseFloat(this.uniformDemoSlider.value).toFixed(2);

        let minx = 0 - parseFloat(this.uniformDemoSlider.value)/2;
        let maxx = 0 + parseFloat(this.uniformDemoSlider.value)/2;
        let d    =  1 / parseFloat(this.uniformDemoSlider.value); 
        
        this.plot.drawLines([-2, minx, minx, maxx, maxx, 2], [0, 0, d, d, 0, 0]);
        this.plot.drawLine(
            [-7, minx], 
            [d, d],
        {
            lty : 2
        });
    }
}

let uniformDemo = new UniformDemo();



// IDEA: jos x on sortattu, silloin aloitusindeksiä voidaan 
// säätää isommaksi ja periaatteessa laskuaikaa säästyy.

function density(x, bw, n, min, max){
    x.sort((a, b) => a - b);

    let densityX = new Array(n);
    let densityY = new Array(n).fill(0);

    let d = 1 / (bw * 2);
    let stepSize = (max - min) / (n - 1);


    for(let i = 0; i < n; i++){
        densityX[i] = min + i * stepSize;

        for(let j = 0; j < x.length; j++){
            if(Math.abs(densityX[i] - x[j]) < bw){
                densityY[i] += d;
            } 
        }
    }

    for(let i = 0; i < n; i++){
        densityY[i] /= x.length;
    }

    return {
        x : densityX,
        y : densityY
    }
}
