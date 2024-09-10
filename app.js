// Node.js may require 'node-fetch' for versions lower than 18.x
// npm install node-fetch if needed (for older Node versions)
import fetch from 'node-fetch'

// Function to expand shortened URLs
async function ExpandURL(url) {
  try {
    const response = await fetch(url, { method: 'HEAD', redirect: 'manual' })
    const longurl = decodeURIComponent(response.headers.get('location'))
    return longurl
  } catch (error) {
    console.error('Error fetching the URL:', error)
  }
}

// Example shortened Google Maps URL
let urlToTest = 'https://maps.app.goo.gl/MtNRZw6AMcjBBRp5A'

// Expand the URL
ExpandURL(urlToTest).then((longURL) => {
  console.log(`longUrl: ${longURL}`)

  // Parse coordinates from the expanded URL
  let coords = ParseCoords(longURL)
  console.log(`Parsed Coordinates: ${coords}`)
})

function ParseCoords(url) {
  let coordStr = ''

  // If Google Maps (coordinates after /place like /place/0.316984,32.934252)
  const placeCoordsMatch = /\/place\/([0-9\.\-]+),([0-9\.\-]+)/.exec(url)
  if (placeCoordsMatch) {
    coordStr = `${placeCoordsMatch[1]},${placeCoordsMatch[2]}`
    console.log(`Parsed Coordinates from place path: ${coordStr}`)
  }

  // If Google Maps (coordinates in the path like /@25.7847823,55.9633931/)
  else {
    const pathCoordsMatch = /@([0-9\.\-]+),([0-9\.\-]+)/.exec(url)
    if (pathCoordsMatch) {
      coordStr = `${pathCoordsMatch[1]},${pathCoordsMatch[2]}`
      console.log(`Parsed Coordinates from @ path: ${coordStr}`)
    }
  }

  // If Google Maps (query format like ?q=coords)
  if (!coordStr) {
    // Only attempt if not already matched
    const queryCoordsMatch = /[?&]q=([0-9\.\-]+),([0-9\.\-]+)/.exec(url)
    if (queryCoordsMatch) {
      coordStr = `${queryCoordsMatch[1]},${queryCoordsMatch[2]}`
      console.log(`Parsed Coordinates from query: ${coordStr}`)
    }
  }

  return coordStr
}


// Test the function with your URL
// let longTestUrl =
//   'https://www.google.com/maps/place/Dubai+-+United+Arab+Emirates/@25.0756584,54.8978328,10z/data=!3m1!4b1!4m6!3m5!1s0x3e5f43496ad9c645:0xbde66e5084295162!8m2!3d25.2048493!4d55.2707828!16zL20vMDFmMDhy!5m1!1e4?entry=tts&g_ep=EgoyMDI0MDkwNC4wKgBIAVAD'

// let coords = ParseCoords(longTestUrl)
// console.log(`Parsed Coordinates: ${coords}`)

