const { Sequelize } = require('sequelize');

// Use DATABASE_URL if available (Render, Railway, Heroku)
// Otherwise use individual environment variables
const sequelize = process.env.DATABASE_URL
  ? new Sequelize(process.env.DATABASE_URL, {
      dialect: 'postgres',
      dialectOptions: {
        ssl: process.env.NODE_ENV === 'production' ? {
          require: true,
          rejectUnauthorized: false // Required for Render, Railway, etc.
        } : false
      },
      logging: process.env.NODE_ENV === 'development' ? console.log : false,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    })
  : new Sequelize(
      process.env.DB_NAME || 'iq_didactic',
      process.env.DB_USER || 'postgres',
      process.env.DB_PASSWORD || '',
      {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        dialect: 'postgres',
        dialectOptions: {
          ssl: process.env.NODE_ENV === 'production' ? {
            require: true,
            rejectUnauthorized: false
          } : false
        },
        logging: process.env.NODE_ENV === 'development' ? console.log : false,
        pool: {
          max: 5,
          min: 0,
          acquire: 30000,
          idle: 10000
        }
      }
    );

// Test connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ PostgreSQL Connected');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  }
};

// Sync database (create tables)
const syncDatabase = async () => {
  try {
    // In production, use alter: false to prevent accidental data loss
    const syncOptions = process.env.NODE_ENV === 'production' 
      ? { alter: false } 
      : { alter: true };
    
    await sequelize.sync(syncOptions);
    console.log('✅ Database synced');
    return true;
  } catch (error) {
    console.error('❌ Database sync failed:', error.message);
    return false;
  }
};

module.exports = {
  sequelize,
  testConnection,
  syncDatabase
};
