
# **Face Detection and Expression Recognition Web Application**


This project utilizes face-api.js and TensorFlow.js to create a real-time face detection and expression recognition application in the browser. Using a webcam, the app automatically detects faces and displays the expressions (such as happy, sad, surprised, etc.) in real-time.

## Features

Real-time face detection
Real-time expression recognition
Webcam feed integration
Displays facial landmarks and expressions on a canvas
Models for Tiny Face Detector, Face Landmark, Face Recognition, and Face Expressions
## Demo
You can view a live demo of the project here: https://facail-expression-detector.vercel.app/

## Technologies Used
Next.js: React framework for building the user interface and server-side rendering
face-api.js: A powerful library for face detection and recognition
TensorFlow.js: A JavaScript library for training and deploying machine learning models in the browser
Webcam.js: Captures webcam feed for use in the application
## Installation
1. Clone the repository
bash
Copy code
git clone https://github.com/augustov2/face-detection-expression-recognition.git
cd face-detection-expression-recognition
2. Install dependencies
bash
Copy code
npm install
3. Start the development server
bash
## Copy code
```bash
npm run dev
```
Open http://localhost:3000 in your browser to view the app.

## Usage
Once the app is running, the webcam feed will automatically be displayed on the screen. The face-api.js models will be loaded, and the app will start detecting faces and expressions. The detected faces will be marked with bounding boxes, and the detected expressions will be displayed above them.

## Models
The following models are used for detecting faces and recognizing expressions:

TinyFaceDetector: Detects faces in the image or video feed.
FaceLandmark68Net: Detects key facial landmarks such as eyes, nose, and mouth.
FaceRecognitionNet: Recognizes faces for identity verification.
FaceExpressionNet: Recognizes expressions like happy, sad, angry, surprised, etc.
The models are loaded from the /models directory in the public folder.

## Contributing
Contributions are welcome! Feel free to fork this repository and submit pull requests with improvements or bug fixes.

## License
This project is licensed under the MIT License - see the LICENSE file for details.

Acknowledgments
face-api.js - A great library for face detection and recognition in the browser.
TensorFlow.js - A powerful library for running machine learning models in the browser.
Webcam.js - Used to capture the webcam feed.
