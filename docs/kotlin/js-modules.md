[//]: # (title: JavaScript 模块)

您可以将 Kotlin 项目编译为适用于各种流行模块系统的 JavaScript 模块。我们目前支持以下 JavaScript 模块配置：

- [统一模块定义 (UMD)](https://github.com/umdjs/umd)，它与 *AMD* 和 *CommonJS* 均兼容。UMD 模块还可以在不被导入或没有模块系统存在的情况下执行。这是 `browser` 和 `nodejs` 目标的默认选项。
- [异步模块定义 (AMD)](https://github.com/amdjs/amdjs-api/wiki/AMD)，特别被 [RequireJS](https://requirejs.org/) 库使用。
- [CommonJS](http://wiki.commonjs.org/wiki/Modules/1.1)，广泛应用于 Node.js/npm（`require` 函数和 `module.exports` 对象）。
- 普通模式 (Plain)。不为任何模块系统编译。您可以通过其名称在全局作用域中访问模块。

## 浏览器目标

如果您打算在 Web 浏览器环境中运行代码，并希望使用 UMD 以外的模块系统，可以在 `webpackTask` 配置块中指定所需的模块类型。例如，要切换到 CommonJS，请使用：

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

Webpack 提供了两种不同风格的 CommonJS，`commonjs` 和 `commonjs2`，它们会影响您声明的可用方式。在大多数情况下，您可能需要 `commonjs2`，它会为生成的库添加 `module.exports` 语法。或者，您也可以选择 `commonjs` 选项，它严格遵循 CommonJS 规范。要了解更多关于 `commonjs` 和 `commonjs2` 之间区别的信息，请参阅 [Webpack 仓库](https://github.com/webpack/webpack/issues/1114)。

## JavaScript 库和 Node.js 文件

如果您正在创建用于 JavaScript 或 Node.js 环境的库，并希望使用不同的模块系统，则说明略有不同。

### 选择目标模块系统

要选择目标模块系统，请在 Gradle 构建脚本中设置 `moduleKind` 编译器选项：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
tasks.withType<org.jetbrains.kotlin.gradle.targets.js.ir.KotlinJsIrLink> {
    compilerOptions.moduleKind.set(org.jetbrains.kotlin.gradle.dsl.JsModuleKind.MODULE_COMMONJS)
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
compileKotlinJs.compilerOptions.moduleKind = org.jetbrains.kotlin.gradle.dsl.JsModuleKind.MODULE_COMMONJS
```

</tab>
</tabs>

可用值有：`umd`（默认）、`commonjs`、`amd`、`plain`。

> 这与调整 `webpackTask.output.libraryTarget` 不同。库目标改变的是 _由 webpack 生成_ 的输出（在您的代码已经编译之后）。`compilerOptions.moduleKind` 改变的是 _由 Kotlin 编译器生成_ 的输出。
>
{style="note"}  

在 Kotlin Gradle DSL 中，还有一个用于设置 CommonJS 模块类型（module kind）的快捷方式：

```kotlin
kotlin {
    js {
        useCommonJs()
        // ...
    }
}
```

## @JsModule 注解

要告诉 Kotlin 某个 `external` 类、包、函数或属性是 JavaScript 模块，您可以使用 `@JsModule` 注解。假设您有以下名为 "hello" 的 CommonJS 模块：

```javascript
module.exports.sayHello = function (name) { alert("Hello, " + name); }
```

您应该在 Kotlin 中这样声明它：

```kotlin
@JsModule("hello")
external fun sayHello(name: String)
```

### 将 @JsModule 应用于包

一些 JavaScript 库导出包（命名空间）而不是函数和类。就 JavaScript 而言，它是一个拥有成员的*对象*，这些成员是类、函数和属性。将这些包作为 Kotlin 对象导入通常看起来不自然。编译器可以将导入的 JavaScript 包映射到 Kotlin 包，使用以下表示法：

```kotlin
@file:JsModule("extModule")

package ext.jspackage.name

external fun foo()

external class C
```

相应地，JavaScript 模块声明如下：

```javascript
module.exports = {
  foo: { /* some code here */ },
  C: { /* some code here */ }
}
```

标记有 `@file:JsModule` 注解的文件不能声明非 `external` 成员。以下示例会产生编译时错误：

```kotlin
@file:JsModule("extModule")

package ext.jspackage.name

external fun foo()

fun bar() = "!" + foo() + "!" // 错误发生在此处
```

### 导入更深层的包层级

在前面的示例中，JavaScript 模块导出一个单一的包。然而，一些 JavaScript 库从一个模块中导出多个包。Kotlin 也支持这种情况，尽管您必须为您导入的每个包声明一个新的 `.kt` 文件。

例如，让我们把示例变得更复杂一些：

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

要在 Kotlin 中导入此模块，您必须编写两个 Kotlin 源文件：

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

### @JsNonModule 注解

当一个声明被标记为 `@JsModule` 时，如果您不将其编译为 JavaScript 模块，则不能在 Kotlin 代码中使用它。通常，开发人员会分发他们的库，既作为 JavaScript 模块，也作为可下载的 `.js` 文件，您可以将其复制到项目的静态资源并通过 `<script>` 标签引入。要告诉 Kotlin 可以使用来自非模块环境的 `@JsModule` 声明，请添加 `@JsNonModule` 注解。例如，考虑以下 JavaScript 代码：

```javascript
function topLevelSayHello (name) { alert("Hello, " + name); }

if (module && module.exports) {
  module.exports = topLevelSayHello;
}
```

您可以在 Kotlin 中如下描述它：

```kotlin
@JsModule("hello")
@JsNonModule
@JsName("topLevelSayHello")
external fun sayHello(name: String)
```

### Kotlin 标准库使用的模块系统

Kotlin 随 Kotlin/JS 标准库以单个文件形式分发，该文件本身被编译为一个 UMD 模块，因此您可以将它与上述任何模块系统一起使用。对于 Kotlin/JS 的大多数用例，建议使用对 `kotlin-stdlib-js` 的 Gradle 依赖，该库在 NPM 上也以 [`kotlin`](https://www.npmjs.com/package/kotlin) 包的形式提供。