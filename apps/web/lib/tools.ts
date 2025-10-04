// Runtime tool registry (for server-side tool invocation if you choose a tool loop)
import { searchTWG } from './search';
import { searchExternal } from './external';

export const tools = { 
  search_twg: searchTWG, 
  search_external: searchExternal 
};
