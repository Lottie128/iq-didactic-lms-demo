module.exports = {
  up: async (queryInterface, Sequelize) => {
    console.log('🔥 FORCE DROPPING ALL TABLES...');
    
    try {
      // Drop all tables in reverse dependency order
      await queryInterface.sequelize.query('DROP TABLE IF EXISTS "progress" CASCADE;');
      await queryInterface.sequelize.query('DROP TABLE IF EXISTS "quiz_attempts" CASCADE;');
      await queryInterface.sequelize.query('DROP TABLE IF EXISTS "questions" CASCADE;');
      await queryInterface.sequelize.query('DROP TABLE IF EXISTS "quizzes" CASCADE;');
      await queryInterface.sequelize.query('DROP TABLE IF EXISTS "lessons" CASCADE;');
      await queryInterface.sequelize.query('DROP TABLE IF EXISTS "reviews" CASCADE;');
      await queryInterface.sequelize.query('DROP TABLE IF EXISTS "enrollments" CASCADE;');
      await queryInterface.sequelize.query('DROP TABLE IF EXISTS "courses" CASCADE;');
      await queryInterface.sequelize.query('DROP TABLE IF EXISTS "notifications" CASCADE;');
      await queryInterface.sequelize.query('DROP TABLE IF EXISTS "achievements" CASCADE;');
      await queryInterface.sequelize.query('DROP TABLE IF EXISTS "certificates" CASCADE;');
      await queryInterface.sequelize.query('DROP TABLE IF EXISTS "discussions" CASCADE;');
      await queryInterface.sequelize.query('DROP TABLE IF EXISTS "users" CASCADE;');
      
      console.log('✅ All tables dropped successfully');
      console.log('⚠️  All data has been wiped!');
      console.log('🔄 Sequelize will now recreate tables with INTEGER IDs');
    } catch (error) {
      console.error('Error dropping tables:', error.message);
      // Continue anyway - tables might not exist
    }
  },

  down: async (queryInterface, Sequelize) => {
    // No rollback - this is a destructive migration
    console.log('⚠️  This migration cannot be rolled back');
  }
};