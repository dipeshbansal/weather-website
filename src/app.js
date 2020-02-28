const path = require('path')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const express = require('express')
const request = require('request-promise')


const app = express()

// Define paths for Express Config

const publicDirectoryPath = path.join(__dirname, '../public')

const viewsPath = path.join(__dirname,'../templates/views')
const partialsPath = path.join(__dirname,'../templates/partials')

//setup handlebars engine and views and location
app.set('view engine','hbs')
app.set('views',viewsPath)
hbs.registerPartials(partialsPath)

//setup static directory to serve

app.use(express.static(publicDirectoryPath))

app.get('',(req,res)=>{
    res.render('index',{
        title: 'Weather',
        name: 'Dipesh Bansal'
    })
})


app.get('/about',(req, res)=>{
    res.render('about',{
        title: 'About me',
        name: 'Dipesh Bansal'
    })
})

app.get('/help',(req,res)=>{
    res.render('help',{
        title: 'Help',
        name: 'Dipesh Bansal'
    })
})

app.get('/weather',(req,res)=>{
    if(!req.query.address){
        return res.send({
            error: 'No address'
        })
    }

    geocode(req.query.address, (error , {latitude , longitude , location}= {}) =>{
        if(error) {
            return res.send({error})
        }
        forecast(latitude , longitude , (error , forecastData)=>{
            if(error){
                return res.send({error})
            }
            res.send({
                forecast: forecastData,
                location,
                address: req.query.address
            })
        })
    })
})


app.get('/help/*',(req,res)=>{
    res.render(404,{
        title:'404',
        name:'Dipesh Bansal',
        errorMessage: 'Help article not Found'
    })
})

app.get('*',(req,res)=>{
    res.render('404',{
        title: 404,
        name: 'Dipesh Bansal',
        errorMessage: 'page not found'
    })
})

app.listen(3000,()=>{
    console.log('Server is up on port 3000')
})

