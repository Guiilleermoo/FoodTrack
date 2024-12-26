import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';

const Seguimiento = () => {
  // Referencias para los canvas de Chart.js
  const caloriesChartRef = useRef(null);
  const mostConsumedChartRef = useRef(null);
  const recommendedChartRef = useRef(null);
  const [evoluciones, setEvoluciones] = useState([]);
  const [consumos, setConsumos] = useState([]);
  const [recomendaciones, setRecomendaciones] = useState([]);
  const caloriesChartInstance = useRef(null);
  const mostConsumedChartInstance = useRef(null);
  const recommendedChartInstance = useRef(null);
  const [caloriasPromedio, setCaloriasPromedio] = useState(2050);

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  };

  const getToken = () => {
    return localStorage.getItem('authToken') || '';
  };

  const fetchEvoluciones = async (usuarioId) => {
    try {
      const response = await fetch(`/node/evoluciones/${usuarioId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
      });

      const data = await response.json();
      if (response.ok) {
        setEvoluciones(data);
      } else {
        console.error('Error al obtener las evoluciones:', data);
      }
    } catch (error) {
      console.error('Error al realizar la solicitud:', error);
    }
  };

  const fetchConsumos = async (usuarioId) => {
    try {
      console.log(getToken());
      const response = await fetch(`flask/consumos/usuario/${usuarioId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${getToken()}`,
          'Content-Type': 'application/json'
        },
      });
      console.log(response)

      if (response.ok) {
        const data = await response.json();
        console.log(data.consumos)
        setConsumos(data.consumos);
      } else {
        console.error('Error al obtener los consumos:', data);
      }
    } catch (error) {
      console.error('Error al realizar la solicitud:', error);
    }
  };

  const fetchRecomendaciones = async (usuarioId) => {
    try {
      const response = await fetch(`node/recomendaciones/usuario/${usuarioId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data)
        setRecomendaciones(data);
      } else {
        console.error('Error al obtener las recomendaciones:', data);
      }
    } catch (error) {
      console.error('Error al realizar la solicitud:', error);
    }
  };
      

  const actualizarEstadisticas = (evoluciones, consumos, recomendaciones) => {
    console.log("Evoluciones:", evoluciones);
    const today = new Date();
    const todayIndex = today.getDay();
    console.log("Hoy es:", today);
    
    const daysOfWeek = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
    
    const weekDays = [
      ...daysOfWeek.slice(todayIndex), 
      ...daysOfWeek.slice(0, todayIndex)
    ];
    console.log("Días de la semana para el gráfico:", weekDays);

    let totalCalorias = 0;

    const caloriesData = weekDays.map((_, index) => {
      const targetDate = new Date(today);
      targetDate.setDate(today.getDate() - index);

      console.log(`Comprobando datos para el día: ${targetDate.toDateString()}`);
      
        const evoForDay = evoluciones.find(evo => {
          const evoDate = new Date(evo.fecha);
          return evoDate.toDateString() === targetDate.toDateString();
        });

        if (evoForDay) {
          totalCalorias += evoForDay.caloriasConsumidas;
        }

        return evoForDay ? evoForDay.caloriasConsumidas : 0;
      }).reverse();
    
    console.log("Datos de calorías:", caloriesData);

    console.log("Total de calorías:", totalCalorias);
    const promedioCalorias = Math.round(totalCalorias / 7);
    console.log("Promedio de calorías:", promedioCalorias);
    setCaloriasPromedio(promedioCalorias);

    const contadorAlimentos = {};

    consumos.forEach((consumo) => {
      const alimentoNombre = consumo.alimento.name;

      if (alimentoNombre) {
        if (!contadorAlimentos[alimentoNombre]) {
          contadorAlimentos[alimentoNombre] = consumo.cantidad;
        }
        contadorAlimentos[alimentoNombre] += consumo.cantidad;
      }
    });

    console.log("Contador de alimentos:", contadorAlimentos);

    const alimentosOrdenados = Object.entries(contadorAlimentos)
      .map(([nombre, cantidad]) => ({ nombre, cantidad }))
      .sort((a, b) => b.cantidad - a.cantidad);

    console.log("Alimentos ordenados por frecuencia:", alimentosOrdenados);

    const top5Alimentos = alimentosOrdenados.slice(0, 5);

    console.log("Top 5 alimentos más consumidos:", top5Alimentos);

    const newMostConsumedData = {
      labels: top5Alimentos.map((alimento) => alimento.nombre),
      values: top5Alimentos.map((alimento) => alimento.cantidad)
    };

    const recomendacionFrecuencias = recomendaciones.reduce((acc, rec) => {
      rec.alimentosRecomendados.forEach(alimento => {
        acc[alimento] = (acc[alimento] || 0) + 1;
      });
      return acc;
    }, {});

    console.log("Frecuencias de recomendaciones:", recomendacionFrecuencias);

    const totalRecomendaciones = Object.values(recomendacionFrecuencias).reduce((sum, freq) => sum + freq, 0);

    const recommendedData = {
      labels: Object.keys(recomendacionFrecuencias),
      values: Object.values(recomendacionFrecuencias).map(freq => (freq / totalRecomendaciones) * 100),
    };

    console.log("Datos recomendados dinámicos:", recommendedData);

      updateCharts(caloriesData, weekDays, newMostConsumedData, recommendedData);
  };

  useEffect(() => {
    console.log("Consumos actualizados: ", consumos);
    const usuarioId = getCookie('user_id');
    const evolucion = calcularEvolucion(consumos, usuarioId);
    console.log("Evolución calculada:", evolucion);
    gestionarEvolucion(evoluciones, evolucion);
    fetchEvoluciones(usuarioId);
    
    if (evoluciones && evoluciones.length > 0) {
      actualizarEstadisticas(evoluciones, consumos, recomendaciones); 
    } else {
      console.warn("No hay evoluciones guardadas.");
    }
  }, [consumos]);

  const calcularEvolucion = (consumos, usuarioId) => {
    if (!consumos || consumos.length === 0) {
      console.warn('No hay consumos disponibles para calcular evolución.');
      return null;
    }
  
    let alimentoMasConsumido = '';
    let caloriasConsumidas = 0;
    let promedioCalorias = 0;
    let totalAlimentosConsumidos = 0;
    const fechaHoy = new Date().toISOString().split('T')[0];
  
    const alimentoFrecuencia = {};
  
    const consumosDelDia = consumos.filter(consumo => {
      const fechaConsumo = new Date(consumo.fechaConsumo);
      const fechaConsumoDia = fechaConsumo.toISOString().split('T')[0];
      return fechaConsumoDia === fechaHoy;
    });
  
    if (consumosDelDia.length === 0) {
      console.warn('No hay consumos para el día de hoy.');
      return null;
    }
  
    for (const consumo of consumosDelDia) {
      caloriasConsumidas += consumo.calorias;
      totalAlimentosConsumidos += 1;
  
      if (alimentoFrecuencia[consumo.alimento.name]) {
        alimentoFrecuencia[consumo.alimento.name] += consumo.cantidad;
      } else {
        alimentoFrecuencia[consumo.alimento.name] = consumo.cantidad;
      }
    }
  
    alimentoMasConsumido = Object.keys(alimentoFrecuencia).reduce((a, b) =>
      alimentoFrecuencia[a] > alimentoFrecuencia[b] ? a : b
    );
  
    promedioCalorias = parseInt((caloriasConsumidas / totalAlimentosConsumidos).toFixed(2));
  
    const evolucion = {
      alimentoMasConsumido: alimentoMasConsumido,
      caloriasConsumidas: caloriasConsumidas,
      estadisticas: {
        promedioCalorias: promedioCalorias,
        totalAlimentosConsumidos: totalAlimentosConsumidos,
      },
      fecha: fechaHoy,
      usuarioId: usuarioId,
    };
  
    return evolucion;
  };
  

  const gestionarEvolucion = async (evoluciones, evolucion) => {
    try {
      if(!evolucion || evolucion === null) {  
        console.warn('No se ha proporcionado una evolución válida.');
        return;
      }
      
      const evolucionExistente = evoluciones.find(
        (e) => e.fecha.split('T')[0] === evolucion.fecha
        
      );
  
      if (evolucionExistente != undefined) {
        
        console.log('Evolución existente encontrada. Actualizando...');
        const updateResponse = await fetch(`/node/evoluciones/${evolucionExistente._id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` },
          body: JSON.stringify(evolucion),
        });
        
        if (!updateResponse.ok) {
          console.error('Error al actualizar la evolución.');
        } else {
          console.log('Evolución actualizada correctamente.');
        }
      } else {
        
        console.log('No existe evolución con la misma fecha. Creando nueva...');
        const createResponse = await fetch('/node/evoluciones', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` },
          body: JSON.stringify(evolucion),
        });
  
        if (!createResponse.ok) {
          const errorData = await createResponse.json();
          console.error('Error al crear la evolución:', errorData);
          return;
        }
      
        const data = await createResponse.json();
        console.log('Evolución creada exitosamente:', data);
      }
    } catch (error) {
      console.error('Error en gestionarEvolucion:', error);
    }
  };

  const updateCharts = (newCaloriesData, newDayLabels, newMostConsumedData, newRecommendedData) => {
    if (caloriesChartInstance.current) {
      caloriesChartInstance.current.data.labels = newDayLabels;
      caloriesChartInstance.current.data.datasets[0].data = newCaloriesData;
      caloriesChartInstance.current.update();
    }
  
    if (mostConsumedChartInstance.current) {
      mostConsumedChartInstance.current.data.datasets[0].data = newMostConsumedData.values;
      mostConsumedChartInstance.current.data.labels = newMostConsumedData.labels;
      mostConsumedChartInstance.current.update();
    }
  
    if (recommendedChartInstance.current) {
      recommendedChartInstance.current.data.labels = newRecommendedData.labels;
      recommendedChartInstance.current.data.datasets[0].data = newRecommendedData.values;
      recommendedChartInstance.current.update();
    }
  };
  
  useEffect(() => {
    const usuarioId = getCookie('user_id');
    console.log('ID de usuario:', usuarioId);
    fetchRecomendaciones(usuarioId);
    fetchConsumos(usuarioId);

    const caloriesChartCtx = caloriesChartRef.current.getContext('2d');
    caloriesChartInstance.current = new Chart(caloriesChartCtx, {
      type: 'line',
      data: {
        labels: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
        datasets: [{
          label: 'Calorías Consumidas',
          data: [2100, 1950, 2200, 1800, 2300, 2050, 2150],
          fill: false,
          borderColor: '#34495e',
          tension: 0.1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: true, position: 'top' }
        }
      }
    });

    const mostConsumedChartCtx = mostConsumedChartRef.current.getContext('2d');
    mostConsumedChartInstance.current = new Chart(mostConsumedChartCtx, {
      type: 'bar',
      data: {
        labels: ['Manzanas', 'Plátanos', 'Pollo', 'Arroz', 'Pan', 'Huevos'],
        datasets: [{
          label: 'Cantidad Consumida (gramos)',
          data: [300, 250, 400, 350, 200, 180],
          backgroundColor: 'rgba(22, 160, 133, 0.6)',
          borderColor: '#16a085',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: true, position: 'top' }
        }
      }
    });

    const recommendedChartCtx = recommendedChartRef.current.getContext('2d');
    recommendedChartInstance.current = new Chart(recommendedChartCtx, {
      type: 'doughnut',
      data: {
        labels: ['Frutas', 'Verduras', 'Proteínas', 'Grasas Saludables'],
        datasets: [{
          data: [40, 30, 20, 10],
          backgroundColor: ['#1abc9c', '#3498db', '#e74c3c', '#f39c12']
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: true, position: 'bottom' }
        }
      }
    });
  }, []);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      background: 'linear-gradient(120deg, #b3ffab, #12fff7)',
      minHeight: 'calc(100vh - 80px)',  // Asegura que el contenido no sobrepase el header
      paddingTop: '1600px', // Reduces el margen superior
    }}>
      <h1 style={{
        color: '#34495e',
        fontSize: '3em',
        marginTop: '10px',
        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)'
      }}>Estadísticas de Usuario</h1>

      <div style={{
        width: '95%',
        maxWidth: '1000px',
        backgroundColor: 'white',
        padding: '25px',
        margin: '20px 0',
        borderRadius: '10px',
        boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)',
      }}>
        {/* Gráfico de Consumo de Calorías por Día */}
        <div style={{ marginBottom: '20px', padding: '10px' }}>
          <h2 style={{
            color: '#16a085',
            fontSize: '1.8em',
            marginBottom: '10px',
            borderBottom: '2px solid #16a085',
            paddingBottom: '5px'
          }}>Consumo de Calorías por Día</h2>
          <div style={{ width: '100%', maxWidth: '700px', margin: 'auto' }}>
            <canvas ref={caloriesChartRef}></canvas>
          </div>
        </div>

        {/* Calorías Promedio */}
        <div style={{
          fontSize: '1.5em',
          color: '#34495e',
          backgroundColor: '#f2f2f2',
          padding: '12px',
          borderRadius: '8px',
          textAlign: 'center',
          marginBottom: '20px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        }}>
          <h2>Calorías Promedio</h2>
          <p>{caloriasPromedio} kcal</p>
        </div>

        {/* Gráfico de Alimentos Más Consumidos */}
        <div style={{ marginBottom: '20px', padding: '10px' }}>
          <h2 style={{
            color: '#16a085',
            fontSize: '1.8em',
            marginBottom: '10px',
            borderBottom: '2px solid #16a085',
            paddingBottom: '5px'
          }}>Alimentos Más Consumidos</h2>
          <div style={{ width: '100%', maxWidth: '700px', margin: 'auto' }}>
            <canvas ref={mostConsumedChartRef}></canvas>
          </div>
        </div>

        {/* Gráfico de Alimentos Recomendados */}
        <div style={{ marginBottom: '20px', padding: '10px' }}>
          <h2 style={{
            color: '#16a085',
            fontSize: '1.8em',
            marginBottom: '10px',
            borderBottom: '2px solid #16a085',
            paddingBottom: '5px'
          }}>Alimentos Recomendados</h2>
          <div style={{ width: '100%', maxWidth: '700px', margin: 'auto' }}>
            <canvas ref={recommendedChartRef}></canvas>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Seguimiento;
