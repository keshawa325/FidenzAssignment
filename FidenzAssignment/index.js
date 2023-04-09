const express = require("express");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const requiredData = require('./cities.json');

let cityCodesArray = [];
for (let i = 0; i < requiredData.List.length; i++) {
    cityCodesArray.push(requiredData.List[i].CityCode);
}

const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));


let reqBodyData = null;
app.post('/data', (req, res) => {

    if (JSON.stringify(req.body) === '{}') {
        reqBodyData = reqBodyData;
    }
    else {
        reqBodyData = req.body;
    }
    console.log(reqBodyData);
    res.render('redirect.ejs', { reqBodyData: reqBodyData })

});

app.get('/', (req, res) => {
    res.render('root.ejs', { data: cityCodesArray });
});

app.listen(8080, () => {
    console.log("Listening on port 8080");
});