const searchForm = document.querySelector('form')
const inp = document.querySelector('input')
const background = document.querySelector('.wrapper')
const toggleButton = document.getElementById('toggleSwitch')

let tempURL = ''

inp.focus()

function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}
toggleButton.checked = getCookie('keepB') == 'true'


toggleButton.addEventListener('click', (e)=>{
    if (toggleButton.checked){
        document.cookie = "imgUrl="+tempURL+"; expires=Thu, 18 Dec 2064 12:00:00 UTC;"
    }else{
        document.cookie = "imgUrl=; expires=Thu, 01 Jan 1970 00:00:00 UTC;"
    }
    document.cookie = "keepB="+toggleButton.checked+"; expires=Thu, 18 Dec 2064 12:00:00 UTC;"

    console.log(getCookie('keepB') + ' ' + getCookie('imgUrl'))
})
if (getCookie('keepB') != 'true'){
    fetch(`https://source.unsplash.com/random/${screen.width}x${screen.height}?color=white`).then((res)=>{
        background.style.backgroundImage = 'url('+res.url+')'
        tempURL = res.url
    })
}else{
    console.log(getCookie('imgUrl'))
    background.style.backgroundImage = 'url('+getCookie('imgUrl')+')'
}


searchForm.addEventListener('submit', (e)=>{
    e.preventDefault()
    if (inp.value != ''){
    location.href = '/search?term='+inp.value
    }
})
