import { registerAs } from "@nestjs/config";

export default registerAs("api", () => {
  const { API_PREFIX, PORT } = process.env;
  const missingVars = [
    ['API_PREFIX', API_PREFIX],
    ['PORT', PORT],
  ]
    .filter(([, value]) => !value)
    .map(([name]) => name);

  if (missingVars.length) {
    throw new Error(
      `Missing required API env vars: ${missingVars.join(', ')}`,
    );
  }
  return {
    prefix: API_PREFIX,
    port: Number(PORT),
  };

});