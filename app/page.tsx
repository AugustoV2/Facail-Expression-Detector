"use client";

import * as faceapi from "face-api.js";
import { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import styles from './WebcamStyles.module.css';

export default function Home() {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isModelLoaded, setIsModelLoaded] = useState(false);

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

  const faceDetectHandler = async () => {
    if (!isModelLoaded) {
      await loadModels();
    }

    if (webcamRef.current && canvasRef.current) {
      const webcam = webcamRef.current.video as HTMLVideoElement;
      const canvas = canvasRef.current;

      if (webcam.videoWidth && webcam.videoHeight) {
        webcam.width = webcam.videoWidth;
        webcam.height = webcam.videoHeight;
        canvas.width = webcam.videoWidth;
        canvas.height = webcam.videoHeight;
      }

      const detectionsWithExpressions = await faceapi
        .detectAllFaces(webcam, new faceapi.TinyFaceDetectorOptions())
        .withFaceExpressions();

      const context = canvas.getContext("2d");
      if (context) {
        context.clearRect(0, 0, canvas.width, canvas.height);
      }

      const displaySize = { width: webcam.videoWidth, height: webcam.videoHeight };
      faceapi.matchDimensions(canvas, displaySize);

      faceapi.draw.drawDetections(canvas, detectionsWithExpressions);
      faceapi.draw.drawFaceExpressions(canvas, detectionsWithExpressions);
    }
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      faceDetectHandler();
    }, 100);

    return () => clearInterval(intervalId);
  }, [isModelLoaded]);

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
