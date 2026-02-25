[//]: # (title: Kotlin 1.8.0 最新变化)

<web-summary>阅读 Kotlin 1.8.0 发行说明，涵盖新语言功能、Kotlin 多平台、JVM、Native、JS 的更新，以及对 Gradle 和 Maven 构建工具的支持。</web-summary>

_[发布日期：2022 年 12 月 28 日](releases.md#release-history)_

Kotlin 1.8.0 已经发布，以下是一些重大亮点：

* [JVM 新实验性功能：递归复制或删除目录内容](#recursive-copying-or-deletion-of-directories)
* [提升 kotlin-reflect 性能](#improved-kotlin-reflect-performance)
* [新的 -Xdebug 编译器选项以获得更好的调试体验](#a-new-compiler-option-for-disabling-optimizations)
* [`kotlin-stdlib-jdk7` 和 `kotlin-stdlib-jdk8` 合并至 `kotlin-stdlib`](#updated-jvm-compilation-target)
* [改进的 Objective-C/Swift 互操作性](#improved-objective-c-swift-interoperability)
* [兼容 Gradle 7.3](#gradle)

> 有关 Kotlin 发布周期的信息，请参阅 [Kotlin 发布流程](releases.md)。
>
{style="tip"}

## IDE 支持

支持 1.8.0 的 Kotlin 插件适用于：

| IDE            | 支持的版本                         |
|----------------|------------------------------------|
| IntelliJ IDEA  | 2021.3, 2022.1, 2022.2             |
| Android Studio | Electric Eel (221), Flamingo (222) |

> 您可以在 IntelliJ IDEA 2022.3 中将项目更新到 Kotlin 1.8.0，而无需更新 IDE 插件。
>
> 要在 IntelliJ IDEA 2022.3 中将现有项目迁移到 Kotlin 1.8.0，请将 Kotlin 版本更改为 `1.8.0` 并重新导入您的 Gradle 或 Maven 项目。
>
{style="note"}

## Kotlin/JVM

从 1.8.0 版本开始，编译器可以生成字节码版本对应于 JVM 19 的类。新的语言版本还包括：

* [用于关闭生成 JVM 注解目标的编译器选项](#ability-to-not-generate-type-use-and-type-parameter-annotation-targets)
* [用于禁用优化的新 `-Xdebug` 编译器选项](#a-new-compiler-option-for-disabling-optimizations)
* [移除旧后端](#removal-of-the-old-backend)
* [支持 Lombok 的 @Builder 注解](#support-for-lombok-s-builder-annotation)

### 能够不生成 TYPE_USE 和 TYPE_PARAMETER 注解目标

如果 Kotlin 注解在其 Kotlin 目标中包含 `TYPE`，则该注解会在其 Java 注解目标列表中映射到 `java.lang.annotation.ElementType.TYPE_USE`。这就像 `TYPE_PARAMETER` Kotlin 目标如何映射到 `java.lang.annotation.ElementType.TYPE_PARAMETER` Java 目标一样。对于 API 级别低于 26 的 Android 客户端，这是一个问题，因为它们的 API 中没有这些目标。

从 Kotlin 1.8.0 开始，您可以使用新的编译器选项 `-Xno-new-java-annotation-targets` 来避免生成 `TYPE_USE` 和 `TYPE_PARAMETER` 注解目标。

### 用于禁用优化的新编译器选项

Kotlin 1.8.0 增加了一个新的 `-Xdebug` 编译器选项，该选项通过禁用优化来获得更好的调试体验。目前，该选项禁用了协程的 "was optimized out"（已被优化掉）功能。未来，在我们添加更多优化后，此选项也将禁用它们。

当您使用挂起函数时，"was optimized out" 功能会优化变量。但是，调试具有优化变量的代码很困难，因为您看不见它们的值。

> **切勿在生产环境中使用此选项**：通过 `-Xdebug` 禁用此功能可能会[导致内存泄漏](https://youtrack.jetbrains.com/issue/KT-48678/Coroutine-debugger-disable-was-optimised-out-compiler-feature#focus=Comments-27-6015585.0-0)。
>
{style="warning"}

### 移除旧后端

在 Kotlin 1.5.0 中，我们[宣布](whatsnew15.md#stable-jvm-ir-backend)基于 IR 的后端已达到 Stable。这意味着 Kotlin 1.4.* 中的旧后端已被弃用。在 Kotlin 1.8.0 中，我们已经完全移除了旧后端。相应地，我们也移除了编译器选项 `-Xuse-old-backend` 和 Gradle 选项 `useOldBackend`。

### 支持 Lombok 的 @Builder 注解

社区在 YouTrack 问题 [Kotlin Lombok: Support generated builders (@Builder)](https://youtrack.jetbrains.com/issue/KT-46959) 中投了非常多的票，因此我们必须支持 [@Builder 注解](https://projectlombok.org/features/Builder)。

我们目前还没有支持 `@SuperBuilder` 或 `@Tolerate` 注解的计划，但如果有足够多的人为 [@SuperBuilder](https://youtrack.jetbrains.com/issue/KT-53563/Kotlin-Lombok-Support-SuperBuilder) 和 [@Tolerate](https://youtrack.jetbrains.com/issue/KT-53564/Kotlin-Lombok-Support-Tolerate) 问题投票，我们会重新考虑。

[了解如何配置 Lombok 编译器插件](lombok.md#gradle)。

## Kotlin/Native

Kotlin 1.8.0 包括对 Objective-C 和 Swift 互操作性的更改、对 Xcode 14.1 的支持以及对 CocoaPods Gradle 插件的改进：

* [支持 Xcode 14.1](#support-for-xcode-14-1)
* [改进的 Objective-C/Swift 互操作性](#improved-objective-c-swift-interoperability)
* [CocoaPods Gradle 插件默认使用动态框架](#dynamic-frameworks-by-default-in-the-cocoapods-gradle-plugin)

### 支持 Xcode 14.1

Kotlin/Native 编译器现在支持最新的稳定 Xcode 版本 14.1。兼容性改进包括以下更改：

* 为 watchOS 目标增加了一个新的 `watchosDeviceArm64` 预设，支持 ARM64 平台上的 Apple watchOS。
* Kotlin CocoaPods Gradle 插件默认不再为 Apple 框架嵌入 bitcode。
* 更新了平台库以反映针对 Apple 目标的 Objective-C 框架的变化。

### 改进的 Objective-C/Swift 互操作性

为了让 Kotlin 与 Objective-C 和 Swift 更好地互操作，增加了三个新注解：

* [`@ObjCName`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native/-obj-c-name/) 允许您在 Swift 或 Objective-C 中指定一个更符合语言习惯的名称，而不是重命名 Kotlin 声明。

  该注解指示 Kotlin 编译器为此类、属性、形参或函数使用自定义的 Objective-C 和 Swift 名称：

   ```kotlin
   @ObjCName(swiftName = "MySwiftArray")
   class MyKotlinArray {
       @ObjCName("index")
       fun indexOf(@ObjCName("of") element: String): Int = TODO()
   }

   // 使用 ObjCName 注解后的用法
   let array = MySwiftArray()
   let index = array.index(of: "element")
   ```

* [`@HiddenFromObjC`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native/-hidden-from-obj-c/) 允许您向 Objective-C 隐藏 Kotlin 声明。

  该注解指示 Kotlin 编译器不要将函数或属性导出到 Objective-C，从而也不导出到 Swift。这可以使您的 Kotlin 代码对 Objective-C/Swift 更加友好。

* [`@ShouldRefineInSwift`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native/-should-refine-in-swift/) 对于使用 Swift 编写的包装器替换 Kotlin 声明非常有用。

  该注解指示 Kotlin 编译器在生成的 Objective-C API 中将函数或属性标记为 `swift_private`。此类声明会带有 `__` 前缀，这使得它们对 Swift 代码不可见。

  您仍然可以在 Swift 代码中使用这些声明来创建对 Swift 友好的 API，但例如 Xcode 的自动补全将不再建议它们。

  有关在 Swift 中精炼 Objective-C 声明的更多信息，请参阅 [Apple 官方文档](https://developer.apple.com/documentation/swift/improving-objective-c-api-declarations-for-swift)。

> 这些新注解需要 [opt-in](opt-in-requirements.md)。
>
{style="note"}

Kotlin 团队非常感谢 [Rick Clephas](https://github.com/rickclephas) 实现这些注解。

### CocoaPods Gradle 插件默认使用动态框架

从 Kotlin 1.8.0 开始，由 CocoaPods Gradle 插件注册的 Kotlin 框架默认进行动态链接。之前的静态实现与 Kotlin Gradle 插件的行为不一致。

```kotlin
kotlin {
    cocoapods {
        framework {
            baseName = "MyFramework"
            isStatic = false // 现在默认为 false (动态)
        }
    }
}
```

如果您现有的项目使用的是静态链接类型，并且您升级到了 Kotlin 1.8.0（或显式更改了链接类型），您可能会在执行项目时遇到错误。要修复此问题，请关闭 Xcode 项目并在 Podfile 目录下运行 `pod install`。

有关更多信息，请参阅 [CocoaPods Gradle 插件 DSL 参考](https://kotlinlang.org/docs/multiplatform/multiplatform-cocoapods-dsl-reference.html)。

## Kotlin 多平台：新的 Android 源集布局

Kotlin 1.8.0 引入了新的 Android 源集布局，取代了之前在多个方面都容易引起混淆的目录命名方案。

以在当前布局中创建的两个 `androidTest` 目录为例。一个是用于 `KotlinSourceSets` 的，另一个是用于 `AndroidSourceSets` 的：

* 它们具有不同的语义：Kotlin 的 `androidTest` 属于 `unitTest` 类型，而 Android 的属于 `integrationTest` 类型。
* 它们创建了令人困惑的 `SourceDirectories` 布局，例如 `src/androidTest/kotlin` 包含一个 `UnitTest`，而 `src/androidTest/java` 包含一个 `InstrumentedTest`。
* `KotlinSourceSets` 和 `AndroidSourceSets` 都为 Gradle 配置使用类似的命名方案，因此 Kotlin 和 Android 源集的 `androidTest` 生成的配置是相同的：`androidTestImplementation`、`androidTestApi`、`androidTestRuntimeOnly` 和 `androidTestCompileOnly`。

为了解决这些及其他现有问题，我们引入了新的 Android 源集布局。以下是两种布局之间的一些主要区别：

#### KotlinSourceSet 命名方案

| 当前源集布局                             | 新源集布局                              |
|------------------------------------------|-----------------------------------------|
| `targetName` + `AndroidSourceSet.name` | `targetName` + `AndroidVariantType` |

`{AndroidSourceSet.name}` 映射到 `{KotlinSourceSet.name}` 的方式如下：

|             | 当前源集布局              | 新源集布局                     |
|-------------|---------------------------|--------------------------------|
| main        | androidMain               | androidMain                    |
| test        | androidTest               | android<b>Unit</b>Test         |
| androidTest | android<b>Android</b>Test | android<b>Instrumented</b>Test |

#### SourceDirectories

| 当前源集布局                               | 新源集布局                                                                |
|--------------------------------------------|---------------------------------------------------------------------------|
| 该布局增加了额外的 `/kotlin` SourceDirectories | `src/{AndroidSourceSet.name}/kotlin`, `src/{KotlinSourceSet.name}/kotlin` |

`{AndroidSourceSet.name}` 映射到 `{包含的 SourceDirectories}` 的方式如下：

|             | 当前源集布局                                               | 新源集布局                                                                                     |
|-------------|------------------------------------------------------------|------------------------------------------------------------------------------------------------|
| main        | src/androidMain/kotlin, src/main/kotlin, src/main/java     | src/androidMain/kotlin, src/main/kotlin, src/main/java                                         |
| test        | src/androidTest/kotlin, src/test/kotlin, src/test/java     | src/android<b>Unit</b>Test/kotlin, src/test/kotlin, src/test/java                              |
| androidTest | src/android<b>Android</b>Test/kotlin, src/androidTest/java | src/android<b>Instrumented</b>Test/kotlin, src/androidTest/java, <b>src/androidTest/kotlin</b> |

#### AndroidManifest.xml 文件的位置

| 当前源集布局                                             | 新源集布局                                            |
|----------------------------------------------------------|-------------------------------------------------------|
| src/{<b>Android</b>SourceSet.name}/AndroidManifest.xml | src/{<b>Kotlin</b>SourceSet.name}/AndroidManifest.xml |

`{AndroidSourceSet.name}` 映射到 `{AndroidManifest.xml 位置}` 的方式如下：

|       | 当前源集布局                  | 新源集布局                                  |
|-------|-------------------------------|---------------------------------------------|
| main  | src/main/AndroidManifest.xml  | src/<b>android</b>Main/AndroidManifest.xml  |
| debug | src/debug/AndroidManifest.xml | src/<b>android</b>Debug/AndroidManifest.xml |

#### Android 测试与通用测试之间的关系

新的 Android 源集布局改变了 Android 插桩测试（在新布局中重命名为 `androidInstrumentedTest`）与通用测试之间的关系。

以前，`androidAndroidTest` 和 `commonTest` 之间存在默认的 `dependsOn` 关系。实际上，这意味着以下几点：

* `commonTest` 中的代码在 `androidAndroidTest` 中可用。
* `commonTest` 中的 `expect` 声明必须在 `androidAndroidTest` 中具有相应的 `actual` 实现。
* 在 `commonTest` 中声明的测试也会作为 Android 插桩测试运行。

在新的 Android 源集布局中，默认不添加 `dependsOn` 关系。如果您更喜欢以前的行为，请在 `build.gradle.kts` 文件中手动声明此关系：

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

#### 对 Android Flavor 的支持

以前，Kotlin Gradle 插件会急切地创建与具有 `debug` 和 `release` 构建类型或自定义 flavor（如 `demo` 和 `full`）的 Android 源集相对应的源集。这使得它们可以通过类似 `val androidDebug by getting { ... }` 的结构进行访问。

在新的 Android 源集布局中，这些源集是在 `afterEvaluate` 阶段创建的。这使得此类表达式无效，从而导致类似 `org.gradle.api.UnknownDomainObjectException: KotlinSourceSet with name 'androidDebug' not found` 的错误。

要解决此问题，请在 `build.gradle.kts` 文件中使用新的 `invokeWhenCreated()` API：

```kotlin
kotlin {
    // ...
    sourceSets.invokeWhenCreated("androidFreeDebug") {
        // ...
    }
}
```

### 配置与设置

新布局将在未来的版本中成为默认布局。您现在可以通过以下 Gradle 选项启用它：

```none
kotlin.mpp.androidSourceSetLayoutVersion=2
```

> 新布局要求 Android Gradle 插件 7.0 或更高版本，并在 Android Studio 2022.3 及更高版本中受支持。
>
{style="note"}

现在不鼓励使用以前的 Android 风格目录。Kotlin 1.8.0 标志着弃用周期的开始，并针对当前布局引入了警告。您可以使用以下 Gradle 属性取消该警告：

```none
kotlin.mpp.androidSourceSetLayoutVersion1.nowarn=true
```

## Kotlin/JS

Kotlin 1.8.0 稳定了 JS IR 编译器后端，并为与 JavaScript 相关的 Gradle 构建脚本带来了新功能：
* [稳定的 JS IR 编译器后端](#stable-js-ir-compiler-backend)
* [用于报告 yarn.lock 已更新的新设置](#new-settings-for-reporting-that-yarn-lock-has-been-updated)
* [通过 Gradle 属性为浏览器添加测试目标](#add-test-targets-for-browsers-via-gradle-properties)
* [向项目添加 CSS 支持的新方法](#new-approach-to-adding-css-support-to-your-project)

### 稳定的 JS IR 编译器后端

从本版本开始，[Kotlin/JS 中间表示（基于 IR）编译器](js-ir-compiler.md)后端达到 Stable。统一所有三个后端的底层架构花了一些时间，但它们现在都可以针对 Kotlin 代码使用相同的 IR。

作为 JS IR 编译器后端稳定的结果，旧后端从现在起将被弃用。

增量编译默认与稳定的 JS IR 编译器一起启用。

如果您仍在使用旧编译器，请将您的项目切换到新后端。

### 用于报告 yarn.lock 已更新的新设置

如果您使用 `yarn` 软件包管理器，可以使用三个新的特殊 Gradle 设置，当 `yarn.lock` 文件被更新时它们会通知您。当您希望在 CI 构建过程中如果 `yarn.lock` 被静默更改时获得通知，可以使用这些设置。

这三个新的 Gradle 属性是：

* `YarnLockMismatchReport`：指定如何报告对 `yarn.lock` 文件的更改。您可以使用以下值之一：
    * `FAIL`：使相应的 Gradle 任务失败。这是默认值。
    * `WARNING`：在警告日志中写入有关更改的信息。
    * `NONE`：禁用报告。
* `reportNewYarnLock`：显式报告最近创建的 `yarn.lock` 文件。默认情况下，此选项是禁用的：在第一次启动时生成新的 `yarn.lock` 文件是常见做法。您可以使用此选项来确保该文件已提交到您的仓库中。
* `yarnLockAutoReplace`：每次运行 Gradle 任务时自动替换 `yarn.lock`。

要使用这些选项，请按如下方式更新您的构建脚本文件 `build.gradle.kts`：

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

从 Kotlin 1.8.0 开始，您可以直接在 Gradle 属性文件中为不同的浏览器设置测试目标。这样做可以缩小构建脚本文件的体积，因为您不再需要在 `build.gradle.kts` 中编写所有目标。

您可以使用此属性为所有模块定义浏览器列表，然后在特定模块的构建脚本中添加特定浏览器。

例如，在您的 Gradle 属性文件中添加以下行将为所有模块在 Firefox 和 Safari 中运行测试：

```none
kotlin.js.browser.karma.browsers=firefox,safari
```

请参阅 [GitHub 上该属性的可用值完整列表](https://github.com/JetBrains/kotlin/blob/master/libraries/tools/kotlin-gradle-plugin/src/common/kotlin/org/jetbrains/kotlin/gradle/targets/js/testing/karma/KotlinKarma.kt#L106)。

Kotlin 团队非常感谢 [Martynas Petuška](https://github.com/mpetuska) 实现此功能。

### 向项目添加 CSS 支持的新方法

此版本提供了一种向项目添加 CSS 支持的新方法。我们预计这会影响很多项目，因此请务必按照下文所述更新您的 Gradle 构建脚本文件。

在 Kotlin 1.8.0 之前，使用 `cssSupport.enabled` 属性来添加 CSS 支持：

```kotlin
browser {
    commonWebpackConfig {
        cssSupport.enabled = true
    }
}
```

现在您应该在 `cssSupport {}` 块中使用 `enabled.set()` 方法：

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

Kotlin 1.8.0 **完全**支持 Gradle 7.2 和 7.3 版本。您也可以使用截至最新发布的 Gradle 版本，但如果这样做，请记住您可能会遇到弃用警告，或者某些新的 Gradle 功能可能无法正常工作。

此版本带来了许多变化：
* [将 Kotlin 编译器选项公开为 Gradle 延迟属性](#exposing-kotlin-compiler-options-as-gradle-lazy-properties)
* [提高最低支持版本](#bumping-the-minimum-supported-versions)
* [能够禁用 Kotlin 守护进程回退策略](#ability-to-disable-the-kotlin-daemon-fallback-strategy)
* [在传递依赖中使用最新的 kotlin-stdlib 版本](#usage-of-the-latest-kotlin-stdlib-version-in-transitive-dependencies)
* [强制检查相关 Kotlin 和 Java 编译任务的 JVM 目标兼容性一致性](#obligatory-check-for-jvm-targets-of-related-kotlin-and-java-compile-tasks)
* [解析 Kotlin Gradle 插件的传递依赖](#resolution-of-kotlin-gradle-plugins-transitive-dependencies)
* [弃用与移除](#deprecations-and-removals)

### 将 Kotlin 编译器选项公开为 Gradle 延迟属性

为了将可用的 Kotlin 编译器选项公开为 [Gradle 延迟属性](https://docs.gradle.org/current/userguide/lazy_configuration.html)并更好地将它们集成到 Kotlin 任务中，我们进行了许多更改：

* 编译任务拥有新的 `compilerOptions` 输入，它类似于现有的 `kotlinOptions`，但使用 Gradle 属性 API 中的 [`Property`](https://docs.gradle.org/current/javadoc/org/gradle/api/provider/Property.html) 作为返回类型：

  ```kotlin
  tasks.named("compileKotlin", org.jetbrains.kotlin.gradle.tasks.KotlinJvmCompile::class.java) {
      compilerOptions {
          useK2.set(true)
      }
  }
  ```

* Kotlin 工具任务 `KotlinJsDce` 和 `KotlinNativeLink` 拥有新的 `toolOptions` 输入，它类似于现有的 `kotlinOptions` 输入。
* 新输入具有 [`@Nested` Gradle 注解](https://docs.gradle.org/current/javadoc/org/gradle/api/tasks/Nested.html)。输入内部的每个属性都具有相关的 Gradle 注解，例如 [`@Input` 或 `@Internal`](https://docs.gradle.org/current/userguide/more_about_tasks.html#sec:up_to_date_checks)。
* Kotlin Gradle 插件 API 构件有两个新接口：
    * `org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask`：具有 `compilerOptions` 输入和 `compileOptions()` 方法。所有 Kotlin 编译任务都实现此接口。
    * `org.jetbrains.kotlin.gradle.tasks.KotlinToolTask`：具有 `toolOptions` 输入和 `toolOptions()` 方法。所有 Kotlin 工具任务（`KotlinJsDce`、`KotlinNativeLink` 和 `KotlinNativeLinkArtifactTask`）都实现此接口。
* 某些 `compilerOptions` 使用了新类型而不是 `String` 类型：
    * [`JvmTarget`](https://github.com/JetBrains/kotlin/blob/1.8.0/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/JvmTarget.kt)
    * [`KotlinVersion`](https://github.com/JetBrains/kotlin/blob/1.8.0/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/KotlinVersion.kt)（用于 `apiVersion` 和 `languageVersion` 输入）
    * [`JsMainFunctionExecutionMode`](https://github.com/JetBrains/kotlin/blob/1.8.0/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/JsMainFunctionExecutionMode.kt)
    * [`JsModuleKind`](https://github.com/JetBrains/kotlin/blob/1.8.0/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/JsModuleKind.kt)
    * [`JsSourceMapEmbedMode`](https://github.com/JetBrains/kotlin/blob/1.8.0/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/JsSourceMapEmbedMode.kt)

  例如，您可以使用 `compilerOptions.jvmTarget.set(JvmTarget.JVM_11)` 而不是 `kotlinOptions.jvmTarget = "11"`。

  `kotlinOptions` 类型没有改变，它们在内部被转换为 `compilerOptions` 类型。
* Kotlin Gradle 插件 API 与之前的版本保持二进制兼容。但是，`kotlin-gradle-plugin` 构件中存在一些源码和 ABI 破坏性变更。大多数变更涉及向某些内部类型添加额外的泛型形参。一个重要的变更是 `KotlinNativeLink` 任务不再继承 `AbstractKotlinNativeCompile` 任务。
* `KotlinJsCompilerOptions.outputFile` 及其相关的 `KotlinJsOptions.outputFile` 选项已被弃用。请改用 `Kotlin2JsCompile.outputFileProperty` 任务输入。

> Kotlin Gradle 插件仍然向 Android 扩展程序添加 `KotlinJvmOptions` DSL：
>
> ```kotlin
> android { 
>     kotlinOptions {
>         jvmTarget = "11"
>     }
> }
> ```
>
> 随着[此问题](https://youtrack.jetbrains.com/issue/KT-15370/Gradle-DSL-add-module-level-kotlin-options)的解决，当 `compilerOptions` DSL 添加到模块级别时，这种情况将会发生改变。
>
{style="note"}

#### 局限性

> `kotlinOptions` 任务输入和 `kotlinOptions{...}` 任务 DSL 处于支持模式，并将在即将发布的版本中被弃用。改进将仅针对 `compilerOptions` 和 `toolOptions` 进行。
>
{style="warning"}

在 `kotlinOptions` 上调用任何 setter 或 getter 都会委托给 `compilerOptions` 中的相关属性。这引入了以下局限性：
* `compilerOptions` 和 `kotlinOptions` 不能在任务执行阶段更改（请参阅下文中的一个例外情况）。
* `freeCompilerArgs` 返回一个不可变的 `List<String>`，这意味着，例如 `kotlinOptions.freeCompilerArgs.remove("something")` 将会失败。

包括 `kotlin-dsl` 和启用了 [Jetpack Compose](https://developer.android.com/jetpack/compose) 的 Android Gradle 插件 (AGP) 在内的几个插件尝试在任务执行阶段修改 `freeCompilerArgs` 属性。我们在 Kotlin 1.8.0 中为它们添加了一个权宜之计。此权宜之计允许任何构建脚本或插件在执行阶段修改 `kotlinOptions.freeCompilerArgs`，但在构建日志中会产生警告。要禁用此警告，请使用新的 Gradle 属性 `kotlin.options.suppressFreeCompilerArgsModificationWarning=true`。Gradle 将为 [`kotlin-dsl` 插件](https://github.com/gradle/gradle/issues/22091)和[启用了 Jetpack Compose 的 AGP](https://issuetracker.google.com/u/1/issues/247544167) 添加修复程序。

### 提高最低支持版本

从 Kotlin 1.8.0 开始，最低支持的 Gradle 版本为 6.8.3，最低支持的 Android Gradle 插件版本为 4.1.3。

请参阅我们的文档了解 [Kotlin Gradle 插件与可用 Gradle 版本的兼容性](gradle-configure-project.md#apply-the-plugin)

### 能够禁用 Kotlin 守护进程回退策略

新增了一个 Gradle 属性 `kotlin.daemon.useFallbackStrategy`，其默认值为 `true`。当值为 `false` 时，如果守护进程启动或通信出现问题，构建将失败。Kotlin 编译任务中还有一个新的 `useDaemonFallbackStrategy` 属性，如果您同时使用这两个属性，它的优先级高于 Gradle 属性。如果运行编译的内存不足，您可以在日志中看到相关消息。

Kotlin 编译器的回退策略是，如果守护进程由于某种原因失败，则在 Kotlin 守护进程之外运行编译。如果 Gradle 守护进程开启，编译器将使用 "In process" 策略。如果 Gradle 守护进程关闭，编译器将使用 "Out of process" 策略。在文档中详细了解这些[执行策略](gradle-compilation-and-caches.md#defining-kotlin-compiler-execution-strategy)。请注意，静默回退到另一种策略可能会消耗大量系统资源或导致非确定性构建；有关更多详细信息，请参阅此 [YouTrack 问题](https://youtrack.jetbrains.com/issue/KT-48843/Add-ability-to-disable-Kotlin-daemon-fallback-strategy)。

### 在传递依赖中使用最新的 kotlin-stdlib 版本

如果您在依赖项中显式写入 Kotlin 版本 1.8.0 或更高版本，例如：`implementation("org.jetbrains.kotlin:kotlin-stdlib:1.8.0")`，那么 Kotlin Gradle 插件将为传递性的 `kotlin-stdlib-jdk7` 和 `kotlin-stdlib-jdk8` 依赖项使用该 Kotlin 版本。这样做是为了避免来自不同 stdlib 版本的类重复（详细了解[将 `kotlin-stdlib-jdk7` 和 `kotlin-stdlib-jdk8` 合并到 `kotlin-stdlib`](#updated-jvm-compilation-target)）。您可以使用 `kotlin.stdlib.jdk.variants.version.alignment` Gradle 属性禁用此行为：

```none
kotlin.stdlib.jdk.variants.version.alignment=false
```

如果您遇到版本对齐问题，请通过在构建脚本中声明对 `kotlin-bom` 的平台依赖，利用 Kotlin [BOM](https://docs.gradle.org/current/userguide/platforms.html#sub:bom_import) 对齐所有版本：

```kotlin
implementation(platform("org.jetbrains.kotlin:kotlin-bom:1.8.0"))
```

在[文档](gradle-configure-project.md#other-ways-to-align-versions)中了解其他情况及我们建议的解决方案。

### 强制检查相关 Kotlin 和 Java 编译任务的 JVM 目标

> 即使您的源文件仅为 Kotlin 且不使用 Java，本节内容也适用于您的 JVM 项目。
>
{style="note"}

[从本版本开始](https://youtrack.jetbrains.com/issue/KT-54993/Raise-kotlin.jvm.target.validation.mode-check-default-level-to-error-when-build-is-running-on-Gradle-8)，对于 Gradle 8.0+ 上的项目（该版本的 Gradle 尚未发布），[`kotlin.jvm.target.validation.mode` 属性](gradle-configure-project.md#check-for-jvm-target-compatibility-of-related-compile-tasks)的默认值为 `error`，如果 JVM 目标不兼容，插件将使构建失败。

将默认值从 `warning` 更改为 `error` 是为了顺利迁移到 Gradle 8.0 做准备。**我们鼓励您将此属性设置为 `error`** 并[配置工具链](gradle-configure-project.md#gradle-java-toolchains-support)或手动对齐 JVM 版本。

详细了解[如果不检查目标的兼容性可能会出现什么问题](gradle-configure-project.md#what-can-go-wrong-if-targets-are-incompatible)。

### 解析 Kotlin Gradle 插件的传递依赖

在 Kotlin 1.7.0 中，我们引入了[对 Gradle 插件变体的支持](whatsnew17.md#support-for-gradle-plugin-variants)。由于这些插件变体，构建类路径可能会具有不同版本的 [Kotlin Gradle 插件](https://plugins.gradle.org/u/kotlin)，它们依赖于某个依赖项的不同版本，通常是 `kotlin-gradle-plugin-api`。这可能会导致解析问题，我们建议采用以下解决方法，以 `kotlin-dsl` 插件为例。

Gradle 7.6 中的 `kotlin-dsl` 插件依赖于 `org.jetbrains.kotlin.plugin.sam.with.receiver:1.7.10` 插件，而该插件又依赖于 `kotlin-gradle-plugin-api:1.7.10`。如果您添加了 `org.jetbrains.kotlin.gradle.jvm:1.8.0` 插件，由于版本（`1.8.0` 和 `1.7.10`）与变体属性的 [`org.gradle.plugin.api-version`](https://docs.gradle.org/current/javadoc/org/gradle/api/attributes/plugin/GradlePluginApiVersion.html) 值不匹配，此 `kotlin-gradle-plugin-api:1.7.10` 传递依赖项可能会导致依赖项解析错误。作为解决方法，请添加此[约束](https://docs.gradle.org/current/userguide/dependency_constraints.html#sec:adding-constraints-transitive-deps)以对齐版本。在我们在计划中实现 [Kotlin Gradle 插件库对齐平台](https://youtrack.jetbrains.com/issue/KT-54691/Kotlin-Gradle-Plugin-libraries-alignment-platform)之前，可能需要此解决方法：

```kotlin
dependencies {
    constraints {
        implementation("org.jetbrains.kotlin:kotlin-sam-with-receiver:1.8.0")
    }
}
```

此约束强制在构建类路径中为传递依赖使用 `org.jetbrains.kotlin:kotlin-sam-with-receiver:1.8.0` 版本。在 [Gradle 问题跟踪器](https://github.com/gradle/gradle/issues/22510#issuecomment-1292259298)中详细了解一个类似的案例。

### 弃用与移除

在 Kotlin 1.8.0 中，以下属性和方法的弃用周期继续进行：

* [在 Kotlin 1.7.0 的说明中](whatsnew17.md#changes-in-compile-tasks)，`KotlinCompile` 任务仍然具有已弃用的 Kotlin 属性 `classpath`，该属性将在未来的版本中被移除。现在，我们将 `KotlinCompile` 任务的 `classpath` 属性的弃用级别更改为 `error`。所有编译任务都使用 `libraries` 输入来获取编译所需的库列表。
* 我们移除了 `kapt.use.worker.api` 属性，该属性允许通过 Gradle Workers API 运行 [kapt](kapt.md)。默认情况下，[kapt 自 Kotlin 1.3.70 起就一直在使用 Gradle workers](kapt.md#run-kapt-tasks-in-parallel)，我们建议坚持使用此方法。
* 在 Kotlin 1.7.0 中，我们[宣布开始弃用 `kotlin.compiler.execution.strategy` 属性的周期](whatsnew17.md#deprecation-of-the-kotlin-compiler-execution-strategy-system-property)。在此版本中，我们移除了该属性。了解如何通过其他方式[定义 Kotlin 编译器执行策略](gradle-compilation-and-caches.md#defining-kotlin-compiler-execution-strategy)。

## 标准库

Kotlin 1.8.0：
* 更新了 [JVM 编译目标](#updated-jvm-compilation-target)。
* 稳定了许多函数——[Java 和 Kotlin 之间的 TimeUnit 转换](#timeunit-conversion-between-java-and-kotlin)、[`cbrt()`](#cbrt)、[Java `Optionals` 扩展函数](#java-optionals-extension-functions)。
* 提供了 [可比较且可相减的 `TimeMarks` 预览](#comparable-and-subtractable-timemarks)。
* 包含 [用于 `java.nio.file.path` 的实验性扩展函数](#recursive-copying-or-deletion-of-directories)。
* 呈现了 [提升后的 kotlin-reflect 性能](#improved-kotlin-reflect-performance)。

### 更新了 JVM 编译目标

在 Kotlin 1.8.0 中，标准库（`kotlin-stdlib`、`kotlin-reflect` 和 `kotlin-script-*`）使用 JVM 目标 1.8 进行编译。以前，标准库使用 JVM 目标 1.6 进行编译。

Kotlin 1.8.0 不再支持 JVM 目标 1.6 和 1.7。因此，您不再需要在构建脚本中单独声明 `kotlin-stdlib-jdk7` 和 `kotlin-stdlib-jdk8`，因为这些构件的内容已合并到 `kotlin-stdlib` 中。

> 如果您在构建脚本中显式将 `kotlin-stdlib-jdk7` 和 `kotlin-stdlib-jdk8` 声明为依赖项，那么您应该将它们替换为 `kotlin-stdlib`。
>
{style="note"}

请注意，混合不同版本的 stdlib 构件可能会导致类重复或类缺失。为了避免这种情况，Kotlin Gradle 插件可以帮助您[对齐 stdlib 版本](#usage-of-the-latest-kotlin-stdlib-version-in-transitive-dependencies)。

### cbrt()

`cbrt()` 函数现在已达到 Stable，它允许您计算 `double` 或 `float` 的实立方根。

```kotlin
import kotlin.math.*

fun main() {
    val num = 27
    val negNum = -num

    println("${num.toDouble()} 的立方根是： " +
            cbrt(num.toDouble()))
    println("${negNum.toDouble()} 的立方根是： " +
            cbrt(negNum.toDouble()))
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.8"}

### Java 和 Kotlin 之间的 TimeUnit 转换

`kotlin.time` 中的 `toTimeUnit()` 和 `toDurationUnit()` 函数现在已达到 Stable。这些函数在 Kotlin 1.6.0 中作为 Experimental 引入，改进了 Kotlin 和 Java 之间的互操作性。您现在可以轻松地在 Java 的 `java.util.concurrent.TimeUnit` 和 Kotlin 的 `kotlin.time.DurationUnit` 之间进行转换。这些函数仅在 JVM 上受支持。

```kotlin
import kotlin.time.*

// 供 Java 使用
fun wait(timeout: Long, unit: TimeUnit) {
    val duration: Duration = timeout.toDuration(unit.toDurationUnit())
    ...
}
```

### 可比较且可相减的 TimeMarks

> `TimeMarks` 的新功能是 [Experimental](components-stability.md#stability-levels-explained) 的，要使用它，您需要通过使用 `@OptIn(ExperimentalTime::class)` 或 `@ExperimentalTime` 进行 opt-in。
>
{style="warning"}

在 Kotlin 1.8.0 之前，如果您想计算多个 `TimeMarks` 与**现在**之间的时间差，您只能每次在一个 `TimeMark` 上调用 `elapsedNow()`。这使得比较结果变得困难，因为两次 `elapsedNow()` 函数调用不能在完全相同的时间执行。

为了解决这个问题，在 Kotlin 1.8.0 中，您可以从同一时间源中减去并比较 `TimeMarks`。现在您可以创建一个新的 `TimeMark` 实例来表示**现在**，并从中减去其他 `TimeMarks`。通过这种方式，您从这些计算中收集到的结果保证是相互关联的。

```kotlin
import kotlin.time.*
fun main() {
//sampleStart
    val timeSource = TimeSource.Monotonic
    val mark1 = timeSource.markNow()
    Thread.sleep(500) // 休眠 0.5 秒
    val mark2 = timeSource.markNow()

    // 1.8.0 之前
    repeat(4) { n ->
        val elapsed1 = mark1.elapsedNow()
        val elapsed2 = mark2.elapsedNow()

        // elapsed1 和 elapsed2 之间的差异可能因
        // 两次 elapsedNow() 调用之间流逝的时间而异
        println("测量 1.${n + 1}: elapsed1=$elapsed1, " +
                "elapsed2=$elapsed2, diff=${elapsed1 - elapsed2}")
    }
    println()

    // 自 1.8.0 起
    repeat(4) { n ->
        val mark3 = timeSource.markNow()
        val elapsed1 = mark3 - mark1
        val elapsed2 = mark3 - mark2

        // 现在流逝的时间是相对于 mark3 计算的，
        // mark3 是一个固定值
        println("测量 2.${n + 1}: elapsed1=$elapsed1, " +
                "elapsed2=$elapsed2, diff=${elapsed1 - elapsed2}")
    }
    // 也可以将时间标记相互比较
    // 这是 true，因为 mark2 比 mark1 捕获的时间晚
    println(mark2 > mark1)
//sampleEnd
}

```
{kotlin-runnable="true" kotlin-min-compiler-version="1.8"}

这一新功能在动画计算中特别有用，因为您需要计算代表不同帧的多个 `TimeMarks` 之间的差异或对其进行比较。

### 递归复制或删除目录

> 这些针对 `java.nio.file.path` 的新函数是 [Experimental](components-stability.md#stability-levels-explained) 的。要使用它们，您需要使用 `@OptIn(kotlin.io.path.ExperimentalPathApi::class)` 或 `@kotlin.io.path.ExperimentalPathApi` 进行 opt-in。或者，您可以使用编译器选项 `-opt-in=kotlin.io.path.ExperimentalPathApi`。
>
{style="warning"}

我们为 `java.nio.file.Path` 引入了两个新的扩展函数 `copyToRecursively()` 和 `deleteRecursively()`，它们允许您递归地：

* 将目录及其内容复制到另一个目的地。
* 删除目录及其内容。

这些函数作为备份过程的一部分非常有用。

#### 错误处理

使用 `copyToRecursively()` 时，您可以通过重载 `onError` lambda 函数来定义在复制过程中发生异常时应采取的操作：

```kotlin
sourceRoot.copyToRecursively(destinationRoot, followLinks = false,
    onError = { source, target, exception ->
        logger.logError(exception, "无法将 $source 复制到 $target")
        OnErrorResult.TERMINATE
    })
```
{validate="false"}

当您使用 `deleteRecursively()` 时，如果在删除文件或文件夹时发生异常，则该文件或文件夹将被跳过。删除完成后，`deleteRecursively()` 会抛出一个 `IOException`，其中包含所有发生的异常作为被抑制的异常。

#### 文件覆盖

如果 `copyToRecursively()` 发现目标目录中已存在同名文件，则会发生异常。如果您希望覆盖该文件，请使用带有 `overwrite` 参数的重载版本并将其设置为 `true`：

```kotlin
fun setUpEnvironment(projectDirectory: Path, fixtureName: String) {
    fixturesRoot.resolve(COMMON_FIXTURE_NAME)
        .copyToRecursively(projectDirectory, followLinks = false)
    fixturesRoot.resolve(fixtureName)
        .copyToRecursively(projectDirectory, followLinks = false,
            overwrite = true) // 补丁通用固定例程
}
```
{validate="false"}

#### 自定义复制操作

要为复制定义您自己的自定义逻辑，请使用带有 `copyAction` 作为额外参数的重载版本。通过使用 `copyAction`，您可以提供一个 lambda 函数，例如，执行您偏好的操作：

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

有关这些扩展函数的更多信息，请参阅 [我们的 API 参考](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io.path/java.nio.file.-path/copy-to-recursively.html)。

### Java Optionals 扩展函数

在 [Kotlin 1.7.0](whatsnew17.md#new-experimental-extension-functions-for-java-optionals) 中引入的扩展函数现在已达到 Stable。这些函数简化了 Java 中 Optional 类的使用。它们可用于在 JVM 上拆封和转换 `Optional` 对象，并使 Java API 的工作更加简洁。有关更多信息，请参阅 [Kotlin 1.7.0 最新变化](whatsnew17.md#new-experimental-extension-functions-for-java-optionals)。

### 提升后的 kotlin-reflect 性能

利用 `kotlin-reflect` 现在使用 JVM 目标 1.8 编译这一事实，我们将内部缓存机制迁移到了 Java 的 `ClassValue`。以前我们只缓存 `KClass`，但现在我们也缓存 `KType` 和 `KDeclarationContainer`。这些变化显著提升了调用 `typeOf()` 时的性能。

## 文档更新

Kotlin 文档进行了一些显著的变化：

### 翻新和新增页面

* [Gradle 概述](gradle.md) – 了解如何使用 Gradle 构建系统配置和构建 Kotlin 项目，以及 Kotlin Gradle 插件中可用的编译器选项、编译和缓存。
* [Java 和 Kotlin 中的为 null 性](java-to-kotlin-nullability-guide.md) – 查看 Java 和 Kotlin 在处理可能为 null 的变量的方法上的差异。
* [Lincheck 指南](lincheck-guide.md) – 了解如何设置和使用 Lincheck 框架，用于在 JVM 上测试并发算法。

### 新增及更新的教程

* [Gradle 和 Kotlin/JVM 入门](get-started-with-jvm-gradle-project.md) – 使用 IntelliJ IDEA 和 Gradle 创建一个控制台应用程序。
* [使用 Ktor 和 SQLDelight 创建多平台应用](https://kotlinlang.org/docs/multiplatform/multiplatform-ktor-sqldelight.html) – 使用 Kotlin Multiplatform Mobile 创建适用于 iOS 和 Android 的移动应用程序。
* [Kotlin 多平台入门](https://kotlinlang.org/docs/multiplatform/multiplatform-create-first-app.html) – 了解使用 Kotlin 进行跨平台移动开发，并创建一个在 Android 和 iOS 上都能运行的应用。

## 安装 Kotlin 1.8.0

[IntelliJ IDEA](https://www.jetbrains.com/idea/download/) 2021.3、2022.1 和 2022.2 会自动建议将 Kotlin 插件更新到 1.8.0 版本。IntelliJ IDEA 2022.3 将在即将推出的次要更新中捆绑 1.8.0 版本的 Kotlin 插件。

> 要在 IntelliJ IDEA 2022.3 中将现有项目迁移到 Kotlin 1.8.0，请将 Kotlin 版本更改为 `1.8.0` 并重新导入您的 Gradle 或 Maven 项目。
>
{style="note"}

对于 Android Studio Electric Eel (221) 和 Flamingo (222)，Kotlin 插件的 1.8.0 版本将随即将到来的 Android Studio 更新一起提供。新的命令行编译器可在 [GitHub 发布页面](https://github.com/JetBrains/kotlin/releases/tag/v1.8.0)下载。

## Kotlin 1.8.0 兼容性指南

Kotlin 1.8.0 是一个[特性版本](kotlin-evolution-principles.md#language-and-tooling-releases)，因此可能会带来与您为早期语言版本编写的代码不兼容的更改。请在 [Kotlin 1.8.0 兼容性指南](compatibility-guide-18.md)中找到这些更改的详细列表。