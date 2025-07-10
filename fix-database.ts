import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function fixDatabase() {
  try {
    console.log('Conectando a la base de datos...');
    await dataSource.initialize();
    console.log('Conexión exitosa');

    // Verificar la estructura de la tabla users
    const tableColumns = await dataSource.query(`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      ORDER BY ordinal_position
    `);
    console.log('Columnas de la tabla users:', tableColumns);

    // Verificar si la columna username existe
    const usernameColumn = tableColumns.find(col => col.column_name === 'username');
    
    if (!usernameColumn) {
      console.log('La columna username no existe. Agregándola...');
      
      // Agregar la columna username como nullable primero
      await dataSource.query(`
        ALTER TABLE users 
        ADD COLUMN username VARCHAR(255) NULL
      `);
      
      console.log('Columna username agregada');
      
      // Actualizar los valores existentes
      console.log('Actualizando valores de username...');
      await dataSource.query(`
        UPDATE users 
        SET username = COALESCE(email, 'user_' || id) 
        WHERE username IS NULL
      `);
      
      console.log('Valores actualizados');
      
    } else {
      console.log('La columna username ya existe');
      
      // Verificar si hay registros con username null
      const nullUsernameCount = await dataSource.query(
        'SELECT COUNT(*) as count FROM users WHERE username IS NULL'
      );
      console.log(`Usuarios con username NULL: ${nullUsernameCount[0].count}`);

      if (nullUsernameCount[0].count > 0) {
        console.log('Actualizando usuarios con username NULL...');
        
        await dataSource.query(`
          UPDATE users 
          SET username = COALESCE(email, 'user_' || id) 
          WHERE username IS NULL
        `);
        
        console.log('Actualización completada');
      }
    }

    // Verificar y corregir el enum de roles
    console.log('Verificando enum de roles...');
    
    // Primero, verificar qué valores están permitidos en el enum
    const enumValues = await dataSource.query(`
      SELECT unnest(enum_range(NULL::users_role_enum)) as role_value
    `);
    console.log('Valores permitidos en el enum:', enumValues);
    
    // Verificar qué roles existen actualmente en la tabla
    const existingRoles = await dataSource.query(`
      SELECT DISTINCT role FROM users
    `);
    console.log('Roles existentes en la tabla:', existingRoles);
    
    // Verificar los cambios
    const updatedUsers = await dataSource.query(
      'SELECT id, username, email, role FROM users LIMIT 10'
    );
    console.log('Usuarios actualizados:', updatedUsers);

    console.log('Migración completada exitosamente');
  } catch (error) {
    console.error('Error durante la migración:', error);
  } finally {
    await dataSource.destroy();
  }
}

fixDatabase();
