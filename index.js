const dotenv = require('dotenv');
const { sample } = require('lodash');
const Hapi = require('hapi');
const fetch = require('node-fetch');

dotenv.config();

const TAG_OPTIONS = ['cheering', 'clapping', 'applause'];
const getTag = () => sample(TAG_OPTIONS);

const server = Hapi.server({
  host: 'localhost',
  port: 8000
});

server.route({
  method: 'GET',
  path: '/',
  handler: async (req, h) => {
    const gif = await fetch(
      `http://api.giphy.com/v1/gifs/random?api_key=${
        process.env.API_KEY
      }&tag=${getTag()}&rating=g`
    );
    const { data } = await gif.json();
    return h.redirect(data.images.downsized_large.url);
  }
});

async function start() {
  try {
    await server.start();
  } catch (err) {
    console.log(err);
    process.exit(1);
  }

  console.log('Server running at:', server.info.uri);
}

start();
