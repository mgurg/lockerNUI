// server/api/test.ts
import { defineEventHandler } from 'h3'

export default defineEventHandler((event) => {
  return {
    message: "Hello from test endpoint"
  }
})