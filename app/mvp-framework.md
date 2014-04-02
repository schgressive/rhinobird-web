**MVP Framework**
=================
*last edited 060413*

Content
-------
**1. Questions**

**2. Current Framework w/Specs and Explanation**

Questions
---------
**1. Can we create templated (repeatable) elements?**

I would like certain elements to be repeatable w/o the need to hardcode them every time. E.g. header, footer, search bar, video module, etc

-	I am used to doing this with php and a CMS (such as KirbyText)

-	Is there a better way to do this that coincides with our use of Angular.js?

**2. How do I show other "views" w/n the main page?**

At the moment, the index.html has a container div that shows content from another doc (main.html). This is good, but I need it to show subsequent pages that I am currently coding the frameworks for:

-	search results

-	Channels view

Framework
---------

*refer to the following Skitches: [Main Page Top](https://www.evernote.com/shard/s76/sh/78375f57-cf29-40d4-bc3c-e6eca6d0e063/112f9f801a0b8da53b600cbb30e5617d/deep/0/Screenshot%206/4/13%204:20%20PM.png "Main Page Top")
and
[Main Page Filter Expanded](https://www.evernote.com/shard/s76/sh/8a902624-b52b-4e32-8be5-432efc447235/7e101356bda4cae8336fb5d3231f1141/deep/0/Screenshot%206/4/13%204:27%20PM.png "Main Page Filter Expanded")
and [Main Page Bottom](https://www.evernote.com/shard/s76/sh/102d29cc-191e-41b4-a05a-15ef51ef2884/cfcd52f366171978e54afa8cd9672e7f/deep/0/Screenshot%206/4/13%204:22%20PM.png"Main Page Bottom")*

**1. KEY**

-	Solid Blue outline = REQUIRED for MVP

-	Dashed Red outline = DISABLED for MVP (you'll see some piece of it but it won't work)

-	Dashed Green outline = MAYBE for MVP (let's get it in as disabled and add function after everything else is working)

**2. Refer to Spec Lines for itemized list below:**

-	A. Map needs to have the zoom-on-hover-scroll disabled. As-is, it makes it difficult to scroll through the page

-	B. Need to create/show the tooltips that are interacted with for the map (see [this screencap for example](https://www.evernote.com/shard/s76/sh/bbece63c-c62b-472a-8050-2b6bfcf768e7/09701c9d9b2a940254e42bb36c2a7303/deep/0/Screenshot%206/4/13%204:48%20PM.png "Main Page Filter Expanded")) These tooltips will appear on hover, but I think they should be disabled for now.

-	C. Lower content needs to have infinite scroll.

-	D. Live-stream modules need to auto-generate in a 4 column grid, with maybe 3-4 rows showing before infinite scroll kicks in. I'd like most of the markup for each module to be pulled from some existing HTML (e.g. like a PHP snippet) rather than be generated via JS. So the basic framework for each module is semantic, and only a small amount is from the JS/API/etc.

-	E. Generated data for the modules includes: live-stream snapshot, live-stream title, number of comments, number of rebroadcasts, number of hearts, Rhinobird profile image of the
user that is streaming the video, basic geolocation (e.g. Live from Santiago), and tags
