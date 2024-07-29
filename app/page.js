'use client'
import { useState, useEffect } from 'react';

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
    { name: 'Queso Blanco $', color: '#FFFDD0' },
    { name: 'Guacamole $', color: '#7CFC00' }
  ]
};

export default function Home() {

  const [order, setOrder] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("order");
    if (saved) {
      const parsedOrder = JSON.parse(saved);
      if (Array.isArray(parsedOrder) && parsedOrder.length > 0) {
        setOrder(parsedOrder);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('order', JSON.stringify(order));
  }, [order]);

  const addToOrder = (item, amount) => {
    const newItem = { ...item, name: amount === 'normal' ? item.name : `${item.name} (${amount})` };
    setOrder([...order, newItem]);
    setModalOpen(false);
  };

  const removeFromOrder = (index) => {
    setOrder(order.filter((_, i) => i !== index));
  };

  const renderIngredientButtons = (category) => {
    return ingredients[category].filter(item => !order.some(orderItem => orderItem.name.split(' (')[0] === item.name)).map((item) => {
      const handleClick = category === 'salsa' 
        ? () => {
            setSelectedItem(item);
            setModalOpen(true);
          }
        : () => addToOrder(item, 'normal');

      return (
        <button
          key={item.name}
          onClick={handleClick}
          className="m-1 p-2 text-white rounded-lg flex items-center justify-center w-full sm:w-auto"
          style={{ backgroundColor: item.color, color: getContrastColor(item.color) }}
        >
          {item.name}
        </button>
      );
    });
  };

  const getContrastColor = (hexColor) => {
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? '#000000' : '#FFFFFF';
  };

  const sortedOrder = () => {
    const categoryOrder = ['base', 'beans', 'protein', 'salsa', 'toppings', 'extras'];
    return categoryOrder.flatMap(category => 
      order.filter(item => ingredients[category].some(i => i.name === item.name.split(' (')[0]))
    );
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-4 sm:p-8">
      <h1 className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-8 text-center">Build Your Bowl!</h1>

      <div className="w-full max-w-4xl">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">Choose Your Ingredients:</h2>
        
        {Object.keys(ingredients).map((category) => (
          <div key={category} className="mb-6">
            <h3 className="text-lg sm:text-xl font-medium mb-2">{category.charAt(0).toUpperCase() + category.slice(1)}:</h3>
            <div className="flex flex-wrap">{renderIngredientButtons(category)}</div>
          </div>
        ))}

        <div className="mt-8">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4">My Order:</h2>
          {order.length === 0 ? (
            <p>Your bowl is empty. Add some ingredients!</p>
          ) : (
            <ul className="list-none">
              {Object.keys(ingredients).map(category => {
                const categoryItems = sortedOrder().filter(item => 
                  ingredients[category].some(i => i.name === item.name.split(' (')[0])
                );
                if (categoryItems.length === 0) return null;
                return (
                  <li key={category} className="mb-2">
                    <span className="font-medium">{category.charAt(0).toUpperCase() + category.slice(1)}:</span>
                    <div className="flex flex-wrap">
                      {categoryItems.map((item, index) => (
                        <button
                          key={`${item.name}-${index}`}
                          className="m-1 p-2 text-white text-sm rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: item.color, color: getContrastColor(item.color) }}
                          onClick={() => removeFromOrder(order.findIndex(orderItem => orderItem.name === item.name))}
                        >
                          {item.name}
                        </button>
                      ))}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Choose amount for {selectedItem.name}</h3>
            <div className="flex justify-around">
              {['light', 'normal', 'heavy'].map((amount) => (
                <button
                  key={amount}
                  onClick={() => addToOrder(selectedItem, amount)}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  {amount}
                </button>
              ))}
            </div>
            <button
              onClick={() => setModalOpen(false)}
              className="mt-4 bg-gray-300 px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
