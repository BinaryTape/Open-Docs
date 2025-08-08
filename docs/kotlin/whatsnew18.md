[//]: # (title: Kotlin 1.8.0 新特性)

_[发布日期：2022 年 12 月 28 日](releases.md#release-details)_

Kotlin 1.8.0 版本已发布，以下是其一些重要亮点：

* [JVM 新增实验性的函数：递归复制或删除目录内容](#recursive-copying-or-deletion-of-directories)
* [改进的 kotlin-reflect 性能](#improved-kotlin-reflect-performance)
* [新增 -Xdebug 编译器选项，以提供更好的调试体验](#a-new-compiler-option-for-disabling-optimizations)
* [`kotlin-stdlib-jdk7` 和 `kotlin-stdlib-jdk8` 合并到 `kotlin-stdlib` 中](#updated-jvm-compilation-target)
* [改进的 Objective-C/Swift 互操作性](#improved-objective-c-swift-interoperability)
* [兼容 Gradle 7.3](#gradle)

## IDE 支持

支持 Kotlin 1.8.0 的 Kotlin 插件适用于：

| IDE            | 支持版本                 |
|----------------|------------------------------------|
| IntelliJ IDEA  | 2021.3, 2022.1, 2022.2             |
| Android Studio | Electric Eel (221), Flamingo (222) |

> 你可以在 IntelliJ IDEA 2022.3 中将你的项目更新到 Kotlin 1.8.0，而无需更新 IDE 插件。
>
> 要在 IntelliJ IDEA 2022.3 中将现有项目迁移到 Kotlin 1.8.0，请将 Kotlin 版本更改为 `1.8.0`，然后重新导入你的 Gradle 或 Maven 项目。
>
{style="note"}

## Kotlin/JVM

从 1.8.0 版本开始，编译器可以生成字节码版本与 JVM 19 对应的类。新语言版本还包括：

* [一个用于关闭 JVM 注解目标生成的编译器选项](#ability-to-not-generate-type-use-and-type-parameter-annotation-targets)
* [一个新的 -Xdebug 编译器选项，用于禁用优化](#a-new-compiler-option-for-disabling-optimizations)
* [旧后端已移除](#removal-of-the-old-backend)
* [支持 Lombok 的 @Builder 注解](#support-for-lombok-s-builder-annotation)

### 禁止生成 TYPE_USE 和 TYPE_PARAMETER 注解目标的能力

如果一个 Kotlin 注解在其 Kotlin 目标中包含 `TYPE`，则该注解会映射到其 Java 注解目标列表中的 `java.lang.annotation.ElementType.TYPE_USE`。这就像 `TYPE_PARAMETER` Kotlin 目标映射到 `java.lang.annotation.ElementType.TYPE_PARAMETER` Java 目标一样。对于 API 级别低于 26 的 Android 客户端来说，这是一个问题，因为这些 API 中没有这些目标。

从 Kotlin 1.8.0 开始，你可以使用新的编译器选项 `-Xno-new-java-annotation-targets` 来避免生成 `TYPE_USE` 和 `TYPE_PARAMETER` 注解目标。

### 用于禁用优化的新编译器选项

Kotlin 1.8.0 新增了一个 `-Xdebug` 编译器选项，该选项会禁用优化，以提供更好的调试体验。目前，该选项禁用了协程的“已优化移除”特性。未来，当我们增加更多优化时，此选项也将禁用它们。

“已优化移除”特性会在你使用挂起函数时优化变量。但是，调试含有优化变量的代码很困难，因为你无法看到它们的值。

> **切勿在生产环境中使用此选项**：通过 `-Xdebug` 禁用此特性可能[导致内存泄漏](https://youtrack.jetbrains.com/issue/KT-48678/Coroutine-debugger-disable-was-optimised-out-compiler-feature#focus=Comments-27-6015585.0-0)。
>
{style="warning"}

### 旧后端已移除

在 Kotlin 1.5.0 中，我们[宣布](whatsnew15.md#stable-jvm-ir-backend)基于 IR 的后端已变得[稳定](components-stability.md)。这意味着 Kotlin 1.4.* 中的旧后端已弃用。在 Kotlin 1.8.0 中，我们已完全移除了旧后端。因此，我们也移除了编译器选项 `-Xuse-old-backend` 和 Gradle 选项 `useOldBackend`。

### 支持 Lombok 的 @Builder 注解

社区为 [Kotlin Lombok: 支持生成的构建器 (@Builder)](https://youtrack.jetbrains.com/issue/KT-46959) YouTrack 问题投了非常多的票，因此我们不得不支持 [@Builder 注解](https://projectlombok.org/features/Builder)。

我们目前还没有支持 `@SuperBuilder` 或 `@Tolerate` 注解的计划，但如果足够多的人为 [@SuperBuilder](https://youtrack.jetbrains.com/issue/KT-53563/Kotlin-Lombok-Support-SuperBuilder) 和 [@Tolerate](https://youtrack.jetbrains.com/issue/KT-53564/Kotlin-Lombok-Support-Tolerate) 问题投票，我们将会重新考虑。

[了解如何配置 Lombok 编译器插件](lombok.md#gradle)。

## Kotlin/Native

Kotlin 1.8.0 包含了 Objective-C 和 Swift 互操作性的变更、对 Xcode 14.1 的支持以及 CocoaPods Gradle 插件的改进：

* [支持 Xcode 14.1](#support-for-xcode-14-1)
* [改进的 Objective-C/Swift 互操作性](#improved-objective-c-swift-interoperability)
* [CocoaPods Gradle 插件中默认使用动态 framework](#dynamic-frameworks-by-default-in-the-cocoapods-gradle-plugin)

### 支持 Xcode 14.1

Kotlin/Native 编译器现在支持最新的稳定版 Xcode 14.1。兼容性改进包括以下变更：

* 新增了 `watchosDeviceArm64` 预设，用于支持 ARM64 平台上的 Apple watchOS 的 watchOS 目标。
* Kotlin CocoaPods Gradle 插件默认不再为 Apple frameworks 嵌入 bitcode。
* 平台库已更新，以反映 Apple 目标 Objective-C frameworks 的变更。

### 改进的 Objective-C/Swift 互操作性

为了让 Kotlin 与 Objective-C 和 Swift 更好地互操作，新增了三个注解：

* [`@ObjCName`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native/-obj-c-name/) 允许你在 Swift 或 Objective-C 中指定更符合习惯的名称，而不是重命名 Kotlin 声明。

  此注解指示 Kotlin 编译器为此类、属性、形参或函数使用自定义的 Objective-C 和 Swift 名称：

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

* [`@HiddenFromObjC`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native/-hidden-from-obj-c/) 允许你从 Objective-C 中隐藏 Kotlin 声明。

  此注解指示 Kotlin 编译器不要将函数或属性导出到 Objective-C，进而也不要导出到 Swift。这可以使你的 Kotlin 代码对 Objective-C/Swift 更友好。

* [`@ShouldRefineInSwift`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native/-should-refine-in-swift/) 对于用 Swift 编写的包装器替换 Kotlin 声明很有用。

  此注解指示 Kotlin 编译器在生成的 Objective-C API 中将函数或属性标记为 `swift_private`。此类声明会获得 `__` 前缀，这使得它们对 Swift 代码不可见。

  你仍然可以在 Swift 代码中使用这些声明来创建 Swift 友好的 API，但它们不会被 Xcode 的自动补全功能建议（例如）。

  有关在 Swift 中优化 Objective-C 声明的更多信息，请参阅 [Apple 官方文档](https://developer.apple.com/documentation/swift/improving-objective-c-api-declarations-for-swift)。

> 新注解需要[选择启用](opt-in-requirements.md)。
>
{style="note"}

Kotlin 团队非常感谢 [Rick Clephas](https://github.com/rickclephas) 实现了这些注解。

### CocoaPods Gradle 插件中默认使用动态 framework

从 Kotlin 1.8.0 开始，CocoaPods Gradle 插件注册的 Kotlin frameworks 默认动态链接。之前的静态实现与 Kotlin Gradle 插件的行为不一致。

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

如果你有一个使用静态链接类型的现有项目，并且你升级到 Kotlin 1.8.0（或显式更改链接类型），你可能会遇到项目执行错误。要解决此问题，请关闭你的 Xcode 项目并在 Podfile 目录中运行 `pod install`。

有关更多信息，请参阅 [CocoaPods Gradle 插件 DSL 参考](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-cocoapods-dsl-reference.html)。

## Kotlin 多平台：新的 Android 源代码集布局

Kotlin 1.8.0 引入了新的 Android 源代码集布局，它取代了之前目录的命名方案，之前的方案在多个方面都令人困惑。

考虑一个在当前布局中创建了两个 `androidTest` 目录的例子。一个是用于 `KotlinSourceSets`，另一个用于 `AndroidSourceSets`：

* 它们具有不同的语义：Kotlin 的 `androidTest` 属于 `unitTest` 类型，而 Android 的则属于 `integrationTest` 类型。
* 它们创建了一个令人困惑的 `SourceDirectories` 布局，因为 `src/androidTest/kotlin` 包含 `UnitTest` 而 `src/androidTest/java` 包含 `InstrumentedTest`。
* `KotlinSourceSets` 和 `AndroidSourceSets` 都使用相似的 Gradle 配置命名方案，因此 Kotlin 和 Android 源代码集的 `androidTest` 最终配置相同：`androidTestImplementation`、`androidTestApi`、`androidTestRuntimeOnly` 和 `androidTestCompileOnly`。

为了解决这些以及其他现有问题，我们引入了新的 Android 源代码集布局。以下是两种布局之间的一些主要区别：

#### KotlinSourceSet 命名方案

| 当前源代码集布局              | 新源代码集布局               |
|-------------------------------|-------------------------------------|
| `targetName` + `AndroidSourceSet.name` | `targetName` + `AndroidVariantType` |

`{AndroidSourceSet.name}` 映射到 `{KotlinSourceSet.name}` 如下：

|             | 当前源代码集布局 | 新源代码集布局          |
|-------------|---------------------------|--------------------------------|
| main        | androidMain               | androidMain                    |
| test        | androidTest               | android<b>Unit</b>Test         |
| androidTest | android<b>Android</b>Test | android<b>Instrumented</b>Test |

#### SourceDirectories

| 当前源代码集布局                               | 新源代码集布局                                                     |
|---------------------------------------------------------|---------------------------------------------------------------------------|
| 布局会添加额外的 `/kotlin` SourceDirectories  | `src/{AndroidSourceSet.name}/kotlin`, `src/{KotlinSourceSet.name}/kotlin` |

`{AndroidSourceSet.name}` 映射到 `{包含的 SourceDirectories}` 如下：

|             | 当前源代码集布局                                  | 新源代码集布局                                                                          |
|-------------|--------------------------------------------|------------------------------------------------------------------------------------------------|
| main        | src/androidMain/kotlin, src/main/kotlin, src/main/java     | src/androidMain/kotlin, src/main/kotlin, src/main/java                                         |
| test        | src/androidTest/kotlin, src/test/kotlin, src/test/java     | src/android<b>Unit</b>Test/kotlin, src/test/kotlin, src/test/java                              |
| androidTest | src/android<b>Android</b>Test/kotlin, src/androidTest/java | src/android<b>Instrumented</b>Test/kotlin, src/androidTest/java, <b>src/androidTest/kotlin</b> |

#### AndroidManifest.xml 文件的位置

| 当前源代码集布局                              | 新源代码集布局                                 |
|--------------------------------------------------------|-------------------------------------------------------|
| src/{<b>Android</b>SourceSet.name}/AndroidManifest.xml | src/{<b>Kotlin</b>SourceSet.name}/AndroidManifest.xml |

`{AndroidSourceSet.name}` 映射到 `{AndroidManifest.xml 位置}` 如下：

|       | 当前源代码集布局     | 新源代码集布局                       |
|-------|-------------------------------|---------------------------------------------|
| main  | src/main/AndroidManifest.xml  | src/<b>android</b>Main/AndroidManifest.xml  |
| debug | src/debug/AndroidManifest.xml | src/<b>android</b>Debug/AndroidManifest.xml |

#### Android 与公共测试之间的关系

新的 Android 源代码集布局改变了 Android 仪表化测试（在新布局中重命名为 `androidInstrumentedTest`）与公共测试之间的关系。

以前，`androidAndroidTest` 和 `commonTest` 之间存在默认的 `dependsOn` 关系。实际上，这意味着以下几点：

* `commonTest` 中的代码在 `androidAndroidTest` 中可用。
* `commonTest` 中的 `expect` 声明必须在 `androidAndroidTest` 中有对应的 `actual` 实现。
* 在 `commonTest` 中声明的测试也会作为 Android 仪表化测试运行。

在新的 Android 源代码集布局中，默认不添加 `dependsOn` 关系。如果你更喜欢之前的行为，请在你的 `build.gradle.kts` 文件中手动声明此关系：

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

#### 支持 Android flavor

以前，Kotlin Gradle 插件会急切地创建与带有 `debug` 和 `release` 构建类型或 `demo` 和 `full` 等自定义 flavor 的 Android 源代码集对应的源代码集。这使得它们可以通过诸如 `val androidDebug by getting { ... }` 这样的结构访问。

在新的 Android 源代码集布局中，这些源代码集是在 `afterEvaluate` 阶段创建的。这使得此类表达式无效，导致诸如 `org.gradle.api.UnknownDomainObjectException: KotlinSourceSet with name 'androidDebug' not found` 的错误。

为解决此问题，请在你的 `build.gradle.kts` 文件中使用新的 `invokeWhenCreated()` API：

```kotlin
kotlin {
    // ...
    sourceSets.invokeWhenCreated("androidFreeDebug") {
        // ...
    }
}
```

### 配置与设置

新布局将在未来的版本中成为默认设置。你现在可以通过以下 Gradle 选项启用它：

```none
kotlin.mpp.androidSourceSetLayoutVersion=2
```

> 新布局需要 Android Gradle plugin 7.0 或更高版本，并在 Android Studio 2022.3 及更高版本中受支持。
>
{style="note"}

现在不鼓励使用以前的 Android 风格目录。Kotlin 1.8.0 标志着弃用周期的开始，它为当前布局引入了一个警告。你可以通过以下 Gradle 属性抑制该警告：

```none
kotlin.mpp.androidSourceSetLayoutVersion1.nowarn=true
```

## Kotlin/JS

Kotlin 1.8.0 稳定了 JS IR 编译器后端，并为 JavaScript 相关的 Gradle 构建脚本带来了新特性：
* [稳定的 JS IR 编译器后端](#stable-js-ir-compiler-backend)
* [关于 yarn.lock 已更新的报告新设置](#new-settings-for-reporting-that-yarn-lock-has-been-updated)
* [通过 Gradle 属性添加浏览器的测试目标](#add-test-targets-for-browsers-via-gradle-properties)
* [为项目添加 CSS 支持的新方法](#new-approach-to-adding-css-support-to-your-project)

### 稳定的 JS IR 编译器后端

从本次发布开始，[Kotlin/JS 中间表示（基于 IR）编译器](js-ir-compiler.md)后端已稳定。统一所有三个后端的 infra 结构花了一段时间，但它们现在都使用相同的 IR 处理 Kotlin 代码。

由于 JS IR 编译器后端已稳定，旧的后端从现在起已弃用。

增量编译默认与稳定的 JS IR 编译器一同启用。

如果你仍在使用旧编译器，请借助我们的[迁移指南](js-ir-migration.md)将项目切换到新后端。

### 关于 yarn.lock 已更新的报告新设置

如果你使用 `yarn` 包管理器，有三个新的特殊 Gradle 设置可以在 `yarn.lock` 文件更新时通知你。当你希望在 CI 构建过程中 `yarn.lock` 被静默更改时收到通知，可以使用这些设置。

这三个新的 Gradle 属性是：

* `YarnLockMismatchReport`，它指定 `yarn.lock` 文件的更改如何报告。你可以使用以下值之一：
    * `FAIL` 会使相应的 Gradle 任务失败。这是默认值。
    * `WARNING` 会将更改信息写入警告日志。
    * `NONE` 禁用报告。
* `reportNewYarnLock`，它显式报告最近创建的 `yarn.lock` 文件。默认情况下，此选项是禁用的：在首次启动时生成新的 `yarn.lock` 文件是一种常见做法。你可以使用此选项来确保该文件已提交到你的版本库。
* `yarnLockAutoReplace`，它在每次运行 Gradle 任务时自动替换 `yarn.lock`。

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

### 通过 Gradle 属性添加浏览器的测试目标

从 Kotlin 1.8.0 开始，你可以直接在 Gradle 属性文件中为不同浏览器设置测试目标。这样做可以缩小构建脚本文件的大小，因为你不再需要在 `build.gradle.kts` 中编写所有目标。

你可以使用此属性为所有模块定义浏览器列表，然后在特定模块的构建脚本中添加特定浏览器。

例如，你的 Gradle 属性文件中的以下行将为所有模块在 Firefox 和 Safari 中运行测试：

```none
kotlin.js.browser.karma.browsers=firefox,safari
```

请参阅 [GitHub 上该属性可用值的完整列表](https://github.com/JetBrains/kotlin/blob/master/libraries/tools/kotlin-gradle-plugin/src/common/kotlin/org/jetbrains/kotlin/gradle/targets/js/testing/karma/KotlinKarma.kt#L106)。

Kotlin 团队非常感谢 [Martynas Petuška](https://github.com/mpetuska) 实现了此特性。

### 为项目添加 CSS 支持的新方法

本次发布提供了一种为项目添加 CSS 支持的新方法。我们认为这会影响许多项目，因此请务必按照以下说明更新你的 Gradle 构建脚本文件。

在 Kotlin 1.8.0 之前，使用 `cssSupport.enabled` 属性来添加 CSS 支持：

```kotlin
browser {
    commonWebpackConfig {
        cssSupport.enabled = true
    }
}
```

现在你应该在 `cssSupport {}` 代码块中使用 `enabled.set()` 方法：

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

Kotlin 1.8.0 **完全**支持 Gradle 7.2 和 7.3 版本。你也可以使用直到最新 Gradle 版本的 Gradle，但如果你这样做，请记住你可能会遇到弃用警告或某些新的 Gradle 特性可能无法正常工作。

此版本带来了许多变更：
* [将 Kotlin 编译器选项作为 Gradle 惰性属性公开](#exposing-kotlin-compiler-options-as-gradle-lazy-properties)
* [提升最低支持版本](#bumping-the-minimum-supported-versions)
* [禁用 Kotlin daemon 回退策略的能力](#ability-to-disable-the-kotlin-daemon-fallback-strategy)
* [在传递性依赖项中使用最新 kotlin-stdlib 版本](#usage-of-the-latest-kotlin-stdlib-version-in-transitive-dependencies)
* [强制检查相关 Kotlin 和 Java 编译任务的 JVM 目标兼容性](#obligatory-check-for-jvm-targets-of-related-kotlin-and-java-compile-tasks)
* [Kotlin Gradle 插件传递性依赖项的解析](#resolution-of-kotlin-gradle-plugins-transitive-dependencies)
* [弃用与移除](#deprecations-and-removals)

### 将 Kotlin 编译器选项作为 Gradle 惰性属性公开

为了将可用的 Kotlin 编译器选项作为 [Gradle 惰性属性](https://docs.gradle.org/current/userguide/lazy_configuration.html)公开，并更好地将其集成到 Kotlin 任务中，我们进行了许多变更：

* 编译任务新增了 `compilerOptions` 输入，它与现有的 `kotlinOptions` 类似，但使用 Gradle Properties API 中的 [`Property`](https://docs.gradle.org/current/javadoc/org/gradle/api/provider/Property.html) 作为返回类型：

  ```kotlin
  tasks.named("compileKotlin", org.jetbrains.kotlin.gradle.tasks.KotlinJvmCompile::class.java) {
      compilerOptions {
          useK2.set(true)
      }
  }
  ```

* Kotlin 工具任务 `KotlinJsDce` 和 `KotlinNativeLink` 新增了 `toolOptions` 输入，它与现有的 `kotlinOptions` 输入类似。
* 新输入具有 [`@Nested` Gradle 注解](https://docs.gradle.org/current/javadoc/org/gradle/api/tasks/Nested.html)。输入中的每个属性都具有相关的 Gradle 注解，例如 [`@Input` 或 `@Internal`](https://docs.gradle.org/current/userguide/more_about_tasks.html#sec:up_to_date_checks)。
* Kotlin Gradle 插件 API artifact 具有两个新接口：
    * `org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask`，它具有 `compilerOptions` 输入和 `compileOptions()` 方法。所有 Kotlin 编译任务都实现了此接口。
    * `org.jetbrains.kotlin.gradle.tasks.KotlinToolTask`，它具有 `toolOptions` 输入和 `toolOptions()` 方法。所有 Kotlin 工具任务 —— `KotlinJsDce`、`KotlinNativeLink` 和 `KotlinNativeLinkArtifactTask` —— 都实现了此接口。
* 一些 `compilerOptions` 使用新类型而非 `String` 类型：
    * [`JvmTarget`](https://github.com/JetBrains/kotlin/blob/1.8.0/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/JvmTarget.kt)
    * [`KotlinVersion`](https://github.com/JetBrains/kotlin/blob/1.8.0/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/KotlinVersion.kt) (用于 `apiVersion` 和 `languageVersion` 输入)
    * [`JsMainFunctionExecutionMode`](https://github.com/JetBrains/kotlin/blob/1.8.0/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/JsMainFunctionExecutionMode.kt)
    * [`JsModuleKind`](https://github.com/JetBrains/kotlin/blob/1.8.0/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/JsModuleKind.kt)
    * [`JsSourceMapEmbedMode`](https://github.com/JetBrains/kotlin/blob/1.8.0/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/JsSourceMapEmbedMode.kt)

  例如，你可以使用 `compilerOptions.jvmTarget.set(JvmTarget.JVM_11)` 而不是 `kotlinOptions.jvmTarget = "11"`。

  `kotlinOptions` 类型没有改变，它们在内部转换为 `compilerOptions` 类型。
* Kotlin Gradle 插件 API 与之前的版本二进制兼容。然而，`kotlin-gradle-plugin` artifact 中存在一些源代码和 ABI 不兼容的变更。这些变更大多涉及某些内部类型的额外泛型形参。一个重要的变更是 `KotlinNativeLink` 任务不再继承 `AbstractKotlinNativeCompile` 任务。
* `KotlinJsCompilerOptions.outputFile` 和相关的 `KotlinJsOptions.outputFile` 选项已弃用。请改用 `Kotlin2JsCompile.outputFileProperty` 任务输入。

> Kotlin Gradle 插件仍然将 `KotlinJvmOptions` DSL 添加到 Android 扩展中：
>
> ```kotlin
> android { 
>     kotlinOptions {
>         jvmTarget = "11"
>     }
> }
> ```
>
> 这将在 [此问题](https://youtrack.jetbrains.com/issue/KT-15370/Gradle-DSL-add-module-level-kotlin-options) 的范围内进行更改，届时 `compilerOptions` DSL 将添加到模块级别。
>
{style="note"}

#### 限制

> `kotlinOptions` 任务输入和 `kotlinOptions{...}` 任务 DSL 处于支持模式，并将在未来的版本中弃用。改进将仅针对 `compilerOptions` 和 `toolOptions` 进行。
>
{style="warning"}

在 `kotlinOptions` 上调用任何 setter 或 getter 都会委托给 `compilerOptions` 中的相关属性。这引入了以下限制：
* `compilerOptions` 和 `kotlinOptions` 不能在任务执行阶段更改（请参阅下段中的一个例外）。
* `freeCompilerArgs` 返回一个不可变的 `List<String>`，这意味着，例如，`kotlinOptions.freeCompilerArgs.remove("something")` 将会失败。

包括 `kotlin-dsl` 和启用了 [Jetpack Compose](https://developer.android.com/jetpack/compose) 的 Android Gradle 插件 (AGP) 在内的几个插件，试图在任务执行阶段修改 `freeCompilerArgs` 属性。我们在 Kotlin 1.8.0 中为它们添加了一个解决方案。此解决方案允许任何构建脚本或插件在执行阶段修改 `kotlinOptions.freeCompilerArgs`，但会在构建日志中产生一个警告。要禁用此警告，请使用新的 Gradle 属性 `kotlin.options.suppressFreeCompilerArgsModificationWarning=true`。Gradle 将为 [`kotlin-dsl` 插件](https://github.com/gradle/gradle/issues/22091) 和[启用了 Jetpack Compose 的 AGP](https://issuetracker.google.com/u/1/issues/247544167) 添加修复。

### 提升最低支持版本

从 Kotlin 1.8.0 开始，最低支持的 Gradle 版本是 6.8.3，最低支持的 Android Gradle 插件版本是 4.1.3。

请参阅[我们文档中 Kotlin Gradle 插件与可用 Gradle 版本的兼容性](gradle-configure-project.md#apply-the-plugin)。

### 禁用 Kotlin daemon 回退策略的能力

新增了一个 Gradle 属性 `kotlin.daemon.useFallbackStrategy`，其默认值为 `true`。当值为 `false` 时，构建会在 daemon 启动或通信出现问题时失败。Kotlin 编译任务中还有一个新的 `useDaemonFallbackStrategy` 属性，如果你同时使用这两个属性，它将优先于 Gradle 属性。如果内存不足以运行编译，你可以在日志中看到相关消息。

如果 daemon 出现故障，Kotlin 编译器的回退策略是在 Kotlin daemon 之外运行编译。如果 Gradle daemon 处于开启状态，编译器将使用“进程内”策略。如果 Gradle daemon 处于关闭状态，编译器将使用“进程外”策略。请在[文档](gradle-compilation-and-caches.md#defining-kotlin-compiler-execution-strategy)中了解更多关于这些执行策略的信息。请注意，静默回退到另一种策略可能会消耗大量系统资源或导致非确定性构建；请参阅此 [YouTrack issue](https://youtrack.jetbrains.com/issue/KT-48843/Add-ability-to-disable-Kotlin-daemon-fallback-strategy) 了解更多详细信息。

### 在传递性依赖项中使用最新 kotlin-stdlib 版本

如果你在依赖项中显式地写入 Kotlin 1.8.0 或更高版本，例如：`implementation("org.jetbrains.kotlin:kotlin-stdlib:1.8.0")`，那么 Kotlin Gradle 插件将为传递性 `kotlin-stdlib-jdk7` 和 `kotlin-stdlib-jdk8` 依赖项使用该 Kotlin 版本。这样做是为了避免来自不同 stdlib 版本的类重复（了解更多关于将 `kotlin-stdlib-jdk7` 和 `kotlin-stdlib-jdk8` [合并到 `kotlin-stdlib`](#updated-jvm-compilation-target) 的信息）。你可以通过 `kotlin.stdlib.jdk.variants.version.alignment` Gradle 属性禁用此行为：

```none
kotlin.stdlib.jdk.variants.version.alignment=false
```

如果版本对齐出现问题，可以通过在构建脚本中声明对 `kotlin-bom` 的平台依赖项，从而通过 Kotlin [BOM](https://docs.gradle.org/current/userguide/platforms.html#sub:bom_import) 对齐所有版本：

```kotlin
implementation(platform("org.jetbrains.kotlin:kotlin-bom:1.8.0"))
```

在[文档](gradle-configure-project.md#other-ways-to-align-versions)中了解其他情况和我们建议的解决方案。

### 强制检查相关 Kotlin 和 Java 编译任务的 JVM 目标兼容性

> 即使你的源文件仅为 Kotlin 且不使用 Java，本节也适用于你的 JVM 项目。
>
{style="note"}

[从本次发布开始](https://youtrack.jetbrains.com/issue/KT-54993/Raise-kotlin.jvm.target.validation.mode-check-default-level-to-error-when-build-is-running-on-Gradle-8)，对于 Gradle 8.0+（此版本 Gradle 尚未发布）上的项目，[`kotlin.jvm.target.validation.mode` 属性](gradle-configure-project.md#check-for-jvm-target-compatibility-of-related-compile-tasks)的默认值为 `error`，并且在 JVM 目标不兼容的情况下，插件将使构建失败。

将默认值从 `warning` 更改为 `error` 是平滑迁移到 Gradle 8.0 的准备步骤。**我们鼓励你将此属性设置为 `error`** 并[配置工具链](gradle-configure-project.md#gradle-java-toolchains-support)或手动对齐 JVM 版本。

了解更多关于[如果不检查目标兼容性可能出现的问题](gradle-configure-project.md#what-can-go-wrong-if-targets-are-incompatible)。

### Kotlin Gradle 插件传递性依赖项的解析

在 Kotlin 1.7.0 中，我们引入了[对 Gradle 插件变体的支持](whatsnew17.md#support-for-gradle-plugin-variants)。由于这些插件变体，构建 classpath 可能包含不同版本的 [Kotlin Gradle 插件](https://plugins.gradle.org/u/kotlin)，它们依赖于某个依赖项的不同版本，通常是 `kotlin-gradle-plugin-api`。这可能导致解析问题，我们希望提出以下解决方案，以 `kotlin-dsl` 插件为例。

Gradle 7.6 中的 `kotlin-dsl` 插件依赖于 `org.jetbrains.kotlin.plugin.sam.with.receiver:1.7.10` 插件，而后者依赖于 `kotlin-gradle-plugin-api:1.7.10`。如果你添加 `org.jetbrains.kotlin.gradle.jvm:1.8.0` 插件，这个 `kotlin-gradle-plugin-api:1.7.10` 传递性依赖项可能会因为版本（`1.8.0` 和 `1.7.10`）与变体属性的 [`org.gradle.plugin.api-version`](https://docs.gradle.org/current/javadoc/org/gradle/api/attributes/plugin/GradlePluginApiVersion.html) 值不匹配而导致依赖项解析错误。作为解决方案，添加此[约束](https://docs.gradle.org/current/userguide/dependency_constraints.html#sec:adding-constraints-transitive-deps)以对齐版本。此解决方案可能在实现 [Kotlin Gradle 插件库对齐平台](https://youtrack.jetbrains.com/issue/KT-54691/Kotlin-Gradle-Plugin-libraries-alignment-platform) 之前都是必要的，该平台正在计划中：

```kotlin
dependencies {
    constraints {
        implementation("org.jetbrains.kotlin:kotlin-sam-with-receiver:1.8.0")
    }
}
```

此约束强制 `org.jetbrains.kotlin:kotlin-sam-with-receiver:1.8.0` 版本用于构建 classpath 中的传递性依赖项。在 [Gradle issue tracker](https://github.com/gradle/gradle/issues/22510#issuecomment-1292259298) 中了解一个类似的[情况](https://github.com/gradle/gradle/issues/22510#issuecomment-1292259298)。

### 弃用与移除

在 Kotlin 1.8.0 中，以下属性和方法的弃用周期仍在继续：

* [Kotlin 1.7.0 的更新说明](whatsnew17.md#changes-in-compile-tasks)中提到 `KotlinCompile` 任务仍然包含已弃用的 Kotlin 属性 `classpath`，该属性将在未来的版本中移除。现在，我们已将 `KotlinCompile` 任务的 `classpath` 属性的弃用级别更改为 `error`。所有编译任务都使用 `libraries` 输入来获取编译所需的库列表。
* 我们移除了 `kapt.use.worker.api` 属性，该属性允许通过 Gradle Workers API 运行 [kapt](kapt.md)。默认情况下，[kapt 从 Kotlin 1.3.70 开始一直使用 Gradle workers](kapt.md#run-kapt-tasks-in-parallel)，我们建议坚持使用此方法。
* 在 Kotlin 1.7.0 中，我们[宣布启动 `kotlin.compiler.execution.strategy` 属性的弃用周期](whatsnew17.md#deprecation-of-the-kotlin-compiler-execution-strategy-system-property)。在此版本中，我们移除了此属性。了解如何以其他方式[定义 Kotlin 编译器执行策略](gradle-compilation-and-caches.md#defining-kotlin-compiler-execution-strategy)。

## 标准库

Kotlin 1.8.0：
* 更新 [JVM 编译目标](#updated-jvm-compilation-target)。
* 稳定了许多函数 —— [Java 和 Kotlin 之间的 TimeUnit 转换](#timeunit-conversion-between-java-and-kotlin)、[`cbrt()`](#cbrt)、[Java `Optionals` 扩展函数](#java-optionals-extension-functions)。
* 提供了[可比较和可减的 `TimeMarks` 预览](#comparable-and-subtractable-timemarks)。
* 包含了 [`java.nio.file.path` 的实验性扩展函数](#recursive-copying-or-deletion-of-directories)。
* 展示了[改进的 kotlin-reflect 性能](#improved-kotlin-reflect-performance)。

### 更新的 JVM 编译目标

在 Kotlin 1.8.0 中，标准库（`kotlin-stdlib`、`kotlin-reflect` 和 `kotlin-script-*`）使用 JVM 目标 1.8 进行编译。以前，标准库使用 JVM 目标 1.6 进行编译。

Kotlin 1.8.0 不再支持 JVM 目标 1.6 和 1.7。因此，你不再需要在构建脚本中单独声明 `kotlin-stdlib-jdk7` 和 `kotlin-stdlib-jdk8`，因为这些 artifacts 的内容已合并到 `kotlin-stdlib` 中。

> 如果你在构建脚本中显式声明了 `kotlin-stdlib-jdk7` 和 `kotlin-stdlib-jdk8` 作为依赖项，那么你应该用 `kotlin-stdlib` 替换它们。
>
{style="note"}

请注意，混合不同版本的 stdlib artifacts 可能会导致类重复或类缺失。为避免这种情况，Kotlin Gradle 插件可以帮助你[对齐 stdlib 版本](#usage-of-the-latest-kotlin-stdlib-version-in-transitive-dependencies)。

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

### Java 和 Kotlin 之间的 TimeUnit 转换

`kotlin.time` 中的 `toTimeUnit()` 和 `toDurationUnit()` 函数现在已稳定。这些函数在 Kotlin 1.6.0 中作为实验性引入，它们改进了 Kotlin 和 Java 之间的互操作性。你现在可以轻松地在 Java `java.util.concurrent.TimeUnit` 和 Kotlin `kotlin.time.DurationUnit` 之间进行转换。这些函数仅在 JVM 上受支持。

```kotlin
import kotlin.time.*

// 供 Java 使用
fun wait(timeout: Long, unit: TimeUnit) {
    val duration: Duration = timeout.toDuration(unit.toDurationUnit())
    ...
}
```

### 可比较和可减的 TimeMarks

> `TimeMarks` 的新功能是[实验性的](components-stability.md#stability-levels-explained)，要使用它，你需要通过使用 `@OptIn(ExperimentalTime::class)` 或 `@ExperimentalTime` 来选择启用。
>
{style="warning"}

在 Kotlin 1.8.0 之前，如果你想计算多个 `TimeMarks` 和**当前时刻**之间的时间差，你只能一次在一个 `TimeMark` 上调用 `elapsedNow()`。这使得比较结果变得困难，因为两次 `elapsedNow()` 函数调用无法在完全相同的时间执行。

为了解决这个问题，在 Kotlin 1.8.0 中，你可以从相同的时间源中减去和比较 `TimeMarks`。现在你可以创建一个新的 `TimeMark` 实例来表示**当前时刻**，并从中减去其他 `TimeMarks`。这样，你从这些计算中收集到的结果保证是相互关联的。

```kotlin
import kotlin.time.*
fun main() {
//sampleStart
    val timeSource = TimeSource.Monotonic
    val mark1 = timeSource.markNow()
    Thread.sleep(500) // 暂停 0.5 秒
    val mark2 = timeSource.markNow()

    // 1.8.0 之前
    repeat(4) { n ->
        val elapsed1 = mark1.elapsedNow()
        val elapsed2 = mark2.elapsedNow()

        // elapsed1 和 elapsed2 之间的差异可能会有所不同
        // 这取决于两次 elapsedNow() 调用之间的时间流逝
        println("Measurement 1.${n + 1}: elapsed1=$elapsed1, " +
                "elapsed2=$elapsed2, diff=${elapsed1 - elapsed2}")
    }
    println()

    // 1.8.0 之后
    repeat(4) { n ->
        val mark3 = timeSource.markNow()
        val elapsed1 = mark3 - mark1
        val elapsed2 = mark3 - mark2

        // 现在，经过的时间是相对于 mark3 计算的，
        // mark3 是一个固定值
        println("Measurement 2.${n + 1}: elapsed1=$elapsed1, " +
                "elapsed2=$elapsed2, diff=${elapsed1 - elapsed2}")
    }
    // 也可以相互比较时间标记
    // 这是正确的，因为 mark2 比 mark1 更晚捕获
    println(mark2 > mark1)
//sampleEnd
}

```
{kotlin-runnable="true" kotlin-min-compiler-version="1.8"}

这项新功能在动画计算中特别有用，你可以在其中计算或比较代表不同帧的多个 `TimeMarks` 之间的时间差。

### 递归复制或删除目录

> 这些 `java.nio.file.path` 的新函数是[实验性的](components-stability.md#stability-levels-explained)。要使用它们，你需要通过 `@OptIn(kotlin.io.path.ExperimentalPathApi::class)` 或 `@kotlin.io.path.ExperimentalPathApi` 来选择启用。或者，你可以使用编译器选项 `-opt-in=kotlin.io.path.ExperimentalPathApi`。
>
{style="warning"}

我们为 `java.nio.file.Path` 引入了两个新的扩展函数：`copyToRecursively()` 和 `deleteRecursively()`，它们允许你递归地：

* 将目录及其内容复制到另一个目标位置。
* 删除目录及其内容。

这些函数作为备份过程的一部分可能非常有用。

#### 错误处理

使用 `copyToRecursively()`，你可以通过重载 `onError` lambda 表达式来定义在复制时发生异常应如何处理：

```kotlin
sourceRoot.copyToRecursively(destinationRoot, followLinks = false,
    onError = { source, target, exception ->
        logger.logError(exception, "从 $source 复制到 $target 失败")
        OnErrorResult.TERMINATE
    })
```
{validate="false"}

当你使用 `deleteRecursively()` 时，如果在删除文件或文件夹时发生异常，则会跳过该文件或文件夹。一旦删除完成，`deleteRecursively()` 会抛出 `IOException`，其中包含所有作为抑制异常发生的异常。

#### 文件覆盖

如果 `copyToRecursively()` 发现目标目录中已存在文件，则会发生异常。如果你想覆盖文件，请使用带有 `overwrite` 形参的重载，并将其设置为 `true`：

```kotlin
fun setUpEnvironment(projectDirectory: Path, fixtureName: String) {
    fixturesRoot.resolve(COMMON_FIXTURE_NAME)
        .copyToRecursively(projectDirectory, followLinks = false)
    fixturesRoot.resolve(fixtureName)
        .copyToRecursively(projectDirectory, followLinks = false,
            overwrite = true) // 修补公共 fixture
}
```
{validate="false"}

#### 自定义复制操作

要定义你自己的自定义复制逻辑，请使用带有 `copyAction` 作为附加形参的重载。通过使用 `copyAction`，你可以提供一个 lambda 表达式，例如，包含你偏好的操作：

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

在 [Kotlin 1.7.0 中引入](whatsnew17.md#new-experimental-extension-functions-for-java-optionals)的扩展函数现在已稳定。这些函数简化了在 Java 中使用 Optional 类的工作。它们可用于解包和转换 JVM 上的 `Optional` 对象，并使 Java API 的使用更加简洁。有关更多信息，请参阅 [Kotlin 1.7.0 新特性](whatsnew17.md#new-experimental-extension-functions-for-java-optionals)。

### 改进的 kotlin-reflect 性能

利用 `kotlin-reflect` 现在使用 JVM 目标 1.8 编译这一事实，我们将内部缓存机制迁移到 Java 的 `ClassValue`。以前我们只缓存 `KClass`，但现在我们也缓存 `KType` 和 `KDeclarationContainer`。这些变更显著提高了调用 `typeOf()` 时的性能。

## 文档更新

Kotlin 文档收到了一些显著的变更：

### 改版和新页面

* [Gradle 概览](gradle.md) —— 了解如何使用 Gradle 构建系统配置和构建 Kotlin 项目，以及 Kotlin Gradle 插件中可用的编译器选项、编译和缓存。
* [Java 和 Kotlin 中的可空性](java-to-kotlin-nullability-guide.md) —— 了解 Java 和 Kotlin 在处理可能可空变量方面的不同方法。
* [Lincheck 指南](lincheck-guide.md) —— 了解如何设置和使用 Lincheck 框架来测试 JVM 上的并发算法。

### 新增与更新的教程

* [Gradle 和 Kotlin/JVM 入门](get-started-with-jvm-gradle-project.md) —— 使用 IntelliJ IDEA 和 Gradle 创建控制台应用程序。
* [使用 Ktor 和 SQLDelight 创建多平台应用](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-ktor-sqldelight.html) —— 使用 Kotlin Multiplatform Mobile 为 iOS 和 Android 创建移动应用程序。
* [Kotlin 多平台入门](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-create-first-app.html) —— 了解使用 Kotlin 进行跨平台移动开发，并创建一个同时适用于 Android 和 iOS 的应用。

## 安装 Kotlin 1.8.0

[IntelliJ IDEA](https://www.jetbrains.com/idea/download/) 2021.3、2022.1 和 2022.2 会自动建议将 Kotlin 插件更新到 1.8.0 版本。IntelliJ IDEA 2022.3 将在即将发布的次要更新中捆绑 1.8.0 版本的 Kotlin 插件。

> 要在 IntelliJ IDEA 2022.3 中将现有项目迁移到 Kotlin 1.8.0，请将 Kotlin 版本更改为 `1.8.0`，然后重新导入你的 Gradle 或 Maven 项目。
>
{style="note"}

对于 Android Studio Electric Eel (221) 和 Flamingo (222)，1.8.0 版本的 Kotlin 插件将随即将发布的 Android Studio 更新一同提供。新的命令行编译器可在 [GitHub 发布页面](https://github.com/JetBrains/kotlin/releases/tag/v1.8.0) 下载。

## Kotlin 1.8.0 兼容性指南

Kotlin 1.8.0 是一个[特性版本](kotlin-evolution-principles.md#language-and-tooling-releases)，因此可能会带来与你为早期语言版本编写的代码不兼容的变更。在 [Kotlin 1.8.0 兼容性指南](compatibility-guide-18.md) 中找到这些变更的详细列表。