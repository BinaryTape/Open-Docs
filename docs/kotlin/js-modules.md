---
title: "JavaScript 模块"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

你可以将 Kotlin 项目编译为 JavaScript 模块，以用于各种流行的模块系统。目前，我们支持以下 JavaScript 模块的配置：

- [统一模块定义 (UMD)](https://github.com/umdjs/umd)，它与 *AMD* 和 *CommonJS* 兼容。
    UMD 模块也可以在没有导入或没有模块系统的情况下执行。这是 `browser` 和 `nodejs` 目标的默认选项。
- [异步模块定义 (AMD)](https://github.com/amdjs/amdjs-api/wiki/AMD)，特别是被 [RequireJS](https://requirejs.org/) 库使用。
- [CommonJS](http://wiki.commonjs.org/wiki/Modules/1.1)，被 Node.js/npm 广泛使用
   （`require` 函数和 `module.exports` 对象）。
- Plain（普通）。不编译为任何模块系统。你可以在全局作用域中通过模块名称访问模块。

## Browser targets（浏览器目标）

如果你打算在 Web 浏览器环境中运行你的代码，并且想使用 UMD 以外的模块系统，你可以在 `webpackTask` 配置块中指定所需的模块类型。例如，要切换到 CommonJS，请使用：

```groovy
kotlin {
    js {
        browser {
            webpackTask {
                output.libraryTarget = "commonjs2"
            }
        }
        binaries.executable()
    }
}

```

Webpack 提供了两种不同的 CommonJS 风格，`commonjs` 和 `commonjs2`，它们会影响你的声明的可用方式。在大多数情况下，你可能需要 `commonjs2`，它会将 `module.exports` 语法添加到生成的库中。或者，你也可以选择 `commonjs` 选项，它严格遵守 CommonJS 规范。要了解更多关于 `commonjs` 和 `commonjs2` 之间的区别，请参阅 [Webpack repository](https://github.com/webpack/webpack/issues/1114)。

## JavaScript libraries and Node.js files（JavaScript 库和 Node.js 文件）

如果你正在创建一个库，以便在 JavaScript 或 Node.js 环境中使用，并且想使用不同的模块系统，那么说明会略有不同。

### Choose the target module system（选择目标模块系统）

要选择目标模块系统，请在 Gradle 构建脚本中设置 `moduleKind` 编译器选项：

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
tasks.withType<org.jetbrains.kotlin.gradle.targets.js.ir.KotlinJsIrLink> {
    compilerOptions.moduleKind.set(org.jetbrains.kotlin.gradle.dsl.JsModuleKind.MODULE_COMMONJS)
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
compileKotlinJs.compilerOptions.moduleKind = org.jetbrains.kotlin.gradle.dsl.JsModuleKind.MODULE_COMMONJS
```

</TabItem>
</Tabs>

可用的值有：`umd`（默认），`commonjs`，`amd`，`plain`。

:::note
这与调整 `webpackTask.output.libraryTarget` 不同。library target（库目标）更改的是 _webpack 生成_ 的输出（在你的代码已经编译之后）。`compilerOptions.moduleKind` 更改的是 _Kotlin 编译器_ 生成的输出。

:::

在 Kotlin Gradle DSL 中，还有一个用于设置 CommonJS 模块类型的快捷方式：

```kotlin
kotlin {
    js {
        useCommonJs()
        // ...
    }
}
```

## @JsModule annotation（@JsModule 注解）

要告诉 Kotlin 一个 `external` 类、包、函数或属性是一个 JavaScript 模块，你可以使用 `@JsModule` 注解。假设你有以下名为 "hello" 的 CommonJS 模块：

```javascript
module.exports.sayHello = function (name) { alert("Hello, " + name); }
```

你应该在 Kotlin 中这样声明它：

```kotlin
@JsModule("hello")
external fun sayHello(name: String)
```

### Apply @JsModule to packages（将 @JsModule 应用于包）

一些 JavaScript 库导出的是 packages（命名空间）而不是函数和类。
在 JavaScript 术语中，它是一个 *object（对象）*，其中包含作为类、函数和属性的 *members（成员）*。
将这些 packages（包）作为 Kotlin 对象导入通常看起来不自然。
编译器可以使用以下表示法将导入的 JavaScript 包映射到 Kotlin 包：

```kotlin
@file:JsModule("extModule")

package ext.jspackage.name

external fun foo()

external class C
```

对应的 JavaScript 模块声明如下：

```javascript
module.exports = {
  foo: { /* some code here */ },
  C: { /* some code here */ }
}
```

使用 `@file:JsModule` 注解标记的文件不能声明非 external（外部）成员。
下面的示例会产生编译时错误：

```kotlin
@file:JsModule("extModule")

package ext.jspackage.name

external fun foo()

fun bar() = "!" + foo() + "!" // error here
```

### Import deeper package hierarchies（导入更深的包层级结构）

在前面的例子中，JavaScript 模块导出一个包。
然而，一些 JavaScript 库从一个模块中导出多个包。
Kotlin 也支持这种情况，尽管你必须为你导入的每个包声明一个新的 `.kt` 文件。

例如，让我们把这个例子弄得更复杂一点：

```javascript
module.exports = {
  mylib: {
    pkg1: {
      foo: function () { /* some code here */ },
      bar: function () { /* some code here */ }
    },
    pkg2: {
      baz: function () { /* some code here */ }
    }
  }
}
```

要在 Kotlin 中导入这个模块，你必须编写两个 Kotlin 源文件：

```kotlin
@file:JsModule("extModule")
@file:JsQualifier("mylib.pkg1")

package extlib.pkg1

external fun foo()

external fun bar()
```

和

```kotlin
@file:JsModule("extModule")
@file:JsQualifier("mylib.pkg2")

package extlib.pkg2

external fun baz()
```

### @JsNonModule annotation（@JsNonModule 注解）

当一个声明被标记为 `@JsModule` 时，如果你不将其编译为 JavaScript 模块，就不能从 Kotlin 代码中使用它。
通常，开发人员会将他们的库同时作为 JavaScript 模块和可下载的 `.js` 文件分发，你可以将这些文件复制到项目的静态资源中，并通过 `<script>` 标签包含它们。要告诉 Kotlin 可以从非模块环境中使用 `@JsModule` 声明，请添加 `@JsNonModule` 注解。例如，考虑以下 JavaScript 代码：

```javascript
function topLevelSayHello (name) { alert("Hello, " + name); }

if (module && module.exports) {
  module.exports = topLevelSayHello;
}
```

你可以从 Kotlin 中这样描述它：

```kotlin
@JsModule("hello")
@JsNonModule
@JsName("topLevelSayHello")
external fun sayHello(name: String)
```

### Module system used by the Kotlin Standard Library（Kotlin 标准库使用的模块系统）

Kotlin 与 Kotlin/JS 标准库一起作为一个单独的文件分发，该文件本身被编译为一个 UMD 模块，因此你可以将其与上面描述的任何模块系统一起使用。对于 Kotlin/JS 的大多数用例，建议使用对 `kotlin-stdlib-js` 的 Gradle 依赖，该依赖也可以在 NPM 上以 [`kotlin`](https://www.npmjs.com/package/kotlin) 包的形式获得。