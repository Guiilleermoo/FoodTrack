import React, { useEffect } from 'react';
import '../styles/seguimiento.css';

const Recomendaciones = () => {

  // Función para obtener productos de frutas de la API
  const fetchFruitProducts = async () => {
    const response = await fetch(
      `https://world.openfoodfacts.org/cgi/search.pl?search_terms=fruits naturels&sort_by=popularity&json=true`
    );
    const data = await response.json();
    displayFruitProducts(data.products);
  };

  // Función para mostrar productos de frutas
  const displayFruitProducts = (products) => {
    const fruitProductsDiv = document.getElementById('fruitProducts');
    fruitProductsDiv.innerHTML = ''; // Reiniciar contenido

    if (products && products.length > 0) {
      products.slice(0, 3).forEach((product) => {
        const productItem = document.createElement('div');
        productItem.className = 'product-item';

        const productName = product.product_name || 'Nombre no disponible';
        const imageUrl = product.image_url || ''; // Obtener imagen del producto

        productItem.innerHTML = `
          <img class="product-image" src="${imageUrl}" alt="${productName}">
          <h3>${productName}</h3>
        `;
        fruitProductsDiv.appendChild(productItem);
      });
    } else {
      fruitProductsDiv.innerHTML = '<p>No se encontraron frutas recomendadas.</p>';
    }
  };

  // Función para obtener productos de verduras de la API
  const fetchVegetableProducts = async () => {
    const response = await fetch(
      `https://world.openfoodfacts.org/cgi/search.pl?search_terms=verdura&sort_by=popularity&json=true`
    );
    const data = await response.json();
    displayVegetableProducts(data.products);
  };

  // Función para mostrar productos de verduras
  const displayVegetableProducts = (products) => {
    const vegetableProductsDiv = document.getElementById('vegetableProducts');
    vegetableProductsDiv.innerHTML = ''; // Reiniciar contenido

    if (products && products.length > 0) {
      products.slice(0, 3).forEach((product) => {
        const productItem = document.createElement('div');
        productItem.className = 'product-item';

        const productName = product.product_name || 'Nombre no disponible';
        const imageUrl = product.image_url || ''; // Obtener imagen del producto

        productItem.innerHTML = `
          <img class="product-image" src="${imageUrl}" alt="${productName}">
          <h3>${productName}</h3>
        `;
        vegetableProductsDiv.appendChild(productItem);
      });
    } else {
      vegetableProductsDiv.innerHTML = '<p>No se encontraron verduras recomendadas.</p>';
    }
  };

  // Función para obtener productos lácteos de la API
  const fetchDairyProducts = async () => {
    const response = await fetch(
      `https://world.openfoodfacts.org/cgi/search.pl?search_terms=lácteo&sort_by=popularity&json=true`
    );
    const data = await response.json();
    displayDairyProducts(data.products);
  };

  // Función para mostrar productos lácteos
  const displayDairyProducts = (products) => {
    const dairyProductsDiv = document.getElementById('dairyProducts');
    dairyProductsDiv.innerHTML = ''; // Reiniciar contenido

    if (products && products.length > 0) {
      products.slice(0, 3).forEach((product) => {
        const productItem = document.createElement('div');
        productItem.className = 'product-item';

        const productName = product.product_name || 'Nombre no disponible';
        const imageUrl = product.image_url || ''; // Obtener imagen del producto

        productItem.innerHTML = `
          <img class="product-image" src="${imageUrl}" alt="${productName}">
          <h3>${productName}</h3>
        `;
        dairyProductsDiv.appendChild(productItem);
      });
    } else {
      dairyProductsDiv.innerHTML = '<p>No se encontraron productos lácteos recomendados.</p>';
    }
  };

  // Llamar a las funciones para obtener productos al cargar la página
  useEffect(() => {
    fetchFruitProducts();
    fetchVegetableProducts();
    fetchDairyProducts();
  }, []); // Empty array ensures this effect runs once after the first render

  return (
    <div className="container"> {/* Aquí usamos el contenedor para manejar el desbordamiento */}
      <div className="navbar">
        <a href="/seguimiento">Inicio</a>
        <a href="/registroAlimentos">Registro de Alimentos</a>
        <a href="/recomendaciones">Recomendaciones</a>
      </div>

      <h1>Recomendaciones Personalizadas</h1>

      <div className="recommendation-container">
        <div className="recommendation">
          <h2>¡Come más fruta!</h2>
          <div className="product-list" id="fruitProducts">
            {/* Productos de frutas aparecerán aquí */}
          </div>
        </div>

        <div className="divider"></div>

        <div className="recommendation">
          <h2>¡Incluye más verduras en tu dieta!</h2>
          <div className="product-list" id="vegetableProducts">
            {/* Productos de verduras aparecerán aquí */}
          </div>
        </div>

        <div className="divider"></div>

        <div className="recommendation">
          <h2>¡No olvides los productos lácteos!</h2>
          <div className="product-list" id="dairyProducts">
            {/* Productos lácteos aparecerán aquí */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Recomendaciones;
