#!/usr/bin/env python3
"""This module sets up a basic Flask app with Babel for i18n"""
from flask import Flask, render_template, request
from flask_babel import Babel


class Config(object):
    """Config class"""
    LANGUAGES = ['en', 'fr']
    BABEL_DEFAULT_LOCALE = 'en'
    BABEL_DEFAULT_TIMEZONE = 'UTC'


app = Flask(__name__)
app.config.from_object(Config)
babel = Babel(app)


@babel.localeselector
def get_locale():
    """Get locale from request"""
    return request.accept_languages.best_match(app.config['LANGUAGES'])


@app.route("/")
def hello():
    """Implements a Hello World"""
    return render_template("2-index.html")


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
