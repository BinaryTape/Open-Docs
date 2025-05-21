---
title: "Kotlin/JS IR 编译器"
---
Kotlin/JS IR 编译器后端是 Kotlin/JS 领域创新的主要焦点，并为该技术的发展铺平了道路。

Kotlin/JS IR 编译器后端没有直接从 Kotlin 源代码生成 JavaScript 代码，而是采用了一种新的方法。Kotlin 源代码首先被转换为 [Kotlin 中间表示 (IR)](whatsnew14#unified-backends-and-extensibility)，然后将其编译成 JavaScript。对于 Kotlin/JS 来说，这可以实现积极的优化，并改进以前编译器中存在的痛点，例如生成的代码大小（通过消除死代码）、JavaScript 和 TypeScript 生态系统的互操作性等等。

IR 编译器后端从 Kotlin 1.4.0 开始通过 Kotlin Multiplatform Gradle 插件提供。要在您的项目中启用它，请在 Gradle 构建脚本中的 `js` 函数中传递一个编译器类型：

```groovy
kotlin {
    js(IR) { // 或: LEGACY, BOTH
        // ...
        binaries.executable() // 不适用于 BOTH，请参见下面的详细信息
    }
}
```

* `IR` 使用新的 IR 编译器后端来编译 Kotlin/JS。
* `LEGACY` 使用旧的编译器后端。
* `BOTH` 使用新的 IR 编译器以及默认的编译器后端来编译您的项目。使用此模式可以[编写与两个后端兼容的库](#authoring-libraries-for-the-ir-compiler-with-backwards-compatibility)。

:::note
自 Kotlin 1.8.0 起，旧的编译器后端已被弃用。从 Kotlin 1.9.0 开始，使用编译器类型 `LEGACY` 或 `BOTH` 会导致错误。

编译器类型也可以在 `gradle.properties` 文件中设置，键为 `kotlin.js.compiler=ir`。但是，此行为会被 `build.gradle(.kts)` 中的任何设置覆盖。

## 顶层属性的延迟初始化

为了获得更好的应用程序启动性能，Kotlin/JS IR 编译器会延迟初始化顶层属性。这样，应用程序在加载时无需初始化其代码中使用的所有顶层属性。它仅初始化启动时需要的属性；其他属性将在稍后运行使用它们的代码时接收其值。

```kotlin
val a = run {
    val result = // intensive computations
    println(result)
    result
} // value is computed upon the first usage
```

如果由于某种原因您需要及早（在应用程序启动时）初始化属性，请使用 [`@EagerInitialization`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.js/-eager-initialization/) 注解对其进行标记。

## 开发二进制文件的增量编译

JS IR 编译器为_开发二进制文件_提供_增量编译模式_，从而加快了开发过程。在此模式下，编译器在模块级别缓存 `compileDevelopmentExecutableKotlinJs` Gradle 任务的结果。它在后续编译期间将缓存的编译结果用于未更改的源文件，从而使它们完成得更快，尤其是在进行小的更改时。

默认情况下启用增量编译。要为开发二进制文件禁用增量编译，请将以下行添加到项目的 `gradle.properties` 或 `local.properties` 中：

```none
kotlin.incremental.js.ir=false // 默认为 true
```

由于需要创建和填充缓存，因此增量编译模式下的全新构建通常较慢。

:::

## 输出模式

您可以选择 JS IR 编译器在项目中输出 `.js` 文件的方式：

* **每个模块一个**。默认情况下，JS 编译器为项目的每个模块输出单独的 `.js` 文件作为编译结果。
* **每个项目一个**。您可以通过将以下行添加到 `gradle.properties` 中，将整个项目编译为单个 `.js` 文件：

  ```none
  kotlin.js.ir.output.granularity=whole-program // 'per-module' 是默认值
  ```

* **每个文件一个**。您可以设置更精细的输出，为每个 Kotlin 文件生成一个（或两个，如果该文件包含导出的声明）JavaScript 文件。要启用每个文件的编译模式：

  1. 将 `useEsModules()` 函数添加到您的构建文件中以支持 ECMAScript 模块：

     ```kotlin
     // build.gradle.kts
     kotlin {
         js(IR) {
             useEsModules() // 启用 ES2015 模块
             browser()
         }
     }
     ```
  
     或者，您可以使用 `es2015` [编译目标](js-project-setup#support-for-es2015-features) 来支持项目中的 ES2015 功能。
  
  2. 应用 `-Xir-per-file` 编译器选项或使用以下内容更新您的 `gradle.properties` 文件：
  
     ```none
     # gradle.properties
     kotlin.js.ir.output.granularity=per-file // `per-module` 是默认值
     ```

## 生产环境中成员名称的最小化

Kotlin/JS IR 编译器使用其关于 Kotlin 类和函数之间关系的内部信息来应用更有效的最小化，缩短函数、属性和类的名称。这减少了生成的捆绑应用程序的大小。

当您在[生产](js-project-setup#building-executables)模式下构建 Kotlin/JS 应用程序时，会自动应用这种类型的最小化，并且默认情况下启用。要禁用成员名称最小化，请使用 `-Xir-minimized-member-names` 编译器选项：

```kotlin
kotlin {
    js(IR) {
        compilations.all {
            compileTaskProvider.configure {
                compilerOptions.freeCompilerArgs.add("-Xir-minimized-member-names=false")
            }
        }
    }
}
```

## 预览：生成 TypeScript 声明文件 (d.ts)

:::caution
TypeScript 声明文件 (`d.ts`) 的生成是 [Experimental](components-stability) 的。它可能随时被删除或更改。需要选择加入（请参阅下面的详细信息），您应该仅将其用于评估目的。我们欢迎您在 [YouTrack](https://youtrack.jetbrains.com/issues?q=%23%7BKJS:%20d.ts%20generation%7D) 中提供有关它的反馈。

:::

Kotlin/JS IR 编译器能够从您的 Kotlin 代码生成 TypeScript 定义。当在混合应用程序上工作时，JavaScript 工具和 IDE 可以使用这些定义来提供自动完成、支持静态分析器，并使其更容易在 JavaScript 和 TypeScript 项目中包含 Kotlin 代码。

如果您的项目生成可执行文件 (`binaries.executable()`)，则 Kotlin/JS IR 编译器会收集任何标有 [`@JsExport`](js-to-kotlin-interop#jsexport-annotation) 的顶层声明，并在 `.d.ts` 文件中自动生成 TypeScript 定义。

如果要生成 TypeScript 定义，则必须在 Gradle 构建文件中显式配置它。将 `generateTypeScriptDefinitions()` 添加到 [`js` 部分](js-project-setup#execution-environments)中的 `build.gradle.kts` 文件中。例如：

```kotlin
kotlin {
    js {
        binaries.executable()
        browser {
        }
        generateTypeScriptDefinitions()
    }
}
```

这些定义可以在 `build/js/packages/<package_name>/kotlin` 中找到，与相应的未进行 webpack 处理的 JavaScript 代码一起。

## IR 编译器当前的局限性

新的 IR 编译器后端的一个主要变化是**与默认后端没有二进制兼容性**。使用新的 IR 编译器创建的库使用 [`klib` 格式](native-libraries#library-format)，不能从默认后端使用。同时，使用旧的编译器创建的库是一个带有 `js` 文件的 `jar`，不能从 IR 后端使用。

如果要为您的项目使用 IR 编译器后端，则需要**将所有 Kotlin 依赖项更新为支持此新后端的版本**。JetBrains 发布的针对 Kotlin 1.4+ 的 Kotlin/JS 库已经包含了与新的 IR 编译器后端一起使用的所有必要构件。

**如果您是库的作者**，希望提供与当前编译器后端以及新的 IR 编译器后端的兼容性，请另外查看[有关为 IR 编译器编写库](#authoring-libraries-for-the-ir-compiler-with-backwards-compatibility)的部分。

与默认后端相比，IR 编译器后端也存在一些差异。在尝试新的后端时，最好注意这些可能的陷阱。

* 一些**依赖于默认后端特定特征的库**，例如 `kotlin-wrappers`，可能会显示出一些问题。您可以在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-40525) 上关注调查和进展。
* 默认情况下，IR 后端**根本不会使 Kotlin 声明对 JavaScript 可用**。要使 Kotlin 声明对 JavaScript 可见，**必须**使用 [`@JsExport`](js-to-kotlin-interop#jsexport-annotation) 注解对其进行注解。

## 将现有项目迁移到 IR 编译器

由于两个 Kotlin/JS 编译器之间存在显着差异，因此使您的 Kotlin/JS 代码与 IR 编译器一起工作可能需要进行一些调整。了解如何在 [Kotlin/JS IR 编译器迁移指南](js-ir-migration) 中将现有的 Kotlin/JS 项目迁移到 IR 编译器。

## 编写与向后兼容的 IR 编译器库

如果您是一名库维护者，希望提供与默认后端以及新的 IR 编译器后端的兼容性，则可以使用编译器选择设置来为两个后端创建构件，从而使您可以保持与现有用户的兼容性，同时为下一代 Kotlin 编译器提供支持。可以使用 `gradle.properties` 文件中的 `kotlin.js.compiler=both` 设置打开此所谓的 `both` 模式，也可以在 `build.gradle(.kts)` 文件中的 `js` 块内将其设置为特定于项目的选项之一：

```groovy
kotlin {
    js(BOTH) {
        // ...
    }
}
```

在 `both` 模式下，从您的源代码构建库时，会同时使用 IR 编译器后端和默认编译器后端（因此得名）。这意味着将生成带有 Kotlin IR 的 `klib` 文件以及用于默认编译器的 `jar` 文件。当在同一 Maven 坐标下发布时，Gradle 会根据用例自动选择正确的构件——旧编译器使用 `js`，新编译器使用 `klib`。这使您可以为使用这两个编译器后端中任何一个的项目编译和发布您的库。