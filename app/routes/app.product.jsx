import {
  Box,
  Card,
  Layout,
  Link,
  List,
  Page,
  Text,
  BlockStack,
  TextField,
  Button,
  DataTable,
  Checkbox,
} from "@shopify/polaris";
import { useEffect, useState } from "react";
import { authenticate } from "../shopify.server";
import { useActionData, useNavigation, useSubmit } from "@remix-run/react";
import { json } from "@remix-run/node";
// import {fetch} from 'node-fetch';



export const action = async ({ request }) => {

// let formData =request.formData();
const formData = Object.fromEntries(await request.formData());
const { product } = formData;
const newproduct=JSON.parse(formData.product)
console.log('Product:', JSON.parse(formData.product));

const { admin } = await authenticate.admin(request);
 const color = ["ROJO", "Naranja", "Amarillo", "verde"][
   Math.floor(Math.random() * 4)
 ];
 const response = await admin.graphql(
   `#graphql
     mutation populateProduct($input: ProductInput!) {
       productCreate(input: $input) {
         product {
           id
           title
           handle
           status
           variants(first: 10) {
             edges {
               node {
                 id
                 price
                 barcode
                 createdAt
               }
             }
           }
         }
       }
     }`,
   {
     variables: {
       input: {
         title: `${color} Tabla ${newproduct.product_name}`,
         variants: [{ price: Math.random() * 100 }],
       },
     },
   }
 );
 const responseJson = await response.json();

 return json({
   product: responseJson.data.productCreate.product,
 });
};

export default function Products() {



  const [searchValue, setSearchValue] = useState('');
  const [selectedProducts, setSelectedProducts] = useState([]);

  const [products, setProducts] = useState([]);
  const nav = useNavigation();
  const actionData = useActionData();
  const submit = useSubmit();
  const isLoading =
    ["loading", "submitting"].includes(nav.state) && nav.formMethod === "POST";
  const productId = actionData?.product?.id.replace(
    "gid://shopify/Product/",
    ""
  );

  useEffect(() => {
    if (productId) {
      shopify.toast.show("Product created");
    }
  }, [productId]);




  const generateProduct = async (products) => {
    const firstProduct = products[0]; 
    console.log("se hizo click");
    console.log(firstProduct);

   await submit({ product: JSON.stringify(firstProduct) }, { replace: true, method: "POST" });
  };




  const handleSearchChange = (value) => {
    setSearchValue(value);
  };
  useEffect(() => {
    console.log("Estado de productos actualizado:", products);
  }, [products]);


  const columns = [
    { header: 'ID', key: 'id' },
    { header: 'Nombre', key: 'nombre' },
    { header: 'Descripción', key: 'descripcion' },
    // Agrega aquí más columnas según los detalles del producto
  ];
  const rows = [
    ['Emerald Silk Gown', '$875.00'],
    ['Mauve Cashmere Scarf', '$230.00'],
    [
      'Navy Merino Wool Blazer with khaki chinos and yellow belt',
      '$445.00',
    ],
  ];

  const loadData = async () => {
    try {
      const result = await fetchDataFromAPI(searchValue);
      setProducts([result]);
      console.log("Productos cargados:", result);
      console.log("Estado de productos:", products); // Aquí puedes ver si `products` se ha actualizado inmediatamente
    } catch (error) {
      console.error("Error al cargar productos:", error.message);
    }
  }
  const handleProductSelection = (productId) => {
    if (selectedProducts.includes(productId)) {
      setSelectedProducts(selectedProducts.filter(id => id !== productId));
    } else {
      setSelectedProducts([...selectedProducts, productId]);
    }
  };

  return (
<Page>
  <ui-title-bar title="Importar productos" />
  <Layout>
    <Layout.Section>
      <Card>
        <BlockStack gap="700">
          <TextField
            label="Ingrese código(s) para buscar producto"
            placeholder="Ingrese el código..."
            value={searchValue}
            onChange={handleSearchChange}
            
          />
          {/* Contenedor para los botones */}
          <div style={{ display: 'flex', justifyContent: 'left' ,marginTop: '15px',marginBottom: '15px' }}>
            {/* Botón Buscar */}
            <Button primary onClick={() => loadData()}>
              Buscar
            </Button>
            {/* Espacio entre los botones */}
            <div style={{ width: '10px' }}></div>
            {/* Botón Importar */}
            <Button loading={isLoading} onClick={()=>generateProduct(products)}>
                    Generate a product
                  </Button>
                  {actionData?.product && (
                    <Button
                      url={`shopify:admin/products/${productId}`}
                      target="_blank"
                      variant="plain"
                    >
                      View product
                    </Button>
                  )}
          </div>
          
          <DataTable
  columnContentTypes={[
    'checkbox',
    'text', // Agregar una columna para la imagen
    'text',
    'numeric',
    'text',
  ]}
  headings={[
    '',
    'Image', // Encabezado de la columna de la imagen
    'Product',
    'Price',
    'Description',
  ]}
  // Establecer estilos para cada fila de la tabla
  style={{
    tableLayout: 'fixed',
    width: '100%',
  }}
  rows={products.map(product => ([
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <Checkbox
        key={product.id}
        checked={selectedProducts.includes(product.id)}
        onChange={() => handleProductSelection(product.id)}
      />
    </div>,
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <img
        src={"https://api.easyecomerce.com/uploads/123987083_jpg_a3ec30b09b.jpeg"}
        alt={`Imagen de ${product.product_name}`}
        style={{ width: '75px', height: '75px' }}
      />
    </div>,
    <div style={{ display: 'flex', alignItems: 'center', maxWidth: '200px', maxHeight: '75px', overflow: 'hidden', wordWrap: 'break-word' }}>
      <div style={{ whiteSpace: 'pre-wrap' }}>
        {product.product_name}
      </div>
    </div>,
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {`$${product.price}`}
    </div>,
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {`$${product.stock}`}
    </div>
  ]))}
/>



        </BlockStack>
      </Card>
    </Layout.Section>
    {/* Resto del código Layout.Section se omite */}
  </Layout>
</Page>

  );
}


export const importProduct = async ({ request}) => {


  const { admin } = await authenticate.admin(request);
  const color = ["Red", "Orange", "Yellow", "Green"][
    Math.floor(Math.random() * 4)
  ];
  const response = await admin.graphql(
    `#graphql
      mutation populateProduct($input: ProductInput!) {
        productCreate(input: $input) {
          product {
            id
            title
            handle
            status
            variants(first: 10) {
              edges {
                node {
                  id
                  price
                  barcode
                  createdAt
                }
              }
            }
          }
        }
      }`,
    {
      variables: {
        input: {
          title: `${color} Tabla de cocina`,
          variants: [{ price: Math.random() * 100 }],
        },
      },
    }
  );
  const responseJson = await response.json();

  return json({
    product: responseJson.data.productCreate.product,
  });
 
};

export const fetchDataFromAPI = async (id) => {
  try {
    const response = await fetch(`https://devapi.easyecomerce.com/apitest/public/index.php/api/products/${id}`, {
      method: 'POST', // Cambia 'GET' por el método que necesites
      headers: {
        'Content-Type': 'application/json', // Cambia 'application/json' según el tipo de contenido que estés enviando
        // Puedes agregar más encabezados según tus necesidades
      },
      body: JSON.stringify({ "populate": "warehouse" }) // Aquí es donde puedes agregar el cuerpo (body)
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    //setResultValue("producto");
    return data;
  } catch (error) {
    throw new Error(`There was a problem fetching data: ${error.message}`);
  }


  
}