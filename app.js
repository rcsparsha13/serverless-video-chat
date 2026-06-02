const configuration = {
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
};

let peerConnection;
let localStream;
let remoteStream;
let dataChannel; // Variable to store the P2P data track

// DOM Elements
const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');
const startBtn = document.getElementById('startBtn');
const createOfferBtn = document.getElementById('createOfferBtn');
const acceptDataBtn = document.getElementById('acceptDataBtn');
const sdpData = document.getElementById('sdpData');

// Chat UI Elements
const chatBox = document.getElementById('chatBox');
const messageInput = document.getElementById('messageInput');
const sendMsgBtn = document.getElementById('sendMsgBtn');

// Helper function to display messages in the UI
function appendMessage(text, side) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('msg', side);
    msgDiv.innerText = text;
    chatBox.appendChild(msgDiv);
    chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll to bottom
}

// Set up event listeners on the Data Channel
function setupDataChannelListeners() {
    dataChannel.onopen = () => {
        console.log("Data channel is open and ready!");
        messageInput.disabled = false;
        sendMsgBtn.disabled = false;
        chatBox.innerHTML = `<div style="color: green; font-weight: bold;">✔ Direct P2P Data Channel Connected! Ready to chat.</div>`;
    };

    dataChannel.onclose = () => {
        console.log("Data channel closed.");
        messageInput.disabled = true;
        sendMsgBtn.disabled = true;
    };

    dataChannel.onmessage = (event) => {
        appendMessage(event.data, 'remote');
    };
}

// 1. Initialize Camera and Microphone
startBtn.onclick = async () => {
    try {
        localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localVideo.srcObject = localStream;
        
        peerConnection = new RTCPeerConnection(configuration);
        remoteStream = new MediaStream();
        remoteVideo.srcObject = remoteStream;

        localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));

        peerConnection.ontrack = (event) => {
            event.streams[0].getTracks().forEach(track => remoteStream.addTrack(track));
        };

        // PEER ROLE: Listen for the data channel opened by the Host
        peerConnection.ondatachannel = (event) => {
            dataChannel = event.channel;
            setupDataChannelListeners();
        };

        createOfferBtn.disabled = false;
        acceptDataBtn.disabled = false;
        startBtn.disabled = true;
        console.log("Camera and PeerConnection structure initialized.");
    } catch (err) {
        alert("Could not access camera/mic. Make sure you use localhost or HTTPS!");
        console.error(err);
    }
};

// 2. HOST ROLE: Create an Offer and establish Data Channel structure
createOfferBtn.onclick = async () => {
    // Host initializes the data channel explicitly before generating the offer
    dataChannel = peerConnection.createDataChannel("textChat");
    setupDataChannelListeners();

    peerConnection.onicecandidate = (event) => {
        if (!event.candidate) {
            sdpData.value = JSON.stringify(peerConnection.localDescription);
            alert("Offer SDP fully generated! Copy it and send it to your partner.");
        }
    };

    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
};

// 3. PROCESS PASTE (Handles receiving an Offer OR receiving an Answer)
acceptDataBtn.onclick = async () => {
    const rawInput = sdpData.value.trim();
    if (!rawInput) return alert("Please paste data into the textbox first!");

    try {
        const parsedData = JSON.parse(rawInput);

        if (parsedData.type === 'offer') {
            await peerConnection.setRemoteDescription(new RTCSessionDescription(parsedData));
            
            peerConnection.onicecandidate = (event) => {
                if (!event.candidate) {
                    sdpData.value = JSON.stringify(peerConnection.localDescription);
                    alert("Answer SDP generated! Copy it and send it back to the Host.");
                }
            };
            
            const answer = await peerConnection.createAnswer();
            await peerConnection.setLocalDescription(answer);
        } 
        else if (parsedData.type === 'answer') {
            await peerConnection.setRemoteDescription(new RTCSessionDescription(parsedData));
            alert("Answer applied! Direct P2P video stream and chat should start now.");
        }
    } catch (e) {
        alert("Invalid SDP Data. Please make sure you copied the entire text string.");
        console.error(e);
    }
};

// 4. Send message handler
function sendMessage() {
    const msg = messageInput.value.trim();
    if (msg && dataChannel && dataChannel.readyState === "open") {
        dataChannel.send(msg);
        appendMessage(msg, 'local');
        messageInput.value = "";
    }
}

sendMsgBtn.onclick = sendMessage;
messageInput.onkeypress = (e) => {
    if (e.key === 'Enter') sendMessage();
};