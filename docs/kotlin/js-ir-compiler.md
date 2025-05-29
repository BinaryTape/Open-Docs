[//]: # (title: Kotlin/JS IR 编译器)

Kotlin/JS IR 编译器后端是 Kotlin/JS 创新的主要焦点，并为这项技术指明了前进的方向。

Kotlin/JS IR 编译器后端没有直接从 Kotlin 源代码生成 JavaScript 代码，而是采用了一种新方法。Kotlin 源代码首先被转换为 [Kotlin 中间表示 (IR)](whatsnew14.md#unified-backends-and-extensibility)，然后才被编译为 JavaScript。对于 Kotlin/JS 而言，这实现了激进的优化，并改进了旧编译器中存在的痛点，例如生成的代码大小（通过死代码消除）以及 JavaScript 和 TypeScript 生态系统互操作性等。

IR 编译器后端从 Kotlin 1.4.0 开始通过 Kotlin 多平台 Gradle 插件提供。要在你的项目中启用它，请在你的 Gradle 构建脚本中将编译器类型传递给 `js` 函数：

```groovy
kotlin {
    js(IR) { // or: LEGACY, BOTH
        // ...
        binaries.executable() // not applicable to BOTH, see details below
    }
}
```

*   `IR` 使用适用于 Kotlin/JS 的新 IR 编译器后端。
*   `LEGACY` 使用旧编译器后端。
*   `BOTH` 使用新的 IR 编译器以及默认编译器后端编译你的项目。有关[作者编写兼容两种后端的库](#authoring-libraries-for-the-ir-compiler-with-backwards-compatibility)的详细信息，请使用此模式。

> 旧编译器后端自 Kotlin 1.8.0 起已被弃用。从 Kotlin 1.9.0 开始，使用 `LEGACY` 或 `BOTH` 编译器类型将导致错误。
>
{style="warning"}

编译器类型也可以在 `gradle.properties` 文件中设置，键为 `kotlin.js.compiler=ir`。但是，此行为会被 `build.gradle(.kts)` 中的任何设置覆盖。

## 顶层属性的惰性初始化

为了获得更好的应用程序启动性能，Kotlin/JS IR 编译器会惰性初始化顶层属性。通过这种方式，应用程序在加载时不会初始化代码中使用的所有顶层属性。它只会在启动时初始化所需的属性；其他属性会在使用它们的代码实际运行时才获得其值。

```kotlin
val a = run {
    val result = // intensive computations
    println(result)
    result
} // value is computed upon the first usage
```

如果由于某种原因你需要立即（在应用程序启动时）初始化某个属性，请使用 [`@EagerInitialization`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.js/-eager-initialization/){nullable="true"} 注解标记它。

## 用于开发二进制文件的增量编译

JS IR 编译器提供了_用于开发二进制文件的增量编译模式_，可加快开发过程。在此模式下，编译器会在模块级别缓存 `compileDevelopmentExecutableKotlinJs` Gradle 任务的结果。它在后续编译期间使用未更改的源文件的缓存编译结果，从而使编译更快完成，特别是对于小幅更改。

增量编译默认启用。要禁用用于开发二进制文件的增量编译，请将以下行添加到项目的 `gradle.properties` 或 `local.properties` 中：

```none
kotlin.incremental.js.ir=false // true by default
```

> 增量编译模式下的干净构建通常会更慢，因为需要创建和填充缓存。
>
{style="note"}

## 输出模式

你可以选择 JS IR 编译器如何在项目中输出 `.js` 文件：

*   **每个模块一个**。默认情况下，JS 编译器会将项目的每个模块作为编译结果输出为单独的 `.js` 文件。
*   **每个项目一个**。你可以通过将以下行添加到 `gradle.properties` 将整个项目编译成一个 `.js` 文件：

    ```none
    kotlin.js.ir.output.granularity=whole-program // 'per-module' is the default
    ```

*   **每个文件一个**。你可以设置更细粒度的输出，为每个 Kotlin 文件生成一个（或两个，如果文件包含导出声明）JavaScript 文件。要启用每个文件编译模式：

    1.  将 `useEsModules()` 函数添加到你的构建文件中以支持 ECMAScript 模块：

        ```kotlin
        // build.gradle.kts
        kotlin {
            js(IR) {
                useEsModules() // Enables ES2015 modules
                browser()
            }
        }
        ```

        或者，你可以使用 `es2015` [编译目标](js-project-setup.md#support-for-es2015-features)来支持项目中的 ES2015 特性。

    2.  应用 `-Xir-per-file` 编译器选项或更新你的 `gradle.properties` 文件：

        ```none
        # gradle.properties
        kotlin.js.ir.output.granularity=per-file // 'per-module' is the default
        ```

## 生产环境中成员名称的混淆

Kotlin/JS IR 编译器利用其关于 Kotlin 类和函数关系的内部信息来应用更高效的混淆，从而缩短函数、属性和类的名称。这减小了最终打包应用程序的大小。

当你以[生产](js-project-setup.md#building-executables)模式构建 Kotlin/JS 应用程序时，此类型的混淆会自动应用，并且默认启用。要禁用成员名称混淆，请使用 `-Xir-minimized-member-names` 编译器选项：

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

## 预览：TypeScript 声明文件 (d.ts) 的生成

> TypeScript 声明文件 (`d.ts`) 的生成是[实验性功能](components-stability.md)。它可能随时被删除或更改。
> 需要选择启用（参见下面的详细信息），并且你只应将其用于评估目的。我们很乐意在 [YouTrack](https://youtrack.jetbrains.com/issues?q=%23%7BKJS:%20d.ts%20generation%7D) 上收到你关于它的反馈。
>
{style="warning"}

Kotlin/JS IR 编译器能够从你的 Kotlin 代码生成 TypeScript 定义。这些定义可供 JavaScript 工具和 IDE 在开发混合应用时使用，以提供自动补全、支持静态分析器，并使将 Kotlin 代码包含在 JavaScript 和 TypeScript 项目中变得更容易。

如果你的项目生成可执行文件 (`binaries.executable()`)，Kotlin/JS IR 编译器会收集任何使用 [`@JsExport`](js-to-kotlin-interop.md#jsexport-annotation) 标记的顶层声明，并自动在 `.d.ts` 文件中生成 TypeScript 定义。

如果你想生成 TypeScript 定义，你必须在 Gradle 构建文件中显式配置。将 `generateTypeScriptDefinitions()` 添加到你的 `build.gradle.kts` 文件中的 [`js` 部分](js-project-setup.md#execution-environments)。例如：

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

这些定义可以在 `build/js/packages/<package_name>/kotlin` 中找到，与相应的未打包 (un-webpacked) JavaScript 代码位于同一位置。

## IR 编译器当前限制

新 IR 编译器后端的一个主要变化是**不与默认后端进行二进制兼容**。使用新 IR 编译器创建的库使用 [`klib` 格式](native-libraries.md#library-format)，并且无法从默认后端使用。同时，使用旧编译器创建的库是一个包含 `js` 文件的 `jar` 包，无法从 IR 后端使用。

如果你的项目想使用 IR 编译器后端，你需要**将所有 Kotlin 依赖项更新到支持此新后端的版本**。JetBrains 为 Kotlin 1.4+ 发布的目标为 Kotlin/JS 的库已经包含使用新 IR 编译器后端所需的所有构件。

**如果你是库作者**，希望同时提供与当前编译器后端和新 IR 编译器后端的兼容性，请另外查阅[有关为 IR 编译器编写库并提供向后兼容性的章节](#authoring-libraries-for-the-ir-compiler-with-backwards-compatibility)。

与默认后端相比，IR 编译器后端也存在一些差异。尝试新后端时，最好注意这些可能的陷阱。

*   一些**依赖于默认后端特定特性**的库，例如 `kotlin-wrappers`，可能会出现一些问题。你可以在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-40525) 上关注调查和进展。
*   IR 后端**默认完全不向 JavaScript 提供 Kotlin 声明**。要使 Kotlin 声明对 JavaScript 可见，它们**必须**使用 [`@JsExport`](js-to-kotlin-interop.md#jsexport-annotation) 注解进行标注。

## 将现有项目迁移到 IR 编译器

由于两种 Kotlin/JS 编译器之间存在显著差异，使你的 Kotlin/JS 代码与 IR 编译器一起工作可能需要一些调整。请在 [Kotlin/JS IR 编译器迁移指南](js-ir-migration.md)中了解如何将现有 Kotlin/JS 项目迁移到 IR 编译器。

## 为 IR 编译器编写具有向后兼容性的库

如果你是库维护者，希望同时提供与默认后端和新 IR 编译器后端的兼容性，则可以使用编译器选择设置，它允许你为两个后端创建构件，从而为你现有用户保持兼容性，同时为下一代 Kotlin 编译器提供支持。这种所谓的 `both` 模式可以通过在 `gradle.properties` 文件中使用 `kotlin.js.compiler=both` 设置来开启，或者可以作为 `build.gradle(.kts)` 文件中 `js` 块内的项目特定选项之一进行设置：

```groovy
kotlin {
    js(BOTH) {
        // ...
    }
}
```

在 `both` 模式下，从源代码构建库时会同时使用 IR 编译器后端和默认编译器后端（因此得名）。这意味着既会生成包含 Kotlin IR 的 `klib` 文件，也会生成用于默认编译器的 `jar` 文件。当以相同的 Maven 坐标发布时，Gradle 将根据用例自动选择正确的构件——旧编译器使用 `js`，新编译器使用 `klib`。这使你能够为使用两种编译器后端中任何一种的项目编译和发布你的库。