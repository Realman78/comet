var Crawler = require("crawler");
var cheerio = require("cheerio");
process.env.UV_THREADPOOL_SIZE = 128;
require('url').URL

const crawled = []
const crawling = []

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






function getDetails(url){
    const crawler = new Crawler({
            rateLimit: 0,
            maxConnections: 16,
            retries: 1,
            jQuery: false,
            timeout: 60000,
            method: "GET",
            headers: {
            'Connection': 'close',
            'Accept-Encoding': '',
            'Accept-Language': 'en-US,en;q=0.8'
        },
        retryTimeout: 5000,
        userAgent: "CometBot/0.1",
    callback : function (error, res, done) {
        if(error){
            console.log(error);
        }else{
            try{
                var $ = cheerio.load(res.body);
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
                    
                    href = createLink(res.request.uri.protocol, res.request.uri.host, href, res.request.uri.pathname)
                    if (!crawled.includes(href)){
                        crawled.push(href)
                        getDetails(href)

                    }
                });
                connection.query(`INSERT INTO sites(url, title, description, keywords) VALUES (?, ?, ?, ?);`, [res.options.uri, title, description, keywords], (e, rows, field)=>{
                    if (e){
                        console.log(e)
                    }else{
                        //rows = JSON.stringify(rows)
                        console.log("Row successfully inserted")
                    }
                })
            }catch(e){
                console.log(e)
            }
            
        }
        
        done();
    }
});
crawler.queue({uri: url})
}



const c = new Crawler({
            rateLimit: 0,
            maxConnections: 16,
            retries: 1,
            jQuery: false,
            timeout: 60000,
            method: "GET",
            headers: {
            'Connection': 'close',
            'Accept-Encoding': '',
            'Accept-Language': 'en-US,en;q=0.8'
        },
        retryTimeout: 5000,
        userAgent: "CometBot/0.1",
    callback : function (error, res, done) {
        if(error){
            console.log(error);
        }else{
            try{
                var $ = cheerio.load(res.body);
                $("a").each(function() {
                    var link = $(this);
                    var href = encodeURI(link.attr("href"));
            
                    if (href === undefined){
                        return;
                    }
                    if (href.indexOf('#') > -1 || href.substr(0,11) == "javascript:"){
                        return;
                    }


                    
                    href = createLink(res.request.uri.protocol, res.request.uri.host, href, res.request.uri.pathname)
                    if (!crawled.includes(href)){
                        crawled.push(href)
						crawling.push(href)
                        getDetails(href)

                    }
                });
					crawling.shift()
					crawling.forEach((site)=> c.queue(site))
            }catch(e){
                console.log(e)
            }
            
        }
        done();
    }
});
 

 
module.exports = c