export interface Product {
  id?: number;
  barcode: string;
  name: string;
  description?: string;
  buyingPrice: number;
  salePrice: number;
  stock: number;
  picturePath?: string;
  isActive: boolean;
  uomId?: number | null;
  categoryId?: number | null;
}


export interface ProductResponse{
  status: number;
  message: string;
  data: {
    content: Product[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
  };
}