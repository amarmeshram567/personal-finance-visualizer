'use client';

import {zodResolver} from "@hookform/resolvers/zod";

import {TransactionSchemaZod, TransactionType } from "@/models/transaction";

import {useForm} from "react-hook-form";

import { Button } from "@/components/ui/button";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage, 
} from "@/components/ui/form"

import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import {format} from "date-fns";
import {cn} from "@/lib/utils";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PopoverContent, PopoverTrigger } from "@radix-ui/react-popover";


const CATEGORIES = [
    'Food',
    'Rent',
    'Utilities',
    'Entertainment',
    'Uncategorized',
];

export function TransactionForm({
    onSubmit,
    defaultValues,
} : {
    onSubmit: (values: TransactionType) => void;
    defaultValues?: Partial<TransactionType>;
}) {
    const form = useForm<TransactionType>({
        resolver: zodResolver(TransactionSchemaZod),
        defaultValues: {
            amount: 0,
            description: "",
            type: 'expense',
            date: new Date(),
            category: 'Uncategorized',
            ...defaultValues,
        },
    });


    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField 
                    control={form.control}
                    name="type"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select transaction type" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="expense">Expense</SelectItem>
                                    <SelectItem value="income">Income</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                
                <FormField 
                    control={form.control}
                    name="amount"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Amount</FormLabel>
                            <FormControl>
                                <Input 
                                    type="number"
                                    step="0.01"
                                    {...field}
                                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />

                <FormField 
                    control={form.control}
                    name="description"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                        </FormItem>
                    )}    
                />

                <FormField
                    control={form.control}
                    name="category"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Category</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a category" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {CATEGORIES.map((category) => (
                                        <SelectItem key={category} value={category}>
                                            {category}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="date"
                    render={({field}) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>Date</FormLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button 
                                            variant='outline'
                                            className={cn (
                                                'w-[240px] pl-3 text-left font-normal',
                                                !field.value && 'text-muted-foreground'
                                            )}
                                        >
                                            {field.value ? (
                                                format(field.value, 'PPP')
                                            ) : (
                                                <span>Pick a date</span>
                                            )}
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-40" />
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>

                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={field.value}
                                        onSelect={field.onChange}
                                        disabled={(date) => date > new Date() || date < Date('2025-04-26')}
                                        initialFocus
                                        className="bg-amber-100 rounded"
                                    />
                                </PopoverContent>
                            </Popover>
                        </FormItem>
                    )}
                />
                <Button type="submit">Submit</Button>
            </form>
        </Form>
    );
}












