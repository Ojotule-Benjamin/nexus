export const API_CONFIG = {
  version: process.env.API_VERSION || "v1",
  basePath: "/api",
} as const;

export const getApiPath = (path: string) => {
  console.log(path);
  return `${API_CONFIG.basePath}/${API_CONFIG.version}${path}`;
};
