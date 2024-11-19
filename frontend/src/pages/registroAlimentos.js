import React, { useState } from 'react';
import '../styles/registroAlimentos.css';

const RegistroAlimentos = () => {
  // Estado para almacenar los alimentos
  const [foods, setFoods] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [quantity, setQuantity] = useState('');

  // Función para manejar el envío del formulario
  const handleSubmit = (event) => {
    event.preventDefault();
    searchFood(searchQuery, quantity);

    // Desplazar la página hacia los resultados de búsqueda
    window.scrollTo({
      top: document.getElementById('searchResults').offsetTop, // Desplazar hacia el contenedor de resultados
      behavior: 'smooth',  // Desplazamiento suave
    });
  };

  // Función para buscar alimentos en la API
  const searchFood = async (query, quantity) => {
    const response = await fetch(
      `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${query}&sort_by=popularity&json=true`
    );
    const data = await response.json();
    displaySearchResults(data.products, quantity);
  };

  // Función para mostrar los resultados de búsqueda
  const displaySearchResults = (products, quantity) => {
    if (products && products.length > 0) {
      setSearchResults(
        products.slice(0, 10).map((product) => {
          const productName = product.product_name || 'Nombre no disponible';
          const calories = product.nutriments ? product.nutriments['energy-kcal_100g'] : 'No disponible';
          const ecoscore = product.ecoscore_grade || 'No disponible'; // Obtener ecoscore
          const imageUrl = product.image_url || ''; // Obtener imagen del producto

          // Calcular calorías para la cantidad dada
          const caloriesForQuantity =
            calories !== 'No disponible' ? ((calories * quantity) / 100).toFixed(2) : 'No disponible';

          return {
            name: productName,
            quantity,
            caloriesForQuantity,
            ecoscore,
            imageUrl,
          };
        })
      );
    } else {
      setSearchResults([]);
    }
  };

  // Función para agregar un alimento a la lista de alimentos
  const addFood = (name, quantity, calories, ecoscore, image) => {
    const newFood = { name, quantity, calories, ecoscore, image };
    setFoods([...foods, newFood]);
  };

  // Función para eliminar un alimento de la lista
  const deleteFood = (index) => {
    const newFoods = foods.filter((food, i) => i !== index);
    setFoods(newFoods);
  };

  return (
    <div className="container">
      <h1>Registro de Alimentos</h1>

      <div className="form-container">
        {/* Formulario de Búsqueda */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="searchQuery">Buscar Alimento</label>
            <input
              type="text"
              id="searchQuery"
              name="searchQuery"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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
              onChange={(e) => setQuantity(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <input type="submit" value="Buscar" />
          </div>
        </form>

        {/* Resultados de Búsqueda */}
        <h2>Resultados de Búsqueda</h2>
        <div className="search-results" id="searchResults">
          {searchResults.length > 0 ? (
            searchResults.map((product, index) => (
              <div className="result-item" key={index}>
                <div>
                  <img className="result-image" src={product.imageUrl} alt={product.name} />
                  <span>
                    {product.name} - {product.quantity}g - {product.caloriesForQuantity} kcal - EcoScore: {product.ecoscore}
                  </span>
                </div>
                <button onClick={() => addFood(product.name, product.quantity, product.caloriesForQuantity, product.ecoscore, product.imageUrl)}>
                  Agregar
                </button>
              </div>
            ))
          ) : (
            <p>No se encontraron resultados.</p>
          )}
        </div>

        {/* Lista de Alimentos Registrados */}
        <div className="food-list" id="foodList">
          <h2>Alimentos Registrados</h2>
          {foods.length > 0 ? (
            foods.map((food, index) => (
              <div className="food-item" key={index}>
                <img className="result-image" src={food.image} alt={food.name} />
                <span>
                  {food.name} - {food.quantity}g - {food.calories} kcal - EcoScore: {food.ecoscore}
                </span>
                <div>
                  <button onClick={() => deleteFood(index)}>Eliminar</button>
                </div>
              </div>
            ))
          ) : (
            <p>No hay alimentos registrados.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegistroAlimentos;
