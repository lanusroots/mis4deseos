import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';
import User from './models/User.js';
import Contact from './models/Contact.js';

dotenv.config();

// Precio Chica = ~65% del precio Grande (redondeado a centena)
const chica = (grande) => Math.round(grande * 0.65 / 100) * 100;

const products = [
  // ── ESPECIALES (Individual) ──────────────────────────────
  {
    name: "Box Clasico",
    category: "Especiales",
    sizes: [{ size: "Individual", price: 44000 }],
    description: "Esta box está pensada para sorprender a quien más quieras para el desayuno o merienda",
    imageUrl: "https://res.cloudinary.com/dypw938yk/image/upload/v1781650322/mis4deseos/box_clasic.jpg"
  },
  {
    name: "Box Infantil",
    category: "Especiales",
    sizes: [{ size: "Individual", price: 49000 }],
    description: "Es una box súper completa para sorprender a los más chiquitos de la familia",
    imageUrl: "https://res.cloudinary.com/dypw938yk/image/upload/v1781650313/mis4deseos/box_infantil.webp"
  },

  // ── TARTAS Y TORTAS (Chica + Grande) ────────────────────
  {
    name: "Torta Brownie",
    category: "Tartas y Tortas",
    sizes: [
      { size: "Chica",  price: chica(46350) },
      { size: "Grande", price: 46350 }
    ],
    description: "Base de brownie húmedo con dulce de leche crema chantilli cubierto con merengue italiano",
    imageUrl: "https://res.cloudinary.com/dypw938yk/image/upload/v1781650317/mis4deseos/brownie.webp"
  },
  {
    name: "Torta Tiramisu",
    category: "Tartas y Tortas",
    sizes: [
      { size: "Chica",  price: chica(47550) },
      { size: "Grande", price: 47550 }
    ],
    description: "Mousse de queso con base y centro de vainillas embebidas en almíbar de café decorado con cacao en polvo",
    imageUrl: "https://res.cloudinary.com/dypw938yk/image/upload/v1781650311/mis4deseos/tiramisu.jpg"
  },
  {
    name: "Chocotorta",
    category: "Tartas y Tortas",
    sizes: [
      { size: "Chica",  price: chica(53500) },
      { size: "Grande", price: 53500 }
    ],
    description: "Clásica chocotorta con capas de galletitas Chocolinas rellena de queso crema y dulce de leche decorado con drip de chocolate negro y granas de colores",
    imageUrl: "https://res.cloudinary.com/dypw938yk/image/upload/v1781650314/mis4deseos/chocotorta.webp"
  },
  {
    name: "Húmeda de banana",
    category: "Tartas y Tortas",
    sizes: [
      { size: "Chica",  price: chica(51080) },
      { size: "Grande", price: 51080 }
    ],
    description: "Torta húmeda de chocolate y banana sin T,A,C,C con dulce de leche cubierto con crema chantilly",
    imageUrl: "https://res.cloudinary.com/dypw938yk/image/upload/v1781650319/mis4deseos/humeda_banana.webp"
  },
  {
    name: "Tarta de manzana",
    category: "Tartas y Tortas",
    sizes: [
      { size: "Chica",  price: chica(45200) },
      { size: "Grande", price: 45200 }
    ],
    description: "Base de masa sablée relleno de manzanas y crumble",
    imageUrl: "https://res.cloudinary.com/dypw938yk/image/upload/v1781650315/mis4deseos/tarta_manzana.webp"
  },
  {
    name: "Rogel",
    category: "Tartas y Tortas",
    sizes: [
      { size: "Chica",  price: chica(50360) },
      { size: "Grande", price: 50360 }
    ],
    description: "Clásico rogel de capas de masa rellenas de dulce de leche y cobertura de merengue italiano",
    imageUrl: "https://res.cloudinary.com/dypw938yk/image/upload/v1781650315/mis4deseos/rogel.jpg"
  },
  {
    name: "Lemon Pie",
    category: "Tartas y Tortas",
    sizes: [
      { size: "Chica",  price: chica(42820) },
      { size: "Grande", price: 42820 }
    ],
    description: "Base de masa sablée relleno de lemon curd y cobertura de merengue italiano",
    imageUrl: "https://res.cloudinary.com/dypw938yk/image/upload/v1781650309/mis4deseos/lemon_pie.jpg"
  },
  {
    name: "Cheesecake Frutos",
    category: "Tartas y Tortas",
    sizes: [
      { size: "Chica",  price: chica(55090) },
      { size: "Grande", price: 55090 }
    ],
    description: "Cheescake cocido con base de chocolate y cobertura de dulce casero de frutos del bosque y frutos frescos",
    imageUrl: "https://res.cloudinary.com/dypw938yk/image/upload/v1781650311/mis4deseos/frutos.jpg"
  },
  {
    name: "Red Velvet",
    category: "Tartas y Tortas",
    sizes: [
      { size: "Chica",  price: chica(63440) },
      { size: "Grande", price: 63440 }
    ],
    description: "Bizcochuelo húmedo de cacao con un suave color rojo intercalado con crosting de vainilla y queso crema",
    imageUrl: "https://res.cloudinary.com/dypw938yk/image/upload/v1781650318/mis4deseos/redvelvet.webp"
  },
  {
    name: "Torta Oreo",
    category: "Tartas y Tortas",
    sizes: [
      { size: "Chica",  price: chica(83200) },
      { size: "Grande", price: 83200 }
    ],
    description: "Base de galletitas oreo mousse de dulce de leche con corazón de dulce de leche oreos y merengue seco decorada con galletitas oreos partidas",
    imageUrl: "https://res.cloudinary.com/dypw938yk/image/upload/v1781650321/mis4deseos/oreo.jpg"
  },

  // ── PASTELERÍA CLÁSICA (Docena) ──────────────────────────
  {
    name: "Macarons",
    category: "Pastelería Clásica",
    sizes: [{ size: "Docena", price: 22900 }],
    description: "Macarons de colores surtidos según el stock semanal",
    imageUrl: "https://res.cloudinary.com/dypw938yk/image/upload/v1781650307/mis4deseos/macarons.webp"
  },
  {
    name: "Alfajor sablé",
    category: "Pastelería Clásica",
    sizes: [{ size: "Docena", price: 20760 }],
    description: "Tapas de masa sablée rellenas de dulce de leche",
    imageUrl: "https://res.cloudinary.com/dypw938yk/image/upload/v1781650318/mis4deseos/alfajor_sable.webp"
  },
  {
    name: "Scones dulces",
    category: "Pastelería Clásica",
    sizes: [{ size: "Docena", price: 4980 }],
    description: "Scones dulces decorados con glasé y azúcar, ideales para compartir en una rica merienda!",
    imageUrl: "https://res.cloudinary.com/dypw938yk/image/upload/v1781650308/mis4deseos/scons.webp"
  },
  {
    name: "Cookies personalizadas",
    category: "Pastelería Clásica",
    sizes: [{ size: "Docena", price: 3500 }],
    description: "Cookie de masa sablée decorada con pasta ballina con mensaje personalizado y color a elección",
    imageUrl: "https://res.cloudinary.com/dypw938yk/image/upload/v1781650321/mis4deseos/cokies.webp"
  },
  {
    name: "Crocantes de cereal",
    category: "Pastelería Clásica",
    sizes: [{ size: "Docena", price: 21300 }],
    description: "Bocados de cereal bañados en chocolate blanco o chocolate con leche",
    imageUrl: "https://res.cloudinary.com/dypw938yk/image/upload/v1781650323/mis4deseos/crocante_cereal.webp"
  },
  {
    name: "Cocadas",
    category: "Pastelería Clásica",
    sizes: [{ size: "Docena", price: 8020 }],
    description: "Tapas de merengue italiano y coco rallado súper aireadas y frescas rellenas de dulce de leche",
    imageUrl: "https://res.cloudinary.com/dypw938yk/image/upload/v1781650316/mis4deseos/cocadas.webp"
  },

  // ── PASTELERÍA CLÁSICA (Individual) ─────────────────────
  {
    name: "Budín",
    category: "Pastelería Clásica",
    sizes: [{ size: "Individual", price: 16060 }],
    description: "Budín súper húmedo con cobertura de glasé",
    imageUrl: "https://res.cloudinary.com/dypw938yk/image/upload/v1781650320/mis4deseos/budin.png"
  },

  // ── MUFFINS Y CUPCAKES (Docena) ──────────────────────────
  {
    name: "Muffin Clásico",
    category: "Muffins y Cupcakes",
    sizes: [{ size: "Docena", price: 17300 }],
    description: "Bizcochuelo húmedo con sabor a elección: coco vainilla banana frutos del bosque naranja",
    imageUrl: "https://res.cloudinary.com/dypw938yk/image/upload/v1781650310/mis4deseos/muffin.png"
  },
];

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB conectado');
  } catch (error) {
    console.error('❌ Error de conexión:', error);
    process.exit(1);
  }
};

const importData = async () => {
  try {
    await connectDB();

    await Product.deleteMany();
    await User.deleteMany();
    await Contact.deleteMany();

    console.log('🗑️  Datos eliminados');

    const adminUser = await User.create({
      name: 'Administrador',
      email: 'admin@pasteleria.com',
      password: 'admin123',
      role: 'admin'
    });

    console.log('👤 Usuario admin creado');

    const createdProducts = await Product.insertMany(
      products.map(p => ({
        ...p,
        salesCount: Math.floor(Math.random() * 150),
        createdBy: adminUser._id
      }))
    );

    console.log(`✅ ${createdProducts.length} productos importados`);
    console.log('\n📧 Credenciales Admin:');
    console.log('   Email: admin@pasteleria.com');
    console.log('   Password: admin123');

    // Mostrar precios Chica calculados
    console.log('\n💰 Precios Chica calculados (65% del Grande):');
    products
      .filter(p => p.sizes.length > 1)
      .forEach(p => {
        const chica = p.sizes.find(s => s.size === 'Chica');
        const grande = p.sizes.find(s => s.size === 'Grande');
        console.log(`   ${p.name}: Chica $${chica.price.toLocaleString('es-AR')} / Grande $${grande.price.toLocaleString('es-AR')}`);
      });

    process.exit();
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await connectDB();
    await Product.deleteMany();
    await User.deleteMany();
    await Contact.deleteMany();
    console.log('🗑️  Datos eliminados correctamente');
    process.exit();
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}