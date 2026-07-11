import { useEffect, useState } from 'react';
import './App.css';

export default function App() {
  const [generatedCode, setGeneratedCode] = useState("");
  
  // Personajlarning boshlang'ich holati
  const [julia, setJulia] = useState({ 
    x: 250, 
    y: 200, 
    img: 'Julia_PC.png', 
    speech: '' 
  });
  
  const [boss, setBoss] = useState({ 
    x: 100, 
    y: 400, 
    img: 'boss.png', 
    speech: '' 
  });

  useEffect(() => {
    // Vercel uchun WebSocket URL (Environment orqali yoki to'g'ridan-to'g'ri yozish)
    // Mahalliy test uchun: ws://localhost:8000/ws
    // Railway uchun: wss://SIZNING-RAILWAY-LOYIHANGIZ.railway.app/ws
    const WS_URL = import.meta.env.VITE_WS_URL || "ws://localhost:8000/ws"; 
    const ws = new WebSocket(WS_URL);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.action === "chat") {
        if (data.character === "Boss") setBoss(prev => ({ ...prev, speech: data.text }));
        if (data.character === "Julia") setJulia(prev => ({ ...prev, speech: data.text }));
        
        // Pufakchani 4 soniyadan so'ng o'chirish
        setTimeout(() => {
          setBoss(prev => ({ ...prev, speech: '' }));
          setJulia(prev => ({ ...prev, speech: '' }));
        }, 4000);
      }

      if (data.action === "move") {
        if (data.character === "Julia") {
          // Kofe apparatiga borish
          if (data.destination === "coffee_maker") {
            setJulia(prev => ({ ...prev, x: 500, y: 150, img: 'Julia_walk_Rigth.png' }));
          }
          // Stolga qaytish
          if (data.destination === "desk") {
            setJulia(prev => ({ ...prev, x: 250, y: 200, img: 'Julia_walk_Left.png' }));
          }
        }
      }

      if (data.action === "sprite") {
        if (data.character === "Julia") setJulia(prev => ({ ...prev, img: data.image }));
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
        <div className="map-title">🏢 Antigravity AI Office</div>
        
        {/* Dekoratsiyalar (Koordinatalari moslashtirilgan) */}
        <img src="/office-partitions-1.png" className="decoration" style={{ left: '50px', top: '300px', width: '300px' }} alt="Partition" />
        <img src="/desk.png" className="decoration" style={{ left: '80px', top: '420px', width: '100px' }} alt="Boss Desk" />
        <img src="/desk-with-pc.png" className="decoration" style={{ left: '250px', top: '220px', width: '80px' }} alt="Julia Desk" />
        <img src="/coffee-maker.png" className="decoration" style={{ left: '550px', top: '150px', width: '60px' }} alt="Coffee Maker" />
        <img src="/water-cooler.png" className="decoration" style={{ left: '620px', top: '150px', width: '40px' }} alt="Water Cooler" />
        <img src="/printer.png" className="decoration" style={{ left: '700px', top: '150px', width: '50px' }} alt="Printer" />

        {/* Boss */}
        <div className="character" style={{ left: `${boss.x}px`, top: `${boss.y}px` }}>
          {boss.speech && <div className="speech-bubble">{boss.speech}</div>}
          <img src={`/${boss.img}`} alt="Boss" />
        </div>

        {/* Julia */}
        <div className="character" style={{ left: `${julia.x}px`, top: `${julia.y}px` }}>
          {julia.speech && <div className="speech-bubble">{julia.speech}</div>}
          <img src={`/${julia.img}`} alt="Julia" />
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