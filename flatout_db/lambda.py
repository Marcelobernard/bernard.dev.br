import json
import boto3
from decimal import Decimal
import uuid
from botocore.exceptions import ClientError

dynamodb = boto3.resource('dynamodb')
TABLE_NAME = "flatout_movements"
table = dynamodb.Table(TABLE_NAME)

# Função auxiliar para converter Decimal para int ou float
def decimal_default(obj):
    if isinstance(obj, Decimal):
        if obj % 1 == 0:
            return int(obj)
        else:
            return float(obj)
    return obj  # aceita None, str, bool, etc.

def lambda_handler(event, context):
    method = event.get("httpMethod") or event.get("requestContext", {}).get("http", {}).get("method")
    path_params = event.get("pathParameters") or {}
    movement_id = path_params.get("movement_id")
    
    headers = {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type,Authorization",
        "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS"
    }

    if method == "OPTIONS":
        return {
            "statusCode": 200,
            "headers": headers,
            "body": ""
        }

    try:
        # GET /movements
        if method == "GET":
            response = table.scan()
            movements = response.get("Items", [])
            return {
                "statusCode": 200,
                "headers": headers,
                "body": json.dumps({"movements": movements}, default=decimal_default)
            }

        # POST /movements
        elif method == "POST":
            body = json.loads(event.get("body", "{}"))
            movement_id = body.get("id") or str(uuid.uuid4())
            valor = body.get("valor")
            if valor is not None:
                valor = Decimal(str(valor))

            item = {
                "id": movement_id,
                "data": body.get("data"),
                "categoria": body.get("categoria"),
                "nome": body.get("nome"),
                "moeda": body.get("moeda"),
                "valor": valor,
                "observacao": body.get("observacao"),
                "lembrar_proxima_compra": body.get("lembrar_proxima_compra", False)
            }
            table.put_item(Item=item)
            return {
                "statusCode": 201,
                "headers": headers,
                "body": json.dumps({"message": "Movimentação criada", "movement": item}, default=decimal_default)
            }

        # PUT /movements/{movement_id}
        elif method == "PUT" and movement_id:
            body = json.loads(event.get("body", "{}"))
            if not body:
                return {
                    "statusCode": 400,
                    "headers": headers,
                    "body": json.dumps({"message": "Nenhum dado para atualizar"})
                }

            # Converte valor para Decimal se existir
            if "valor" in body and body["valor"] is not None:
                body["valor"] = Decimal(str(body["valor"]))

            # Cria ExpressionAttributeNames para evitar palavras reservadas
            expression_names = {f"#{k}": k for k in body.keys()}
            expression_values = {f":{k}": v for k, v in body.items()}
            update_expression = "SET " + ", ".join(f"#{k}=:{k}" for k in body.keys())

            table.update_item(
                Key={"id": movement_id},
                UpdateExpression=update_expression,
                ExpressionAttributeNames=expression_names,
                ExpressionAttributeValues=expression_values,
                ReturnValues="ALL_NEW"
            )

            response = table.get_item(Key={"id": movement_id})
            updated_item = response.get("Item", {})

            return {
                "statusCode": 200,
                "headers": headers,
                "body": json.dumps({"message": "Movimentação atualizada", "movement": updated_item}, default=decimal_default)
            }

        # DELETE /movements/{movement_id}
        elif method == "DELETE" and movement_id:
            table.delete_item(Key={"id": movement_id})
            return {
                "statusCode": 200,
                "headers": headers,
                "body": json.dumps({"message": "Movimentação excluída"})
            }

        else:
            return {
                "statusCode": 405,
                "headers": headers,
                "body": json.dumps({"message": "Método não suportado"})
            }

    except ClientError as e:
        return {
            "statusCode": 500,
            "headers": headers,
            "body": json.dumps({"message": "Erro ao acessar DynamoDB", "error": str(e)})
        }
    except Exception as e:
        return {
            "statusCode": 500,
            "headers": headers,
            "body": json.dumps({"message": "Erro ao atualizar movimentação", "error": str(e)})
        }