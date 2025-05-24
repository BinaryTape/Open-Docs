---
title: "Kotlin 1.8.0 新特性"
---
_[发布时间：2022 年 12 月 28 日](releases#release-details)_

Kotlin 1.8.0 版本已发布，以下是其一些最主要亮点：

* [JVM 的新实验性函数：递归复制或删除目录内容](#recursive-copying-or-deletion-of-directories)
* [改进的 kotlin-reflect 性能](#improved-kotlin-reflect-performance)
* [新的 -Xdebug 编译器选项，提供更好的调试体验](#a-new-compiler-option-for-disabling-optimizations)
* [`kotlin-stdlib-jdk7` 和 `kotlin-stdlib-jdk8` 合并到 `kotlin-stdlib`](#updated-jvm-compilation-target)
* [改进的 Objective-C/Swift 互操作性](#improved-objective-c-swift-interoperability)
* [与 Gradle 7.3 兼容](#gradle)

## IDE 支持

支持 1.8.0 的 Kotlin 插件可用于：

| IDE            | 支持的版本                         |
|----------------|------------------------------------|
| IntelliJ IDEA  | 2021.3、2022.1、2022.2             |
| Android Studio | Electric Eel (221)、Flamingo (222) |
:::note
你可以在 IntelliJ IDEA 2022.3 中将项目更新到 Kotlin 1.8.0，而无需更新 IDE 插件。

要在 IntelliJ IDEA 2022.3 中将现有项目迁移到 Kotlin 1.8.0，请将 Kotlin 版本更改为 `1.8.0` 并重新导入你的 Gradle 或 Maven 项目。

:::

## Kotlin/JVM

从 1.8.0 版本开始，编译器可以生成字节码版本与 JVM 19 对应的类。
新语言版本还包括：

* [用于关闭 JVM 注解目标生成的编译器选项](#ability-to-not-generate-type-use-and-type-parameter-annotation-targets)
* [用于禁用优化的新的 `-Xdebug` 编译器选项](#a-new-compiler-option-for-disabling-optimizations)
* [旧后端的移除](#removal-of-the-old-backend)
* [支持 Lombok 的 @Builder 注解](#support-for-lombok-s-builder-annotation)

### 不生成 TYPE_USE 和 TYPE_PARAMETER 注解目标的能力

如果 Kotlin 注解在其 Kotlin 目标中具有 `TYPE`，则该注解会映射到其 Java 注解目标列表中的 `java.lang.annotation.ElementType.TYPE_USE`。
这就像 `TYPE_PARAMETER` Kotlin 目标映射到 `java.lang.annotation.ElementType.TYPE_PARAMETER` Java 目标的方式一样。
对于 API 级别低于 26 的 Android 客户端来说，这是一个问题，因为它们的 API 中没有这些目标。

从 Kotlin 1.8.0 开始，你可以使用新的编译器选项 `-Xno-new-java-annotation-targets` 来避免生成 `TYPE_USE` 和 `TYPE_PARAMETER` 注解目标。

### 用于禁用优化的新的编译器选项

Kotlin 1.8.0 添加了一个新的 `-Xdebug` 编译器选项，该选项禁用优化以获得更好的调试体验。
目前，该选项禁用了协程的“已优化掉（was optimized out）”功能。将来，在我们添加更多优化后，此选项也将禁用它们。

“已优化掉”功能会在你使用 `suspend` 函数时优化变量。但是，调试具有优化变量的代码很困难，因为你看不到它们的值。

:::note
**切勿在生产环境中使用此选项**：通过 `-Xdebug` 禁用此功能可能会[导致内存泄漏](https://youtrack.jetbrains.com/issue/KT-48678/Coroutine-debugger-disable-was-optimised-out-compiler-feature#focus=Comments-27-6015585.0-0)。

### 旧后端的移除

在 Kotlin 1.5.0 中，我们[宣布](whatsnew15#stable-jvm-ir-backend)基于 IR 的后端已变为[稳定版](components-stability)。
这意味着来自 Kotlin 1.4.* 的旧后端已弃用。在 Kotlin 1.8.0 中，我们已完全删除旧后端。
通过扩展，我们删除了编译器选项 `-Xuse-old-backend` 和 Gradle `useOldBackend` 选项。

### 支持 Lombok 的 @Builder 注解

社区为 [Kotlin Lombok：支持生成的构建器 (@Builder)](https://youtrack.jetbrains.com/issue/KT-46959) YouTrack 问题添加了如此多的投票，以至于我们不得不支持 [@Builder annotation](https://projectlombok.org/features/Builder)。

我们还没有支持 `@SuperBuilder` 或 `@Tolerate` 注解的计划，但如果足够多的人为 [@SuperBuilder](https://youtrack.jetbrains.com/issue/KT-53563/Kotlin-Lombok-Support-SuperBuilder) 和 [@Tolerate](https://youtrack.jetbrains.com/issue/KT-53564/Kotlin-Lombok-Support-Tolerate) 问题投票，我们将重新考虑。

[了解如何配置 Lombok 编译器插件](lombok#gradle)。

## Kotlin/Native

Kotlin 1.8.0 包括对 Objective-C 和 Swift 互操作性的更改、对 Xcode 14.1 的支持以及对 CocoaPods Gradle 插件的改进：

* [支持 Xcode 14.1](#support-for-xcode-14-1)
* [改进的 Objective-C/Swift 互操作性](#improved-objective-c-swift-interoperability)
* [CocoaPods Gradle 插件中默认使用动态框架](#dynamic-frameworks-by-default-in-the-cocoapods-gradle-plugin)

### 支持 Xcode 14.1

Kotlin/Native 编译器现在支持最新的稳定 Xcode 版本 14.1。兼容性改进包括以下更改：

* 为 watchOS 目标提供了一个新的 `watchosDeviceArm64` 预设，它支持 ARM64 平台上的 Apple watchOS。
* 默认情况下，Kotlin CocoaPods Gradle 插件不再为 Apple 框架嵌入 bitcode。
* 平台库已更新，以反映 Apple 目标的 Objective-C 框架的更改。

### 改进的 Objective-C/Swift 互操作性

为了使 Kotlin 更易于与 Objective-C 和 Swift 互操作，添加了三个新注解：

* [`@ObjCName`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native/-obj-c-name/) 允许你在 Swift 或 Objective-C 中指定更符合语言习惯的名称，而不是重命名 Kotlin 声明。

  该注解指示 Kotlin 编译器为此类、属性、参数或函数使用自定义 Objective-C 和 Swift 名称：

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

* [`@HiddenFromObjC`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native/-hidden-from-obj-c/) 允许你从 Objective-C 隐藏 Kotlin 声明。

  该注解指示 Kotlin 编译器不要将函数或属性导出到 Objective-C，因此也不导出到 Swift。
  这可以使你的 Kotlin 代码更易于 Objective-C/Swift 使用。

* [`@ShouldRefineInSwift`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native/-should-refine-in-swift/) 对于用 Swift 编写的包装器替换 Kotlin 声明很有用。

  该注解指示 Kotlin 编译器在生成的 Objective-C API 中将函数或属性标记为 `swift_private`。此类声明带有 `__` 前缀，这使得它们对 Swift 代码不可见。

  你仍然可以在 Swift 代码中使用这些声明来创建 Swift 友好的 API，但例如，Xcode 的自动完成功能不会建议它们。

  有关在 Swift 中改进 Objective-C 声明的更多信息，请参阅 [Apple 官方文档](https://developer.apple.com/documentation/swift/improving-objective-c-api-declarations-for-swift)。

新的注解需要 [选择加入](opt-in-requirements)。

:::

Kotlin 团队非常感谢 [Rick Clephas](https://github.com/rickclephas) 实现了这些注解。

### CocoaPods Gradle 插件中默认使用动态框架

从 Kotlin 1.8.0 开始，由 CocoaPods Gradle 插件注册的 Kotlin 框架默认情况下是动态链接的。
以前的静态实现与 Kotlin Gradle 插件的行为不一致。

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

如果你有一个具有静态链接类型的现有项目，并且你升级到 Kotlin 1.8.0（或显式更改链接类型），你可能会遇到项目执行错误。
要解决此问题，请关闭你的 Xcode 项目并在 Podfile 目录中运行 `pod install`。

有关更多信息，请参阅 [CocoaPods Gradle 插件 DSL 参考](native-cocoapods-dsl-reference)。

## Kotlin Multiplatform：新的 Android 源码集布局

Kotlin 1.8.0 引入了一种新的 Android 源码集布局，该布局取代了以前的目录命名方案，该方案在多个方面令人困惑。

考虑一个在当前布局中创建的两个 `androidTest` 目录的示例。一个是用于 `KotlinSourceSets`，另一个是用于 `AndroidSourceSets`：

* 它们具有不同的语义：Kotlin 的 `androidTest` 属于 `unitTest` 类型，而 Android 的属于 `integrationTest` 类型。
* 它们创建一个令人困惑的 `SourceDirectories` 布局，因为 `src/androidTest/kotlin` 具有 `UnitTest`，而 `src/androidTest/java` 具有 `InstrumentedTest`。
* `KotlinSourceSets` 和 `AndroidSourceSets` 都对 Gradle 配置使用类似的命名方案，因此 Kotlin 和 Android 源码集的 `androidTest` 的结果配置是相同的：`androidTestImplementation`、`androidTestApi`、`androidTestRuntimeOnly` 和 `androidTestCompileOnly`。

为了解决这些和其他现有问题，我们引入了一种新的 Android 源码集布局。
以下是两种布局之间的一些主要区别：

#### KotlinSourceSet 命名方案

| 当前源码集布局                  | 新的源码集布局                   |
|------------------------------------|-------------------------------------|
| `targetName` + `AndroidSourceSet.name` | `targetName` + `AndroidVariantType` |

`{AndroidSourceSet.name}` 映射到 `{KotlinSourceSet.name}`，如下所示：

|             | 当前源码集布局 | 新的源码集布局          |
|-------------|---------------------------|--------------------------------|
| main        | androidMain               | androidMain                    |
| test        | androidTest               | android<b>Unit</b>Test         |
| androidTest | android<b>Android</b>Test | android<b>Instrumented</b>Test |

#### SourceDirectories

| 当前源码集布局                                | 新的源码集布局                                                    |
|----------------------------------------------------|---------------------------------------------------------------------------|
| 该布局添加了额外的 `/kotlin` SourceDirectories | `src/{AndroidSourceSet.name}/kotlin`, `src/{KotlinSourceSet.name}/kotlin` |

`{AndroidSourceSet.name}` 映射到 `{SourceDirectories included}`，如下所示：

|             | 当前源码集布局                                     | 新的源码集布局                                                                             |
|-------------|-----------------------------------------------------------|---------------------------------------------------------------------------------------------------|
| main        | src/androidMain/kotlin, src/main/kotlin, src/main/java    | src/androidMain/kotlin, src/main/kotlin, src/main/java                                            |
| test        | src/androidTest/kotlin, src/test/kotlin, src/test/java    | src/android<b>Unit</b>Test/kotlin, src/test/kotlin, src/test/java                               |
| androidTest | src/android<b>Android</b>Test/kotlin, src/androidTest/java | src/android<b>Instrumented</b>Test/kotlin, src/androidTest/java, <b>src/androidTest/kotlin</b> |

#### AndroidManifest.xml 文件的位置

| 当前源码集布局                               | 新的源码集布局                                  |
|-----------------------------------------------------|------------------------------------------------------|
| src/**Android**SourceSet.name/AndroidManifest.xml | src/**Kotlin**SourceSet.name/AndroidManifest.xml |

`{AndroidSourceSet.name}` 映射到 `{AndroidManifest.xml location}`，如下所示：

|       | 当前源码集布局            | 新的源码集布局                              |
|-------|--------------------------------|-------------------------------------------------|
| main  | src/main/AndroidManifest.xml   | src/<b>android</b>Main/AndroidManifest.xml   |
| debug | src/debug/AndroidManifest.xml  | src/<b>android</b>Debug/AndroidManifest.xml |

#### Android 和 common 测试之间的关系

新的 Android 源码集布局更改了 Android Instrumentation 测试（在新布局中重命名为 `androidInstrumentedTest`）和 common 测试之间的关系。

以前，`androidAndroidTest` 和 `commonTest` 之间存在默认的 `dependsOn` 关系。实际上，这意味着：

* `commonTest` 中的代码在 `androidAndroidTest` 中可用。
* `commonTest` 中的 `expect` 声明必须在 `androidAndroidTest` 中具有相应的 `actual` 实现。
* 在 `commonTest` 中声明的测试也作为 Android Instrumentation 测试运行。

在新的 Android 源码集布局中，默认情况下不添加 `dependsOn` 关系。如果你喜欢以前的行为，请在你的 `build.gradle.kts` 文件中手动声明此关系：

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

#### 对 Android flavors 的支持

以前，Kotlin Gradle 插件会急切地创建与具有 `debug` 和 `release` 构建类型或自定义 flavors（如 `demo` 和 `full`）的 Android 源码集相对应的源码集。
它使它们可以通过 `val androidDebug by getting { ... }` 之类的构造访问。

在新的 Android 源码集布局中，这些源码集是在 `afterEvaluate` 阶段创建的。这使得此类表达式无效，从而导致诸如 `org.gradle.api.UnknownDomainObjectException: KotlinSourceSet with name 'androidDebug' not found` 之类的错误。

要解决此问题，请在你的 `build.gradle.kts` 文件中使用新的 `invokeWhenCreated()` API：

```kotlin
kotlin {
    // ...
    sourceSets.invokeWhenCreated("androidFreeDebug") {
        // ...
    }
}
```

### 配置和设置

新布局将在未来的版本中成为默认布局。你现在可以使用以下 Gradle 选项启用它：

```none
kotlin.mpp.androidSourceSetLayoutVersion=2
```

:::note
新布局需要 Android Gradle 插件 7.0 或更高版本，并且在 Android Studio 2022.3 及更高版本中受支持。

:::

现在不鼓励使用以前的 Android 风格目录。Kotlin 1.8.0 标志着弃用周期的开始，为当前布局引入了一个警告。你可以使用以下 Gradle 属性来禁止显示警告：

```none
kotlin.mpp.androidSourceSetLayoutVersion1.nowarn=true
```

## Kotlin/JS

Kotlin 1.8.0 稳定了 JS IR 编译器后端，并为与 JavaScript 相关的 Gradle 构建脚本带来了新功能：
* [稳定的 JS IR 编译器后端](#stable-js-ir-compiler-backend)
* [用于报告 yarn.lock 已更新的新设置](#new-settings-for-reporting-that-yarn-lock-has-been-updated)
* [通过 Gradle 属性为浏览器添加测试目标](#add-test-targets-for-browsers-via-gradle-properties)
* [将 CSS 支持添加到你的项目的新方法](#new-approach-to-adding-css-support-to-your-project)

### 稳定的 JS IR 编译器后端

从该版本开始，[Kotlin/JS 中间表示 (IR-based) 编译器](js-ir-compiler) 后端是稳定的。统一所有三个后端的基础架构花费了一段时间，但它们现在使用相同的 IR 来处理 Kotlin 代码。

作为稳定 JS IR 编译器后端的后果，旧的后端从现在开始被弃用。

增量编译与稳定的 JS IR 编译器一起默认启用。

如果你仍然使用旧的编译器，请借助我们的 [迁移指南](js-ir-migration) 将你的项目切换到新的后端。

### 用于报告 yarn.lock 已更新的新设置

如果你使用 `yarn` 包管理器，则有三个新的特殊 Gradle 设置可以在 `yarn.lock` 文件已更新时通知你。当你想要在 CI 构建过程中静默更改 `yarn.lock` 时收到通知时，可以使用这些设置。

这三个新的 Gradle 属性是：

* `YarnLockMismatchReport`，它指定如何报告对 `yarn.lock` 文件的更改。你可以使用以下值之一：
    * `FAIL` 会使相应的 Gradle 任务失败。这是默认设置。
    * `WARNING` 将有关更改的信息写入警告日志。
    * `NONE` 禁用报告。
* `reportNewYarnLock`，它显式报告最近创建的 `yarn.lock` 文件。默认情况下，此选项处于禁用状态：在第一次启动时生成新的 `yarn.lock` 文件是一种常见的做法。你可以使用此选项来确保该文件已提交到你的存储库。
* `yarnLockAutoReplace`，它会在每次运行 Gradle 任务时自动替换 `yarn.lock`。

要使用这些选项，请按如下所示更新你的构建脚本文件 `build.gradle.kts`：

```kotlin
import org.jetbrains.kotlin.gradle.targets.js.yarn.YarnLockMismatchReport
import org.jetbrains.kotlin.gradle.targets.js.yarn.YarnRootExtension

rootProject.plugins.withType(org.jetbrains.kotlin.gradle.targets.js.yarn.YarnPlugin::class.java) \{
    rootProject.the<YarnRootExtension>().yarnLockMismatchReport =
        YarnLockMismatchReport.WARNING // NONE | FAIL
    rootProject.the<YarnRootExtension>().reportNewYarnLock = false // true
    rootProject.the<YarnRootExtension>().yarnLockAutoReplace = false // true
\}
```

### 通过 Gradle 属性为浏览器添加测试目标

从 Kotlin 1.8.0 开始，你可以直接在 Gradle 属性文件中为不同的浏览器设置测试目标。这样做会缩小构建脚本文件的大小，因为你不再需要在 `build.gradle.kts` 中编写所有目标。

你可以使用此属性为所有模块定义浏览器列表，然后在特定模块的构建脚本中添加特定浏览器。

例如，你的 Gradle 属性文件中的以下行将在 Firefox 和 Safari 中为所有模块运行测试：

```none
kotlin.js.browser.karma.browsers=firefox,safari
```

查看 [GitHub 上该属性的可用值的完整列表](https://github.com/JetBrains/kotlin/blob/master/libraries/tools/kotlin-gradle-plugin/src/common/kotlin/org/jetbrains/kotlin/gradle/targets/js/testing/karma/KotlinKarma.kt#L106)。

Kotlin 团队非常感谢 [Martynas Petuška](https://github.com/mpetuska) 实现了此功能。

### 将 CSS 支持添加到你的项目的新方法

此版本提供了一种将 CSS 支持添加到你的项目的新方法。我们假设这将影响许多项目，因此请不要忘记按照以下说明更新你的 Gradle 构建脚本文件。

在 Kotlin 1.8.0 之前，`cssSupport.enabled` 属性用于添加 CSS 支持：

```kotlin
browser {
    commonWebpackConfig {
        cssSupport.enabled = true
    }
}
```

现在你应当在 `cssSupport {}` 块中使用 `enabled.set()` 方法：

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

Kotlin 1.8.0 **完全**支持 Gradle 版本 7.2 和 7.3。你还可以使用高达最新 Gradle 版本的 Gradle 版本，但如果这样做，请记住你可能会遇到弃用警告或某些新的 Gradle 功能可能无法使用。

此版本带来了许多更改：
* [将 Kotlin 编译器选项公开为 Gradle 惰性属性](#exposing-kotlin-compiler-options-as-gradle-lazy-properties)
* [提高最低支持版本](#bumping-the-minimum-supported-versions)
* [禁用 Kotlin 守护程序回退策略的能力](#ability-to-disable-the-kotlin-daemon-fallback-strategy)
* [在传递依赖项中使用最新的 kotlin-stdlib 版本](#usage-of-the-latest-kotlin-stdlib-version-in-transitive-dependencies)
* [必须检查相关 Kotlin 和 Java 编译任务的 JVM 目标兼容性相等性](#obligatory-check-for-jvm-targets-of-related-kotlin-and-java-compile-tasks)
* [Kotlin Gradle 插件的传递依赖项的解析](#resolution-of-kotlin-gradle-plugins-transitive-dependencies)
* [弃用和移除](#deprecations-and-removals)

### 将 Kotlin 编译器选项公开为 Gradle 惰性属性

为了将可用的 Kotlin 编译器选项公开为 [Gradle 惰性属性](https://docs.gradle.org/current/userguide/lazy_configuration.html) 并将它们更好地集成到 Kotlin 任务中，我们做了很多更改：

* 编译任务具有新的 `compilerOptions` 输入，该输入类似于现有的 `kotlinOptions`，但使用来自 Gradle Properties API 的 [`Property`](https://docs.gradle.org/current/javadoc/org/gradle/api/provider/Property.html) 作为返回类型：

  ```kotlin
  tasks.named("compileKotlin", org.jetbrains.kotlin.gradle.tasks.KotlinJvmCompile::class.java) {
      compilerOptions {
          useK2.set(true)
      }
  }
  ```

* Kotlin 工具任务 `KotlinJsDce` 和 `KotlinNativeLink` 具有新的 `toolOptions` 输入，该输入类似于现有的 `kotlinOptions` 输入。
* 新输入具有 [`@Nested` Gradle 注解](https://docs.gradle.org/current/javadoc/org/gradle/api/tasks/Nested.html)。输入中的每个属性都有一个相关的 Gradle 注解，例如 [`@Input` 或 `@Internal`](https://docs.gradle.org/current/userguide/more_about_tasks.html#sec:up_to_date_checks)。
* Kotlin Gradle 插件 API 工件有两个新接口：
    * `org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask`，它具有 `compilerOptions` 输入和 `compileOptions()` 方法。所有 Kotlin 编译任务都实现此接口。
    * `org.jetbrains.kotlin.gradle.tasks.KotlinToolTask`，它具有 `toolOptions` 输入和 `toolOptions()` 方法。所有 Kotlin 工具任务（`KotlinJsDce`、`KotlinNativeLink` 和 `KotlinNativeLinkArtifactTask`）都实现此接口。
* 一些 `compilerOptions` 使用新类型而不是 `String` 类型：
    * [`JvmTarget`](https://github.com/JetBrains/kotlin/blob/1.8.0/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/JvmTarget.kt)
    * [`KotlinVersion`](https://github.com/JetBrains/kotlin/blob/1.8.0/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/KotlinVersion.kt)（对于 `apiVersion` 和 `languageVersion` 输入）
    * [`JsMainFunctionExecutionMode`](https://github.com/JetBrains/kotlin/blob/1.8.0/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/JsMainFunctionExecutionMode.kt)
    * [`JsModuleKind`](https://github.com/JetBrains/kotlin/blob/1.8.0/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/JsModuleKind.kt)
    * [`JsSourceMapEmbedMode`](https://github.com/JetBrains/kotlin/blob/1.8.0/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/JsSourceMapEmbedMode.kt)

  例如，你可以使用 `compilerOptions.jvmTarget.set(JvmTarget.JVM_11)` 代替 `kotlinOptions.jvmTarget = "11"`。

  `kotlinOptions` 类型没有更改，并且它们在内部转换为 `compilerOptions` 类型。
* Kotlin Gradle 插件 API 与以前的版本是二进制兼容的。但是，`kotlin-gradle-plugin` 工件中存在一些源和 ABI 破坏性更改。这些更改中的大多数涉及向某些内部类型添加额外的泛型参数。一个重要的更改是 `KotlinNativeLink` 任务不再继承 `AbstractKotlinNativeCompile` 任务。
* `KotlinJsCompilerOptions.outputFile` 和相关的 `KotlinJsOptions.outputFile` 选项已弃用。请改用 `Kotlin2JsCompile.outputFileProperty` 任务输入。

:::note
Kotlin Gradle 插件仍然将 `KotlinJvmOptions` DSL 添加到 Android 扩展：

```kotlin
android { 
    kotlinOptions {
        jvmTarget = "11"
    }
}
```

当 `compilerOptions` DSL 将添加到模块级别时，这将在 [此问题](https://youtrack.jetbrains.com/issue/KT-15370/Gradle-DSL-add-module-level-kotlin-options) 的范围内进行更改。

:::

#### 限制

:::note
`kotlinOptions` 任务输入和 `kotlinOptions{...}` 任务 DSL 处于支持模式，将在即将发布的版本中弃用。改进将仅针对 `compilerOptions` 和 `toolOptions` 进行。

在 `kotlinOptions` 上调用任何 setter 或 getter 都会委托给 `compilerOptions` 中的相关属性。
这引入了以下限制：
* 无法在任务执行阶段更改 `compilerOptions` 和 `kotlinOptions`（请参阅下面段落中的一个例外）。
* `freeCompilerArgs` 返回一个不可变的 `List<String>`，这意味着，例如，`kotlinOptions.freeCompilerArgs.remove("something")` 将失败。

包括 `kotlin-dsl` 和启用了 [Jetpack Compose](https://developer.android.com/jetpack/compose) 的 Android Gradle 插件 (AGP) 在内的多个插件尝试在任务执行阶段修改 `freeCompilerArgs` 属性。
我们在 Kotlin 1.8.0 中为此添加了一个解决方法。此解决方法允许任何构建脚本或插件在执行阶段修改 `kotlinOptions.freeCompilerArgs`，但在构建日志中产生警告。
要禁用此警告，请使用新的 Gradle 属性 `kotlin.options.suppressFreeCompilerArgsModificationWarning=true`。
Gradle 将为 [`kotlin-dsl` plugin](https://github.com/gradle/gradle/issues/22091) 和 [启用了 Jetpack Compose 的 AGP](https://issuetracker.google.com/u/1/issues/247544167) 添加修复程序。

### 提高最低支持版本

从 Kotlin 1.8.0 开始，最低支持的 Gradle 版本是 6.8.3，最低支持的 Android Gradle 插件版本是 4.1.3。

请参阅我们的文档中 [Kotlin Gradle 插件与可用 Gradle 版本的兼容性](gradle-configure-project#apply-the-plugin)

### 禁用 Kotlin 守护程序回退策略的能力

有一个新的 Gradle 属性 `kotlin.daemon.useFallbackStrategy`，其默认值为 `true`。当值为 `false` 时，构建会在守护程序启动或通信出现问题时失败。Kotlin 编译任务中还有一个新的 `useDaemonFallbackStrategy` 属性，如果你同时使用两者，则该属性优先于 Gradle 属性。如果内存不足以运行编译，你可以在日志中看到有关它的消息。

Kotlin 编译器的回退策略是在守护程序以某种方式失败时在 Kotlin 守护程序之外运行编译。如果 Gradle 守护程序已打开，则编译器使用“进程内（In process）”策略。如果 Gradle 守护程序已关闭，则编译器使用“进程外（Out of process）”策略。在文档中了解有关这些 [执行策略的更多信息](gradle-compilation-and-caches#defining-kotlin-compiler-execution-strategy)。请注意，静默回退到另一个策略可能会消耗大量系统资源或导致不确定的构建；有关更多详细信息，请参阅此 [YouTrack 问题](https://youtrack.jetbrains.com/issue/KT-48843/Add-ability-to-disable-Kotlin-daemon-fallback-strategy)。

### 在传递依赖项中使用最新的 kotlin-stdlib 版本

如果你在依赖项中显式写入 Kotlin 版本 1.8.0 或更高版本，例如：`implementation("org.jetbrains.kotlin:kotlin-stdlib:1.8.0")`，则 Kotlin Gradle 插件将使用该 Kotlin 版本来处理传递 `kotlin-stdlib-jdk7` 和 `kotlin-stdlib-jdk8` 依赖项。这样做是为了避免来自不同 stdlib 版本的类重复（了解有关 [将 `kotlin-stdlib-jdk7` 和 `kotlin-stdlib-jdk8` 合并到 `kotlin-stdlib`](#updated-jvm-compilation-target) 的更多信息）。你可以使用 `kotlin.stdlib.jdk.variants.version.alignment` Gradle 属性禁用此行为：

```none
kotlin.stdlib.jdk.variants.version.alignment=false
```

如果你遇到版本对齐问题，请通过在你的构建脚本中声明对 `kotlin-bom` 的平台依赖项，通过 Kotlin [BOM](https://docs.gradle.org/current/userguide/platforms.html#sub:bom_import) 对齐所有版本：

```kotlin
implementation(platform("org.jetbrains.kotlin:kotlin-bom:1.8.0"))
```

在 [文档](gradle-configure-project#other-ways-to-align-versions) 中了解有关其他情况以及我们建议的解决方案。

### 必须检查相关 Kotlin 和 Java 编译任务的 JVM 目标

本节适用于你的 JVM 项目，即使你的源文件仅在 Kotlin 中并且你不使用 Java。

:::

[从该版本开始](https://youtrack.jetbrains.com/issue/KT-54993/Raise-kotlin.jvm.target.validation.mode-check-default-level-to-error-when-build-is-running-on-Gradle-8)，[`kotlin.jvm.target.validation.mode` 属性](gradle-configure-project#check-for-jvm-target-compatibility-of-related-compile-tasks) 的默认值对于 Gradle 8.0+ 上的项目是 `error`（此版本的 Gradle 尚未发布），并且插件将在 JVM 目标不兼容的情况下使构建失败。

将默认值从 `warning` 更改为 `error` 是为平稳迁移到 Gradle 8.0 做的准备步骤。**我们鼓励你将此属性设置为 `error`** 并 [配置工具链](gradle-configure-project#gradle-java-toolchains-support) 或手动对齐 JVM 版本。

了解有关 [如果不检查目标的兼容性会发生什么情况的更多信息](gradle-configure-project#what-can-go-wrong-if-targets-are-incompatible)。

### Kotlin Gradle 插件的传递依赖项的解析

在 Kotlin 1.7.0 中，我们引入了 [对 Gradle 插件变体的支持](whatsnew17#support-for-gradle-plugin-variants)。由于这些插件变体，构建类路径可能具有不同版本的 [Kotlin Gradle 插件](https://plugins.gradle.org/u/kotlin)，这些插件依赖于某些依赖项（通常为 `kotlin-gradle-plugin-api`）的不同版本。这可能导致解析问题，我们想提出以下解决方法，以 `kotlin-dsl` 插件为例。

Gradle 7.6 中的 `kotlin-dsl` 插件依赖于 `org.jetbrains.kotlin.plugin.sam.with.receiver:1.7.10` 插件，该插件依赖于 `kotlin-gradle-plugin-api:1.7.10`。如果你添加 `org.jetbrains.kotlin.gradle.jvm:1.8.0` 插件，由于版本（`1.8.0` 和 `1.7.10`）和变体属性的 [`org.gradle.plugin.api-version`](https://docs.gradle.org/current/javadoc/org/gradle/api/attributes/plugin/GradlePluginApiVersion.html) 值不匹配，此 `kotlin-gradle-plugin-api:1.7.10` 传递依赖项可能会导致依赖项解析错误。作为解决方法，添加此 [约束](https://docs.gradle.org/current/userguide/dependency_constraints.html#sec:adding-constraints-transitive-deps) 以对齐版本。在我们实现 [Kotlin Gradle 插件库对齐平台](https://youtrack.jetbrains.com/issue/KT-54691/Kotlin-Gradle-Plugin-libraries-alignment-platform) 之前，可能需要此解决方法，该平台正在计划中：

```kotlin
dependencies {
    constraints {
        implementation("org.jetbrains.kotlin:kotlin-sam-with-receiver:1.8.0")
    }
}
```

此约束强制在构建类路径中使用 `org.jetbrains.kotlin:kotlin-sam-with-receiver:1.8.0` 版本来处理传递依赖项。在 [Gradle 问题跟踪器](https://github.com/gradle/gradle/issues/22510#issuecomment-1292259298) 中了解有关一个类似案例的更多信息。

### 弃用和移除

在 Kotlin 1.8.0 中，以下属性和方法的弃用周期继续：

* [在 Kotlin 1.7.0 的说明中](whatsnew17#changes-in-compile-tasks) 指出 `KotlinCompile` 任务仍然具有已弃用的 Kotlin 属性 `classpath`，该属性将在未来的版本中删除。现在，我们已将 `KotlinCompile` 任务的 `classpath` 属性的弃用级别更改为 `error`。所有编译任务都使用 `libraries` 输入来获取编译所需的库列表。
* 我们删除了 `kapt.use.worker.api` 属性，该属性允许通过 Gradle Workers API 运行 [kapt](kapt)。默认情况下，自 Kotlin 1.3.70 以来，[kapt 一直在使用 Gradle workers](kapt#run-kapt-tasks-in-parallel)，我们建议坚持使用此方法。
* 在 Kotlin 1.7.0 中，我们 [宣布了 `kotlin.compiler.execution.strategy` 属性的弃用周期的开始](whatsnew17#deprecation-of-the-kotlin-compiler-execution-strategy-system-property)。在此版本中，我们删除了此属性。了解如何在其他方式中 [定义 Kotlin 编译器执行策略](gradle-compilation-and-caches#defining-kotlin-compiler-execution-strategy)。

## 标准库

Kotlin 1.8.0：
* 更新 [JVM 编译目标](#updated-jvm-compilation-target)。
* 稳定了许多函数 – [Java 和 Kotlin 之间的 TimeUnit 转换](#timeunit-conversion-between-java-and-kotlin)、[`cbrt()`](#cbrt)、[Java `Optionals` 扩展函数](#java-optionals-extension-functions)。
* 提供了 [可比较和可减去的 TimeMarks 的预览](#comparable-and-subtractable-timemarks