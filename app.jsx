const handleEndCall = () => {
  webRTC.closeConnection();
  setLocalStream(null);
  setRemoteStream(null);
  setInCall(false);
};

// Add this to the JSX:
{inCall && (
  <VideoCall
    localStream={localStream}
    remoteStream={remoteStream}
    onEndCall={handleEndCall}
  />
)}
