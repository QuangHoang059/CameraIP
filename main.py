

from flask import Flask, request, jsonify
import cv2
import cvzone
from ultralytics import YOLO
import math
from flask_cors import CORS
import base64
import os

model = YOLO('weight/yolov8n.pt')

app = Flask(__name__)

cors = CORS(app)


# @app.route("/")
# def test():
#     cap = cv2.VideoCapture("public/sour/alpaca.mp4")
#     _, img = cap.read()
#     image_data = cv2.imencode('.jpg', img)[1].tobytes()
#     encoded_image = base64.b64encode(image_data).decode('utf-8')
#     dataimage = {'image': f'data:image/jpeg;base64,{encoded_image}'}
#     return jsonify(dataimage)


@app.route('/', methods=['POST'])
def load():
    linkvideo = request.get_json()
    linkvideo = linkvideo["data"]
    linkvideo = os.path.join(linkvideo)
    cap = cv2.VideoCapture(linkvideo)
    _, img = cap.read()
    if img is None:
        jsonify("324")
    results = model(img)[0]

    for result in results.boxes.data.tolist():
        x1, y1, x2, y2, score, class_id = result
        curenclass = model.model.names[int(class_id)]
        if curenclass == 'person' and score > 0.6:
            x1, y1, x2, y2 = int(x1), int(y1), int(x2), int(y2)
            w, h = x2-x1, y2-y1
            cvzone.cornerRect(img, (x1, y1, w, h))
            score = math.ceil(score*100)/100
            cv2.putText(img, f'{curenclass}  {score}', (x1, y1 - 10),
                        cv2.FONT_HERSHEY_SIMPLEX, 1.3, (0, 255, 0), 3, cv2.LINE_AA)
    image_data = cv2.imencode('.jpg', img)[1].tobytes()
    encoded_image = base64.b64encode(image_data).decode('utf-8')
    dataimage = {'image': f'data:image/jpeg;base64,{encoded_image}'}
    return jsonify(dataimage)


if __name__ == "__main__":
    app.run(debug=True)
