"use client";

import Loading from '@/components/Loading';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatPrice } from '@/lib/utils';
import { useGetTransactionsQuery } from '@/state/api';
import { useUser } from '@clerk/nextjs';
import React, { useState } from 'react'

const UserBillingPage = () => {

  const [paymentType, setPaymentType] = useState("all");
  const { user, isLoaded } = useUser();
  const { data: transactions, isLoading: isLoadingTransactions } = useGetTransactionsQuery(
    user?.id || "", {
        skip: !isLoaded || !user
    }
  )

  const filteredData = transactions?.filter((transaction) => {
    const matchesType = paymentType === "all" || transaction.paymentProvider === paymentType;
    return matchesType;
  }) || [];

  if (!isLoaded ) return <Loading />
  if (!user) return <div>Por favor, faça login para ver suas transações.</div>

  return (
    <div className="space-y-8">
        <div className="space-y-6 bg-customgreys-secondarybg">
            <h2 className="text-2xl font-semibold">Histório de transações</h2>
            <div className="flex space-x-4">
                <Select value={paymentType} onValueChange={setPaymentType}>
                    <SelectTrigger className="w-[180px] border-none bg-customgreys-primarybg">
                        <SelectValue placeholder="Tipo de pagamento" />
                    </SelectTrigger>
                    <SelectContent className="bg-customgreys-primarybg text-white-50">
                        <SelectItem className="hover:!bg-white-50 cursor-pointer" value="all">Todos</SelectItem>
                        <SelectItem className="hover:!bg-white-50 cursor-pointer" value="stripe">Stripe</SelectItem>
                        <SelectItem className="hover:!bg-white-50 cursor-pointer" value="paypal">Paypal</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="h-[400px] w-full">
                { isLoadingTransactions ? (
                    <Loading />
                ): (
                    <Table className="text-customgreys-dirtyGrey min-h-[200px]">
                        <TableHeader className="bg-customgreys-darkGrey">
                            <TableRow className="border-none text-white-50">
                                <TableHead className="border-none p-4">
                                    Data
                                </TableHead>
                                <TableHead className="border-none p-4">
                                    Valor
                                </TableHead>
                                <TableHead className="border-none p-4">
                                    Forma de pagamento
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="bg-customgreys-primarybg min-h-[200px] hover:bg-customgreys-primarybg">
                            {filteredData.length > 0 ? (
                                filteredData.map((transaction) => (
                                    <TableRow className="border-none" key={transaction.transactionId}>
                                        <TableCell className="border-none p-4">{new Date(transaction.dateTime).toLocaleDateString()}</TableCell>           
                                        <TableCell className="border-none p-4 font-medium">{formatPrice(transaction.amount)}</TableCell>           
                                        <TableCell className="border-none p-4">{transaction.paymentProvider}</TableCell>           
                                    </TableRow>
                                ))
                            ): (
                                <TableRow className="border-none">
                                    <TableCell className="border-none p-4 text-center" colSpan={3}>Nenhuma transação encontrada.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                )}
            </div>
        </div>
    </div>
  )
}

export default UserBillingPage