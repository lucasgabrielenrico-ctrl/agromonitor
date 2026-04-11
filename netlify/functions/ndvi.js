exports.handler = async (event, context) => {
  const cors = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: cors, body: '' };
  }

  try {
    const { bbox, time, width, height } = JSON.parse(event.body);

    // Obtener token
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

    // WMS request con token
    const wmsUrl = new URL('https://sh.dataspace.copernicus.eu/ogc/wms/dbd04f79-bcc0-404f-b901-1a1b7ff53e28');
    wmsUrl.searchParams.set('SERVICE', 'WMS');
    wmsUrl.searchParams.set('REQUEST', 'GetMap');
    wmsUrl.searchParams.set('LAYERS', 'NDVI');
    wmsUrl.searchParams.set('BBOX', bbox);
    wmsUrl.searchParams.set('WIDTH', width || 512);
    wmsUrl.searchParams.set('HEIGHT', height || 512);
    wmsUrl.searchParams.set('FORMAT', 'image/png');
    wmsUrl.searchParams.set('CRS', 'EPSG:4326');
    wmsUrl.searchParams.set('VERSION', '1.3.0');
    wmsUrl.searchParams.set('TIME', time);
    wmsUrl.searchParams.set('MAXCC', '30');

    const wmsRes = await fetch(wmsUrl.toString(), {
      headers: { 'Authorization': 'Bearer ' + token }
    });

    if (!wmsRes.ok) {
      const err = await wmsRes.text();
      return { statusCode: wmsRes.status, headers: cors, body: err };
    }

    const buffer = await wmsRes.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');

    return {
      statusCode: 200,
      headers: { ...cors, 'Content-Type': 'image/png' },
      body: base64,
      isBase64Encoded: true,
    };
  } catch (e) {
    return { statusCode: 500, headers: cors, body: JSON.stringify({ error: e.message }) };
  }
};
