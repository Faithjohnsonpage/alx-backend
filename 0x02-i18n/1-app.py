#!/usr/bin/env python3
"""This module sets up a basic Flask app with Babel for i18n"""
from flask import Flask, render_template, request
from flask_babel import Babel


class Config:
    """Config class"""
    LANGUAGES = ['en', 'fr']


app = Flask(__name__)
app.config.from_object(Config)
babel = Babel(app, locale_selector='en', timezone_selector="UTC")


@app.route("/")
def hello():
    """Implements a Hello World"""
    return render_template("1-index.html")


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
