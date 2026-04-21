<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Supplier;
use App\Models\StockEntry;
use App\Models\StockExit;
use Illuminate\Http\Request;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $categoryId = $request->query('category_id');

        $productQuery = Product::query();
        $entryQuery = StockEntry::query();
        $exitQuery = StockExit::query();

        if ($categoryId && $categoryId !== '') {
            $productQuery->where('category_id', $categoryId);
            $entryQuery->whereHas('product', fn($q) => $q->where('category_id', $categoryId));
            $exitQuery->whereHas('product', fn($q) => $q->where('category_id', $categoryId));
        }

        $totalProducts = (clone $productQuery)->count();
        $lowStockProducts = (clone $productQuery)->whereColumn('quantity', '<=', 'min_stock_level')->count();
        $expiredProducts = (clone $productQuery)->where('expiry_date', '<', Carbon::today())->count();
        $nearExpiryProducts = (clone $productQuery)->where('expiry_date', '>=', Carbon::today())
            ->where('expiry_date', '<=', Carbon::today()->addDays(30))
            ->count();

        $totalSuppliers = Supplier::count(); // Independent of product category for the global count

        // Monthly stats for chart
        $entriesByMonth = (clone $entryQuery)->selectRaw('MONTH(entry_date) as month, SUM(quantity) as total')
            ->whereYear('entry_date', Carbon::now()->year)
            ->groupBy('month')
            ->get();

        $exitsByMonth = (clone $exitQuery)->selectRaw('MONTH(exit_date) as month, SUM(quantity) as total')
            ->whereYear('exit_date', Carbon::now()->year)
            ->groupBy('month')
            ->get();

        return response()->json([
            'counts' => [
                'total_products' => $totalProducts,
                'low_stock' => $lowStockProducts,
                'expired' => $expiredProducts,
                'near_expiry' => $nearExpiryProducts,
                'total_suppliers' => $totalSuppliers,
            ],
            'charts' => [
                'entries' => $entriesByMonth,
                'exits' => $exitsByMonth,
            ],
            'recent_entries' => (clone $entryQuery)->with(['product.category', 'supplier'])->latest()->limit(5)->get(),
            'recent_exits' => (clone $exitQuery)->with(['product.category'])->latest()->limit(5)->get(),
        ]);
    }
}
