"use client";

import { PayPalButtons } from "@paypal/react-paypal-js";
import { confirmPayment } from "@/app/pago/[reserva_id]/actions";
import { useRouter } from "next/navigation";

export function PaypalClientButton({
  total,
  reservaId,
}: {
  total: number;
  reservaId: number;
}) {
  const router = useRouter();

  return (
    <div className="space-y-2">
      <PayPalButtons
        style={{ layout: "vertical" }}
        createOrder={(data, actions) => {
          return actions.order.create({
            intent: "CAPTURE",
            purchase_units: [
              {
                amount: { value: total.toString(), currency_code: "USD" },
              },
            ],
          });
        }}
        onApprove={async (data, actions) => {
          await actions.order?.capture();
          try {
            const result = await confirmPayment(reservaId);
            if (
              result &&
              typeof result === "object" &&
              "error" in result &&
              (result as { error?: string }).error
            ) {
              // Si la server action devolvió un error explícito
              alert(
                "Hubo un error al confirmar tu reserva. Por favor, contacta a soporte."
              );
              console.error(
                "confirmPayment error:",
                (result as { error?: string }).error
              );
              return;
            }
            router.push("/reservas/exito");
          } catch (err) {
            alert(
              "Hubo un error al confirmar tu reserva. Por favor, contacta a soporte."
            );
            console.error("Error confirming reservation:", err);
          }
        }}
        onError={(err) => {
          console.error("PayPal error", err);
        }}
      />
    </div>
  );
}

export default PaypalClientButton;
