import React, { useState } from "react";
import axios from "axios";
import $ from 'jquery';
import "./App.css";

function App() {
  const [item, setItem] = useState("");
  const [result, setResult] = useState("");
  const [foodInfo, setFoodInfo] = useState("");
  const [nutritionTable, setNutritionTable] = useState("");

  const handleCheck = () => {
    const itemValue = item.trim();
    if (!itemValue) {
      setResult(<p>{"Please enter an ingredient name."}</p>);
      setFoodInfo("");
      setNutritionTable("");
      return;
    }

    setResult(<p>{"Result of the Ingredients are being Checked."}</p>);
    setFoodInfo("");
    setNutritionTable("");

    const data = { item: itemValue };
    fetchCsrfToken(data);
  };

  const fetchCsrfToken = async (data) => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/get-csrf-token/");
      const csrfToken = response.data.csrfToken;
      console.log("CSRF Token set.");
      sendData(data, csrfToken);
    } catch (error) {
      console.error("Error fetching CSRF token:", error);
    }
  };

  const sendData = (data, csrfToken) => {
    console.log("CSRF Token received.");
    console.log("Data to send:", data);
    $.ajax({
      url: "http://127.0.0.1:8000/receive-data/",
      type: "POST",
      contentType: "application/json",
      headers: {
        "X-CSRFToken": csrfToken,
      },
      data: JSON.stringify(data),
      success: function (response) {
        console.log("Data sent successfully.");
        if (response.success) {
          console.log("Sucessfully recived Response.");
          displayResult(response.data);
        } else {
          console.error("Data received from the server is not successful.");
        }
      },
      error: function (xhr, status, error) {
        console.error("Error:", error);
      },
    });
  };

  const displayResult = (data) => {
    console.log("Fetching its Nutrition Values.");

    let action = fetchNutritionData();

    action
      .then((condition) => {
        console.log("Action: " + condition); // Logs the resolved value of the promise
        console.log("Action Boolean: " + Boolean(condition)); // Logs the boolean representation of the resolved value

        // Processing the result
        if (condition === true) {
          console.log("Nutrition data found:", condition);
          // Process data and set result
          const paragraphs = data.split("\n");
          const resultHTML = paragraphs.map((text, index) => (
            <p key={index} style={{ marginBottom: "10px" }}>
              {text}
            </p>
          ));
          setResult(resultHTML);

          // Check if ingredient is consumed by humans
          console.log("Checking if ingredient is consumed by humans.");
          checkIngredient();
        } else {
          console.log("Nutrition data not found.");
        }
      })
      .catch((error) => {
        console.error("Error:", error); // Handle any errors that occur during the promise execution
      });
  };

  const checkIngredient = () => {
    const inedibleFruits = [
      "abacá",
      "alemow",
      "alpine honeysuckle",
      "asparagus berries",
      "baneberry",
      "bittersweet",
      "bitter cherry",
      "black bryony",
      "buckthorn",
      "canadian moonseed",
      "cassowary plum",
      "castor bean",
      "ceylon durian",
      "chinaberry",
      "clusias",
      "coral honeysuckle",
      "corky passionfruit",
      "coyote melon",
      "cretan date palm",
      "crown flower",
      "deadly nightshade",
      "durian anggang",
      "ensete",
      "european holly",
      "european spindle",
      "firethorn",
      "florida thatch palm",
      "fox head",
      "ghost bramble",
      "glossy nightshade",
      "golden dewdrop",
      "harlequin glorybower",
      "herb-paris",
      "holly",
      "honeybush",
      "honeyvine",
      "ink berry",
      "ivy",
      "japanese star anise",
      "jatropha fruit",
      "laurel",
      "lily of the valley",
      "linden",
      "manchineel",
      "mape tree",
      "masuri berry",
      "mezereum",
      "mistletoe",
      "osage-orange",
      "paddy melon",
      "pangium edule",
      "poisonberry",
      "pokeweed",
      "privet",
      "rattlebox",
      "redoul",
      "rosary pea",
      "sandbog death camas",
      "sausage tree",
      "sea mango",
      "silverbell",
      "snowberry",
      "soapberry",
      "sponge gourd",
      "strychnine tree",
      "suicide tree fruit",
      "syringa berrytree",
      "tamanu",
      "thorn apple",
      "tickberry",
      "tormentil",
      "trifoliate orange",
      "tropical soda apple",
      "tung tree",
      "virginia creeper",
      "wahoo",
      "weeping pear",
      "wild arum",
      "wild cucumber",
      "wild olive",
      "winter cherry",
      "yellow buckeye",
      "yellow oleander",
      "yew cones with seeds unremoved",
      "yew plum pine",
    ];
    const input = item.toLowerCase().trim();
    console.log(input);
    const isIngredient = inedibleFruits.includes(input);
    if (isIngredient) {
      setFoodInfo(
        <p style={{ color: "red" }}>"{item}" is not consumed by humans.</p>
      );
      console.log(`${input} is not consumed by humans.`);
    } else {
      setFoodInfo(
        <p style={{ color: "green" }}>"{item}" is consumed by humans.</p>
      );
      console.log(`${input} is consumed by humans.`);
    }
  };

  const fetchNutritionData = async () => {
    const foodItem = item.trim();
    if (!foodItem) {
      setResult(null);
      setFoodInfo(null);
      setResult(<p>{`Given ${foodItem} is not a food.`}</p>);
      console.log(`${foodItem} is not a food.`);
      return false; // Return false when foodItem is not provided
    }

    const apiKey = ""; // Replace with your USDA API key
    const apiUrl = `https://api.nal.usda.gov/fdc/v1/foods/search?query=${foodItem}&api_key=${apiKey}`;

    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      return displayNutritionData(data); // Return the value returned by displayNutritionData
    } catch (error) {
      console.error("Error fetching data:", error);
      setFoodInfo(null);
      setResult(<p>{`Given ${foodItem} is not a food.`}</p>);
      console.log(`Given ${foodItem} is not a food`);
      return false; // Return false if there's an error fetching data
    }
  };

  const displayNutritionData = (data) => {
    const food = data.foods[0];
    if (!food) {
      setFoodInfo(null);
      setResult(<p>{`Given ${item} is not a food.`}</p>);
      console.log(`Given ${item} is not a food`);
      return false; // Return false if food data is not available
    }

    const nutrients = food.foodNutrients;
    const tableHtml = (
      <table>
        <thead>
          <tr>
            <th>Nutrient</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {nutrients.map((nutrient, index) => (
            <tr key={index}>
              <td>{nutrient.nutrientName}</td>
              <td>
                {nutrient.value} {nutrient.unitName}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );

    setNutritionTable(tableHtml);
    return true; // Return true if nutrition data is successfully displayed
  };

  /*
  const getCookie = (name) => {
    let cookieValue = null;
    if (document.cookie && document.cookie !== "") {
      const cookies = document.cookie.split(";");
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.substring(0, name.length + 1) === name + "=") {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  };
*/
  return (
    <div className="container">
      <form id="CheckForm" onSubmit={(e) => e.preventDefault()}>
        <div className="Ingingredients">
          <label htmlFor="items" className="Ingingredient_label">
            Ingredients:
          </label>
          <label htmlFor="items" className="input_label">
            Enter Ingredient name:
          </label>
          <input
            id="items"
            type="text"
            value={item}
            onChange={(e) => setItem(e.target.value)}
          />
          <button className="check" type="button" onClick={handleCheck}>
            Check
          </button>
        </div>
      </form>
      <div className="Results">
        <label className="Result_label">Checked Results:</label>
        <div id="result">{result}</div>
        <div id="food">{foodInfo}</div>
        <div id="nutritionTable">{nutritionTable}</div>
      </div>
    </div>
  );
}

export default App;
