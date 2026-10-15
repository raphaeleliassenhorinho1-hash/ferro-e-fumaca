import type { Metadata } from "next";
import salao from "@/assets/images/scenes/salao.jpg";
import { HoursTable } from "@/components/info/HoursTable";
import { ReservationForm } from "@/components/reservation/ReservationForm";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";

export const metadata: Metadata = {
  title: "Reservas",
  description: "Reserve sua mesa de terça a domingo para até 12 pessoas. Confirmação pelo WhatsApp.",
};

const GOOD_TO_KNOW = [
  "Tolerância de 15 minutos.",
  "Reservas de terça a domingo.",
  "A varanda é pet friendly.",
  "Aniversariante com reserva ganha sobremesa.",
  "Mais de 12 pessoas? Fale com a gente pelo WhatsApp sobre eventos.",
];

export default function ReservasPage() {
  return (
    <>
      <PageHero
        label="Reservas"
        title="Sua mesa, sem fila."
        subtitle="Reservas para até 12 pessoas. A confirmação é pelo WhatsApp."
        image={salao}
        imageAlt="Salão do restaurante com mesas de madeira e luz baixa"
      />
      <section aria-label="Formulário de reserva" className="py-14 lg:py-20">
        <Container className="grid gap-12 lg:grid-cols-[2fr_1fr]">
          <ReservationForm />
          <aside className="space-y-8">
            <div className="bg-carvao-2 p-6 ring-1 ring-osso/10">
              <h2 className="font-display text-3xl font-black uppercase">Bom saber</h2>
              <ul className="mt-4 space-y-2 text-osso/85">
                {GOOD_TO_KNOW.map((tip) => (
                  <li key={tip} className="flex gap-2">
                    <span aria-hidden className="text-brasa">✦</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-carvao-2 p-6 ring-1 ring-osso/10">
              <h2 className="font-display text-3xl font-black uppercase">Horários</h2>
              <HoursTable className="mt-3 text-sm" />
            </div>
          </aside>
        </Container>
      </section>
    </>
  );
}
