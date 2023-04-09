
console.log("Starting root.ejs javascript file");

let cityCodesArray = [];
let colourPalet = ['blueclr', 'purpleclr', 'greenclr', 'orangeclr', 'redclr'];

// Implementation of the caching mechanism. 
/*
    This mechanism is not used since the Add City Functionality of the UI was not implemented. Thus These are only the prototype functions
    assuming that user can request the data from the openweather server. 
*/

const cacheTime = 300000;
const cache = {};
let cacheTimer = 0;

const getCacheTimer = (time)=>{
    const now = new Date().getTime();
    if(cacheTimer < (now+time)){
        cacheTimer = now+time;
    }
    return cacheTimer;
};

const fetchWithCache = async (CityCode,time) =>{
    const now = new Date().getTime();
    if(!cache[CityCode] || cache[CityCode].cacheTimer < now){
        cache[CityCode] = await fetchWetherInfo(CityCode);
        cache[CityCode].cacheTimer = getCacheTimer(time);
    }
    return cache[CityCode];
};

const fetchWetherInfo = async (CityCode)=>{
    let wetherInfo= null;
    let link = `http://api.openweathermap.org/data/2.5/group?id=${CityCode}&units=metric&appid=e9c4bf581f6c3a4d4e181493a202f32e`;
    wetherInfo = await fetch(link).then(res => res.json()).then(dataJson => (wetherInfo = dataJson));
    return wetherInfo;
};

const requestedWeatherData = async (CityCode) =>{        // Need to bind this function with "add City Functionality" of the UI
 
    let wetherData = await fetchWithCache(CityCode,cacheTime);
    console.log(wetherData);
    /*
    This wetherData element will have requested data.(depending on the timespan requests have been made, wetherData var will synchronize
    relevent data from API or cache).
    */

    /*
        As depicts in below section, we can create add city functionality and bind that with event listner to give user to request 
        perticular data they want.

        HTML - >

        <form action="/request" id="inputform">
            <input type="text" id="cityidinput">
            <button>submit</button>
        </form>

        JS - >

        let form = document.querySelector('#inputform');
        form.addEventListener("submit",function (e){
            e.preventDefault();
            let input = document.querySelector('#cityinput');
            let data = input.value;
            console.log(data);
            input.value = '';
            requestedWeatherData(data);
        });
    */
};
// End of the caching mechanism---------------------.


// Functions using for, get data from openwhether server and, for construct the page when page loads.
fetch('./cities.json')
    .then((response) => response.json())
    .then((json) => {
        for (let i = 0; i < json.List.length; i++) {
            cityCodesArray.push(json.List[i].CityCode);
        }
    })
    .then(() => {
        console.log(cityCodesArray);
        let clrCount = 0;
        for (let i = 0; i < cityCodesArray.length; i++) {
            document.querySelector(`#square${cityCodesArray[i]}`).classList.add(colourPalet[clrCount]);
            clrCount++;
            if (clrCount === 5) {
                clrCount = 0;
            }

        }

        for (let i = 0; i < cityCodesArray.length; i++) {

            let link = `http://api.openweathermap.org/data/2.5/group?id=${cityCodesArray[i]}&units=metric&appid=e9c4bf581f6c3a4d4e181493a202f32e`;

            fetch(link)
                .then(res => {
                    console.log("API data was recived", res);
                    return res.json();
                })
                .then(data => {
                    document.querySelector(`#cityname${cityCodesArray[i]}`).innerText = `${data.list[0].name}, ${data.list[0].sys.country}`;
                    let time = utcToTime(data.list[0].dt);
                    document.querySelector(`#time${cityCodesArray[i]}`).innerText = `Time: ${time}`;
                    document.querySelector(`#cityid${cityCodesArray[i]}`).innerText = data.list[0].id;
                    document.querySelector(`#wetherstate${cityCodesArray[i]}`).innerText = data.list[0].weather[0].description;
                    document.querySelector(`#temp${cityCodesArray[i]}`).innerText = data.list[0].main.temp;
                })
                .catch(e => {
                    console.log("error");
                })
        }
    });


function utcToTime(utc) {

    let unix_timestamp = utc
    var date = new Date(unix_timestamp * 1000);
    var hours = date.getHours();
    var minutes = "0" + date.getMinutes();
    var seconds = "0" + date.getSeconds();

    var formattedTime = hours + '.' + minutes.substr(-2);
    if (hours >= 12) {
        formattedTime = formattedTime + 'pm';
    }
    else {
        formattedTime = formattedTime + 'am';
    }
    return formattedTime;

}


function send(post) {

    var city = document.querySelector(`#cityname${post}`).innerText;
    var time = document.querySelector(`#time${post}`).innerText;
    var cityID = document.querySelector(`#cityid${post}`).innerText;
    var wetherState = document.querySelector(`#wetherstate${post}`).innerText;
    var temp = document.querySelector(`#temp${post}`).innerText;
    var bkclr = document.querySelector(`#square${post}`).classList[1];
    
    const json = {
        city: city,
        time: time,
        cityID: cityID,
        wetherState: wetherState,
        temp: temp,
        bkclr:bkclr,
    };

    fetch("/data", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(json),
    }).then(()=>{
        document.querySelector("#formsub").submit();
    });

}
