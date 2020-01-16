import React, {useState, useEffect} from 'react';
import api from './services/api';

import './global.css';
import './App.css';
import './sideBar.css';
import './Main.css';

import DevForm from './components/DevForm';
import DevItem from './components/DevItem';

//componente: Bloco isolado de html, css e js, o qual não interfere no restante da aplicação
//propriedade: Informações que o componente pai passa para o componente filho
//estado: Informações mantidas pelo componente (Lembrar: imutabilidade)


function App() {
  //hold devs information
  const [devs, setDevs] = useState([]);
  

  useEffect(()=>{
    async function loadDevs(){
      const response = await api.get('/devs');
      setDevs(response.data);
    }
    loadDevs();
  },[]);


  async function handleSubmit(data){
    const response = await api.post('/devs',data);

    setDevs([...devs, response.data]);

  }

  return (
    <div id="app">
      <aside>
        <strong>Cadastrar</strong>
        <DevForm onSubmit={handleSubmit} />
      </aside>
      <main>
        <ul>
          {devs.map(dev =>(
            <DevItem key={dev._id} dev={dev}/>
          ))}

        </ul>
      </main>
    </div>
  );
}

export default App;
