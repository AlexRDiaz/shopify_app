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
// import {fetch} from 'node-fetch';


export default function Configs() {
  const [searchValue, setSearchValue] = useState('');
  const [selectedProducts, setSelectedProducts] = useState([]);

  const [products, setProducts] = useState([]);

  const handleSearchChange = (value) => {
    setSearchValue(value);
  };
  useEffect(() => {
    console.log("Configuracion de Easyshop:", products);
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
      <ui-title-bar title="Ingrese el token de autorizacion de Easyecommerce" />
      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap="300">
            <TextField
                label="Ingrese el nombre de tienda"
                placeholder="su tienda aqui"
                value={searchValue}
                onChange={handleSearchChange}
              />
              <TextField
                label="Ingresar token"
                placeholder="ingresar token aqui"
                value={searchValue}
                onChange={handleSearchChange}
              />
              
              {/* Agregando botón para buscar */}
              <Button primary onClick={() => loadData()}>
                Buscar</Button>
              <DataTable
              
                columnContentTypes={[
                
                  'text',
                  'text',

                ]}
                headings={[
               
                  'Nombre de tienda',
                  'Token',

                ]}
                rows={products.map(product => ([ 
                product.product_name,
                 `$${product.price}`]))}
              // Esta es solo una representación de ejemplo, debes adaptarla a tus datos reales
              //rows={rows}
              />

            </BlockStack>
          </Card>
        </Layout.Section>
        <Layout.Section variant="oneThird">
          <Card>
            <BlockStack gap="200">
              <Text as="h2" variant="headingMd">
                Resources
              </Text>
              <List>
                <List.Item>
                  <Link
                    url="https://shopify.dev/docs/apps/design-guidelines/navigation#app-nav"
                    target="_blank"
                    removeUnderline
                  >
                    App nav best practices
                  </Link>
                </List.Item>
              </List>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}




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