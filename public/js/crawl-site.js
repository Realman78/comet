const form = document.querySelector('form')
const inp = document.getElementById('inputText')

form.addEventListener('submit', (e)=>{
    e.preventDefault()
    if (validURL(inp.value)){
        fetch('/api/crawl?crawlUrl='+encodeURI(inp.value))
        console.log('CRAWLING...')
    }else{
        if (confirm('Invalid url: ' + inp.value + "\nIf you think your url is correct, contact me and I will resolve the issue")){
            window.open('https://marin-dedic-personal-website.herokuapp.com/contact', '_blank')
        }
    }
})

function validURL(str) {
  var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
    '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
  return !!pattern.test(str);
}