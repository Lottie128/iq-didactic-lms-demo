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
      },
      // CRITICAL: Define hooks to control sync order
      define: {
        hooks: {
          beforeDefine: (attributes, options) => {
            // Remove constraints temporarily during initial sync
            if (options.tableName) {
              Object.keys(attributes).forEach(key => {
                if (attributes[key].references) {
                  // Keep reference but don't enforce yet
                  attributes[key].references.deferrable = Sequelize.Deferrable.INITIALLY_DEFERRED;
                }
              });
            }
          }
        }
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
    // Import models to ensure they're loaded
    const models = require('../models');
    
    // Sync in specific order: parent tables first
    console.log('🔄 Syncing User table...');
    await models.User.sync({ alter: false });
    
    console.log('🔄 Syncing Course table...');
    await models.Course.sync({ alter: false });
    
    console.log('🔄 Syncing Lesson table...');
    await models.Lesson.sync({ alter: false });
    
    console.log('🔄 Syncing Enrollment table...');
    await models.Enrollment.sync({ alter: false });
    
    console.log('🔄 Syncing Progress table...');
    await models.Progress.sync({ alter: false });
    
    // Sync remaining models
    console.log('🔄 Syncing remaining tables...');
    await sequelize.sync({ alter: false });
    
    console.log('✅ Database synced');
    return true;
  } catch (error) {
    console.error('❌ Database sync failed:', error.message);
    console.error('Error details:', error);
    return false;
  }
};

module.exports = {
  sequelize,
  testConnection,
  syncDatabase
};