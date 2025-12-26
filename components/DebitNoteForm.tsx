'use client';

import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { Plus, Trash2, Save, ArrowLeft } from 'lucide-react';
import { convertToWords } from '@/lib/utils';
import Link from 'next/link';

export default function DebitNoteForm({ initialData }: { initialData?: any }) {
    const router = useRouter();
    const { register, control, handleSubmit, watch, setValue, formState: { errors } } = useForm({
        defaultValues: initialData || {
            date: new Date().toISOString().split('T')[0],
            refNo: '',
            toCompany: '',
            attn: '',
            title: 'CLAIM LETTER',
            claimType: 'Painting Charge',
            styleInfo: '',
            currency: 'USD',
            amountInWords: '',
            lines: [
                { styleDescription: '', orderQty: 0, unit: 'pcs', unitPrice: 0, totalAmount: 0 }
            ],
            // Bank defaults
            beneficiaryName: 'PT. YONGJIN JAVASUKA GARMENT ( FTY II )',
            bankName: 'Shinhan Bank Indonesia',
            bankAddress: 'Jl. Jend, Sudirman Kav 22-23 South Jakarta',
            accountNo: '701-000-069887',
            swiftCode: 'SHBKIDJAXXX',

            // Signature defaults
            issuerCompanyName: 'PT. YONGJIN JAVASUKA GARMENT (Fty II)',
            issuerSignerName: 'Mr. ',
            issuerSignerTitle: 'President Director',
            buyerCompanyName: '',
            buyerSignerName: '',

            // Internal Signers (Page 2)
            internalSigner1Name: 'Syaiful Umam',
            internalSigner1Title: 'Merchandiser',
            internalSigner2Name: 'DONNA KIM',
            internalSigner2Title: 'Manager',
            internalSigner3Name: 'JH LEE',
            internalSigner3Title: 'General Manager',
            internalSigner4Name: 'HOWARD CHAE',
            internalSigner4Title: 'President Director',
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "lines"
    });

    const watchLines = watch("lines");
    const watchToCompany = watch("toCompany");
    const watchCurrency = watch("currency");

    // Calculate totals
    const totalQty = watchLines.reduce((sum: number, line: any) => sum + (Number(line.orderQty) || 0), 0);
    const totalAmount = watchLines.reduce((sum: number, line: any) => sum + (Number(line.totalAmount) || 0), 0);

    useEffect(() => {
        setValue('amountInWords', convertToWords(totalAmount, watchCurrency as 'USD' | 'IDR'));
    }, [totalAmount, watchCurrency, setValue]);

    useEffect(() => {
        if (watchToCompany) {
            setValue('buyerCompanyName', watchToCompany);
        }
    }, [watchToCompany, setValue]);

    // Load Ref No ONLY if creating new
    useEffect(() => {
        if (!initialData) {
            fetch('/api/debit-notes/meta')
                .then(res => res.json())
                .then(data => {
                    const lastSeq = data.lastSequence;
                    const nextSeq = lastSeq + 1;
                    const today = new Date();
                    const yy = today.getFullYear().toString().slice(-2);
                    const mm = (today.getMonth() + 1).toString().padStart(2, '0');
                    const dd = today.getDate().toString().padStart(2, '0');
                    const ref = `YJ2-${yy}${mm}${dd}-${nextSeq}`;
                    setValue('refNo', ref);
                });
        }
    }, [setValue, initialData]);

    const onSubmit = async (data: any) => {
        // Prepare data
        const payload = {
            ...data,
            totalQty,
            totalAmount
        };

        let res;
        if (initialData?.id) {
            // Update
            res = await fetch(`/api/debit-notes/${initialData.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
        } else {
            // Create
            res = await fetch('/api/debit-notes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
        }

        if (res.ok) {
            const json = await res.json();
            router.push(`/debit-note/${json.id}`);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 pb-20">
            {/* Header Actions */}
            <div className="flex justify-between items-center mb-6">
                <Link href="/" className="text-gray-500 hover:text-gray-900 flex items-center gap-2">
                    <ArrowLeft size={20} /> Back to Dashboard
                </Link>
                <div className="flex gap-4">
                    <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 font-medium flex items-center gap-2">
                        <Save size={18} />
                        Save & Preview
                    </button>
                </div>
            </div>

            <div className="bg-white text-gray-900 [color-scheme:light] border rounded-xl shadow-xl p-12 space-y-8 max-w-5xl mx-auto print:shadow-none print:border-none">
                {/* Company Header */}
                <div className="border-b pb-6">
                    <div className="flex items-start justify-center gap-4">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="/logo/yjlogo.png" alt="Logo" className="h-16 w-auto object-contain mt-1" />
                        <div className="text-center">
                            <div className="text-gray-900 font-extrabold text-2xl tracking-wide font-serif mt-4">PT. YONGJIN JAVASUKA GARMENT</div>
                            <p className="text-gray-600 text-sm mt-3 leading-relaxed">
                                Jl. Siliwangi Km.35, RT.03/RW.11, Benda, Kec. Cicurug, Kabupaten Sukabumi, Jawa Barat 43359<br />
                                Phone : (0266) 735- 930    Fax : (0266) 732-576
                            </p>
                        </div>
                    </div>
                </div>

                {/* Document Info */}
                <div className="grid grid-cols-2 gap-12">
                    <div className="space-y-6">
                        <div className="flex items-center">
                            <label className="w-24 text-sm font-bold text-gray-700">TO</label>
                            <div className="flex-1">
                                <input {...register('toCompany', { required: true })} className="w-full border-gray-300 rounded px-2 py-1 shadow-sm focus:ring-blue-500 focus:border-blue-500" placeholder="Buyer Company Name" />
                            </div>
                        </div>
                        <div className="flex items-center">
                            <label className="w-24 text-sm font-bold text-gray-700">ATTN</label>
                            <div className="flex-1">
                                <input {...register('attn')} className="w-full border-gray-300 rounded px-2 py-1 shadow-sm focus:ring-blue-500 focus:border-blue-500" placeholder="Contact Person" />
                            </div>
                        </div>
                    </div>
                    <div className="space-y-6">
                        <div className="flex items-center">
                            <label className="w-24 text-sm font-bold text-gray-700">DATE</label>
                            <div className="flex-1">
                                <input type="date" {...register('date')} className="w-full border-gray-300 rounded px-2 py-1 shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                            </div>
                        </div>
                        <div className="flex items-center">
                            <label className="w-24 text-sm font-bold text-gray-700">REF. NO.</label>
                            <div className="flex-1">
                                <input {...register('refNo')} className="w-full border-gray-300 bg-gray-50 rounded px-2 py-1 shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Title area */}
                <div className="text-center py-6">
                    <input {...register('title')} className="text-center text-3xl font-bold uppercase underline decoration-2 underline-offset-4 border-none w-full focus:ring-0" />
                </div>

                {/* Body */}
                <div>
                    <div className="mb-4 text-justify leading-relaxed">
                        Here with we would like to debit regarding
                        <div className="inline-block mx-2 relative">
                            <select {...register('claimType')} className="appearance-none border-b border-gray-400 border-t-0 border-l-0 border-r-0 bg-transparent py-0 px-2 pr-6 focus:ring-0 text-center font-semibold">
                                <option>Painting Charge</option>
                                <option>Only Painting Charge</option>
                                <option>Shading Issue</option>
                                <option>Fabric Defect</option>
                                <option>Shortage</option>
                            </select>
                        </div>
                        for
                        <input {...register('styleInfo')} className="mx-2 border-b border-gray-400 border-t-0 border-l-0 border-r-0 focus:ring-0 py-0 px-2 w-64 text-center font-semibold" placeholder="Style / PO Info" />
                        and total qty
                        <span className="mx-2 font-bold">{totalQty}</span>
                        pcs with total amount
                        <span className="mx-2 font-bold">
                            {watchCurrency} {totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </span>
                        as below detail:
                    </div>
                </div>

                {/* Table */}
                <div>
                    <table className="w-full border-collapse border border-gray-400">
                        <thead className="bg-gray-100 text-center">
                            <tr>
                                <th className="border border-gray-400 p-2">Style/Description</th>
                                <th className="border border-gray-400 p-2 w-24">Order Q'ty</th>
                                <th className="border border-gray-400 p-2 w-20">Unit</th>
                                <th className="border border-gray-400 p-2 w-32">Unit Price</th>
                                <th className="border border-gray-400 p-2 w-32">Total Amount</th>
                                <th className="border border-gray-400 p-2 w-10"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {fields.map((field, index) => (
                                <tr key={field.id}>
                                    <td className="border border-gray-400 p-2">
                                        <input {...register(`lines.${index}.styleDescription`)} className="w-full border-none focus:ring-0 p-0" placeholder="Description" />
                                    </td>
                                    <td className="border border-gray-400 p-2">
                                        <input
                                            type="number"
                                            {...register(`lines.${index}.orderQty`, {
                                                onChange: (e) => {
                                                    const qty = parseFloat(e.target.value) || 0;
                                                    const price = watchLines[index].unitPrice || 0;
                                                    setValue(`lines.${index}.totalAmount`, qty * price);
                                                }
                                            })}
                                            className="w-full border-none focus:ring-0 p-0 text-right"
                                        />
                                    </td>
                                    <td className="border border-gray-400 p-2">
                                        <input {...register(`lines.${index}.unit`)} className="w-full border-none focus:ring-0 p-0 text-center" />
                                    </td>
                                    <td className="border border-gray-400 p-2">
                                        <input
                                            type="number" step="0.01"
                                            {...register(`lines.${index}.unitPrice`, {
                                                onChange: (e) => {
                                                    const price = parseFloat(e.target.value) || 0;
                                                    const qty = watchLines[index].orderQty || 0;
                                                    setValue(`lines.${index}.totalAmount`, qty * price);
                                                }
                                            })}
                                            className="w-full border-none focus:ring-0 p-0 text-right"
                                        />
                                    </td>
                                    <td className="border border-gray-400 p-2 bg-gray-50 text-right font-medium">
                                        {watchLines[index]?.totalAmount?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                    </td>
                                    <td className="border border-gray-400 p-2 text-center print:hidden">
                                        {fields.length > 1 && (
                                            <button type="button" onClick={() => remove(index)} className="text-red-500 hover:text-red-700">
                                                <Trash2 size={16} />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr className="bg-gray-100 font-bold">
                                <td className="border border-gray-400 p-2 text-right">TOTAL</td>
                                <td className="border border-gray-400 p-2 text-right">{totalQty}</td>
                                <td className="border border-gray-400 p-2"></td>
                                <td className="border border-gray-400 p-2"></td>
                                <td className="border border-gray-400 p-2 text-right">{totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                <td className="border border-gray-400 p-2 print:hidden"></td>
                            </tr>
                        </tfoot>
                    </table>
                    <button
                        type="button"
                        onClick={() => append({ styleDescription: '', orderQty: 0, unit: 'pcs', unitPrice: 0, totalAmount: 0 })}
                        className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1 print:hidden"
                    >
                        <Plus size={16} /> Add Line Item
                    </button>
                </div>

                {/* Amount in words */}
                <div className="bg-gray-50 p-6 border border-gray-200 rounded-lg">
                    <div className="flex gap-4 items-center">
                        <div className="w-24 print:hidden">
                            <select {...register('currency')} className="w-full border-gray-300 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500">
                                <option value="USD">USD</option>
                                <option value="IDR">IDR</option>
                            </select>
                        </div>
                        <input {...register('amountInWords')} className="flex-1 bg-transparent border-none font-bold text-lg italic focus:ring-0" />
                    </div>
                </div>

                {/* Bank Info */}
                <div>
                    <div className="mb-2 font-medium">Please arrange the payment to our bank with full amount.</div>
                    <div className="grid grid-cols-[160px_1fr] gap-y-1 gap-x-4 ml-4">
                        <label className="text-gray-600 font-bold">Beneficiary Name</label>
                        <input {...register('beneficiaryName')} className="w-full border-b border-gray-300 border-t-0 border-l-0 border-r-0 py-0 focus:ring-0" />

                        <label className="text-gray-600 font-bold">Bank Name</label>
                        <input {...register('bankName')} className="w-full border-b border-gray-300 border-t-0 border-l-0 border-r-0 py-0 focus:ring-0" />

                        <label className="text-gray-600 font-bold">Bank Address</label>
                        <input {...register('bankAddress')} className="w-full border-b border-gray-300 border-t-0 border-l-0 border-r-0 py-0 focus:ring-0" />

                        <label className="text-gray-600 font-bold">Account No.</label>
                        <input {...register('accountNo')} className="w-full border-b border-gray-300 border-t-0 border-l-0 border-r-0 py-0 focus:ring-0 font-mono" />

                        <label className="text-gray-600 font-bold">SWIFT Code</label>
                        <input {...register('swiftCode')} className="w-full border-b border-gray-300 border-t-0 border-l-0 border-r-0 py-0 focus:ring-0 font-mono" />
                    </div>
                    <div className="mt-4 italic text-sm">Your prompt payment would be highly appreciated.</div>
                </div>

                {/* Signatures */}
                <div className="flex justify-between pt-20 pb-10">
                    <div className="text-center w-64">
                        <input {...register('issuerCompanyName')} className="text-center w-full font-bold border-none focus:ring-0 mb-20 text-sm" />
                        <input {...register('issuerSignerName')} placeholder="Signer Name" className="text-center w-full border-b border-gray-300 focus:ring-0 mb-1 font-bold" />
                        <input {...register('issuerSignerTitle')} className="text-center w-full text-gray-500 text-sm border-none focus:ring-0" />
                    </div>
                    <div className="text-center w-64">
                        <div className="font-bold mb-2 text-sm">Confirmed by</div>
                        <input {...register('buyerCompanyName')} className="text-center w-full font-bold border-none focus:ring-0 mb-16 text-sm" />
                        <div className="border-b border-gray-300 w-full mb-1"></div>
                        <input {...register('buyerSignerName')} placeholder="Name & Position" className="text-center w-full border-none focus:ring-0 text-sm" />
                    </div>
                </div>

                {/* Internal Signers Config (Hidden Section just to ensure fields are registered or can be edited if needed) */}
                <div className="mt-8 pt-8 border-t border-gray-200">
                    <h3 className="font-bold text-gray-700 mb-4">Internal Approval Signers (For Page 2)</h3>
                    <div className="grid grid-cols-4 gap-4">
                        <div className="space-y-2">
                            <input {...register('internalSigner1Name')} className="w-full border p-2 rounded text-sm" placeholder="Signer 1 Name" />
                            <input {...register('internalSigner1Title')} className="w-full border p-2 rounded text-sm" placeholder="Signer 1 Title" />
                        </div>
                        <div className="space-y-2">
                            <input {...register('internalSigner2Name')} className="w-full border p-2 rounded text-sm" placeholder="Signer 2 Name" />
                            <input {...register('internalSigner2Title')} className="w-full border p-2 rounded text-sm" placeholder="Signer 2 Title" />
                        </div>
                        <div className="space-y-2">
                            <input {...register('internalSigner3Name')} className="w-full border p-2 rounded text-sm" placeholder="Signer 3 Name" />
                            <input {...register('internalSigner3Title')} className="w-full border p-2 rounded text-sm" placeholder="Signer 3 Title" />
                        </div>
                        <div className="space-y-2">
                            <input {...register('internalSigner4Name')} className="w-full border p-2 rounded text-sm" placeholder="Signer 4 Name" />
                            <input {...register('internalSigner4Title')} className="w-full border p-2 rounded text-sm" placeholder="Signer 4 Title" />
                        </div>
                    </div>
                </div>

            </div >
        </form >
    );
}
