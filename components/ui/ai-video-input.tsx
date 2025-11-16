"use client";

import { Video, Square, Loader2, Camera } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface AIVideoInputProps {
  onRecordingComplete?: (audioBlob: Blob, duration: number) => void;
  onStart?: () => void;
  onStop?: (duration: number) => void;
  visualizerBars?: number;
  className?: string;
  disabled?: boolean;
}

export function AIVideoInput({
  onRecordingComplete,
  onStart,
  onStop,
  visualizerBars = 48,
  className,
  disabled = false,
}: AIVideoInputProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [time, setTime] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [audioLevels, setAudioLevels] = useState<number[]>(
    Array(visualizerBars).fill(0)
  );
  const [hasVideo, setHasVideo] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    setIsClient(true);
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isRecording) {
      intervalId = setInterval(() => {
        setTime((t) => t + 1);
      }, 1000);
    } else {
      setTime(0);
    }

    return () => clearInterval(intervalId);
  }, [isRecording]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const updateVisualization = () => {
    if (!analyserRef.current) return;

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);

    const step = Math.floor(dataArray.length / visualizerBars);
    const newLevels = Array(visualizerBars)
      .fill(0)
      .map((_, i) => {
        const index = i * step;
        return (dataArray[index] || 0) / 255;
      });

    setAudioLevels(newLevels);
    animationFrameRef.current = requestAnimationFrame(updateVisualization);
  };

  const startRecording = async () => {
    try {
      setError(null);
      
      // Get video and audio stream
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user"
        },
        audio: true
      });

      streamRef.current = stream;
      setHasVideo(true);

      // Display video in video element
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      // Set up audio analysis for visualization
      audioContextRef.current = new AudioContext();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      source.connect(analyserRef.current);

      // Start visualization
      updateVisualization();

      // Create audio-only stream for recording
      const audioTracks = stream.getAudioTracks();
      const audioStream = new MediaStream(audioTracks);

      // Set up media recorder with audio only
      const mediaRecorder = new MediaRecorder(audioStream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });
        
        const duration = time;
        
        // Clean up
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
        }
        if (videoRef.current) {
          videoRef.current.srcObject = null;
        }
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
        if (audioContextRef.current) {
          audioContextRef.current.close();
        }

        // Callbacks
        onStop?.(duration);
        onRecordingComplete?.(audioBlob, duration);
        
        setIsRecording(false);
        setHasVideo(false);
        setAudioLevels(Array(visualizerBars).fill(0));
      };

      mediaRecorder.start();
      setIsRecording(true);
      onStart?.();
    } catch (err) {
      console.error("Error starting recording:", err);
      setError("Camera/microphone access denied. Please allow access.");
      setIsRecording(false);
      setHasVideo(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }
  };

  const handleClick = () => {
    if (disabled) return;
    
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <div className={cn("w-full py-4", className)}>
      <div className="relative max-w-4xl w-full mx-auto flex items-center flex-col gap-4">
        {/* Video Preview */}
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-slate-900 border-2 border-slate-800">
          {hasVideo ? (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover scale-x-[-1]"
              />
              {/* Recording Indicator */}
              {isRecording && (
                <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-2 rounded-full bg-red-500/90 backdrop-blur-sm">
                  <div className="w-3 h-3 rounded-full bg-white animate-pulse" />
                  <span className="text-sm font-semibold text-white">REC</span>
                </div>
              )}
              {/* Timer */}
              {isRecording && (
                <div className="absolute top-4 right-4 px-3 py-2 rounded-full bg-black/70 backdrop-blur-sm">
                  <span className="text-sm font-mono font-semibold text-white">
                    {formatTime(time)}
                  </span>
                </div>
              )}
            </>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center space-y-4">
                <Camera className="w-16 h-16 text-slate-700 mx-auto" />
                <p className="text-slate-500 text-sm">
                  {error || "Click the button below to start"}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex flex-col items-center gap-3">
          <button
            className={cn(
              "group w-16 h-16 rounded-xl flex items-center justify-center transition-all duration-300",
              disabled && "opacity-50 cursor-not-allowed",
              isRecording
                ? "bg-red-500/10 hover:bg-red-500/20 border-2 border-red-500"
                : "bg-blue-500/10 hover:bg-blue-500/20 border-2 border-blue-500/50"
            )}
            type="button"
            onClick={handleClick}
            disabled={disabled}
          >
            {isRecording ? (
              <Square className="w-6 h-6 text-red-500 fill-red-500" />
            ) : disabled ? (
              <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
            ) : (
              <Video className="w-6 h-6 text-blue-500" />
            )}
          </button>

          {/* Audio Visualizer */}
          <div className="h-12 w-full max-w-md flex items-center justify-center gap-0.5">
            {isClient &&
              [...Array(visualizerBars)].map((_, i) => {
                const level = isRecording ? audioLevels[i] : 0;
                const height = 4 + level * 80;

                return (
                  <div
                    key={i}
                    className={cn(
                      "w-1 rounded-full transition-all duration-75",
                      isRecording ? "bg-blue-500" : "bg-slate-700"
                    )}
                    style={{
                      height: `${height}%`,
                      opacity: isRecording ? 0.3 + level * 0.7 : 0.3,
                    }}
                  />
                );
              })}
          </div>

          <p className="text-xs text-slate-400 text-center">
            {error
              ? error
              : isRecording
              ? "Recording video (audio only captured) • Click to stop"
              : "Click camera to start recording"}
          </p>
        </div>
      </div>
    </div>
  );
}

