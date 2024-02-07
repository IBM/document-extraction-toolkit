import os
import requests
import jwt
from urllib.parse import urlencode
from dotenv import load_dotenv, dotenv_values

# Replace with your actual PostgREST endpoint URL

# Replace with your actual JWT secret key
load_dotenv()
JWT_SECRET_KEY = os.getenv("PGRST_JWT_SECRET", None)
POSTGREST_URL = os.getenv("POSTGREST_URL", "http://localhost:3000")

# Generate a JWT token
def generate_jwt_token():
    payload = {
        'role': 'writer'
    }
    token = jwt.encode(payload, JWT_SECRET_KEY, algorithm='HS256')
    return token

def make_authenticated_request(table_name, method='GET', query_params=None, data=None):

    token = generate_jwt_token()
    headers = {
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
    }

    url = f"{POSTGREST_URL}/{table_name}"
    
    if query_params:
        query_string = urlencode(query_params)
        url = f"{url}?{query_string}"
    try:
        if method == 'GET':
            response = requests.get(url, headers=headers)
        elif method == 'DELETE':
            response = requests.delete(url, headers=headers)
        elif method == 'PUT':
            response = requests.put(url, headers=headers, json=data)
        elif method == 'PATCH':
            response = requests.patch(url, headers=headers, json=data)
        elif method == 'POST':
            response = requests.post(url, headers=headers, json=data)
        else:
            raise ValueError(f"Unsupported HTTP method: {method}")
              
        if response.status_code == 200:
            response_data = response.json()
            return response_data
        elif response.status_code == 201:
            return response.json()
        elif response.status_code == 400:
            print(response.content)
            response_data = response.json()
            raise ValueError(response_data.get('message', 'Bad Request'))
        elif response.status_code == 401:
            response_data = response.json()
            raise ValueError(response_data.get('message', 'Unauthorized'))
        elif response.status_code == 404:
            response_data = response.json()
            raise ValueError(response_data.get('message', 'Not Found'))
        else:
            raise ValueError(f"Request failed with status code: {response.status_code}")
    except requests.exceptions.RequestException as e:
        raise ValueError(f"Request failed: {str(e)}")
