import { Bowl} from "./components/bowl.mjs";
import {bases, proteines, ingredients} from "./components/ingredients.mjs";
import {Order} from "./components/order.mjs";

 const order = new Order();
const bowl = new Bowl('regular', bases.rice);
console.log(bowl.price());
