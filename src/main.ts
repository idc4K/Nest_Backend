import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestApplicationOptions, ValidationPipe } from '@nestjs/common';
import { isDebug } from './constants';
import helmet from 'helmet'
import * as fs from 'fs'
import { FSWatcher } from 'chokidar'


declare const module: any

async function bootstrap() {
  let otpions: NestApplicationOptions | undefined

  const domainName = process.env.DOMAIN_NAME

  const certificateFolder = `/home/certbot/live/${domainName}`

  if (!isDebug()) {
    console.log('Setting up the ssl certificate ...')

    const certificateFilePathPrivKey = `${certificateFolder}/privkey.pem`
    const certificateFilePathFullChain = `${certificateFolder}/fullchain.pem`

    const privateKey = fs.readFileSync(certificateFilePathPrivKey)
    const fullchain = fs.readFileSync(certificateFilePathFullChain)
    console.log(`Domain used is : ${domainName}`)
    otpions = {
      httpsOptions: {
        key: privateKey,
        cert: fullchain
      }
    }
  }
  const app = await NestFactory.create(AppModule, otpions)

  if (!isDebug()) {
    const watcher = new FSWatcher()
    watcher.add(certificateFolder)
    watcher.on('ready', () => {
      console.log(`Ready to watch : ${certificateFolder}`)
    })
    let isRestartingApp = false
    watcher.on('change', async (path, stats) => {
      if (isRestartingApp) return
      isRestartingApp = true
      watcher.close()
      // Redémarrez votre application ici
      if (stats) {
        console.log(`Stats change ${path}...`)
      }
      console.log(`Le fichier ${path} a été modifié. Redémarrage de l\'application...`)

      // Exécutez votre logique de redémarrage de l'application
      await app.close()
      console.log('Application close ...')
      console.log('Restarting')
      await bootstrap()
    })
  }

  const PORT = process.env.PORT || 3003

  const domainsFromEnv = process.env.CORS_ORIGIN || ''

  const whitelist = domainsFromEnv.split(',').map(item => item.trim())

  // creating corsoptions with whitelist
  // https://devpress.csdn.net/react/62ec3d8889d9027116a107ca.html
  const corsOptions = {
    origin (origin, callback) {
      if (!origin || whitelist.includes('*') || whitelist.includes(origin)) {
        callback(null, true)
      }
      else {
        callback(new Error(`Not allowed by CORS, origin: ${origin}`))
      }
    }
  }

  app.setGlobalPrefix('api')
  app.enableCors(corsOptions)
  app.use(helmet.crossOriginResourcePolicy())
  app.use(helmet.dnsPrefetchControl())
  app.use(helmet.frameguard())
  app.use(helmet.hidePoweredBy())
  app.use(helmet.hsts())
  app.use(helmet.ieNoOpen())
  app.use(helmet.noSniff())
  app.use(helmet.originAgentCluster())
  app.use(helmet.permittedCrossDomainPolicies())
  app.use(helmet.referrerPolicy())
  app.use(helmet.xssFilter())
  app.useGlobalPipes(new ValidationPipe())
  // app.use(passport.initialize())

  if (module.hot) {
    module.hot.accept()
    module.hot.dispose(() => app.close())
  }

  await app.listen(PORT, () => console.log(`Running on port ${PORT}`))
}
bootstrap();
