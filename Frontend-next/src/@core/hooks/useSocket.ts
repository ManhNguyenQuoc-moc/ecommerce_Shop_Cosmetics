"use client";

import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

const SOCKET_SERVER_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export const useSocket = (room?: string, type: "product" | "admin" = "product") => {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Initialize socket
    socketRef.current = io(SOCKET_SERVER_URL, {
      withCredentials: true,
    });

    socketRef.current.on("connect", () => {
      setIsConnected(true);
      console.log("[Socket] Connected to server");

      if (type === "product" && room) {
        socketRef.current?.emit("join_product", room);
      } else if (type === "admin") {
        socketRef.current?.emit("join_admin");
      }
    });

    socketRef.current.on("disconnect", () => {
      setIsConnected(false);
      console.log("[Socket] Disconnected from server");
    });

    return () => {
      if (room && type === "product") {
        socketRef.current?.emit("leave_product", room);
      }
      socketRef.current?.disconnect();
    };
  }, [room, type]);

  const emit = (event: string, data: any) => {
    socketRef.current?.emit(event, data);
  };

  const on = (event: string, callback: (data: any) => void) => {
    socketRef.current?.on(event, callback);
  };

  const off = (event: string) => {
    socketRef.current?.off(event);
  };

  return { isConnected, socket: socketRef.current, emit, on, off };
};
