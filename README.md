# =R=o=l=l=e=r=c=o=a=s=t=e=r

[Rollercoaster](http://rollercoaster.io/) is a site showcasing good-looking tablet-optimized sites, best practices and interesting design patterns. 

The concept is simple: a screenshot and a few lines of commentary per site. 

Visitors can quickly browse between featured sites with the left-right arrows or with a swipe gesture.

## Contributing

Contributing is easy! Give us a shout at [@odevrel](https://twitter.com/odevrel) on Twitter and share the URL of a site you think we should review.

If you want to contribute your own reviews, just follow these steps:

1. Fork this repository.
2. Take a screenshot of the site you want to write about, save it as JPG or PNG, give it a sensible name and place it in the `postimages` folder.
3. Navigate to `_posts` and create a new Markdown file. It must start with 3 lines of YAML metadata: 
	- `---`
	- `layout: post` → just copy this as is
	- `name: Site Name` → enter the full name of the site.
	- `image: sitename.png` → replace `sitename.png` with the name of the image you've placed in the `postimages` folder. 
	- `website: http://www.sitename.com/` → the URL of the website you've reviewed
	- `copy: © 2013 site owner etc.` → the copyright notice on the website you've reviewed. Don't include if there is no copyright notice shown.
	- `---`
4. Below the YAML metadata, you write your review in Markdown syntax, and save the file with a file name in the following format: `yyyy-mm-dd-sitename.md`
5. Once all that is done, do a pull request to get it added to master.

**

## Image optimization tips

For consistency purposes, screenshots should be 1024x768px in portrait mode, and taken using [Coast by Opera](https://itunes.apple.com/app/coast-by-opera/id674024845).

In order to determine which file size is smaller, save the screenshot as JPG (80% quality), run it through [ImageOptim](http://imageoptim.com). This is very important!

## Running a local copy of the site

If you want to run a local copy of the site, you'll need [Jekyll](http://jekyllrb.com). You can start the site by running `jekyll serve --watch --baseurl=` from terminal, and going to `http://localhost:3333/` in your web browser. Preview on mobile and tablet is possible too: just figure out your local IP address through `ifconfig` in Terminal, enter it in your mobile or tablet browser, add `:3333/` and off you go.