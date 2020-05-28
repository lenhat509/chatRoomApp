from flask import Blueprint, render_template

error = Blueprint('error', __name__)

@error.app_errorhandler(404)
def error_404(error):
    return render_template('errors/404.html', title='404'), 404

@error.app_errorhandler(403)
def error_403(error):
    return render_template('errors/403.html', title='403'), 403

@error.app_errorhandler(500)
def error_500(error):
    return render_template('errors/500.html', title='500'), 500