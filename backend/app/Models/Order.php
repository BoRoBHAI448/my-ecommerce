<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = [
        'store_id', 'order_number',
        'customer_name', 'customer_phone', 'customer_email',
        'shipping_address', 'city', 'zone',
        'subtotal', 'shipping_cost', 'discount_amount', 'total_amount',
        'payment_method', 'payment_status', 'order_status',
        'notes', 'ip_address',
    ];

    protected $casts = [
        'subtotal'        => 'integer',
        'shipping_cost'   => 'integer',
        'discount_amount' => 'integer',
        'total_amount'    => 'integer',
    ];

    // ── Relationships ─────────────────────────────
    public function store() { return $this->belongsTo(Store::class); }
    public function items() { return $this->hasMany(OrderItem::class); }

    // ── Helper: Order Number Generator ─────────────
    public static function generateOrderNumber(): string
    {
        $prefix = 'LFZ-';
        $dateStr = date('Ymd');
        $random = strtoupper(substr(uniqid(), -4));
        return $prefix . $dateStr . '-' . $random;
    }
}
