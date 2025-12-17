'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add new columns to lessons table
    await queryInterface.addColumn('lessons', 'content', {
      type: Sequelize.TEXT,
      allowNull: true,
      comment: 'Full content/article displayed below video player - supports Markdown'
    });

    await queryInterface.addColumn('lessons', 'videoPlatform', {
      type: Sequelize.STRING,
      allowNull: true,
      comment: 'Auto-detected: youtube, vimeo, s3, custom, etc.'
    });

    await queryInterface.addColumn('lessons', 'thumbnail', {
      type: Sequelize.TEXT,
      allowNull: true,
      comment: 'Lesson thumbnail - can be base64 or URL'
    });

    // Change duration comment in lessons
    await queryInterface.changeColumn('lessons', 'duration', {
      type: Sequelize.INTEGER,
      comment: 'Duration in minutes',
      defaultValue: 0
    });

    // Change description comment in lessons
    await queryInterface.changeColumn('lessons', 'description', {
      type: Sequelize.TEXT,
      allowNull: true,
      comment: 'Short description shown in playlist'
    });

    // Update videoUrl comment in lessons
    await queryInterface.changeColumn('lessons', 'videoUrl', {
      type: Sequelize.STRING,
      allowNull: true,
      comment: 'Supports YouTube, Vimeo, S3, any streaming platform URL'
    });

    // Update thumbnail in courses to TEXT (for base64)
    await queryInterface.changeColumn('courses', 'thumbnail', {
      type: Sequelize.TEXT,
      allowNull: true,
      comment: 'Course thumbnail - supports URL or base64 encoded image'
    });

    // Remove videos column from courses if it exists
    const coursesTableInfo = await queryInterface.describeTable('courses');
    if (coursesTableInfo.videos) {
      await queryInterface.removeColumn('courses', 'videos');
    }
  },

  down: async (queryInterface, Sequelize) => {
    // Revert changes
    await queryInterface.removeColumn('lessons', 'content');
    await queryInterface.removeColumn('lessons', 'videoPlatform');
    await queryInterface.removeColumn('lessons', 'thumbnail');

    // Revert duration comment
    await queryInterface.changeColumn('lessons', 'duration', {
      type: Sequelize.INTEGER,
      comment: 'Duration in seconds'
    });

    // Revert description comment
    await queryInterface.changeColumn('lessons', 'description', {
      type: Sequelize.TEXT,
      allowNull: true
    });

    // Revert videoUrl comment
    await queryInterface.changeColumn('lessons', 'videoUrl', {
      type: Sequelize.STRING,
      allowNull: true
    });

    // Revert courses thumbnail
    await queryInterface.changeColumn('courses', 'thumbnail', {
      type: Sequelize.STRING,
      allowNull: true
    });

    // Re-add videos column to courses
    await queryInterface.addColumn('courses', 'videos', {
      type: Sequelize.JSONB,
      defaultValue: []
    });
  }
};
