from flask import Blueprint, render_template


main = Blueprint('main', __name__)

@main.route("/")
def home():
    return render_template("index.html")

@main.route("/dice")
def dice():
    return render_template("pDice.html")

@main.route("/map")
def map():
    return render_template("pMap.html")
