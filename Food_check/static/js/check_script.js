function check() {
  var item = document.getElementById("items").value;
  var resultContainer = document.getElementById("result");
  var food = document.getElementById("food");
  var nutrient = document.getElementById("nutritionTable");
  // Clear the previous content
  resultContainer.innerHTML =
    "<p>Result of the Ingredients are being Checked.</p><br/>";
  food.innerHTML = "";
  nutrient.innerHTML = "";
  console.log(item);
  data = {
    item: item,
  };
  console.log("Sending data: " + JSON.stringify(data));
  sendData(data);
}

function sendData(data) {
  const csrftoken = getCookie("csrftoken");

  $.ajax({
    url: "/data/", // Update with your URL
    type: "POST",
    headers: {
      "X-CSRFToken": csrftoken,
    },
    contentType: "application/json",
    data: JSON.stringify(data),
    // Set to 5 seconds for timeout limit
    timeout: 30000,
    success: function (response) {
      console.log("Data sent successfully.");
      if (response.success == true) {
        console.log(response.data);
        Result(response.data);
      } else {
        console.error("Data is Recived from the Server.");
      }
    },
    error: function (xhr, status, error) {
      console.error("Error:", error);
    },
  });
}
//Function to write result in the Document.
function Result(data) {
  var resultContainer = document.getElementById("result");

  // Clear the previous content
  resultContainer.innerHTML = "";

  // Split the data by newlines to create separate paragraphs
  var paragraphs = data.split("\n");

  // Iterate over each paragraph and create a new <p> element for each
  paragraphs.forEach(function (text) {
    var p = document.createElement("p");
    p.innerText = text;
    // Add a margin to create space between paragraphs
    p.style.marginBottom = "10px";
    resultContainer.appendChild(p);
  });
  checkIngredient();
  console.log("checking Ingredient is C   onsumed by Humans.");
}

// Function to get CSRF token from cookie
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

function checkIngredient() {
  // List of known food ingredients
  const inediblefruits = [
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
  // Get the input value
  const food = document.getElementById("items").value;
  const input = food.toLowerCase().trim();
  console.log(input);
  // Check if the input is in the list of food ingredients
  const isIngredient = inediblefruits.includes(input);

  // Display the result
  const foodElement = document.getElementById("food");
  foodElement.innerHTML = "";
  if (isIngredient) {
    foodElement.innerHTML = `<p>"${food}" is not consumed by Humans.</p><br/>`;
    console.log(`${input} is consumed by Humans.`);
    foodElement.style.color = "red";
  } else {
    foodElement.innerHTML = `<p>"${food}" is consumed by Humans.</p><br/>`;
    console.log(`${input} is consumed by Humans.`);
    foodElement.style.color = "green";
    fetchNutritionData();
  }
}

const apiKey = ""; // Replace with your USDA API key

async function fetchNutritionData() {
  const foodItem = document.getElementById("items").value.trim();
  var foodElement = document.getElementById("food");
  var resultContainer = document.getElementById("result");

  if (!foodItem) {
    resultContainer.innerHTML = "";
    foodElement.innerHTML = "";
    foodElement.style.color = "black";
    resultContainer.innerHTML = `<p>Given "${foodItem}" is not a food.</p><br/>`;
    foodElement.innerHTML = "<p>Please enter a food item.</p><b/>";
    return;
  }

  const apiUrl = `https://api.nal.usda.gov/fdc/v1/foods/search?query=${foodItem}&api_key=${apiKey}`;
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    displayNutritionData(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    foodElement.innerHTML = "";
    foodElement.style.color = "black";
    foodElement.innerHTML = `<p>Given "${foodItem}" is not a food.</p><br/>`;
  }
}

function displayNutritionData(data) {
  const food = data.foods[0];
  const foodItem = document.getElementById("items").value.trim();
  var foodElement = document.getElementById("food");
  if (!food) {
    foodElement.innerHTML = "";
    foodElement.style.color = "black";
    foodElement.innerHTML = `<p>Given "${foodItem}" is not a food.</p><br/>`;
    return;
  }

  const nutrients = food.foodNutrients;
  const tableDiv = document.getElementById("nutritionTable");
  let tableHtml = `<table>
        <tr><th>Nutrient</th><th>Amount</th></tr>`;

  nutrients.forEach((nutrient) => {
    tableHtml += `<tr>
            <td>${nutrient.nutrientName}</td>
            <td>${nutrient.value} ${nutrient.unitName}</td>
        </tr>`;
  });

  tableHtml += `</table>`;
  tableDiv.innerHTML = tableHtml;
}
