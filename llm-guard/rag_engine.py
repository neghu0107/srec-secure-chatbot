import faiss
import pickle
from sentence_transformers import SentenceTransformer

model = SentenceTransformer("all-MiniLM-L6-v2")

# ---------- TRAIN ----------
def train():
    with open("data/srec.txt", "r", encoding="utf-8") as f:
        text = f.read()

    chunks = text.split("\n")
    chunks = [c.strip() for c in chunks if len(c) > 50]

    embeddings = model.encode(chunks)

    index = faiss.IndexFlatL2(len(embeddings[0]))
    index.add(embeddings)

    with open("data/index.pkl", "wb") as f:
        pickle.dump((index, chunks), f)

    print("Training complete")

# ---------- QUERY ----------
def get_answer(query):
    with open("data/index.pkl", "rb") as f:
        index, chunks = pickle.load(f)

    q_emb = model.encode([query])
    D, I = index.search(q_emb, 3)

    results = [chunks[i] for i in I[0]]
    return "\n".join(results)
