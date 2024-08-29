"use client";
import Node from "postcss/lib/node";
import { useEffect, useRef, useState } from "react";
const socket_url = process.env.NEXT_PUBLIC_SOCKET_URL!;
interface WSSMessages {
  message: any;
}

export default function WebSocketPage() {
  const [messages, setMessages] = useState<WSSMessages[]>([]);
  const socketRef = useRef<WebSocket | null>(null);
  const pingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    console.log(socket_url);
    socketRef.current = new WebSocket(socket_url);
    socketRef.current.addEventListener("open", (e) => {
      console.log(e, "connection open");
    });

    socketRef.current.addEventListener("message", (e) => {
      console.log(e.data);
      const msg: WSSMessages = {
        message: e.data,
      };
      setMessages((prev) => [...prev, msg]);
    });

    turnOnPing();

    return () => {
      if (socketRef.current?.readyState === WebSocket.OPEN) {
        socketRef.current?.close();
        console.log("socket closed");
      }
    };
  }, []);

  const turnOnPing = () => {
    pingIntervalRef.current = setInterval(() => {
      sendMessage("ping");
    }, 5000);
  };

  const sendMessage = (msg: string) => {
    const message = {
      action: "sendMessage",
      message: msg,
    };

    if (socketRef.current?.readyState !== WebSocket.OPEN) {
      console.log("Error:socket not open");
      return;
    }
    console.log(message);
    socketRef.current.send(JSON.stringify(message));
  };

  const connection = (state: "open" | "close") => {
    console.log(state);
    switch (state) {
      case "open":
        if (socketRef.current?.readyState !== WebSocket.OPEN) {
          socketRef.current = new WebSocket(socket_url);
          turnOnPing();
        }
        break;
      case "close":
        if (socketRef.current?.readyState === WebSocket.OPEN) {
          socketRef.current.close();
          pingIntervalRef.current = null;
          setMessages([]);
        }
        break;
    }
  };
  return (
    <div>
      <button onClick={() => sendMessage("pong")}>SEND</button>
      <button onClick={() => connection("open")}>CONNECT</button>
      <button onClick={() => connection("close")}>CLOSE</button>
      {messages.map((msg, index) => (
        <li key={index}>{msg.message}</li>
      ))}
    </div>
  );
}
