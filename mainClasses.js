/*
These classes are used to build the site. 

Information from the file abstracts.js is used in the process.

 */

const IMAGE_ROOT = "figs/";

class Functions{
    static parseTag(string, tag){
        let re = new RegExp(`<${tag}>[\\s\\S]*?<\/${tag}>`);
        let a = string.match(re)[0];
        a = a.replace(`<${tag}>`, "");
        a = a.replace(`</${tag}>`, "");
    
        return a;
    }

    static parseAbstracts(string){
        return [...string.matchAll(/<abstract>[\s\S]*?<\/abstract>/g)];
    }
}

class Abstract{
    constructor(){
        this.mainDiv = document.createElement("div");
        this.mainDiv.classList.add("abstractMainDiv");
    }

    appendToElement(element){
        element.appendChild(this.mainDiv);
    }

    parse(string){
        let titleDiv = document.createElement("div");
        let tagDiv   = document.createElement("div");
        let textDiv  = document.createElement("div");
        let imageDiv = document.createElement("img");
        let linkDiv  = document.createElement("a");
        let descriptionDiv = document.createElement("div");

        titleDiv.classList.add("title");
        tagDiv.classList.add("tags");
        linkDiv.classList.add("link");
        descriptionDiv.classList.add("description");

        titleDiv.innerText = Functions.parseTag(string, "title");
        tagDiv.innerText   = Functions.parseTag(string, "tags");
        textDiv.innerText  = Functions.parseTag(string, "text"); 
        linkDiv.href       = Functions.parseTag(string, "link");
        imageDiv.src = IMAGE_ROOT + Functions.parseTag(string, "image");

        let language = Functions.parseTag(string, "language");

        if(language === "Suomi"){
            this.mainDiv.lang = "fi";
        } else if(language === "English"){
            this.mainDiv.lang = "en";
        }

        linkDiv.target = "_blank";
        linkDiv.innerText = "Click here to open the text in a new tab";

        descriptionDiv.replaceChildren(imageDiv, textDiv);

        this.mainDiv.replaceChildren(
            titleDiv,
            tagDiv,
            linkDiv,
            descriptionDiv
        );

        let tags = tagDiv.innerText.split(",");
        this.tags = new Array(tags.length);
        
        for(let i = 0; i < tags.length; i++){
            this.tags[i] = tags[i].trim();
        }
    }
}

class AbstractCollection{
    constructor(){

        this.abstractElements = new Array();
        this.tagMap = new Map();
        this.languageMap = new Map([["fi", new Set()], ["en", new Set()]]);

        document.getElementById("fiLangCheckbox").
          addEventListener("change", e => 
            this.toggleLang("fi", 
            document.getElementById("fiLangCheckbox").checked));

        document.getElementById("enLangCheckbox").
            addEventListener("change", e => 
              this.toggleLang("en", 
              document.getElementById("enLangCheckbox").checked));
    }
    
    toggleLang(lang, flag){
        
        if(flag){
            this.languageMap.get(lang).forEach(id => {
                this.abstractElements[id].style.display = "block";
            });
        } else {
            this.languageMap.get(lang).forEach(id => {
                this.abstractElements[id].style.display = "none";
            });
        }
    }

    parse(string){
        let abstracts = Functions.parseAbstracts(string);

        for(let i = 0; i < abstracts.length; i++){
            let newAbstract = new Abstract();
            newAbstract.parse(abstracts[i][0]);
            this.abstractElements[i] = newAbstract.mainDiv;
            newAbstract.appendToElement(document.getElementById("abstractContainer"));

            this.languageMap.get(newAbstract.mainDiv.lang).add(i);

            for(let j = 0; j < newAbstract.tags.length; j++){
                if(this.tagMap.has(newAbstract.tags[j])){
                    this.tagMap.get(newAbstract.tags[j]).add(i);
                } else {
                    this.tagMap.set(newAbstract.tags[j], new Set([i]));

                    let newTagDiv   = document.createElement("div");
                    let newTagLabel = document.createElement("label");
                    let newCheckBox = document.createElement("input");

                    newTagDiv.classList.add("tagCBContainer");
                    newTagLabel = newAbstract.tags[j];
                    newCheckBox.type = "checkbox";
                    newCheckBox.checked = true;

                    newCheckBox.addEventListener("change", e => {
                        this.tagMap.get(newAbstract.tags[j]).forEach(id => {
                            if(newCheckBox.checked){
                                this.abstractElements[id].style.display = "block";
                            } else {
                                this.abstractElements[id].style.display = "none";
                            }
                        });
                    });

                    newTagDiv.replaceChildren(newTagLabel, newCheckBox);
                    document.getElementById("tagFilters").appendChild(newTagDiv);
                }
            }
        }
    }
}

let abstractCollection = new AbstractCollection();
abstractCollection.parse(abstracts);
// N.B. he object called abstracts is gotten from abstract.js so 
// make sure to load that before this file
