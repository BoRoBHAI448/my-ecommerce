<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Store;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class StoreController extends Controller
{
    /**
     * Get active store configuration
     */
    public function show(Request $request): JsonResponse
    {
        $domain = $request->header('X-Store-Domain');

        $store = null;
        if ($domain) {
            $store = Store::where('domain', $domain)->where('is_active', true)->first();
        }

        if (!$store) {
            $store = Store::where('is_active', true)->first();
        }

        if (!$store) {
            return response()->json([
                'success' => false,
                'message' => 'Store not found',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'id'                      => $store->id,
                'name'                    => $store->name,
                'slug'                    => $store->slug,
                'domain'                  => $store->domain,
                'logo'                    => $store->logo,
                'tagline'                 => $store->tagline,
                'primary_color'           => $store->primary_color,
                'secondary_color'         => $store->secondary_color,
                'contact_email'           => $store->contact_email,
                'contact_phone'           => $store->contact_phone,
                'whatsapp_number'         => $store->whatsapp_number,
                'address'                 => $store->address,
                'currency'                => $store->currency,
                'currency_symbol'         => $store->currency_symbol,
                'delivery_charge_inside'  => (int) $store->delivery_charge_inside,
                'delivery_charge_outside' => (int) $store->delivery_charge_outside,
                'free_delivery_above'     => $store->free_delivery_above ? (int) $store->free_delivery_above : null,
                'notice_text'             => $store->notice_text,
                'meta_title'              => $store->meta_title,
                'meta_description'        => $store->meta_description,
            ],
        ]);
    }
}
