https://github.com/microsoft/vscode/issues/58315

# wrap html tag

- https://github.com/microsoft/vscode/issues/14103

## suggestions

- svg support https://github.com/microsoft/vscode/issues/66053
- data attributes https://github.com/microsoft/vscode/issues/40149
- context aware https://github.com/microsoft/vscode/issues/375

## auto close tag

- https://github.com/microsoft/vscode/issues/52777
- multicursor: https://github.com/microsoft/vscode/issues/78893
- multicursor: https://github.com/microsoft/vscode/issues/33429
- dont duplicate close https://github.com/microsoft/vscode/issues/35143
- wrong closing tab https://github.com/microsoft/vscode/issues/24322
- wrong undo/redo https://github.com/microsoft/vscode/issues/52777

## embedded support

- json https://github.com/microsoft/vscode/issues/36280

## descriptions

- events and aria attributes https://github.com/microsoft/vscode/issues/69318

## slowness

- long documents https://github.com/microsoft/vscode/issues/47712

## syntax

- webpack syntax https://github.com/microsoft/vscode/issues/52495

## interesting features

- auto id class https://github.com/microsoft/vscode/issues/33592
- star custom attributes https://github.com/microsoft/vscode/issues/68548
- go to css https://github.com/microsoft/vscode/issues/27892
- convert to self-closing tag https://github.com/microsoft/vscode/issues/58315
- macro: when typing select + tab, insert the select element and some option elements
- word to self-closing tag https://github.com/emmetio/emmet/issues/413
- hayaku: ctrl+enter adds curly braces in css
- read color from clipboard for css (hayaku) https://github.com/sindresorhus/clipboardy

## uncategorized

- https://github.com/microsoft/vscode/issues/79911

## todo

- https://designmodo.com/css-editors/
- http://websitetips.com/html/tools/
- https://www.developerdrive.com/10-best-open-source-tools-for-web-developers/
- https://stackoverflow.com/questions/411954/tools-for-faster-better-web-development
- westciv
- search web development tools
- https://onextrapixel.com/useful-html5-tools-and-resources-for-web-designers-developers/
- https://royal.pingdom.com/ten-useful-open-source-tools-for-web-developers/
- https://savedelete.com/design/best-linux-web-development-tools/11623/
- https://softwareengineering.stackexchange.com/questions/17929/web-versus-desktop-development-is-web-development-worse

- https://stackoverflow.com/questions/130734/how-can-one-close-html-tags-in-vim-quickly

<!-- auto delete tag

Having

<xml>
	<test>
		<test2>Foo Bar</test2>
	</test>
</xml>

and deleting, let's say <test2 or </test2>, it should automatically remove the pairing tag.
 -->

<!-- multi cursor support for auto rename tag and others -->

<!-- TODO caching for get documentation or make it faster because currently its slow -->

<!-- TODO parsing error

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<body>
    <Header class=""></Header>

</body>
</html>
 -->

 <!-- TODO bug
Auto rename tag: enter space after "div", end tag is not renamed
  <divvvvvvvvvvv>

    </divvvvvvvvvvv>


  -->

<!-- TODO bug
parsing error
 <p>

    </
    p>
 -->

<!-- TODO bug
parsing error when cursor is at start tag

 <dl>
        <
      </dl>
 -->

<!-- TODO idea
writing tag with ! gives example:
h1! -> <h1>hello world</h1>
body! -> <body><h1>hello world</h1>
select! -> <select><option>option 1</option><option>option 2</option></select>
ul! -> <ul><li>list item 1</li><li>list item 2</li></ul>
a! -> <a href="https://google.de" rel="noopener noreferrer">link to a website</a>
img! -> <img src="https://source.unsplash.com/random">
noscript! -> <noscript><p>Please enable Javascript to continue</p></noscript>
address! ->  <address>Written by <a href="mailto:webmaster@example.com">Jon Doe</a>.<br>Visit us at:<br></address>
article! ->  <article><h1>Google Chrome</h1><p>Google Chrome is a free, open-source web browser developed by Google, released in 2008.</p></article>
picture! ->  <picture><source media="(min-width: 650px)" srcset="img_pink_flowers.jpg"></picture>
progress! ->  <progress value="22" max="100"></progress>
script! ->  <script>console.log('hello world')</script>
table! ->  <table>
  <tr>
    <th>Month</th>
    <th>Savings</th>
  </tr>
  <tr>
    <td>January</td>
    <td>$100</td>
  </tr>
</table>

also for custom tags:
amp-carousel! ->
<amp-carousel type="slides"
                width="400"
                height="300"
                layout="responsive"
                lightbox>
    <amp-img src="https://unsplash.it/400/300?image=10"
             width="400"
             height="300"
             layout="responsive"
             alt="a sample image">
    </amp-img>
    <amp-img src="https://unsplash.it/400/300?image=11"
             width="400"
             height="300"
             layout="responsive"
             alt="a sample image">
    </amp-img>
    <amp-img src="https://unsplash.it/400/300?image=12"
             width="400"
             height="300"
             layout="responsive"
             alt="a sample image">
    </amp-img>
    <amp-img src="https://unsplash.it/400/300?image=13"
             width="400"
             height="300"
             layout="responsive"
             alt="a sample image">
    </amp-img>
  </amp-carousel>

 -->

<!-- TODO bug
type '/' as href, auto closing tag does its weird part

 <a href="/>"
 -->

<!-- TODO
some attribute value enums missing
spellcheck: true/false inside sentence, maybe hard to extract
input/autocorrect 'on' | 'off'
 -->

<!-- TODO idea
fast completions:
<div spellcheck="|"> type "t" automatically complete to true


 -->

<!-- TODO auto insert quotes after equal sing for attributes
https://github.com/microsoft/vscode/issues/18071
 -->

<!-- TODO
maybe merge auto-rename-tag and highlight-matching-tag since they both need to know about matching tags and currently it is computed separately for each of them
separately
 -->

<!--
figure out why `!??` is a suggested tag inside a `div`

filter out custom tags like `<todo-item>` when fetching sites

<!-- analyze error (statistics): https://github.com/lyons194/Intellident-Website-Python-Flask -->

-->

<!-- TODO
autoclose tag bug

https://youtrack.jetbrains.com/issue/WEB-36793

 -->

<!-- TODO
test https://youtrack.jetbrains.com/issue/WEB-18206
<div id="div1">
    <div class="dummy" id="div2">
    </div>
</div>


 -->

<!-- TODO
completion for input/autocomplete https://youtrack.jetbrains.com/issue/WEB-32612

 -->

<!-- TODO

not sure
https://youtrack.jetbrains.com/issue/WEB-33713
 -->

<!-- TODO auto rename tag issue https://youtrack.jetbrains.com/issue/WEB-28449 / test case -->

<!-- TODO other bugs
https://youtrack.jetbrains.com/issue/WEB-28014
https://youtrack.jetbrains.com/issue/WEB-28004
 -->

<!-- TODO idea
fuzzy search for attributes
<input tt> -> <input type="text">
<input tn> -> <input type="number">
 -->

 <!-- TODO idea
 need a way to go inside tag
 input -> <input>|
 input -> <input | > -> <input tt| > -> <input type="text" | >
 input -> <input | > -> <input tn| > -> <input type="number" | >

  -->

<!-- TODO
https://youtrack.jetbrains.com/issue/WEB-13292
 -->

<!-- TODO
very interesting, maybe also for adding attribute(classes or something)
https://youtrack.jetbrains.com/issue/WEB-14154

original request is to wrap with tag:
<h1>hello world</h1>.div -> wrapping with div

another idea is similar to auto-class-id
<h1>.</h1> -> <h1 | ></h1>
<h1></h1>. -> <h1 | ></h1>
go inside the tag
 -->

<!-- TODO
class name validation
https://youtrack.jetbrains.com/issue/WEB-8150
in cooperation with css language server / class name provider
 -->

<!-- TODO

sparkup
https://youtrack.jetbrains.com/issue/WEB-537
 -->

<!-- TODO idea
ul li a*3
<ul>
  <li><a></a></li>
  <li><a></a></li>
  <li><a></a></li>
</ul>

apply multiplication to sensible selector

ul li a lorem10*3



p+p
<p></p>
<p></p>
 -->

<!-- TODO
attribute types https://www.w3.org/TR/REC-html40/index/attributes.html
and https://www.w3.org/TR/2017/REC-html52-20171214/fullindex.html#attributes-table

 -->

<!-- TODO
new completion api

https://code.visualstudio.com/updates/v1_40#_support-intellisense-replace-mode
 -->

<!-- TODO
align attributes wrong because notes

 -->

<!-- TODO

autocapitalization wrong because of multiple
 -->

<!-- TODO
missing
link#importance
 -->

<!-- TODO
tests for fuzzy attribute search

 -->

<!-- TODO bug
https://github.com/microsoft/vscode/issues/82556
 -->

<!-- TODO auto rename tag bug

```
<svg viewBox="0 0 100 100">
  <circle cx="0" cy="20" r="20" />
  <path
    d="M91.942 91.212c-.676-.312-1.52-.896-1.876-1.3-.355-.402-3.626-5.64-7.267-11.64L67.69 53.38c-4.67-7.69-8.856-14.376-9.303-14.856-2.2-2.36-6.232-1.847-7.897 1.003-.938 1.607-.796 3.486.44 5.82.896 1.687 1.038 2.253 1.043 4.148.013 4.998-3.26 8.313-8.608 8.717-1.873.142-2.525.328-3.23.922-.487.41-4.05 4.64-7.92 9.403-3.87 4.762-7.33 8.924-7.693 9.25-.924.826-3.62 1.02-4.914.35-2.01-1.04-2.89-3.656-1.943-5.782.32-.718 6.184-11.4 13.034-23.74C37.544 36.278 43.374 25.74 43.65 25.2c.998-1.957.39-4.218-1.434-5.33-2.14-1.303-4.003-.56-6.71 2.674-1.063 1.267-2.56 2.82-3.327 3.447-3.72 3.047-4.39 3.18-15.3 3.06l-8.837-.1-1.844-.86c-2.388-1.116-4.01-2.69-5.09-4.945-1.16-2.412-1.4-4.51-.788-6.895.597-2.33 1.556-3.88 3.407-5.51 2.862-2.52.88-2.37 31.663-2.47 19.077-.064 27.955.012 29.348.25 4.27.733 8.29 3.674 10.38 7.593.83 1.556 6.15 16.138 13.595 37.267.982 2.79 3.854 10.88 6.382 17.978 2.528 7.098 4.692 13.345 4.81 13.88.48 2.206-1.046 4.933-3.347 5.978-1.58.717-3.063.716-4.622-.003z"
  />



  <!-- --\>
</path>

type enter inside the command, renames the path tag to a start comment
 -->

<!-- TODO auto rename tag bug
<svg viewBox="0 0 100 100">
  <circle cx="0" cy="20" r="20" />
  <path
    d="M91.942 91.212c-.676-.312-1.52-.896-1.876-1.3-.355-.402-3.626-5.64-7.267-11.64L67.69 53.38c-4.67-7.69-8.856-14.376-9.303-14.856-2.2-2.36-6.232-1.847-7.897 1.003-.938 1.607-.796 3.486.44 5.82.896 1.687 1.038 2.253 1.043 4.148.013 4.998-3.26 8.313-8.608 8.717-1.873.142-2.525.328-3.23.922-.487.41-4.05 4.64-7.92 9.403-3.87 4.762-7.33 8.924-7.693 9.25-.924.826-3.62 1.02-4.914.35-2.01-1.04-2.89-3.656-1.943-5.782.32-.718 6.184-11.4 13.034-23.74C37.544 36.278 43.374 25.74 43.65 25.2c.998-1.957.39-4.218-1.434-5.33-2.14-1.303-4.003-.56-6.71 2.674-1.063 1.267-2.56 2.82-3.327 3.447-3.72 3.047-4.39 3.18-15.3 3.06l-8.837-.1-1.844-.86c-2.388-1.116-4.01-2.69-5.09-4.945-1.16-2.412-1.4-4.51-.788-6.895.597-2.33 1.556-3.88 3.407-5.51 2.862-2.52.88-2.37 31.663-2.47 19.077-.064 27.955.012 29.348.25 4.27.733 8.29 3.674 10.38 7.593.83 1.556 6.15 16.138 13.595 37.267.982 2.79 3.854 10.88 6.382 17.978 2.528 7.098 4.692 13.345 4.81 13.88.48 2.206-1.046 4.933-3.347 5.978-1.58.717-3.063.716-4.622-.003z"
  />
</svg>

rename path to circle, renames closing svg tag even though path is self-closing
 -->

<!-- TODO auto rename tag bug
//  <h1>
//         hello world

//         <!-- <h1 --\>
//       </h1>

- rename h1 inside comment shouldn't rename anything and
- rename opening h1 should only rename closing h1
- rename closing h1 should only rename opening h1
 -->

<!-- TODO bug
<View
  prop1="1"
>
  <Button />
</View>

The one in the middle is always renamed
same issue as another where getPreviousTagName doesn't work properly with self-closing tags
 -->

<!-- TODO bug auto rename tag
 <h3>
  <span></span>
  <img>
</h3>

type 3 inside closing h3 tag
img tag gets renamed to h33
 -->

<!-- TODO find matching tag bug
<ul>
  <li></li>
  <!-- <li class="x"> --\>
    <a></a>
  </li>
</ul>

 - closing ul tag throws error
 - closing li tag nothing gets highlighted
 -->

<!-- TODO bug
<div>
<div onClick={() => foo()} />
</div>
 -->

<!-- TODO bug
if (i<2) return 3>2
 -->

<!-- TODO use more tests from  https://github.com/vincaslt/vscode-highlight-matching-tag
 -->

<!-- TODO bug
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>title</title>
    s
  </meta>
  <body>
  </body>
</html>

no suggestions for style etc. when typing s
 -->

<!-- TODO bug
auto rename tag when php is in the middle

 -->

 <!-- TODO bug
 auto rename tag with elixir
 
  -->

<!-- TODO
better performance by using 1 listener for onDidchangetextdocument and determine if document languageId is relevant or file is too large
 -->

<!-- TODO bug
<div>

</div>

paste div 2 times
<divdivdiv>

</divdivdiv>

do undo two times does not work, it only toggles between 2 divs and 3 divs
 -->

<!-- TODO bug
auto rename tag does not work when editing closing tag and opening tag at the same time (what should happen?)

 -->

<!-- TODO bug
auto rename tag does not work when there are multiple cursors on a start tag / end tag
at least it should not throw an error that overlapping ranges are not allowed
 -->

<!-- TODO split missing features extension and html language features extension -->
