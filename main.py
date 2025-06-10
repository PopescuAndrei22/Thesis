from flask import Flask, render_template, request
from flask_socketio import SocketIO, emit
import time
from pipeline import process_reviews
from werkzeug.utils import secure_filename
import os
from utils.log_config import setup_logger
import logging
from nlp.llm import TopicSummarizer

logger = setup_logger(os.path.basename(__file__))

open("logs/app.log", "w").close()

UPLOAD_FOLDER = 'data'
ALLOWED_EXTENSIONS = {'csv', 'json'}

session_data = {
    "file1": {"filename": "", "emotion": "", "column": ""},
    "file2": {"filename": "", "emotion": "", "column": ""}
}

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
    mode = request.form.get('mode')
    emotion = request.form.get('emotion')
    file1 = request.files.get('file1')
    file2 = request.files.get('file2')
    
    column1 = request.form.get('column1')
    column2 = request.form.get('column2')

    print(mode, emotion)

    if not file1 or not allowed_file(file1.filename):
        return "Invalid or missing file", 400

    filename1 = secure_filename(file1.filename)
    path1 = os.path.join(app.config['UPLOAD_FOLDER'], filename1)
    file1.save(path1)
    session_data["file1"]["filename"] = filename1
    session_data["file1"]["emotion"] = emotion
    session_data["file1"]["column"] = column1

    if mode == 'compare':
        if not file2 or not allowed_file(file2.filename):
            return "Invalid or missing file", 400

        filename2 = secure_filename(file2.filename)
        path2 = os.path.join(app.config['UPLOAD_FOLDER'], filename2)
        file2.save(path2)

        session_data["file2"]["filename"] = filename2
        session_data["file2"]["emotion"] = emotion 
        session_data["file2"]["column"] = column2

        return render_template('compare.html', file1=filename1, file2=filename2)

    return render_template('results.html', file=filename1)

def get_analysis_data():
    filename = session_data["file1"]["filename"]
    emotion = session_data["file1"]["emotion"]
    column = session_data["file1"]["column"]

    result = process_reviews(filename, emotion, column)

    socketio.emit('update-results', result)

def get_comparasion_results():
    filename1 = session_data["file1"]["filename"]
    emotion1 = session_data["file1"]["emotion"]

    filename2 = session_data["file1"]["filename"]
    emotion2 = session_data["file1"]["emotion"]

    column1 = session_data["file1"]["column"]
    column2 = session_data["file2"]["column"]

    result1 = process_reviews(filename1, emotion1, column1)
    result2 = process_reviews(filename2, emotion2, column2)

    llm_summary_object = TopicSummarizer()
    llm_summary = llm_summary_object.generate_comparison(result1, result2)

    socketio.emit('update-comparasion', {'result1': result1, 'result2': result2, 'comparasion_text': llm_summary})

@socketio.on('start_analysis_backend')
def start_review_process():
    socketio.start_background_task(get_analysis_data)

@socketio.on('start_comparasion')
def start_comparasion():
    socketio.start_background_task(get_comparasion_results)

if __name__ == '__main__':
    socketio.run(app, debug=True)
