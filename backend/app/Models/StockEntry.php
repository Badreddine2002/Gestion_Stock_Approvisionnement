<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StockEntry extends Model
{
    use HasFactory;

    protected $fillable = ['product_id', 'supplier_id', 'quantity', 'entry_date', 'notes'];

    protected $casts = [
        'entry_date' => 'date',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function supplier()
    {
        return $this->belongsTo(Supplier::class);
    }

    protected static function booted()
    {
        static::created(function ($entry) {
            $entry->product->increment('quantity', $entry->quantity);
        });
    }
}
