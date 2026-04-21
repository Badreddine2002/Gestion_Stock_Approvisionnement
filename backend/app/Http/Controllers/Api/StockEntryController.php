<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\StockEntry;
use Illuminate\Http\Request;

class StockEntryController extends Controller
{
    public function index(Request $request)
    {
        $query = StockEntry::with(['product.category', 'supplier'])->latest();

        if ($request->filled('category_id')) {
            $query->whereHas('product', function($q) use ($request) {
                $q->where('category_id', $request->category_id);
            });
        }

        return $query->paginate($request->get('per_page', 15));
    }

    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'supplier_id' => 'required|exists:suppliers,id',
            'quantity' => 'required|integer|min:1',
            'entry_date' => 'required|date',
            'notes' => 'nullable|string',
        ]);

        return StockEntry::create($request->all());
    }

    public function show(StockEntry $stockEntry)
    {
        return $stockEntry->load(['product', 'supplier']);
    }

    public function destroy(StockEntry $stockEntry)
    {
        // When deleting an entry, we should ideally revert the quantity, but it's complex if stock is already gone.
        // For simplicity, we just delete the record here.
        $stockEntry->delete();
        return response()->json(['message' => 'Entrée supprimée']);
    }

    public function exportCSV(Request $request)
    {
        $query = StockEntry::with(['product.category', 'supplier'])->latest();

        if ($request->filled('category_id')) {
            $query->whereHas('product', function($q) use ($request) {
                $q->where('category_id', $request->category_id);
            });
        }

        $entries = $query->get();

        $headers = [
            "Content-type"        => "text/csv",
            "Content-Disposition" => "attachment; filename=approvisionnements.csv",
            "Pragma"              => "no-cache",
            "Cache-Control"       => "must-revalidate, post-check=0, pre-check=0",
            "Expires"             => "0"
        ];

        $columns = ['ID', 'Produit', 'Categorie', 'Fournisseur', 'Quantite', 'Date', 'Notes'];

        $callback = function() use($entries, $columns) {
            $file = fopen('php://output', 'w');
            fputcsv($file, $columns);

            foreach ($entries as $entry) {
                fputcsv($file, [
                    $entry->id,
                    $entry->product?->name,
                    $entry->product?->category?->name,
                    $entry->supplier?->name,
                    $entry->quantity,
                    $entry->entry_date,
                    $entry->notes
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}
