/*
0 1 2 3 4 5 6 7 8
1 2 3 4 5 6 7 8 9

1 2 3
4 5 6
7 8 9

let A = new Matrix([1, 2, 3, 4, 5, 6], 3, 2);
A.print();
1 2 3 
4 5 6 

*/


class Matrix{
    constructor(elements, ncol, nrow){

        if(elements.length != (ncol * nrow)) throw "Incorrect size"; 

        this.nrow = nrow;
        this.ncol = ncol;
        this.elements = elements;

    }

    checkIndex(col, row){
        if(col >= this.ncol || col < 0 || 
            row >= this.nrow || row < 0){
            throw "index out of range";        
        } 
    }

    getIndex(col, row){
        return this.ncol * row + col;
    }

    get(col, row){

        this.checkIndex(col, row);

        return this.elements[this.getIndex(col, row)];
    }

    set(col, row, val){

        this.checkIndex(col, row);

        this.elements[this.getIndex(col, row)] = val;
    }

    print(){
        let stringToPrint = "";

        for(let i = 0; i < this.nrow; i++){
            for(let j = 0; j < this.ncol; j++){
              stringToPrint += this.elements[this.getIndex(j, i)] + " ";
            }
            stringToPrint += "\n";
        }

        console.log(stringToPrint);
    }

}

/* Element-wise summation*/
function elsum(A, B){

    if(A.ncol != B.col || A.nrow != B.nrow){
        throw "Dimension mismatch";
    }

    let C = new Matrix(new Array(A.ncol * A.nrow).fill(0), 
      A.ncol, A.nrow);
    
    ind = 0;
    for(let i = 0; i < A.ncol; i++){
        for(let j = 0; j < A.nrow; j++){
            C.set(i, j, A.get(i, j) + B,get(i, j));
        }
    }
      
    return C;
}

function elmult(A, B){

    if(A.ncol != B.col || A.nrow != B.nrow){
        throw "Dimension mismatch";
    }

    let C = new Matrix(new Array(A.ncol * A.nrow).fill(0), 
      A.ncol, A.nrow);
    
    ind = 0;
    for(let i = 0; i < A.ncol; i++){
        for(let j = 0; j < A.nrow; j++){
            C.set(i, j, A.get(i, j) * B,get(i, j));
        }
    }
      
    return C;
}



function cholesky(A){
    if(!(A instanceof Matrix)){
        throw "Input is not a matrix";
    }
    if(A.ncol != A.nrow){
        throw "Mismatch between lengths of dimensions";
    }

    let L = new Matrix(new Array(A.ncol * A.nrow).fill(0), 
      A.ncol, A.nrow);

    for(let i = 0; i < A.ncol; i++){
        for(let j = 0; j <= i; j++){
            let tmp = 0;
            
            for(k = 0; k < j; k++){
                tmp += L.get(i, k) * L.get(j, k);
            }

            let val;
            
            if(i === j){
              val  = Math.sqrt(A.get(i, i) - tmp);
            } else {
              val = (1.0 / L.get(j, j) * (A.get(i, j) - tmp));
            }
            L.set(i, j, val);
        }
    }
    
    return L;
}

let testMat = new Matrix([1, 2, 3, 4, 5, 6, 7, 8, 9], 3, 3);

let A_1 = new Matrix([1, 0, 0, 
                      0, 1, 0,
                      0, 0, 1], 3, 3);

let A_2 = new Matrix([1.0, 0.1, 0.0, 
                      0.1, 1.0, 0.0,
                      0.0, 0.0, 1.0], 3, 3);

let A_1_chol = cholesky(A_1);
let A_2_chol = cholesky(A_2);

A_1_chol.print();
A_2_chol.print();
