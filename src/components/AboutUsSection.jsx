import aboutImage from "../assets/restaurant.png";

const stats = [
  { value: "12", label: "RETTER PÅ MENUEN" },
  { value: "6", label: "ÅRS ERFARING" },
  { value: "100", label: "% NORDISKE RÅVARER" },
];

const AboutUsSection = () => {
  return (
    <section className="px-3 py-14 lg:px-[30px] lg:py-[78px]">
      <div className="max-w-[1240px] mx-auto grid lg:grid-cols-2 lg:items-end gap-6 lg:gap-10">
        <img
          src={aboutImage}
          alt="Nordic Table restaurant"
          className="w-full h-[300px] lg:h-[700px] object-cover rounded-xl"
        />

        <div className="flex flex-col gap-4.5 px-1 lg:px-0">
          <p className="m-0 text-[#866727] font-[family-name:var(--font-body)] text-[15px] font-semibold tracking-[0.14em] uppercase">
            OM OS
          </p>

          <h2 className="m-0 font-[family-name:var(--font-heading)] text-[36px] lg:text-[clamp(2.2rem,4vw,3.4rem)] font-light leading-[1.06] text-[#1a1a1a]">
            En restaurant båret af nærhed og nærvær
          </h2>

          <span className="block w-[84px] border-t-2 border-[#b39659]" aria-hidden="true" />

          <div className="flex flex-col gap-3.5 text-[#2f2f2f] font-[family-name:var(--font-body)] text-base lg:text-lg leading-relaxed">
            <p className="m-0">
              Nordic Table er grundlagt med en klar overbevisning: god mad
              behøver ikke at være kompliceret. Vi laver mad af det, naturen
              giver os - det nordiske køkkens uforlignelige råvarer.
            </p>
            <p className="m-0">
              Fra de friske fiskefarvande til skovens bær og urter - vores menu
              forandrer sig med årstidens rytme. Det giver gæsterne noget nyt at
              opdage, og det giver os glæden ved at lave mad med det bedste, vi
              kan få fat i.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-0">
            {stats.map((item) => (
              <article
                key={item.label}
                className="min-h-24 px-2 py-3 bg-[#f2ede5] border border-[rgba(145,107,28,0.2)] flex flex-col items-center justify-center gap-1 text-center"
              >
                <p className="m-0 font-[family-name:var(--font-heading)] text-[52px] font-light leading-none text-[#7c632f]">
                  {item.value}
                </p>
                <p className="m-0 font-[family-name:var(--font-body)] text-xs lg:text-sm font-semibold leading-[1.05] text-[#1a1a1a] uppercase tracking-wide">
                  {item.label}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUsSection;
