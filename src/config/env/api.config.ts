import { registerAs } from "@nestjs/config";

export default registerAs("api", () => {
  const { API_PREFIX, PORT } = process.env;
  
  return {
    prefix: API_PREFIX || 'api/v1',
    port: Number(PORT) || 3000,
  };

} );