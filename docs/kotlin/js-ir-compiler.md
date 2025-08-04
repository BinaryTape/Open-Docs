[//]: # (title: Kotlin/JS IR 编译器)

Kotlin/JS IR 编译器后端是 Kotlin/JS 创新的主要焦点，为该技术的发展铺平了道路。

相较于直接从 Kotlin 源代码生成 JavaScript 代码，Kotlin/JS IR 编译器后端采用了一种新方法。Kotlin 源代码首先被转换为 [Kotlin 中间表示 (IR)](whatsnew14.md#unified-backends-and-extensibility)，随后编译为 JavaScript。对于 Kotlin/JS 而言，这实现了积极的优化，并改进了之前编译器中存在的痛点，例如生成的代码大小（通过[无用代码消除](#dead-code-elimination)）以及 JavaScript 和 TypeScript 生态系统的互操作性，仅举几个例子。

IR 编译器后端从 Kotlin 1.4.0 开始通过 Kotlin Multiplatform Gradle 插件提供。要在您的项目中启用它，请在 Gradle 构建脚本中将编译器类型传递给 `js` 函数：

```groovy
kotlin {
    js(IR) { // 或：LEGACY, BOTH
        // ...
        binaries.executable() // 不适用于 BOTH，详见下方
    }
}
```

* `IR` 使用 Kotlin/JS 的新 IR 编译器后端。
* `LEGACY` 使用旧的编译器后端。
* `BOTH` 使用新的 IR 编译器和默认编译器后端编译您的项目。使用此模式[编写兼容两种后端（的库）](#authoring-libraries-for-the-ir-compiler-with-backwards-compatibility)。

> 旧的编译器后端自 Kotlin 1.8.0 起已弃用。从 Kotlin 1.9.0 开始，使用编译器类型 `LEGACY` 或 `BOTH` 将导致错误。
>
{style="warning"}

编译器类型也可以在 `gradle.properties` 文件中设置，键为 `kotlin.js.compiler=ir`。然而，此行为将被 `build.gradle(.kts)` 中的任何设置覆盖。

## 顶层属性的惰性初始化

为了更好的应用程序启动性能，Kotlin/JS IR 编译器会惰性初始化顶层属性。通过这种方式，应用程序加载时无需初始化其代码中使用的所有顶层属性。它只初始化启动时需要的属性；其他属性在使用它们的代码实际运行时才获得其值。

```kotlin
val a = run {
    val result = // 密集计算
    println(result)
    result
} // 值在首次使用时计算
```

如果由于某种原因，您需要急切地初始化属性（在应用程序启动时），请使用 [`@EagerInitialization`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.js/-eager-initialization/){nullable="true"} 注解标记它。

## 用于开发二进制文件的增量编译

JS IR 编译器提供了_用于开发二进制文件的增量编译模式_，可加快开发过程。在此模式下，编译器在模块级别缓存 `compileDevelopmentExecutableKotlinJs` Gradle 任务的结果。它在后续编译期间对未更改的源文件使用缓存的编译结果，使其更快完成，特别是对于小型更改。

增量编译默认启用。要禁用开发二进制文件的增量编译，请将以下行添加到项目的 `gradle.properties` 或 `local.properties` 中：

```none
kotlin.incremental.js.ir=false // 默认为 true
```

> 增量编译模式下的清理构建通常会更慢，因为需要创建和填充缓存。
>
{style="note"}

## 输出模式

您可以选择 JS IR 编译器在项目中输出 `.js` 文件的方式：

*   **每个模块一个**。默认情况下，JS 编译器会为项目的每个模块输出单独的 `.js` 文件作为编译结果。
*   **每个项目一个**。您可以通过向 `gradle.properties` 添加以下行，将整个项目编译成单个 `.js` 文件：

    ```none
    kotlin.js.ir.output.granularity=whole-program // 'per-module' 为默认值
    ```

*   **每个文件一个**。您可以设置更精细的输出，为每个 Kotlin 文件生成一个（如果文件包含导出的声明，则为两个）JavaScript 文件。要启用按文件编译模式：

    1.  将 `useEsModules()` 函数添加到您的构建文件中，以支持 ECMAScript 模块：

        ```kotlin
        // build.gradle.kts
        kotlin {
            js(IR) {
                useEsModules() // 启用 ES2015 模块
                browser()
            }
        }
        ```

        或者，您可以使用 `es2015` [编译目标](js-project-setup.md#support-for-es2015-features) 以在您的项目中支持 ES2015 特性。

    2.  应用 `-Xir-per-file` 编译器选项或使用以下内容更新您的 `gradle.properties` 文件：

        ```none
        # gradle.properties
        kotlin.js.ir.output.granularity=per-file // 'per-module' 为默认值
        ```

## 生产环境中成员名称的混淆

Kotlin/JS IR 编译器利用其关于 Kotlin 类和函数之间关系的内部信息，应用更高效的混淆，缩短函数、属性和类的名称。这减少了生成的捆绑应用程序的大小。

当您在[生产](js-project-setup.md#building-executables)模式下构建 Kotlin/JS 应用程序时，此类混淆会自动应用，并默认启用。要禁用成员名称混淆，请使用 `-Xir-minimized-member-names` 编译器选项：

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

## 无用代码消除

[无用代码消除](https://wikipedia.org/wiki/Dead_code_elimination) (DCE) 通过移除未使用的属性、函数和类，减少生成的 JavaScript 代码的大小。

未使用的声明可能出现在以下情况：

*   函数被内联且从不直接调用（除了少数情况外，这种情况总是发生）。
*   模块使用共享库。如果没有 DCE，即使您不使用库的某些部分，它们仍会包含在生成的捆绑包中。例如，Kotlin 标准库包含用于操作 list、数组、字符序列、DOM 适配器等的函数。所有这些功能性大约需要 1.3 MB 的 JavaScript 文件大小。而一个简单的“Hello, world”应用程序只依赖控制台例程，整个文件只有几千字节。

在 Kotlin/JS 编译器中，DCE 会自动处理：

*   DCE 在 _开发_ 捆绑任务中被禁用，这对应于以下 Gradle 任务：

    *   `jsBrowserDevelopmentRun`
    *   `jsBrowserDevelopmentWebpack`
    *   `jsNodeDevelopmentRun`
    *   `compileDevelopmentExecutableKotlinJs`
    *   `compileDevelopmentLibraryKotlinJs`
    *   名称中包含“development”的其他 Gradle 任务

*   如果您构建 _生产_ 捆绑包，DCE 则会启用，这对应于以下 Gradle 任务：

    *   `jsBrowserProductionRun`
    *   `jsBrowserProductionWebpack`
    *   `compileProductionExecutableKotlinJs`
    *   `compileProductionLibraryKotlinJs`
    *   名称中包含“production”的其他 Gradle 任务

通过 [`@JsExport`](js-to-kotlin-interop.md#jsexport-annotation) 注解，您可以指定希望 DCE 视为根的声明。

## 预览：TypeScript 声明文件（d.ts）的生成

> TypeScript 声明文件（`d.ts`）的生成是[实验性的](components-stability.md)。它随时可能被放弃或更改。需要选择启用（详见下方），并且您应仅将其用于求值目的。我们非常感谢您在 [YouTrack](https://youtrack.jetbrains.com/issues?q=%23%7BKJS:%20d.ts%20generation%7D) 上提供反馈。
>
{style="warning"}

Kotlin/JS IR 编译器能够从您的 Kotlin 代码生成 TypeScript 定义。这些定义可供 JavaScript 工具和 IDE 在开发混合应用时使用，以提供自动补全、支持静态分析器，并使 Kotlin 代码更容易包含在 JavaScript 和 TypeScript 项目中。

如果您的项目生成可执行文件（`binaries.executable()`），Kotlin/JS IR 编译器会收集任何用 [`@JsExport`](js-to-kotlin-interop.md#jsexport-annotation) 标记的顶层声明，并自动在 `.d.ts` 文件中生成 TypeScript 定义。

如果您想生成 TypeScript 定义，您必须在 Gradle 构建文件中显式配置此项。将 `generateTypeScriptDefinitions()` 添加到您的 `build.gradle.kts` 文件中的 [`js` 部分](js-project-setup.md#execution-environments)。例如：

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

这些定义可以在 `build/js/packages/<package_name>/kotlin` 中找到，及其对应的未打包 JavaScript 代码旁边。

## IR 编译器当前的局限性

新 IR 编译器后端的一个主要变化是与默认后端**缺少二进制兼容性**。用新 IR 编译器创建的库使用 [`klib` 格式](native-libraries.md#library-format)，无法在默认后端中使用。同时，用旧编译器创建的库是一个包含 `.js` 文件的 `jar` 包，无法在 IR 后端中使用。

如果您的项目想使用 IR 编译器后端，您需要**将所有 Kotlin 依赖项更新到支持此新后端的版本**。JetBrains 针对 Kotlin 1.4+ 面向 Kotlin/JS 发布的库已包含与新 IR 编译器后端一起使用所需的所有 artifact。

**如果您是库作者**，希望提供与当前编译器后端以及新 IR 编译器后端兼容性，另外请查看[为 IR 编译器编写具有向后兼容性（的库）](#authoring-libraries-for-the-ir-compiler-with-backwards-compatibility)部分。

IR 编译器后端与默认后端相比也存在一些差异。在试用新后端时，最好留意这些可能的陷阱。

*   一些**依赖于默认后端特定特性**的库，例如 `kotlin-wrappers`，可能会出现一些问题。您可以在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-40525) 上关注调查和进展。
*   IR 后端默认情况下根本**不将 Kotlin 声明暴露给 JavaScript**。要使 Kotlin 声明对 JavaScript 可见，它们**必须**使用 [`@JsExport`](js-to-kotlin-interop.md#jsexport-annotation) 注解。

## 将现有项目迁移到 IR 编译器

由于两种 Kotlin/JS 编译器之间的显著差异，使您的 Kotlin/JS 代码与 IR 编译器协同工作可能需要一些调整。请在 [Kotlin/JS IR 编译器迁移指南](js-ir-migration.md)中了解如何将现有 Kotlin/JS 项目迁移到 IR 编译器。

## 编写具有向后兼容性的 IR 编译器库

如果您是库维护者，希望提供与默认后端以及新 IR 编译器后端兼容性，则提供了编译器选择设置，允许您为两种后端创建 artifact，使您能够保持现有用户的兼容性，同时为下一代 Kotlin 编译器提供支持。这种所谓的 `both` 模式可以通过使用 `gradle.properties` 文件中的 `kotlin.js.compiler=both` 设置开启，或者可以作为 `build.gradle(.kts)` 文件中 `js` 代码块内的项目特有选项之一进行设置：

```groovy
kotlin {
    js(BOTH) {
        // ...
    }
}
```

在 `both` 模式下，从您的源代码构建库时，IR 编译器后端和默认编译器后端都会被使用（因此得名）。这意味着将生成包含 Kotlin IR 的 `klib` 文件以及用于默认编译器的 `jar` 文件。当在相同的 Maven 坐标下发布时，Gradle 将根据用例自动选择正确的 artifact——旧编译器使用 `js`，新编译器使用 `klib`。这使您能够为使用这两种编译器后端中任意一种的项目编译和发布您的库。