import cv2
import os

DATASET_DIR = 'dataset'
os.makedirs(DATASET_DIR, exist_ok=True)

name = input("Enter Student name: ").strip()
if name == "":
    print("[ERROR] Name cannot be empty.")
    exit()

person_dir = os.path.join(DATASET_DIR, name)
os.makedirs(person_dir, exist_ok=True)

video = cv2.VideoCapture(0)
print("[INFO] Press 's' to capture and save face image, 'q' to quit.")

count = 0
while True:
    ret, frame = video.read()
    if not ret:
        continue

    cv2.imshow("Capture Face", frame)
    key = cv2.waitKey(1) & 0xFF

    if key == ord('s'):
        image_path = os.path.join(person_dir, f"{name}_{count}.jpg")
        cv2.imwrite(image_path, frame)
        print(f"[SAVED] Image saved to: {image_path}")
        count += 1

    elif key == ord('q'):
        print("[INFO] Exiting...")
        break

video.release()
cv2.destroyAllWindows()
