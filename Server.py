from flask import Flask, request, jsonify, render_template, send_from_directory
from dotenv import load_dotenv
import json
from flask_cors import CORS
from agents import Agent, Runner, function_tool
from pydantic import BaseModel
import asyncio
import os
import base64
import requests
from Funcs import get_weather

load_dotenv()
API_KEY = os.getenv("OPENAI_API_KEY")

app = Flask(__name__, template_folder='templates', static_folder='.')
CORS(app)

agent = Agent(
    name="basic agent",
    model="gpt-4o-mini",
    tools=[get_weather]
)

@app.route('/')
def index():
    return render_template('App.html')

@app.route('/App.css')
def serve_css():
    return send_from_directory('.', 'App.css')

@app.route('/App.js')
def serve_js():
    return send_from_directory('.', 'App.js')

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.get_json()
    # Your frontend sends { input: "message" }, so get 'input' key here:
    user_message = data.get('input')
    if not user_message:
        return jsonify({"error": "No input provided"}), 400
    response = asyncio.run(Runner.run(agent, user_message))
    return jsonify({"message": response.final_output})

if __name__ == '__main__':
    app.run(debug=True)