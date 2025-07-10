/**
 * This function exports a configuration object with environment variables for a Node.js application,
 * including app name, description, version, and database credentials.
 */
export const configuration = () => ({
  NODE_ENV: process.env.NODE_ENV,
  app: {
    port: parseInt(process.env.APP_PORT, 10) || 3000,
    name: process.env.APP_NAME,
    description: process.env.APP_DESCRIPTION,
    version: process.env.APP_VERSION,
    isProduction: Boolean(process.env.APP_IS_PRODUCTION),
  },

  db: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    name: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    type: process.env.DB_TYPE,
    synchronize: Boolean(process.env.DB_SYNCHRONIZE_ENTITIES),
  },

  firebase: {
    type: process.env.TYPE,
    project_id: process.env.PROJECT_ID,
    client_id: process.env.CLIENT_ID,
    auth_uri: process.env.AUTH_URI,
    token_uri: process.env.TOKEN_URI,
    auth_provider_x509_cert_url: process.env.AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.CLIENT_X509_CERT_URL,
    universe_domain: process.env.UNIVERSE_DOMAIN,
    private_key_id: process.env.PRIVATE_KEY_ID,
    private_key: process.env.PRIVATE_KEY,
    client_email: process.env.CLIENT_EMAIL,
    api_key: process.env.API_KEY,
    auth_domain: process.env.AUTH_DOMAIN,
    storage_bucket: process.env.STORAGE_BUCKET,
    messaging_sender_id: process.env.MESSAGING_SENDER_ID,
    app_id: process.env.APP_ID,
  },
  recaptcha: {
    secret_key: process.env.RECAPTCHA_SECRET_KEY,
  },

  firebaseAuth: {
    firebaseAuthUrl: process.env.FIREBASE_AUTH_URL,
    googleapis: process.env.GOOGLE_APIS,
    identity_tool_kit: process.env.IDENTITY_TOOL_KIT,
  },

  servicesUrl: {
    fileUrl: process.env.FILE_SERVER_URL,
    tenantUrl: process.env.TENANT_URL,

    emailUrl: process.env.EMAIL_SERVER_URL,
    org_structureUrl: process.env.ORG_STRUCTURE_MODULE,
    approvalUrl: process.env.APPROVAL_MODULE,

    //tenantUrl:process.env.TENANT_URL
  },
  encryption: {
    algorithm: process.env.ENCRYPTION_ALGORITHM || 'aes-256-cbc',
    key: process.env.ENCRYPTION_KEY,
    salt: process.env.ENCRYPTION_SALT || 'default-salt',
    iv: process.env.ENCRYPTION_IV,
  },
});
