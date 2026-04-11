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
    return {
      statusCode: 200,
      headers: cors,
      body: JSON.stringify({ ok: true, layer: layer || 'NDVI' }),
    };
  } catch (e) {
    return { statusCode: 500, headers: { 'Access-Control-Allow-Origin': '*' }, body: JSON.stringify({ error: e.message }) };
  }
};
