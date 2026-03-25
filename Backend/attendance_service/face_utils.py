from deepface import DeepFace
import numpy as np
import os
import cv2


MODEL_NAME = "ArcFace"
DETECTOR  = "retinaface"   

THRESHOLD = 0.35


def preprocess_image(img_path: str) -> str:
    """
    Improve image quality before embedding:
    - Resize to standard size
    - Normalize brightness/contrast (CLAHE)
    Returns path to processed image (overwrites temp files, preserves originals)
    """
    img = cv2.imread(img_path)
    if img is None:
        return img_path

  
    lab = cv2.cvtColor(img, cv2.COLOR_BGR2LAB)
    l, a, b = cv2.split(lab)

    
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
    l = clahe.apply(l)

    lab = cv2.merge([l, a, b])
    processed = cv2.cvtColor(lab, cv2.COLOR_LAB2BGR)

    cv2.imwrite(img_path, processed)
    return img_path


def get_embedding(img_path: str):
    """
    Extract ArcFace embedding from image.
    - enforce_detection=True  → rejects images with no clear face
    - align=True              → normalizes face rotation/position before embedding
    """
    try:
        if not os.path.exists(img_path):
            print(f"[Embedding Error] File not found: {img_path}")
            return None

        preprocess_image(img_path)

        result = DeepFace.represent(
            img_path=img_path,
            model_name=MODEL_NAME,
            detector_backend=DETECTOR,
            enforce_detection=True,   
            align=True,               
            normalization="ArcFace",  
        )

        if not result:
            print("[Embedding Error] No face detected in image.")
            return None

        embedding = result[0]["embedding"]

       
        vec = np.array(embedding)
        norm = np.linalg.norm(vec)
        if norm == 0:
            return None
        return (vec / norm).tolist()

    except ValueError as e:
        print(f"[Embedding Error] Face not detected: {e}")
        return None
    except Exception as e:
        print(f"[Embedding Error] {e}")
        return None


def cosine_similarity(vec1, vec2) -> float:
    """
    Cosine similarity between two L2-normalized vectors.
    Since both are already normalized, this is just the dot product.
    Range: -1 to 1, higher = more similar
    """
    a = np.array(vec1)
    b = np.array(vec2)
    na, nb = np.linalg.norm(a), np.linalg.norm(b)
    if na == 0 or nb == 0:
        return 0.0
    return float(np.dot(a, b) / (na * nb))


def verify_face_embedding(stored_embedding, img_path: str, threshold: float = THRESHOLD) -> dict:
    """
    Compare stored embedding with live image.
    Returns a dict with:
      - matched (bool)
      - similarity (float)
      - confidence (str): "High / Medium / Low"
    """
    new_embedding = get_embedding(img_path)

    if new_embedding is None:
        return {"matched": False, "similarity": 0.0, "confidence": "No face detected"}

    if len(stored_embedding) != len(new_embedding):
        print(
            f"[Verify Error] Embedding dimension mismatch: "
            f"stored={len(stored_embedding)} new={len(new_embedding)}"
        )
        return {
            "matched": False,
            "similarity": 0.0,
            "confidence": "Embedding mismatch - please re-register face",
        }

    similarity = cosine_similarity(stored_embedding, new_embedding)
    matched = similarity >= threshold


    if similarity >= 0.55:
        confidence = "High"
    elif similarity >= threshold:
        confidence = "Medium"
    else:
        confidence = "Low"

    print(f"[Verify] Similarity: {similarity:.4f} | Matched: {matched} | Confidence: {confidence}")
    return {"matched": matched, "similarity": round(similarity, 4), "confidence": confidence}