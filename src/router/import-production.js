module.exports = file => () => import('@/views/' + file.replace('-', '/') + '.vue')
