from flask import Flask, escape, request
from flask_cors import CORS
import json

app = Flask(__name__)
CORS(app)

@app.route('/', methods=["POST"])
def hello():
    print("efdfuscu")
    print(request)
    print(json.dumps(request.json))
    return 'OK'
