#!/usr/bin/env node

/**
 * Data Validation Script for db.json
 * Verifies the integrity and correctness of the database structure
 */

const fs = require('fs');
const path = require('path');

// Read db.json
const dbPath = path.join(__dirname, 'db.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

console.log('🔍 Validando estructura de db.json...\n');

// Validation results
const results = {
    passed: [],
    failed: [],
    warnings: []
};

// Test 1: Check collections exist
console.log('📦 Test 1: Verificando colecciones...');
const requiredCollections = ['users', 'grades', 'progress', 'topics'];
requiredCollections.forEach(collection => {
    if (db[collection]) {
        results.passed.push(`✅ Colección '${collection}' existe`);
    } else {
        results.failed.push(`❌ Colección '${collection}' no encontrada`);
    }
});

// Test 2: Verify user counts
console.log('\n👥 Test 2: Verificando cantidad de usuarios...');
const teachers = db.users.filter(u => u.role === 'teacher');
const students = db.users.filter(u => u.role === 'student');

if (teachers.length === 6) {
    results.passed.push(`✅ Cantidad correcta de profesores: ${teachers.length}`);
} else {
    results.failed.push(`❌ Profesores esperados: 6, encontrados: ${teachers.length}`);
}

if (students.length === 18) {
    results.passed.push(`✅ Cantidad correcta de estudiantes: ${students.length}`);
} else {
    results.failed.push(`❌ Estudiantes esperados: 18, encontrados: ${students.length}`);
}

// Test 3: Verify grade distribution
console.log('\n📚 Test 3: Verificando distribución por grado...');
for (let grade = 1; grade <= 6; grade++) {
    const teachersInGrade = teachers.filter(t => t.grade_id === grade);
    const studentsInGrade = students.filter(s => s.grade_id === grade);

    if (teachersInGrade.length === 1) {
        results.passed.push(`✅ Grado ${grade}: 1 profesor`);
    } else {
        results.failed.push(`❌ Grado ${grade}: esperado 1 profesor, encontrados ${teachersInGrade.length}`);
    }

    if (studentsInGrade.length === 3) {
        results.passed.push(`✅ Grado ${grade}: 3 estudiantes`);
    } else {
        results.failed.push(`❌ Grado ${grade}: esperados 3 estudiantes, encontrados ${studentsInGrade.length}`);
    }
}

// Test 4: Verify learning styles distribution
console.log('\n🎨 Test 4: Verificando estilos de aprendizaje...');
const learningStyles = {
    'Visual': students.filter(s => s.learning_style === 'Visual').length,
    'Auditivo': students.filter(s => s.learning_style === 'Auditivo').length,
    'Kinestésico': students.filter(s => s.learning_style === 'Kinestésico').length
};

Object.entries(learningStyles).forEach(([style, count]) => {
    if (count === 6) {
        results.passed.push(`✅ Estilo ${style}: ${count} estudiantes`);
    } else {
        results.failed.push(`❌ Estilo ${style}: esperados 6, encontrados ${count}`);
    }
});

// Test 5: Verify all passwords are "123456"
console.log('\n🔐 Test 5: Verificando contraseñas...');
const invalidPasswords = db.users.filter(u => u.password !== '123456');
if (invalidPasswords.length === 0) {
    results.passed.push(`✅ Todas las contraseñas son "123456"`);
} else {
    results.failed.push(`❌ ${invalidPasswords.length} usuarios con contraseña incorrecta`);
}

// Test 6: Verify progress records
console.log('\n📊 Test 6: Verificando registros de progreso...');
if (db.progress.length > 0) {
    results.passed.push(`✅ ${db.progress.length} registros de progreso encontrados`);

    // Check for varied scores
    const scores = db.progress.map(p => p.score);
    const hasExcellent = scores.some(s => s >= 90);
    const hasAverage = scores.some(s => s >= 70 && s < 90);
    const hasLow = scores.some(s => s < 70);

    if (hasExcellent && hasAverage && hasLow) {
        results.passed.push(`✅ Notas variadas (excelentes, promedio, bajas)`);
    } else {
        results.warnings.push(`⚠️  Falta variedad en las notas`);
    }
} else {
    results.failed.push(`❌ No hay registros de progreso`);
}

// Test 7: Verify topics structure
console.log('\n📖 Test 7: Verificando temas por grado...');
if (db.topics.length === 6) {
    results.passed.push(`✅ 6 colecciones de temas (1 por grado)`);

    db.topics.forEach(topic => {
        if (topic.temas && Array.isArray(topic.temas) && topic.temas.length > 0) {
            results.passed.push(`✅ Grado ${topic.grade_id}: ${topic.temas.length} temas`);
        } else {
            results.failed.push(`❌ Grado ${topic.grade_id}: sin temas definidos`);
        }
    });
} else {
    results.failed.push(`❌ Temas esperados: 6, encontrados: ${db.topics.length}`);
}

// Test 8: Verify foreign key integrity
console.log('\n🔗 Test 8: Verificando integridad de claves foráneas...');
const validGradeIds = db.grades.map(g => g.id);
const validStudentIds = students.map(s => s.id);

// Check user grade_ids
const invalidUserGrades = db.users.filter(u => !validGradeIds.includes(u.grade_id));
if (invalidUserGrades.length === 0) {
    results.passed.push(`✅ Todos los grade_id de usuarios son válidos`);
} else {
    results.failed.push(`❌ ${invalidUserGrades.length} usuarios con grade_id inválido`);
}

// Check progress student_ids
const invalidProgressStudents = db.progress.filter(p => !validStudentIds.includes(p.student_id));
if (invalidProgressStudents.length === 0) {
    results.passed.push(`✅ Todos los student_id de progreso son válidos`);
} else {
    results.failed.push(`❌ ${invalidProgressStudents.length} registros con student_id inválido`);
}

// Test 9: Check for duplicate usernames
console.log('\n👤 Test 9: Verificando usernames únicos...');
const usernames = db.users.map(u => u.username);
const duplicates = usernames.filter((item, index) => usernames.indexOf(item) !== index);
if (duplicates.length === 0) {
    results.passed.push(`✅ Todos los usernames son únicos`);
} else {
    results.failed.push(`❌ Usernames duplicados: ${duplicates.join(', ')}`);
}

// Print summary
console.log('\n' + '='.repeat(60));
console.log('📋 RESUMEN DE VALIDACIÓN');
console.log('='.repeat(60));

console.log(`\n✅ Pruebas Exitosas: ${results.passed.length}`);
results.passed.forEach(msg => console.log(`   ${msg}`));

if (results.warnings.length > 0) {
    console.log(`\n⚠️  Advertencias: ${results.warnings.length}`);
    results.warnings.forEach(msg => console.log(`   ${msg}`));
}

if (results.failed.length > 0) {
    console.log(`\n❌ Pruebas Fallidas: ${results.failed.length}`);
    results.failed.forEach(msg => console.log(`   ${msg}`));
    console.log('\n🔴 VALIDACIÓN FALLIDA');
    process.exit(1);
} else {
    console.log('\n🎉 ¡VALIDACIÓN EXITOSA! El archivo db.json está correcto.');

    // Print statistics
    console.log('\n📊 ESTADÍSTICAS:');
    console.log(`   Total Usuarios: ${db.users.length}`);
    console.log(`   - Profesores: ${teachers.length}`);
    console.log(`   - Estudiantes: ${students.length}`);
    console.log(`   Registros de Progreso: ${db.progress.length}`);
    console.log(`   Grados: ${db.grades.length}`);
    console.log(`   Colecciones de Temas: ${db.topics.length}`);
    console.log(`   Total de Registros: ${db.users.length + db.progress.length + db.grades.length + db.topics.length}`);

    process.exit(0);
}
