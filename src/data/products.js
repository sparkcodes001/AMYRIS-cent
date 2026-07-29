// src/data/products.js
import amyrisNoir from "../assets/images/Sapphire_perfume_bottle_with_jas…_202607281034.jpeg";
import amyrisLumiere from "../assets/images/Perfume3.jpeg";
import amyrisVelours from "../assets/images/Green_glass_perfume_bottle_red_202607281034.jpeg";
import amyrisAurum from "../assets/images/Perfume2.jpeg";

const products = [
  {
    id: "amyris-noir",
    name: "Amyris Noir",
    notes: "Oud · Amber · Black Pepper",
    price: 285,
    image: amyrisNoir,
  },
  {
    id: "amyris-lumiere",
    name: "Amyris Lumière",
    notes: "Bergamot · Jasmine · Sandalwood",
    price: 245,
    image: amyrisLumiere,
  },
  {
    id: "amyris-velours",
    name: "Amyris Velours",
    notes: "Vanilla · Tonka Bean · Musk",
    price: 265,
    image: amyrisVelours,
  },
  {
    id: "amyris-aurum",
    name: "Amyris Aurum",
    notes: "Saffron · Rose · Cedarwood",
    price: 310,
    image: amyrisAurum,
  },
];

export default products;
