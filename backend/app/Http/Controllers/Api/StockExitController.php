<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\StockExit;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class StockExitController extends Controller
{
    public function index()
    {
        return StockExit::with(['product'])->latest()->paginate(15);
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
}
