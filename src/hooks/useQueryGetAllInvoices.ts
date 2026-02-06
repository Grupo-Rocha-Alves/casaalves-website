import { useState } from "react";
import api from "../service/api";
import toast from "react-hot-toast";

interface Invoice {
  idDuplicata: number;
  data: string;
  mes: number;
  ano: number;
  diaSemana: string;
  valor: string;
  dataVencimento: string;
  dataPagamento: string | null;
  status: boolean | string;
  formaPagamento: string | null;
  nomeFornecedor: string;
  documentoFornecedor: string;
  descricao: string;
}

interface GetAllInvoicesParams {
  mes?: number;
  ano?: number;
  status?: string;
  nomeFornecedor?: string;
  documentoFornecedor?: string;
  formaPagamento?: string;
  dataInicio?: string;
  dataFim?: string;
  dataVencimentoInicio?: string;
  dataVencimentoFim?: string;
  dataPagamentoInicio?: string;
  dataPagamentoFim?: string;
  page?: number;
  limit?: number;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export function useQueryGetAllInvoices() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const getAllInvoices = async (params: GetAllInvoicesParams = {}) => {
    setLoading(true);
    try {
      const response = await api.get<{
        success: boolean;
        data: Invoice[];
        pagination: Pagination;
      }>("/invoices/getAllInvoices", { params });

      if (response.data.success) {
        setInvoices(response.data.data);
        setPagination(response.data.pagination);
      }
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Erro ao buscar duplicatas";
      toast.error(message);
      setInvoices([]);
      setPagination({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    invoices,
    loading,
    pagination,
    getAllInvoices,
  };
}
