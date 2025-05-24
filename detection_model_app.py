from ultralytics import YOLO
import gradio as gr
import cv2

# Load all models once at start
models = {
    "Coconut Detection": YOLO(r'models\coconut\best.pt'),
    "Mango Detection": YOLO(r'models\mango\best.pt'),
    "Pest Detection": YOLO(r'models\pest\best.pt'),
    "Weed Detection": YOLO(r'models\weed\best.pt'),
}

# Inference function
def predict(model_choice, image):
    model = models[model_choice]
    results = model(image)
    annotated_image = results[0].plot()
    return annotated_image

# Gradio interface
interface = gr.Interface(
    fn=predict,
    inputs=[
        gr.Dropdown(choices=list(models.keys()), label="Select Model"),
        gr.Image(type="numpy", label="Upload Image")
    ],
    outputs=gr.Image(type="numpy", label="Detection Result"),
    title="Multi-Model YOLOv8 Detection API"
)

interface.launch(share=True)
