from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/', methods=['POST'])
def receber_comandos():
    dados = request.json
    print("Comando recebido:", dados['comando'])
    
    resultado = "Comando executado com sucesso"
    
    return jsonify({'resultado': resultado})

if __name__ == '__main__':
    app.run(debug=True)
