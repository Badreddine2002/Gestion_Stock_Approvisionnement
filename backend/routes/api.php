<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\StockEntryController;
use App\Http\Controllers\Api\StockExitController;
use App\Http\Controllers\Api\SupplierController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/dashboard', [DashboardController::class, 'index']);

    Route::get('categories/export', [CategoryController::class, 'exportCSV']);
    Route::get('suppliers/export', [SupplierController::class, 'exportCSV']);
    Route::get('products/export', [ProductController::class, 'exportCSV']);
    Route::get('stock-entries/export', [StockEntryController::class, 'exportCSV']);
    Route::get('stock-exits/export', [StockExitController::class, 'exportCSV']);

    Route::apiResource('categories', CategoryController::class);
    Route::apiResource('suppliers', SupplierController::class);
    Route::apiResource('products', ProductController::class);
    Route::apiResource('stock-entries', StockEntryController::class);
    Route::apiResource('stock-exits', StockExitController::class);
});
