"use client";
import React, { useMemo, useState } from "react";
import { io } from "socket.io-client";
const url = "http://localhost:4000";
const message = ["connected", "not connected"];
const CONNECT = "connect";

export default function Page() {
  const socket = useMemo(() => io(url), []);
  const [msg, setMsg] = useState(message[1]);

  socket.on(CONNECT, () => {
    console.log(message[0]);
    setMsg(message[0]);
    console.log(socket.id);
  });
  socket.on("message", (data) => {
    console.log(data);
  });

  return <div>{msg}</div>;
}
