let map;

// Função para inicializar o mapa usando a biblioteca OpenLayers
function initMap() {
    map = new ol.Map({
        target: 'map',
        layers: [
            new ol.layer.Tile({
                source: new ol.source.OSM()// Usando o OpenStreetMap como camada base
            })
        ],
        view: new ol.View({
            center: ol.proj.fromLonLat([-47.9292, -15.7801]), // Coordenadas do Brasil
            zoom: 4 // Nível de zoom inicial do mapa
        })
    });
}

// Quando o conteúdo da página for carregado
document.addEventListener('DOMContentLoaded', function() {
    initMap();// Inicializa o mapa
    updateCachedCitiesSelect();// Atualiza a lista de cidades cacheadas
    // Oculta as informações de previsão do tempo inicialmente
    document.querySelector('.weather-info').classList.add('hidden');
    document.querySelector('.forecast').classList.add('hidden');
});
// Quando o botão "Consultar" for clicado
document.getElementById('search-btn').addEventListener('click', () => {
    const city = document.getElementById('city-input').value;
    if (city) {
        getCityCoordinates(city);// Obtém as coordenadas da cidade
    } else {
        alert('Por favor, insira o nome de uma cidade.');
    }
});

// Função para obter as coordenadas da cidade usando a API OpenWeatherMap
function getCityCoordinates(city) {
    const apiKey = '1737b8d38bc58e45a5653eafdc4b913c'; // chave API do site "openweathermap"
    fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                const { lat, lon } = data[0];
                getWeatherData(lat, lon, city); // Obtém os dados de previsão do tempo
                moveMapToLocation(lat, lon); // Move o mapa para a localização da cidade
            } else {
                alert('Não foi possível localizar a cidade.');
            }
        })
        .catch(error => {
            console.error('Erro ao consultar API de geocoding:', error);
            alert('Erro ao consultar API de geocoding.');
        });
}

// Função para obter os dados de previsão do tempo usando a API HG Weather
function getWeatherData(lat, lon, city) {
    const apiKey = '2df9a579'; // chave de API do site "HG Weather"
    const proxyUrl = 'http://localhost:3000/weather';
    const targetUrl = `?key=${apiKey}&lat=${lat}&lon=${lon}`;
    
    fetch(proxyUrl + targetUrl)
        .then(response => response.json())
        .then(data => {
            if (data.results) {
                updateWeatherInfo(data.results, city); // Atualiza as informações de previsão do tempo
                cacheCity(city, data.results); // Cacheia a cidade e seus dados de previsão
            } else {
                alert('Não foi possível obter a previsão do tempo.');
            }
        })
        .catch(error => {
            console.error('Erro ao consultar API de previsão do tempo:', error);
            alert('Erro ao consultar API de previsão do tempo.');
        });
}

// Função para mover o mapa para a localização especificada
function moveMapToLocation(lat, lon) {
    const view = map.getView();
    view.setCenter(ol.proj.fromLonLat([lon, lat])); // Move o centro do mapa
    view.setZoom(10); // Define o nível de zoom
}

// Função para atualizar as informações de previsão do tempo na interface
function updateWeatherInfo(weatherData, city) {
    document.querySelector('#city-name span').textContent = city;
    document.querySelector('#date span').textContent = formatDate(weatherData.date);
    document.querySelector('#current-temp span').textContent = `${weatherData.temp}°C`;
    document.querySelector('#max-temp span').textContent = `${weatherData.forecast[0].max}°C`;
    document.querySelector('#min-temp span').textContent = `${weatherData.forecast[0].min}°C`;
    document.querySelector('#weather-type span').textContent = weatherData.description;
    document.querySelector('#weather-icon').src = weatherData.condition_slug 
        ? `https://assets.hgbrasil.com/weather/icons/conditions/${weatherData.condition_slug}.svg` 
        : 'https://assets.hgbrasil.com/weather/icons/conditions/default.svg';
    document.querySelector('#rain-probability span').textContent = `${weatherData.rain ? weatherData.rain : 0}%`;
    document.querySelector('#moon-phase span').textContent = formatMoonPhase(weatherData.moon_phase);
    document.querySelector('#moon-icon').src = weatherData.moon_phase 
        ? `https://assets.hgbrasil.com/weather/icons/moon/${weatherData.moon_phase.toLowerCase().replace(' ', '_')}.png` 
        : 'https://assets.hgbrasil.com/weather/icons/moon/default.png';

    const forecastContainer = document.getElementById('forecast-days');
    forecastContainer.innerHTML = '';
    weatherData.forecast.slice(0, 3).forEach(day => {
        const forecastDay = document.createElement('div');
        forecastDay.classList.add('forecast-day');
        forecastDay.innerHTML = `
            <p>Data: ${day.date}</p>
            <p>Máxima: ${day.max}°C</p>
            <p>Mínima: ${day.min}°C</p>
            <p>Clima: ${day.description} <img src="https://assets.hgbrasil.com/weather/icons/conditions/${day.condition}.svg" alt="ícone do clima"></p>
            <p>Chance de chuva: ${day.rain_probability ? day.rain_probability : 0}%</p>
        `;
        forecastContainer.appendChild(forecastDay);
    });

    // Remover a classe 'hidden' para exibir as informações de previsão do tempo
    document.querySelector('.weather-info').classList.remove('hidden');
    document.querySelector('.forecast').classList.remove('hidden');
}

// Função para formatar a data no formato desejado
function formatDate(dateStr) {
    const dateParts = dateStr.split('/');
    const date = new Date(`${dateParts[2]}-${dateParts[1]}-${dateParts[0]}T00:00:00`);
    return date.toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}

// Função para formatar a fase da lua
function formatMoonPhase(phase) {
    const phases = {
        'new': 'Lua Nova',
        'waxing_crescent': 'Lua Crescente',
        'first_quarter': 'Primeiro Quarto',
        'waxing_gibbous': 'Lua Crescente Gibosa',
        'full': 'Lua Cheia',
        'waning_gibbous': 'Lua Minguante Gibosa',
        'last_quarter': 'Último Quarto',
        'waning_crescent': 'Lua Minguante'
    };
    return phases[phase.toLowerCase().replace(' ', '_')] || phase;
}

// Função para cachear a cidade e seus dados de previsão no LocalStorage
function cacheCity(city, weatherData) {
    let cachedCities = JSON.parse(localStorage.getItem('cachedCities')) || [];
    cachedCities.push({ city, weatherData });
    localStorage.setItem('cachedCities', JSON.stringify(cachedCities));
    updateCachedCitiesSelect();
}

// Função para atualizar a lista de cidades cacheadas no seletor
function updateCachedCitiesSelect() {
    const select = document.getElementById('cached-cities-select');
    select.innerHTML = '';
    let cachedCities = JSON.parse(localStorage.getItem('cachedCities')) || [];
    cachedCities.forEach(({ city }) => {
        const option = document.createElement('option');
        option.value = city;
        option.textContent = city;
        select.appendChild(option);
    });
}

// Quando uma cidade cacheada é selecionada no seletor
document.getElementById('cached-cities-select').addEventListener('change', function() {
    const city = this.value;
    let cachedCities = JSON.parse(localStorage.getItem('cachedCities')) || [];
    const cachedCity = cachedCities.find(c => c.city === city);
    if (cachedCity) {
        updateWeatherInfo(cachedCity.weatherData, city);
        const { lat, lon } = cachedCity.weatherData.coord;
        moveMapToLocation(lat, lon);
    }
});
