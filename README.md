# KVG-ExpressAPI 🚀

![GitHub stars](https://img.shields.io/github/stars/maxverwiebe/KVG-ExpressAPI?style=social)
![GitHub forks](https://img.shields.io/github/forks/maxverwiebe/KVG-ExpressAPI?style=social)
![GitHub issues](https://img.shields.io/github/issues/maxverwiebe/KVG-ExpressAPI)
![GitHub pull requests](https://img.shields.io/github/issues-pr/maxverwiebe/KVG-ExpressAPI)
![License](https://img.shields.io/github/license/maxverwiebe/KVG-ExpressAPI)

> A modern API built with Express.js for retreiving realtime data of the "Kieler Verkehrsgesellschaft" (KVG) data.

## 🌟 Features

- **Fast and Efficient**: Built with performance in mind.
- **Easy to Use**: Simple endpoints with clear documentation.
- **Scalable**: Ready to handle large amounts of data.
- **Secure**: The endpoints are only accessable with a valid key

## 🚀 Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/maxverwiebe/KVG-ExpressAPI.git
   ```

2. Install dependencies:
   ```bash
   npm install
   ```
3. Adjust the configuation file:
   ```bash
   ./config.json
   ```

4. Start the server:
   ```bash
   node server/index.js
   ```

## ⚙️ Generating the .csv
The generator sends requests to the unofficial API of the KVG to assign the stop name to each ID. The result is stored in a csv file.
1. Adapt the search range in:
   ```bash
   tools/csv_generator_improved.js
   ```

1. Start the generation:
   ```bash
   node tools/csv_generator_improved.js
   ```

## Endpoints

### 1. `/request_kvg`

- **Method**: GET
- **Description**: A basic endpoint for testing.
- **Headers**:
  - `X-API-KEY`: Your API key
- **Responses**:
  - `200 OK`: Successful request
  - `401 Unauthorized`: Missing API key
  - `403 Forbidden`: Invalid API key

### 2. `/stations/get_departing_busses/:type/:id`

- **Method**: GET
- **Description**: Fetches departing buses from a station.
- **Parameters**:
  - `type`: Can be "name" or "id"
  - `id`: The station name or ID
- **Headers**:
  - `X-API-KEY`: Your API key
- **Responses**:
  - `200 OK`: Successful request with JSON data
  - `401 Unauthorized`: Missing API key
  - `403 Forbidden`: Invalid API key
  - `404 Not Found`: Bus station not found
  - `500 Internal Server Error`: Error fetching station ID

### 3. `/stations/get_busses/:type/:id`

- **Method**: GET
- **Description**: Fetches all buses from a station.
- **Parameters**:
  - `type`: Can be "name" or "id"
  - `id`: The station name or ID
- **Headers**:
  - `X-API-KEY`: Your API key
- **Responses**:
  - `200 OK`: Successful request with JSON data
  - `401 Unauthorized`: Missing API key
  - `403 Forbidden`: Invalid API key
  - `404 Not Found`: Bus station not found
  - `500 Internal Server Error`: Error fetching station ID

**Example using Axios**:

```javascript
const axios = require('axios');

axios.get('http://your-api-url/stations/get_busses/name/StationName', {
  headers: {
    'X-API-KEY': 'your-api-key'
  }
})
.then(response => {
  console.log(response.data);
})
.catch(error => {
  console.error('Error:', error);
});
```

### 4. `/trips/get_trip/:id`

- **Method**: GET
- **Description**: Fetches information about a running trip.
- **Parameters**:
  - `id`: The station name or ID
- **Headers**:
  - `X-API-KEY`: Your API key
- **Responses**:
  - `200 OK`: Successful request with JSON data
  - `401 Unauthorized`: Missing API key
  - `403 Forbidden`: Invalid API key
  - `404 Not Found`: Bus station not found
  - `500 Internal Server Error`: Error fetching station ID

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📜 License

This project is [MIT](./LICENSE) licensed.