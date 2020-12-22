// Based on https://gist.github.com/wspringer/4e9ce45bf4e3fc6f972c3a659735c1e6#file-cf-api-gateway-js
import jwt from 'jsonwebtoken'
import getPem from 'rsa-pem-from-mod-exp'
import { handleOptions, newCorsResponse } from './cors' 
import { extractToken, latestOrCached } from './jwt'

addEventListener('fetch', event => {
  const request = event.request
  if (request.method === "OPTIONS") {
    // Handle CORS preflight requests
    event.respondWith(handleOptions(request))
  }
  else if(
    request.method === "GET"
  ){
    event.respondWith(handleGetRequest(request))
  }
  else if(
    request.method === "POST"
  ){
    // Handle requests to the API server
    event.respondWith(handlePostRequest(request))
  }
  else {
    event.respondWith(
      new Response(null, {
        status: 405,
        statusText: "Method Not Allowed",
      }),
    )
  }
})

async function updateUser(request, decoded) {
  await TUTORING_APP_USERS.put(decoded.sub, request.body);
  return await TUTORING_APP_USERS.get(decoded.sub);
}

async function handleGetRequest(request) {
  const url = new URL(request.url);
  const sub = url.pathname.split('/').pop()
  const data = await TUTORING_APP_USERS.get(sub);
  return newCorsResponse(data, {});
}

async function handlePostRequest(request) {
  const init = {
    method: request.method,
    headers: request.headers,
  }
  const allKeys = await latestOrCached()
  const token = extractToken(request)
  const getKey = (header, cb) => {
    const entry = allKeys.keys.find(key => key.kid === header.kid)
    console.log(entry)
    cb(
      ...(entry && entry.n && entry.e
        ? [null, getPem(entry.n, entry.e)]
        : [new Error('failed'), null]),
    )
  }
  return new Promise((resolve, reject) => {
    if (token) {
      jwt.verify(token, getKey, { algorithms: ['RS256'] }, async (error, decoded) => {
        if (error) {
          console.log('error', error)
          resolve(
            newCorsResponse(`Unauthorized: ${error.message}`, { status: 401 })
          )
        } else {
          const userInfo = await updateUser(request, decoded);
          console.log('success');
          console.log(userInfo);
          resolve(
            newCorsResponse(userInfo, { status: 200 })
          );
        }
      })
    } else {
      resolve(newCorsResponse('Unauthorized: missing token', { status: 401 }, request))
    }
  })
}