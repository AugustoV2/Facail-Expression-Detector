"use client";

import * as faceapi from "face-api.js";
import { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import styles from './WebcamStyles.module.css';

export default function Home() {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isModelLoaded, setIsModelLoaded] = useState(false);

  // Load the models using face-api.js
  const loadModels = async () => {
    const MODEL_URL = "/models";
    try {
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL)
      ]);
      setIsModelLoaded(true);
      console.log("Models loaded successfully!");
    } catch (error) {
      console.error("Error loading models:", error);
    }
  };

  // Handle face detection and expression recognition
  const faceDetectHandler = async () => {
    if (!isModelLoaded) {
      await loadModels();
    }

    if (webcamRef.current && canvasRef.current) {
      const webcam = webcamRef.current.video as HTMLVideoElement;
      const canvas = canvasRef.current;

      // Ensure the canvas dimensions are correctly set based on webcam dimensions
      if (webcam.videoWidth && webcam.videoHeight) {
        webcam.width = webcam.videoWidth;
        webcam.height = webcam.videoHeight;
        canvas.width = webcam.videoWidth;
        canvas.height = webcam.videoHeight;
      }

      // Perform face detection and expression recognition
      const detectionsWithExpressions = await faceapi
        .detectAllFaces(webcam, new faceapi.TinyFaceDetectorOptions())
        .withFaceExpressions();

      // Clear previous canvas drawings if canvas exists
      const context = canvas.getContext("2d");
      if (context) {
        context.clearRect(0, 0, canvas.width, canvas.height);
      }

      // Match canvas and webcam display sizes
      const displaySize = { width: webcam.videoWidth, height: webcam.videoHeight };
      faceapi.matchDimensions(canvas, displaySize);

      // Draw detections and expressions on the canvas
      faceapi.draw.drawDetections(canvas, detectionsWithExpressions);
      faceapi.draw.drawFaceExpressions(canvas, detectionsWithExpressions);
    }
  };

  // Automatically detect faces and expressions every 100 milliseconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      faceDetectHandler();
    }, 100); // Adjust the interval as needed for smooth performance

    return () => clearInterval(intervalId); // Clear interval when component unmounts
  }, [isModelLoaded]);

  // Load models when component mounts
  useEffect(() => {
    loadModels();
  }, []);

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <Webcam audio={false} ref={webcamRef} className={styles.video} />
        <canvas ref={canvasRef} className={styles.canvas} />
      </main>
    </div>
  );
}
