<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::with(['category', 'supplier']);

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('sku', 'like', "%{$search}%");
            });
        }

        if ($request->filled('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        if ($request->has('low_stock')) {
            $query->whereColumn('quantity', '<=', 'min_stock_level');
        }

        return $query->paginate($request->get('per_page', 10));
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'category_id' => 'required|exists:categories,id',
            'sku' => 'required|string|unique:products,sku',
            'quantity' => 'integer|min:0',
            'min_stock_level' => 'integer|min:0',
            'expiry_date' => 'nullable|date',
            'supplier_id' => 'required|exists:suppliers,id',
        ]);

        return Product::create($request->all());
    }

    public function show(Product $product)
    {
        return $product->load(['category', 'supplier']);
    }

    public function update(Request $request, Product $product)
    {
        $request->validate([
            'name' => 'required|string',
            'category_id' => 'required|exists:categories,id',
            'sku' => 'required|string|unique:products,sku,' . $product->id,
            'quantity' => 'integer|min:0',
            'min_stock_level' => 'integer|min:0',
            'expiry_date' => 'nullable|date',
            'supplier_id' => 'required|exists:suppliers,id',
        ]);

        $product->update($request->all());
        return $product;
    }

    public function destroy(Product $product)
    {
        $product->delete();
        return response()->json(['message' => 'Produit supprimé']);
    }

    public function exportCSV(Request $request)
    {
        $query = Product::with(['category', 'supplier']);

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('sku', 'like', "%{$search}%");
            });
        }

        if ($request->filled('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        if ($request->has('low_stock')) {
            $query->whereColumn('quantity', '<=', 'min_stock_level');
        }

        $products = $query->get();

        $headers = [
            "Content-type"        => "text/csv",
            "Content-Disposition" => "attachment; filename=produits.csv",
            "Pragma"              => "no-cache",
            "Cache-Control"       => "must-revalidate, post-check=0, pre-check=0",
            "Expires"             => "0"
        ];

        $columns = ['ID', 'Nom', 'SKU', 'Categorie', 'Fournisseur', 'Quantite', 'Seuil Min', 'Date Expiration'];

        $callback = function() use($products, $columns) {
            $file = fopen('php://output', 'w');
            fputcsv($file, $columns);

            foreach ($products as $product) {
                fputcsv($file, [
                    $product->id,
                    $product->name,
                    $product->sku,
                    $product->category?->name,
                    $product->supplier?->name,
                    $product->quantity,
                    $product->min_stock_level,
                    $product->expiry_date?->format('Y-m-d')
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}
