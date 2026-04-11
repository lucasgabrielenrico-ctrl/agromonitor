exports.handler = async (event, context) => {
  const cors = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: cors, body: '' };
  }

  try {
    const payload = JSON.parse(event.body);
    const { bbox, time, width, height, layer } = payload;

    const tokenRes = await fetch('https://identity.dataspace.copernicus.eu/auth/realms/CDSE/protocol/openid-connect/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: 'sh-c7007a75-beb3-4988-ac19-75e650936ef6',
        client_secret: 'xNlNCZ2K33HaNr5y8fswsIhUIZ5uZacu',
      }),
    });
    const tokenData = await tokenRes.json();
    const token = tokenData.access_token;

    const wmsUrl = new URL('https://sh.dataspace.copernicus.eu/ogc/wms/dbd04f79-bcc0-404f-b901-1a1b7ff53e28');
    wmsUrl.searchParams.set('SERVICE', 'WMS');
    wmsUrl.searchParams.set('REQUEST', 'GetMap');
    wmsUrl.
