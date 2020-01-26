export default {
    jwtSecret: "@QEGTUI",
    redis: {
      host: "localhost",
      port: 6379
    },
    apiKey: 'EK5LNFcy1ItrnU8jVedmlIJh5qdt3p_iLpojgC7YbGVPzPeD6Ab-OFX25RHgVvI8HXuGCXQq64KqEwhbT_GchPp0ci4B_JTDbC9PfPZoOTEv9ngmBQE5l9MdJ1gmXnYx',
    defaultTimeout: 5000,
    endpoints: {
      getBusinesses: `https://api.yelp.com/v3/businesses/search?term=restaurants&location=:location&latitude=:latitude&longitude=:longitude`
    }
  };
  