const configuration = {
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
};

let peerConnection;
let localStream;
let remoteStream;
let dataChannel;

// UI Handlers
const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');
const startBtn = document.getElementById('startBtn');
const createOfferBtn = document.getElementById('createOfferBtn');
const acceptDataBtn = document.getElementById('acceptDataBtn');
const hangUpBtn = document.getElementById('hangUpBtn');
const copyBtn = document.getElementById('copyBtn');
const sdpData = document.getElementById('sdpData');

// Diagnostics & Chat Handlers
const connStateStatus = document.getElementById('connState');
const iceStateStatus = document.getElementById('iceState');
const chatBox = document.getElementById('chatBox');
const messageInput = document.getElementById('messageInput');
const sendMsgBtn = document.getElementById('sendMsgBtn');

function appendMessage(text, side) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('msg', side);
    msgDiv.innerText = text;
    chatBox.appendChild(msgDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Update Network Diagnostics Dashboard
function updateNetworkUIStats() {
    if (!peerConnection) return;
    
    connStateStatus.innerText = peerConnection.connectionState;
    if (peerConnection.connectionState === 'connected') {
        connStateStatus.className = "status-badge status-connected";
    } else if (peerConnection.connectionState === 'failed' || peerConnection.connectionState === 'closed') {
        connStateStatus.className = "status-badge";
        hangUp();
    } else {
        connStateStatus.className = "status-badge";
    }

    iceStateStatus.innerText = peerConnection.iceGatheringState;
}

function setupDataChannelListeners() {
    dataChannel.onopen = () => {
        messageInput.disabled = false;
        sendMsgBtn.disabled = false;
        chatBox.innerHTML = `<div style="color: green; font-weight: bold; font-size:13px;">✔ Direct SCTP Data Pipeline Secured.</div>`;
    };

    dataChannel.onclose = () => {
        messageInput.disabled = true;
        sendMsgBtn.disabled = true;
    };

    dataChannel.onmessage = (event) => {
        appendMessage(event.data, 'remote');
    };
}

// Wire state machines into tracking UI
function setupPeerConnectionListeners() {
    peerConnection.onconnectionstatechange = () => updateNetworkUIStats();
    peerConnection.onicegatheringstatechange = () => updateNetworkUIStats();

    peerConnection.ontrack = (event) => {
        event.streams[0].getTracks().forEach(track => remoteStream.addTrack(track));
    };

    peerConnection.ondatachannel = (event) => {
        dataChannel = event.channel;
        setupDataChannelListeners();
    };
}

// 1. Initialize Hardware Framework
startBtn.onclick = async () => {
    try {
        localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localVideo.srcObject = localStream;
        
        peerConnection = new RTCPeerConnection(configuration);
        remoteStream = new MediaStream();
        remoteVideo.srcObject = remoteStream;

        localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));
        setupPeerConnectionListeners();

        createOfferBtn.disabled = false;
        acceptDataBtn.disabled = false;
        hangUpBtn.disabled = false;
        startBtn.disabled = true;
        updateNetworkUIStats();
    } catch (err) {
        alert("Camera initialization failed. Ensure you are utilizing an active HTTPS environment!");
    }
};

// 2. Generate Host Configuration Architecture
createOfferBtn.onclick = async () => {
    dataChannel = peerConnection.createDataChannel("textChat");
    setupDataChannelListeners();

    peerConnection.onicecandidate = (event) => {
        if (!event.candidate) {
            sdpData.value = JSON.stringify(peerConnection.localDescription);
            copyBtn.disabled = false;
            alert("SDP Offer payload compiled fully.");
        }
    };

    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
};

// 3. Process SDP Bindings
acceptDataBtn.onclick = async () => {
    const rawInput = sdpData.value.trim();
    if (!rawInput) return alert("Pasted metadata context is empty!");

    try {
        const parsedData = JSON.parse(rawInput);

        if (parsedData.type === 'offer') {
            await peerConnection.setRemoteDescription(new RTCSessionDescription(parsedData));
            
            peerConnection.onicecandidate = (event) => {
                if (!event.candidate) {
                    sdpData.value = JSON.stringify(peerConnection.localDescription);
                    copyBtn.disabled = false;
                    alert("SDP Answer payload ready to pass back.");
                }
            };
            
            const answer = await peerConnection.createAnswer();
            await peerConnection.setLocalDescription(answer);
        } 
        else if (parsedData.type === 'answer') {
            await peerConnection.setRemoteDescription(new RTCSessionDescription(parsedData));
        }
    } catch (e) {
        alert("Payload analysis failure. Confirm absolute matching of block content.");
    }
};

// Copy Utility Feature
copyBtn.onclick = () => {
    sdpData.select();
    navigator.clipboard.writeText(sdpData.value);
    alert("Handshake payload written to device clipboard!");
};

// Chat Transmission Logic
function sendMessage() {
    const msg = messageInput.value.trim();
    if (msg && dataChannel && dataChannel.readyState === "open") {
        dataChannel.send(msg);
        appendMessage(msg, 'local');
        messageInput.value = "";
    }
}
sendMsgBtn.onclick = sendMessage;
messageInput.onkeypress = (e) => { if (e.key === 'Enter') sendMessage(); };

// 🛑 Graceful Teardown Engine (Hang Up Feature)
function hangUp() {
    console.log("Terminating peer tracks and structural pipelines cleanly.");

    // 1. Stop processing media frames completely across inputs
    if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
    }

    // 2. Erase bindings to data pipes
    if (dataChannel) {
        dataChannel.close();
    }

    // 3. Terminate main hardware socket state
    if (peerConnection) {
        peerConnection.close();
    }

    // 4. Clean out video viewport references
    localVideo.srcObject = null;
    remoteVideo.srcObject = null;

    // 5. Reset internal dashboard states
    connStateStatus.innerText = "closed";
    connStateStatus.className = "status-badge";
    iceStateStatus.innerText = "closed";
    iceStateStatus.className = "status-badge";
    
    // 6. Reset UI interactivity variables
    sdpData.value = "";
    chatBox.innerHTML = `<div style="color: #999; font-style: italic; font-size: 13px;">Connection terminated cleanly.</div>`;
    
    startBtn.disabled = false;
    createOfferBtn.disabled = true;
    acceptDataBtn.disabled = true;
    hangUpBtn.disabled = true;
    copyBtn.disabled = true;
    messageInput.disabled = true;
    sendMsgBtn.disabled = true;

    alert("P2P instance socket wiped and media resources released successfully!");
}
hangUpBtn.onclick = hangUp;
