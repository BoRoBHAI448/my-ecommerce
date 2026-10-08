<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('store_id')->constrained()->onDelete('cascade');
            $table->string('order_number')->unique();
            
            // Customer Info
            $table->string('customer_name');
            $table->string('customer_phone');
            $table->string('customer_email')->nullable();
            
            // Shipping Address
            $table->text('shipping_address');
            $table->string('city')->default('Dhaka');
            $table->string('zone')->nullable(); // Inside Dhaka / Outside Dhaka
            
            // Financial Breakdown
            $table->integer('subtotal')->default(0);
            $table->integer('shipping_cost')->default(0);
            $table->integer('discount_amount')->default(0);
            $table->integer('total_amount')->default(0);
            
            // Payment & Delivery
            $table->string('payment_method')->default('cod'); // cod, bkash, nagad, card
            $table->string('payment_status')->default('pending'); // pending, paid, failed, refunded
            $table->string('order_status')->default('pending'); // pending, confirmed, processing, shipped, delivered, cancelled, returned
            
            $table->text('notes')->nullable();
            $table->string('ip_address')->nullable();
            $table->timestamps();

            $table->index(['store_id', 'order_status']);
            $table->index('customer_phone');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
