module.exports = {
  up: async (queryInterface, Sequelize) => {
    console.log('🔥 FORCE DROPPING ALL TABLES...');
    
    try {
      // Drop all constraints first, then tables
      // This avoids foreign key issues without needing superuser
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

      // Drop each table with CASCADE to handle foreign keys
      for (const table of tables) {
        try {
          await queryInterface.sequelize.query(`DROP TABLE IF EXISTS "${table}" CASCADE;`);
          console.log(`✅ Dropped table: ${table}`);
        } catch (error) {
          // Ignore if table doesn't exist
          console.log(`⏭️  Table ${table} doesn't exist, skipping`);
        }
      }
      
      console.log('✅ All tables dropped successfully');
      console.log('⚠️  All data has been wiped!');
      console.log('🔄 Sequelize will now recreate tables with INTEGER IDs');
    } catch (error) {
      console.error('Error dropping tables:', error.message);
      // Don't throw - let Sequelize sync handle recreation
    }
  },

  down: async (queryInterface, Sequelize) => {
    // No rollback - this is a destructive migration
    console.log('⚠️  This migration cannot be rolled back');
  }
};