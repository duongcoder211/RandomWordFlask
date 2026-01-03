from flask import Flask, render_template, redirect, request
from flask_migrate import Migrate
from core import setting
from db import db
from api.endpoints import main_router

app = Flask(__name__) # => name of this file (app.py) not (main.py or anyname.py)

app.config["SQLALCHEMY_DATABASE_URI"] = setting.SQLALCHEMY_DATABASE_URI
app.secret_key = setting.SECRET_KEY

app.register_blueprint(main_router)

db.init_app(app=app)

migrate = Migrate(app=app, db=db)

# @app.route("/")
# def load_root():
#     return render_template("word.html")

# @app.route("/words/add", methods=["GET", "POST"])
# def add_word():
#     word_info = request.form.to_dict()
#     # word = Word()
#     print(word_info)
#     return "hello"

# @app.route("/words/<int:id>/update")
# def update_word():
#     pass

# @app.route("/words/<int:id>/delete")
# def delete_word():
#     pass

with app.app_context():
    # db.drop_all()
    # db.create_all()
    pass