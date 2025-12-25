import { Elysia } from 'elysia'
import { staticPlugin } from '@elysiajs/static'

new Elysia()
	.use(await staticPlugin(
    {
      assets: 'dist',
      prefix: '/',
      
    }
  )) 
	.listen(process.env.PORT ?? 8080)