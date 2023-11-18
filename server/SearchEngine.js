const { Client } = require('@elastic/elasticsearch');
const client = new Client({ node: 'http://localhost:9200' });

const phraseSearch = async (_index, _type, phrase) => {
  const hits = [];

  const searchResult = await client
    .search({
      index: _index,
      type: _type,
      body: {
        query: {
          multi_match: {
            fields: [
              'firstname',
              'lastname',
              'gender',
              'employer',
              'email',
              'city',
              'state',
              'address',
            ],
            query: phrase,
            type: 'phrase_prefix',
            //lenient: true
          },
        },
        highlight: {
          fields: {
            firstname: {},
            lastname: {},
            gender: {},
            employer: {},
            email: {},
            city: {},
            state: {},
            address: {},
          },
        },
      },
    })
    .catch((e) => console.log('errr', e));
  if (
    searchResult &&
    searchResult.body &&
    searchResult.body.hits &&
    searchResult.body.hits.hits &&
    searchResult.body.hits.hits.length > 0
  ) {
    hits.push(...searchResult.body.hits.hits);
  }

  return {
    hitsCount: hits.length,
    hits,
  };
};

module.exports = {
  phraseSearch
};