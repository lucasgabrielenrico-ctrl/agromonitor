exports.handler = async (event, context) => {
  const cors = {'Access-Control-Allow-Origin':'*','Access-Control-Allow-Headers':'Content-Type'};
  if (event.httpMethod === 'OPTIONS') return {statusCode:200,headers:cors,body:''};
  try {
    const {bbox,time,width,height,layer} = JSON.parse(event.body);
    const tr = await fetch('https://identity.dataspace.copernicus.eu/auth/realms/CDSE/protocol/openid-connect/token',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams({grant_type:'client_credentials',client_id:'sh-c7007a75-beb3-4988-ac19-75e650936ef6',client_secret:'xNlNCZ2K33HaNr5y8fswsIhUIZ5uZacu'})});
    const token = (await tr.json()).access_token;
    const url = `https://sh.dataspace.copernicus.eu/ogc/wms/dbd04f79-bcc0-404f-b901-1a1b7ff53e28?SERVICE=WMS&REQUEST=GetMap&LAYERS=${layer||'NDVI'}&BBOX=${bbox}&WIDTH=${width||512}&HEIGHT=${height||512}&FORMAT=image/png&CRS=EPSG:4326&VERSION=1.3.0&TIME=${time}&MAXCC=30`;
    const wr = await fetch(url,{headers:{Authorization:'Bearer '+token}});
    if (!wr.ok) return {statusCode:wr.status,headers:cors,body:await wr.text()};
    const base64 = Buffer.from(await wr.arrayBuffer()).toString('base64');
    return {statusCode:200,headers:{...cors,'Content-Type':'image/png'},body:base64,isBase64Encoded:true};
  } catch(e) {
    return {statusCode:500,headers:cors,body:JSON.stringify({error:e.message})};
  }
};
