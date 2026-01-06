import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { MoreHorizontalIcon } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { machinesFilter } from "@/schema/machines";
import { useNavigate } from "react-router-dom";
import ConfirmBox from "@/components/partials/confirmBox";
import Requests from "@/utils/Requests";
import { toast } from "sonner";

function Machines() {
  const navigate = useNavigate();

  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmInformation, setConfirmInformation] = useState({
    title: "",
    description: "",
    mode: "",
    repairId: null,
    status: null,
  });
  const [repairs, setRepairs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const filterForm = useForm({
    resolver: zodResolver(machinesFilter),
    defaultValues: {
      count: "10",
      term: "",
    },
  });

  const displayConfirm = (
    mode,
    title,
    description,
    repairId,
    status = null
  ) => {
    setShowConfirm(true);
    setConfirmInformation({
      mode: mode,
      title: title,
      description: description,
      repairId: repairId,
      status: status,
    });
  };

  const onConfirm = () => {
    const { mode, repairId, status } = confirmInformation;

    if (mode === "status") {
      handleStatusUpdate(repairId, status);
    } else if (mode === "delete") {
      handleDeleteRepair(repairId);
    }

    closeConfirm();
  };

  const closeConfirm = () => {
    setShowConfirm(false);
    setConfirmInformation({
      title: "",
      description: "",
      mode: "",
      repairId: null,
      status: null,
    });
  };

  const entriesCount = parseInt(filterForm.watch("count") || "10");
  const searchTerm = filterForm.watch("term")?.toLowerCase() || "";

  const filteredRepairs = repairs.filter((repair) => {
    if (!searchTerm) return true;

    const haystack = [
      repair.repair_id,
      repair.machine_id,
      repair.user_id,
      repair.repair_status,
    ]
      .filter(Boolean)
      .map((value) => value.toString().toLowerCase());

    return haystack.some((value) => value.includes(searchTerm));
  });

  const paginatedRepairs = filteredRepairs.slice(
    (currentPage - 1) * entriesCount,
    currentPage * entriesCount
  );

  const totalPages = Math.max(
    1,
    Math.ceil(filteredRepairs.length / entriesCount)
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [entriesCount, searchTerm]);

  useEffect(() => {
    fetchRepairs();
  }, []);

  async function fetchRepairs() {
    try {
      setLoading(true);
      const response = await Requests({
        url: "/management/repair",
        method: "GET",
        credentials: true,
      });

      if (response.data.ok) {
        setRepairs(response.data.repairs);
      }
    } catch (error) {
      console.error("Error fetching repairs:", error);
      toast.error("Failed to load repair data");
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusUpdate(repairId, status) {
    try {
      const response = await Requests({
        url: `/management/repair/${repairId}/status`,
        method: "PATCH",
        data: { status },
        credentials: true,
      });

      if (response.data.ok) {
        toast.success(`Repair ${status} successfully`);
        fetchRepairs();
      }
    } catch (error) {
      console.error("Error updating repair status:", error);
      toast.error("Failed to update repair status");
    }
  }

  async function handleDeleteRepair(repairId) {
    try {
      const response = await Requests({
        url: `/management/repair/${repairId}`,
        method: "DELETE",
        credentials: true,
      });

      if (response.data.ok) {
        toast.success("Repair deleted successfully");
        fetchRepairs();
      }
    } catch (error) {
      console.error("Error deleting repair:", error);
      toast.error("Failed to delete repair");
    }
  }

  function filterSubmit() {
    console.log("Filtration");
  }

  function navigateModules(id) {
    navigate(`/machines/${id}`);
  }

  return (
    <>
      {showConfirm && (
        <ConfirmBox
          mode={confirmInformation.modal}
          cancel={closeConfirm}
          confirm={onConfirm}
          description={confirmInformation.description}
          title={confirmInformation.title}
        />
      )}
      <section className="flex flex-col h-auto my-auto pb-4">
        <h1 className="text-3xl md:text-5xl font-medium my-4 text-center">
          Machine Repairs
        </h1>
        <Table className={"flex flex-col h-auto w-auto xl:w-5xl border-2"}>
          <TableCaption className={"flex w-full justify-between px-2"}>
            <Form {...filterForm}>
              <form
                onSubmit={filterForm.handleSubmit(filterSubmit)}
                className="flex justify-between items-center gap-4"
              >
                <div className="flex items-center justify-center gap-2">
                  <p className="font-medium text-xs md:text-sm">Show</p>

                  <FormField
                    control={filterForm.control}
                    name="count"
                    render={({ field }) => (
                      <FormItem>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value.toString()}
                        >
                          <FormControl>
                            <SelectTrigger className="w-auto text-xs md:text-sm">
                              <SelectValue placeholder="Select count" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Entries</SelectLabel>
                              <SelectItem value="10">10</SelectItem>
                              <SelectItem value="15">15</SelectItem>
                              <SelectItem value="20">20</SelectItem>
                              <SelectItem value="25">25</SelectItem>
                              <SelectItem value="30">30</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />

                  <p className="font-medium text-xs md:text-sm">Entries</p>
                  <FormField
                    control={filterForm.control}
                    name="term"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder="Search"
                            className={
                              "border border-secondary-foreground w-auto md:w-lg"
                            }
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </form>
            </Form>
          </TableCaption>
          <TableHeader>
            <TableRow className={"flex items-center"}>
              <TableHead className="flex flex-1 h-10 items-center text-xs md:text-sm">
                Repair ID
              </TableHead>
              <TableHead className="flex flex-1 h-10 items-center text-xs md:text-sm">
                Machine ID
              </TableHead>
              <TableHead className="flex flex-1 h-10 items-center text-xs md:text-sm">
                User ID
              </TableHead>
              <TableHead className="flex flex-1 h-10 items-center text-xs md:text-sm">
                Date
              </TableHead>
              <TableHead className="flex flex-1 h-10 items-center text-xs md:text-sm">
                Status
              </TableHead>
              <TableHead className="flex flex-1 h-10 items-center text-xs md:text-sm">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow className="flex items-center">
                <TableCell
                  colSpan={6}
                  className="flex flex-1 h-10 items-center justify-center text-xs md:text-sm"
                >
                  Loading...
                </TableCell>
              </TableRow>
            ) : repairs.length === 0 ? (
              <TableRow className="flex items-center">
                <TableCell
                  colSpan={6}
                  className="flex flex-1 h-10 items-center justify-center text-xs md:text-sm"
                >
                  No repairs found
                </TableCell>
              </TableRow>
            ) : (
              paginatedRepairs.map((repair) => (
                <TableRow
                  key={repair.repair_id}
                  className="flex items-center cursor-pointer"
                  onClick={() => navigateModules(repair.repair_id)}
                >
                  <TableCell className="flex flex-1 h-10 items-center text-xs md:text-sm">
                    {repair.repair_id.substring(0, 8)}
                  </TableCell>
                  <TableCell className="flex flex-1 h-10 items-center text-xs md:text-sm">
                    {repair.machine_id || "N/A"}
                  </TableCell>
                  <TableCell className="flex flex-1 h-10 items-center text-xs md:text-sm">
                    {repair.user_id ? repair.user_id.substring(0, 8) : "N/A"}
                  </TableCell>
                  <TableCell className="flex flex-1 h-10 items-center text-xs md:text-sm">
                    {new Date(repair.date_created).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="flex flex-1 h-10 items-center text-xs md:text-sm">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        repair.repair_status === "active"
                          ? "bg-green-100 text-green-800"
                          : repair.repair_status === "cancelled"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {repair.repair_status}
                    </span>
                  </TableCell>
                  <TableCell
                    className="flex flex-1 h-10 items-center text-xs md:text-sm"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <DropdownMenu modal={false}>
                      <DropdownMenuTrigger asChild>
                        <Button
                          className="text-white"
                          variant="outline"
                          aria-label="Open menu"
                          size="icon-sm"
                        >
                          <MoreHorizontalIcon />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-40" align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuGroup>
                          <DropdownMenuItem
                            onClick={() =>
                              displayConfirm(
                                "status",
                                "Mark as Active",
                                "Are you sure you want to mark this repair as active?",
                                repair.repair_id,
                                "active"
                              )
                            }
                          >
                            Mark Active
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              displayConfirm(
                                "status",
                                "Postpone Repair",
                                "Are you sure you want to postpone this repair?",
                                repair.repair_id,
                                "postponed"
                              )
                            }
                          >
                            Postpone
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              displayConfirm(
                                "status",
                                "Cancel Repair",
                                "Are you sure you want to cancel this repair?",
                                repair.repair_id,
                                "cancelled"
                              )
                            }
                          >
                            Cancel
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              displayConfirm(
                                "delete",
                                "Delete Repair",
                                "Are you sure you want to permanently delete this repair? This action cannot be undone.",
                                repair.repair_id
                              )
                            }
                            className="text-red-600"
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() =>
                    setCurrentPage((page) => Math.max(1, page - 1))
                  }
                  disabled={currentPage === 1}
                  className={
                    currentPage === 1
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
              {[...Array(totalPages)].map((_, index) => {
                const pageNumber = index + 1;

                if (
                  pageNumber === 1 ||
                  pageNumber === totalPages ||
                  (pageNumber >= currentPage - 1 &&
                    pageNumber <= currentPage + 1)
                ) {
                  return (
                    <PaginationItem key={pageNumber}>
                      <PaginationLink
                        onClick={() => setCurrentPage(pageNumber)}
                        isActive={currentPage === pageNumber}
                        className="cursor-pointer"
                      >
                        {pageNumber}
                      </PaginationLink>
                    </PaginationItem>
                  );
                }

                if (
                  pageNumber === currentPage - 2 ||
                  pageNumber === currentPage + 2
                ) {
                  return (
                    <PaginationItem key={pageNumber}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  );
                }

                return null;
              })}
              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    setCurrentPage((page) => Math.min(totalPages, page + 1))
                  }
                  disabled={currentPage === totalPages}
                  className={
                    currentPage === totalPages
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </Table>
      </section>
    </>
  );
}

export default Machines;
