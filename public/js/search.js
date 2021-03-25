const mainSectionRes = document.querySelector('.mainResultsSection')
const urlParams = new URLSearchParams(window.location.search);
const myParam = urlParams.get('term');
const searchForm = document.querySelector('form')
const inp = document.querySelector('input')
const header = document.getElementById('header_id')

inp.value = myParam

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

if (getCookie('keepB') == 'true'){
    header.style.backgroundImage = 'url('+getCookie('imgUrl')+')'
}


fetch(`/api/getRes?term=${myParam}`).then(async (res)=>{
    const data = await res.json()
    console.log(myParam)
    data.forEach(row => {
        const div = document.createElement('div')
        div.className = "siteContainer"
        const titlePl = document.createElement('h2')
        const a_placeholder = document.createElement('a')
        a_placeholder.className = 'result'
        a_placeholder.setAttribute('data-linkId', row.id)
        a_placeholder.addEventListener('click', (e)=>{
                updateCount(row.id)
            })
        const url_placeholder = document.createElement('h5')
        const desc_placeholder = document.createElement('h4')
        desc_placeholder.textContent = shortenString(row.description, 230)
        url_placeholder.textContent = row.url
        a_placeholder.href = row.url
        a_placeholder.appendChild(titlePl)
        titlePl.textContent = shortenString(row.title, 55)
        div.appendChild(a_placeholder)
        div.appendChild(url_placeholder)
        div.appendChild(desc_placeholder)
        mainSectionRes.appendChild(div)
    });

})

function updateCount(id){
    fetch('/api/updateCount?id='+id, {method: "POST"})
}

function shortenString(str, limit){
    const extension = str.length > limit ? '...' : ''
    return str.substr(0,limit)+extension
}
searchForm.addEventListener('submit', (e)=>{
    e.preventDefault()
    if (inp.value != ''){
    location.href = '/search?term='+inp.value
    }
})
