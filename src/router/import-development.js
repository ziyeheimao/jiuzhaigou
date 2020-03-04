module.exports = (file) => require('@/views/' + file.replace('-', '/') + '.vue').default
