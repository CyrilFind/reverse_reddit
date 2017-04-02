
// Alien Link

function setupLinks(sort_option) {
	chrome.tabs.query({ 'active': true, 'lastFocusedWindow': true }, function (tabs) {
		var url = tabs[0].url
		$.getJSON("https://api.reddit.com/submit.api?url=" + url , function( result ) {
			console.log(result)
			if (result.data == null) {
				result = result[0]
			}
			if (result.data == null) {
				$("#title").after("<p class=\"link\">" + "Nothing found on reddit :( <br/>" + redditLink("/submit?url=" + url, "Post it yourself ?") + "</p>")
			}
			else {
				var links = sortBy(result.data.children, sort_option)
				console.log(links)
				for (i = 0; i < Math.min(links.length, 10000); i++) { 
					var link_data = links[i].data
					var date = new Date(link_data.created * 1000)
					$("#title").after("<div class=\"link\" > <span class=\"ups\">" + link_data.ups + "</span> - " 
											+ redditLink(link_data.permalink, link_data.title.trunc(100)) + " on " 
											+ redditLink("/r/" + link_data.subreddit, "r/" + link_data.subreddit) + " on "
											+ "<span class=\"date\">" + date.toLocaleDateString() + " - " + date.toLocaleTimeString() + "</span>" 
											+ "</div>")
				}

				$(".ups").click(function () {
					setupLinks("ups")
				})

				$(".date").click(function () {
					setupLinks("created")
				})			
			}
		})
	})
}
	
function redditLink(reddit_url, content, add_r_slash) {
	var href = "https://www.reddit.com" + reddit_url		
	return "<a href=\"" + href + "\" class=\"reddit\" target=\"_blank\" >" + content + "</a>"
}

function sortBy(array, key) {
    return array.sort(function(a, b) {
        var x = a.data[key]; var y = b.data[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0))
    });
}

String.prototype.trunc = String.prototype.trunc || function(n){
  return (this.length > n) ? this.substr(0, n-1) + '&hellip;' : this
};

setupLinks("ups")

