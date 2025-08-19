const config = {
  development: {
    API_URL: "http://localhost:5000/api",
  },
  production: {
    API_URL: "https://your-backend-url.render.com/api", // Replace with your backend URL
  },
};

const environment = process.env.NODE_ENV || "development";
export default config[environment];
