import face_recognition
import cv2
import pickle
import csv
from datetime import datetime
import os

ATTENDANCE_CSV = "attendance.csv"
ENCODINGS_FILE = "encodings/encodings.pkl"
MIN_CONFIDENCE = 0.6  

def init_csv():
    if not os.path.exists(ATTENDANCE_CSV):
        with open(ATTENDANCE_CSV, mode='w', newline='') as f:
            writer = csv.writer(f)
            writer.writerow(["Name", "Date", "Time", "Status"])


def load_known_faces():
    print("[INFO] Loading known faces...")
    try:
        with open(ENCODINGS_FILE, "rb") as f:
            data = pickle.load(f)
        print(f"[INFO] Loaded {len(data['names'])} known faces.")
        return data
    except Exception as e:
        print(f"[ERROR] Failed to load encodings: {str(e)}")
        exit()

def main():
    init_csv()
    data = load_known_faces()
    
    video_capture = cv2.VideoCapture(0)
    if not video_capture.isOpened():
        print("[ERROR] Could not open video source")
        exit()

    recognized_faces = set()
    print("[INFO] Starting recognition...")

    while True:
        ret, frame = video_capture.read()
        if not ret:
            continue
 
        rgb_frame = cv2.resize(frame[:, :, ::-1], (0, 0), fx=0.25, fy=0.25)
        face_locations = face_recognition.face_locations(rgb_frame)

        if face_locations:
            face_encodings = face_recognition.face_encodings(rgb_frame, face_locations)

            for (top, right, bottom, left), face_encoding in zip(face_locations, face_encodings):
               
                top *= 4
                right *= 4
                bottom *= 4
                left *= 4

            
                matches = face_recognition.compare_faces(data["encodings"], face_encoding, tolerance=0.6)
                name = "Unknown"

                if True in matches:
                    match_index = matches.index(True)
                    name = data["names"][match_index]

                    if name not in recognized_faces:
                        now = datetime.now()
                        with open(ATTENDANCE_CSV, mode='a', newline='') as f:
                            writer = csv.writer(f)
                            writer.writerow([name, now.date(), now.time().strftime("%H:%M:%S"), "Present"])
                        recognized_faces.add(name)
                        print(f"[ATTENDANCE] {name} logged at {now.time().strftime('%H:%M:%S')}")

                        video_capture.release()
                        cv2.destroyAllWindows()
                        return

               
                center_x = (left + right) // 2
                center_y = (top + bottom) // 2
                radius = (right - left) // 2
                cv2.circle(frame, (center_x, center_y), radius, (0, 255, 0), 2)

               
                cv2.putText(frame, name, (left, bottom + 25), cv2.FONT_HERSHEY_DUPLEX, 0.9, (0, 255, 0), 2)

        cv2.imshow('Face Recognition - Auto Exit on Recognition', frame)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    video_capture.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    main()
