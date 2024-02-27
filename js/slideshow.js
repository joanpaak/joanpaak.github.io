/* Slide shows and other that kind of tabbed switchers 

In HTML you do something like this:


<div class="slideShow">
    <div class="slides">
        <div class="slide">
            <img src="figs/intercept_30.svg">
        </div>
        <div class="slide">
            <img src="figs/intercept_45.svg">
        </div>
        <div class="slide">
            <img src="figs/intercept_60.svg">
        </div>
    </div>
</div>

Note that you can add the attribute slideTitle="Intro slide" to give slides names.

Then just add reference to this script:
<script src="slideshow.js"></script>

And don't forget the style sheet

<link rel="stylesheet" href="../../css/slideShowStyle.css">

*/

class SlideShow{
    /* The input "mainElement" has to be a div with the class "slideShow". 
    It has to contain a child element, a div, with the class "slides" which
    then in turn contains divs with the class "slide" */
    constructor(mainElement){
        this.mainElement = mainElement;
         
        this.buttonContainer = document.createElement("div"); 
        this.buttonContainer.classList.add("controls");
           
        /**/
        
        this.prevButton = document.createElement("button");
        this.nextButton = document.createElement("button");
        
        this.nextButton = document.createElement("button");
        
        if(document.documentElement.lang === "fi"){
            this.prevButton.innerText = "« Edellinen";
            this.nextButton.innerText = "Seuraava»";
        } else {
            this.prevButton.innerText = "« Previous";
            this.nextButton.innerText = "Next »";
        }
        
        this.buttonContainer.appendChild(this.prevButton);
        this.buttonContainer.appendChild(this.nextButton);

        this.mainElement.getElementsByClassName("slides")[0].parentNode.insertBefore(this.buttonContainer, this.mainElement.getElementsByClassName("slides")[0]);

        this.indicatorContainer =  document.createElement("div"); 
        this.indicatorContainer.classList.add("indicators");

        this.mainElement.getElementsByClassName("slides")[0].parentNode.insertBefore(this.indicatorContainer, this.mainElement.getElementsByClassName("slides")[0]);

        this.slides = this.mainElement.getElementsByClassName("slide");
        this.prevButton.addEventListener("click", e => this.changeSlide(-1));
        this.nextButton.addEventListener("click", e => this.changeSlide(1));

        this.currentSlide = 0;

        this.addIndicators();
        this.hideAllSlidesExceptCurrent();
        this.addEventListenersToIndicators();
    }

    createNewIndicator(text){
        let newIndicator = document.createElement("span");
        newIndicator.innerText = text;
        newIndicator.classList.add("indicator");

        return newIndicator;
    }

    addEventListenersToIndicators(){
        for(let i = 0; i < this.indicators.length; i++){
            this.indicators[i].addEventListener("click", e => this.changeSlideInd(i));
        }
    }

    addIndicators(){
        for(let i = 0; i < this.slides.length; i++){
            let indicatorTitle = i+ 1;
            if(this.slides[i].hasAttribute("slideTitle")){
                indicatorTitle = this.slides[i].getAttribute("slideTitle");
            }
            this.indicatorContainer.appendChild(this.createNewIndicator(indicatorTitle));
        }

        this.indicators = this.mainElement.getElementsByClassName("indicator");
    }

    hideAllSlidesExceptCurrent(){
        for(let i = 0; i < this.slides.length; i++){
            this.slides[i].style.display = "none";
        }

        this.indicators[this.currentSlide].classList.add("activeIndicator");
        this.slides[this.currentSlide].style.display = "inline-block";
    }

    changeSlide(direction){
        this.slides[this.currentSlide].style.display = "none";
        this.indicators[this.currentSlide].classList.remove("activeIndicator");

        this.currentSlide = Math.min(
            Math.max(0, this.currentSlide + direction), this.slides.length - 1);

        this.slides[this.currentSlide].style.display = "inline-block";
        this.indicators[this.currentSlide].classList.add("activeIndicator");
    }

    changeSlideInd(ind){
        this.slides[this.currentSlide].style.display = "none";
        this.indicators[this.currentSlide].classList.remove("activeIndicator");

        this.currentSlide = ind;

        this.slides[this.currentSlide].style.display = "inline-block";
        this.indicators[this.currentSlide].classList.add("activeIndicator");
    }
}

class SlideShowDOM{
    constructor(){
        this.slideshowElements = document.getElementsByClassName("slideShow");
        this.slideshows = new Array(this.slideshowElements.length);



        for(let i = 0; i < this.slideshowElements.length; i++){
            this.slideshows = new SlideShow(this.slideshowElements[i]);

        }

    }
}

let slideshows = new SlideShowDOM();

