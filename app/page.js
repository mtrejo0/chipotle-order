'use client'
import { useState } from 'react';

const ingredients = {
  base: [
    { name: 'White Rice', color: '#FFFFFF' },
    { name: 'Brown Rice', color: '#8B4513' },
    { name: 'Lettuce', color: '#90EE90' }
  ],
  beans: [
    { name: 'Black Beans', color: '#000000' },
    { name: 'Pinto Beans', color: '#DEB887' },
  ],
  protein: [
    { name: 'Chicken', color: '#F0E68C' },
    { name: 'Steak', color: '#8B0000' },
    { name: 'Carnitas', color: '#CD853F' },
    { name: 'Barbacoa', color: '#A52A2A' },
    { name: 'Sofritas', color: '#E9967A' },
    { name: 'Veggie', color: '#228B22' }
  ],
  salsa: [
    { name: 'Pico De Gallo', color: '#FF6347' },
    { name: 'Green Chili Salsa', color: '#32CD32' },
    { name: 'Red Chili Salsa', color: '#DC143C' },
  ],
  toppings: [
    { name: 'Fajita Veggies', color: '#FF4500' },
    { name: 'Cheese', color: '#FFFF00' },
    { name: 'Sour Cream', color: '#F0FFFF' },
  ],
  extras: [
    { name: 'Queso Blanco', color: '#FFFDD0' },
    { name: 'Guacamole', color: '#7CFC00' }
  ]
};

export default function Home() {
  const [order, setOrder] = useState([]);

  const addToOrder = (item) => {
    setOrder([...order, item]);
  };

  const removeFromOrder = (index) => {
    setOrder(order.filter((_, i) => i !== index));
  };

  const renderIngredientButtons = (category) => {
    return ingredients[category].map((item) => (
      <button
        key={item.name}
        onClick={() => addToOrder(item)}
        className="m-1 p-2 text-white rounded-lg flex items-center justify-center"
        style={{ backgroundColor: item.color, color: getContrastColor(item.color) }}
      >
        {item.name}
      </button>
    ));
  };

  const getContrastColor = (hexColor) => {
    // Convert hex to RGB
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    
    // Calculate luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    
    // Return black or white based on luminance
    return luminance > 0.5 ? '#000000' : '#FFFFFF';
  };

  const sortedOrder = () => {
    const categoryOrder = ['base', 'beans', 'protein', 'salsa', 'toppings', 'extras'];
    return categoryOrder.flatMap(category => 
      order.filter(item => ingredients[category].some(i => i.name === item.name))
    );
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-8">
      <h1 className="text-4xl font-bold mb-8">Build Your Chipotle Bowl</h1>

      <div className="w-full max-w-4xl">
        <h2 className="text-2xl font-semibold mb-4">Choose Your Ingredients:</h2>
        
        {Object.keys(ingredients).map((category) => (
          <div key={category} className="mb-6">
            <h3 className="text-xl font-medium mb-2">{category.charAt(0).toUpperCase() + category.slice(1)}:</h3>
            <div className="flex flex-wrap">{renderIngredientButtons(category)}</div>
          </div>
        ))}

        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">My Order:</h2>
          {order.length === 0 ? (
            <p>Your bowl is empty. Add some ingredients!</p>
          ) : (
            <ul className="list-none">
              {Object.keys(ingredients).map(category => {
                const categoryItems = sortedOrder().filter(item => 
                  ingredients[category].some(i => i.name === item.name)
                );
                if (categoryItems.length === 0) return null;
                return (
                  <li key={category} className="flex items-center mb-2">
                    {category.charAt(0).toUpperCase() + category.slice(1)}: 
                    {categoryItems.map((item, index) => (
                      <button
                        key={item.name}
                        className="m-1 p-2 text-white rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: item.color, color: getContrastColor(item.color) }}
                        onClick={() => removeFromOrder(order.findIndex(orderItem => orderItem.name === item.name))}
                      >
                        {item.name}
                      </button>
                    ))}
                  </li>
                );
              })}
            </ul>
          )}
        </div>

      </div>
    </main>
  );
}
