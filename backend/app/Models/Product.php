<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'category_id',
        'sku',
        'quantity',
        'min_stock_level',
        'expiry_date',
        'supplier_id',
    ];

    protected $casts = [
        'expiry_date' => 'date',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function supplier()
    {
        return $this->belongsTo(Supplier::class);
    }

    public function entries()
    {
        return $this->hasMany(StockEntry::class);
    }

    public function exits()
    {
        return $this->hasMany(StockExit::class);
    }
}
