import { startFakeUpstream } from './server.ts'

const port = Number(process.env.FAKE_UPSTREAM_PORT ?? 4010)
const token = process.env.FAKE_UPSTREAM_TOKEN ?? 'test-token'

const failWith = process.env.FAKE_UPSTREAM_FAIL
  ? Number(process.env.FAKE_UPSTREAM_FAIL)
  : undefined

const fake = await startFakeUpstream({ port, token, failWith })
console.log(`Fake countries API listening at ${fake.url}`)
