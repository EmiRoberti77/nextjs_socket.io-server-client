"use client";
import { useEffect, useState } from "react";
const socket_url = process.env.NEXT_PUBLIC_SOCKET_URL!;

export default function WebSocketPage2() {
  const [isConnected, setIsConnected] = useState(false);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  useEffect(() => {
    console.log(socket_url);
    const ws = new WebSocket(socket_url);
    ws.addEventListener("open", (e) => {
      console.log(e, "connection open");
    });

    ws.addEventListener("message", (e) => {
      console.log(e.data);
    });

    setSocket(ws);
    return () => {
      console.log("closing socket");
      ws.close();
    };
  }, []);

  const sendMessage = () => {
    const message = {
      action: "sendMessage",
      message: "hello nextjs",
    };

    if (!socket) {
      console.log("socket null");
    }
    console.log(message);
    socket?.send(JSON.stringify(message));
  };
  return (
    <div>
      <button onClick={sendMessage}>SEND</button>
    </div>
  );
}
