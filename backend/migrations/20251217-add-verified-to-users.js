module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      // Check if column already exists
      const tableDescription = await queryInterface.describeTable('users');
      
      if (!tableDescription.verified) {
        await queryInterface.addColumn('users', 'verified', {
          type: Sequelize.BOOLEAN,
          defaultValue: true,
          allowNull: false
        });
        console.log('✅ Added verified column to users table');
        
        // Set all existing teachers to verified by default
        await queryInterface.sequelize.query(
          `UPDATE users SET verified = true WHERE role = 'teacher';`
        );
        console.log('✅ Set existing teachers as verified');
      } else {
        console.log('✅ verified column already exists');
      }
    } catch (error) {
      console.error('Migration error:', error.message);
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('users', 'verified');
  }
};