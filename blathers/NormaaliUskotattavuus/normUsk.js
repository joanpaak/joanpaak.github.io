class AaltoVisualisaatio{
    constructor(){
        this.plot = new Plot(
            document.getElementById("aaltoVisualisaatio"),
            null,
            {
                xlim : [-10, 10],
                ylim : [0, 0.5]
            }
        );

        this.muSlider = document.getElementById("aaltoMuSlider");
        this.muSlider.addEventListener("input", e => this.drawVisualization());

        this.sigmaSlider = document.getElementById("aaltoSigmaSlider");
        this.sigmaSlider.addEventListener("input", e => this.drawVisualization());

        this.llTextField = document.getElementById("aaltoUskottavuusText");

        this.y = [-4.5, 0.5, -3.5];

        this.drawVisualization();
    }

    drawVisualization(){
        this.plot.clearData();
        this.plot.drawCurve(
            (x) => normalPDF(
                x, 
                parseFloat(this.muSlider.value), 
                parseFloat(this.sigmaSlider.value)), -10, 10);

        let llText = "Uskottavuus: ";
        let ll     = 1;

        for(let i = 0; i < this.y.length; i++){
            let p = normalPDF(
                this.y[i], 
                parseFloat(this.muSlider.value), 
                parseFloat(this.sigmaSlider.value));
            this.plot.drawPoint(this.y[i], p);
            this.plot.drawLine(
                [this.plot.figLimX[0], this.y[i]], 
                [p, p],
            {
                lty : 2
            });
            this.plot.drawLine(
                [this.y[i], this.y[i]], 
                [this.plot.figLimY[0], p],
            {
                lty : 2
            });

            ll     *= p;
            llText += p.toExponential(2);

            if(i  < (this.y.length - 1)){
                llText += " × ";
            }
        }

        llText += " = " + ll.toExponential(2);
        this.llTextField.innerText = llText;
    }
}


class BernoulliVis{
    constructor(){
        this.plot = new Plot(
            document.getElementById("bernoulliSVG"),
            null,
            {
                xlim : [1, 5],
                ylim : [0, 1],
                ylab : "P(y)",
                xlab : "Havainto (y)"
            }
        )

        this.y = [1, 0, 1, 1, 0];
        this.pslider = document.getElementById("bernoulliSlider");
        this.llTextField = document.getElementById("bernoulliUskottavuusText")
        this.drawVisualization();

        this.pslider.addEventListener("input", e => this.drawVisualization());
    }

    drawVisualization(){
        let curllText = "Uskottavuus: ";
        this.plot.clearData();
        let p = parseFloat(this.pslider.value);
        let py = new Array(this.y.length);
        let ll = 1;

        for(let i = 0; i < this.y.length; i++){
            py[i] = this.y[i] * p + (1 - this.y[i]) * (1 - p);
            this.plot.drawPoint(i + 1, py[i]);
            this.plot.drawLine([i + 1, i + 1], [0, py[i]])


            ll *= py[i];
            curllText += py[i].toFixed(3);

            if(i < (this.y.length - 1)){
                curllText += " × ";
            }
        }

        this.plot.hline(
            0, 
        {
            "stroke-dasharray" : "4, 4"
        });

        curllText += " = " + ll.toFixed(3);
        this.llTextField.innerText = curllText;

    }
}

/* */

let aaltovis = new AaltoVisualisaatio();
let bernvis  = new BernoulliVis()