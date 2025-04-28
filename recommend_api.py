from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import uvicorn
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Autoriser CORS pour ton front Angular
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Event(BaseModel):
    idEvent: int
    eventName: str
    description: str | None = None
    place: str | None = None

class RecommendationRequest(BaseModel):
    allEvents: List[Event]
    userEvents: List[Event]

@app.post("/recommend")
def recommend_events(data: RecommendationRequest):
    all_events = data.allEvents
    user_events = data.userEvents

    print(f"Received allEvents: {len(all_events)} events")
    print(f"Received userEvents: {len(user_events)} events")

    if not user_events:
        print("No user events, returning sorted event IDs")
        recommended_ids = [e.idEvent for e in sorted(all_events, key=lambda x: x.idEvent)]
        return {"recommendedEvents": recommended_ids[:5]}  # Limit to top 5 for new users

    # Combine eventName, description, and place, giving more weight to eventName
    corpus = [
        (e.eventName + " ") * 2 +  # Double weight for eventName
        (e.description or "") + " " +
        (e.place or "")
        for e in all_events
    ]
    user_corpus = [
        (e.eventName + " ") * 2 +
        (e.description or "") + " " +
        (e.place or "")
        for e in user_events
    ]

    print("Corpus created, computing TF-IDF")
    vectorizer = TfidfVectorizer(stop_words='english')
    tfidf_matrix = vectorizer.fit_transform(corpus + user_corpus)

    user_vector = tfidf_matrix[len(corpus):]
    all_vectors = tfidf_matrix[:len(corpus)]

    similarities = cosine_similarity(user_vector, all_vectors)
    avg_similarities = similarities.mean(axis=0)

    # Get indices of top 5 most similar events
    recommended_indices = avg_similarities.argsort()[::-1][:5]
    recommended_ids = [all_events[i].idEvent for i in recommended_indices]

    print(f"Recommended event IDs: {recommended_ids}")
    return {"recommendedEvents": recommended_ids}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)