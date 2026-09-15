import { useState } from "react";
import { Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Modal } from "../../../components/Modal";
import { DataTable, type Column } from "../../../components/DataTable";
import { Pagination } from "../../../components/Pagination";
import { Avatar } from "../../../components/Avatar";
import type { DriverRecord } from "../driverRoster";

function formatCurrency(value: number): string {
  return `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

interface FullRankingModalProps {
  drivers: (DriverRecord & { rank: number })[];
  onClose: () => void;
}

export function FullRankingModal({ drivers, onClose }: FullRankingModalProps) {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const pageCount = Math.max(1, Math.ceil(drivers.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const pageRows = drivers.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const columns: Column<DriverRecord & { rank: number }>[] = [
    { header: "Rank", accessor: (row) => <span className="font-medium text-text-muted">#{row.rank}</span> },
    {
      header: "Driver",
      accessor: (row) => (
        <div className="flex items-center gap-2">
          <Avatar name={row.name} size="sm" />
          <span className="whitespace-nowrap font-medium text-text">{row.name}</span>
        </div>
      ),
    },
    {
      header: "Rating",
      accessor: (row) => (
        <span className="inline-flex items-center gap-1 text-text">
          <Star className="h-3.5 w-3.5 fill-warning text-warning" />
          {row.rating.toFixed(2)}
        </span>
      ),
    },
    { header: "Deliveries", accessor: (row) => row.deliveries.toLocaleString() },
    { header: "On-Time", accessor: (row) => `${row.onTimeRate}%` },
    { header: "Earnings", accessor: (row) => formatCurrency(row.earnings) },
  ];

  return (
    <Modal title={`Full Driver Ranking (${drivers.length})`} size="xl" onClose={onClose}>
      <div className="flex flex-col gap-4">
        <DataTable
          columns={columns}
          rows={pageRows}
          rowKey={(row) => row.id}
          onRowClick={(row) => navigate(`/drivers/${row.id}`)}
        />
        <Pagination
          page={currentPage}
          pageCount={pageCount}
          total={drivers.length}
          pageSize={pageSize}
          itemLabel="drivers"
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
