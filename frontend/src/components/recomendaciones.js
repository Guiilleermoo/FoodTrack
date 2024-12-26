import React, { useState, useEffect } from 'react';
import '../styles/recomendaciones.css';

const Recomendaciones = () => {
  const [recomendaciones, setRecomendaciones] = useState([]);
  const [consumos, setConsumos] = useState([]);
  const [imagenes, setImagenes] = useState({});

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  };

  const getToken = () => {
    return localStorage.getItem('authToken') || '';
  };

  const fetchRecomendaciones = async (usuarioId) => {
    try {
      const response = await fetch(`/node/recomendaciones/usuario/${usuarioId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const motivosExistentes = new Set();
        const recomendacionesFiltradas = data.filter(recomendacion => {
          if (motivosExistentes.has(recomendacion.motivo)) {
            return false;
          }
          motivosExistentes.add(recomendacion.motivo);
          return true;
        });
        setRecomendaciones(recomendacionesFiltradas);
      } else {
        console.error('Error al obtener las recomendaciones:', data);
      }
    } catch (error) {
      console.error('Error al realizar la solicitud:', error);
    }
  };

  const fetchConsumos = async (usuarioId) => {
    try {
      const response = await fetch(`flask/consumos/usuario/${usuarioId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setConsumos(data.consumos);
      } else {
        console.error('Error al obtener las evoluciones:', data);
      }
    } catch (error) {
      console.error('Error al realizar la solicitud:', error);
    }
  };

  const fetchProductImages = async () => {
    const fetchedImages = {};
    for (const recomendacion of recomendaciones) {
      for (const alimento of recomendacion.alimentosRecomendados) {
        if (!fetchedImages[alimento]) {
          try {
            const response = await fetch(
              `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${alimento}&sort_by=popularity&json=true`
            );
            const data = await response.json();
            if (data.products && data.products.length > 0) {
              fetchedImages[alimento] = data.products[0].image_url || '';
            } else {
              fetchedImages[alimento] = '';
            }
          } catch (error) {
            console.error(`Error fetching image for ${alimento}:`, error);
            fetchedImages[alimento] = '';
          }
        }
      }
    }
    setImagenes(fetchedImages);
  };

  const calcularRecomendaciones = (consumos, usuarioId) => {
    const umbralAltoCalorias = 2000;
    const umbralBajoCalorias = 1000;
    const fechaHoy = new Date().toISOString().split('T')[0];
    console.log('Fecha de hoy:', fechaHoy);
    const recomendacion = {
      usuarioId: usuarioId,
      alimentosRecomendados: [],
      motivo: "",
    };
    console.log('Consumos:', consumos);
    const consumosDeHoy = consumos.filter(consumo => {
      try {
        if (!consumo.fechaConsumo || typeof consumo.fechaConsumo !== 'string') {
          console.warn(`Fecha de consumo inválida o faltante:`, consumo);
          return false;
        }
    
        const fechaConsumo = new Date(consumo.fechaConsumo.replace(/,/g, ''));
        if (isNaN(fechaConsumo)) {
          console.warn(`Fecha inválida encontrada: ${consumo.fechaConsumo}`);
          return false;
        }
    
        console.log('Fecha de consumo 1:', fechaConsumo);
    
        const fechaConsumoDia = fechaConsumo.toISOString().split('T')[0];
        console.log('Fecha de consumo 2:', fechaConsumoDia);

        return fechaConsumoDia === fechaHoy;
      } catch (error) {
        console.error(`Error procesando fechaConsumo: ${consumo.fechaConsumo}`, error);
        return false;
      }
    });    

    if (consumosDeHoy.length === 0) {
      console.log('No hay consumos para hoy.');
      return;
    }
  
    const alimentoFrecuencia = {};
    let totalCaloriasConsumidas = 0;
    let totalAlimentosConsumidos = 0;
  
    for (const consumo of consumosDeHoy) {
      totalCaloriasConsumidas += consumo.calorias;
      totalAlimentosConsumidos += 1;
  
      if (alimentoFrecuencia[consumo.alimento.name]) {
        alimentoFrecuencia[consumo.alimento.name] += 1;
      } else {
        alimentoFrecuencia[consumo.alimento.name] = 1;
      }
    }
  
    const alimentoMasConsumido = Object.keys(alimentoFrecuencia).reduce((a, b) =>
      alimentoFrecuencia[a] > alimentoFrecuencia[b] ? a : b
    );
  
    if (totalCaloriasConsumidas > umbralAltoCalorias) {
      console.log('Motivo: Alta ingesta calórica');
      recomendacion.alimentosRecomendados = ['Pepino', 'Apio', 'Lechuga romana'];
      recomendacion.motivo = "Alta ingesta calórica";
      crearRecomendacion(recomendacion);
    } else if (totalCaloriasConsumidas < umbralBajoCalorias) {
      console.log('Motivo: Baja ingesta calórica');
      recomendacion.alimentosRecomendados = ['Pizza con pepperoni y extra queso', 'Papas fritas', 'Tarta de chocolate'];
      recomendacion.motivo = "Baja ingesta calórica";
      crearRecomendacion(recomendacion);
    }

    if (alimentoFrecuencia[alimentoMasConsumido] > totalAlimentosConsumidos / 2) {
      console.log('Motivo: Alimento más consumido');
      recomendacion.alimentosRecomendados = [alimentoMasConsumido];
      recomendacion.motivo = "Alimento más consumido";
      crearRecomendacion(recomendacion);
    }
  
    return;
  };

  const crearRecomendacion = async (recomendacion) => {
    try {
      console.log('Creando recomendación:', recomendacion);
      const response = await fetch('/node/recomendaciones', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`,
        },
        body: JSON.stringify(recomendacion),
      });

      if (response.ok) {
        console.log('Recomendación creada con éxito:', recomendacion);
      } else {
        console.error('Error al crear la recomendación:', response);
      }
    } catch (error) {
      console.error('Error al realizar la solicitud:', error);
    }
  };

  useEffect(() => {
    const usuarioId = getCookie('user_id');
    fetchConsumos(usuarioId);
    fetchRecomendaciones(usuarioId);
  }, []);

  useEffect(() => {
    const usuarioId = getCookie('user_id');
    fetchRecomendaciones(usuarioId);
  }, [consumos]);

  useEffect(() => {
    if (recomendaciones.length > 0) {
      fetchProductImages();
    }
    const usuarioId = getCookie('user_id');
    calcularRecomendaciones(consumos, usuarioId);
  }, [recomendaciones]);

  return (
    <div className="container" style={{ paddingTop: '150px' }}>
      <h1>Recomendaciones Personalizadas</h1>

      <div className="recommendations-scroll">
        {recomendaciones.map((recomendacion) => (
          <div className="recommendation-card" key={recomendacion._id}>
            <h2>Motivo: {recomendacion.motivo}</h2>
            <p><strong>Fecha:</strong> {new Date(recomendacion.fecha).toLocaleDateString()}</p>
            <div className="product-list">
              {recomendacion.alimentosRecomendados.map((alimento) => (
                <div className="product-card" key={alimento}>
                  <img
                    src={imagenes[alimento] || 'https://via.placeholder.com/150'}
                    alt={alimento}
                    className="product-image"
                  />
                  <p>{alimento}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .container {
          padding: 20px;
          max-width: 800px;
          margin: 0 auto;
          text-align: center;
        }
        .recommendations-scroll {
          display: flex;
          flex-direction: column;
          gap: 20px;
          padding: 20px;
          border: 1px solid #ddd;
          border-radius: 10px;
          max-height: 500px;
          overflow-y: auto;
        }
        .recommendation-card {
          padding: 20px;
          border: 1px solid #ccc;
          border-radius: 10px;
          background-color: #f9f9f9;
          text-align: left;
        }
        .product-list {
          display: flex;
          gap: 15px;
          margin-top: 15px;
        }
        .product-card {
          flex: 0 0 auto;
          text-align: center;
          width: 120px;
        }

        .product-image {
          width: 120px; /* Fijo el ancho */
          height: 120px; /* Fijo la altura */
          object-fit: cover; /* Asegura que la imagen se ajuste sin deformarse */
          border-radius: 10px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </div>
  );
};

export default Recomendaciones;