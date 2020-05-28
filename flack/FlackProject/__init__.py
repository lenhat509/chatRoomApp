from FlackProject.config import Config
from flask import Flask
from flask_socketio import SocketIO

socketio = SocketIO()

def create_app(config=Config):
    app = Flask(__name__)
    app.config.from_object(config)
    socketio.init_app(app)

    from FlackProject.main.routes import main
    from FlackProject.errors.handlers import error
    app.register_blueprint(main)
    app.register_blueprint(error)
    return app