import { generateAccessToken } from "../lib/paypal";

// Test to generate access token from paypal
test('generates token from paypal', async ()=>{
  const tokenResponse = await generateAccessToken();
  console.log("🚀 ~ tokenResponse:", tokenResponse)
  expect(typeof tokenResponse).toBe('string')
expect(tokenResponse.length).toBeGreaterThan(0)
  
})