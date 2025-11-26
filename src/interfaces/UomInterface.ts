export interface Uom {
  id?: number;
  name: string;
  description?: string;
  isActive?: boolean;
  code?: string;
  symbol?: string;
}


export interface UomResponse{
  status: number;
  message: string;
  data: {
    content: Uom[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
  };
}
