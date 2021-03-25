const express = require('express')
const path = require('path')
const mysql = require('mysql')
const app = express()
const crawler = require('./utils/crawler')
const test = require('./utils/crawler2')
process.env.UV_THREADPOOL_SIZE = 128;
require('url').URL

const viewsPath = path.join(__dirname, '../templates')
const publicDirPath = path.join(__dirname, '../public')

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


app.set('view engine', 'hbs')
app.set('views', viewsPath)
app.use(express.static(publicDirPath))
app.use(express.json())

app.get('' , (req,res)=>{
    res.render('index')
})
app.get('/comet/community', (req,res)=>{
    res.render('crawl-site')
})

app.get('/api/crawl', (req,res)=>{
	//crawler.queue({uri: 'https://www.google.com/'});
    //crawler.queue({uri: 'https://www.bbc.com/'});
    if (req.query.crawlUrl != ''){
        test(req.query.crawlUrl)
    }
    
})

app.get('/api/getRes', (req,res)=>{
        if (req.query.term != ''){
            connection.query("SELECT * FROM sites WHERE title LIKE ? OR url LIKE ? OR keywords LIKE ? OR description LIKE ? ORDER BY clicks DESC", [`%${req.query.term}%`,`%${req.query.term}%`,`%${req.query.term}%`,`%${req.query.term}%`] ,(error, rows, field)=>{
                if (error){
                    console.log(error)
                }else{
                    rows = JSON.stringify(rows,this.escapeId)
                    res.send(rows)
                }
            })
    }
})

app.post('/api/updateCount', (req,res)=>{
    if (req.query.id !== undefined){
        connection.query('UPDATE sites SET clicks = clicks+1 WHERE id=?',[req.query.id],(error, rows, field)=>{
                if (error){
                    console.log(error)
                }
            })
    }
})


app.get('/search', (req,res)=>{
    if (req.query.term != ''){
        return res.render('search', {
                    term: req.query.term
                })
    }
})
app.listen(3000, ()=>{
    console.log('Heok')
})

module.exports = connection