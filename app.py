from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas as pd
import os
from reranker import rerank_dataframe

app = Flask(__name__)
CORS(app)

DATA_PATH = os.path.join(os.path.dirname(__file__), "data", "landmarks.csv")
if not os.path.exists(DATA_PATH):
    raise FileNotFoundError(f"Create a CSV at {DATA_PATH} based on the example provided.")

df = pd.read_csv(DATA_PATH)

# Data for the CityHighlights component, matching the frontend structure
cities_data = [
  {
    "name": "Tokyo",
    "country": "Japan",
    "description": "Experience the perfect blend of tradition and cutting-edge technology",
    "stats": { "tourists": "15M+", "rating": "4.9", "spots": "200+" },
    "color": "from-blue-500 to-purple-500"
  },
  {
    "name": "Singapore",
    "country": "Singapore",
    "description": "Explore Asia's most connected and innovative smart city hub",
    "stats": { "tourists": "19M+", "rating": "4.8", "spots": "150+" },
    "color": "from-cyan-500 to-blue-500"
  },
  {
    "name": "Dubai",
    "country": "UAE",
    "description": "Discover futuristic architecture and luxury meets innovation",
    "stats": { "tourists": "16M+", "rating": "4.9", "spots": "180+" },
    "color": "from-purple-500 to-pink-500"
  },
  {
    "name": "Barcelona",
    "country": "Spain",
    "description": "Navigate through centuries of culture with modern smart infrastructure",
    "stats": { "tourists": "12M+", "rating": "4.7", "spots": "220+" },
    "color": "from-orange-500 to-red-500"
  }
]

@app.route("/")
def home():
    return jsonify({"status": "ok", "message": "Smart City Tour Guide API running."})

@app.route("/api/landmarks", methods=["GET"])
def api_landmarks():
    """Return all landmarks or filter by city"""
    city = request.args.get("city")
    data = df
    if city:
        data = df[df["city"].str.lower() == city.lower()]
    return jsonify(data.to_dict(orient="records"))

@app.route("/api/cities", methods=["GET"])
def api_cities():
    """Return data for featured smart cities."""
    return jsonify(cities_data)

@app.route("/api/landmark/<int:lm_id>", methods=["GET"])
def api_landmark(lm_id):
    row = df[df["id"] == lm_id]
    if row.empty:
        return jsonify({"error": "Not found"}), 404
    return jsonify(row.iloc[0].to_dict())

@app.route("/api/recommendations", methods=["POST"])
def api_recommendations():
    """
    Request JSON:
    {
      "method": "multimodal"|"popularity"|"proximity",
      "city": "City name (optional)",
      "query": "search keyword (optional)",
      "top_k": 10
    }
    """
    req = request.get_json(force=True, silent=True) or {}
    method = req.get("method", "multimodal")
    city = req.get("city", None)
    query = req.get("query", None)
    top_k = int(req.get("top_k", 10))
    result_df = rerank_dataframe(df, method=method, city=city, query=query, top_k=top_k)
    return jsonify(result_df.to_dict(orient="records"))

# optional: accept feedback from frontend
@app.route("/api/feedback", methods=["POST"])
def api_feedback():
    payload = request.get_json(force=True, silent=True) or {}
    # In production: save to DB. For demo, we simply log
    print("FEEDBACK RECEIVED:", payload)
    return jsonify({"status": "ok"}), 201

if __name__ == "__main__":
    app.run(debug=True, port=5000)
