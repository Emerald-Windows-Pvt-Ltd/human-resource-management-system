import { pool, testConnection } from './database';
import fs from 'fs';
import path from 'path';

const initializeDatabase = async (): Promise<void> => {
  try {
    console.log('🔄 Initializing database...');
    
    // Test connection first
    await testConnection();
    
    // Read and execute schema
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Split queries by semicolon and execute them one by one
    const queries = schema.split(';').filter(query => query.trim());
    
    for (const query of queries) {
      if (query.trim()) {
        await pool.execute(query);
      }
    }
    
    console.log('✅ Database initialized successfully');
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    throw error;
  }
};

export default initializeDatabase;

// Run initialization if this file is executed directly
if (require.main === module) {
  initializeDatabase()
    .then(() => {
      console.log('Database setup completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Database setup failed:', error);
      process.exit(1);
    });
}