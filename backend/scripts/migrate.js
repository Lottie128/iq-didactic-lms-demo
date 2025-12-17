const fs = require('fs');
const path = require('path');
const { sequelize } = require('../config/db');

async function runMigrations() {
  try {
    console.log('🔄 Starting migrations...');

    // Get all migration files
    const migrationsDir = path.join(__dirname, '..', 'migrations');
    const files = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.js')).sort();

    console.log(`Found ${files.length} migration files`);

    // Run each migration
    for (const file of files) {
      console.log(`\n📝 Running migration: ${file}`);
      const migration = require(path.join(migrationsDir, file));
      
      try {
        await migration.up(sequelize.getQueryInterface(), sequelize.Sequelize);
        console.log(`✅ Migration completed: ${file}`);
      } catch (error) {
        if (error.message.includes('already exists') || error.message.includes('duplicate')) {
          console.log(`⏭️  Migration already applied: ${file}`);
        } else {
          throw error;
        }
      }
    }

    console.log('\n✨ All migrations completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

runMigrations();
