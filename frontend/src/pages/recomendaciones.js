import React, { useState, useEffect } from 'react';
import '../styles/recomendaciones.css';

const Recomendaciones = () => {
  const [fruitVisible, setFruitVisible] = useState(false);
  const [vegetableVisible, setVegetableVisible] = useState(false);
  const [dairyVisible, setDairyVisible] = useState(false);

  const fetchFruitProducts = async () => {
    const response = await fetch(
      `https://world.openfoodfacts.org/cgi/search.pl?search_terms=fruits naturels&sort_by=popularity&json=true`
    );
    const data = await response.json();
    displayFruitProducts(data.products);
  };

  const displayFruitProducts = (products) => {
    const fruitProductsDiv = document.getElementById('fruitProducts');
    fruitProductsDiv.innerHTML = '';

    if (products && products.length > 0) {
      products.slice(0, 3).forEach((product) => {
        const productItem = document.createElement('div');
        productItem.className = 'product-item';

        const productName = product.product_name || 'Nombre no disponible';
        const imageUrl = product.image_url || '';

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

  const fetchVegetableProducts = async () => {
    const response = await fetch(
      `https://world.openfoodfacts.org/cgi/search.pl?search_terms=verdura&sort_by=popularity&json=true`
    );
    const data = await response.json();
    displayVegetableProducts(data.products);
  };

  const displayVegetableProducts = (products) => {
    const vegetableProductsDiv = document.getElementById('vegetableProducts');
    vegetableProductsDiv.innerHTML = '';

    if (products && products.length > 0) {
      products.slice(0, 3).forEach((product) => {
        const productItem = document.createElement('div');
        productItem.className = 'product-item';

        const productName = product.product_name || 'Nombre no disponible';
        const imageUrl = product.image_url || '';

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

  const fetchDairyProducts = async () => {
    const response = await fetch(
      `https://world.openfoodfacts.org/cgi/search.pl?search_terms=lácteo&sort_by=popularity&json=true`
    );
    const data = await response.json();
    displayDairyProducts(data.products);
  };

  const displayDairyProducts = (products) => {
    const dairyProductsDiv = document.getElementById('dairyProducts');
    dairyProductsDiv.innerHTML = ''; // Reiniciar contenido

    if (products && products.length > 0) {
      products.slice(0, 3).forEach((product) => {
        const productItem = document.createElement('div');
        productItem.className = 'product-item';

        const productName = product.product_name || 'Nombre no disponible';
        const imageUrl = product.image_url || '';

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

  useEffect(() => {
    fetchFruitProducts();
    fetchVegetableProducts();
    fetchDairyProducts();
  }, []); 

  return (
    <div className="container">
      <h1>Recomendaciones Personalizadas</h1>

      <div className="recommendation-container">
        <div className="recommendation">
          <h2 onClick={() => setFruitVisible(!fruitVisible)}>¡Come más fruta!</h2>
          {fruitVisible && (
            <div className="product-list" id="fruitProducts">
              {/* Productos de frutas aparecerán aquí */}
            </div>
          )}
        </div>

        <div className="divider"></div>

        <div className="recommendation">
          <h2 onClick={() => setVegetableVisible(!vegetableVisible)}>¡Incluye más verduras en tu dieta!</h2>
          {vegetableVisible && (
            <div className="product-list" id="vegetableProducts">
              {/* Productos de verduras aparecerán aquí */}
            </div>
          )}
        </div>

        <div className="divider"></div>

        <div className="recommendation">
          <h2 onClick={() => setDairyVisible(!dairyVisible)}>¡No olvides los productos lácteos!</h2>
          {dairyVisible && (
            <div className="product-list" id="dairyProducts">
              {/* Productos lácteos aparecerán aquí */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Recomendaciones;
