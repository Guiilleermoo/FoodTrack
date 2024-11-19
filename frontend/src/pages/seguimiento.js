import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const Seguimiento = () => {
  // Referencias para los canvas de Chart.js
  const caloriesChartRef = useRef(null);
  const mostConsumedChartRef = useRef(null);
  const recommendedChartRef = useRef(null);

  // Configuración de los gráficos
  useEffect(() => {
    // Gráfico de Consumo de Calorías por Día
    const caloriesChartCtx = caloriesChartRef.current.getContext('2d');
    new Chart(caloriesChartCtx, {
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

    // Gráfico de Alimentos Más Consumidos
    const mostConsumedChartCtx = mostConsumedChartRef.current.getContext('2d');
    new Chart(mostConsumedChartCtx, {
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

    // Gráfico de Alimentos Recomendados
    const recommendedChartCtx = recommendedChartRef.current.getContext('2d');
    new Chart(recommendedChartCtx, {
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
          <p>2050 kcal</p>
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
