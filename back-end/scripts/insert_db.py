import json
import requests
from pymongo import MongoClient

url = 'https://raw.githubusercontent.com/BrunnerLivio/PokemonDataGraber/master/output.json'
r = requests.get(url)
data = json.loads(r.text)

new_data = []
test = []
for e in data:
    if len(e.keys()) > 0:
        new_data.append({
            'name': e['Name'],
            'generation': 1 if e['Generation'].replace('Generation', '').strip() == 'I' else 2,
            'types': ', '.join(e['Types']),
            'attacks': len(e['Fast Attack(s)']) + len(e['Special Attack(s)'])      
        })

mongo_uri = 'mongodb+srv://user:pass@sandbox-s5ob9.gcp.mongodb.net/pokedex?retryWrites=true&w=majority'
mongo_client = MongoClient(mongo_uri)
mongodb = mongo_client.pokedex
mongodb.pokemons.insert_many(new_data)