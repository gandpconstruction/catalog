import { CosmosClient } from "@azure/cosmos";
const { COSMOS_ENDPOINT, COSMOS_KEY } = process.env;

export default new CosmosClient({
  endpoint: COSMOS_ENDPOINT,
  key: COSMOS_KEY,
});