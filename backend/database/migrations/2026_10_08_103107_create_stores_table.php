<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('stores', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('domain')->unique()->nullable();
            $table->string('tagline')->nullable();
            $table->string('logo')->nullable();
            $table->string('favicon')->nullable();
            $table->string('currency', 10)->default('BDT');
            $table->string('currency_symbol', 10)->default('৳');

            // Colors (JSON)
            $table->json('colors')->nullable();

            // Contact info (JSON)
            $table->json('contact')->nullable();

            // Social links (JSON)
            $table->json('social')->nullable();

            // WhatsApp number (digits only)
            $table->string('whatsapp', 20)->nullable();

            // Announcement bar
            $table->boolean('announcement_enabled')->default(false);
            $table->string('announcement_text')->nullable();

            // Delivery pricing
            $table->unsignedInteger('delivery_inside_dhaka')->default(70);
            $table->unsignedInteger('delivery_sub_dhaka')->default(100);
            $table->unsignedInteger('delivery_outside_dhaka')->default(130);
            $table->unsignedInteger('free_delivery_threshold')->default(0);

            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('stores');
    }
};
