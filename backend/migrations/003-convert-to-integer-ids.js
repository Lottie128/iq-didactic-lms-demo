const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    console.log('🔄 Converting remaining tables from UUID to INTEGER...');

    const tables = ['reviews', 'quizzes', 'quiz_submissions', 'discussions', 'comments'];

    for (const table of tables) {
      try {
        // Check if table exists
        const tableExists = await queryInterface.showAllTables()
          .then(tables => tables.includes(table));

        if (tableExists) {
          console.log(`🗑️  Dropping ${table} table...`);
          await queryInterface.dropTable(table);
        }
      } catch (error) {
        console.log(`⚠️  ${table} table doesn't exist or already dropped`);
      }
    }

    // Create reviews table with INTEGER IDs
    console.log('📝 Creating reviews table...');
    await queryInterface.createTable('reviews', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      courseId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'courses',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      rating: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      comment: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      helpful: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      notHelpful: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      edited: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false
      }
    });

    // Create quizzes table with INTEGER IDs
    console.log('📝 Creating quizzes table...');
    await queryInterface.createTable('quizzes', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      courseId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'courses',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      questions: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: []
      },
      timeLimit: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      passingScore: {
        type: DataTypes.INTEGER,
        defaultValue: 70
      },
      published: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      order: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false
      }
    });

    // Create quiz_submissions table with INTEGER IDs
    console.log('📝 Creating quiz_submissions table...');
    await queryInterface.createTable('quiz_submissions', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      quizId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'quizzes',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      answers: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: {}
      },
      score: {
        type: DataTypes.FLOAT,
        allowNull: true
      },
      passed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      timeSpent: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      submittedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false
      }
    });

    // Create discussions table with INTEGER IDs
    console.log('📝 Creating discussions table...');
    await queryInterface.createTable('discussions', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      courseId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'courses',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      type: {
        type: DataTypes.ENUM('question', 'discussion', 'announcement'),
        defaultValue: 'discussion'
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      upvotes: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      isPinned: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      isClosed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      hasBestAnswer: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false
      }
    });

    // Create comments table with INTEGER IDs
    console.log('📝 Creating comments table...');
    await queryInterface.createTable('comments', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      discussionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'discussions',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      parentId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'comments',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      upvotes: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      isBestAnswer: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      isEdited: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false
      }
    });

    console.log('✅ All tables converted to INTEGER IDs successfully!');
  },

  down: async (queryInterface, Sequelize) => {
    console.log('⏪ Rolling back INTEGER ID conversion...');
    const tables = ['comments', 'discussions', 'quiz_submissions', 'quizzes', 'reviews'];
    for (const table of tables) {
      await queryInterface.dropTable(table);
    }
  }
};