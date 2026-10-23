// Функція-фабрика: створює об'єкт товару з переданих даних.
// Якщо якесь поле не передали, воно отримує значення "" (порожній рядок).
function createProduct(data) {
  const product = {
    article: data.article,
    id: data.id,
    name: data.name,
    country: data.country,
    price1: data.price1,
    price2: data.price2,
    price3: data.price3,
    quantity: data.quantity,
  };

  // Перебираємо всі поля товару і замінюємо незадані значення на ""
  for (const key in product) {
    if (product[key] === undefined) {
      product[key] = "";
    }
  }

  return product;
}

// 10 початкових товарів
const products = [
  createProduct({ article: "DM1460BLK", id: 1, name: "1460 Lace-Up Boots", country: "United Kingdom", price1: 8200, price2: 7600, price3: 6900, quantity: 8 }),
  createProduct({ article: "KS-CRST21", id: 2, name: "Lace Corset", country: "United Kingdom", price1: 2400, price2: 2650, price3: 2900, quantity: 5 }),
  createProduct({ article: "NR-M227S1", id: 3, name: "Metal Cowboy Boots", country: "Spain", price1: 11500, price2: 10800, price3: 11200, quantity: 3 }),
  createProduct({ article: "NR-BLT44", id: 4, name: "Leather Buckle Belt", country: "Spain", price1: 1900, price2: 1750, price3: 1600, quantity: 14 }),
  createProduct({ article: "RS-CHK08", id: 5, name: "O-Ring Choker", country: "Poland", price1: 320, price2: 350, price3: 390, quantity: 40 }),
  createProduct({ article: "RS-SKRT32", id: 6, name: "Plaid Chain Skirt", country: "Poland", price1: 1300, price2: 1300, price3: 1150, quantity: 11 }),
  createProduct({ article: "PR-OPQ505", id: 7, name: "Victorian Gothic Dress", country: "China", price1: 3100, price2: 2850, price3: 3300, quantity: 6 }),
  createProduct({ article: "PR-JK7T12", id: 8, name: "Studded Biker Jacket", country: "China", price1: 5600, price2: 5200, price3: 4700, quantity: 9 }),
  createProduct({ article: "DMN-SWNG815", id: 9, name: "Lace-Up Platforms", country: "USA", price1: 4300, price2: 4600, price3: 4950, quantity: 7 }),
  createProduct({ article: "UA-RNG925", id: 10, name: "Silver Skull Ring", country: "Ukraine", price1: 1450, price2: 1380, price3: 1520, quantity: 20 }),
];

console.log("Початковий список товарів:");
console.table(products);

// 1а. Впорядкування товарів за країною походження.
function sortByCountry(productList) {
  const sortedList = [...productList];
  sortedList.sort((a, b) => a.country.localeCompare(b.country));
  return sortedList;
}

function average(numbers) {
  let sum = 0;
  numbers.forEach((number) => {
    sum = sum + number;
  });
  return sum / numbers.length;
}

// 1b. Середня ціна товару з однієї і тієї ж країни
function avgPriceByCountry(productList) {
  const validProducts = productList.filter((product) => {
    return product.country !== "" && product.price3 !== "" && product.price3 !== null;
  });

  const countries = [];
  validProducts.forEach((product) => {
    if (!countries.includes(product.country))
    {
      countries.push(product.country);
    }
  });

  const result = [];
  countries.forEach((country) => {
    const countryProducts = validProducts.filter((product) => product.country === country);

    const prices = countryProducts.map((product) => product.price3);

    result.push({
      country: country,
      avgPrice: Math.round(average(prices) * 100) / 100
    });
  });
  return result;
}

const sortedProducts = sortByCountry(products);
console.log("\n1а. Товари, впорядковані за країною походження:");
console.table(sortedProducts);

const averagePrices = avgPriceByCountry(sortedProducts);
console.log("\n1б. Середня діюча ціна товарів за країнами:");
console.table(averagePrices);

// 2. Товар з мінімальною «вартість2_недіюча» (price2) — повертаємо його id
function findMinPrice2Id(productList) {
  const validProducts = productList.filter((product) => {
    return product.price2 !== "" && product.price2 !== null;
  });

  const prices = validProducts.map((product) => product.price2);
  const minPrice = Math.min(...prices);

  const minProduct = validProducts.find((product) => product.price2 === minPrice);
  return minProduct.id;
}

const minPrice2Id = findMinPrice2Id(products);
console.log("\n2. Внутрішній id товару з мінімальною price2:", minPrice2Id);

// 3. Додавання нового товару

// Перевіряє, чи заповнені всі поля товару
function isProductComplete(product) {
  const values = Object.values(product);
  return values.every((value) => value !== "" && value !== null);
}

function addProduct(productList, data) {
  const newProduct = createProduct(data);

  if (isProductComplete(newProduct)) {
    productList.unshift(newProduct);
  } else {
    productList.push(newProduct);
  }
}

addProduct(products, { article: "KS-GLV17", id: 11, name: "Fishnet Gloves", country: "United Kingdom", price1: 450, price2: 420, price3: 400, quantity: 25 });
addProduct(products, { article: "UA-BAG03", id: 12, name: "Coffin Backpack", price2: 2100, price3: 2300, quantity: 4 });

console.log("\n3. Список після додавання двох нових товарів:");
console.table(products);

// 4. Динаміка зміни ціни кожного товару

function isDecreasing(prices) {
  return prices.every((price, index) => index === 0 || price < prices[index - 1]);
}

function isIncreasing(prices) {
  return prices.every((price, index) => index === 0 || price > prices[index - 1]);
}

function getPriceTrend(product) {
  const prices = [product.price1, product.price2, product.price3]

  if (!prices.every((price) => price !== "" && price !== null)) {
    return "not enough data";
  } else if (isDecreasing(prices)) {
    return "steadily getting cheaper";
  } else if (isIncreasing(prices)) {
    return "steadily increasing in price ";
  } else {
    return "unstable changes";
  }
}

function getPriceDynamics(productList) {
  return productList.map((product) => {
    return {
      id: product.id,
      name: product.name,
      trend: getPriceTrend(product),
    };
  });
}

console.log("\n4. Динаміка зміни цін товарів:");
console.table(getPriceDynamics(products));


