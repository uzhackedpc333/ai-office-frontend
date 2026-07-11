import { useEffect, useState } from 'react';
import './App.css';

export default function App() {
  const [generatedCode, setGeneratedCode] = useState("");
  
  // Personajlarning boshlang'ich holati
  const [boss, setBoss] = useState({ x: 100, y: 400, img: 'boss.png', speech: '' });
  const [architect, setArchitect] = useState({ x: 250, y: 200, img: 'worker1.png', speech: '' });
  const [developer, setDeveloper] = useState({ x: 380, y: 200, img: 'Julia.png', speech: '' });
  const [qa, setQa] = useState({ x: 510, y: 200, img: 'worker2.png', speech: '' });

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
        <div className="map-title">🏢 Antigravity AI Office Factory</div>
        
        {/* Dekoratsiyalar */}
        <img src="/office-partitions-1.png" className="decoration" style={{ left: '50px', top: '300px', width: '400px' }} alt="Partition" />
        <img src="/desk.png" className="decoration" style={{ left: '80px', top: '420px', width: '100px' }} alt="Boss Desk" />
        
        {/* Uchta stul/stol kompyuter bilan */}
        <img src="/desk-with-pc.png" className="decoration" style={{ left: '250px', top: '220px', width: '80px' }} alt="Architect Desk" />
        <img src="/desk-with-pc.png" className="decoration" style={{ left: '380px', top: '220px', width: '80px' }} alt="Developer Desk" />
        <img src="/desk-with-pc.png" className="decoration" style={{ left: '510px', top: '220px', width: '80px' }} alt="QA Desk" />

        {/* Boshqa ofis anjomlari */}
        <img src="/coffee-maker.png" className="decoration" style={{ left: '650px', top: '150px', width: '60px' }} alt="Coffee Maker" />
        <img src="/water-cooler.png" className="decoration" style={{ left: '720px', top: '150px', width: '40px' }} alt="Water Cooler" />
        <img src="/printer.png" className="decoration" style={{ left: '800px', top: '150px', width: '50px' }} alt="Printer" />

        {/* Personajlar */}
        <div className="character" style={{ left: `${boss.x}px`, top: `${boss.y}px` }}>
          {boss.speech && <div className="speech-bubble">{boss.speech}</div>}
          <img src={`/${boss.img}`} alt="Boss" />
        </div>

        <div className="character" style={{ left: `${architect.x}px`, top: `${architect.y}px` }}>
          {architect.speech && <div className="speech-bubble">{architect.speech}</div>}
          <div className="character-label">Architect</div>
          <img src={`/${architect.img}`} alt="Architect" />
        </div>

        <div className="character" style={{ left: `${developer.x}px`, top: `${developer.y}px` }}>
          {developer.speech && <div className="speech-bubble">{developer.speech}</div>}
          <div className="character-label">Developer</div>
          <img src={`/${developer.img}`} alt="Developer" />
        </div>

        <div className="character" style={{ left: `${qa.x}px`, top: `${qa.y}px` }}>
          {qa.speech && <div className="speech-bubble">{qa.speech}</div>}
          <div className="character-label">QA Reviewer</div>
          <img src={`/${qa.img}`} alt="QA" />
        </div>
      </div>

      {/* CHAT VA KOD QISMI */}
      <div className="chat-panel">
        <h2>System Terminal</h2>
        <p style={{ color: '#aaa', marginTop: '10px' }}>AI tomonidan yozilgan kodlar shu yerda paydo bo'ladi...</p>
        <div className="code-display">
          {generatedCode || "Topshiriq kutilmoqda..."}
        </div>
      </div>
    </div>
  );
}