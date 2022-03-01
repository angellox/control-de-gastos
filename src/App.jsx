import { useState, useEffect } from 'react';
import Header from './components/Header';
import Filtro from './components/Filtro';
import ListadoGastos from './components/ListadoGastos';
import Modal from './components/Modal';
import { generarId } from './helpers';
import IconoNuevoGasto from './img/nuevo-gasto.svg';

function App() {
  
  const [presupuesto, setPresupuesto] = useState(
    Number(localStorage.getItem('presupuesto')) ?? 0
  );
  const [isValidPresupuesto, setIsValidPresupuesto] = useState(false);

  const [modal, setModal] = useState(false);
  const [animarModal, setAnimarModal] = useState(false);
  const [gastoEditar, setGastoEditar] = useState({});

  // Almacén de gastos
  const [gastos, setGastos] = useState(
    JSON.parse(localStorage.getItem('gastos')) ?? []
  );

  const [filtro, setFiltro] = useState('');
  const [gastosFiltrados, setGastosFiltrados] = useState([]);

  // Effect para revisar si existe un cambio en algún gasto
  useEffect(() => {
    if( Object.keys(gastoEditar).length > 0 ){
      setModal(true);
  
      setTimeout(() => {
        setAnimarModal(true);
        
      }, 400);
    }
  }, [ gastoEditar ]);

  const handleNuevoGasto = () => {
    setModal(true);
    setGastoEditar({});

    setTimeout(() => {
      setAnimarModal(true);
      
    }, 400);
  };

  const guardarGasto = gasto => {
    
    if(gasto.id){
      // Actualizar
      const gastosActualizados = gastos.map( gastoState => gastoState.id === gasto.id ? gasto : gastoState);
      setGastos(gastosActualizados);
      setGastoEditar({});
    } else {
      gasto.id = generarId();
      gasto.fecha = Date.now();
      setGastos([...gastos, gasto]);
    }
    
    setAnimarModal(false);

    setTimeout(() => {
        setModal(false);
    }, 400);
  }

  const eliminarGasto = id => {
    const gastosUpToDate = gastos.filter( gasto => gasto.id !== id );

    setGastos(gastosUpToDate);
  };

  useEffect(() => {
    localStorage.setItem('presupuesto', presupuesto);
  }, [presupuesto]);
    
  useEffect( () => {
    const presupuestoStorage = Number(localStorage.getItem('presupuesto')) ?? 0;
    
    if(presupuestoStorage > 0){
      setIsValidPresupuesto(true);
    }
    
  }, []);

  useEffect( () => {
    localStorage.setItem('gastos', JSON.stringify(gastos));
  }, [gastos]);

  useEffect( () => {
    if(filtro) {
      // Filtrando gastos por categoría
      const gastosFiltradosTmp = gastos.filter( gasto => gasto.categoria === filtro );

      setGastosFiltrados(gastosFiltradosTmp);
      
    }
  },[filtro]);

  return (
    <div className={modal ? 'fijar' : ''}>
      <Header
        gastos={gastos}
        setGastos={setGastos}
        presupuesto={presupuesto}
        setPresupuesto={setPresupuesto}
        isValidPresupuesto={isValidPresupuesto}
        setIsValidPresupuesto={setIsValidPresupuesto}
      />

      {isValidPresupuesto && (
        <>
          <main>
            <Filtro 
              filtro={filtro}
              setFiltro={setFiltro}
            />
            <ListadoGastos 
              eliminarGasto={eliminarGasto}
              gastos={gastos}
              setGastoEditar={setGastoEditar}
              filtro={filtro}
              gastosFiltrados={gastosFiltrados}
            />
          </main>
          <div className='nuevo-gasto'>
            <img 
              src={IconoNuevoGasto} 
              alt="Icono plus"
              onClick={handleNuevoGasto}
            />
          </div>
        </>
      )}

      {modal && <Modal 
                  setModal={setModal} 
                  animarModal={animarModal} 
                  setAnimarModal={setAnimarModal} 
                  guardarGasto={guardarGasto}
                  gastoEditar={gastoEditar}
                  setGastoEditar={setGastoEditar}
                  />
      }

    </div>


  )
}

export default App;
