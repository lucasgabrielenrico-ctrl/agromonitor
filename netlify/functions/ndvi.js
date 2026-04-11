exports.handler = async (event, context) => {
  const cors = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: cors, body: '' };
  }

  try {
    const body = JSON.parse(event.body);

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

    // Llamar a Process API
    const ndviRes = await fetch('https://sh.dataspace.copernicus.eu/api/v1/process', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!ndviRes.ok) {
      const err = await ndviRes.text();
      return { statusCode: ndviRes.status, headers: cors, body: err };
    }

    const buffer = await ndviRes.arrayBuffer();
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
