from dotenv import load_dotenv
from agents import function_tool
import os
import requests

load_dotenv()

@function_tool
def get_weather(city: str) -> str:
    """
    Get the current weather for a given city.
    
    Args:
        city (str): name of the city.
    Returns:
        str: Description of the current weather.
    """
    apiKey = os.getenv("WeatherAPI_KEY")
    url = f"http://api.openweathermap.org/data/2.5/weather?q={city}&appid={apiKey}&units=metric"
    response = requests.get(url)
    
    if response.status_code == 200:
        data = response.json()
        temp = data.get('main', {}).get('temp', 'N/A')
        description = data.get('weather', [{}])[0].get('description', 'N/A')
        return f"The weather in {city} is {temp}°C with {description}."
    else:
        return f"Could not fetch weather for {city}. Please check the city name or try again later."