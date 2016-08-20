(function() {

  /* ( x ) Here we define all "global" variables. Technically they aren't globals because these
     JavaScripts are wrapped in an IIFE and so appear in the block-scope of an anonymous function:
  ************************************************************************************************/

  var animateScrollUp,
    channelList,
    determineStatusIcon,
    elemBtnAll,
    elemBtnOffline,
    elemBtnOnline,
    elemBtns,
    getChannelData,
    getChannelLogos,
    imagePlaceholder,
    makeURL,
    setStreamList,
    setStreamStyle,
    statusList,
    streamPanel,
    tokenAddress,
    toTitleCase;

  /* ( x ) In the following array, we list the channels that our app will offer statuses for:
  ************************************************************************************************/

  channelList = [
    'AlexWAnderson',
    'clintstevens',
    'eunosxx',
    'FireFlarepix',
    'FreeCodeCamp',
    'Gilator86',
    'IamTylorBlake',
    'Lokixriddle',
    'MrWolfyy',
    'mugenmidget',
    'NewAgeRetroHippie',
    'NintendoCapriSun',
    'raysfire',
    'SkyPython',
    'Truman',
    'ZeldaDungeon',
    'Zfg1',
    'ZyloLP'
  ];

  /* ( x ) Let's set a placeholder for when there's no user profile picture available:
  ***********************************************************************************************/

  imagePlaceholder = 'https://db.tt/ktl5nn0p';

  /* ( x ) Let's declare the range of statuses available within the app:
  ***********************************************************************************************/

  statusList = {
    offline: 'offline',
    online: 'online',
    closed: 'account closed'
  };

  /* ( x ) Let's set the token for our app:
  ***********************************************************************************************/

  tokenAddress = 'https://api.twitch.tv/kraken/';

  /* ( x ) :
  ***********************************************************************************************/

  elemBtnAll = $('#all')[0];
  elemBtnOnline = $('#online')[0];
  elemBtnOffline = $('#offline')[0];
  elemBtns = [elemBtnAll, elemBtnOnline, elemBtnOffline];
  
  /* ( x ) :
  ***********************************************************************************************/
  
  streamPanel = $('.streams-panel')[0];
  $(streamPanel).css('opacity', 0);

  /* ( x ) :
  ***********************************************************************************************/

  $('.ui-btn').on('click', function(e) {
    elemBtns.forEach(function(elem) { $(elem).addClass('ui-btn-unselected'); });
    $('#' + e.target.id).removeClass('ui-btn-unselected');
    $('#' + e.target.id).addClass('ui-btn-selected');
  });

  /* ( x ) Here we declare a function that when strings are passed to it will return them in 
     title case (e.g. This Is Title Case). For now, I will return the string in all lowercase:
  ***********************************************************************************************/

  toTitleCase = function toTitleCase(str) {
    let regex = /\w\S*/g;
    str = str.replace(regex, function(txt) { return txt.charAt(0).toLowerCase() + txt.substr(1).toLowerCase(); });
    return str;
  };

  /* ( x ) Here we declare a function to make a URL out of a token, type and names:
  ***********************************************************************************************/

  makeURL = function makeURL(type, name) {
    return tokenAddress + type + '/' + name + '?callback=?';
  };

  /* ( x ) :
  ***********************************************************************************************/
  
  determineStatusIcon = function (status) {
    return '<i class="fa fa-square status status-' + status + '" aria-hidden="true"></i> ';
  };

  /* ( x ) :
  ***********************************************************************************************/

  animateScrollUp = function () {
    setTimeout(function() {
      streamPanel.scrollTop = streamPanel.scrollHeight;
      $(streamPanel).animate({ opacity: 1 });
      let scrollUpAnimation = setInterval(function() {
        streamPanel.scrollTop > 0 ? streamPanel.scrollTop = streamPanel.scrollTop - 30 : clearInterval(scrollUpAnimation);
      }, 400);
    }, 1600);
  };

  /* ( x ) :
  ***********************************************************************************************/
  
  setStreamStyle = function (channel, logo) {
    $('#logo-' + channel).css('background', 'url(' + logo + ')');
    $('#logo-' + channel).css('background-size', '60%');
    $('#logo-' + channel).css('background-position', '10px');
    $('#logo-' + channel).css('background-repeat', 'no-repeat');
  }

  /* ( x ) :
  ***********************************************************************************************/

  setStreamList = function (game, status, channel, data, description, logo) {
    html = '<tr class="table ' + status + '"><td id="logo-' + channel + 
          '" class="player-icon" id="icon"></td>' + '<td class="name" id="name">' + 
          '<a class="channelHref" href="' + data.url + '" target="_blank">' + data.name + 
          '</a></td>' + '<td class="streaming" id="streaming">' + determineStatusIcon(status) + 
          game + '<span class="hidden-xs">' + description + '</span></tr>';
    status === "online" ? $("#display").prepend(html) : $("#display").append(html);
    setStreamStyle(channel, logo);
  };

  /* ( x ) :
  ***********************************************************************************************/

  getChannelLogos = function (game, status, channel) {
    $.getJSON(makeURL('channels', channel), function(data) {
      let logo = data.logo != null ? data.logo : imagePlaceholder,
          name = data.display_name != null ? toTitleCase(data.display_name) : channel,
      description = status === 'online' ? ': ' + data.status : '';
      setStreamList(game, status, channel, data, description, logo);
      animateScrollUp();
    });
  };

  /* ( x ) :
  ***********************************************************************************************/

  getChannelData = function getChannelData() {
    channelList.forEach(function(channel) {
      makeURL();
      $.getJSON(makeURL("streams", channel), function(data) {
        let game, status;
        switch(data.stream) {
          case null:
            game = toTitleCase(statusList.offline);
            status = statusList.offline;
            break;
          case undefined:
            game = toTitleCase(statusList.offline);
            status = statusList.offline;
            break;
          default:
            game = data.stream.game;
            status = statusList.online;
        }
        getChannelLogos(game, status, channel, data);
      });
    });
  };

  /* ( x ) :
  ***********************************************************************************************/

  $(document).ready(function() {
    getChannelData();
    $('.selector').click(function() {
      switch ($(this).attr('id')) {
        case 'all':
          $('.online, .offline').removeClass('hidden');
          break;
        case 'online':
          $('.online').removeClass('hidden');
          $('.offline').addClass('hidden');
          break;
        default:
          $('.offline').removeClass('hidden');
          $('.online').addClass('hidden');
      }
    });
  });
}());