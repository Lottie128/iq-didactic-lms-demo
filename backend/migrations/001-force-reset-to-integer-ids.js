// MIGRATION DISABLED AFTER FIRST RUN
// This migration was needed ONCE to convert from UUID to INTEGER
// Now it checks if tables exist before dropping

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      // Check if users table exists with INTEGER id
      const [results] = await queryInterface.sequelize.query(
        `SELECT data_type FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'id';`
      );
      
      // If users table has integer ID, skip migration
      if (results.length > 0 && results[0].data_type === 'integer') {
        console.log('✅ Migration already applied: Tables have INTEGER IDs');
        return;
      }
      
      console.log('🔄 First run detected: Converting UUID to INTEGER...');
      
      const tables = [
        'progress',
        'quiz_attempts', 
        'questions',
        'quizzes',
        'reviews',
        'discussions',
        'notifications',
        'achievements',
        'certificates',
        'lessons',
        'enrollments',
        'courses',
        'users'
      ];

      for (const table of tables) {
        try {
          await queryInterface.sequelize.query(`DROP TABLE IF EXISTS "${table}" CASCADE;`);
          console.log(`✅ Dropped: ${table}`);
        } catch (error) {
          console.log(`⏭️  Skip: ${table}`);
        }
      }
      
      console.log('✅ Migration completed - tables will be recreated with INTEGER IDs');
    } catch (error) {
      console.error('Migration error:', error.message);
    }
  },

  down: async (queryInterface, Sequelize) => {
    console.log('⚠️  Cannot rollback');
  }
};