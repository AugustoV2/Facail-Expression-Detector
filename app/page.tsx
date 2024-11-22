"use client";

import * as faceapi from "face-api.js";
import { useRef } from "react";
import Webcam from "react-webcam";
import styles from './WebcamStyles.module.css';


export default function Home() {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const loadModels = async () => {
    const MODEL_URL = "/models";
    await Promise.all([
      faceapi.nets.tinyFaceDetector.load(MODEL_URL),
      faceapi.nets.faceExpressionNet.load(MODEL_URL),
    ]);
  };

  const faceDetectHandler = async () => {
    await loadModels();
    if (webcamRef.current && canvasRef.current) {
      const webcam = webcamRef.current.video as HTMLVideoElement;
      const canvas = canvasRef.current;
      webcam.width = webcam.videoWidth;
      webcam.height = webcam.videoHeight;
      canvas.width = webcam.videoWidth;
      canvas.height = webcam.videoHeight;
      const video = webcamRef.current.video;
      if (video) {
        const detectionsWithExpressions = await faceapi
          .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
          .withFaceExpressions();
        console.log(detectionsWithExpressions);
      }
    }
  };

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <Webcam audio={false} ref={webcamRef} className={styles.video} />
        <canvas ref={canvasRef} className={styles.video} />
        <button onClick={faceDetectHandler}>Click</button>
      </main>
    </div>
  );
}