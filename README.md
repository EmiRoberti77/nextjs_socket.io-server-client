# WebSocket Next.js Project

This project is a Next.js application demonstrating how to implement WebSocket communication to maintain a real-time connection with a server. The project includes features like automatically sending ping messages to keep the connection alive, managing the WebSocket connection lifecycle, and handling real-time messages from the server.

Table of Contents

    1.	Introduction
    2.	Features
    3.	Installation
    4.	Usage
    5.	Code Structure
    6.	WebSocket Implementation
    7.	Learning Points
    8.	Contributing
    9.	License

# Introduction

This project showcases a simple implementation of a WebSocket client using Next.js. It is designed to help developers understand how to establish a WebSocket connection, handle incoming and outgoing messages, and manage the connection lifecycle in a React-based application.

# Features

    •	WebSocket Connection Management: Establish and close WebSocket connections using buttons in the UI.
    •	Automatic Keep-Alive Pings: Periodically send ping messages to the server to keep the connection alive.
    •	Real-Time Message Handling: Display incoming messages from the server in real-time.
    •	Connection State Management: Handle different WebSocket states such as open, close, and error.
    •	Environment Configuration: Use environment variables to manage WebSocket URL settings.

# Installation

To run this project locally, follow these steps:

1. Clone the Repository:

```bash
git clone https://github.com/your-username/websocket-nextjs.git
cd websocket-nextjs
```

2. Install Dependencies:
   Ensure you have Node.js installed, then run:

```bash
npm i
```

3. Environment Variables:
   Create a .env file in the root of your project and add the following:

```bash
NEXT_PUBLIC_SOCKET_URL=ws://your-websocket-server-url
```

4. Run the Development Server:
   Start the development server:

```bash
npm run dev
```

5. Open in Browser:
   goto http://localhost:3000/websocket to see the application in action.

Usage

    •	Connect to WebSocket Server: Click the “CONNECT” button to establish a WebSocket connection with the server.
    •	Send a Message: Click the “GET CONNECTION ID” button to send a “PONG” message to the server.
    •	Close Connection: Click the “CLOSE” button to terminate the WebSocket connection.
    •	View Messages: Incoming messages from the server will be displayed as a list on the page.

Code Structure

The main functionality is encapsulated in the WebSocketPage component located in pages/index.tsx. Here’s a breakdown of the key parts:

    •	State Management:
    •	messages: Holds an array of received messages from the server.
    •	References:
    •	socketRef: A useRef hook to store the WebSocket instance.
    •	pingIntervalRef: A useRef hook to manage the interval for sending ping messages.
    •	Effects:
    •	useEffect: Establishes and cleans up the WebSocket connection when the component mounts or unmounts.
    •	WebSocket Functions:
    •	createNewSocket(): Initializes a new WebSocket connection and sets up event listeners.
    •	closeSocket(): Closes the WebSocket connection and clears the ping interval.
    •	turnOnPing() and turnOffPing(): Manage the ping interval to keep the connection alive.
    •	sendMessage(msg: string): Sends a message to the WebSocket server.

WebSocket Implementation

The WebSocket client is set up using the standard WebSocket API available in modern browsers. Here are the core functions:

reating a New Socket Connection:

```typescript
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
    setMessages((prev) => [...prev, msg]);
  });
  socketRef.current.addEventListener("close", () => {
    console.log("socket closed");
  });
  turnOnPing();
};
```

Sending Messages and Managing Pings:

```typescript
const sendMessage = (msg: string) => {
  if (socketRef.current?.readyState !== WebSocket.OPEN) {
    console.log("Error: socket not open");
    return;
  }
  socketRef.current.send(
    JSON.stringify({ action: "sendMessage", message: msg })
  );
};

const turnOnPing = () => {
  pingIntervalRef.current = setInterval(() => {
    sendMessage(wsMsg.PING);
  }, INTERVAL);
};
```

Contributing

Contributions are welcome! If you have any improvements or suggestions, feel free to create an issue or submit a pull request.
