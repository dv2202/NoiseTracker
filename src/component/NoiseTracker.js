import React, { useEffect, useState } from 'react';

const NoiseTracker = () => {
  const [noiseLevel, setNoiseLevel] = useState(0);

  useEffect(() => {
    let audioContext = null;
    let analyser = null;
    let stream = null;
    let animationFrameId = null;

    const getMediaStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioContext = new AudioContext();
        analyser = audioContext.createAnalyser();
        const source = audioContext.createMediaStreamSource(stream);
        source.connect(analyser);
        loop();
      } catch (error) {
        console.error('Error accessing microphone:', error);
      }
    };

    const loop = () => {
      analyser.fftSize = 32;
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      analyser.getByteFrequencyData(dataArray);

      let sum = 0;
      for (let i = 0; i < bufferLength; i++) {
        sum += dataArray[i];
      }

      const avg = sum / bufferLength;
      setNoiseLevel(avg);

      animationFrameId = requestAnimationFrame(loop);
    };

    getMediaStream();

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (audioContext) {
        audioContext.close();
      }
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    const threshold = 200; 
    if (noiseLevel > threshold) {
      alert('High noise level detected!');
     
    }
  }, [noiseLevel]);

  return (
    <div className='main-noise'>
      <p className='noise'>Noise Level: {noiseLevel}</p>
      <p className='disclaimer'>It will show alert when noise level will &gt; 200</p>
    </div>
  );
};

export default NoiseTracker;
