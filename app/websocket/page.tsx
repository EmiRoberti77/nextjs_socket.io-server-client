"use client";
import { useEffect, useState } from "react";
const socket_url = process.env.NEXT_PUBLIC_SOCKET_URL!;
interface WSSMessages {
  message: any;
}

export default function WebSocketPage() {
  const [isConnected, setIsConnected] = useState(false);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [messages, setMessages] = useState<WSSMessages[]>([]);
  useEffect(() => {
    console.log(socket_url);
    const ws = new WebSocket(socket_url);
    ws.addEventListener("open", (e) => {
      console.log(e, "connection open");
    });

    ws.addEventListener("message", (e) => {
      console.log(e.data);
      const msg: WSSMessages = {
        message: e.data,
      };
      setMessages((prev) => [...prev, msg]);
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
      {messages.map((msg, index) => (
        <li key={index}>{msg.message}</li>
      ))}
    </div>
  );
}
