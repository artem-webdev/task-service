var Koa = require('koa');
var Router = require('koa-router');
var pool = require('./mysql-pool');
var cors = require('@koa/cors');
var axios = require('axios');

var app = new Koa();
app.use(cors());

var router = new Router();

const api_key = "cc7e0e2e24d0a79b409823b4ecf906e7";
const lang = "ru";

router.get('/weather/', async(ctx, next) => {

    let city = (ctx.request.query.city)?`q=${ctx.request.query.city}&`:'q=Moscow&';
    let lat = ctx.request.query.lat;
    let lon = ctx.request.query.lon;
    if(lat && lon){ var coordinates = `lat=${lat}&lon=${lon}`;  city = ""; }
    else{  coordinates = ""; }
    let url = `https://api.openweathermap.org/data/2.5/weather?${city}lang=${lang}&${coordinates}&appid=${api_key}`;
    let response = await axios.get(url);
    var res = await pool.query('select city from geo where city_en=? ',[response.data.name]);
    let result = {
        "temp":response.data.main.temp,
        "description":response.data.weather[0].description,
        "icon":'http://openweathermap.org/img/w/'+response.data.weather[0].icon+'.png',
        "wind_speed":response.data.wind.speed,
        "wind_deg":response.data.wind.deg,
        "pressure":response.data.main.pressure,
        "humidity":response.data.main.humidity,
        "cityEn":response.data.name,
        "cityRu":res[0].city
    };

    ctx.body = result;
    
});


router.get('/country/', async(ctx, next) => {

    var countries = await pool.query('select distinct country from geo');
    ctx.body = countries;

});

router.get('/city/', async(ctx, next) => {
    
    var country = ctx.request.query.country;
    var cities = await pool.query('select  city,city_en from geo where country=? order by city',[country]);
    ctx.body = cities;

});

app.use(router.routes()).use(router.allowedMethods());
app.listen(3000);