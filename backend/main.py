import os
import logging
from fastapi import FastAPI, Request, HTTPException, Header
from vk_miniapp_auth import VKMiniAppAuthenticator
from vk_miniapp_auth.errors import InvalidInitDataError

# Настройки логирование
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

app = FastAPI()

# Получение секретов из переменных окружения
VK_APP_ID = int(os.environ.get("VK_APP_ID", "0"))
VK_SECRET_KEY = os.environ.get("VK_SECRET_KEY", "")

if not VK_APP_ID:
    logger.warning("VK_APP_ID not set in the environment variables!")

if not VK_SECRET_KEY:
    logger.warning("VK_SECRET_KEY not set in the environment variables!")

# Объект для проверки подписи
authenticator = VKMiniAppAuthenticator(VK_APP_ID, VK_SECRET_KEY)

@app.post("/api/save-data")
async def save_data(request: Request, authorization: str = Header(None)):
    """
    Endpoint for receiving data from the frontend
    Expects an Authorization header containing VK launch parameters (base64-encoded)
    """
    if not authorization:
        logger.error("Request without an Authorization header")
        raise HTTPException(status_code=401, detail="Missing authorization header")

    try:
        # Провка подписи параметров запуска
        launch_params = authenticator.get_verified_launch_params(authorization)
        
        # При успешной проверке, получение vk_user_id
        vk_user_id = launch_params.vk_user_id
        logger.info(f"Signature is valid. User VK ID: {vk_user_id}")

    except InvalidInitDataError as e:
        logger.error(f"Signature verification error: {e}")
        raise HTTPException(status_code=403, detail="Invalid signature")
    except Exception as e:
        logger.error(f"Unknown error during verification: {e}")
        raise HTTPException(status_code=500, detail="Internal error")

    # Получение тела запроса
    try:
        body = await request.json()
        form_data = body.get("formData", {})
    except Exception:
        form_data = {}

    # Логирование
    logger.info(f"Data received from the user {vk_user_id}: {form_data}")

    return {"status": "ok", "received_by_user": vk_user_id}

@app.get("/")
async def root():
    return {"message": "Ochakovo VK Mini App Backend is running"}