import * as React from 'react';
import TopBar from '../components/TopBar';
import { useUser } from '@clerk/clerk-react';
import { Stack } from '@mui/material';
import { Records } from "@prisma/client";
import ActionList from '../components/ActionList';
import { UserContext } from '../App';


export default function MyDomains() {
    const { isLoaded } = useUser();
    const [domains, setDomains] = React.useState<Records[]>()
    const dns = React.useContext(UserContext).ddnsClient
    React.useEffect(() => {
        const fetcher = async () => {
            const r = await dns?.getRecordsByEmail()
            setDomains(r)
        }
        fetcher();
    }, [isLoaded, dns]);

    return (
        <>
            <Stack
                alignItems="center"
                justifyContent='center'
                sx={{
                    height: '100vh'
                }}
                spacing={2}>
                <TopBar></TopBar>
                {domains && <ActionList records={domains}></ActionList>}
            </Stack>

        </>
    )
}