from flask import Flask, jsonify, request
from flask_cors import CORS
import json
import os

app = Flask(__name__)
CORS(app)
ARQUIVO = os.path.join(os.path.dirname(__file__), 'servicos.json')

# Carregar dados do JSON
def carregar_servicos():
    if not os.path.exists(ARQUIVO):
        return []
    with open(ARQUIVO, 'r') as f:
        return json.load(f)

# Salvar dados no JSON
def salvar_servicos(servicos):
    with open(ARQUIVO, 'w') as f:
        json.dump(servicos, f, indent=4)

@app.route('/servicos', methods=['GET'])
def listar_servicos():
    return jsonify(carregar_servicos())

@app.route('/servicos/<int:id>', methods=['GET'])
def obter_servico(id):
    servicos = carregar_servicos()
    for servico in servicos:
        if servico['id'] == id:
            return jsonify(servico)
    return jsonify({'erro': 'Serviço não encontrado'}), 404

@app.route('/servicos', methods=['POST'])
def criar_servico():
    novo = request.get_json()
    servicos = carregar_servicos()
    novo['id'] = max([s['id'] for s in servicos] + [0]) + 1
    servicos.append(novo)
    salvar_servicos(servicos)
    return jsonify(novo), 201

@app.route('/servicos/<int:id>', methods=['DELETE'])
def deletar_servico(id):
    servicos = carregar_servicos()
    servicos = [s for s in servicos if s['id'] != id]
    salvar_servicos(servicos)
    return jsonify({'mensagem': 'Serviço deletado com sucesso'})

if __name__ == '__main__':
    app.run(debug=True)
