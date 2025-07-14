const apiKey = "37a1868a537f4fe7557e9c9faae1fa8e"; // Clave de API de OpenWeatherMap

// Selección de elementos del DOM
const temperatureDisplay = document.getElementById("temperature");
const temperatureRec = document.getElementById("temperatureRec");
const pronosticDisplay = document.getElementById("pronostic");
const humidityDisplay = document.getElementById("humidity");
const windDisplay = document.getElementById("wind");
const iconDisplay = document.getElementById("weather-icon");

const videoBackground = document.getElementById("video-background"); // Selección del video de fondo
const sourceBackground = document.getElementById("source-background"); // Selección del video de fondo

// Elementos para la búsqueda
const inputLocation = document.getElementById("inputLocation");
const buttonSearch = document.getElementById("btnSearch");
const locationDisplay = document.getElementById("location");

// Crear contenedor para sugerencias de ciudades
const suggestionsContainer = document.getElementById("city-suggestions");

// Evento para autocompletar ciudades
let debounceTimeout;
inputLocation.addEventListener("input", function () {
  clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(async () => {
    const query = inputLocation.value.trim();

    const geoUrl = `https://wft-geo-db.p.rapidapi.com/v1/geo/cities?namePrefix=${query}&limit=5&sort=-population`;
    try {
      const response = await fetch(geoUrl, {
        method: "GET",
        headers: {
          "X-RapidAPI-Key":
            "cc00a81164msh772ce7e8190e3b3p195de5jsncbf13c1b3ea0", // Reemplaza con tu propia clave de RapidAPI
          "X-RapidAPI-Host": "wft-geo-db.p.rapidapi.com",
        },
      });
      const result = await response.json();
      suggestionsContainer.innerHTML = "";
      if (result.data && result.data.length > 0) {
        result.data.forEach((city) => {
          const item = document.createElement("li");
          item.textContent = `${city.city}, ${city.country}`;
          item.className = "suggestion-item"; // Añade una clase para estilos
          item.addEventListener("mousedown", function (e) {
            inputLocation.value = `${city.city}, ${city.country}`;
            suggestionsContainer.innerHTML = "";
          });
          suggestionsContainer.appendChild(item);
        });
      }
    } catch (err) {
      suggestionsContainer.innerHTML = "";
    }
  }, 350); // Espera 500ms después de dejar de escribir
});

// Ocultar sugerencias al perder foco
inputLocation.addEventListener("blur", function () {
  setTimeout(() => {
    suggestionsContainer.innerHTML = "";
  }, 100);
});

// Mapeo de iconos de Font Awesome para los diferentes tipos de clima
const iconMap = {
  Clear: "fas fa-sun",
  Clouds: "fas fa-cloud",
  Rain: "fas fa-cloud-showers-heavy",
  Drizzle: "fas fa-cloud-rain",
  Thunderstorm: "fas fa-bolt",
  Snow: "fas fa-snowflake",
  Mist: "fas fa-smog",
  Smoke: "fas fa-smog",
  Haze: "fas fa-smog",
  Dust: "fas fa-smog",
  Fog: "fas fa-smog",
  Sand: "fas fa-smog",
  Ash: "fas fa-smog",
  Squall: "fas fa-wind",
  Tornado: "fas fa-poo-storm",
};

const descriptionMap = {
  Clear: "Despejado",
  Clouds: "Nuboso",
  Rain: "Lluvia",
  Drizzle: "LLovizna",
  Thunderstorm: "Tormenta",
  Snow: "Nieve",
  Mist: "Neblina",
  Smoke: "Humo",
  Haze: "Niebla",
  Dust: "Polvo",
  Fog: "Niebla",
  Sand: "Arena",
  Ash: "Ceniza",
  Squall: "Chubasco",
  Tornado: "Tornado",
};

const backgroundMap = {
  Clear: "backgrounds/clear.mp4",
  Clouds: "backgrounds/clouds.mp4",
  Rain: "backgrounds/rain.mp4",
  Drizzle: "backgrounds/drizzle.mp4",
  Thunderstorm: "backgrounds/thunderstorm.mp4",
  Snow: "backgrounds/Snow/.mp4",
  Mist: "backgrounds/Mist.mp4",
  Smoke: "Humo",
  Haze: "Niebla",
  Dust: "Polvo",
  Fog: "Niebla",
  Sand: "Arena",
  Ash: "Ceniza",
  Squall: "Chubasco",
  Tornado: "Tornado",
};

// Evento para el botón de búsqueda
buttonSearch.addEventListener("click", searchWeather);

// Función para buscar el clima
function searchWeather() {
  if (inputLocation.value === "") {
    // Verifica si el campo de entrada está vacío

    alert("Porfavor digita una ciudad");
  } else {
    // Si el campo no está vacío, procede a buscar el clima
    event.preventDefault(); // Evita el comportamiento por defecto del formulario

    const location = inputLocation.value.trim(); // Elimina espacios en blanco al inicio y al final
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric&lang=es`; // Construye la URL de la API con la ubicación ingresada y la clave de API

    console.log("URL de la API:", url);

    // Realiza la solicitud a la API de OpenWeatherMap
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error en la respuesta de la API");
        }
        return response.json();
      })
      .then((data) => {
        // Procesa la respuesta JSON de la API
        console.log("Datos del clima:", data);

        // Actualizar los elementos del DOM con los datos obtenidos
        locationDisplay.textContent = `${data.name}, ${data.sys.country}`; // Mostrar la ubicación
        temperatureDisplay.textContent = Math.round(data.main.temp) + " °C"; // Mostrar la temperatura
        temperatureRec.textContent = `Max: ${Math.round(
          data.main.temp_max
        )} °C, Min: ${Math.round(data.main.temp_min)} °C`; // Mostrar temperatura máxima y mínima
        pronosticDisplay.textContent = `Pronostico: ${
          descriptionMap[data.weather[0].main]
        }`; // Mostrar el pronóstico del clima según el tipo de clima
        humidityDisplay.textContent = `Humedad: ${data.main.humidity}%`; // Mostrar la humedad
        windDisplay.textContent = `Viento: ${data.wind.speed} m/s`; // Mostrar la velocidad del viento
        console.log(backgroundMap[data.weather[0].main]);

        // Cambiar el video de fondo según el clima
        sourceBackground.src =
          backgroundMap[data.weather[0].main] || "backgrounds/default.mp4"; // Cambiar el video de fondo según el clima
        videoBackground.load(); // Cargar el nuevo video de fondo

        // Actualizar el icono del clima y su color
        iconDisplay.className =
          iconMap[data.weather[0].main] || "fas fa-question-circle";
        iconDisplay.style.color =
          data.weather[0].main === "Clear" ? "yellow" : "gray";

        console.log(`Temperatura en ${location}: ${data.main.temp}°C`);
        console.log(`Clima: ${data.weather[0].main}`);
      })
      .catch((error) => {
        console.error("Error al obtener el clima:", error);
      });
  }
  console.log("Video de fondo actualizado:", videoBackground.src);
}
