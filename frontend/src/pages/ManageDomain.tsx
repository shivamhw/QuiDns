import { Box, Button, Stack, TextField, Typography } from '@mui/material';
import * as React from 'react';
import { useLocation } from 'react-router-dom';
import { UserContext } from '../App';
import { Records } from '@prisma/client';
import ResponsiveAppBar from '../components/AppBar';
import StatusFeedback from '../components/StatusFeedback';
import CircularIndeterminate from '../components/LoadingCircle';

export function ManageDomain() {
  const { state: record }: { state: Records } = useLocation()
  const [ip, setIp] = React.useState(record.ip)
  const dns = React.useContext(UserContext).ddnsClient
  const [status, setStatus] = React.useState<number>(0)
  const [loading, setLoading] = React.useState<boolean>(false)

  return (
    <>
      <ResponsiveAppBar></ResponsiveAppBar>
      <Stack
        alignItems="center"
        justifyContent='center'
        sx={{
          height: '100vh'
        }}
        spacing={2}>
        {loading == true ? <CircularIndeterminate></CircularIndeterminate> :
          status == 0 ?
            <>
              <Typography variant="h4" gutterBottom>
                Your Domain {record.cname}
              </Typography>

              <TextField id="outlined-basic" defaultValue={record.ip} label="IP" variant="outlined" onChange={(e) => {
                setIp(e.target.value)
              }} />
              <Box
                display={'flex'}
                gap='8px'>
                <Button variant='contained' onClick={async () => {
                  setLoading(true)
                  const r = await dns?.updateRecord({
                    ip: ip,
                    subdomain: record.cname,
                    rootdomain: record.rootDomain,
                    zone_id: record.zone_id || "",
                    record_id: record.id
                  })

                  console.log("r ", r)
                  setStatus(r?.status || 0)
                  setLoading(false)
                }}>Update</Button>
                <Button variant='contained' color='warning' onClick={async () => {
                  setLoading(true)
                  const r = await dns?.deleteRecord({
                    record_id: record.id,
                    zone_id: record.zone_id || ""
                  })

                  setStatus(r?.status || 0)
                  setLoading(false)
                }}>Delete</Button>
              </Box>
            </> :
            <StatusFeedback status_code={status} ></StatusFeedback>
        }
      </Stack>
    </>
  )
}