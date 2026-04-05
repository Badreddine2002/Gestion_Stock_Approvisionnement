<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StockExit extends Model
{
    use HasFactory;

    protected $fillable = ['product_id', 'quantity', 'exit_date', 'reason'];

    protected $casts = [
        'exit_date' => 'date',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    protected static function booted()
    {
        static::created(function ($exit) {
            $exit->product->decrement('quantity', $exit->quantity);
        });
    }
}
