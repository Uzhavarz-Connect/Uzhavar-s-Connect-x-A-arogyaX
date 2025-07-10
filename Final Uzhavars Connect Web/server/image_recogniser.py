import base64
from google import genai
from pydantic import BaseModel


class GGAIOutputPlantDetails(BaseModel):
    disease_name: str
    disease_effects: list[str]
    disease_solutions: list[str]


class GGAIMitigationDetails(BaseModel):
    products: list[str]


class GGAIOutput(BaseModel):
    category: str
    name: str
    is_available: bool
    plant_details: GGAIOutputPlantDetails | None
    mitigation_details: GGAIMitigationDetails | None
    description: str | None


class ImageRecogniser:
    def __init__(self, api_key="AIzaSyA7fQKCBtHPQUHGX1nZXDOWiJMlO31-uk8"):
        self._client = genai.Client(api_key=api_key)

    def recognise_plant(self, image_data) -> GGAIOutput:
        response = self._client.models.generate_content(
            model='gemini-1.5-flash',
            config={
                "response_mime_type": "application/json",
                "response_schema": GGAIOutput,
            },
            contents=[
                genai.types.Part.from_bytes(
                    data=base64.b64decode(image_data),
                    mime_type='image/jpeg',
                ),
                '''

Categorize the image as 'plant', 'weed' or 'pest'.

If the image is one of the afor mentioned, identify and provide the common name

If it is a plant, one of the following, 
    coconut
    mango
use this as common name and set is_available true boolean

If it is a plant, recognise any disease/infection/etc visually, provide the following details
- Name of disease
- Effects of the disease on the plant as list
- Solutions as list

If it is a weed or pest,
- Give a description in few sentences
- Also list mitigation details like pesticide or weedicide product names as a list only commercial chemical products no natural/homemade products.
- also set is_available true
'''
            ]
        )

        return response.parsed


if __name__ == '__main__':
    def encode_image(image_path):
        with open(image_path, "rb") as image_file:
            return base64.b64encode(image_file.read()).decode('utf-8')
    pr = ImageRecogniser()
    print(pr.recognise_plant(encode_image(
        "./disease_predictor/test images/test_2.jpg")))
