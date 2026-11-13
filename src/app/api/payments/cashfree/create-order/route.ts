import { NextRequest, NextResponse } from "next/server";
import {
  createCashfreeOrder,
  isCashfreeConfigured,
  getCashfreeCredentials,
} from "@/lib/cashfree/client";

export async function POST(request: NextRequest) {
  try {
    if (!isCashfreeConfigured()) {
      return NextResponse.json(
        {
          error:
            "Cashfree credentials are not yet configured. Please set CASHFREE_APP_ID and CASHFREE_SECRET_KEY in .env.local.",
        },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { items, total, customer, registrant } = body;

    if (!items || !items.length) {
      return NextResponse.json({ error: "Cart is empty." }, { status: 400 });
    }

    if (!customer?.fullName || !customer?.email || !customer?.phone) {
      return NextResponse.json(
        { error: "Customer name, email, and phone are required for checkout." },
        { status: 400 }
      );
    }

    // Generate unique order ID
    const orderId = `AMD-${Date.now().toString(36).toUpperCase()}-${Math.floor(
      1000 + Math.random() * 9000
    )}`;

    const origin =
      request.headers.get("origin") ||
      request.headers.get("referer") ||
      "http://localhost:3000";
    let baseUrl = origin.replace(/\/$/, "");

    const creds = getCashfreeCredentials();
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL;

    // Cashfree Production strictly requires HTTPS return_url
    if (creds.isProduction) {
      if (appUrl && appUrl.startsWith("https://")) {
        baseUrl = appUrl.replace(/\/$/, "");
      } else if (baseUrl.startsWith("http://localhost") || !baseUrl.startsWith("https://")) {
        baseUrl = "https://askmedomain.com";
      }
    }

    const returnUrl = `${baseUrl}/api/payments/cashfree/verify?order_id={order_id}`;

    const orderResponse = await createCashfreeOrder({
      orderId,
      amount: total,
      currency: "INR",
      customer: {
        id: `cust_${customer.phone.replace(/[^0-9]/g, "").slice(-10)}`,
        name: customer.fullName,
        email: customer.email,
        phone: customer.phone,
      },
      returnUrl,
      note: `Domain Registration (${items.length} domains) - AskMeDomain`,
    });

    return NextResponse.json({
      success: true,
      orderId: orderResponse.order_id,
      cfOrderId: orderResponse.cf_order_id,
      paymentSessionId: orderResponse.payment_session_id,
      orderStatus: orderResponse.order_status,
      environment: creds.isProduction ? "production" : "sandbox",
    });
  } catch (err: any) {
    console.error("Cashfree create order error:", err?.message || err);
    return NextResponse.json(
      { error: err?.message || "Failed to create Cashfree payment order." },
      { status: 500 }
    );
  }
}
