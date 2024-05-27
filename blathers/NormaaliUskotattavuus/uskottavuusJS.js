/* ERROR: Sulauta siihen toiseeen tidedostoon! */

let onnenpyoraSVG = document.getElementById("onnenpyoraSVG");

let x1 = 200;
let x2 = 600;
let y1 = 200;
let y2 = 200;
let r  = 100;

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
text1.setAttribute("font-size", 30);
text1.setAttribute("x", x1);
text1.setAttribute("y", 80);

let text2 = document.createElementNS("http://www.w3.org/2000/svg", "text");
text2.textContent = "B";
text2.setAttribute("text-anchor", "middle");
text2.setAttribute("font-size", 30);
text2.setAttribute("x", x2);
text2.setAttribute("y", 80);

onnenpyoraSVG.appendChild(c1);
onnenpyoraSVG.appendChild(c2);
onnenpyoraSVG.appendChild(text1);
onnenpyoraSVG.appendChild(text2);

function createWinSector(angleProp, cx, cy, r, n){
    let stepSize = (2 * Math.PI / angleProp) / (n - 1);

    for(let i = 0; i < n; i++){
        let curAngle = i * stepSize;

        let newLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
        newLine.setAttribute("x1", cx);
        newLine.setAttribute("y1", cy);
        newLine.setAttribute("x2", Math.cos(curAngle) * r + cx);
        newLine.setAttribute("y2", Math.sin(curAngle) * r + cy);
        newLine.setAttribute("stroke", "black");

        onnenpyoraSVG.appendChild(newLine)
    }
}


createWinSector(4, x1, y1, r, 20);
createWinSector(3, x2, y2, r, 20);
