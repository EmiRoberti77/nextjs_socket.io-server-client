"use client";
import { useEffect, useState } from "react";
const socket_url = process.env.NEXT_PUBLIC_SOCKET_URL!;

export default function WebSocketPage() {
  const [isConnected, setIsConnected] = useState(false);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  useEffect(() => {
    console.log(socket_url);
    const ws = new WebSocket(socket_url);
    ws.onopen = () => {
      console.log("socket opened");
      setIsConnected(true);
    };
    // ws.onclose = () => {
    //   console.log("connection closed");
    //   setIsConnected(false);
    // };
    ws.onmessage = (message) => {
      console.log(message.data);
    };
    ws.onerror = (error) => {
      console.log(error);
    };
    setSocket(ws);
    return () => {
      ws.close();
    };
  }, []);
  const sendMessage = () => {
    const message = {
      action: "sendMessage",
      connectionId: "",
      message: "hello nextjs",
    };
  };
  return (
    <div>
      <button></button>
    </div>
  );
}
