import "./style.css";

type Timeframes = {
  daily: { current: number; previous: number };
  weekly: { current: number; previous: number };
  monthly: { current: number; previous: number };
};

type Activity = {
  title: string;
  timeframes: Timeframes;
};

const styleMap: Record<string, { bgColor: string; bgImage: string }> = {
  Work: {
    bgColor: "bg-orange-300",
    bgImage: "bg-[url(/images/icon-work.svg)]",
  },
  Play: {
    bgColor: "bg-blue-300",
    bgImage: "bg-[url(/images/icon-play.svg)]",
  },
  Study: {
    bgColor: "bg-pink-400",
    bgImage: "bg-[url(/images/icon-study.svg)]",
  },
  Exercise: {
    bgColor: "bg-green-400",
    bgImage: "bg-[url(/images/icon-exercise.svg)]",
  },
  Social: {
    bgColor: "bg-purple-700",
    bgImage: "bg-[url(/images/icon-social.svg)]",
  },
  "Self Care": {
    bgColor: "bg-yellow-400",
    bgImage: "bg-[url(/images/icon-self-care.svg)]",
  },
};

async function loadData(): Promise<void> {
  try {
    const response = await fetch(`${import.meta.env.BASE_URL}/data.json`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data: Activity[] = await response.json();

    const container = document.getElementById("container") as HTMLElement;
    const template = document.getElementById("card") as HTMLTemplateElement;

    const fragment = document.createDocumentFragment();

    data.forEach((item) => {
      const clone = template.content.cloneNode(true) as DocumentFragment;

      (clone.querySelector("[data-title]") as HTMLElement).textContent =
        item.title;

      const style = styleMap[item.title];
      const card = clone.querySelector("article") as HTMLElement;

      if (style) {
        card.classList.add(style.bgColor, style.bgImage);
      } else {
        // fallback або лог помилки
        console.warn(`Unknown title "${item.title}" — no style applied`);
      }

      const currentHours = clone.querySelector("[data-current]") as HTMLElement;
      currentHours.dataset.daily =
        String(item.timeframes.daily.current) + "hrs";
      currentHours.dataset.weekly =
        String(item.timeframes.weekly.current) + "hrs";
      currentHours.dataset.monthly =
        String(item.timeframes.monthly.current) + "hrs";

      const previousHours = clone.querySelector(
        "[data-previous]",
      ) as HTMLElement;
      previousHours.dataset.daily = `Yesterday - ${String(item.timeframes.daily.previous)}hrs`;
      previousHours.dataset.weekly = `Last Month - ${String(item.timeframes.weekly.previous)}hrs`;
      previousHours.dataset.monthly = `last Week - ${String(item.timeframes.monthly.previous)}hrs`;

      fragment.appendChild(clone);
    });

    container.appendChild(fragment);

    function updateTimeframes(selected: keyof Timeframes): void {
      const currentElements = container.querySelectorAll("[data-current]");
      currentElements.forEach((el) => {
        const e = el as HTMLElement;
        e.textContent = e.dataset[selected] ?? "0";
      });
      const previousElements = container.querySelectorAll("[data-previous]");
      previousElements.forEach((el) => {
        const e = el as HTMLElement;
        e.textContent = e.dataset[selected] ?? "0";
      });
    }

    const selectedOption = document.querySelector(
      'input[name="timeframe"]:checked',
    ) as HTMLInputElement;

    updateTimeframes(selectedOption.value as keyof Timeframes);

    document.getElementById("timeframe")?.addEventListener("change", (e) => {
      const target = e.target as HTMLInputElement;
      if (target.name === "timeframe") {
        updateTimeframes(target.value as keyof Timeframes);
      }
    });
  } catch (error) {
    console.log("Fetch error:", error);
  }
}

loadData();
