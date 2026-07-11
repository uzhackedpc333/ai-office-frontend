import { useEffect, useState } from 'react';
import './App.css';

export default function App() {
  const [generatedCode, setGeneratedCode] = useState("");
  
  // Personajlarning boshlang'ich holati (Moslashtirilgan koordinatalar)
  const [boss, setBoss] = useState({ x: 120, y: 380, img: 'boss.png', speech: '' });
  const [architect, setArchitect] = useState({ x: 300, y: 195, img: 'worker1.png', speech: '' });
  const [developer, setDeveloper] = useState({ x: 450, y: 195, img: 'Julia_PC.png', speech: '' });
  const [qa, setQa] = useState({ x: 600, y: 195, img: 'worker2.png', speech: '' });

  useEffect(() => {
    const WS_URL = import.meta.env.VITE_WS_URL || "ws://localhost:8000/ws"; 
    const ws = new WebSocket(WS_URL);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.action === "chat") {
        if (data.character === "boss") setBoss(prev => ({ ...prev, speech: data.text }));
        if (data.character === "architect") setArchitect(prev => ({ ...prev, speech: data.text }));
        if (data.character === "developer") setDeveloper(prev => ({ ...prev, speech: data.text }));
        if (data.character === "qa") setQa(prev => ({ ...prev, speech: data.text }));
        
        // Pufakchani 4 soniyadan so'ng o'chirish
        setTimeout(() => {
          if (data.character === "boss") setBoss(prev => ({ ...prev, speech: '' }));
          if (data.character === "architect") setArchitect(prev => ({ ...prev, speech: '' }));
          if (data.character === "developer") setDeveloper(prev => ({ ...prev, speech: '' }));
          if (data.character === "qa") setQa(prev => ({ ...prev, speech: '' }));
        }, 4000);
      }

      if (data.action === "code_result") {
        setGeneratedCode(data.code);
      }
    };

    return () => ws.close();
  }, []);

  return (
    <div className="office-container">
      {/* 2D XARITA QISMI */}
      <div className="map-area">
        <div className="map-title">
          <span className="pulse-dot"></span> Antigravity AI Office
        </div>
        
        {/* Dekoratsiyalar */}
        <img src="/office-partitions-1.png" className="decoration" style={{ left: '80px', top: '280px', width: '350px' }} alt="Partition" />
        <img src="/desk.png" className="decoration" style={{ left: '100px', top: '400px', width: '100px' }} alt="Boss Desk" />
        
        {/* Uchta stul/stol kompyuter bilan (Moslashtirilgan koordinatalar) */}
        <img src="/desk-with-pc.png" className="decoration" style={{ left: '290px', top: '240px', width: '80px' }} alt="Architect Desk" />
        <img src="/desk-with-pc.png" className="decoration" style={{ left: '440px', top: '240px', width: '80px' }} alt="Developer Desk" />
        <img src="/desk-with-pc.png" className="decoration" style={{ left: '590px', top: '240px', width: '80px' }} alt="QA Desk" />

        {/* Boshqa ofis anjomlari */}
        <div className="lounge-area">
          <img src="/water-cooler.png" className="decoration" style={{ left: '750px', top: '150px', width: '40px' }} alt="Water Cooler" />
          <img src="/coffee-maker.png" className="decoration" style={{ left: '820px', top: '150px', width: '60px' }} alt="Coffee Maker" />
          <img src="/printer.png" className="decoration" style={{ left: '900px', top: '150px', width: '50px' }} alt="Printer" />
        </div>

        {/* Personajlar */}
        <div className="character boss-char" style={{ left: `${boss.x}px`, top: `${boss.y}px` }}>
          {boss.speech && <div className="speech-bubble">{boss.speech}</div>}
          <div className="character-label">Boss</div>
          <img src={`/${boss.img}`} alt="Boss" />
        </div>

        <div className="character" style={{ left: `${architect.x}px`, top: `${architect.y}px` }}>
          {architect.speech && <div className="speech-bubble">{architect.speech}</div>}
          <div className="character-label neon-text">Architect</div>
          <img src={`/${architect.img}`} alt="Architect" />
        </div>

        <div className="character" style={{ left: `${developer.x}px`, top: `${developer.y}px` }}>
          {developer.speech && <div className="speech-bubble">{developer.speech}</div>}
          <div className="character-label neon-text">Developer</div>
          <img src={`/${developer.img}`} alt="Developer" />
        </div>

        <div className="character" style={{ left: `${qa.x}px`, top: `${qa.y}px` }}>
          {qa.speech && <div className="speech-bubble">{qa.speech}</div>}
          <div className="character-label neon-text">QA Reviewer</div>
          <img src={`/${qa.img}`} alt="QA" />
        </div>
      </div>

      {/* CHAT VA KOD QISMI */}
      <div className="chat-panel">
        <div className="terminal-header">
          <div className="mac-buttons">
            <span></span><span></span><span></span>
          </div>
          <span className="terminal-title">System Terminal</span>
        </div>
        <p className="terminal-subtitle">AI tomonidan yozilgan kodlar shu yerda paydo bo'ladi...</p>
        <div className="code-display">
          {generatedCode || "Waiting for incoming task..."}
        </div>
      </div>
    </div>
  );
}