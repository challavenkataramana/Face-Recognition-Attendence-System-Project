import face_recognition
import os
import pickle
from tqdm import tqdm
import cv2

dataset_dir = 'dataset'
encoding_file = 'encodings/encodings.pkl'
os.makedirs('encodings', exist_ok=True)

known_encodings = []
known_names = []

print("[INFO] Encoding faces...")

for name in tqdm(os.listdir(dataset_dir), desc="Processing People"):
    person_dir = os.path.join(dataset_dir, name)
    if not os.path.isdir(person_dir):
        continue

    for image_name in os.listdir(person_dir):
        image_path = os.path.join(person_dir, image_name)
        
        try:
            
            image = cv2.imread(image_path)
            if image is None:
                print(f"[WARNING] Could not read image: {image_path}")
                continue
                
            rgb_image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
            
            face_locations = face_recognition.face_locations(rgb_image)
            if not face_locations:
                print(f"[WARNING] No face found in {image_path}")
                continue
                
            encodings = face_recognition.face_encodings(rgb_image, face_locations)
            
            if encodings:
                known_encodings.append(encodings[0])
                known_names.append(name)
                
        except Exception as e:
            print(f"[ERROR] Failed to process {image_path}: {str(e)}")
            continue

if known_encodings:
    data = {"encodings": known_encodings, "names": known_names}
    try:
        with open(encoding_file, "wb") as f:
            pickle.dump(data, f)
        print(f"[SUCCESS] Saved {len(known_names)} face encodings to {encoding_file}")
    except Exception as e:
        print(f"[ERROR] Failed to save encodings: {str(e)}")
else:
    print("[ERROR] No valid face encodings were generated.")