import SectionCalendar from "../../sections/SectionCalendar"
import SectionCTA from "../../sections/SectionCTA"
import SectionHero from "../../sections/SectionHero"
import SectionMyCert from "../../sections/SectionMyCert"
import SectionSearch from "../../sections/SectionSearch"

function HomePage() {
  return (
    <main>

      <SectionHero />
      <SectionCalendar />
      <SectionSearch />
      <SectionMyCert />
      <SectionCTA />

    </main>
  )
}

export default HomePage