import { validationSchema } from '@config/validation';

describe('validationSchema', () => {
  it('should validate the configuration object', () => {
    const validConfig = {
      NODE_ENV: 'production',
      APP_NAME: 'MyApp',
      APP_DESCRIPTION: 'MyApp Description',
      APP_VERSION: '1.0.0',
      APP_PORT: 8080,
      APP_IS_PRODUCTION: true,
      DB_HOST: 'localhost',
      DB_PORT: 5432,
      DB_NAME: 'mydb',
      DB_USER: 'postgres',
      DB_PASSWORD: 'password',
      DB_TYPE: 'postgres',
      DB_SYNCHRONIZE_ENTITIES: false,
      API_KEY: 'api_key',
      AUTH_DOMAIN: 'auth_domain',
      STORAGE_BUCKET: 'storage_bucket',
      MESSAGING_SENDER_ID: 'messaging_sender_id',
      APP_ID: 'app_id',
      RECAPTCHA_SECRET_KEY: 'recaptcha_secret_key',
    };

    const result = validationSchema.validate(validConfig, { abortEarly: false });

    expect(result.error).toBeUndefined();
    expect(result.value).toEqual(validConfig);
  });

  it('should throw an error if configuration is missing required properties', () => {
    const invalidConfig = {
      NODE_ENV: 'production',
      APP_DESCRIPTION: 'MyApp Description',
      APP_VERSION: '1.0.0',
      APP_IS_PRODUCTION: true,
      DB_HOST: 'localhost',
      DB_PORT: 5432,
      DB_NAME: 'mydb',
      DB_USER: 'postgres',
      DB_PASSWORD: 'password',
      API_KEY: 'api_key',
      AUTH_DOMAIN: 'auth_domain',
      STORAGE_BUCKET: 'storage_bucket',
      MESSAGING_SENDER_ID: 'messaging_sender_id',
      APP_ID: 'app_id',
    };

    expect(validationSchema.validate(invalidConfig).error).toBeDefined();
  });

  it('should throw an error if configuration has invalid properties', () => {
    const invalidConfig = {
      NODE_ENV: 'production',
      APP_NAME: 'MyApp',
      APP_DESCRIPTION: 'MyApp Description',
      APP_VERSION: '1.0.0',
      APP_PORT: 'invalid',
      APP_IS_PRODUCTION: true,
      DB_HOST: 'localhost',
      DB_PORT: 5432,
      DB_DB: 'mydb',
      DB_USER: 'postgres',
      DB_PASSWORD: 'password',
      DB_SYNCHRONIZE_ENTITIES: false,
      API_KEY: 'api_key',
      AUTH_DOMAIN: 'auth_domain',
      STORAGE_BUCKET: 'storage_bucket',
      MESSAGING_SENDER_ID: 'messaging_sender_id',
      APP_ID: 'app_id',
    };

    expect(validationSchema.validate(invalidConfig).error).toBeDefined();
  });
});
