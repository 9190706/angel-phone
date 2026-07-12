const screens = document.querySelectorAll(".screen");


// 打开页面

function openApp(name){

    screens.forEach(screen=>{

        screen.classList.remove("active");

    });


    const target = document.getElementById(name);

    if(target){

        target.classList.add("active");

    }

}



// 返回首页

function goHome(){

    screens.forEach(screen=>{

        screen.classList.remove("active");

    });


    document
    .getElementById("home")
    .classList.add("active");

}




// 时间系统

function updateTime(){

    const now = new Date();


    let h = now.getHours();

    let m = now.getMinutes();


    h = String(h).padStart(2,"0");

    m = String(m).padStart(2,"0");


    const time = `${h}:${m}`;



    const week=[

        "星期日",
        "星期一",
        "星期二",
        "星期三",
        "星期四",
        "星期五",
        "星期六"

    ];



    const date =
    `${week[now.getDay()]} · ${now.getMonth()+1}月${now.getDate()}日`;



    const a =
    document.getElementById("time");


    const b =
    document.getElementById("homeTime");


    const c =
    document.getElementById("date");



    if(a)
        a.innerText=time;


    if(b)
        b.innerText=time;


    if(c)
        c.innerText=date;

}



updateTime();


setInterval(updateTime,10000);
