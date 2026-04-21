<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Supplier;
use Illuminate\Http\Request;

class SupplierController extends Controller
{
    public function index(Request $request)
    {
        $query = Supplier::query();

        if ($request->filled('category_id')) {
            $query->whereHas('products', function($q) use ($request) {
                $q->where('category_id', $request->category_id);
            });
        }

        return $query->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'contact_person' => 'nullable|string',
            'phone' => 'nullable|string',
            'email' => 'nullable|email',
            'address' => 'nullable|string',
        ]);

        return Supplier::create($request->all());
    }

    public function show(Supplier $supplier)
    {
        return $supplier;
    }

    public function update(Request $request, Supplier $supplier)
    {
        $request->validate([
            'name' => 'required|string',
            'contact_person' => 'nullable|string',
            'phone' => 'nullable|string',
            'email' => 'nullable|email',
            'address' => 'nullable|string',
        ]);

        $supplier->update($request->all());
        return $supplier;
    }

    public function destroy(Supplier $supplier)
    {
        $supplier->delete();
        return response()->json(['message' => 'Fournisseur supprimé']);
    }

    public function exportCSV(Request $request)
    {
        $query = Supplier::query();

        if ($request->filled('category_id')) {
            $query->whereHas('products', function($q) use ($request) {
                $q->where('category_id', $request->category_id);
            });
        }

        $suppliers = $query->get();

        $headers = [
            "Content-type"        => "text/csv",
            "Content-Disposition" => "attachment; filename=fournisseurs.csv",
            "Pragma"              => "no-cache",
            "Cache-Control"       => "must-revalidate, post-check=0, pre-check=0",
            "Expires"             => "0"
        ];

        $columns = ['ID', 'Nom', 'Contact', 'Email', 'Telephone', 'Adresse'];

        $callback = function() use($suppliers, $columns) {
            $file = fopen('php://output', 'w');
            fputcsv($file, $columns);

            foreach ($suppliers as $s) {
                fputcsv($file, [
                    $s->id,
                    $s->name,
                    $s->contact_person,
                    $s->email,
                    $s->phone,
                    $s->address
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}
