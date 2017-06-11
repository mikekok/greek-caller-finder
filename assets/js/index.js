// Packages
const request = require('request')
const cheerio = require('cheerio')
const Promise = require('promise')
const remote = require('electron').remote
const Menu = remote.Menu

// Find Caller
function findCaller() {
  let caller, address
  let getInfo = new Promise((resolve, reject) => {
    if ($('.callerid').val()) {
      let callerid = $('.callerid').val()
      url = 'https://www.11888.gr/list-names?_wpType=number&_wpPhone=' + callerid
      request(url, function(err, res, body) {
        let $ = cheerio.load(body)
        if ($('ul.results-list-names').children().length > 0) {
          $('ul.results-list-names > li').each(function(i, e) {
            caller = $(this).find('.title').text().trim()
            address = $(this).find('.address').text().trim()
          })
        } else {
          caller = 'Oops!'
          address = 'No results were found'
        }
        resolve()
      })
    }
  })
  getInfo.then(function() {
    if (caller !== null && address !== null) {
      $('.name').text(caller)
      $('.address').text(address)
    }
    $('.results').show('slow')
  })
}

// Numeric Input Validation
jQuery('.callerid').on('keyup paste', function() {
  this.value = this.value.replace(/[^0-9\.]/g, '')
})

// Find Caller Button Click Event
$('.find').click(function() {
  findCaller()
})

// On Enter Key Press
$('.callerid').keypress(function(e) {
  if (e.which == 13) {
    findCaller()
  }
})

// Add right click menu to inputs
const InputMenu = Menu.buildFromTemplate([{
  label: 'Undo',
  role: 'undo',
}, {
  label: 'Redo',
  role: 'redo',
}, {
  type: 'separator',
}, {
  label: 'Cut',
  role: 'cut',
}, {
  label: 'Copy',
  role: 'copy',
}, {
  label: 'Paste',
  role: 'paste',
}, {
  type: 'separator',
}, {
  label: 'Select all',
  role: 'selectall',
}, ])

document.body.addEventListener('contextmenu', (e) => {
  e.preventDefault()
  e.stopPropagation()

  let node = e.target

  while (node) {
    if (node.nodeName.match(/^(input|textarea)$/i) || node.isContentEditable) {
      InputMenu.popup(remote.getCurrentWindow())
      break
    }
    node = node.parentNode
  }
})

// Form Controls

// Exit Button
$('.exit').click(function() {
  var window = remote.getCurrentWindow()
  window.close()
})

// Minimize Button
$('.mini').click(function() {
  var window = remote.getCurrentWindow()
  window.minimize()
})
