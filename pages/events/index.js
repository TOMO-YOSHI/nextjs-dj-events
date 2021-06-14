import Layout from '@/components/Layout'
import EventItem from '@/components/EventItem'
import Pagination from '@/components/Pagination'
import { API_URL, PER_PAGE } from '@/config/index'

export default function EventsPage({ events, page, total }) {

    return (
        <Layout>
            <h1>Events</h1>
            {
                events.length === 0 && <h3>No events to show</h3>
            }

            {
                events.map((evt) => (
                    <EventItem key={evt.id} evt={evt} />
                ))
            }

            <Pagination page={page} total={total} />
        </Layout>
    )
}

// getStaticProps ... this is called only at build time
// getServerSideProps ... this is called everytime the page is loaded
export async function getServerSideProps({query: {page = 1}}) {
    // Calc start page
    const start = +page === 1 ? 0 : (+page - 1) * PER_PAGE

    // Fetch total/count
    const totalRes = await fetch(`${API_URL}/events/count`)
    const total = await totalRes.json()

    // Fetch event
    const res = await fetch(`${API_URL}/events?_sort=date:ASC&_limit=${PER_PAGE}&_start=${start}`)
    const events = await res.json()

    // console.log(events)

    return {
        props: { events, page: +page, total },
        // revalidate: 1,
    }
}
