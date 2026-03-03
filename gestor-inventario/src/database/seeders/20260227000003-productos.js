const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface) {
        // Obtener categorías y proveedores existentes para las FK
        const categorias = await queryInterface.sequelize.query(
            'SELECT id, name FROM categorias WHERE deleted_at IS NULL;',
            { type: queryInterface.sequelize.QueryTypes.SELECT },
        );
        const proveedores = await queryInterface.sequelize.query(
            'SELECT id, name FROM proveedores WHERE deleted_at IS NULL;',
            { type: queryInterface.sequelize.QueryTypes.SELECT },
        );

        // Mapear por nombre para fácil acceso
        const catMap = {};
        categorias.forEach((c) => { catMap[c.name] = c.id; });
        const provMap = {};
        proveedores.forEach((p) => { provMap[p.name] = p.id; });

        await queryInterface.bulkInsert('productos', [
            {
                id: uuidv4(),
                name: 'Notebook Lenovo IdeaPad 15',
                description: 'Notebook 15.6" Intel Core i5, 8GB RAM, 256GB SSD',
                sku: 'ELEC-NB-001',
                price: 450000.00,
                current_stock: 25,
                min_stock: 5,
                max_stock: 50,
                categoria_id: catMap['Electrónica'] || null,
                proveedor_id: provMap['TechDistribuidora S.A.'] || null,
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: uuidv4(),
                name: 'Mouse Inalámbrico Logitech M280',
                description: 'Mouse inalámbrico con receptor USB nano',
                sku: 'ELEC-MS-001',
                price: 15000.00,
                current_stock: 120,
                min_stock: 20,
                max_stock: 200,
                categoria_id: catMap['Electrónica'] || null,
                proveedor_id: provMap['TechDistribuidora S.A.'] || null,
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: uuidv4(),
                name: 'Teclado Mecánico Redragon K552',
                description: 'Teclado mecánico RGB compacto, switches blue',
                sku: 'ELEC-KB-001',
                price: 32000.00,
                current_stock: 45,
                min_stock: 10,
                max_stock: 80,
                categoria_id: catMap['Electrónica'] || null,
                proveedor_id: provMap['TechDistribuidora S.A.'] || null,
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: uuidv4(),
                name: 'Remera Algodón Premium',
                description: 'Remera 100% algodón peinado, talle S a XXL',
                sku: 'ROPA-RM-001',
                price: 8500.00,
                current_stock: 200,
                min_stock: 30,
                max_stock: 500,
                categoria_id: catMap.Ropa || null,
                proveedor_id: provMap['Textiles del Sur'] || null,
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: uuidv4(),
                name: 'Jean Clásico Recto',
                description: 'Jean de mezclilla clásico, corte recto',
                sku: 'ROPA-JN-001',
                price: 25000.00,
                current_stock: 80,
                min_stock: 15,
                max_stock: 150,
                categoria_id: catMap.Ropa || null,
                proveedor_id: provMap['Textiles del Sur'] || null,
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: uuidv4(),
                name: 'Aceite de Oliva Extra Virgen 500ml',
                description: 'Aceite de oliva primera prensada en frío',
                sku: 'ALIM-AO-001',
                price: 5200.00,
                current_stock: 3,
                min_stock: 10,
                max_stock: 100,
                categoria_id: catMap.Alimentos || null,
                proveedor_id: provMap['Alimentos Frescos S.R.L.'] || null,
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: uuidv4(),
                name: 'Yerba Mate Orgánica 1kg',
                description: 'Yerba mate orgánica con palo, producción artesanal',
                sku: 'ALIM-YM-001',
                price: 3800.00,
                current_stock: 2,
                min_stock: 20,
                max_stock: 200,
                categoria_id: catMap.Alimentos || null,
                proveedor_id: provMap['Alimentos Frescos S.R.L.'] || null,
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: uuidv4(),
                name: 'Taladro Percutor 13mm 750W',
                description: 'Taladro percutor eléctrico con mandril de 13mm',
                sku: 'HERR-TP-001',
                price: 45000.00,
                current_stock: 15,
                min_stock: 3,
                max_stock: 30,
                categoria_id: catMap.Herramientas || null,
                proveedor_id: null,
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: uuidv4(),
                name: 'Escritorio de Oficina 120x60cm',
                description: 'Escritorio melamina blanca con patas metálicas',
                sku: 'MUEB-ES-001',
                price: 68000.00,
                current_stock: 8,
                min_stock: 2,
                max_stock: 20,
                categoria_id: catMap.Muebles || null,
                proveedor_id: null,
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: uuidv4(),
                name: 'Silla Ergonómica de Oficina',
                description: 'Silla con soporte lumbar, apoyabrazos regulables',
                sku: 'MUEB-SI-001',
                price: 95000.00,
                current_stock: 12,
                min_stock: 3,
                max_stock: 25,
                categoria_id: catMap.Muebles || null,
                proveedor_id: null,
                created_at: new Date(),
                updated_at: new Date(),
            },
        ]);
    },

    async down(queryInterface) {
        await queryInterface.bulkDelete('productos', null, {});
    },
};
