from deepface import DeepFace
import numpy as np, os

MODEL_NAME = "VGG-Face"

def get_embedding(img_path: str):
    try:
        if not os.path.exists(img_path):
            return None
        result = DeepFace.represent(img_path=img_path, model_name=MODEL_NAME, enforce_detection=False)
        return result[0]["embedding"]
    except Exception as e:
        print(f"[Embedding Error] {e}")
        return None

def cosine_similarity(vec1, vec2):
    a, b = np.array(vec1), np.array(vec2)
    na, nb = np.linalg.norm(a), np.linalg.norm(b)
    if na == 0 or nb == 0:
        return 0.0
    return float(np.dot(a, b) / (na * nb))

def verify_face_embedding(stored_embedding, img_path, threshold=0.68):
    new_embedding = get_embedding(img_path)
    if new_embedding is None:
        return False
    similarity = cosine_similarity(stored_embedding, new_embedding)
    print(f"[Verify] Similarity: {similarity:.4f}")
    return similarity >= threshold