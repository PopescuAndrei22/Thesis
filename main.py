from flask import Flask, render_template, request
from flask_socketio import SocketIO, emit
import time
from pipeline import process_reviews
from werkzeug.utils import secure_filename
import os

UPLOAD_FOLDER = 'data'
ALLOWED_EXTENSIONS = {'csv', 'json'}

filename_POST = ""
emotionType_POST = ""

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
socketio = SocketIO(app, async_mode='eventlet')

@app.route('/')
def index():
    return render_template('index.html')

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/', methods=['POST'])
def upload_file():
    global filename_POST
    global emotionType_POST
    if request.method == 'POST':
        file = request.files.get('file')
        emotion = request.form.get('emotion')
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            filename_POST = filename
            emotionType_POST = emotion
            return render_template('results.html')

def get_analysis_data():
    result = process_reviews(filename_POST, emotionType_POST)

    socketio.emit('update-results', result)

@socketio.on('start_analysis_backend')
def start_review_process():
    socketio.start_background_task(get_analysis_data)

if __name__ == '__main__':
    socketio.run(app, debug=True)
