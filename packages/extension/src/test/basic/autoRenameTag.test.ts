import { before, test } from 'mocha'
import {
  activateExtension,
  createTestFile,
  run,
  TestCase,
  slowTimeout,
  slowSpeed,
} from '../test-utils'

suite('Auto Rename Tag', () => {
  before(async () => {
    await createTestFile('auto-rename-tag.html')
    await activateExtension()
  })

  test('Cursor is at the back of a start tag', async () => {
    const testCases: TestCase[] = [
      {
        input: '<div|>test</div>',
        type: 's',
        expect: '<divs>test</divs>',
      },
      {
        input: '<div|>test</div>',
        type: '{backspace}',
        expect: '<di>test</di>',
      },
      {
        input: '<div|>test</div>',
        type: '{backspace}{backspace}{backspace}',
        expect: '<>test</>',
      },
      {
        input: '<div|>test</div>',
        type: ' ',
        expect: '<div >test</div>',
      },
      {
        input: '<div|>test</div>',
        type: ' c',
        expect: '<div c>test</div>',
      },
      {
        input: '<div|>test</div>',
        type: '{backspace}{backspace}{backspace} ',
        expect: '< >test</>',
      },
      {
        input: '<div|>test</div>',
        type: 'v{undo}',
        expect: '<div>test</div>',
      },
      {
        input: '<div|>test</div>',
        type: 'v{undo}{redo}',
        expect: '<divv>test</divv>',
      },
    ]
    await run(testCases, {
      speed: slowSpeed,
      timeout: slowTimeout,
    })
  })

  test('Cursor at the front of a start tag', async () => {
    const testCases: TestCase[] = [
      {
        input: '<|div>test</div>',
        type: 's',
        expect: '<sdiv>test</sdiv>',
      },
    ]
    await run(testCases, {
      timeout: slowTimeout,
    })
  })

  test('tag with class', async () => {
    const testCases: TestCase[] = [
      {
        input: '<div| class="css">test</div>',
        type: 'v',
        expect: '<divv class="css">test</divv>',
      },
      {
        input: '<div| class="css">test</div>',
        type: '{backspace}{backspace}{backspace}',
        expect: '< class="css">test</>',
        skip: true,
      },
      {
        input: '<div | class="css">test</div>',
        type: '{backspace}v',
        expect: '<divv class="css">test</divv>',
      },
    ]
    await run(testCases, { speed: slowSpeed, timeout: slowTimeout })
  })

  test('multiple lines', async () => {
    const testCases: TestCase[] = [
      {
        input: '<div|>\n  test\n</div>',
        type: '{backspace}{backspace}{backspace}h3',
        expect: '<h3>\n  test\n</h3>',
        speed: slowSpeed,
      },
    ]
    await run(testCases)
  })

  test('div and a nested span', async () => {
    const testCases: TestCase[] = [
      {
        input: '<div|>\n  <span>test</span>\n</div>',
        type: '{backspace}{backspace}{backspace}h3',
        expect: '<h3>\n  <span>test</span>\n</h3>',
      },
      {
        input: '<div>\n  <span|>test</span>\n</div>',
        type: '{backspace}{backspace}{backspace}{backspace}b',
        expect: '<div>\n  <b>test</b>\n</div>',
      },
      {
        input: '<div>\n  <span|>test</span>\n</div>',
        type: 'n',
        expect: '<div>\n  <spann>test</spann>\n</div>',
      },
    ]
    await run(testCases, { speed: slowSpeed, timeout: slowTimeout })
  })

  test('nested div tags', async () => {
    const testCases: TestCase[] = [
      {
        input: '<div|>\n  <div>test</div>\n</div>',
        type: '{backspace}{backspace}{backspace}h3',
        expect: '<h3>\n  <div>test</div>\n</h3>',
      },
      {
        input: '<div>\n  <div>test</div|>\n</div>',
        type: '{backspace}{backspace}{backspace}p',
        expect: '<div>\n  <p>test</p>\n</div>',
      },
    ]
    await run(testCases, { speed: slowSpeed })
  })

  test('dashed tag', async () => {
    const testCases: TestCase[] = [
      {
        input: '<dashed-div|>test</dashed-div>',
        type: '{backspace}{backspace}{backspace}{backspace}-span',
        expect: '<dashed-span>test</dashed-span>',
      },
    ]
    await run(testCases, { speed: slowSpeed })
  })

  test('uppercase tag', async () => {
    const testCases: TestCase[] = [
      {
        input: '<DIV|>test</DIV>',
        type: 'S',
        expect: '<DIVS>test</DIVS>',
      },
    ]
    await run(testCases, { speed: slowSpeed })
  })

  test('with class on second line', async () => {
    const testCases: TestCase[] = [
      {
        input: '<foo|\n  class="bar">foobar</foo>',
        type: '{backspace}',
        expect: '<fo\n  class="bar">foobar</fo>',
      },
    ]
    await run(testCases)
  })

  test('weird chars at start tag', async () => {
    const testCases: TestCase[] = [
      {
        input: '<DatenSä|tze></DatenSätze>',
        type: 'ä',
        expect: '<DatenSäätze></DatenSäätze>',
      },
      {
        input: '<a|></a>',
        type: '|',
        expect: '<a|></a>',
        skip: true,
      },
      {
        input: '<你|早></你早>',
        type: '早',
        expect: '<你早早></你早早>',
        skip: true,
      },
      {
        input: '<Sil-vous-pla|ît></Sil-vous-plaît>',
        type: 'î',
        expect: '<Sil-vous-plaîît></Sil-vous-plaîît>',
      },
      {
        input: '<ΚΑΛΗ|ΣΠΕΡΑ></ΚΑΛΗΣΠΕΡΑ>',
        type: 'Σ',
        expect: '<ΚΑΛΗΣΣΠΕΡΑ></ΚΑΛΗΣΣΠΕΡΑ>',
        skip: true,
      },
      {
        input: '<foo\\n|  class="bar">foobar</foo>',
        type: 's',
        expect: '<foo\\ns  class="bar">foobar</foo>',
      },
      {
        input: '<foo|\\n  class="bar">foobar</foo>',
        type: 's',
        expect: '<foos\\n  class="bar">foobar</foos>',
        skip: true,
      },
      {
        input: '<foo|( class="bar">foobar</foo>',
        type: '{backspace}',
        expect: '<fo( class="bar">foobar</fo>',
        skip: true,
      },
    ]
    await run(testCases, { speed: slowSpeed })
  })

  test('with incomplete inner tag', async () => {
    const testCases: TestCase[] = [
      {
        input: '<foo>\n<foo|\n</foo>',
        type: 'b',
        expect: '<foo>\n<foob\n</foo>',
      },
    ]
    await run(testCases)
  })

  test('end tag with inline div tag', async () => {
    const testCases: TestCase[] = [
      {
        input: '<div>test</div|>',
        type: 's',
        expect: '<divs>test</divs>',
      },
    ]
    await run(testCases, {
      speed: slowSpeed,
    })
  })

  test('with comments', async () => {
    const testCases: TestCase[] = [
      {
        input: '<!-- <div|></div> -->',
        type: 'v',
        expect: '<!-- <divv></divv> -->',
      },
      {
        input: '<div|><!-- </div>',
        type: 'v',
        expect: '<divv><!-- </div>',
      },
      {
        input: '<div|><!-- </div> --> </div>',
        type: 'v',
        expect: '<divv><!-- </div> --> </divv>',
      },
      {
        input: '<div><!-- </div> --> </div|>',
        type: 'v',
        expect: '<divv><!-- </div> --> </divv>',
      },
      {
        input: '<div><!-- <div> --> </div|>',
        type: 'v',
        expect: '<divv><!-- <div> --> </divv>',
      },
      {
        input: '<div><!-- </div|> -->',
        type: 'v',
        expect: '<div><!-- </divv> -->',
      },
      {
        input: '<div><!-- <div|></div> -->',
        type: 'v',
        expect: '<div><!-- <divv></divv> -->',
      },
    ]
    await run(testCases, { timeout: slowTimeout })
  })

  test('auto rename tag - bug 1', async () => {
    // TODO test for Button in the middle (should not be renamed)
    const testCases: TestCase[] = [
      {
        input: `<View
  prop1="1"
>
  <View />
</View|>`,
        type: 'w',
        undoStops: true,
        expect: `<Vieww
  prop1="1"
>
  <View />
</Vieww>`,
      },
      {
        type: 'w',
        undoStops: true,
        expect: `<Viewww
  prop1="1"
>
  <View />
</Viewww>`,
      },
      {
        type: 'w',
        undoStops: true,
        expect: `<Viewwww
  prop1="1"
>
  <View />
</Viewwww>`,
      },
      {
        type: '',
        afterTypeCommands: ['undo'],
        expect: `<Viewww
  prop1="1"
>
  <View />
</Viewww>`,
      },
      {
        type: 'w',
        expect: `<Viewwww
  prop1="1"
>
  <View />
</Viewwww>`,
      },
    ]
    await run(testCases, {
      speed: slowSpeed,
      timeout: slowTimeout,
    })
  })

  test('bug 2', async () => {
    const testCases: TestCase[] = [
      {
        input: `<svg viewBox="0 0 100 100">
  <circle cx="0" cy="20" r="20" />
  <path
    d="M91.942 91.212c-.676-.312-1.52-.896-1.876-1.3-.355-.402-3.626-5.64-7.267-11.64L67.69 53.38c-4.67-7.69-8.856-14.376-9.303-14.856-2.2-2.36-6.232-1.847-7.897 1.003-.938 1.607-.796 3.486.44 5.82.896 1.687 1.038 2.253 1.043 4.148.013 4.998-3.26 8.313-8.608 8.717-1.873.142-2.525.328-3.23.922-.487.41-4.05 4.64-7.92 9.403-3.87 4.762-7.33 8.924-7.693 9.25-.924.826-3.62 1.02-4.914.35-2.01-1.04-2.89-3.656-1.943-5.782.32-.718 6.184-11.4 13.034-23.74C37.544 36.278 43.374 25.74 43.65 25.2c.998-1.957.39-4.218-1.434-5.33-2.14-1.303-4.003-.56-6.71 2.674-1.063 1.267-2.56 2.82-3.327 3.447-3.72 3.047-4.39 3.18-15.3 3.06l-8.837-.1-1.844-.86c-2.388-1.116-4.01-2.69-5.09-4.945-1.16-2.412-1.4-4.51-.788-6.895.597-2.33 1.556-3.88 3.407-5.51 2.862-2.52.88-2.37 31.663-2.47 19.077-.064 27.955.012 29.348.25 4.27.733 8.29 3.674 10.38 7.593.83 1.556 6.15 16.138 13.595 37.267.982 2.79 3.854 10.88 6.382 17.978 2.528 7.098 4.692 13.345 4.81 13.88.48 2.206-1.046 4.933-3.347 5.978-1.58.717-3.063.716-4.622-.003z"
  />



  <!--|-->
</path>`,
        type: '\n',
        expect: `<svg viewBox="0 0 100 100">
  <circle cx="0" cy="20" r="20" />
  <path
    d="M91.942 91.212c-.676-.312-1.52-.896-1.876-1.3-.355-.402-3.626-5.64-7.267-11.64L67.69 53.38c-4.67-7.69-8.856-14.376-9.303-14.856-2.2-2.36-6.232-1.847-7.897 1.003-.938 1.607-.796 3.486.44 5.82.896 1.687 1.038 2.253 1.043 4.148.013 4.998-3.26 8.313-8.608 8.717-1.873.142-2.525.328-3.23.922-.487.41-4.05 4.64-7.92 9.403-3.87 4.762-7.33 8.924-7.693 9.25-.924.826-3.62 1.02-4.914.35-2.01-1.04-2.89-3.656-1.943-5.782.32-.718 6.184-11.4 13.034-23.74C37.544 36.278 43.374 25.74 43.65 25.2c.998-1.957.39-4.218-1.434-5.33-2.14-1.303-4.003-.56-6.71 2.674-1.063 1.267-2.56 2.82-3.327 3.447-3.72 3.047-4.39 3.18-15.3 3.06l-8.837-.1-1.844-.86c-2.388-1.116-4.01-2.69-5.09-4.945-1.16-2.412-1.4-4.51-.788-6.895.597-2.33 1.556-3.88 3.407-5.51 2.862-2.52.88-2.37 31.663-2.47 19.077-.064 27.955.012 29.348.25 4.27.733 8.29 3.674 10.38 7.593.83 1.556 6.15 16.138 13.595 37.267.982 2.79 3.854 10.88 6.382 17.978 2.528 7.098 4.692 13.345 4.81 13.88.48 2.206-1.046 4.933-3.347 5.978-1.58.717-3.063.716-4.622-.003z"
  />



  <!--
  -->
</path>`,
      },
    ]

    await run(testCases)
  })

  test('bug 3', async () => {
    const testCases: TestCase[] = [
      {
        input: `<div>
  <div></div>
</div|>`,
        type: 'v',
        expect: `<divv>
  <div></div>
</divv>`,
      },
    ]
    await run(testCases)
  })

  test('bug 4', async () => {
    const testCases: TestCase[] = [
      {
        input: `<div>
  <div><|
</div>`,
        type: '/',
        expect: `<div>
  <div></
</div>`,
      },
    ]
    await run(testCases)
  })

  test('type space after bu', async () => {
    const testCases: TestCase[] = [
      {
        input: `<template>
  <bu|tton></button>
</template>`,
        type: ' ',
        expect: `<template>
  <bu tton></bu>
</template>`,
      },
    ]
    await run(testCases, {
      speed: slowSpeed,
    })
  })

  test('language plaintext', async () => {
    await createTestFile('auto-rename-tag.language.txt')
    const testCases: TestCase[] = [
      {
        input: `<button|>this is a button</button>`,
        type: '2',
        expect: `<button2>this is a button</button2>`,
      },
    ]
    await run(testCases, {
      timeout: slowTimeout,
    })
  })

  test.skip('language typescript', async () => {
    await createTestFile('auto-rename-tag.language.vue')
    const testCases: TestCase[] = [
      {
        input: `<template>
  <button|>this is a button</button>
</template>`,
        type: '2',
        expect: `<template>
  <button2>this is a button</button2>
</template>`,
      },
    ]
    await run(testCases)
  })

  test.skip('language typescriptreact', async () => {
    await createTestFile('auto-rename-tag.language.vue')
    const testCases: TestCase[] = [
      {
        input: `<template>
  <button|>this is a button</button>
</template>`,
        type: '2',
        expect: `<template>
  <button2>this is a button</button2>
</template>`,
      },
    ]
    await run(testCases)
  })

  test.skip('language xml', async () => {
    await createTestFile('auto-rename-tag.language.xml')
    const testCases: TestCase[] = [
      {
        input: `<?xml version = "1.0" encoding = "UTF-8" ?>
<class_list>
   <student|>
      <name>Tanmay</name>
      <grade>A</grade>
   </student>
</class_list>`,
        type: '2',
        expect: `<?xml version = "1.0" encoding = "UTF-8" ?>
<class_list>
   <student2>
      <name>Tanmay</name>
      <grade>A</grade>
   </student2>
</class_list>`,
      },
    ]
    await run(testCases)
  })

  test('multiple cursors', async () => {
    const testCases: TestCase[] = [
      {
        input: `<h1|></h1>
<h2|></h2>
<h3|></h3>
<h4|></h4>
<h5|></h5>
<h6|></h6>`,
        type: 'i',
        expect: `<h1i></h1i>
<h2i></h2i>
<h3i></h3i>
<h4i></h4i>
<h5i></h5i>
<h6i></h6i>`,
      },
      {
        input: `<h1></h1|>
<h2></h2|>
<h3></h3|>
<h4></h4|>
<h5></h5|>
<h6></h6|>`,
        type: 'i',
        expect: `<h1i></h1i>
<h2i></h2i>
<h3i></h3i>
<h4i></h4i>
<h5i></h5i>
<h6i></h6i>`,
      },
      {
        input: `<h1|></h1>
<h2|></h2>
<h3|></h3>
<h4|></h4>
<h5|></h5>
<h6|></h6>`,
        type: '{backspace}',
        expect: `<h></h>
<h></h>
<h></h>
<h></h>
<h></h>
<h></h>`,
      },
      {
        input: `<a|a|a|></aaa>`,
        type: 'b',
        expect: `<ababab></ababab>`,
      },
      {
        input: `<aaa></a|a|a|>`,
        type: 'b',
        expect: `<ababab></ababab>`,
      },
    ]
    await run(testCases, {
      timeout: slowTimeout,
      speed: slowSpeed,
    })
  })

  test('self closing tags', async () => {
    const testCases: TestCase[] = [
      {
        input: `<head|><link></head>`,
        type: 'd',
        expect: '<headd><link></headd>',
      },
      {
        input: `<head><link></head|>`,
        type: 'd',
        expect: '<headd><link></headd>',
      },
    ]
    await run(testCases, {
      speed: slowSpeed,
      timeout: slowTimeout,
    })
  })

  test('language angular', async () => {
    await createTestFile('auto-rename-tag.component.html')

    const testCases: TestCase[] = [
      {
        input: `<h2>Products</h2>

<div| *ngFor="let product of products">

  <h3>
    <a [title]="product.name + ' details'">
      {{ product.name }}
    </a>
  </h3>

</div>`,
        type: 'v',
        expect: `<h2>Products</h2>

<divv *ngFor="let product of products">

  <h3>
    <a [title]="product.name + ' details'">
      {{ product.name }}
    </a>
  </h3>

</divv>`,
      },
    ]
    await run(testCases, {
      timeout: slowTimeout,
    })
  })

  test('language javascriptreact', async () => {
    await createTestFile('auto-rename-tag.jsx')

    const testCases: TestCase[] = [
      {
        input: `const button = <button|>{/* </button> */}</button>;`,
        type: 'n',
        expect: `const button = <buttonn>{/* </button> */}</buttonn>;`,
      },
      {
        input: `const button = <button>{/* </button|> */}</button>;`,
        type: 'n',
        expect: `const button = <button>{/* </buttonn> */}</button>;`,
      },
      {
        input: `const button = <button>{/* </button> */}</button|>;`,
        type: 'n',
        expect: `const button = <buttonn>{/* </button> */}</buttonn>;`,
      },
      {
        input: 'const button = <button|>{/* <button> */}</button>',
        type: 'n',
        expect: 'const button = <buttonn>{/* <button> */}</buttonn>',
      },
      {
        input: 'const button = <button>{/* <button|> */}</button>',
        type: 'n',
        expect: 'const button = <button>{/* <buttonn> */}</button>',
      },
      {
        input: 'const button = <button>{/* <button> */}</button|>',
        type: 'n',
        expect: 'const button = <buttonn>{/* <button> */}</buttonn>',
      },
      {
        input: 'const buttons = <|><button/><button/></>',
        type: 'React.Fragment',
        expect:
          'const buttons = <React.Fragment><button/><button/></React.Fragment>',
        speed: slowSpeed,
      },
    ]
    await run(testCases, {
      timeout: slowTimeout,
    })
  })

  test('language markdown', async () => {
    await createTestFile('auto-rename-tag.md')
    const testCases: TestCase[] = [
      {
        input: `\`\`\`html
<button|>
</button>
\`\`\``,
        type: 'n',
        expect: `\`\`\`html
<buttonn>
</buttonn>
\`\`\``,
      },
      {
        input: `\`\`\`html
<button|>
\`\`\`

\`\`\`html
</button>
\`\`\``,
        type: 'n',
        expect: `\`\`\`html
<buttonn>
\`\`\`

\`\`\`html
</button>
\`\`\``,
      },
      {
        input: `\`\`\`html
<button>
\`\`\`

\`\`\`html
</button|>
\`\`\``,
        type: 'n',
        expect: `\`\`\`html
<button>
\`\`\`

\`\`\`html
</buttonn>
\`\`\``,
      },
    ]
    await run(testCases, {
      timeout: slowTimeout,
    })
  })

  test('language php', async () => {
    await createTestFile('auto-rename-tag.php')
    const testCases: TestCase[] = [
      {
        input: `<div| class = 'bg-warning'>
  <!-- </div> -->
  <?php displayErrors($errors); ?>
</div>`,
        type: 'v',
        expect: `<divv class = 'bg-warning'>
  <!-- </div> -->
  <?php displayErrors($errors); ?>
</divv>`,
      },
    ]
    await run(testCases, {
      timeout: slowTimeout,
    })
  })

  test('language razor', async () => {
    await createTestFile('auto-rename-tag.cshtml')
    const testCases: TestCase[] = [
      {
        input: `<p|>Last week this time: @(DateTime.Now - TimeSpan.FromDays(7))</p>`,
        type: 'p',
        expect: `<pp>Last week this time: @(DateTime.Now - TimeSpan.FromDays(7))</pp>`,
      },
    ]
    await run(testCases, {
      timeout: slowTimeout,
    })
  })

  test('language svelte', async () => {
    await createTestFile('auto-rename-tag.svelte')
    const testCases: TestCase[] = [
      {
        input: `<script>
	let count = 1;

	function handleClick() {
		count += 1;
	}
</script>

<button| on:click={handleClick}>
	Count: {count}
</button>`,
        type: '2',
        expect: `<script>
	let count = 1;

	function handleClick() {
		count += 1;
	}
</script>

<button2 on:click={handleClick}>
	Count: {count}
</button2>`,
      },
    ]
    await run(testCases, {
      timeout: slowTimeout,
    })
  })

  test('language svg', async () => {
    await createTestFile('auto-rename-tag.svg')
    const testCases: TestCase[] = [
      {
        input: `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg| xmlns="http://www.w3.org/2000/svg" width="500" height="500">
<circle cx="250" cy="250" r="210" fill="#fff" stroke="#000" stroke-width="8"/>
</svg>
`,
        type: '2',
        expect: `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg2 xmlns="http://www.w3.org/2000/svg" width="500" height="500">
<circle cx="250" cy="250" r="210" fill="#fff" stroke="#000" stroke-width="8"/>
</svg2>
`,
      },
    ]
    await run(testCases, {
      timeout: slowTimeout,
    })
  })

  test('language typescriptreact', async () => {
    await createTestFile('auto-rename-tag.tsx')
    const testCases: TestCase[] = [
      {
        input: `interface Props {
	readonly dispatch: Dispatch<() => void>;
}

const Link = <a target="_blank" href="blabla.com">
    Bla Bla
</a>`,
        selection: [47, 57],
        type: 'any',
        expect: `interface Props {
	readonly dispatch: Dispatch<any>;
}

const Link = <a target="_blank" href="blabla.com">
    Bla Bla
</a>`,
      },
      {
        input: `interface Props {
	readonly dispatch: Dispatch<() => void>;
}

const Link = <a| target="_blank" href="blabla.com">
    Bla Bla
</a>`,
        type: 'a',
        expect: `interface Props {
	readonly dispatch: Dispatch<() => void>;
}

const Link = <aa target="_blank" href="blabla.com">
    Bla Bla
</aa>`,
      },
      {
        input: `interface Props {
	readonly dispatch: Dispatch<() => void>;
}

const Link = <a target="_blank" href="blabla.com">
    Bla Bla
</a|>`,
        type: 'a',
        expect: `interface Props {
	readonly dispatch: Dispatch<() => void>;
}

const Link = <aa target="_blank" href="blabla.com">
    Bla Bla
</aa>`,
      },
    ]
    await run(testCases, {
      timeout: slowTimeout,
    })
  })

  test('language vue', async () => {
    await createTestFile('auto-rename-tag.vue')
    const testCases: TestCase[] = [
      {
        input: `<template>
  <div| id="app">
    {{ message }}
  </div>
</template>

<script>
var app = new Vue({
  el: '#app',
  data: {
    message: 'Hello Vue!'
  }
})
</script>`,
        type: 'v',
        expect: `<template>
  <divv id="app">
    {{ message }}
  </divv>
</template>

<script>
var app = new Vue({
  el: '#app',
  data: {
    message: 'Hello Vue!'
  }
})
</script>`,
      },
    ]
    await run(testCases, {
      timeout: slowTimeout,
    })
  })

  test('language xml', async () => {
    await createTestFile('auto-rename-tag.xml')
    const testCases: TestCase[] = [
      {
        input: `<?xml| version = "1.0" encoding = "UTF-8" ?>
<class_list>
   <student>
      <name>Tanmay</name>
      <grade>A</grade>
   </student>
</class_list>`,
        type: 'l',
        expect: `<?xmll version = "1.0" encoding = "UTF-8" ?>
<class_list>
   <student>
      <name>Tanmay</name>
      <grade>A</grade>
   </student>
</class_list>`,
      },
      {
        input: `<?xml version = "1.0" encoding = "UTF-8" ?>
<class_list>
   <student|>
      <name>Tanmay</name>
      <grade>A</grade>
   </student>
</class_list>`,
        type: 't',
        expect: `<?xml version = "1.0" encoding = "UTF-8" ?>
<class_list>
   <studentt>
      <name>Tanmay</name>
      <grade>A</grade>
   </studentt>
</class_list>`,
      },
    ]
    await run(testCases, {
      timeout: slowTimeout,
    })
  })
})
