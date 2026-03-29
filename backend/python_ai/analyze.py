import json
import sys


def basic_analysis(text: str):
    trimmed = " ".join(text.strip().split())
    if len(trimmed) > 1200:
        trimmed = trimmed[:1200] + "..."
    return {
        "topics": [],
        "summary": trimmed,
        "importantQuestions": []
    }


def main():
    text = sys.stdin.read()
    if not text:
        print("No text received")
        return

    # If you want OpenAI integration later, wire it here using OPENAI_API_KEY.
    # For now, return a safe placeholder analysis.
    print(json.dumps(basic_analysis(text)))


if __name__ == "__main__":
    main()
