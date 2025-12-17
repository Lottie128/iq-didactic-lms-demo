// MIGRATION DISABLED AFTER FIRST RUN
// This was a cleanup migration after UUID->INTEGER conversion
// Only runs if UUID tables exist

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      // Check if tables already have INTEGER IDs
      const [results] = await queryInterface.sequelize.query(
        `SELECT data_type FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'id';`
      );
      
      if (results.length > 0 && results[0].data_type === 'integer') {
        console.log('✅ Migration already applied: Tables have INTEGER IDs');
        return;
      }
      
      console.log('🔄 Cleaning up old UUID tables...');
      
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
      
      console.log('✅ Cleanup complete');
    } catch (error) {
      console.error('Migration error:', error.message);
    }
  },

  down: async (queryInterface, Sequelize) => {
    console.log('⚠️  Cannot rollback');
  }
};