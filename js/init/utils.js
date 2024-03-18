export const loadEnvFile = async (path) => {
  const requestEnvContent = await fetch(path).catch((e) => console.log(e));
  if (requestEnvContent.status === 404) {
    return null;
  }
  const envContent = await requestEnvContent.json();
  return envContent;
};

export const getDefaultEnvPath = () => {
  const paramsUrl = new URLSearchParams(window.location.search);
  return paramsUrl.get("env") || "apps/settings.json";
};

export const getDefaultTheme = () => {
  const paramsUrl = new URLSearchParams(window.location.search);
  return paramsUrl.get("theme");
};
