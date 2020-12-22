// Based on https://gist.github.com/wspringer/4e9ce45bf4e3fc6f972c3a659735c1e6#file-cf-api-gateway-js

async function latestKeys() {
    console.log('Fetching latest')
    const latest = await fetch(
      new Request('https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com'),
    )
    return latest.json()
  }
  
  async function latestOrCached() {
    const cached = await JWKS.get('keys', 'json')
    if (cached) {
      return cached
    } else {
      const latest = await latestKeys()
      JWKS.put('keys', JSON.stringify(latest), { expirationTtl: 120 })
      return latest
    }
  }

  function extractToken(request) {
    const auth = request.headers.get('Authorization')
    const match = auth ? auth.match(/Bearer (.*)/i) : null
    const token = match ? match[1] : null
    return token
  }

export { extractToken, latestOrCached }