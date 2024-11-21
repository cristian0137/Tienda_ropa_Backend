from flask import Flask,request,jsonify
from config.database import db,app

db.init_app(app)

with app.app_context():
    db.create_all()





@app.route("/")
def Hola():
    return "hola"

















if __name__ == "__main__":
    app.run(debug=True, host="0,0,0,0")

