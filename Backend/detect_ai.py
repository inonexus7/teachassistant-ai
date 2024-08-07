import requests
import json

def detect_ai(text):
  token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiOGI5NTgzZGUtNzIwMS00OWM5LWFmYWEtNjQ2NWNiNGI1NTFjIiwidHlwZSI6ImFwaV90b2tlbiJ9.RyahSIxusqsbISOzxFkcJdrgxn2rKoQFevjzuu01AIU"
  header = {
    "accept": 'application/json',
    'content-type': 'application/json',
    "authorization": f"Bearer {token}"
  }
  data = {
      "response_as_dict": True,
      "attributes_as_list": False,
      "show_original_response": False,
      "providers": 'originalityai',
      "text": text
  }
  response = requests.post(url="https://api.edenai.run/v2/text/ai_detection", json=data, headers=header)
  res_data = json.loads(response.text)
  return res_data

def check_plag(text):
  token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiOGI5NTgzZGUtNzIwMS00OWM5LWFmYWEtNjQ2NWNiNGI1NTFjIiwidHlwZSI6ImFwaV90b2tlbiJ9.RyahSIxusqsbISOzxFkcJdrgxn2rKoQFevjzuu01AIU"
  header = {
    "accept": 'application/json',
    'content-type': 'application/json',
    "authorization": f"Bearer {token}"
  }
  data = {
      "response_as_dict": True,
      "attributes_as_list": False,
      "show_original_response": False,
      "providers": 'winstonai',
      "text": text
  }
  response = requests.post(url="https://api.edenai.run/v2/text/plagia_detection", json=data, headers=header)
  res_data = json.loads(response.text)
  return res_data