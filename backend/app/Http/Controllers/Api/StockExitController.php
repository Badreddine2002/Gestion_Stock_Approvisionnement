<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\StockExit;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class StockExitController extends Controller
{
    public function index(Request $request)
    {
        $query = StockExit::with(['product.category'])->latest();

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
            'quantity' => 'required|integer|min:1',
            'exit_date' => 'required|date',
            'reason' => 'nullable|string',
        ]);

        $product = Product::findOrFail($request->product_id);

        if ($product->quantity < $request->quantity) {
            throw ValidationException::withMessages([
                'quantity' => ['Stock insuffisant pour cette sortie.'],
            ]);
        }

        return StockExit::create($request->all());
    }

    public function show(StockExit $stockExit)
    {
        return $stockExit->load('product');
    }

    public function destroy(StockExit $stockExit)
    {
        $stockExit->delete();
        return response()->json(['message' => 'Sortie supprimée']);
    }

    public function exportCSV(Request $request)
    {
        $query = StockExit::with(['product.category'])->latest();

        if ($request->filled('category_id')) {
            $query->whereHas('product', function($q) use ($request) {
                $q->where('category_id', $request->category_id);
            });
        }

        $exits = $query->get();

        $headers = [
            "Content-type"        => "text/csv",
            "Content-Disposition" => "attachment; filename=sorties_stock.csv",
            "Pragma"              => "no-cache",
            "Cache-Control"       => "must-revalidate, post-check=0, pre-check=0",
            "Expires"             => "0"
        ];

        $columns = ['ID', 'Produit', 'Categorie', 'Quantite', 'Date', 'Motif'];

        $callback = function() use($exits, $columns) {
            $file = fopen('php://output', 'w');
            fputcsv($file, $columns);

            foreach ($exits as $exit) {
                fputcsv($file, [
                    $exit->id,
                    $exit->product?->name,
                    $exit->product?->category?->name,
                    $exit->quantity,
                    $exit->exit_date,
                    $exit->reason
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}
