import { NextRequest, NextResponse } from "next/server";
import { verifyCashfreeOrder } from "@/lib/cashfree/client";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const orderId = searchParams.get("order_id");

  const origin = request.nextUrl.origin || "http://localhost:3000";

  if (!orderId) {
    return NextResponse.redirect(`${origin}/checkout?error=missing_order_id`);
  }

  try {
    const verification = await verifyCashfreeOrder(orderId);

    if (verification.status === "PAID") {
      // Payment Successful
      return NextResponse.redirect(
        `${origin}/order-confirmation/${encodeURIComponent(
          orderId
        )}?status=success&payment_method=cashfree`
      );
    } else {
      // Payment failed or pending
      return NextResponse.redirect(
        `${origin}/order-confirmation/${encodeURIComponent(
          orderId
        )}?status=${verification.status.toLowerCase()}&payment_method=cashfree`
      );
    }
  } catch (err: any) {
    console.error("Cashfree verification error:", err?.message || err);
    return NextResponse.redirect(
      `${origin}/checkout?error=${encodeURIComponent(
        err?.message || "Payment verification failed"
      )}`
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const orderId = body?.data?.order?.order_id || body?.order_id;

    if (!orderId) {
      return NextResponse.json({ error: "Missing order_id" }, { status: 400 });
    }

    const verification = await verifyCashfreeOrder(orderId);
    return NextResponse.json({ success: true, verification });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Webhook verification failed" },
      { status: 500 }
    );
  }
}
