var Koa = require('koa');
var Router = require('koa-router');
var pool = require('./mysql-pool');
var cors = require('@koa/cors');
var axios = require('axios');
var fs = require('./fileS');

var app = new Koa();
app.use(cors());

var router = new Router();

const api_key = "cc7e0e2e24d0a79b409823b4ecf906e7";
const lang = "ru";

router.get('/weather/', async(ctx, next) => {

    try {

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
            "clouds":response.data.clouds.all,
            "cityEn":response.data.name,
            "cityRu":res[0].city
        };

        ctx.body = result;

    }catch(err) {

        ctx.assert(err);
        await fs.appendFile(__dirname+'/error.txt',new Date().toISOString()+' - '+err+'\n');

    }
    
});


router.get('/country/', async(ctx, next) => {

    try{

        var countries = await pool.query('select distinct country from geo');
        ctx.body = countries;

    }catch (err) {

        ctx.assert(err);
        await fs.appendFile(__dirname+'/error.txt',new Date().toISOString()+' - '+err+'\n');
    }


});

router.get('/city/', async(ctx, next) => {

    try{

        var country = ctx.request.query.country;
        var cities = await pool.query('select  city,city_en from geo where country=? order by city',[country]);
        ctx.body = cities;

    }catch (err) {

        ctx.assert(err);
        await fs.appendFile(__dirname+'/error.txt',new Date().toISOString()+' - '+err+'\n');
    }


});

app.use(router.routes()).use(router.allowedMethods());
app.on('error', async(err,ctx) => {
    await fs.appendFile(__dirname+'/error.txt',new Date().toISOString()+' - '+err+'\n');
});
app.listen(3000);