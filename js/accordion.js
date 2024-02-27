/* 
Javascript for the "accordion" style menus, used mainly on the front page for the descriptions.
*/
let linkTitles       = document.getElementsByClassName("linkTitle");
let linkDescriptions = document.getElementsByClassName("linkDescription");

for(let i = 0; i < linkTitles.length; i++){
  linkTitles[i].addEventListener("click", function() {
    showDescription(i);
    });
}

for(let i = 0; i < linkDescriptions.length; i++){
  linkDescriptions[i].classList.add("hiddenDescription");
}

function showDescription(i){
  linkDescriptions[i].classList.toggle("hiddenDescription");
  linkTitles[i].classList.toggle("activeLinkTitle");
}