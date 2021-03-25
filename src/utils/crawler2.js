var cheerio = require("cheerio");
const axios = require('axios')
process.env.UV_THREADPOOL_SIZE = 128;
require('url').URL

const crawled = []

const mysql = require('mysql')

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'comet2'
})

connection.connect((e)=>{
    if (e){
        console.log(e)
    }else{
        console.log('Connected')
    }
})



function createLink(scheme,host,src,path){
    if (src.substr(0,2) == "//"){
        src = scheme + src
    }else if (src.substr(0,1) == "/"){
        src = scheme + "//" + host + src
    }else if (src.substr(0,2) == "./"){
        src = scheme + "//" + host + path + src.substring(1)
    }else if (src.substr(0,3) == "../"){
        src = scheme + "//"  + host + "/" + src
    }else if (src.substring(0,5) != "https" && src.substring(0,4) != "http"){
        src = scheme + "//"  + host + "/" + src
    }

    return src
}

async function getDetails(url){
    let response = await axios(url).catch((err) => console.log(err.config.url + ' - ' + err));

    
    try{
                const html = await response.data
                var $ = cheerio.load(html);
                var title = $('title').text().trim()

                var description = $('meta[name="description"]').attr('content') === undefined ? ''.toString() : $('meta[name="description"]').attr('content').toString().trim();
                var keywords = $('meta[name="keywords"]').attr('content') === undefined ? ''.toString() : $('meta[name="keywords"]').attr('content').toString().trim();

                $("a").each(function() {
                    var link = $(this);
                    var href = encodeURI(link.attr("href"));
                    

                    if (href === undefined){
                        return;
                    }
                    if (href.indexOf('#') > -1 || href.substr(0,11) == "javascript:"){
                        return;
                    }
                    
                    href = createLink(response.request.protocol, response.request.host, href, response.request.pathname)
                    if (!crawled.includes(href)){
                        crawled.push(href)
                        getDetails(href)
                    }
                });
                $("img").each(function(){
                    var img_link = $(this)
                    var imgSrc = encodeURI(img_link.attr("src"))
                    var imgTitle = img_link.attr("title")
                    var imgAlt = img_link.attr("alt")
                    if (!crawledImages.includes(imgSrc)){
                        crawledImages.push(imgSrc)
                        connection.query("INSERT INTO images(siteUrl, imageUrl, alt, title) VALUES(?,?,?,?);", [response.config.url, imgSrc, imgAlt, imgTitle], (e,rows,field)=>{
                            if (e){
                                console.log(e.sqlMessage)
                            }else{
                                //rows = JSON.stringify(rows)
                                console.log("Image successfully inserted")
                            }
                        })
                    }
                })
                connection.query(`INSERT INTO sites(url, title, description, keywords) VALUES (?, ?, ?, ?);`, [response.config.url, title, description, keywords], (e, rows, field)=>{
                    if (e){
                        console.log(e.sqlMessage)
                    }else{
                        //rows = JSON.stringify(rows)
                        console.log("Row successfully inserted")
                    }
                })
            }catch(e){
                console.log(e)
            }

    return response;
}


const crawledImages = []

async function fetchData(url){
    let response = await axios(url).catch((err) => console.log(err.config.url + ' - ' + err.res.IncomingMessage.statusMessage));
    
    try{
                const html = await response.data
                var $ = cheerio.load(html);
                var title = $('title').text().trim()

                var description = $('meta[name="description"]').attr('content') === undefined ? ''.toString() : $('meta[name="description"]').attr('content').toString().trim();
                var keywords = $('meta[name="keywords"]').attr('content') === undefined ? ''.toString() : $('meta[name="keywords"]').attr('content').toString().trim();



                $("a").each(function() {
                    var link = $(this);
                    var href = encodeURI(link.attr("href"));
                    

                    if (href === undefined){
                        return;
                    }
                    if (href.indexOf('#') > -1 || href.substr(0,11) == "javascript:"){
                        return;
                    }
                    
                    href = createLink(response.request.protocol, response.request.host, href, response.request.pathname)
                    if (!crawled.includes(href)){
                        crawled.push(href)
                        getDetails(href)
                    }
                });
                $("img").each(function(){
                    var img_link = $(this)
                    var imgSrc = encodeURI(img_link.attr("src"))
                    var imgTitle = img_link.attr("title")
                    var imgAlt = img_link.attr("alt")
                    if (!crawledImages.includes(imgSrc)){
                        crawledImages.push(imgSrc)
                        connection.query("INSERT INTO images(siteUrl, imageUrl, alt, title) VALUES(?,?,?,?);", [response.config.url, imgSrc, imgAlt, imgTitle], (e,rows,field)=>{
                            if (e){
                                console.log(e.sqlMessage)
                            }else{
                                //rows = JSON.stringify(rows)
                                console.log("Image successfully inserted")
                            }
                        })
                    }
                })
                connection.query(`INSERT INTO sites(url, title, description, keywords) VALUES (?, ?, ?, ?);`, [response.config.url, title, description, keywords], (e, rows, field)=>{
                    if (e){
                        console.log(e.sqlMessage)
                    }else{
                        //rows = JSON.stringify(rows)
                        console.log("Row successfully inserted")
                    }
                })
            }catch(e){
                console.log(e)
            }
			

    return response;
}

module.exports = fetchData