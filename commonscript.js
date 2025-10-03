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
      console.log("user session remove and logout..........")
      event.preventDefault(); 
      location.replace('login2.html')
      // window.location.href="./login2.html"//not working ...
    })
    
}



export function catagoryNewsFunc(link){
  const linkArray=link.split('/')
  let catagoryNews=linkArray[linkArray.length-1]
      if(!linkArray[linkArray.length-1]){
        catagoryNews=linkArray[linkArray.length-2]
      }
      return catagoryNews
}