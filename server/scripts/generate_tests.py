import sys
import json
from transformers import pipeline

def main():
    input_code = sys.stdin.read()
    
    # Hugging Face inference (can be adjusted)
    generator = pipeline("text-generation", model="GoCodeo/TestCodeo")
    prompt = f"Write Python unit tests for the following function:\n{input_code}"
    result = generator(prompt, max_length=512, do_sample=True)[0]['generated_text']

    print(json.dumps({"tests": result}))

if __name__ == "__main__":
    main()
