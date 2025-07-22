
class Config(object):
    DEBUG = True
    TESTING = False

class DevelopmentConfig(Config):
    OPENAI_KEY = 'openai_api_key'
    GCS_DEVELOPER_KEY="google developer key"
    GCS_CX='GCS_CX'
    JWT_SECRET="jwt_secret_key"
    STRIPE_SECRET_KEY="stripe secret key"
    SITE_URL="http://localhost:3000"
    WEBHOOK_ENDPOINT="http://localhost:5000/api/stripe/webhook"

config = {
    'development': DevelopmentConfig,
    'testing': DevelopmentConfig,
    'production': DevelopmentConfig
}