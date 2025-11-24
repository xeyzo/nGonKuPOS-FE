export interface Category {
  id?: number;
  name: string;
  description?: string;
  isActive?: boolean;
  picturePath?: string;
}


export interface CategoryResponse{
  status: number;
  message: string;
  data: {
    content: Category[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
  };
}