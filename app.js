function openPage(pageName){

document.querySelectorAll(".page")
.forEach(function(page){

page.classList.remove("active");

});


document
.getElementById(pageName)
.classList.add("active");

}



function goHome(){

document.querySelectorAll(".page")
.forEach(function(page){

page.classList.remove("active");

});


document
.getElementById("home")
.classList.add("active");

}




function updateTime(){

let now=new Date();

let h=
String(now.getHours())
.padStart(2,"0");


let m=
String(now.getMinutes())
.padStart(2,"0");


let time=h+":"+m;


document.getElementById("time")
.innerText=time;


document.getElementById("clock")
.innerText=time;


}


updateTime();


setInterval(
updateTime,
10000
);
