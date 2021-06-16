import { API_URL } from '@/config/index'
import { parseCookies } from '@/helpers/index'
import Layout from '../../components/Layout'
import { useRouter } from 'next/router'
import DashboardEvent from '../../components/DashboardEvent'
import styles from '../../styles/Dashboard.module.css'

export default function dashboard({events, token}) {
    const router = useRouter()
    const deleteEvent = async (id) => {
        if (confirm('Are you sure?')) {
            const res = await fetch(`${API_URL}/events/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            const data = await res.json()

            if (!res.ok) {
                toast.error(data.error)
            } else {
                router.reload()
            }
        }
    }

    return (
        <Layout title='User Dashboard'>
            <div className={styles.dash}>
                <h1>Dashboard</h1>
                <h3>My Events</h3>

                {
                    events.map((evt) => (
                        <DashboardEvent key={evt.id} evt={evt} handleDelete={deleteEvent} />
                    ))
                }
            </div>
        </Layout>
    )
}

export async function getServerSideProps({req}) {
    const { token } = parseCookies(req)

    console.log(token)

    const res = await fetch(`${API_URL}/events/me`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

    const events = await res.json()

    return {
        props: {events, token}
    }
}