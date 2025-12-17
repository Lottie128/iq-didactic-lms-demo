module.exports = {
  up: async (queryInterface, Sequelize) => {
    console.log('🔥 FORCE DROPPING ALL TABLES...');
    
    try {
      // Disable foreign key checks temporarily
      await queryInterface.sequelize.query('SET session_replication_role = replica;');
      
      // Drop all tables
      await queryInterface.sequelize.query('DROP SCHEMA public CASCADE;');
      await queryInterface.sequelize.query('CREATE SCHEMA public;');
      await queryInterface.sequelize.query('GRANT ALL ON SCHEMA public TO postgres;');
      await queryInterface.sequelize.query('GRANT ALL ON SCHEMA public TO public;');
      
      // Re-enable foreign key checks
      await queryInterface.sequelize.query('SET session_replication_role = DEFAULT;');
      
      console.log('✅ All tables dropped successfully');
      console.log('⚠️  All data has been wiped!');
      console.log('🔄 Sequelize will now recreate tables with INTEGER IDs');
    } catch (error) {
      console.error('Error dropping tables:', error.message);
      // Try to re-enable foreign keys even if error
      try {
        await queryInterface.sequelize.query('SET session_replication_role = DEFAULT;');
      } catch (e) {
        // ignore
      }
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    // No rollback - this is a destructive migration
    console.log('⚠️  This migration cannot be rolled back');
  }
};