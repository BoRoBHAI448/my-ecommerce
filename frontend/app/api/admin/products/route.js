import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getServiceSupabase() {
  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.SUPABASE_URL ||
    "https://sumikeoxhymgcwldwgyd.supabase.co";
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is not defined in server environment variables"
    );
  }
  return createClient(url, serviceKey, {
    auth: { persistSession: false },
  });
}

/**
 * GET /api/admin/products
 * Fetch all products from Supabase using service_role key
 */
export async function GET() {
  try {
    const supabase = getServiceSupabase();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[API Admin Products] Supabase select error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: data || [] });
  } catch (err) {
    console.error("[API Admin Products] GET Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

/**
 * POST /api/admin/products
 * Upsert product in Supabase public.products using secure service_role key
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const supabase = getServiceSupabase();

    const payload = {
      store_id: Number(body.store_id) || 1,
      name: body.name,
      slug: body.slug,
      sku: body.sku || `SKU-${Date.now().toString(36).toUpperCase()}`,
      regular_price: Number(body.regular_price) || 0,
      selling_price: Number(body.selling_price) || 0,
      discount_price: body.discount_price ? Number(body.discount_price) : null,
      discount_badge: body.discount_badge || null,
      stock: Number(body.stock) || 0,
      in_stock: Boolean(body.in_stock),
      thumbnail: body.thumbnail || null,
      images: Array.isArray(body.images) ? body.images : [],
      short_description: body.short_description || null,
      description: body.description || null,
      gender: body.gender || "Women",
      category_id: body.category_id ? Number(body.category_id) : null,
      brand_id: body.brand_id ? Number(body.brand_id) : null,
      is_active: body.is_active !== false,
      is_featured: Boolean(body.is_featured),
      updated_at: new Date().toISOString(),
    };

    // Upsert on store_id and slug so revisions update cleanly
    const { data, error } = await supabase
      .from("products")
      .upsert(payload, { onConflict: "store_id, slug" })
      .select()
      .single();

    if (error) {
      console.error("[API Admin Products] Supabase insert error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error("[API Admin Products] Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

/**
 * DELETE /api/admin/products?id=<productId>&slug=<productSlug>
 */
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const slug = searchParams.get("slug");
    if (!id && !slug) {
      return NextResponse.json({ error: "Missing product id or slug" }, { status: 400 });
    }

    const supabase = getServiceSupabase();
    let query = supabase.from("products").delete();
    if (id) {
      query = query.eq("id", id);
    } else if (slug) {
      query = query.eq("slug", slug);
    }

    const { error } = await query;

    if (error) {
      console.error("[API Admin Products] Supabase delete error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[API Admin Products] Delete error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

/**
 * PATCH /api/admin/products
 * Update fields like is_active or stock
 */
export async function PATCH(request) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;
    if (!id) {
      return NextResponse.json({ error: "Missing product id" }, { status: 400 });
    }

    const supabase = getServiceSupabase();
    const { data, error } = await supabase
      .from("products")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("[API Admin Products] Supabase patch error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error("[API Admin Products] Patch error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
