import os
import jwt
import json
import random
import requests
from werkzeug.exceptions import HTTPException
from flask import Flask, render_template, request, Response, redirect, url_for, send_from_directory, make_response

app = Flask(__name__)
app.config['SECRET_KEY'] = 'you-BRqPZkyPc4sk-will-wOlMRH6JpLzG5pe-never-Q0TsGjZW9-guess-heheHueHueBR'
app.config['SESSION_COOKIE_SECURE']  = True
app.config['SESSION_COOKIE_HTTPONLY'] = True
root_path = '/static'

@app.route('/signup', methods=['GET'])
def signup():
    return render_template(
        'signup.html',
        root=root_path
    )

@app.route('/enable-two-factor', methods=['GET'])
def enable_two_factor():
    qr_token = request.args.get('qr_token')
    if qr_token:
        return render_template(
            'signup-two-factor.html',
            root=root_path,
            qr_token=qr_token
        )
    else:
        return redirect(url_for('login'))

@app.route('/login', methods=['GET'])
def login():
    user_token = request.cookies.get('user_token')
    try:
        jwt_payload = jwt.decode(user_token, verify=False)
        if jwt_payload['authenticated']:
            response = redirect(url_for('home'))
        elif not jwt_payload['authenticated']:
            response = make_response(render_template('login-two-factor.html', root=root_path))
        return response
    except:
        pass

    return render_template(
        'login.html',
        root=root_path
    )

@app.route('/session', methods=['POST'])
def session():
    try:
        encoded = request.form['user_token']
        jwt_payload = jwt.decode(encoded, verify=False)
        if not jwt_payload['authenticated']:
            response = redirect(url_for('login'))
            # 
        elif jwt_payload['authenticated']:
            response = redirect(url_for('home'))
        
        response.set_cookie('user_token', encoded)
        return response
    except:
        pass

    response = redirect(url_for('login'))
    response.set_cookie('user_token', '', expires=0)
    return response

@app.route('/verify-authentication', methods=['GET'])
def verify_authentication():
    response = render_template('login-two-factor.html', root=root_path)
    return response 

@app.route('/home', methods=['GET'])
def home():
    headers = {'Authorization': f'Bearer {request.cookies.get("user_token")}'}
    req = requests.get('https://api-pokedex-pedrocosta.herokuapp.com/pokemon', headers = headers)
    if req.status_code == 401:
        response = redirect(url_for('login'))
        response.set_cookie('user_token', '', expires=0)
        return response
    
    data = req.text
    return render_template(
        'table-datatable.html',
        root=root_path,
        data = json.loads(data)
    )

@app.errorhandler(HTTPException)
def handle_exception(e):
    return redirect(url_for('login'))

if(__name__ == '__main__'):
    app.run(debug=True, port=5000)

