const { defineConfig } = require('cypress')
const got = require('got')

module.exports = defineConfig({
  e2e: {
    async setupNodeEvents(on, config) {
      // implement node event listeners here
      const isDev = config.watchForFileChanges
      const port = process.env.PORT ?? (isDev ? '3000' : '8811')
      const configOverrides = {
        baseUrl: `http://localhost:${port}`,
        video: !process.env.CI,
        screenshotOnRunFailure: !process.env.CI,
      }
      Object.assign(config, configOverrides)

      const data = await got('https://restcountries.com/v2/all').json();

      const regions = [
        ...new Set(data.map((country) => country.region)),
      ].sort();

      const countByRegion = data.reduce((acc, country) => {
        acc[country.region] = acc[country.region] ? acc[country.region] + 1 : 1;
        return acc;
      }, {});

      const countryCodes = data.reduce((acc, country) => {
        let entry = {};

        ['alpha2Code', 'alpha3Code', 'name', 'borders'].forEach(
          (f) => (entry[f] = country[f])
        );

        acc.push(entry);

        return acc;
      }, []);

      config.env.countries = data;
      config.env.regions = regions;
      config.env.countByRegion = countByRegion;
      config.env.countryCodes = countryCodes;

      return config
    },
  },
})
