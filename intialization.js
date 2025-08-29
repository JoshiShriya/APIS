const initializeDatabases = async () => {
  try {
    // MySQL: Ensure database exists
    const mysqlConnection = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
    });

    const dbName = process.env.MYSQL_DATABASE || 'analytics_db';
    await mysqlConnection.execute(`CREATE DATABASE IF NOT EXISTS ${dbName}`);
    await mysqlConnection.execute(`USE ${dbName}`);
    console.log(`MySQL database '${dbName}' ready`);
    await mysqlConnection.end();

    // MongoDB will create database automatically on first use
    console.log('MongoDB will create database on first connection');

  } catch (error) {
    console.error('Database initialization error:', error);
  }
};

// Call this before starting your server
initializeDatabases().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});