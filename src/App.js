import { useState } from "react";
import { useEffect } from "react";
import { Nutrition } from "./Nutrition";
import { LoaderPage } from "./LoaderPage";
import Swal from 'sweetalert2';
import video  from "./food.mp4";
import './App.css';
function App() {

  const [mySearch, setMySearch] = useState('');
  const [wordSubmitted, setWordSubmitted] = useState('');
  const [myNutrition, setMyNutrition] = useState([]);
  const [stateLoader, setStateLoader] = useState(false);

  const APP_ID = 'dc43f5c9';
  const APP_KEY = '41004f36187693a52846881269bea7f0';
  const APP_URL = 'https://api.edamam.com/api/nutrition-details'

  const fetchData = async (ingr) => {
    setStateLoader(true);

    const response = await fetch(`${APP_URL}?app_id=${APP_ID}&app_key=${APP_KEY}`, {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ingr: ingr })
    })

    if(response.ok) {
      setStateLoader(false);
      const data = await response.json();
      setMyNutrition(data.ingredients);
    } else {
      setStateLoader(false);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Ingredients entered incorrectly!",
        background: '#fbf6ee',
        confirmButtonColor: '#65B741',
        customClass: {
          title: 'custom-title',
          content: 'custom-content'
        }
      });
    }
  }

  const myRecipeSearch = e => {
    setMySearch(e.target.value);
  }

  const finalSearch = e => {
    e.preventDefault();
    setWordSubmitted(mySearch);
  }

  useEffect(() => {
    if (wordSubmitted !== '') {
      let ingr = wordSubmitted.split(/[,,;,\n,\r]/);
      fetchData(ingr);
    }
  }, [wordSubmitted])

  const resetForm = () => {
    setMySearch('');
    setMyNutrition([]);
  };

  return (
    <div className="App">
    {stateLoader && <LoaderPage />}
    <video autoPlay muted loop>
      <source src={video} type="video/mp4" />
    </video>
    <h1>Analyze your recipe</h1> 

    <div className='container'>
      <p>Enter an ingredient list for what you are cooking, like <span>"1 cup rice, 10 oz chickpeas"</span>, etc.
      Enter each ingredient on a new line.</p>

      <div className='box'>
        <div>
          <form onSubmit={finalSearch}>
            <input className='search'
              placeholder="Search..."
              onChange={myRecipeSearch}
              value={mySearch}
            />
            <div className="btn_box">
              <button className='btn' type="submit">Analyze</button>
              <button className='btn' type="button" onClick={resetForm}>New recipe</button>
            </div>
          </form>
          <div className='box_weight'>
            <div className='ingredient'>
            <p className='text'>Qty</p>
            <p className='text'>Unit</p>
            <p className='text'>Food</p>
            <p className='text'>Calories</p>
            <p className='text'>Weight</p>  
            </div>
        {myNutrition.map((ingredient, index) => (
              <div key={index} className='ingredient'>
                <p>{ingredient.parsed[0].quantity}</p>
                <p>{ingredient.parsed[0].measure}</p>
                <p>{ingredient.parsed[0].food}</p>
                <p>{ingredient.parsed[0].nutrients.ENERC_KCAL.quantity.toFixed(2)} kcal</p>
                <p>{ingredient.parsed[0].weight.toFixed(2)} g</p>
              </div>
                 ))}
          </div> 
      
        </div>
        <div className='box_calories'>
          <h2>Nutrition Facts</h2>
          <hr />
          {
            myNutrition.length > 0 && <h3>{myNutrition.reduce((sum, ingredient) => sum + ingredient.parsed[0].nutrients.ENERC_KCAL.quantity, 0).toFixed(2)} Calories</h3>
          }
          {
            myNutrition.length > 0 && Object.entries(myNutrition[0].parsed[0].nutrients).map(([key, { label, quantity, unit }]) => (
              <Nutrition
                key={key}
                label={label}
                quantity={parseFloat(quantity.toFixed(2))}
                unit={unit}
              />
            ))
          }
        </div>
      </div>
    </div>
  </div>
);
}

export default App;
