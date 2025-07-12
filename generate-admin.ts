import * as bcrypt from 'bcrypt';

async function generateAdminPassword() {
  const password = 'admin123456'; // Cambia esta contraseña por la que quieras
  const hashedPassword = await bcrypt.hash(password, 10);
  
  console.log('='.repeat(50));
  console.log('🔐 CONFIGURACIÓN USUARIO ADMIN');
  console.log('='.repeat(50));
  console.log(`Contraseña: ${password}`);
  console.log(`Hash: ${hashedPassword}`);
  console.log('='.repeat(50));
  console.log('\n📋 SQL para crear admin:');
  console.log(`
INSERT INTO users (username, email, password, first_name, last_name, role, is_active, email_verified) 
VALUES (
  'admin', 
  'admin@tienda-nba.com', 
  '${hashedPassword}',
  'Admin', 
  'User', 
  'admin', 
  true, 
  true
) 
ON DUPLICATE KEY UPDATE 
  password = '${hashedPassword}',
  role = 'admin';
  `);
  console.log('='.repeat(50));
}

generateAdminPassword().catch(console.error);
