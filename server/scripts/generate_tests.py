# from flask import Flask, request, jsonify
# from flask_cors import CORS
# import requests
# from dotenv import load_dotenv
# import os

# load_dotenv()
# print("✅ generate_tests.py started")
# app = Flask(__name__)
# CORS(app)

# API_URL = "https://api-inference.huggingface.co/models/Salesforce/codegen-2B-mono"

# API_TOKEN = os.getenv("HF_API_KEY")
# print("API Token:", os.getenv("HF_API_KEY"))
# headers = {"Authorization": f"Bearer {API_TOKEN}"}

# @app.route('/ping', methods=['GET'])
# def ping():
#     print("Received ping")
#     return jsonify({"message": "pong"})

# @app.route('/generate-tests', methods=['POST'])
# def generate_tests():
#     try:
#         data = request.get_json()
#         print("Received data:", data)
#         code = data.get('code')
#         if not code:
#             return jsonify({"error": "Code is required"}), 400

#         prompt = f"Generate 10 to 12 input-output test cases for the following function:\n\n{code}\n\nTest cases:"
#         response = requests.post(API_URL, headers=headers, json={"inputs": prompt})
#         print(response)
#         print("HF status code:", response.status_code)
#         print("HF raw response:", response.text)
#         result = response.json()

#         # Check for model loading error
#         if isinstance(result, dict) and "error" in result:
#             return jsonify({"error": "Model error", "details": result["error"]}), 500

#         return jsonify({"tests": result[0]['generated_text']})
#     except Exception as e:
#         print("Error in /generate-tests:", str(e))
#         return jsonify({"error": "Internal server error", "details": str(e)}), 500

# if __name__ == '__main__':
#     print("Starting Flask server...")
#     app.run(port=5001)
