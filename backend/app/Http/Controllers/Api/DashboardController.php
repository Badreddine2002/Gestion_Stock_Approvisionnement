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
    public function index()
    {
        $totalProducts = Product::count();
        $lowStockProducts = Product::whereColumn('quantity', '<=', 'min_stock_level')->count();
        $expiredProducts = Product::where('expiry_date', '<', Carbon::today())->count();
        $nearExpiryProducts = Product::where('expiry_date', '>=', Carbon::today())
            ->where('expiry_date', '<=', Carbon::today()->addDays(30))
            ->count();

        $totalSuppliers = Supplier::count();

        // Monthly stats for chart
        $entriesByMonth = StockEntry::selectRaw('MONTH(entry_date) as month, SUM(quantity) as total')
            ->whereYear('entry_date', Carbon::now()->year)
            ->groupBy('month')
            ->get();

        $exitsByMonth = StockExit::selectRaw('MONTH(exit_date) as month, SUM(quantity) as total')
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
            'recent_entries' => StockEntry::with(['product', 'supplier'])->latest()->limit(5)->get(),
            'recent_exits' => StockExit::with('product')->latest()->limit(5)->get(),
        ]);
    }
}
