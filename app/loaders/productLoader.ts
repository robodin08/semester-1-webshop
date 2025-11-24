import { type LoaderFunctionArgs } from "react-router";
import { getProductById } from "~/data/products";

export async function productLoader({ params }: LoaderFunctionArgs) {
  const product = await getProductById(params.pid);

  if (!product) {
    throw new Response("Product not found", {
      status: 404,
      statusText: `Product with id ${params.pid} not found`,
    });
  }

  return product;
}
