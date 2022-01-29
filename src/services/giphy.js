import axios from 'axios'

export async function getGif(endpoint, gifName) {
  try {
    const response = await axios.get(`https://api.giphy.com/v1/gifs/${endpoint}`, {
      params: {
        api_key: 'hs6RRs1jAac5uzwxFV1rLIl2UhmAMEVP',
        limit: 20,
        q: {gifName}
      }
    });

    return response.data.data

  } catch (error) {
    console.error(error);
  }
}