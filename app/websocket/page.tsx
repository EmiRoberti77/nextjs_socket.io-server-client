"use client";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
const socket_url = process.env.NEXT_PUBLIC_SOCKET_URL!;
interface WSSMessages {
  message: any;
}
const PING = '"message":"PING"';
const INTERVAL = 10000;
enum wsMsg {
  PING = "PING",
  PONG = "PONG",
}

const registerEndPoint =
  "https://hnazer5afk.execute-api.us-east-1.amazonaws.com/prod/connectionid";

export default function WebSocketPage() {
  const [messages, setMessages] = useState<WSSMessages[]>([]);
  const socketRef = useRef<WebSocket | null>(null);
  const pingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [id, setId] = useState<string>("1");
  const [site, setSite] = useState<string>("site1#channel1");
  const [connectionId, setConnectionId] = useState<string>("dfTeqforoAMCK-g=");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    createNewSocket();
    return () => {
      closeSocket();
      closeWindowConnetion();
    };
  }, []);

  const closeWindowConnetion = async () => {
    console.log("closing connection");
    try {
      const delEndPoint = `${registerEndPoint}?id=${id}&site=${site}`;
      const response = await fetch(delEndPoint, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.NEXT_PUBLIC_REGISTRATION_API_KEY!,
        },
      });
      const data = await response.json();
      console.log(data);
    } catch (err: any) {
      console.error(err.message);
    }
  };

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

      if (String(msg.message).includes(PING)) {
        console.log(msg.message);
      } else setMessages((prev) => [...prev, msg]);
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

  const registerChannel = async () => {
    const body = {
      id,
      site,
      connectionId,
      lastActiveStateDateTime: new Date().toISOString(),
    };

    const response = await fetch(registerEndPoint, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        "x-api-key": process.env.NEXT_PUBLIC_REGISTRATION_API_KEY!,
      },
      body: JSON.stringify(body),
    });

    if (response.status === 200)
      setMsg(response.body + " " + new Date().toISOString());
    else setMsg("failed to register");
  };

  return (
    <div>
      <div>{msg}</div>
      <div>
        <input
          type="text"
          onChange={(e) => setId(e.target.value)}
          placeholder="uid"
        />
        <input
          type="text"
          onChange={(e) => setSite(e.target.value)}
          placeholder="channel name"
        />
        <input
          type="text"
          onChange={(e) => setConnectionId(e.target.value)}
          placeholder="connection id"
        />
        <button onClick={registerChannel}>REGISTER TO SERVER</button>
      </div>
      <hr />
      <div>
        <button onClick={() => sendMessage(wsMsg.PONG)}>
          GET CONNECTION ID
        </button>
        <button onClick={() => connection("open")}>CONNECT</button>
        <button onClick={() => connection("close")}>CLOSE</button>
      </div>
      <hr />
      <div>
        {messages.map((msg, index) => (
          <li key={index}>{msg.message}</li>
        ))}
      </div>
      <hr />
    </div>
  );
}
