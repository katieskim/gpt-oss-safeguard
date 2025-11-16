"use client";

import { Mic, Square, Loader2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface AIVoiceInputProps {
  onRecordingComplete?: (audioBlob: Blob, duration: number) => void;
  onStart?: () => void;
  onStop?: (duration: number) => void;
  visualizerBars?: number;
  className?: string;
  disabled?: boolean;
}

export function AIVoiceInput({
  onRecordingComplete,
  onStart,
  onStop,
  visualizerBars = 48,
  className,
  disabled = false,
}: AIVoiceInputProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [time, setTime] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [audioLevels, setAudioLevels] = useState<number[]>(
    Array(visualizerBars).fill(0)
  );

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    setIsClient(true);
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
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
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Set up audio analysis for visualization
      audioContextRef.current = new AudioContext();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      source.connect(analyserRef.current);

      // Start visualization
      updateVisualization();

      // Set up media recorder
      const mediaRecorder = new MediaRecorder(stream);
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
        stream.getTracks().forEach((track) => track.stop());
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
        setAudioLevels(Array(visualizerBars).fill(0));
      };

      mediaRecorder.start();
      setIsRecording(true);
      onStart?.();
    } catch (err) {
      console.error("Error starting recording:", err);
      setError("Microphone access denied. Please allow microphone access.");
      setIsRecording(false);
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
      <div className="relative max-w-xl w-full mx-auto flex items-center flex-col gap-2">
        <button
          className={cn(
            "group w-16 h-16 rounded-xl flex items-center justify-center transition-all duration-300",
            disabled && "opacity-50 cursor-not-allowed",
            isRecording
              ? "bg-red-500/10 hover:bg-red-500/20 border-2 border-red-500"
              : "bg-purple-500/10 hover:bg-purple-500/20 border-2 border-purple-500/50"
          )}
          type="button"
          onClick={handleClick}
          disabled={disabled}
        >
          {isRecording ? (
            <Square className="w-6 h-6 text-red-500 fill-red-500" />
          ) : disabled ? (
            <Loader2 className="w-6 h-6 text-purple-500 animate-spin" />
          ) : (
            <Mic className="w-6 h-6 text-purple-500" />
          )}
        </button>

        <span
          className={cn(
            "font-mono text-sm transition-opacity duration-300",
            isRecording ? "text-red-500 font-semibold" : "text-slate-500"
          )}
        >
          {formatTime(time)}
        </span>

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
                    isRecording
                      ? "bg-purple-500"
                      : "bg-slate-700"
                  )}
                  style={{
                    height: `${height}%`,
                    opacity: isRecording ? 0.3 + level * 0.7 : 0.3,
                  }}
                />
              );
            })}
        </div>

        <p className="h-4 text-xs text-slate-400">
          {error
            ? error
            : isRecording
            ? "Recording... Click to stop"
            : "Click microphone to start recording"}
        </p>
      </div>
    </div>
  );
}

