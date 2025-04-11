/**
 * A pre-configured instance of the `CosmosClient` from the `@azure/cosmos` package.
 * 
 * This client is initialized using the `COSMOS_ENDPOINT` and `COSMOS_KEY` environment variables.
 * Ensure these variables are properly set in your environment before using this client.
 * 
 * Usage:
 * Import this client and follow the usage instructions provided in the official Azure Cosmos DB SDK documentation:
 * https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/cosmosdb/cosmos/README.md
 * 
 * Example:
 * ```typescript
 * import cosmosClient from './lib/cosmos';
 * 
 * // Use the client as described in the Azure SDK documentation
 * const database = cosmosClient.database('Catalogs');
 * const container = database.container('CatalogConfigurations');
 * ```
 */
import { CosmosClient } from "@azure/cosmos";
const { COSMOS_ENDPOINT, COSMOS_KEY } = process.env;


export default new CosmosClient({
  endpoint: COSMOS_ENDPOINT,
  key: COSMOS_KEY,
});