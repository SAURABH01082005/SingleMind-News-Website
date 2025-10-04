  // Import the functions you need from the SDKs you need
import {
  getFirestore,
  doc,
  getDoc,
  updateDoc,
  arrayUnion
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";


export function imgDraggingStarts(row,news,link,catagoryNews){
    let dragStoreBox=document.querySelector(".dragStoreBox")
row.addEventListener("dragstart",(event)=>{
  console.log("image is dragging-----------")
  dragStoreBox.classList.add("showDragStore")
  console.log("after image is dragging")

  event.dataTransfer.setData("text/plain", JSON.stringify(news))//dataTransfer only take string//convert obj into json format and then string
  event.dataTransfer.setData("text/link", link)//dataTransfer only take string//convert obj into json format and then string
  event.dataTransfer.setData("text/catagoryNews",catagoryNews)
  
})
}




export function imgDraggingStartsRemaining(db,loggedInUser){
    let dragStoreBox=document.querySelector(".dragStoreBox")
dragStoreBox.addEventListener("dragover",(event)=>{
  event.preventDefault()

})
dragStoreBox.addEventListener("drop",(event)=>{
  dragStoreBox.classList.remove("showDragStore")
  const droppedUrl = event.dataTransfer.getData("text/plain")
  const link = event.dataTransfer.getData("text/link")
  console.log("link is ",link)
  const catagoryNews = event.dataTransfer.getData("text/catagoryNews")
  let temp=JSON.parse(droppedUrl)
  
  temp.catagoryNews=catagoryNews
  temp.showmylink=link
  console.log("this is before stringify showmylink ..............",temp.showmylink)
  updateDragBookmarks(JSON.stringify(temp),db,loggedInUser)//parsing required on other end

}) 


let body=document.querySelector("body")
body.addEventListener("dragover", (event) => {
  event.preventDefault(); // <-- required to allow dropping
});
body.addEventListener("drop",(event)=>{
  console.log("dropping in body -----------")
  event.preventDefault()
  dragStoreBox.classList.remove("showDragStore")
})


//function for updating data
 async function updateDragBookmarks(k,db,loggedInUser){
  const docRef =  doc(db, "users", loggedInUser);
  console.log("saved element is ",JSON.parse(k))
  try {
        await updateDoc(docRef, {
        bookmarks: arrayUnion(k)
        
        
        });
        alert("successfully added")

        } catch (error) {
        console.log("Updation failed!!!",error)
        alert("unsuccesfull")

        }

}

}




export function tooltipShow(row,showlinkUrl,link){
    let showlink=document.querySelector('.showlink'); 
row.addEventListener("mouseover",(event)=>{
  showlink.innerHTML = `<a href='${showlinkUrl}' style='text-decoration: none;color:black;'>${link}</a>`;
  showlink.style.display='block'
  // showlink.style.pointerEvents = "none"; 
  document.body.appendChild(showlink)
  moveTooltip(event);


})


row.addEventListener("mouseout", () => {
  showlink.style.display='none';

});
showlink.addEventListener("mouseover",(event)=>{
   showlink.style.display='block';
  //  console.log("hovering in showlink box")

})

function moveTooltip(event){
   showlink.style.top=(event.pageY+10) +"px"
  showlink.style.left=(event.pageX+10)+"px"
}
}




export async function readData(k,db,loggedInUser) {
const docRef = doc(db, "users", loggedInUser);
try {
  const docSnap = await getDoc(docRef);

if (docSnap.exists()) {
  console.log("Document data:", docSnap.data());
  if(k=='urls') return docSnap.data().urls
  if(k=='bookmarks') return docSnap.data().bookmarks
  
   
} else {

  console.log("No such document!");
}
  
} catch (error) {
 console.log("some error")
  
}
  
}


export async function logoutButtonPressed() {
    let logoutpage=document.getElementById("logoutpage")
    logoutpage.addEventListener("click",(event)=>{
      localStorage.removeItem("loggedInUser")
      localStorage.removeItem("catagory")
      console.log("user session remove and logout..........")
      event.preventDefault(); 
      location.replace('login2.html')
    //  location.href = "login2.html?nocache=" + Date.now();
      // window.location.href="./login2.html"//not working ...
    })
    
}



export function catagoryNewsFunc(link){
  const linkArray=link.split('/')
  let catagoryNews=linkArray[linkArray.length-1]
      if(!linkArray[linkArray.length-1]){
        catagoryNews=linkArray[linkArray.length-2]
      }
      let test=catagoryNews.split(".")
      if(test.length>=2) catagoryNews="unkown"
      return catagoryNews
}

export async function getKeywords(catagoryPage){
    const k=await fetch("./keywords.json").catch(err=>{console.log("Error occur while fetching keywords.json :",err)})
    const data=await k.json()
    return data[0][catagoryPage]
}


export function canvasShow(catagoryPage) {
    const canvas = document.getElementById("newsCanvas");
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height); // clear canvas before drawing
    ctx.textAlign = "center"; // center text horizontally
    ctx.textBaseline = "top"; // aligns text from top

    const centerX = canvas.width / 2;
    let startY = 50;
    const lineHeight = 50;

    // ---------------- First line: italic, bold, gradient, shadow ----------------
    ctx.font = "italic bold 28px Segoe UI";

    // Create gradient
    const gradient1 = ctx.createLinearGradient(0, startY, canvas.width, startY + 30);
    gradient1.addColorStop(0, "#ff7f50"); // coral
    gradient1.addColorStop(1, "#ff1493"); // deep pink
    ctx.fillStyle = gradient1;

    // Add shadow
    ctx.shadowColor = "rgba(0,0,0,0.3)";
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    ctx.shadowBlur = 4;

    ctx.fillText("Add Rss link of "+catagoryPage.toUpperCase()+" news in Feeder!", centerX, startY);

    // ---------------- Second line: normal font, subtle shadow ----------------
    startY += lineHeight;
    ctx.font = "24px Segoe UI";
    ctx.fillStyle = "#333"; // dark gray
    ctx.shadowColor = "rgba(0,0,0,0.2)";
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 1;
    ctx.shadowBlur = 2;

    ctx.fillText("Welcome to SingleMind News!", centerX, startY);

    // ---------------- Third line: red gradient with shadow ----------------
    startY += lineHeight;
    ctx.font = "22px Segoe UI";
    const gradient2 = ctx.createLinearGradient(0, startY, canvas.width, startY + 30);
    gradient2.addColorStop(0, "#ff0000");
    gradient2.addColorStop(1, "#ff4500");
    ctx.fillStyle = gradient2;

    ctx.shadowColor = "rgba(0,0,0,0.3)";
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 1;
    ctx.shadowBlur = 3;

    ctx.fillText("No Ads. No Distractions. Just News.", centerX, startY);

    // Show canvas if table is empty
    const tbody = document.querySelector("#newsTable tbody");
     //hidding table:
    let table=document.getElementById("newsTable")
  
    if (!tbody.rows.length) canvas.style.display = "block",  table.style.display="none";
}


export function scrollTop(){
    let scrollTopBtn=document.querySelector("#scrollTopBtn")
  window.addEventListener("scroll",()=>{
      if (document.documentElement.scrollTop > 200 || document.body.scrollTop > 200) {
        scrollTopBtn.style.display = "block";
      } else {
        scrollTopBtn.style.display = "none";
      }
  })
  scrollTopBtn.addEventListener("click",()=>{
   
    window.scrollTo({
      top:0,
      behavior:'smooth'
    })
  })
  
}


export function showDetailOptions(){
  let detailcon=document.querySelector(".detailoptions")
let ul=document.querySelector(".detailoptions ul")
let texthover=document.querySelectorAll(".navbar ul li a")
let timer;
texthover.forEach(ele=>{
  ele.addEventListener("mouseenter",async event=>{
    
   clearTimeout(timer)
    detailcon.innerHTML=""

    detailcon.classList.add("detailoptions2")
   
    // console.log("this is eleemnt ",ele.textContent.toLocaleLowerCase())
    let l=ele.textContent.toLocaleLowerCase()
    const matchArrayDetailList=await getKeywords(l)
    console.log("matchArrayDetailList is ",matchArrayDetailList)
    matchArrayDetailList.forEach(ele=>{
    // console.log("element is inserting: ",ele)
    let li=document.createElement("li")
     li.classList.add("list_detail")
     li.innerHTML=`<a href="#" onclick='moduleNews("narrow","${ele}")'>${ele}</a>`
     detailcon.appendChild(li)
     
      })


  })
   ele.addEventListener("mouseleave",event=>{
    
     timer=setTimeout(() => {
      console.log("Event is : ",event)
     detailcon.classList.remove("detailoptions2")
     detailcon.innerHTML=""
      
     }, 100);
    
  })
})
detailcon.addEventListener("mouseenter",()=>{
  clearTimeout(timer);
  
})
detailcon.addEventListener("mouseleave",()=>{
  detailcon.classList.remove("detailoptions2")
     detailcon.innerHTML=""
  

})

async function getKeywords(catagoryPage){
    const k=await fetch("./keywords.json").catch(err=>{console.log("Error occur while fetching keywords.json :",err)})
    const data=await k.json()
    return data[0][catagoryPage]
}

}