import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { 
  MoreHorizontalIcon, 
  Search, 
  CheckCircle2, 
  Wrench, 
  XCircle 
} from "lucide-react"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { machinesFilter } from "@/schema/machines"
import ConfirmBox from "@/components/partials/confirmBox"

function Machines() {
  const navigate = useNavigate()

  const [showConfirm, setShowConfirm] = useState(false)
  const [confirmInformation, setConfirmInformation] = useState({
    title: "",
    description: "",
    mode: ""
  })

  const [currentPage, setCurrentPage] = useState(1)

  const displayConfirm = (mode, title, description) => {
    setShowConfirm(true)
    setConfirmInformation({ mode, title, description })
  }

  const onConfirm = () => {
    setShowConfirm(false)
  }
  
  const closeConfirm = () => {
    setShowConfirm(false)
  }

  const filterForm = useForm({
    resolver: zodResolver(machinesFilter),
    defaultValues: {
      count: "10",
      term: "",
    },
  });

  const entriesCount = parseInt(filterForm.watch("count") || "10");
  const totalPages = 1; 

  function navigateModules(id) {
    navigate(`/machines/${id}`)
  }

  return (
    <div className="w-full bg-[#FDF8F1] min-h-screen pb-10">
      {showConfirm && (
        <ConfirmBox 
          mode={confirmInformation.mode} 
          cancel={closeConfirm} 
          confirm={onConfirm} 
          description={confirmInformation.description} 
          title={confirmInformation.title} 
        />
      )}

      <section className="flex flex-col w-full px-4 md:px-8 pt-6 space-y-6 animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-l-4 border-[#CD5C08] pl-6">
          <div className="space-y-1">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">Machine Repairs</h1>
            <p className="text-sm text-muted-foreground italic mt-1">Full facility machine maintenance logs.</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-xl overflow-hidden w-full">
          
          <div className="p-5 border-b border-gray-50 flex flex-col md:flex-row gap-4 items-center justify-between bg-white">
            <Form {...filterForm}>
              <form className="flex flex-col md:flex-row gap-4 items-center w-full">
                <div className="relative w-full md:w-[450px] group">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 transition-colors duration-200 group-focus-within:text-[#CD5C08] z-10" />
                  <FormField
                    control={filterForm.control}
                    name="term"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormControl>
                          <Input 
                            placeholder="Search global records..." 
                            className="pl-10 border-gray-200 focus-visible:ring-1 focus-visible:ring-[#CD5C08] focus-visible:border-[#CD5C08] w-full h-11 transition-all duration-200" 
                            {...field} 
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-500">Show</span>
                  <FormField
                    control={filterForm.control}
                    name="count"
                    render={({ field }) => (
                      <FormItem>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="w-20 h-11 border-gray-200 focus:ring-[#CD5C08]">
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="10">10</SelectItem>
                            <SelectItem value="25">25</SelectItem>
                            <SelectItem value="50">50</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                  <span className="text-sm font-medium text-gray-500 text-nowrap">per page</span>
                </div>
              </form>
            </Form>
          </div>

          <div className="overflow-x-auto w-full">
            <Table className="w-full">
              <TableHeader className="bg-gray-50/50">
                <TableRow className="hover:bg-transparent border-b border-gray-100">
                  <TableHead className="font-bold text-gray-700 py-4 pl-6 uppercase text-xs tracking-wider">Request ID</TableHead>
                  <TableHead className="font-bold text-gray-700 uppercase text-xs tracking-wider">Machine ID</TableHead>
                  <TableHead className="font-bold text-gray-700 uppercase text-xs tracking-wider">Owner</TableHead>
                  <TableHead className="font-bold text-gray-700 w-[30%] uppercase text-xs tracking-wider">Description</TableHead>
                  <TableHead className="font-bold text-gray-700 uppercase text-xs tracking-wider">Date</TableHead>
                  <TableHead className="text-right font-bold text-gray-700 pr-6 uppercase text-xs tracking-wider">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.from({ length: 5 }).map((_, index) => (
                  <TableRow 
                    key={index} 
                    className="hover:bg-gray-50/30 transition-all cursor-pointer group"
                    onClick={() => navigateModules(index)}
                  >
                    <TableCell className="font-mono text-[#CD5C08] font-bold pl-6">#R3211</TableCell>
                    <TableCell className="font-semibold text-gray-900">1</TableCell>
                    <TableCell className="font-medium text-gray-900 underline underline-offset-4 decoration-gray-200">James Jones</TableCell>
                    <TableCell className="text-gray-600 italic leading-relaxed">Broken Blender Motor</TableCell>
                    <TableCell className="text-gray-500 font-medium text-sm">12-12-2023</TableCell>
                    <TableCell className="text-right pr-6" onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu modal={false}>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-9 w-9 rounded-full hover:bg-[#CD5C08]/10 hover:text-[#CD5C08] transition-colors cursor-pointer"
                          >
                            <MoreHorizontalIcon className="h-5 w-5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-52 p-2 shadow-2xl border-gray-100">
                          <DropdownMenuLabel className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">Maintenance Ops</DropdownMenuLabel>
                          <DropdownMenuGroup>
                            <DropdownMenuItem 
                              onClick={() => displayConfirm("Resolve", "Resolve Report", "...")} 
                              className="group cursor-pointer focus:bg-green-600 focus:text-white font-medium rounded-md py-2 transition-colors mb-1"
                            >
                              <CheckCircle2 className="mr-2 h-4 w-4 text-gray-500 group-focus:text-white transition-colors" /> Resolve
                            </DropdownMenuItem>

                            <DropdownMenuItem 
                              onClick={() => displayConfirm("Accept", "Accepting Report", "...")} 
                              className="group cursor-pointer focus:bg-[#CD5C08] focus:text-white font-medium rounded-md py-2 transition-colors mb-1"
                            >
                              <Wrench className="mr-2 h-4 w-4 text-gray-500 group-focus:text-white transition-colors" /> Accept
                            </DropdownMenuItem>

                            <DropdownMenuItem 
                              onClick={() => displayConfirm("Reject", "Rejecting Report", "...")} 
                              className="group cursor-pointer focus:bg-red-600 focus:text-white font-medium rounded-md py-2 transition-colors"
                            >
                              <XCircle className="mr-2 h-4 w-4 text-gray-500 group-focus:text-white transition-colors" /> Reject
                            </DropdownMenuItem>
                          </DropdownMenuGroup>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* pagination */}
          <div className="p-5 border-t border-gray-50 flex flex-col md:flex-row items-center justify-between gap-4 bg-gray-50/30">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Total Records: {entriesCount}
            </span>
            <Pagination className="mx-0 w-auto">
              <PaginationContent className="gap-2">
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    className={`text-[#CD5C08] hover:text-white bg-white hover:bg-[#CD5C08] border-[#CD5C08] transition-colors shadow-sm h-10 px-4 rounded-md flex items-center ${
                      currentPage === 1 ? "opacity-50 pointer-events-none" : "cursor-pointer"
                    }`}
                  />
                </PaginationItem>
                
                <PaginationItem>
                  <div className="flex items-center px-5 py-2 bg-white border border-gray-200 rounded-md text-sm font-bold text-[#CD5C08] shadow-sm tracking-tighter">
                    {currentPage} / {totalPages || 1}
                  </div>
                </PaginationItem>

                <PaginationItem>
                  <PaginationNext 
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    className={`text-[#CD5C08] hover:text-white bg-white hover:bg-[#CD5C08] border-[#CD5C08] transition-colors shadow-sm h-10 px-4 rounded-md flex items-center ${
                      currentPage === (totalPages || 1) ? "opacity-50 pointer-events-none" : "cursor-pointer"
                    }`}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Machines;
