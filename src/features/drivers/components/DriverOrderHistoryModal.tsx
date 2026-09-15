import { useState } from "react";
import { Modal } from "../../../components/Modal";
import { DataTable, type Column } from "../../../components/DataTable";
import { Pagination } from "../../../components/Pagination";
import { StatusBadge } from "../../../components/StatusBadge";
import { TagChip } from "../../../components/TagChip";
import type { DriverOrderRecord } from "../driverOrderHistory";

const columns: Column<DriverOrderRecord>[] = [
  { header: "Order ID", accessor: (row) => <span className="font-medium">{row.id}</span> },
  { header: "Date", accessor: (row) => row.date },
  { header: "Type", accessor: (row) => <TagChip type={row.deliveryType} /> },
  { header: "Status", accessor: (row) => <StatusBadge status={row.status} /> },
  { header: "Amount", accessor: (row) => row.amount, align: "right" },
];

interface DriverOrderHistoryModalProps {
  driverName: string;
  orders: DriverOrderRecord[];
  onClose: () => void;
}

export function DriverOrderHistoryModal({ driverName, orders, onClose }: DriverOrderHistoryModalProps) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const pageCount = Math.max(1, Math.ceil(orders.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const pageRows = orders.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <Modal title={`${driverName}'s Order History`} size="xl" onClose={onClose}>
      <div className="flex flex-col gap-4">
        <DataTable columns={columns} rows={pageRows} rowKey={(row) => row.id} />
        <Pagination
          page={currentPage}
          pageCount={pageCount}
          total={orders.length}
          pageSize={pageSize}
          itemLabel="orders"
          onPageChange={setPage}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setPage(1);
          }}
        />
      </div>
    </Modal>
  );
}
