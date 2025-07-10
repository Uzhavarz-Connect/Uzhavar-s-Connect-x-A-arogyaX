# app.py
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from disease_predictor.disease_predictor import DiseasePredictor
import poi_handler
import ngo_handler
from image_recogniser import ImageRecogniser
from field_tests.field_tests_handler import FieldTestsHandler
from googletrans import Translator


LANGUAGES = {
    'Bengali': 'bn',
    'Gujarati': 'gu',
    'Hindi': 'hi',
    'Kannada': 'kn',
    'Malayalam': 'ml',
    'Marathi': 'mr',
    'Nepali': 'ne',
    'Punjabi': 'pa',
    'Telugu': 'te',
    'Urdu': 'ur',
    'Arabic': 'ar',
    'English': 'en',
    'Tamil': 'ta',
    'French': 'fr',
    'German': 'de',
    'Italian': 'it',
    'Japanese': 'ja',
    'Korean': 'ko',
    'Russian': 'ru',
    'Spanish': 'es',
    'Chinese': 'zh-CN'
}

app = Flask(__name__)
CORS(app, supports_credentials=True)

disease_pred = DiseasePredictor()
plant_recogniser = ImageRecogniser()
field_test_handler = FieldTestsHandler()
translator = Translator()


async def translate(texts, to):
    td = await translator.translate(
        texts, src='en', dest=to)
    return [i.text for i in td]


@app.route('/disease/detect', methods=['POST'])
async def detect():
    if 'image' not in request.json:
        return jsonify({'error': 'No image provided'}), 400

    image_data = request.json['image']
    lang = request.json['lang']

    result = plant_recogniser.recognise_plant(image_data)

    output = {'type': result.category}
    if result.is_available:
        out_b64 = disease_pred.process_image(
            image_data, result.name if result.category == 'plant' else result.category)
        output['image'] = out_b64
    output['name'] = result.name
    if result.category == 'plant':
        output['disease_name'] = result.plant_details.disease_name
        output['disease_effects'] = await translate(
            result.plant_details.disease_effects, LANGUAGES[lang])
        output['disease_solutions'] = await translate(
            result.plant_details.disease_solutions, LANGUAGES[lang])
    else:
        output['description'] = await translate(
            [result.description], LANGUAGES[lang])
        output['mitigation'] = result.mitigation_details.products
    return jsonify(output)


@app.route('/ft')
def api_get_ft_content():
    title = request.args.get('title')
    return jsonify({'result': field_test_handler.get_content(title)})


@app.route('/ngos/states')
def api_get_states():
    return jsonify(ngo_handler.get_states())


@app.route('/ngos/states/<state_value>/districts')
def api_get_state_districts(state_value):
    return jsonify(ngo_handler.get_districts(state_value))


@app.route('/ngos/sectors')
def api_get_sectors():
    return jsonify(ngo_handler.get_sectors())


@app.route('/ngos/search')
def api_search():
    state = request.args.get('state')
    district = request.args.get('district')
    sectors = request.args.get('sectors')
    return jsonify(ngo_handler.get_ngos(state, district, None if not sectors else ((sectors,) if ',' not in sectors else sectors.split(','))))


@app.route('/gmaps/nearbyplaces')
def api_nearbyplaces():
    location = request.args.get('location')
    place = request.args.get('place')
    return jsonify(poi_handler.get_nearby_places(location, place))


@app.route('/gmaps/nearbyplaces/details')
def api_nearbyplacedetails():
    place_id = request.args.get('place_id')
    data = poi_handler.get_nearby_place_details(place_id)
    return jsonify(data)


@app.route('/gmaps/routes')
def api_distancematrix():
    origin = request.args.get('origin')
    destination = request.args.get('dest')
    return jsonify(poi_handler.get_distance_matrix(origin, destination))


if __name__ == '__main__':
    app.run(debug=True)
