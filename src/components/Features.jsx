import { Element } from "react-scroll";
import { details, features } from "../constants/index.jsx";
import { Button } from "@/components/ui/button";
import { Marker } from "./Marker.jsx";

const Features = () => {
  return (
    <section>
      <Element name="features">
        <div className="web-container">
          <div className="pt-24 sm:pt-28 lg:pt-36 bg-background">
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
              {details.map((detail) => (
                <div
                  key={detail.id}
                  className="relative rounded-3xl border-2 border-border bg-card p-6 text-center"
                >
                  <div className="flex items-center justify-center mx-auto mb-4 border-2 border-border rounded-full transition-all duration-500 shadow-400 size-20">
                    <img
                      src={detail.icon}
                      alt={detail.title}
                      className="size-17/20 object-contain z-20"
                    />
                  </div>
                  <h3 className="base-small uppercase tracking-[0.2em] text-foreground">
                    {detail.title}
                  </h3>
                </div>
              ))}
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-2 py-24 sm:py-28 lg:py-36">
            {features.map((feature) => (
              <div
                key={feature.id}
                className="relative rounded-7xl border-2 border-border bg-card p-6 md:p-8"
              >
                <div className="flex items-start gap-4 mb-8">
                  <div className="flex items-center justify-center flex-col">
                    <div className="w-0.5 h-16 bg-s3 mb-4" />
                    <img
                      src={feature.icon}
                      className="size-28 object-contain"
                      alt={feature.title}
                    />
                  </div>
                </div>

                <p className="caption mb-5">{feature.caption}</p>
                <h2 className="mb-6 h3 text-foreground max-md:h5">
                  {feature.title}
                </h2>
                <p className="mb-10 body-1 max-md:body-3">{feature.text}</p>
                <Button
                  size="lg"
                  className="rounded-full btn base p-4 flex items-center gap-2 relative"
                  aria-label={feature.button.title}
                >
                  <span className="absolute -left-px">
                    <Marker
                      fill="currentColor"
                      className="text-secondary size-5 z-10"
                    />
                  </span>
                  <img
                    src={feature.button.icon}
                    alt={feature.button.title}
                    className="text-secondary size-6 z-10"
                  />
                  {feature.button.title}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </Element>
    </section>
  );
};
export default Features;
