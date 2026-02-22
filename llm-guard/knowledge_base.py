def load_data():
    with open("srec_data.txt", "r", encoding="utf-8") as f:
        text = f.read()

    docs = text.split("\n")
    docs = [d for d in docs if d.strip() != ""]
    return docs

documents = load_data()
