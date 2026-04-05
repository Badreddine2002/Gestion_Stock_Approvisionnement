<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\StockEntry;
use Illuminate\Http\Request;

class StockEntryController extends Controller
{
    public function index()
    {
        return StockEntry::with(['product', 'supplier'])->latest()->paginate(15);
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
}
