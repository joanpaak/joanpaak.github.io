/*
Adds Show/Hide annnotations toggles to a web page. 

How to use:

In the HTML file you must have pre-element or elements that have one ore
more pre-elements with the class "annotation" as children. 

Then, when you reference this script, this will find those and add
the buttons for hiding/displaying the annotations.

Concretely, you must have something like this in your HTML:

<pre>
<pre class="annotation">
Since we want to sample from the prior, we initialize a vector
of length zero as data. I do it this way, since this is compatible
with Stan: </pre>
y = array(dim=0)
samplesWoJacobian = runChain(posteriorWoJacobian, y)
samplesJacobian   = runChain(posteriorJacobian, y)
</pre>

*/ 

class AnnotationToggle{
    constructor(id){
      this.button = document.getElementById(id + "AnnotationToggle");
      this.button.innerText = "Hide annotations";
      this.codeExample = document.getElementById(id + "CodeExample");
      this.annotations = this.codeExample.getElementsByClassName("annotation");
  
      this.annotationsVisible = true;
      this.button.addEventListener("click", e => this.toggleAnnotations());
  
      /* By default there's some padding/margin to the annotations */
  
      for(let i = 0; i < this.annotations.length; i++){
        this.annotations[i].style.padding = "0";
        this.annotations[i].style.margin  = "0";
        
      }
    }
  
    toggleAnnotations(){
      if(this.annotationsVisible){
        this.annotationsVisible = false;
        this.hideAnnotations();
        this.button.innerText = "Show annotations";
      } else {
        this.annotationsVisible = true;
        this.showAnnotations();
        this.button.innerText = "Hide annotations";
      }
  
    }
  
    hideAnnotations(){
      for(let i = 0; i < this.annotations.length; i++){
        this.annotations[i].style.display = "none";
      }
    }
  
    showAnnotations(){
      for(let i = 0; i < this.annotations.length; i++){
        this.annotations[i].style.display = "block";
      }
    }
}

let preElements = document.getElementsByTagName("pre");
let preElementsWithAnnotations = [];

for(let i = 0; i < preElements.length; i++){
    if(preElements[i].children.length > 0){
        console.log("Pre element with children found...");
        for(let j = 0; j < preElements[i].children.length; j++){
            if(preElements[i].children[j].classList.contains("annotation")){
                preElementsWithAnnotations.push(preElements[i]);
                console.log("Annotation found!");
                break;
            }
        }
    }

}

let toggleArray = new Array(preElementsWithAnnotations.length);

for(let i = 0; i < preElementsWithAnnotations.length; i++){
    curId = "annotationBox_" + (i + 1);
    preElementsWithAnnotations[i].id = curId + "CodeExample";
    
    let newButton = document.createElement("button");
    newButton.id = curId + "AnnotationToggle";
    newButton.classList.add("annotationToggle");
    preElementsWithAnnotations[i].parentNode.insertBefore(newButton, preElementsWithAnnotations[i]);
    toggleArray[i] = new AnnotationToggle(curId);
}

