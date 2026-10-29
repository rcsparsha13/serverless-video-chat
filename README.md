# 🌐 Serverless Peer-to-Peer Video Chat

A browser-based video communication application built using **WebRTC, HTML, CSS, and JavaScript**. It enables two peers to establish a direct connection for video, audio, and text messaging without requiring a dedicated signaling server in the application.

## 📌 Project Overview

This project demonstrates peer-to-peer communication concepts from computer networks. It uses WebRTC to establish a connection between two browsers and provides an interactive dashboard for video streaming, text chat, and connection monitoring.

Peers exchange connection information manually using Session Description Protocol (SDP) JSON data.

## ✨ Features

- 📹 **Live Video Streaming:** Displays local and remote video feeds.
- 🎙️ **Audio Communication:** Captures audio through the browser's media devices.
- 💬 **Real-Time Text Chat:** Sends messages through a WebRTC DataChannel.
- 🔗 **Manual Signaling:** Exchanges SDP offer and answer data by copying and pasting JSON.
- 📡 **Connection Monitoring:** Displays peer connection and ICE gathering states.
- 📋 **Copy Utility:** Copies SDP connection data to the clipboard.
- 🛑 **Hang Up:** Closes the connection and releases local media tracks.
- 📱 **Responsive Layout:** Uses CSS Grid and flexible layouts to adapt the dashboard to different screen sizes.

## 🛠️ Technologies Used

- **HTML5** — Application structure
- **CSS3** — Dashboard layout and styling
- **JavaScript** — Application logic and event handling
- **WebRTC API** — Peer-to-peer audio, video, and data communication
- **STUN Server** — Helps discover network connectivity information

## ⚙️ How It Works

1. **Initialize Media:** The browser requests camera and microphone access.
2. **Create a Peer Connection:** A WebRTC `RTCPeerConnection` is initialized using a Google STUN server.
3. **Generate an Offer:** One peer creates an SDP offer and prepares a text DataChannel.
4. **Exchange SDP Data:** The peers manually copy and paste their SDP offer and answer.
5. **Establish Communication:** WebRTC attempts to establish a direct peer-to-peer connection.
6. **Exchange Messages:** Once the DataChannel opens, peers can send and receive text messages.
7. **Terminate the Session:** The Hang Up button closes the connection and stops local media tracks.

## 🚀 Getting Started

### Prerequisites

- A modern web browser with WebRTC support
- A working camera and microphone
- Camera and microphone permissions
- An HTTPS environment or a supported local development environment

### Run Locally

1. Clone or download this repository.
2. Keep `index.html` and `app.js` in the same directory.
3. Serve the files using a local web server or an HTTPS-hosted environment.
4. Open the application in your browser.
5. Allow camera and microphone access.
6. Open the application in two browser sessions and exchange SDP data manually to attempt a connection.

**Note:** Both peers must exchange the correct SDP information. Some network configurations may require additional connectivity support, such as a TURN server. This project currently configures a STUN server only.

## 🧠 Concepts Demonstrated

- Peer-to-peer networking
- WebRTC connection establishment
- Session Description Protocol (SDP)
- Interactive Connectivity Establishment (ICE)
- Media capture using `getUserMedia()`
- WebRTC DataChannels
- Event-driven JavaScript
- Resource cleanup and connection-state monitoring

## 🔮 Future Improvements

- Add a dedicated signaling mechanism to automate SDP exchange.
- Add TURN server support for networks where direct connectivity fails.
- Improve connection error handling and reconnection.
- Add support for multiple participants.
- Improve accessibility and mobile usability.


[GitHub Profile](https://github.com/rcsparsha13)

---

*An educational project demonstrating browser-based peer-to-peer communication and computer networking concepts.*
