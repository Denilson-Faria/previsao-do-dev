document.querySelector('#search').addEventListener('submit', async (event) => {
    event.preventDefault();

    const cityName = document.querySelector('#city_name').value;

    if (!cityName) {
        return showAlert('<p>Você precisa digitar uma cidade...</p>');
    }

    await fetchWeatherByCity(cityName);
});

async function fetchWeatherByCity(cityName) {
    const apikey = 'e25bc6ced649ec3e2ace7548f60e5301';
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURI(cityName)}&appid=${apikey}&units=metric&lang=pt_br`;

    try {
        const results = await fetch(apiUrl);
        const json = await results.json();

        if (json.cod === 200) {
            showInfo({
                city: json.name,
                country: json.sys.country,
                temp: json.main.temp,
                tempMax: json.main.temp_max,
                tempMin: json.main.temp_min,
                description: json.weather[0].description,
                tempIcon: json.weather[0].icon,
                windSpeed: json.wind.speed,
                humidity: json.main.humidity,
            });
        } else {
            
            document.querySelector("#weather").classList.remove('show');
            
            showAlert(`
                <p>Cidade não encontrada!</p>
                <img src="images/undraw_current-location_c8qn.svg" alt="Cidade não encontrada" />
            `);
        }
    } catch (error) {
        
        document.querySelector("#weather").classList.remove('show');
        
        showAlert(`
            <p>Erro ao buscar dados!</p>
            <img src="images/undraw_current-location_c8qn.svg" alt="Erro" />
        `);
    }
}

async function fetchWeatherByCoords(lat, lon) {
    const apikey = 'e25bc6ced649ec3e2ace7548f60e5301';
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apikey}&units=metric&lang=pt_br`;

    try {
        const results = await fetch(apiUrl);
        const json = await results.json();

        if (json.cod === 200) {
            showInfo({
                city: json.name,
                country: json.sys.country,
                temp: json.main.temp,
                tempMax: json.main.temp_max,
                tempMin: json.main.temp_min,
                description: json.weather[0].description,
                tempIcon: json.weather[0].icon,
                windSpeed: json.wind.speed,
                humidity: json.main.humidity,
            });
        }
    } catch (error) {
        console.error('Erro ao buscar dados por coordenadas:', error);
    }
}

function getInitialLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                fetchWeatherByCoords(position.coords.latitude, position.coords.longitude);
            },
            (error) => {
                console.warn('Geolocalização negada. Aguardando busca manual.');
            }
        );
    } else {
        console.warn('Geolocalização não suportada. Aguardando busca manual.');
    }
}

getInitialLocation();

function getSuggestion(temp, description, humidity) {
    const descLower = description.toLowerCase();
    
    if (descLower.includes('chuva') || descLower.includes('rain') || descLower.includes('chuvisco')) {
        return {
            icon: 'fa-umbrella',
            text: '☔ Não esqueça o guarda-chuva! Chuva prevista para hoje.'
        };
    }
    
    if (descLower.includes('trovoada') || descLower.includes('tempestade') || descLower.includes('thunderstorm')) {
        return {
            icon: 'fa-cloud-bolt',
            text: '⚡ Atenção! Possibilidade de tempestades. Evite áreas abertas.'
        };
    }
    
    if (descLower.includes('neve') || descLower.includes('snow')) {
        return {
            icon: 'fa-snowflake',
            text: '❄️ Vista roupas quentes e adequadas para neve!'
        };
    }
    
    if (descLower.includes('névoa') || descLower.includes('neblina') || descLower.includes('fog') || descLower.includes('mist')) {
        return {
            icon: 'fa-smog',
            text: '🌫️ Visibilidade reduzida. Dirija com cuidado!'
        };
    }
    
    if (temp >= 30) {
        return {
            icon: 'fa-sun',
            text: '🌞 Muito calor! Use roupas leves, protetor solar e mantenha-se hidratado.'
        };
    }
    
    if (temp >= 25 && temp < 30) {
        return {
            icon: 'fa-temperature-high',
            text: '😎 Clima quente! Roupas leves e não esqueça o protetor solar.'
        };
    }
    
    if (temp >= 20 && temp < 25) {
        return {
            icon: 'fa-cloud-sun',
            text: '👕 Temperatura agradável! Roupas confortáveis são ideais.'
        };
    }
    
    if (temp >= 15 && temp < 20) {
        return {
            icon: 'fa-wind',
            text: '🧥 Clima fresco! Uma blusa ou jaqueta leve pode ser útil.'
        };
    }
    
    if (temp >= 10 && temp < 15) {
        return {
            icon: 'fa-temperature-arrow-down',
            text: '🧥 Está frio! Leve um casaco ou agasalho.'
        };
    }
    
    if (temp < 10) {
        return {
            icon: 'fa-temperature-low',
            text: '🥶 Muito frio! Vista roupas quentes, gorro e luvas.'
        };
    }
    
    return {
        icon: 'fa-lightbulb',
        text: '💡 Aproveite o dia!'
    };
}

function showInfo(json) {
    showAlert('');

    document.querySelector("#weather").classList.add('show');
    document.querySelector('#title').innerHTML = `${json.city}, ${json.country}`;
    document.querySelector('#temp_value').innerHTML = `${json.temp.toFixed(1).toString().replace('.', ',')} <sup>C°</sup>`;
    document.querySelector('#temp_description').innerHTML = json.description;
    document.querySelector("#temp_img").src = `https://openweathermap.org/img/wn/${json.tempIcon}@2x.png`;
    document.querySelector("#temp_max").innerHTML = `${json.tempMax.toFixed(1)} <sup>C°</sup>`;
    document.querySelector("#temp_min").innerHTML = `${json.tempMin.toFixed(1)} <sup>C°</sup>`;
    document.querySelector("#humidity").innerHTML = `${json.humidity}%`;
    document.querySelector("#wind").innerHTML = `${json.windSpeed} km/h`;
    
    const suggestion = getSuggestion(json.temp, json.description, json.humidity);
    document.querySelector('#suggestion_icon').className = `fa-solid ${suggestion.icon}`;
    document.querySelector('#suggestion_text').textContent = suggestion.text;
}

function showAlert(msg) {
    document.querySelector('#alert').innerHTML = msg;
}