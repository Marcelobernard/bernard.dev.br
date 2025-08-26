import json
import boto3
import uuid
from datetime import datetime
from decimal import Decimal

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('minhaFinance')

def lambda_handler(event, context):
    method = event['httpMethod']

    # CORS pré-via (OPTIONS)
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, DELETE, GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            }
        }

    if method == 'POST':
        body = json.loads(event['body'])
        item = {
            'id': str(uuid.uuid4()),
            'descricao': body['descricao'],
            'valor': Decimal(str(body['valor'])),  # CONVERSÃO AQUI
            'data': datetime.utcnow().isoformat()
        }
        table.put_item(Item=item)
        return {
            'statusCode': 200,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'message': 'Item adicionado', 'item': item}, default=str)
        }

    elif method == 'DELETE':
        body = json.loads(event['body'])
        if 'id' not in body:
            return {
                'statusCode': 400,
                'headers': {'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'ID obrigatório para deletar'})
            }
        table.delete_item(Key={'id': body['id']})
        return {
            'statusCode': 200,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'message': 'Item deletado'})
        }

    elif method == 'GET':
        response = table.scan()
        return {
            'statusCode': 200,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'items': response.get('Items', [])}, default=str)
        }

    else:
        return {
            'statusCode': 405,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Método não suportado'})
        }