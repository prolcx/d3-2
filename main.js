//import
const express = require('express')
const handlebars = require('express-handlebars')

const fetch = require('node-fetch')
const withQuery = require('with-query').default

const PORT = parseInt(process.argv[2]) || parseInt(process.env.APP_PORT) || 3000
const API_KEY = process.env.API_KEY || ""
const ENDPOINT = 'http://api.giphy.com/v1/gifs/search'

const app = express()

app.engine('hbs', handlebars({ defaultLayout: 'default.hbs'}))
app.set('view engine', 'hbs')

//set homepage
app.get('/',
    (req,resp)=>{
        resp.status(200)
        resp.type('text/html')
        resp.render('index')
        
    }
)
//GET after user search
app.get('/search',
    (req,resp)=>{
        const search = req.query['search-term']
        const url = withQuery(
            ENDPOINT,   
            {
                api_key: API_KEY,
                q: search,
                limit: 10
            }
            )
        console.info('url: ', url.toString())

//promise
        const p = fetch(url)
        let imgs = []
                p.then(result=>{
                    return result.json()})
                .then(result=>{
                    console.info('The Giphys')
                    //console.info(result)
                    return result       // to put more .then, return is needed.
                })
                .then(result=>{
                    const a = result
                    for (let d of a.data) {
                    const title = d.title
                    const url = d.images.fixed_height.url
                    //url = d['images']['fixed_height']['url']
                    imgs.push(
                    {title, url})

                    resp.status(200)
                    resp.type('text/html')
                    resp.render('result',{
                        search, imgs, hasContent:imgs.length>0
                    })
                    
                }

                })
                .catch(e=>{
                    console.info('Error Occurred')
                    console.error('error',e)
                })

    })
/*
resp.render('result',
            {
                result: result.json()
            }
        )
})
*/

//render
//homepage


//handlebar each

//create url

//configure app
if (API_KEY)
    app.listen(PORT, () =>{
        console.info(`Application started on port ${PORT} at ${new Date()}`)
    })
else console.error(e)

/*
//promise
const p =fetch(url)
p.then(result=>{
    return result.json()
})
.then(result=>{
    console.info('The gif')
    console.info(result)
})
.catch(e=>{
    console.info('Is an error')
    console.error('error: ', e)
}
)
*/