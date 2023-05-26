export interface TransactionType {
  [key: string]: any;
  tran_note: string;
  tran_receipt: string;
  tran_amount: number;
  tran_to: string;
  tran_from: string;
  tran_type: string;
  tran_month: string;
  tran_date: string;
  tran_id?: number;
}
