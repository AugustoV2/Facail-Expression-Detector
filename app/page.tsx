"use client";

import * as faceapi from "face-api.js";
import { useEffect, useRef } from "react";
import Webcam from "react-webcam";
import styles from "./WebcamStyles.module.css";

export default function Home() {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Load face-api.js models
  const loadModels = async () => {
    const MODEL_URL = "/models";
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
      faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
      faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
      faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
    ]);
  };

  // Function to start detection and drawing
  const startFaceDetection = async () => {
    if (webcamRef.current && canvasRef.current) {
      const video = webcamRef.current.video as HTMLVideoElement;
      const canvas = canvasRef.current;
      const displaySize = { width: video.videoWidth, height: video.videoHeight };

      // Adjust canvas size to match the video
      faceapi.matchDimensions(canvas, displaySize);

      // Run detection on a loop
      setInterval(async () => {
        if (video.readyState === 4) {
          const detections = await faceapi
            .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
            .withFaceExpressions();

          if (detections && detections.length > 0) {
            // Resize detections to match video size
            const resizedDetections = faceapi.resizeResults(detections, displaySize);

            // Clear the canvas for fresh drawings
            canvas.getContext("2d")?.clearRect(10, 50, canvas.width, canvas.height);

            // Draw detections and expressions
            faceapi.draw.drawDetections(canvas, resizedDetections);
            faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
          } else {
            // Optional: clear canvas if no faces are detected
            canvas.getContext("2d")?.clearRect(10, 50, canvas.width, canvas.height);
          }
        }
      }, 100); // Detection interval (100ms)
    }
  };

  useEffect(() => {
    const initialize = async () => {
      await loadModels();
      startFaceDetection();
    };
    initialize();
  }, []); // Only run once when the component mounts

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <Webcam
          audio={false}
          ref={webcamRef}
          className={styles.video}
          videoConstraints={{ facingMode: "user" }}
        />
        <canvas ref={canvasRef} className={styles.video} />
      </main>
    </div>
  );
}
