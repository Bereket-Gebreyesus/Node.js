import app from "../app.js";
import supertest from "supertest";

const request = supertest(app);


describe("GET /", () => {
  it("responds with 'hello from backend to frontend!'", async () => {
    const response = await request.get("/");
    expect(response.status).toBe(200);
    expect(response.text).toBe("hello from backend to frontend!");
  });
});

describe("POST /weather", () => {
  it("responds with weather data", async () => {
      const cityName = "London";
      const response = await request.post("/weather").send({ cityName });
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("weather");
      
  });

  it("responds with error for invalid city", async () => {
    const cityName = "InvalidCityName";
    const response = await request.post("/weather").send({ cityName });
    expect(response.status).toBe(404); 
    expect(response.body).toHaveProperty("error");
});

  it("responds with error for empty city name", async () => {
    const cityName = "";
    const response = await request.post("/weather").send({ cityName });
    expect(response.status).toBe(400); 
    expect(response.body).toHaveProperty("error");
});
});