'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add 'type' column to lessons table
    await queryInterface.addColumn('lessons', 'type', {
      type: Sequelize.ENUM('video', 'text', 'image'),
      defaultValue: 'video',
      allowNull: false
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove 'type' column
    await queryInterface.removeColumn('lessons', 'type');
    
    // Drop the ENUM type
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_lessons_type";');
  }
};
