import { Fab } from '@mui/material';
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import './VideoDisplay.css';
import RecordIcon from '@mui/icons-material/FiberManualRecord';
import SwapVertIcon from '@mui/icons-material/SwapVert';

type VideoDisplayProps = {
  apiUrl: string;
  checkInterval: number;
  videoPath?: string; // Optional path to a local video file
};

const VideoDisplay: React.FC<VideoDisplayProps> = ({ apiUrl, checkInterval, videoPath }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const cameraStream = useRef<MediaStream | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const videoTextureRef = useRef<THREE.VideoTexture | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const initThreeJS = async () => {
      if (!mountRef.current) return;
      // Create a video element (shared for both video file and camera feed)
      const videoElement = document.createElement("video");
      videoElement.autoplay = false;
      videoElement.muted = true;
      videoElement.loop = true;
      videoRef.current = videoElement;

      const scene = new THREE.Scene();
      sceneRef.current = scene;

      const camera = new THREE.PerspectiveCamera(
        75,
        mountRef.current!.clientWidth / mountRef.current!.clientHeight,
        0.1,
        1000
      );
      camera.position.z = 2;

      const renderer = new THREE.WebGLRenderer();
      renderer.setSize(
        mountRef.current!.clientWidth,
        mountRef.current!.clientHeight
      );
      mountRef.current!.appendChild(renderer.domElement);
      rendererRef.current = renderer;

      // Create a plane geometry for the video
      const geometry = new THREE.PlaneGeometry(4, 3);
      const videoTexture = new THREE.VideoTexture(videoElement);
      videoTexture.minFilter = THREE.LinearFilter;
      videoTexture.magFilter = THREE.LinearFilter;
      videoTexture.format = THREE.RGBAFormat;

      videoTextureRef.current = videoTexture;
      const material = new THREE.MeshBasicMaterial({ map: videoTexture });
      const plane = new THREE.Mesh(geometry, material);
      scene.add(plane);

      // Video setup: camera feed or video file
      const startVideo = async () => {
        if (videoPath) {
          // Use video file
          videoElement.src = videoPath;
          videoElement.play();
          return;
        }
        // Use live webcam feed
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
          });
          cameraStream.current = stream;
          videoElement.srcObject = stream;
          videoElement.play();
        } catch (error) {
          console.error("Error accessing webcam:", error);
        }
      };

      startVideo();

      // Animation loop
      const animate = () => {
        requestAnimationFrame(animate);
        if (videoTexture) videoTexture.needsUpdate = true;
        renderer.render(scene, camera);
      };
      animate();
      window.addEventListener('resize', () => {
        if (!mountRef.current) return;
        renderer.setSize(
          mountRef.current!.clientWidth,
          mountRef.current!.clientHeight
        );
      });
    };

    initThreeJS();

    // Cleanup function
    return () => {
      if (cameraStream.current) {
        cameraStream.current.getTracks().forEach((track) => track.stop());
      }
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.srcObject = null;
        videoRef.current.parentElement?.removeChild(videoRef.current);
      }
    };
  }, [videoPath]);

  useEffect(() => {
    const captureInterval = setInterval(() => {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      if (video && canvas) {
        const ctx = canvas.getContext("2d");
        if (ctx) {
          // Draw the current video frame onto the canvas
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

          // Get Base64 representation of the frame
          const base64Image = canvas.toDataURL("image/png");
          fetch(`${apiUrl}/pose`, {
            method: 'POST',
            mode: 'cors',
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ image: base64Image })
          }).catch(console.error)
        }
      }
    }, checkInterval);

    return () => clearInterval(captureInterval);
  }, [apiUrl, checkInterval]);

  return (
    <div style={{ display: 'flex', flexGrow: 1, position: 'relative' }} ref={mountRef}>
      <canvas ref={canvasRef} style={{ display: "none" }} />
      <div className="fab-wrapper">
        <div className="fab-inner">
          <Fab color="secondary">
            3D
          </Fab>
          <Fab color="secondary">
            <RecordIcon />
          </Fab>
          <Fab color="secondary" disabled={true}>
            <SwapVertIcon />
          </Fab>
        </div>
      </div>
    </div>
  );
};

export default VideoDisplay;
