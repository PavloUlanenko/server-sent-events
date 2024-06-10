import { useState, useEffect } from 'react';
import FlickeringFact from './FlickeringFact';
import './App.css';

function App() {
  const [facts, setFacts] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [numberOfClients, setNumberOfClients] = useState(0);
  const [currentFactIndex, setCurrentFactIndex] = useState(0);

  const handleFactCompleted = () => {
    setCurrentFactIndex((prevIndex) => prevIndex + 1);
  };
  
  useEffect(() => {
    if (!isListening) {
      const eventSource = new EventSource('http://localhost:5000/events');

      eventSource.onmessage = (event) => {
        const newFact = JSON.parse(event.data);
        setFacts((prevFacts) => [...prevFacts, newFact]);
      };

      setIsListening(true);
    }
  }, [facts, isListening]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const factValue = e.target.addFact.value;
    fetch('http://localhost:5000/fact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fact: factValue,
      }),
    });
  };

  const getConnectedClients = async () => {
    const res = await fetch('http://localhost:5000/status');
    const data = await res.json();
    setNumberOfClients(data.clients);
  };

  return (
    <div className="App">
      <div className='facts-wrap'>
        <h1>Fun Facts About English</h1>
        <ul id='facts'>
          {facts.slice(0, currentFactIndex + 1).map((fact, ind) => (
            <li key={ind}><FlickeringFact fact={fact} handleFactCompleted={handleFactCompleted} isLast={facts.length === currentFactIndex && ind + 1 === currentFactIndex} /></li>
          ))}
        </ul>
        <br/>
        <form onSubmit={handleSubmit}>
          <input type='text' name='addFact' placeholder='Add a fact' />
          <button type='submit'>Add Fact</button>
        </form>
        <br/>
        <div>
          <span>Number of clients connected: {numberOfClients}</span>
          <br/>
          <button onClick={getConnectedClients}>Get Clients</button>
        </div>
      </div>
    </div>
  );
}

export default App;