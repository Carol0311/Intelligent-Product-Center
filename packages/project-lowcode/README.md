本项目旨在通过AI集成+低代码平台实现智能商品档案流程

# project-lowcode

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Run End-to-End Tests with [Cypress](https://www.cypress.io/)

```sh
npm run test:e2e:dev
```

This runs the end-to-end tests against the Vite development server.
It is much faster than the production build.

But it's still recommended to test the production build with `test:e2e` before deploying (e.g. in CI environments):

```sh
npm run build
npm run test:e2e
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

## 项目目录结构

```
.
├── cypress
│   ├── e2e
│   │   └── example.cy.ts
│   ├── fixtures
│   │   └── example.json
│   ├── support
│   │   ├── commands.ts
│   │   └── e2e.ts
│   └── tsconfig.json
├── public
│   └── favicon.ico
├── src
│   ├── ai
│   │   ├── components
│   │   ├── hooks
│   │   └── templates
│   ├── application
│   │   ├── ai
│   │   │   ├── aiAssistantService.ts
│   │   │   └── promptBuilder.ts
│   │   ├── editor
│   │   │   ├── commandProcess.ts
│   │   │   ├── commands.ts
│   │   │   ├── editorService.ts
│   │   │   ├── historyService.ts
│   │   │   ├── persistanceService.ts
│   │   │   └── previewService.ts
│   │   └── project
│   │       └── projectService.ts
│   ├── assets
│   │   ├── css
│   │   │   ├── global.css
│   │   │   ├── lowcode.css
│   │   │   └── ui.css
│   │   ├── dummy
│   │   │   └── location.js
│   │   └── images
│   │       └── default.svg
│   ├── components
│   │   ├── ContainerUI
│   │   │   ├── AdvanceForm.vue
│   │   │   ├── Container.vue
│   │   │   ├── EvelatorForm.vue
│   │   │   ├── Form.vue
│   │   │   └── index.ts
│   │   ├── PropUI
│   │   │   ├── FoldAndOpen.vue
│   │   │   ├── index.ts
│   │   │   ├── PBackGround.vue
│   │   │   ├── PBoder.vue
│   │   │   ├── PColor.vue
│   │   │   ├── PFont.vue
│   │   │   ├── PLayout.vue
│   │   │   ├── PNumber.vue
│   │   │   ├── POpacity.vue
│   │   │   ├── PPos.vue
│   │   │   ├── PRadio.vue
│   │   │   ├── PSelect.vue
│   │   │   ├── PSwitch.vue
│   │   │   ├── PText.vue
│   │   │   └── PUnit.vue
│   │   ├── SlotUI
│   │   │   └── FormItem.vue
│   │   ├── ToolUI
│   │   │   ├── Edit.vue
│   │   │   └── index.ts
│   │   └── UintUI
│   │       ├── Address.vue
│   │       ├── CategorySearch.vue
│   │       ├── CheckboxGroup.vue
│   │       ├── Date.vue
│   │       ├── DateRange.vue
│   │       ├── Image.vue
│   │       ├── index.ts
│   │       ├── Info.vue
│   │       ├── Number.vue
│   │       ├── Price.vue
│   │       ├── Qty.vue
│   │       ├── Radio.vue
│   │       ├── RadioGroup.vue
│   │       ├── SCheckbox.vue
│   │       ├── Search.vue
│   │       ├── SSelect.vue
│   │       ├── Switch.vue
│   │       ├── Text.vue
│   │       ├── TextArea.vue
│   │       └── Upload.vue
│   ├── composables
│   │   ├── constant
│   │   │   └── uiClass.ts
│   │   ├── useDragEvent.ts
│   │   ├── useEventBus.ts
│   │   ├── useNumberInput.ts
│   │   ├── useScrollPosition.ts
│   │   └── useUiConfig.ts
│   ├── domain
│   │   ├── ai
│   │   ├── constants
│   │   │   └── props.ts
│   │   ├── editor
│   │   │   ├── opsTransformer.ts
│   │   │   ├── treeManager.ts
│   │   │   └── validation.ts
│   │   └── schema
│   │       ├── command.ts
│   │       ├── component.ts
│   │       ├── index.ts
│   │       ├── operationLog.ts
│   │       ├── page.ts
│   │       └── project.ts
│   ├── infra
│   │   ├── ai
│   │   ├── bus
│   │   │   └── eventBus.ts
│   │   ├── http
│   │   │   ├── aiApi.ts
│   │   │   ├── client.ts
│   │   │   └── editorApi.ts
│   │   ├── persistence
│   │   │   ├── localCache.ts
│   │   │   └── projectRepository.ts
│   │   └── registry
│   │       ├── componentRegistry.ts
│   │       └── metaRegistry.ts
│   ├── plugins
│   │   └── CusDirectives.ts
│   ├── router
│   │   └── index.ts
│   ├── stores
│   │   ├── aiStore.ts
│   │   ├── dragStore.ts
│   │   ├── editorStore.ts
│   │   ├── index.ts
│   │   ├── projectStore.ts
│   │   └── uiStore.ts
│   ├── utils
│   │   └── index.ts
│   ├── views
│   │   ├── layout
│   │   │   ├── AdvanceTab.vue
│   │   │   ├── AppHeader.vue
│   │   │   ├── EventsTab.vue
│   │   │   ├── index.ts
│   │   │   ├── LeftMenu.ts
│   │   │   ├── LeftMenu.vue
│   │   │   ├── PropsTab.vue
│   │   │   ├── RightPanel.vue
│   │   │   ├── StylesTab.vue
│   │   │   └── ViewContent.vue
│   │   └── HomeView.vue
│   ├── App.vue
│   ├── component.d.ts
│   └── main.ts
├── CONTRIBUTING.md
├── cypress.config.ts
├── env.d.ts
├── eslint.config.ts
├── index.html
├── LICENSE
├── package-lock.json
├── package.json
├── postcss.config.js
├── README.md
├── tailwind.config.js
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
├── tsconfig.tsbuildinfo
├── tsconfig.vitest.json
├── vite.config.ts
└── vitest.config.ts

44 directories, 128 files
```
