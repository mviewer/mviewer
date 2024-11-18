/**
 * Read URL qtype valye to return correct API infos
 * @returns
 */
export const getTypeFromUrl = () => {
  const types = ["ban", "cadastre", "admin"];
  const mvConfig = configuration.getConfiguration();
  const qtype = API.qtype;

  const configTypes = mvConfig.urlparams.qtype;
  if (!mvConfig.urlparams.qtype?.length) {
    return mvConfig.urlparams.qtype;
  } else {
    return _.find(configTypes, ["name", qtype]);
  }
};

export const requestService = () => {
  let { name, url } = getTypeFromUrl();
  if (!url) {
    return;
  }
  if (name == "ban") {
    mviewer.urlParams.requestBan(`${url}?q=${API.q}`);
  }
  if (name == "cadastre") {
    const parameters = decodeURIComponent(API.q);
    mviewer.urlParams.requestApiCartoCadastre(`${url}?${parameters}`, 2000);
  }
  if (name == "admin") {
    const parameters = new URLSearchParams(API.q);
    const service = parameters.get("service");
    parameters.delete("service");
    const pathUrl = `${url}/${service}?${parameters.toString()}`;
    mviewer.urlParams.requestApiCartoAdmin(pathUrl, 2000);
  }
};
