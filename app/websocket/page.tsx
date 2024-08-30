"use client";
import { useEffect, useRef, useState } from "react";
const socket_url = process.env.NEXT_PUBLIC_SOCKET_URL!;
interface WSSMessages {
  message: any;
}
const INTERVAL = 10000;
enum wsMsg {
  PING = "PING",
  PONG = "PONG",
}

export default function WebSocketPage() {
  const [messages, setMessages] = useState<WSSMessages[]>([]);
  const socketRef = useRef<WebSocket | null>(null);
  const pingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    createNewSocket();
    return () => {
      closeSocket();
    };
  }, []);

  const createNewSocket = () => {
    if (socketRef.current?.readyState === WebSocket.OPEN) return;

    socketRef.current = new WebSocket(socket_url);

    socketRef.current.addEventListener("open", (e) => {
      console.log(e, "connection open");
    });

    socketRef.current.addEventListener("message", (e) => {
      const msg: WSSMessages = {
        message: e.data,
      };
      console.log("msg", msg);
      setMessages((prev) => [...prev, msg]);
    });

    socketRef.current.addEventListener("close", () => {
      console.log("socket closed");
    });

    turnOnPing();
  };

  const closeSocket = () => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current?.close();
      console.log("socket closed");
    }
    socketRef.current = null;
    turnOffPing();
    setMessages((prev) => []);
  };

  const turnOnPing = () => {
    pingIntervalRef.current = setInterval(() => {
      sendMessage(wsMsg.PING);
    }, INTERVAL);
  };

  const turnOffPing = () => {
    if (pingIntervalRef.current) {
      clearInterval(pingIntervalRef.current);
      pingIntervalRef.current = null;
    }
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
        createNewSocket();
        break;
      case "close":
        closeSocket();
        break;
    }
  };
  return (
    <div>
      <button onClick={() => sendMessage(wsMsg.PONG)}>GET CONNECTION ID</button>
      <button onClick={() => connection("open")}>CONNECT</button>
      <button onClick={() => connection("close")}>CLOSE</button>
      {messages.map((msg, index) => (
        <li key={index}>{msg.message}</li>
      ))}
    </div>
  );
}
