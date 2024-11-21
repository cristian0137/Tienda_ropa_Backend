from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root@localhost/db_tienda'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.secret_key= "cris"

db = SQLAlchemy()
CORS(app)