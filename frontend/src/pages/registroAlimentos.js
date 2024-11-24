import React, { useState } from 'react';
import '../styles/registroAlimentos.css';

const RegistroAlimentos = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [quantity, setQuantity] = useState(1);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleQuantityChange = (event) => {
    setQuantity(event.target.value);
  };

  const generateUniqueId = () => {
    const timestamp = new Date().getTime();
    const randomNum = Math.floor(Math.random() * 1000000);
    return `${timestamp}-${randomNum}`;
  };

  const handleSearch = async (event) => {
    event.preventDefault();

    if (searchQuery.trim() === '') return;

    setSearchResults([]);

    try {
      const response = await fetch(
        `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${searchQuery}&sort_by=popularity&json=true`
      );
      const data = await response.json();

      const products = data.products.slice(0, 10).map((product) => {
        const caloriesPer100g = product.nutriments ? product.nutriments['energy-kcal_100g'] : 0;
        const calculatedCalories = (caloriesPer100g * quantity) / 100;

        return {
          name: product.product_name || 'Nombre no disponible',
          caloriesPer100g: caloriesPer100g,
          calculatedCalories: calculatedCalories,
          ecoscore: product.ecoscore_grade || 'No disponible',
          image: product.image_url || '',
          quantity: quantity,
        };
      });

      setSearchResults(products);
    } catch (error) {
      console.error('Error fetching data:', error);
      setSearchResults([]);
    }
  };

  const handleAddToSelection = (product) => {
    const productWithId = {
      ...product,
      id: generateUniqueId(),
    };
  
    // Actualiza el estado de selectedItems añadiendo el nuevo producto
    setSelectedItems((prevItems) => {
      // Verifica si el producto ya está en la lista
      if (prevItems.some(item => item.id === productWithId.id)) {
        console.log('Producto ya agregado');
        return prevItems; // No agrega el producto si ya existe
      } else {
        console.log('Producto agregado', productWithId);
        return [...prevItems, productWithId]; // Agrega el producto con el id generado
      }
    });
  };

  const handleRemoveFromSelection = (id) => {
    setSelectedItems((prevItems) => prevItems.filter(item => item.id !== id));
  };

  return (
    <div className="container" style={{ paddingTop: '800px' }}>
      <h1>Registro de Alimentos</h1>

      <div className="form-container">
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

      <h2 className="section-title">Resultados de la Búsqueda</h2>
      <div className="results-container">
        {searchResults.length === 0 ? (
          <p>No se han encontrado resultados</p>
        ) : (
          searchResults.map((result) => (
            <div key={result.id} className="result-item">
              <img src={result.image || 'default-image.jpg'} alt={result.name} className="result-image" />
              <div>
                <span>
                  {result.name} - {result.quantity} g - {result.calculatedCalories} kcal - EcoScore: {result.ecoscore}
                </span>
              </div>
              <div>
                <button onClick={() => handleAddToSelection(result)}>Agregar</button>
              </div>
            </div>
          ))
        )}
      </div>

      <h2 className="section-title">Productos Seleccionados</h2>
      <div className="selected-items-container">
        {selectedItems.length === 0 ? (
          <p>No has seleccionado productos</p>
        ) : (
          selectedItems.map((item) => (
            <div key={item.id} className="selected-item">
              <img src={item.image || 'default-image.jpg'} alt={item.name} className="result-image" />
              <div>
                <span>
                  {item.name} - {item.quantity} g - {item.calculatedCalories} kcal - EcoScore: {item.ecoscore}
                </span>
              </div>
              <div>
                <button onClick={() => handleRemoveFromSelection(item.id)}>Eliminar</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RegistroAlimentos;
