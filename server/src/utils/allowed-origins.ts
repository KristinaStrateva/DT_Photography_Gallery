import config from './config'

const allowedOrigins: string[] = [config.get('origin')]

export default allowedOrigins
