import cv2
import numpy as np
from ultralytics import YOLO
import base64
import os


class DiseasePredictor:
    def __init__(self):
        self._models = {}
        self._models["coconut"] = YOLO(
            r'disease_predictor\models\coconut\best.pt')
        self._models["mango"] = YOLO(r'disease_predictor\models\mango\best.pt')
        self._models["pest"] = YOLO(r'disease_predictor\models\pest\best.pt')
        self._models["weed"] = YOLO(r'disease_predictor\models\weed\best.pt')

    def process_image(self, image_data, model):
        # Decode base64 image
        encoded_data = image_data
        nparr = np.frombuffer(base64.b64decode(encoded_data), np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        padding = 40

        img = cv2.copyMakeBorder(
            img,
            top=padding,
            bottom=padding,
            left=padding,
            right=padding,
            borderType=cv2.BORDER_CONSTANT,
            value=(255, 255, 255)
        )

        # Run inference
        results = self._models[model].predict(img)

        for r in results:
            boxes = r.boxes
            for box in boxes:
                rect = [int(i) for i in box.xyxy[0].tolist()]
                conf = float(box.conf[0])
                cls = int(box.cls[0])
                name = self._models[model].names[cls]

                # print(rect)
                # label = f"{name}: {conf:.2f}"

                # label_pos = (rect[0], rect[1] - 10 if rect[1] -
                #              10 > 10 else rect[1] + 10)

                # (text_width, text_height), _ = cv2.getTextSize(
                #     label, cv2.FONT_HERSHEY_SIMPLEX, 0.7, 2)

                # cv2.rectangle(img, (label_pos[0] - 10, label_pos[1] - text_height - 10),
                #               (label_pos[0] + text_width + 10, label_pos[1] + 10), (0, 255, 0), -1)

                cv2.rectangle(
                    img, (rect[0], rect[1]), (rect[2], rect[3]), (0, 0, 255), 4)

                # cv2.putText(img, label, label_pos,
                #             cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 0), thickness=2)

        _, buffer = cv2.imencode('.jpg', img)

        img_base64 = base64.b64encode(buffer).decode('utf-8')
        data_uri = f"data:image/jpeg;base64,{img_base64}"

        return data_uri
