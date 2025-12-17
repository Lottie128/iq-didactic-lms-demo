module.exports = {
  up: async (queryInterface, Sequelize) => {
    console.log('🔥 DROPPING ALL UUID TABLES...');
    
    try {
      // List of all tables to drop
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
          console.log(`✅ Dropped: ${table}`);
        } catch (error) {
          console.log(`⏭️  Skip: ${table}`);
        }
      }
      
      console.log('✅ All UUID tables dropped!');
      console.log('🔄 Ready for INTEGER schema');
    } catch (error) {
      console.error('Drop error:', error.message);
      // Don't throw - continue anyway
    }
  },

  down: async (queryInterface, Sequelize) => {
    console.log('⚠️  Cannot rollback destructive migration');
  }
};