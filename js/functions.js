// Global variables
var mouseX = 0;
var mouseY = 0;

// Sets callback pointers for mousehover and mousemove, for function references on function tag.
function SetFunctionTagCallbacks()
{
    // Callback that ensures that the div will show when the user hoves over the reference
    $('function').hover(function(e)
    {
        $('div#hover').fadeIn(250)
          .css('top', mouseY + CalculateOffset(e, false))
          .css('left', mouseX + CalculateOffset(e, true))
          .appendTo('body');
      }, function()
      {
        $('div#hover').hide();
      });

    // Callback to make sure the div stays close to the mouse
    $('function').mousemove(function(e) {
        mouseX = e.pageX;
        mouseY = e.pageY;
        var posX = e.pageX + CalculateOffset(e, true);
        var posY = e.pageY + CalculateOffset(e, false);
        $("div#hover").css('top', posY).css('left', posX);
    });

    // Callback that loads the content via ajax in the div
    $('function').mouseenter(function(e) {
        $('div#hover').hide();
        $('div#hover').html('');
        var postData = "function-id=" + ($(this).attr('id'));
        $.post("http://learnopengl.com/content_load.php", postData, function(data) {
            $('div#hover').html(data);
            MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
			$('div#hover pre').each(function(i, e) {hljs.highlightBlock(e)});
        });
    });
    // Ensures that if the user accidentilly enters the hover div, it's still able to hide it by removing the mouse from this div
    $('div#hover').mouseleave(function(e) {
        $(this).hide();
    });
}

// Calculates the horizontal or vertical offset to accomdate for different window sizes.
// Also ensures that if a location is above a certain treshold it will switch values (so html won't overflow out of the window)
function CalculateOffset(e, isHorizontal)
{
    var tresholdHor = 0.55;
    var tresholdVer = 0.45;
    var moveLeft = 20;
    var moveDown = 10;
    // Do horizontal offset calculations
    if(isHorizontal)
    {
        var windowWidth = window.innerWidth;
        var horPos = e.pageX / windowWidth;
        if(horPos > tresholdHor)
        {
            var hoverWidth = $('div#hover').width() + 20;
            moveLeft = -hoverWidth;
            return moveLeft;
        }
        else
            return moveLeft;
    }
    // Do vertical offset calculations
    if(!isHorizontal)
    {
        var windowHeight = window.innerHeight;
        // Offset the actual scrolling position from the pageY variable (gets actual window location instead of page location)
        var mouseY = e.pageY - $(window).scrollTop();
        var vertPos = mouseY / windowHeight;
        // $('div#hover').html(windowHeight + ' ' + mouseY); // Debug
        if(vertPos > tresholdVer)
        {
            var hoverHeight = $('div#hover').height() + 40;
            moveDown = -hoverHeight;
            return moveDown;
        }
        else
            return moveDown;
    }
}
