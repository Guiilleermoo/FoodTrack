import React, { useState } from 'react';
import '../styles/prueba.css'; // Asegúrate de que este archivo CSS tenga los estilos adecuados

const Prueba = () => {
  // Estado para manejar la barra de búsqueda, resultados, productos seleccionados y cantidad
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]); // Resultados de la búsqueda
  const [selectedItems, setSelectedItems] = useState([]); // Lista de productos seleccionados
  const [quantity, setQuantity] = useState(1); // Estado para la cantidad

  // Función para manejar el cambio en la barra de búsqueda
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Función para manejar el cambio en la cantidad
  const handleQuantityChange = (event) => {
    setQuantity(event.target.value);
  };

  // Función para realizar la búsqueda a la API
  const handleSearch = async (event) => {
    event.preventDefault(); // Evitar que el formulario se envíe de forma predeterminada

    if (searchQuery.trim() === '') return; // Evitar búsquedas vacías

    setSearchResults([]); // Limpiar resultados anteriores

    try {
      // Realizar la solicitud a la API de Open Food Facts
      const response = await fetch(
        `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${searchQuery}&sort_by=popularity&json=true`
      );
      const data = await response.json();

      // Tomamos los primeros 10 resultados de los productos
      const products = data.products.slice(0, 10).map((product) => ({
        name: product.product_name || 'Nombre no disponible',
        calories: product.nutriments ? product.nutriments['energy-kcal_100g'] : 'No disponible',
        ecoscore: product.ecoscore_grade || 'No disponible', // Ecoscore del producto
        image: product.image_url || '', // Imagen del producto
      }));

      setSearchResults(products); // Establecer los resultados
    } catch (error) {
      console.error('Error fetching data:', error);
      setSearchResults([]); // Limpiar los resultados en caso de error
    }
  };

  // Función para agregar un producto a los productos seleccionados
  const handleAddToSelection = (product) => {
    setSelectedItems((prevItems) => [...prevItems, product]);
  };

  return (
    <div className="container" style={{ paddingTop: '800px' }}>
      <h1>Registro de Alimentos</h1>

      <div className="form-container">
        {/* Formulario de Búsqueda */}
        <form onSubmit={handleSearch}>
          <div className="form-group">
            <label htmlFor="searchQuery">Buscar Alimento</label>
            <input
              type="text"
              id="searchQuery"
              name="searchQuery"
              value={searchQuery}
              onChange={handleSearchChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="quantity">Cantidad (gramos)</label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              min="1"
              max="1000"
              value={quantity}
              onChange={handleQuantityChange}
              required
            />
          </div>
          <div className="form-group">
            <input type="submit" value="Buscar" />
          </div>
        </form>
      </div>

      {/* Título para los resultados */}
      <h2 className="section-title">Resultados de la Búsqueda</h2>
      {/* Resultados */}
      <div className="results-container">
        {searchResults.length === 0 ? (
          <p>No se han encontrado resultados</p>
        ) : (
          searchResults.map((result, index) => (
            <div key={index} className="result-item">
              <img src={result.image || 'default-image.jpg'} alt={result.name} className="result-image" />
              <div>
                <span>{result.name} - {quantity} g - {result.calories} kcal - EcoScore: {result.ecoscore}</span>
                {/* Botón para agregar el producto a los seleccionados */}
                <button onClick={() => handleAddToSelection(result)}>Agregar</button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Título para los productos seleccionados */}
      <h2 className="section-title">Productos Seleccionados</h2>
      {/* Mostrar los productos seleccionados */}
      <div className="selected-items-container">
        {selectedItems.length === 0 ? (
          <p>No has seleccionado productos</p>
        ) : (
          selectedItems.map((item, index) => (
            <div key={index} className="selected-item">
              <img src={item.image || 'default-image.jpg'} alt={item.name} className="result-image" />
              <div>
                <span>{item.name} - {quantity} g - {item.calories} kcal - EcoScore: {item.ecoscore}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Prueba;
