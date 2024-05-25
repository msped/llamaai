
import { useEffect, useState } from 'react'
import { getSession } from 'next-auth/react'

export default function SignedIn({ children }) {
    const [session, setSession] = useState(null)

    useEffect(() => {
        const fetchAuth = async () => {
            const sessionData = await getSession()
            setSession(sessionData)
        }

        fetchAuth()
        
    }, [])


    if (!session) {
        return null;
    }

    return children
}
