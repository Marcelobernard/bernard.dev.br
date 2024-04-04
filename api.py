from flask import Flask, request, jsonify

app = Flask(__name__)

# Rota para receber comandos dos bots
@app.route('/', methods=['POST'])
def receber_comandos():
    dados = request.json  # Recebe os dados JSON enviados pelo bot
    print("Comando recebido:", dados['comando'])
    
    # Executa o comando e retorna um resultado (exemplo)
    resultado = "Comando executado com sucesso"
    
    # Retorna o resultado para o bot
    return jsonify({'resultado': resultado})

if __name__ == '__main__':
    app.run(debug=True)
