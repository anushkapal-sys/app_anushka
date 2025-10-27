import pandas as pd

# Simple score function — tune weights as needed
def score_item(row, method="multimodal"):
    if method == "popularity":
        return float(row.get("popularity", 0))
    if method == "proximity":
        return float(row.get("proximity", 0))
    # multimodal: popularity (40%), proximity (25%), image_score (35% scaled 0-100)
    pop = float(row.get("popularity", 0))
    prox = float(row.get("proximity", 0))
    img = float(row.get("image_score", 0)) * 100.0
    return 0.4 * pop + 0.25 * prox + 0.35 * img

def rerank_dataframe(df, method="multimodal", city=None, query=None, top_k=50):
    data = df.copy()
    if city:
        data = data[data["city"].str.lower() == city.lower()]
    # Very basic query filter: match query string to name or category or description
    if query:
        q = str(query).lower()
        mask = data.apply(lambda r: q in str(r.get("name","")).lower() 
                                or q in str(r.get("category","")).lower()
                                or q in str(r.get("description","")).lower(), axis=1)
        data = data[mask]
    if data.empty:
        # return top popular when filter yields nothing
        data = df.copy()
        if city:
            data = data[df["city"].str.lower() == city.lower()]
    data["score"] = data.apply(lambda r: score_item(r, method), axis=1)
    data = data.sort_values("score", ascending=False)
    return data.head(top_k)
