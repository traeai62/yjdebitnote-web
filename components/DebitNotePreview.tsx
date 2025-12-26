'use client';

import { useRef } from 'react';
import { formatDate } from '@/lib/utils';
import { ArrowLeft, Printer, Download } from 'lucide-react';
import Link from 'next/link';

export default function DebitNotePreview({ data }: { data: any }) {
    const handlePrint = () => {
        window.print();
    };

    const handleDownloadPDF = async () => {
        // Dynamic import to avoid SSR issues
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const html2pdf = (await import('html2pdf.js')).default;
        const element = document.getElementById('debit-note-content');
        const opt = {
            margin: [8, 8, 8, 8],
            filename: `DebitNote_${data.refNo}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
            pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
        };
        // @ts-ignore
        html2pdf().set(opt).from(element).save();
    };

    return (
        <div className="pb-20">
            {/* Actions */}
            <div className="flex justify-between items-center mb-6 print:hidden">
                <Link href="/" className="text-gray-500 hover:text-gray-900 flex items-center gap-2">
                    <ArrowLeft size={20} /> Back to Dashboard
                </Link>
                <div className="flex gap-4">
                    <Link href={`/debit-note/${data.id}/edit`} className="px-4 py-2 bg-yellow-500 text-white rounded shadow hover:bg-yellow-600 flex items-center gap-2">
                        <ArrowLeft size={18} className='rotate-180' /> Edit
                    </Link>
                    <button onClick={handlePrint} className="px-4 py-2 bg-gray-800 text-white rounded shadow hover:bg-gray-900 flex items-center gap-2">
                        <Printer size={18} /> Print
                    </button>
                    <button onClick={handleDownloadPDF} className="px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 flex items-center gap-2">
                        <Download size={18} /> Download PDF
                    </button>
                </div>
            </div>

            <div id="debit-note-content">
                {/* Page 1: Customer Copy */}
                <RenderPage data={data} type="customer" />

                {/* Page Break */}
                <div className="html2pdf__page-break w-full h-8 bg-gray-100 print:hidden"></div>

                {/* Page 2: Internal Copy */}
                <div className="print:break-before-page"></div>
                <RenderPage data={data} type="internal" />
            </div>
        </div>
    );
}

function RenderPage({ data, type }: { data: any, type: 'customer' | 'internal' }) {
    return (
        <div className="bg-white [color-scheme:light] p-12 max-w-[210mm] mx-auto min-h-[297mm] shadow-xl text-black mb-8 relative
                        print:shadow-none print:p-6 print:m-0 print:w-full print:max-w-none print:h-auto print:min-h-0 print:mb-0 print:break-after-always">
            {/* Header */}
            <div className="border-b-2 border-gray-800 pb-3 mb-4 print:pb-2 print:mb-3">
                <div className="flex items-start justify-center gap-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/logo/yjlogo.png" alt="Logo" className="h-16 w-auto object-contain mt-1" />
                    <div className="text-center">
                        <div className="text-gray-900 font-extrabold text-3xl tracking-wide font-serif mb-2 mt-2">PT. YONGJIN JAVASUKA GARMENT</div>
                        <p className="text-gray-600 text-xs">
                            Jl. Siliwangi Km.35, RT.03/RW.11, Benda, Kec. Cicurug, Kabupaten Sukabumi, Jawa Barat 43359<br />
                            Phone : (0266) 735- 930    Fax : (0266) 732-576
                        </p>
                    </div>
                </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-x-12 mb-6 text-sm print:mb-4">
                <div>
                    <div className="flex mb-2">
                        <span className="font-bold w-16">TO</span>
                        <span>: {data.toCompany}</span>
                    </div>
                    <div className="flex mb-2">
                        <span className="font-bold w-16">ATTN</span>
                        <span>: {data.attn}</span>
                    </div>
                </div>
                <div>
                    <div className="flex mb-2">
                        <span className="font-bold w-20">DATE</span>
                        <span>: {formatDate(data.date)}</span>
                    </div>
                    <div className="flex mb-2">
                        <span className="font-bold w-20">REF. NO.</span>
                        <span>: {data.refNo}</span>
                    </div>
                </div>
            </div>

            {/* Title */}
            <div className="text-center mb-6 print:mb-4">
                <h1 className="text-2xl font-bold underline decoration-2 underline-offset-4 uppercase">{data.title}</h1>
            </div>

            {/* Body */}
            <div className="mb-6 text-sm leading-relaxed text-justify print:mb-4">
                <p>
                    Here with we would like to debit regarding <span className="font-semibold">{data.claimType}</span> for <span className="font-semibold">{data.styleInfo}</span> and total qty <span className="font-semibold">{data.totalQty} pcs</span> with total amount <span className="font-semibold">{data.currency} {data.totalAmount?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span> as below detail:
                </p>
            </div>

            {/* Table */}
            <table className="w-full border-collapse border border-gray-800 mb-6 text-sm print:mb-4 print:text-xs">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border border-gray-800 p-2 text-center text-black">Style/Description</th>
                        <th className="border border-gray-800 p-2 w-24 text-center text-black">Order Q'ty</th>
                        <th className="border border-gray-800 p-2 w-20 text-center text-black">Unit</th>
                        <th className="border border-gray-800 p-2 w-32 text-center text-black">Unit Price</th>
                        <th className="border border-gray-800 p-2 w-32 text-center text-black">Total Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {data.lines?.map((line: any, i: number) => (
                        <tr key={i}>
                            <td className="border border-gray-800 p-2">{line.styleDescription}</td>
                            <td className="border border-gray-800 p-2 text-right">{line.orderQty}</td>
                            <td className="border border-gray-800 p-2 text-center">{line.unit}</td>
                            <td className="border border-gray-800 p-2 text-right">{Number(line.unitPrice).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                            <td className="border border-gray-800 p-2 text-right">{Number(line.totalAmount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <tr className="font-bold bg-gray-50">
                        <td className="border border-gray-800 p-2 text-right text-black">TOTAL</td>
                        <td className="border border-gray-800 p-2 text-right text-black">{data.totalQty}</td>
                        <td className="border border-gray-800 p-2"></td>
                        <td className="border border-gray-800 p-2"></td>
                        <td className="border border-gray-800 p-2 text-right text-black">{data.totalAmount?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                    </tr>
                </tfoot>
            </table>

            {/* Amount in words */}
            <div className="mb-5 text-sm font-bold italic print:mb-3 print:text-xs">
                {data.amountInWords}
            </div>

            {/* Bank */}
            <div className="mb-8 text-sm print:mb-6 print:text-xs">
                <p className="mb-2">Please arrange the payment to our bank with full amount.</p>
                <div className="grid grid-cols-[140px_1fr] gap-y-1 ml-4">
                    <div className="font-bold text-black">Beneficiary Name</div>
                    <div>: {data.beneficiaryName}</div>
                    <div className="font-bold text-black">Bank Name</div>
                    <div>: {data.bankName}</div>
                    <div className="font-bold text-black">Bank Address</div>
                    <div>: {data.bankAddress}</div>
                    <div className="font-bold text-black">Account No.</div>
                    <div className="font-mono">: {data.accountNo}</div>
                    <div className="font-bold text-black">SWIFT Code</div>
                    <div className="font-mono">: {data.swiftCode}</div>
                </div>
                <p className="mt-4 italic">Your prompt payment would be highly appreciated.</p>
            </div>

            {/* Signatures */}
            {type === 'customer' ? (
                <div className="flex justify-between text-sm mt-auto pt-8 print:pt-6 print:text-xs">
                    <div className="text-center w-64">
                        <div className="font-bold mb-16 text-black print:mb-12">{data.issuerCompanyName}</div>
                        <div className="font-bold border-b border-gray-800 pb-1 mb-1 text-black">{data.issuerSignerName}</div>
                        <div>{data.issuerSignerTitle}</div>
                    </div>
                    <div className="text-center w-64">
                        <div className="font-bold mb-16 text-black print:mb-12">Confirmed by <br />{data.buyerCompanyName}</div>
                        <div className="border-b border-gray-800 pb-1 mb-1 font-bold text-black">{data.buyerSignerName || "_________________"}</div>
                        <div>{data.buyerSignerTitle || "(Authorized Signature)"}</div>
                    </div>
                </div>
            ) : (
                <div className="pt-8 mt-auto print:pt-6">
                    <div className="grid grid-cols-4 gap-4 text-center text-xs">
                        <div className="col-span-4 text-left font-bold mb-10 text-sm">
                            PT. YONGJIN JAVASUKA GARMENT ( Fty II )
                        </div>

                        {/* Confirmed by (Centered over these? Or just grid?) Based on image, it looks like just 4 columns under the company name */}
                        <div className="col-span-4 text-center font-bold mb-4 text-sm w-full">Confirmed by</div>

                        {/* Signer 1 */}
                        <div className="flex flex-col items-center">
                            <div className="h-20"></div>
                            <div className="font-bold border-b border-gray-800 w-full pb-1 mb-1">{data.internalSigner1Name || 'Syaiful Umam'}</div>
                            <div>{data.internalSigner1Title || 'Merchandiser'}</div>
                        </div>

                        {/* Signer 2 */}
                        <div className="flex flex-col items-center">
                            <div className="h-20"></div>
                            <div className="font-bold border-b border-gray-800 w-full pb-1 mb-1">{data.internalSigner2Name || 'DONNA KIM'}</div>
                            <div>{data.internalSigner2Title || 'Manager'}</div>
                        </div>

                        {/* Signer 3 */}
                        <div className="flex flex-col items-center">
                            <div className="h-20"></div>
                            <div className="font-bold border-b border-gray-800 w-full pb-1 mb-1">{data.internalSigner3Name || 'JH LEE'}</div>
                            <div>{data.internalSigner3Title || 'General Manager'}</div>
                        </div>

                        {/* Signer 4 */}
                        <div className="flex flex-col items-center">
                            <div className="h-20"></div>
                            <div className="font-bold border-b border-gray-800 w-full pb-1 mb-1">{data.internalSigner4Name || 'HOWARD CHAE'}</div>
                            <div>{data.internalSigner4Title || 'President Director'}</div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
