import SectionCalendar from "../../sections/SectionCalendar"
import SectionCTA from "../../sections/SectionCTA"
import SectionHero from "../../sections/SectionHero"
import SectionMyCert from "../../sections/SectionMyCert"
import SectionSearch from "../../sections/SectionSearch"

function HomePage() {
    return (
        <div className="h-screen overflow-y-scroll snap-y snap-mandatory">
            <SectionHero/>
            <SectionCalendar/>
            <SectionSearch/>
            <SectionMyCert/>
            <SectionCTA/>
        </div>
    )
}

export default HomePage