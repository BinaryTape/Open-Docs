[//]: # (title: Kotlin 1.8.0 的新特性)

_[发布时间: 2022 年 12 月 28 日](releases.md#release-details)_

Kotlin 1.8.0 版本已发布，以下是它的一些最大亮点：

*   [JVM 的新实验性函数：递归复制或删除目录内容](#recursive-copying-or-deletion-of-directories)
*   [改进的 `kotlin-reflect` 性能](#improved-kotlin-reflect-performance)
*   [用于提升调试体验的新 `-Xdebug` 编译器选项](#a-new-compiler-option-for-disabling-optimizations)
*   [`kotlin-stdlib-jdk7` 和 `kotlin-stdlib-jdk8` 合并到 `kotlin-stdlib`](#updated-jvm-compilation-target)
*   [改进的 Objective-C/Swift 互操作性](#improved-objective-c-swift-interoperability)
*   [兼容 Gradle 7.3](#gradle)

## IDE 支持

支持 1.8.0 的 Kotlin 插件适用于：

| IDE            | 支持的版本                 |
|----------------|------------------------------------|
| IntelliJ IDEA  | 2021.3, 2022.1, 2022.2             |
| Android Studio | Electric Eel (221), Flamingo (222) |

> 你可以在 IntelliJ IDEA 2022.3 中将项目更新到 Kotlin 1.8.0，而无需更新 IDE 插件。
>
> 要将现有项目迁移到 IntelliJ IDEA 2022.3 中的 Kotlin 1.8.0，请将 Kotlin 版本更改为 `1.8.0` 并重新导入
> 你的 Gradle 或 Maven 项目。
>
{style="note"}

## Kotlin/JVM

从 1.8.0 版本开始，编译器可以生成对应 JVM 19 的字节码版本的类。
新的语言版本还包括：

*   [用于关闭 JVM 注解目标生成的编译器选项](#ability-to-not-generate-type-use-and-type-parameter-annotation-targets)
*   [用于禁用优化的新 `-Xdebug` 编译器选项](#a-new-compiler-option-for-disabling-optimizations)
*   [旧后端已移除](#removal-of-the-old-backend)
*   [支持 Lombok 的 `@Builder` 注解](#support-for-lombok-s-builder-annotation)

### 不生成 TYPE_USE 和 TYPE_PARAMETER 注解目标的能力

如果 Kotlin 注解在其 Kotlin 目标中包含 `TYPE`，则该注解会映射到其 Java 注解目标列表中的 `java.lang.annotation.ElementType.TYPE_USE`，
这与 `TYPE_PARAMETER` Kotlin 目标映射到 `java.lang.annotation.ElementType.TYPE_PARAMETER` Java 目标的方式相同。对于 API 级别低于 26 的 Android 客户端来说，这是一个问题，因为这些 API 中不包含这些目标。

从 Kotlin 1.8.0 开始，你可以使用新的编译器选项 `-Xno-new-java-annotation-targets` 来避免生成 `TYPE_USE` 和 `TYPE_PARAMETER` 注解目标。

### 用于禁用优化的新编译器选项

Kotlin 1.8.0 添加了一个新的 `-Xdebug` 编译器选项，该选项会禁用优化以提供更好的调试体验。
目前，该选项禁用了协程的“已优化掉”功能。将来，在我们添加更多优化后，此选项也将禁用它们。

当使用挂起函数时，“已优化掉”功能会优化变量。但是，调试带有优化变量的代码很困难，因为你无法看到它们的值。

> **切勿在生产环境中使用此选项**：通过 `-Xdebug` 禁用此功能可能
> [导致内存泄漏](https://youtrack.jetbrains.com/issue/KT-48678/Coroutine-debugger-disable-was-optimised-out-compiler-feature#focus=Comments-27-6015585.0-0)。
>
{style="warning"}

### 旧后端已移除

在 Kotlin 1.5.0 中，我们[宣布](whatsnew15.md#stable-jvm-ir-backend)基于 IR 的后端变得[稳定](components-stability.md)。
这意味着 Kotlin 1.4.* 的旧后端已被弃用。在 Kotlin 1.8.0 中，我们已完全移除旧后端。
因此，我们已移除编译器选项 `-Xuse-old-backend` 和 Gradle 选项 `useOldBackend`。

### 支持 Lombok 的 @Builder 注解

社区对 [Kotlin Lombok: Support generated builders (@Builder)](https://youtrack.jetbrains.com/issue/KT-46959)
YouTrack 议题投票如此之多，我们不得不支持 [@Builder 注解](https://projectlombok.org/features/Builder)。

我们目前还没有计划支持 `@SuperBuilder` 或 `@Tolerate` 注解，但如果有足够多的人
投票支持 [@SuperBuilder](https://youtrack.jetbrains.com/issue/KT-53563/Kotlin-Lombok-Support-SuperBuilder) 和
[@Tolerate](https://youtrack.jetbrains.com/issue/KT-53564/Kotlin-Lombok-Support-Tolerate) 议题，我们将重新考虑。

[了解如何配置 Lombok 编译器插件](lombok.md#gradle)。

## Kotlin/Native

Kotlin 1.8.0 包含 Objective-C 和 Swift 互操作性的更改、对 Xcode 14.1 的支持以及 CocoaPods Gradle 插件的改进：

*   [支持 Xcode 14.1](#support-for-xcode-14-1)
*   [改进的 Objective-C/Swift 互操作性](#improved-objective-c-swift-interoperability)
*   [CocoaPods Gradle 插件中默认使用动态框架](#dynamic-frameworks-by-default-in-the-cocoapods-gradle-plugin)

### 支持 Xcode 14.1

Kotlin/Native 编译器现在支持最新的稳定 Xcode 版本 14.1。兼容性改进包括以下更改：

*   `watchosDeviceArm64` 是 watchOS 目标的新预设，支持 ARM64 平台上的 Apple watchOS。
*   Kotlin CocoaPods Gradle 插件不再默认对 Apple 框架嵌入 bitcode。
*   平台库已更新，以反映 Apple 目标 Objective-C 框架的更改。

### 改进的 Objective-C/Swift 互操作性

为了让 Kotlin 与 Objective-C 和 Swift 更好地互操作，增加了三个新注解：

*   [`@ObjCName`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native/-obj-c-name/) 允许你指定在 Swift 或 Objective-C 中更符合习惯的名称，而不是重命名 Kotlin 声明。

    该注解指示 Kotlin 编译器为此类、属性、参数或函数使用自定义的 Objective-C 和 Swift 名称：

   ```kotlin
   @ObjCName(swiftName = "MySwiftArray")
   class MyKotlinArray {
       @ObjCName("index")
       fun indexOf(@ObjCName("of") element: String): Int = TODO()
   }

   // Usage with the ObjCName annotations
   let array = MySwiftArray()
   let index = array.index(of: "element")
   ```

*   [`@HiddenFromObjC`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native/-hidden-from-obj-c/) 允许你将 Kotlin 声明从 Objective-C 中隐藏。

    该注解指示 Kotlin 编译器不要将函数或属性导出到 Objective-C，从而也不导出到 Swift。
    这可以使你的 Kotlin 代码更适用于 Objective-C/Swift。

*   [`@ShouldRefineInSwift`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native/-should-refine-in-swift/) 对于用 Swift 编写的包装器替换 Kotlin 声明很有用。

    该注解指示 Kotlin 编译器在生成的 Objective-C API 中将函数或属性标记为 `swift_private`。
    此类声明会获得 `__` 前缀，这使得它们对 Swift 代码不可见。

    你仍然可以在 Swift 代码中使用这些声明来创建 Swift 友好的 API，但它们不会被 Xcode 的自动补全建议，例如。

    有关在 Swift 中优化 Objective-C 声明的更多信息，请参阅
    [官方 Apple 文档](https://developer.apple.com/documentation/swift/improving-objective-c-api-declarations-for-swift)。

> 新注解需要 [选择加入 (opt-in)](opt-in-requirements.md)。
>
{style="note"}

Kotlin 团队非常感谢 [Rick Clephas](https://github.com/rickclephas) 实现了这些注解。

### CocoaPods Gradle 插件中默认使用动态框架

从 Kotlin 1.8.0 开始，CocoaPods Gradle 插件注册的 Kotlin 框架默认是动态链接的。
之前的静态实现与 Kotlin Gradle 插件的行为不一致。

```kotlin
kotlin {
    cocoapods {
        framework {
            baseName = "MyFramework"
            isStatic = false // 现在默认是动态的
        }
    }
}
```

如果你有一个使用静态链接类型的现有项目，并且你升级到 Kotlin 1.8.0（或明确更改链接类型），你可能会遇到项目执行错误。要解决此问题，请关闭你的 Xcode 项目并在 Podfile 目录中运行 `pod install`。

有关更多信息，请参阅 [CocoaPods Gradle 插件 DSL 参考](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-cocoapods-dsl-reference.html)。

## Kotlin Multiplatform: 新的 Android 源集布局

Kotlin 1.8.0 引入了新的 Android 源集布局，它取代了以前的目录命名方案，该方案在多个方面令人困惑。

考虑在当前布局中创建的两个 `androidTest` 目录的示例。一个用于 `KotlinSourceSets`，另一个用于 `AndroidSourceSets`：

*   它们有不同的语义：Kotlin 的 `androidTest` 属于 `unitTest` 类型，而 Android 的属于 `integrationTest` 类型。
*   它们创建了一个令人困惑的 `SourceDirectories` 布局，因为
    `src/androidTest/kotlin` 包含 `UnitTest` 而 `src/androidTest/java` 包含 `InstrumentedTest`。
*   `KotlinSourceSets` 和 `AndroidSourceSets` 都使用相似的 Gradle 配置命名方案，因此 Kotlin 和 Android 源集的 `androidTest` 的最终配置是相同的：`androidTestImplementation`、
    `androidTestApi`、`androidTestRuntimeOnly` 和 `androidTestCompileOnly`。

为了解决这些以及其他现有问题，我们引入了新的 Android 源集布局。
以下是两种布局之间的一些关键差异：

#### KotlinSourceSet 命名方案

| 当前源集布局              | 新源集布局               |
|----------------------------------------|-------------------------------------|
| `targetName` + `AndroidSourceSet.name` | `targetName` + `AndroidVariantType` |

`{AndroidSourceSet.name}` 映射到 `{KotlinSourceSet.name}` 如下：

|             | 当前源集布局 | 新源集布局          |
|-------------|---------------------------|--------------------------------|
| main        | androidMain               | androidMain                    |
| test        | androidTest               | android<b>Unit</b>Test         |
| androidTest | android<b>Android</b>Test | android<b>Instrumented</b>Test |

#### SourceDirectories

| 当前源集布局                               | 新源集布局                                                     |
|---------------------------------------------------------|---------------------------------------------------------------------------|
| 该布局添加了额外的 `/kotlin` SourceDirectories  | `src/{AndroidSourceSet.name}/kotlin`, `src/{KotlinSourceSet.name}/kotlin` |

`{AndroidSourceSet.name}` 映射到 `{SourceDirectories included}` 如下：

|             | 当前源集布局                                  | 新源集布局                                                                          |
|-------------|--------------------------------------------|------------------------------------------------------------------------------------------------|
| main        | src/androidMain/kotlin, src/main/kotlin, src/main/java     | src/androidMain/kotlin, src/main/kotlin, src/main/java                                         |
| test        | src/androidTest/kotlin, src/test/kotlin, src/test/java     | src/android<b>Unit</b>Test/kotlin, src/test/kotlin, src/test/java                              |
| androidTest | src/android<b>Android</b>Test/kotlin, src/androidTest/java | src/android<b>Instrumented</b>Test/kotlin, src/androidTest/java, <b>src/androidTest/kotlin</b> |

#### AndroidManifest.xml 文件的位置

| 当前源集布局                              | 新源集布局                                 |
|--------------------------------------------------------|-------------------------------------------------------|
| src/{<b>Android</b>SourceSet.name}/AndroidManifest.xml | src/{<b>Kotlin</b>SourceSet.name}/AndroidManifest.xml |

`{AndroidSourceSet.name}` 映射到`{AndroidManifest.xml location}` 如下：

|       | 当前源集布局     | 新源集布局                       |
|-------|-------------------------------|---------------------------------------------|
| main  | src/main/AndroidManifest.xml  | src/<b>android</b>Main/AndroidManifest.xml  |
| debug | src/debug/AndroidManifest.xml | src/<b>android</b>Debug/AndroidManifest.xml |

#### Android 与通用测试之间的关系

新的 Android 源集布局改变了 Android 插桩测试（在新布局中重命名为 `androidInstrumentedTest`）
与通用测试之间的关系。

以前，`androidAndroidTest` 和 `commonTest` 之间存在默认的 `dependsOn` 关系。实际上，这意味着：

*   `commonTest` 中的代码在 `androidAndroidTest` 中可用。
*   `commonTest` 中的 `expect` 声明必须在 `androidAndroidTest` 中有相应的 `actual` 实现。
*   在 `commonTest` 中声明的测试也作为 Android 插桩测试运行。

在新的 Android 源集布局中，默认不添加 `dependsOn` 关系。如果你喜欢以前的行为，
请在 `build.gradle.kts` 文件中手动声明此关系：

```kotlin
kotlin {
    // ...
    sourceSets {
        val commonTest by getting
        val androidInstrumentedTest by getting {
            dependsOn(commonTest)
        }
    }
}
```

#### 支持 Android flavors

以前，Kotlin Gradle 插件会主动创建与具有 `debug` 和
`release` 构建类型或自定义 flavor（如 `demo` 和 `full`）的 Android 源集对应的源集。
它通过 `val androidDebug by getting { ... }` 等构造使其可访问。

在新的 Android 源集布局中，这些源集是在 `afterEvaluate` 阶段创建的。这使得此类表达式无效，
导致诸如 `org.gradle.api.UnknownDomainObjectException: KotlinSourceSet with name 'androidDebug' not found` 等错误。

为了解决这个问题，请在 `build.gradle.kts` 文件中使用新的 `invokeWhenCreated()` API：

```kotlin
kotlin {
    // ...
    sourceSets.invokeWhenCreated("androidFreeDebug") {
        // ...
    }
}
```

### 配置和设置

新布局将在未来版本中成为默认设置。你现在可以通过以下 Gradle 选项启用它：

```none
kotlin.mpp.androidSourceSetLayoutVersion=2
```

> 新布局需要 Android Gradle 插件 7.0 或更高版本，并支持 Android Studio 2022.3 及更高版本。
>
{style="note"}

现在不鼓励使用以前的 Android 风格目录。Kotlin 1.8.0 标志着弃用周期的开始，并对当前布局引入了警告。你可以通过以下 Gradle 属性禁用此警告：

```none
kotlin.mpp.androidSourceSetLayoutVersion1.nowarn=true
```

## Kotlin/JS

Kotlin 1.8.0 稳定了 JS IR 编译器后端，并为 JavaScript 相关的 Gradle 构建脚本带来了新特性：
*   [稳定的 JS IR 编译器后端](#stable-js-ir-compiler-backend)
*   [报告 yarn.lock 已更新的新设置](#new-settings-for-reporting-that-yarn-lock-has-been-updated)
*   [通过 Gradle 属性为浏览器添加测试目标](#add-test-targets-for-browsers-via-gradle-properties)
*   [向项目添加 CSS 支持的新方法](#new-approach-to-adding-css-support-to-your-project)

### 稳定的 JS IR 编译器后端

从本版本开始，[Kotlin/JS 中间表示（IR-based）编译器](js-ir-compiler.md)后端是稳定的。统一所有三个后端的基础设施花费了一段时间，但它们现在都使用相同的 IR 来处理 Kotlin 代码。

作为稳定的 JS IR 编译器后端的后果，旧的后端从现在开始已被弃用。

增量编译默认启用，同时启用了稳定的 JS IR 编译器。

如果你仍在使用旧编译器，请借助我们的[迁移指南](js-ir-migration.md)将你的项目切换到新后端。

### 报告 yarn.lock 已更新的新设置

如果你使用 `yarn` 包管理器，有三个新的特殊 Gradle 设置可以通知你 `yarn.lock` 文件是否已更新。当你想在 CI 构建过程中安静地更改 `yarn.lock` 文件时获得通知时，可以使用这些设置。

这三个新的 Gradle 属性是：

*   `YarnLockMismatchReport`，它指定如何报告 `yarn.lock` 文件的更改。你可以使用以下值之一：
    *   `FAIL` 使相应的 Gradle 任务失败。这是默认值。
    *   `WARNING` 将有关更改的信息写入警告日志。
    *   `NONE` 禁用报告。
*   `reportNewYarnLock`，它明确报告最近创建的 `yarn.lock` 文件。默认情况下，此选项是禁用的：在首次启动时生成新的 `yarn.lock` 文件是一种常见做法。你可以使用此选项来确保该文件已提交到你的仓库。
*   `yarnLockAutoReplace`，它在每次 Gradle 任务运行时自动替换 `yarn.lock`。

要使用这些选项，请按如下方式更新你的构建脚本文件 `build.gradle.kts`：

```kotlin
import org.jetbrains.kotlin.gradle.targets.js.yarn.YarnLockMismatchReport
import org.jetbrains.kotlin.gradle.targets.js.yarn.YarnRootExtension

rootProject.plugins.withType(org.jetbrains.kotlin.gradle.targets.js.yarn.YarnPlugin::class.java) {
    rootProject.the<YarnRootExtension>().yarnLockMismatchReport =
        YarnLockMismatchReport.WARNING // NONE | FAIL
    rootProject.the<YarnRootExtension>().reportNewYarnLock = false // true
    rootProject.the<YarnRootExtension>().yarnLockAutoReplace = false // true
}
```

### 通过 Gradle 属性为浏览器添加测试目标

从 Kotlin 1.8.0 开始，你可以在 Gradle 属性文件中直接设置不同浏览器的测试目标。这样做可以缩小构建脚本文件的大小，因为你不再需要将所有目标写入 `build.gradle.kts` 中。

你可以使用此属性为所有模块定义一个浏览器列表，然后向特定模块的构建脚本中添加特定的浏览器。

例如，Gradle 属性文件中的以下行将针对所有模块在 Firefox 和 Safari 中运行测试：

```none
kotlin.js.browser.karma.browsers=firefox,safari
```

请参阅 [GitHub 上该属性可用值的完整列表](https://github.com/JetBrains/kotlin/blob/master/libraries/tools/kotlin-gradle-plugin/src/common/kotlin/org/jetbrains/kotlin/gradle/targets/js/testing/karma/KotlinKarma.kt#L106)。

Kotlin 团队非常感谢 [Martynas Petuška](https://github.com/mpetuska) 实现了此功能。

### 向项目添加 CSS 支持的新方法

此版本提供了一种向项目添加 CSS 支持的新方法。我们认为这会影响很多项目，
因此不要忘记按照下述方式更新你的 Gradle 构建脚本文件。

在 Kotlin 1.8.0 之前，`cssSupport.enabled` 属性用于添加 CSS 支持：

```kotlin
browser {
    commonWebpackConfig {
        cssSupport.enabled = true
    }
}
```

现在，你应该在 `cssSupport {}` 块中使用 `enabled.set()` 方法：

```kotlin
browser {
    commonWebpackConfig {
        cssSupport {
            enabled.set(true)
        }
    }
}
```

## Gradle

Kotlin 1.8.0 **完全**支持 Gradle 7.2 和 7.3 版本。你也可以使用最新 Gradle 版本，
但如果这样做，请记住你可能会遇到弃用警告或某些新的 Gradle 功能可能无法正常工作。

此版本带来了许多更改：
*   [将 Kotlin 编译器选项作为 Gradle 惰性属性公开](#exposing-kotlin-compiler-options-as-gradle-lazy-properties)
*   [提高最低支持版本](#bumping-the-minimum-supported-versions)
*   [禁用 Kotlin daemon 备用策略的能力](#ability-to-disable-the-kotlin-daemon-fallback-strategy)
*   [在传递依赖中使用最新 `kotlin-stdlib` 版本](#usage-of-the-latest-kotlin-stdlib-version-in-transitive-dependencies)
*   [强制检查相关 Kotlin 和 Java 编译任务的 JVM 目标兼容性](#obligatory-check-for-jvm-targets-of-related-kotlin-and-java-compile-tasks)
*   [Kotlin Gradle 插件的传递依赖解析](#resolution-of-kotlin-gradle-plugins-transitive-dependencies)
*   [弃用和移除](#deprecations-and-removals)

### 将 Kotlin 编译器选项作为 Gradle 惰性属性公开

为了将可用的 Kotlin 编译器选项作为 [Gradle 惰性属性](https://docs.gradle.org/current/userguide/lazy_configuration.html)公开，
并更好地将它们集成到 Kotlin 任务中，我们做了很多更改：

*   编译任务具有新的 `compilerOptions` 输入，它类似于现有的 `kotlinOptions`，但使用
    Gradle Properties API 中的 [`Property`](https://docs.gradle.org/current/javadoc/org/gradle/api/provider/Property.html) 作为返回类型：

  ```kotlin
  tasks.named("compileKotlin", org.jetbrains.kotlin.gradle.tasks.KotlinJvmCompile::class.java) {
      compilerOptions {
          useK2.set(true)
      }
  }
  ```

*   Kotlin 工具任务 `KotlinJsDce` 和 `KotlinNativeLink` 具有新的 `toolOptions` 输入，它类似于现有的 `kotlinOptions` 输入。
*   新输入具有 [`@Nested` Gradle 注解](https://docs.gradle.org/current/javadoc/org/gradle/api/tasks/Nested.html)。
    输入中的每个属性都具有相关的 Gradle 注解，例如
    [`@Input` 或 `@Internal`](https://docs.gradle.org/current/userguide/more_about_tasks.html#sec:up_to_date_checks)。
*   Kotlin Gradle 插件 API 工件有两个新接口：
    *   `org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask`，它具有 `compilerOptions` 输入和 `compileOptions()`
        方法。所有 Kotlin 编译任务都实现此接口。
    *   `org.jetbrains.kotlin.gradle.tasks.KotlinToolTask`，它具有 `toolOptions` 输入和 `toolOptions()` 方法。
        所有 Kotlin 工具任务——`KotlinJsDce`、`KotlinNativeLink` 和 `KotlinNativeLinkArtifactTask`——都实现此接口。
*   一些 `compilerOptions` 使用新类型而不是 `String` 类型：
    *   [`JvmTarget`](https://github.com/JetBrains/kotlin/blob/1.8.0/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/JvmTarget.kt)
    *   [`KotlinVersion`](https://github.com/JetBrains/kotlin/blob/1.8.0/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/KotlinVersion.kt)
        （用于 `apiVersion` 和 `languageVersion` 输入）
    *   [`JsMainFunctionExecutionMode`](https://github.com/JetBrains/kotlin/blob/1.8.0/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/JsMainFunctionExecutionMode.kt)
    *   [`JsModuleKind`](https://github.com/JetBrains/kotlin/blob/1.8.0/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/JsModuleKind.kt)
    *   [`JsSourceMapEmbedMode`](https://github.com/JetBrains/kotlin/blob/1.8.0/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/JsSourceMapEmbedMode.kt)

    例如，你可以使用 `compilerOptions.jvmTarget.set(JvmTarget.JVM_11)` 而不是 `kotlinOptions.jvmTarget = "11"`。

    `kotlinOptions` 类型没有改变，它们在内部转换为 `compilerOptions` 类型。
*   Kotlin Gradle 插件 API 与以前的版本二进制兼容。但是，`kotlin-gradle-plugin` 工件中存在一些源和 ABI 破坏性更改。其中大部分更改涉及一些内部类型的额外泛型参数。一个重要的更改是 `KotlinNativeLink` 任务不再继承 `AbstractKotlinNativeCompile` 任务。
*   `KotlinJsCompilerOptions.outputFile` 和相关的 `KotlinJsOptions.outputFile` 选项已弃用。请改用 `Kotlin2JsCompile.outputFileProperty` 任务输入。

> Kotlin Gradle 插件仍将 `KotlinJvmOptions` DSL 添加到 Android 扩展：
>
> ```kotlin
> android {
>     kotlinOptions {
>         jvmTarget = "11"
>     }
> }
> ```
>
> 这将在 [此问题](https://youtrack.jetbrains.com/issue/KT-15370/Gradle-DSL-add-module-level-kotlin-options) 的范围内更改，
> 届时 `compilerOptions` DSL 将添加到模块级别。
>
{style="note"}

#### 限制

> `kotlinOptions` 任务输入和 `kotlinOptions{...}` 任务 DSL 处于支持模式，并将在
> 后续版本中弃用。改进将仅针对 `compilerOptions` 和 `toolOptions` 进行。
>
{style="warning"}

调用 `kotlinOptions` 上的任何 setter 或 getter 都会委托给 `compilerOptions` 中的相关属性。
这引入了以下限制：
*   在任务执行阶段不能更改 `compilerOptions` 和 `kotlinOptions`（下面段落中有一个例外）。
*   `freeCompilerArgs` 返回一个不可变的 `List<String>`，这意味着，例如，
    `kotlinOptions.freeCompilerArgs.remove("something")` 将失败。

几个插件，包括 `kotlin-dsl` 和启用了 [Jetpack Compose](https://developer.android.com/jetpack/compose) 的 Android Gradle 插件 (AGP)，尝试在任务执行阶段修改 `freeCompilerArgs` 属性。我们在 Kotlin 1.8.0 中为它们添加了一个解决方法。此解决方法允许任何构建脚本或插件在执行阶段修改 `kotlinOptions.freeCompilerArgs`，但在构建日志中会产生警告。要禁用此警告，请使用新的 Gradle 属性 `kotlin.options.suppressFreeCompilerArgsModificationWarning=true`。Gradle 将为 [`kotlin-dsl` 插件](https://github.com/gradle/gradle/issues/22091) 和
[启用了 Jetpack Compose 的 AGP](https://issuetracker.google.com/u/1/issues/247544167) 添加修复。

### 提高最低支持版本

从 Kotlin 1.8.0 开始，最低支持的 Gradle 版本是 6.8.3，最低支持的 Android Gradle 插件版本是 4.1.3。

请参阅我们文档中 [Kotlin Gradle 插件与可用 Gradle 版本的兼容性](gradle-configure-project.md#apply-the-plugin)。

### 禁用 Kotlin daemon 备用策略的能力

有一个新的 Gradle 属性 `kotlin.daemon.useFallbackStrategy`，其默认值为 `true`。当值为 `false` 时，
如果 daemon 的启动或通信出现问题，构建将失败。Kotlin 编译任务中还有一个新的 `useDaemonFallbackStrategy` 属性，
如果你同时使用这两个属性，它将优先于 Gradle 属性。如果内存不足以运行编译，你可以在日志中看到相关消息。

Kotlin 编译器的备用策略是如果 daemon 出现故障，则在 Kotlin daemon 外部运行编译。
如果 Gradle daemon 已打开，编译器使用“In process”策略。如果 Gradle daemon 已关闭，编译器使用“Out of process”策略。
了解更多关于这些[执行策略的文档](gradle-compilation-and-caches.md#defining-kotlin-compiler-execution-strategy)。
请注意，静默回退到其他策略可能会消耗大量系统资源或导致非确定性构建；
有关更多详细信息，请参阅此 [YouTrack 议题](https://youtrack.jetbrains.com/issue/KT-48843/Add-ability-to-disable-Kotlin-daemon-fallback-strategy)。

### 在传递依赖中使用最新 kotlin-stdlib 版本

如果你在依赖中明确写入 Kotlin 版本 1.8.0 或更高版本，例如：
`implementation("org.jetbrains.kotlin:kotlin-stdlib:1.8.0")`，那么 Kotlin Gradle 插件将为传递的 `kotlin-stdlib-jdk7` 和 `kotlin-stdlib-jdk8` 依赖项使用该 Kotlin 版本。这样做是为了避免不同 stdlib 版本的类重复（了解更多关于
[将 `kotlin-stdlib-jdk7` 和 `kotlin-stdlib-jdk8` 合并到 `kotlin-stdlib`](#updated-jvm-compilation-target)）。
你可以使用 `kotlin.stdlib.jdk.variants.version.alignment` Gradle 属性禁用此行为：

```none
kotlin.stdlib.jdk.variants.version.alignment=false
```

如果你遇到版本对齐问题，请通过 Kotlin [BOM](https://docs.gradle.org/current/userguide/platforms.html#sub:bom_import) 对齐所有版本，
方法是在构建脚本中声明对 `kotlin-bom` 的平台依赖：

```kotlin
implementation(platform("org.jetbrains.kotlin:kotlin-bom:1.8.0"))
```

了解其他情况和我们建议的解决方案，请参阅[文档](gradle-configure-project.md#other-ways-to-align-versions)。

### 强制检查相关 Kotlin 和 Java 编译任务的 JVM 目标兼容性

> 即使你的源文件仅为 Kotlin 且不使用 Java，本节也适用于你的 JVM 项目。
>
{style="note"}

[从本版本开始](https://youtrack.jetbrains.com/issue/KT-54993/Raise-kotlin.jvm.target.validation.mode-check-default-level-to-error-when-build-is-running-on-Gradle-8)，
对于 Gradle 8.0+（此版本 Gradle 尚未发布）上的项目，`kotlin.jvm.target.validation.mode` 属性的默认值是 `error`，
并且在 JVM 目标不兼容的情况下，插件将导致构建失败。

默认值从 `warning` 变为 `error` 是为了顺利迁移到 Gradle 8.0 的准备步骤。
**我们鼓励你将此属性设置为 `error`** 并[配置工具链](gradle-configure-project.md#gradle-java-toolchains-support)
或手动对齐 JVM 版本。

了解更多关于[如果目标不兼容可能出现的问题](gradle-configure-project.md#what-can-go-wrong-if-targets-are-incompatible)。

### Kotlin Gradle 插件传递依赖的解析

在 Kotlin 1.7.0 中，我们引入了 [Gradle 插件变体支持](whatsnew17.md#support-for-gradle-plugin-variants)。
由于这些插件变体，构建 classpath 可能包含不同版本的 [Kotlin Gradle 插件](https://plugins.gradle.org/u/kotlin)，
这些插件依赖于某个依赖项的不同版本，通常是 `kotlin-gradle-plugin-api`。这可能导致
解析问题，我们想提出以下解决方法，以 `kotlin-dsl` 插件为例。

Gradle 7.6 中的 `kotlin-dsl` 插件依赖于 `org.jetbrains.kotlin.plugin.sam.with.receiver:1.7.10` 插件，
该插件又依赖于 `kotlin-gradle-plugin-api:1.7.10`。如果你添加 `org.jetbrains.kotlin.gradle.jvm:1.8.0` 插件，
此 `kotlin-gradle-plugin-api:1.7.10` 传递依赖可能会由于版本不匹配（`1.8.0` 和 `1.7.10`）和
变体属性的 [`org.gradle.plugin.api-version`](https://docs.gradle.org/current/javadoc/org/gradle/api/attributes/plugin/GradlePluginApiVersion.html) 值而导致依赖解析错误。作为解决方法，
添加此[约束](https://docs.gradle.org/current/userguide/dependency_constraints.html#sec:adding-constraints-transitive-deps) 以对齐版本。在我们将 [Kotlin Gradle 插件库对齐平台](https://youtrack.jetbrains.com/issue/KT-54691/Kotlin-Gradle-Plugin-libraries-alignment-platform)
（计划中）实现之前，可能需要此解决方法：

```kotlin
dependencies {
    constraints {
        implementation("org.jetbrains.kotlin:kotlin-sam-with-receiver:1.8.0")
    }
}
```

此约束强制将 `org.jetbrains.kotlin:kotlin-sam-with-receiver:1.8.0` 版本用于构建 classpath 中的传递依赖。
了解更多关于类似的[Gradle 问题跟踪器中的案例](https://github.com/gradle/gradle/issues/22510#issuecomment-1292259298)。

### 弃用和移除

在 Kotlin 1.8.0 中，以下属性和方法的弃用周期仍在继续：

*   [在 Kotlin 1.7.0 的说明中](whatsnew17.md#changes-in-compile-tasks)指出 `KotlinCompile` 任务仍具有
    已弃用的 Kotlin 属性 `classpath`，该属性将在未来版本中移除。现在，我们已将
    `KotlinCompile` 任务的 `classpath` 属性的弃用级别更改为 `error`。所有编译任务都使用
    `libraries` 输入作为编译所需库的列表。
*   我们移除了 `kapt.use.worker.api` 属性，该属性允许通过 Gradle Workers API 运行 [kapt](kapt.md)。
    默认情况下，[kapt 从 Kotlin 1.3.70 开始已使用 Gradle workers](kapt.md#run-kapt-tasks-in-parallel)，
    我们建议坚持使用此方法。
*   在 Kotlin 1.7.0 中，我们[宣布开始弃用 `kotlin.compiler.execution.strategy` 属性](whatsnew17.md#deprecation-of-the-kotlin-compiler-execution-strategy-system-property)。
    在此版本中，我们移除了此属性。了解如何通过其他方式[定义 Kotlin 编译器执行策略](gradle-compilation-and-caches.md#defining-kotlin-compiler-execution-strategy)。

## 标准库

Kotlin 1.8.0：
*   更新 [JVM 编译目标](#updated-jvm-compilation-target)。
*   稳定了许多函数——[Java 和 Kotlin 之间的时间单位 (`TimeUnit`) 转换](#timeunit-conversion-between-java-and-kotlin)、
    [`cbrt()`](#cbrt)、Java [`Optionals` 扩展函数](#java-optionals-extension-functions)。
*   提供了[可比较和可相减的 `TimeMarks` 的预览](#comparable-and-subtractable-timemarks)。
*   包含了 [`java.nio.file.path` 的实验性扩展函数](#recursive-copying-or-deletion-of-directories)。
*   展示了[改进的 `kotlin-reflect` 性能](#improved-kotlin-reflect-performance)。

### 更新 JVM 编译目标

在 Kotlin 1.8.0 中，标准库（`kotlin-stdlib`、`kotlin-reflect` 和 `kotlin-script-*`）使用
JVM 目标 1.8 进行编译。以前，标准库使用 JVM 目标 1.6 进行编译。

Kotlin 1.8.0 不再支持 JVM 目标 1.6 和 1.7。因此，你不再需要在构建脚本中单独声明 `kotlin-stdlib-jdk7`
和 `kotlin-stdlib-jdk8`，因为这些工件的内容已合并到 `kotlin-stdlib` 中。

> 如果你已在构建脚本中明确声明了 `kotlin-stdlib-jdk7` 和 `kotlin-stdlib-jdk8` 作为依赖项，
> 那么你应该将它们替换为 `kotlin-stdlib`。
>
{style="note"}

请注意，混合不同版本的 stdlib 工件可能导致类重复或类缺失。
为了避免这种情况，Kotlin Gradle 插件可以帮助你[对齐 stdlib 版本](#usage-of-the-latest-kotlin-stdlib-version-in-transitive-dependencies)。

### cbrt()

`cbrt()` 函数现在已稳定，它允许你计算 `double` 或 `float` 的实数立方根。

```kotlin
import kotlin.math.*

fun main() {
    val num = 27
    val negNum = -num

    println("The cube root of ${num.toDouble()} is: " +
            cbrt(num.toDouble()))
    println("The cube root of ${negNum.toDouble()} is: " +
            cbrt(negNum.toDouble()))
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.8"}

### TimeUnit 在 Java 和 Kotlin 之间的转换

`kotlin.time` 中的 `toTimeUnit()` 和 `toDurationUnit()` 函数现在已稳定。这些函数在 Kotlin 1.6.0 中作为实验性功能引入，它们改善了 Kotlin 和 Java 之间的互操作性。你现在可以轻松地在 Java 的 `java.util.concurrent.TimeUnit` 和 Kotlin 的 `kotlin.time.DurationUnit` 之间进行转换。这些函数仅在 JVM 上受支持。

```kotlin
import kotlin.time.*

// For use from Java
fun wait(timeout: Long, unit: TimeUnit) {
    val duration: Duration = timeout.toDuration(unit.toDurationUnit())
    ...
}
```

### 可比较和可相减的 TimeMarks

> `TimeMarks` 的新功能是[实验性的](components-stability.md#stability-levels-explained)，要使用它
> 你需要通过使用 `@OptIn(ExperimentalTime::class)` 或 `@ExperimentalTime` 来选择加入。
>
{style="warning"}

在 Kotlin 1.8.0 之前，如果你想计算多个 `TimeMarks` 与 **现在** 之间的时间差，你只能一次对一个 `TimeMark` 调用 `elapsedNow()`。这使得比较结果变得困难，因为两次 `elapsedNow()` 函数调用无法在完全相同的时间执行。

为了解决这个问题，在 Kotlin 1.8.0 中，你可以从同一个时间源中减去和比较 `TimeMarks`。现在你可以创建一个新的 `TimeMark` 实例来表示**现在**，并从中减去其他 `TimeMarks`。这样，你从这些计算中收集到的结果保证是相互关联的。

```kotlin
import kotlin.time.*
fun main() {
//sampleStart
    val timeSource = TimeSource.Monotonic
    val mark1 = timeSource.markNow()
    Thread.sleep(500) // Sleep 0.5 seconds
    val mark2 = timeSource.markNow()

    // Before 1.8.0
    repeat(4) { n ->
        val elapsed1 = mark1.elapsedNow()
        val elapsed2 = mark2.elapsedNow()

        // Difference between elapsed1 and elapsed2 can vary depending
        // on how much time passes between the two elapsedNow() calls
        println("Measurement 1.${n + 1}: elapsed1=$elapsed1, " +
                "elapsed2=$elapsed2, diff=${elapsed1 - elapsed2}")
    }
    println()

    // Since 1.8.0
    repeat(4) { n ->
        val mark3 = timeSource.markNow()
        val elapsed1 = mark3 - mark1
        val elapsed2 = mark3 - mark2

        // Now the elapsed times are calculated relative to mark3,
        // which is a fixed value
        println("Measurement 2.${n + 1}: elapsed1=$elapsed1, " +
                "elapsed2=$elapsed2, diff=${elapsed1 - elapsed2}")
    }
    // It's also possible to compare time marks with each other
    // This is true, as mark2 was captured later than mark1
    println(mark2 > mark1)
//sampleEnd
}

```
{kotlin-runnable="true" kotlin-min-compiler-version="1.8"}

这个新功能在动画计算中特别有用，你希望计算多个代表不同帧的 `TimeMarks` 之间的差异或进行比较。

### 递归复制或删除目录

> 这些 `java.nio.file.path` 的新函数是[实验性的](components-stability.md#stability-levels-explained)。
> 要使用它们，你需要通过 `@OptIn(kotlin.io.path.ExperimentalPathApi::class)` 或 `@kotlin.io.path.ExperimentalPathApi` 选择加入。
> 另外，你可以使用编译器选项 `-opt-in=kotlin.io.path.ExperimentalPathApi`。
>
{style="warning"}

我们为 `java.nio.file.Path` 引入了两个新的扩展函数：`copyToRecursively()` 和 `deleteRecursively()`，
它们允许你递归地：

*   将目录及其内容复制到另一个目标位置。
*   删除目录及其内容。

这些函数在备份过程中非常有用。

#### 错误处理

使用 `copyToRecursively()`，你可以通过重载 `onError` lambda 函数来定义在复制时发生异常时应如何处理：

```kotlin
sourceRoot.copyToRecursively(destinationRoot, followLinks = false,
    onError = { source, target, exception ->
        logger.logError(exception, "Failed to copy $source to $target")
        OnErrorResult.TERMINATE
    })
```
{validate="false"}

当你使用 `deleteRecursively()` 时，如果删除文件或文件夹时发生异常，则会跳过该文件或文件夹。删除完成后，`deleteRecursively()` 会抛出一个 `IOException`，其中包含所有发生的异常作为被抑制的异常。

#### 文件覆盖

如果 `copyToRecursively()` 发现目标目录中已存在文件，则会发生异常。
如果你想覆盖该文件，请使用带有 `overwrite` 参数的重载，并将其设置为 `true`：

```kotlin
fun setUpEnvironment(projectDirectory: Path, fixtureName: String) {
    fixturesRoot.resolve(COMMON_FIXTURE_NAME)
        .copyToRecursively(projectDirectory, followLinks = false)
    fixturesRoot.resolve(fixtureName)
        .copyToRecursively(projectDirectory, followLinks = false,
            overwrite = true) // patches the common fixture
}
```
{validate="false"}

#### 自定义复制操作

要定义你自己的自定义复制逻辑，请使用带有 `copyAction` 附加参数的重载。
通过使用 `copyAction`，你可以提供一个 lambda 函数，例如，其中包含你偏好的操作：

```kotlin
sourceRoot.copyToRecursively(destinationRoot, followLinks = false) { source, target ->
    if (source.name.startsWith(".")) {
        CopyActionResult.SKIP_SUBTREE
    } else {
        source.copyToIgnoringExistingDirectory(target, followLinks = false)
        CopyActionResult.CONTINUE
    }
}
```
{validate="false"}

有关这些扩展函数的更多信息，请参阅[我们的 API 参考](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io.path/java.nio.file.-path/copy-to-recursively.html)。

### Java Optionals 扩展函数

在 [Kotlin 1.7.0](whatsnew17.md#new-experimental-extension-functions-for-java-optionals) 中引入的扩展函数现在已经稳定。这些函数简化了在 Java 中使用 `Optional` 类的工作。它们可以用于在 JVM 上解包和转换 `Optional` 对象，并使与 Java API 的交互更加简洁。有关更多信息，
请参阅 [Kotlin 1.7.0 的新特性](whatsnew17.md#new-experimental-extension-functions-for-java-optionals)。

### 改进的 kotlin-reflect 性能

得益于 `kotlin-reflect` 现在使用 JVM 目标 1.8 进行编译，我们已将内部缓存机制迁移到 Java 的 `ClassValue`。以前我们只缓存 `KClass`，但现在我们也缓存 `KType` 和 `KDeclarationContainer`。这些更改在调用 `typeOf()` 时带来了显著的性能提升。

## 文档更新

Kotlin 文档收到了一些显著的更改：

### 改版和新页面

*   [Gradle 概述](gradle.md) – 了解如何使用 Gradle 构建系统配置和构建 Kotlin 项目、可用编译器选项以及 Kotlin Gradle 插件中的编译和缓存。
*   [Java 和 Kotlin 中的可空性](java-to-kotlin-nullability-guide.md) – 查看 Java 和 Kotlin 处理可能为空变量的方法之间的差异。
*   [Lincheck 指南](lincheck-guide.md) – 了解如何设置和使用 Lincheck 框架来测试 JVM 上的并发算法。

### 新增和更新的教程

*   [开始使用 Gradle 和 Kotlin/JVM](get-started-with-jvm-gradle-project.md) – 使用 IntelliJ IDEA 和 Gradle 创建控制台应用程序。
*   [使用 Ktor 和 SQLDelight 创建多平台应用](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-ktor-sqldelight.html) – 使用 Kotlin Multiplatform Mobile 创建 iOS 和 Android 移动应用程序。
*   [开始使用 Kotlin Multiplatform](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-create-first-app.html) – 了解 Kotlin 的跨平台移动开发，并创建一个可以在 Android 和 iOS 上运行的应用程序。

## 安装 Kotlin 1.8.0

[IntelliJ IDEA](https://www.jetbrains.com/idea/download/) 2021.3、2022.1 和 2022.2 会自动建议将 Kotlin 插件更新到 1.8.0 版本。IntelliJ IDEA 2022.3 将在即将到来的小版本更新中捆绑 1.8.0 版本的 Kotlin 插件。

> 要将现有项目迁移到 IntelliJ IDEA 2022.3 中的 Kotlin 1.8.0，请将 Kotlin 版本更改为 `1.8.0` 并重新导入
> 你的 Gradle 或 Maven 项目。
>
{style="note"}

对于 Android Studio Electric Eel (221) 和 Flamingo (222)，Kotlin 插件的 1.8.0 版本将随即将到来的 Android Studios 更新一起发布。新的命令行编译器可从 [GitHub 发布页面](https://github.com/JetBrains/kotlin/releases/tag/v1.8.0) 下载。

## Kotlin 1.8.0 兼容性指南

Kotlin 1.8.0 是一个[功能版本](kotlin-evolution-principles.md#language-and-tooling-releases)，因此可能会带来与你为早期语言版本编写的代码不兼容的更改。在 [Kotlin 1.8.0 兼容性指南](compatibility-guide-18.md) 中查找这些更改的详细列表。