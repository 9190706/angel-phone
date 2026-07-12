/* =================================
 Angel Phone
 app.js
================================= */


/* 时间 */

function updateClock(){

const now=new Date();

const h=String(now.getHours()).padStart(2,"0");
const m=String(now.getMinutes()).padStart(2,"0");

const time=h+":"+m;


const week=[
"星期日",
"星期一",
"星期二",
"星期三",
"星期四",
"星期五",
"星期六"
];


const date=
week[now.getDay()]
+" · "
+(now.getMonth()+1)
+"月"
+now.getDate()
+"日";


const t=document.getElementById("status-time");
const ht=document.getElementById("home-time");
const hd=document.getElementById("home-date");


if(t)t.innerText=time;
if(ht)ht.innerText=time;
if(hd)hd.innerText=date;

}


updateClock();

setInterval(updateClock,10000);





/* ================================
 页面控制
================================ */


const home=document.querySelector('[data-screen="home"]');

const chat=document.querySelector('[data-screen="chat"]');

const settings=document.getElementById("settings-page");



function showPage(page){

document.querySelectorAll(".screen")
.forEach(e=>e.classList.remove("active"));


if(page==="home"){

home.classList.add("active");

}

if(page==="chat"){

chat.classList.add("active");

}

}




/* 首页图标 */


document.querySelectorAll("[data-open]")
.forEach(btn=>{


btn.onclick=function(){


const target=this.dataset.open;


if(target==="chat"){

showPage("chat");

}


if(target==="settings"){

showPage("home");

settings.classList.remove("hidden");

}


};


});





/* 返回首页 */


document.getElementById("back-home")
?.addEventListener(
"click",
()=>{

settings.classList.add("hidden");

showPage("home");

}
);





/* =================================
 Chat 数据
================================ */


let characters=
JSON.parse(
localStorage.getItem("characters")
||"[]"
);



let chats=
JSON.parse(
localStorage.getItem("chats")
||"{}"
);



const contactList=
document.getElementById("contact-list");



function saveData(){

localStorage.setItem(
"characters",
JSON.stringify(characters)
);


localStorage.setItem(
"chats",
JSON.stringify(chats)
);

}




/* 默认角色 */


if(characters.length===0){

characters.push({

id:Date.now(),

name:"Angel"

});


saveData();

}




function renderContacts(){


contactList.innerHTML="";


characters.forEach(c=>{


const div=document.createElement("div");


div.className="contact-card";


div.innerHTML=`

<div class="avatar-small"></div>

<div>

<div class="contact-name">
${c.name}
</div>


<div class="contact-message">
点击开始聊天
</div>


</div>

`;



div.onclick=()=>openChat(c);



contactList.appendChild(div);



});


}



renderContacts();/* =================================
 聊天窗口
================================= */


const chatRoom=document.getElementById("chat-room");

const chatMain=document.getElementById("chat-main");

const chatName=document.getElementById("chat-name");

const messages=document.getElementById("messages");

let currentCharacter=null;



function openChat(character){


currentCharacter=character;


chatMain.classList.add("hidden");

chatRoom.classList.remove("hidden");


chatName.innerText=character.name;



renderMessages();


}




function renderMessages(){


messages.innerHTML=
`
<div class="system-date">
今天
</div>
`;



const list=
chats[currentCharacter.id] || [];



list.forEach(msg=>{


const div=document.createElement("div");


div.className=
"message "
+(msg.type==="user"?"right":"left");



div.innerHTML=`

<div class="bubble">
${msg.text}
</div>

`;



messages.appendChild(div);



});



messages.scrollTop=
messages.scrollHeight;



}





/* 返回联系人 */


document
.getElementById("back-chat")
.addEventListener(
"click",
()=>{


chatRoom.classList.add("hidden");

chatMain.classList.remove("hidden");


}
);






/* 发送消息 */


const input=
document.getElementById("message-input");


const send=
document.getElementById("send-btn");



function sendMessage(){


const text=
input.value.trim();



if(!text || !currentCharacter)
return;



if(!chats[currentCharacter.id]){

chats[currentCharacter.id]=[];

}




chats[currentCharacter.id]
.push({

type:"user",

text:text

});



saveData();


input.value="";


renderMessages();





/* 简单 AI 回复 */

setTimeout(()=>{


chats[currentCharacter.id]
.push({

type:"ai",

text:"我收到了："+text

});


saveData();


renderMessages();


},700);



}



send.onclick=sendMessage;



input.addEventListener(
"keydown",
e=>{

if(e.key==="Enter")
sendMessage();

});






/* =================================
 创建 Character
================================= */


const popup=
document.getElementById("character-popup");


const createBtn=
document.getElementById("create-character");



createBtn.onclick=()=>{


popup.classList.remove("hidden");


};




document
.getElementById("cancel-character")
.onclick=()=>{


popup.classList.add("hidden");


};





document
.getElementById("save-character")
.onclick=()=>{


const name=
document
.getElementById("character-input")
.value
.trim();



if(!name)
return;



characters.push({

id:Date.now(),

name:name

});



saveData();


renderContacts();



popup.classList.add("hidden");



document.getElementById("character-input").value="";



};/* =================================
 底部导航切换
================================= */


const navButtons=
document.querySelectorAll(
".chat-nav button"
);


const pages={

contacts:
document.getElementById("chat-main"),

add:
document.getElementById("add-page"),

moments:
document.getElementById("moments-page"),

profile:
document.getElementById("profile-page")

};



navButtons.forEach(btn=>{


btn.onclick=function(){


const page=
this.dataset.page;



navButtons.forEach(b=>
b.classList.remove("active")
);



this.classList.add("active");



Object.values(pages)
.forEach(p=>{

if(p)
p.classList.add("hidden");

});



if(pages[page]){

pages[page]
.classList.remove("hidden");

}



};

});





/* =================================
 添加页创建角色入口
================================= */


document
.querySelector('[data-page="add"]')
?.addEventListener(
"click",
()=>{

});





/* =================================
 点击联系人区域保护
================================= */


window.addEventListener(
"load",
()=>{

renderContacts();

}
);
