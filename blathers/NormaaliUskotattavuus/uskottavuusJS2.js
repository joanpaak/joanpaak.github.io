/* ERROR: Sulauta siihen toiseeen tidedostoon! */

class OnnenPyoraVis{
    constructor(){
        this.onnenpyoraSVG = document.getElementById("onnenpyoraSVG");
        window.addEventListener("resize", e =>  this.drawVis());
        this.drawVis();
    }

    drawVis(){
        this.onnenpyoraSVG.replaceChildren([]);

        let x1 = this.onnenpyoraSVG.clientWidth  * 0.25;
        let x2 = this.onnenpyoraSVG.clientWidth  * 0.75;
        let y1 = this.onnenpyoraSVG.clientHeight * 0.50;
        let y2 = this.onnenpyoraSVG.clientHeight * 0.50;
        let r  = this.onnenpyoraSVG.clientWidth  * 0.20;

        let c1 = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        c1.setAttribute("cx", x1);
        c1.setAttribute("cy", y1);
        c1.setAttribute("fill", "white");
        c1.setAttribute("stroke", "black");
        c1.setAttribute("r", r);

        let c2 = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        c2.setAttribute("cx", x2);
        c2.setAttribute("cy", y2);
        c2.setAttribute("fill", "white");
        c2.setAttribute("stroke", "black");
        c2.setAttribute("r", r);

        let text1 = document.createElementNS("http://www.w3.org/2000/svg", "text");
        text1.textContent = "A";
        text1.setAttribute("text-anchor", "middle");
        text1.setAttribute("font-size", this.onnenpyoraSVG.clientHeight * 0.1);
        text1.setAttribute("x", x1);
        text1.setAttribute("y", this.onnenpyoraSVG.clientHeight * 0.1);

        let text2 = document.createElementNS("http://www.w3.org/2000/svg", "text");
        text2.textContent = "B";
        text2.setAttribute("text-anchor", "middle");
        text2.setAttribute("font-size", this.onnenpyoraSVG.clientHeight * 0.1);
        text2.setAttribute("x", x2);
        text2.setAttribute("y", this.onnenpyoraSVG.clientHeight * 0.1);

        this.onnenpyoraSVG.appendChild(c1);
        this.onnenpyoraSVG.appendChild(c2);
        this.onnenpyoraSVG.appendChild(text1);
        this.onnenpyoraSVG.appendChild(text2);

        this.drawWinSector(4, x1, y1, r, 20);
        this.drawWinSector(3, x2, y2, r, 20);
    }

    drawWinSector(angleProp, cx, cy, r, n){
        let stepSize = (2 * Math.PI / angleProp) / (n - 1);
        let dstring = `M ${cx} ${cy}`;
    
        for(let i = 0; i < n; i++){
            let curAngle = i * stepSize;
    
            dstring += `L ${Math.cos(curAngle) * r + cx} ${Math.sin(curAngle) * r + cy}`;    
        }
    
        dstring += `L ${cx} ${cy}`;
        
        let newLine = document.createElementNS("http://www.w3.org/2000/svg", "path");
        newLine.setAttribute("d", dstring);
        newLine.setAttribute("fill", "rgba(255, 150, 150, 1.0)");
        this.onnenpyoraSVG.appendChild(newLine)
    }
}

let opVis = new OnnenPyoraVis();
