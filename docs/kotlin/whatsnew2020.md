---
title: "Kotlin 2.0.20 中的新增功能"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

_[发布时间：2024 年 8 月 22 日](releases#release-details)_

Kotlin 2.0.20 版本已发布！此版本包含针对 Kotlin 2.0.0 的性能改进和错误修复，我们在该版本中宣布 Kotlin K2 编译器为稳定版。以下是此版本的一些其他亮点：

* [数据类 copy 函数将具有与构造函数相同的可见性](#data-class-copy-function-to-have-the-same-visibility-as-constructor)
* [现在可以在多平台项目中从默认目标层级结构访问源集的静态访问器](#static-accessors-for-source-sets-from-the-default-target-hierarchy)
* [Kotlin/Native 的垃圾回收器中已实现并发标记](#concurrent-marking-in-garbage-collector)
* [Kotlin/Wasm 中的 `@ExperimentalWasmDsl` 注解有了新的位置](#new-location-of-experimentalwasmdsl-annotation)
* [增加了对 Gradle 8.6–8.8 版本的支持](#gradle)
* [一个新选项允许在 Gradle 项目之间将 JVM 构件作为类文件共享](#option-to-share-jvm-artifacts-between-projects-as-class-files)
* [Compose 编译器已更新](#compose-compiler)
* [通用 Kotlin 标准库中增加了对 UUID 的支持](#support-for-uuids-in-the-common-kotlin-standard-library)

## IDE 支持

支持 2.0.20 的 Kotlin 插件已捆绑在最新的 IntelliJ IDEA 和 Android Studio 中。
你无需在 IDE 中更新 Kotlin 插件。
你只需在你的构建脚本中将 Kotlin 版本更改为 2.0.20 即可。

有关详细信息，请参阅[更新到新版本](releases#update-to-a-new-kotlin-version)。

## 语言

Kotlin 2.0.20 开始引入一些变更，以提高数据类的一致性并替换 Experimental 上下文接收器功能。

### 数据类 copy 函数将具有与构造函数相同的可见性

目前，如果你使用 `private` 构造函数创建一个数据类，则自动生成的 `copy()` 函数不具有相同的可见性。这可能会在以后的代码中引起问题。在未来的 Kotlin 版本中，我们将引入 `copy()` 函数的默认可见性与构造函数相同的行为。此更改将逐步引入，以帮助你尽可能顺利地迁移代码。

我们的迁移计划从 Kotlin 2.0.20 开始，它会在你的代码中发出警告，提示你将来可见性会发生变化。例如：

```kotlin
// 在 2.0.20 中触发警告
data class PositiveInteger private constructor(val number: Int) {
    companion object {
        fun create(number: Int): PositiveInteger? = if (number > 0) PositiveInteger(number) else null
    }
}

fun main() {
    val positiveNumber = PositiveInteger.create(42) ?: return
    // 在 2.0.20 中触发警告
    val negativeNumber = positiveNumber.copy(number = -1)
    // Warning: Non-public primary constructor is exposed via the generated 'copy()' method of the 'data' class.
    // The generated 'copy()' will change its visibility in future releases.
}
```

有关我们迁移计划的最新信息，请参阅 [YouTrack](https://youtrack.jetbrains.com/issue/KT-11914) 中的相应问题。

为了让你更好地控制此行为，我们在 Kotlin 2.0.20 中引入了两个注解：

* `@ConsistentCopyVisibility` 用于选择立即启用此行为，而无需等到我们在以后的版本中将其设为默认行为。
* `@ExposedCopyVisibility` 用于选择不启用此行为并禁止在声明位置发出警告。
  请注意，即使使用此注解，编译器在调用 `copy()` 函数时仍会报告警告。

如果你想在 2.0.20 中为一个整个模块（而不是在单个类中）选择启用新行为，你可以使用 `-Xconsistent-data-class-copy-visibility` 编译器选项。
此选项与将 `@ConsistentCopyVisibility` 注解添加到模块中的所有数据类具有相同的效果。

### 逐步替换上下文接收器为上下文参数

在 Kotlin 1.6.20 中，我们引入了[上下文接收器](whatsnew1620#prototype-of-context-receivers-for-kotlin-jvm)作为
[Experimental](components-stability#stability-levels-explained) 功能。在听取了社区的反馈后，我们决定不再继续使用此方法，而是采取不同的方向。

在未来的 Kotlin 版本中，上下文接收器将被上下文参数替换。上下文参数仍在设计阶段，你可以在 [KEEP](https://github.com/Kotlin/KEEP/blob/context-parameters/proposals/context-parameters) 中找到该提案。

由于上下文参数的实现需要对编译器进行重大更改，因此我们决定不同时支持上下文接收器和上下文参数。此决定大大简化了实现，并最大限度地降低了不稳定行为的风险。

我们知道，大量的开发人员已经在使用上下文接收器。因此，我们将开始逐步取消对上下文接收器的支持。我们的迁移计划从 Kotlin 2.0.20 开始，当使用 `-Xcontext-receivers` 编译器选项时，你的代码中使用上下文接收器时会发出警告。例如：

```kotlin
class MyContext

context(MyContext)
// Warning: Experimental context receivers are deprecated and will be superseded by context parameters. 
// Please don't use context receivers. You can either pass parameters explicitly or use members with extensions.
fun someFunction() {
}
```

此警告将在未来的 Kotlin 版本中变为错误。

如果你在代码中使用上下文接收器，我们建议你将代码迁移为使用以下任一项：

* 显式参数。
<table>
<tr>
<td>
之前
</td>
<td>
之后
</td>
</tr>
<tr>
<td>

   ```kotlin
   context(ContextReceiverType)
   fun someFunction() {
       contextReceiverMember()
   }
   ```
</td>
<td>

   ```kotlin
   fun someFunction(explicitContext: ContextReceiverType) {
       explicitContext.contextReceiverMember()
   }
   ```
</td>
</tr>
</table>

* 扩展成员函数（如果可能）。
<table>
<tr>
<td>
之前
</td>
<td>
之后
</td>
</tr>
<tr>
<td>

   ```kotlin
   context(ContextReceiverType)
   fun contextReceiverMember() = TODO()
   
   context(ContextReceiverType)
   fun someFunction() {
       contextReceiverMember()
   }
   ```
</td>
<td>

   ```kotlin
   class ContextReceiverType {
       fun contextReceiverMember() = TODO()
   }
   
   fun ContextReceiverType.someFunction() {
       contextReceiverMember()
   }
   ```
</td>
</tr>
</table>

或者，你可以等到 Kotlin 发布支持编译器中的上下文参数的版本。请注意，上下文参数最初将作为 Experimental 功能引入。

## Kotlin 多平台

Kotlin 2.0.20 改进了多平台项目中的源集管理，并由于 Gradle 中的最新更改而弃用了与某些 Gradle Java 插件的兼容性。

### 从默认目标层级结构访问源集的静态访问器

自 Kotlin 1.9.20 以来，[默认层级结构模板](multiplatform-hierarchy#default-hierarchy-template)
已自动应用于所有 Kotlin 多平台项目。
对于默认层级结构模板中的所有源集，Kotlin Gradle 插件提供了类型安全的访问器。
这样，你最终可以访问所有指定目标的源集，而无需使用 `by getting` 或 `by creating` 构造。

Kotlin 2.0.20 旨在进一步改善你的 IDE 体验。它现在在 `sourceSets {}` 块中为默认层级结构模板中的所有源集提供静态访问器。
我们相信此更改将使按名称访问源集更容易且更可预测。

每个此类源集现在都有一个详细的 KDoc 注释，其中包含一个示例和一个诊断消息，如果尝试在未先声明相应目标的情况下访问源集，则会发出警告：

```kotlin
kotlin {
    jvm()
    linuxX64()
    linuxArm64()
    mingwX64()
  
    sourceSets {
        commonMain.languageSettings {
            progressiveMode = true
        }

        jvmMain { }
        linuxX64Main { }
        linuxArm64Main { }
        // Warning: accessing source set without registering the target
        iosX64Main { }
    }
}
```

<img src="/img/accessing-sourse-sets.png" alt="按名称访问源集" width="700" style={{verticalAlign: 'middle'}}/>

了解更多关于 [Kotlin 多平台中的层级项目结构](multiplatform-hierarchy) 的信息。

### 弃用 Kotlin 多平台 Gradle 插件与 Gradle Java 插件的兼容性

在 Kotlin 2.0.20 中，当你将 Kotlin 多平台 Gradle 插件和以下任何 Gradle Java 插件应用于同一项目时，我们会引入弃用警告：[Java](https://docs.gradle.org/current/userguide/java_plugin.html)、
[Java Library](https://docs.gradle.org/current/userguide/java_library_plugin.html) 和 [Application](https://docs.gradle.org/current/userguide/application_plugin.html)。
当你的多平台项目中的另一个 Gradle 插件应用 Gradle Java 插件时，也会出现该警告。
例如，[Spring Boot Gradle Plugin](https://docs.spring.io/spring-boot/gradle-plugin/index.html) 会自动应用 Application 插件。

我们添加此弃用警告的原因是 Kotlin 多平台的项目模型与 Gradle 的 Java 生态系统插件之间存在根本的兼容性问题。Gradle 的 Java 生态系统插件目前没有考虑到其他插件可能：

* 也以不同于 Java 生态系统插件的方式发布或编译 JVM 目标。
* 在同一项目中有两个不同的 JVM 目标，例如 JVM 和 Android。
* 具有复杂的具有潜在多个非 JVM 目标的多平台项目结构。

遗憾的是，Gradle 目前没有提供任何 API 来解决这些问题。

我们之前在 Kotlin 多平台中使用了一些解决方法来帮助集成 Java 生态系统插件。
但是，这些解决方法从未真正解决兼容性问题，并且自 Gradle 8.8 发布以来，这些解决方法不再可行。有关更多信息，请参阅我们的 [YouTrack 问题](https://youtrack.jetbrains.com/issue/KT-66542/Gradle-JVM-target-with-withJava-produces-a-deprecation-warning)。

虽然我们还不确切知道如何解决此兼容性问题，但我们致力于继续支持在你的 Kotlin 多平台项目中进行某种形式的 Java 源代码编译。至少，我们将支持 Java 源代码的编译，并在你的多平台项目中使用 Gradle 的 [`java-base`](https://docs.gradle.org/current/javadoc/org/gradle/api/plugins/JavaBasePlugin.html) 插件。

同时，如果在你的多平台项目中看到此弃用警告，我们建议你：
1. 确定你是否真的需要在你的项目中使用 Gradle Java 插件。如果不需要，请考虑删除它。
2. 检查 Gradle Java 插件是否仅用于单个任务。如果是这样，你或许可以毫不费力地删除该插件。例如，如果该任务使用 Gradle Java 插件来创建 Javadoc JAR 文件，你可以手动定义 Javadoc 任务。

否则，如果你想在你的多平台项目中同时使用 Kotlin 多平台 Gradle 插件和这些用于 Java 的 Gradle 插件，我们建议你：

1. 在你的多平台项目中创建一个单独的子项目。
2. 在单独的子项目中，应用用于 Java 的 Gradle 插件。
3. 在单独的子项目中，添加对你的父多平台项目的依赖项。

:::note
单独的子项目必须**不是**多平台项目，并且你必须仅使用它来设置对你的多平台项目的依赖项。

例如，你有一个名为 `my-main-project` 的多平台项目，并且你想
使用 [Application](https://docs.gradle.org/current/userguide/application_plugin.html) Gradle 插件来运行 JVM 应用程序。

一旦你创建了一个子项目，让我们称之为 `subproject-A`，你的父项目结构应如下所示：

```text
.
├── build.gradle.kts
├── settings.gradle
├── subproject-A
    └── build.gradle.kts
    └── src
        └── Main.java
```

在你的子项目的 `build.gradle.kts` 文件中，在 `plugins {}` 块中应用 Application 插件：

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
plugins {
    id("application")
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
plugins {
    id('application')
}
```

</TabItem>
</Tabs>

在你的子项目的 `build.gradle.kts` 文件中，添加对你的父多平台项目的依赖项：

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
dependencies {
    implementation(project(":my-main-project")) // 你的父多平台项目的名称
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
dependencies {
    implementation project(':my-main-project') // 你的父多平台项目的名称
}
```

</TabItem>
</Tabs>

你的父项目现在已设置为与两个插件一起使用。

## Kotlin/Native

Kotlin/Native 在垃圾回收器方面进行了改进，并支持从 Swift/Objective-C 调用 Kotlin 挂起函数。

### 垃圾回收器中的并发标记

在 Kotlin 2.0.20 中，JetBrains 团队朝着提高 Kotlin/Native 运行时性能迈出了另一步。
我们已经在垃圾回收器 (GC) 中添加了对并发标记的 Experimental 支持。

默认情况下，当 GC 在堆中标记对象时，必须暂停应用程序线程。这极大地影响了 GC 暂停时间的持续时间，这对于延迟关键型应用程序（例如使用 Compose Multiplatform 构建的 UI 应用程序）的性能至关重要。

现在，垃圾回收的标记阶段可以与应用程序线程同时运行。
这应该会显著缩短 GC 暂停时间，并有助于提高应用程序的响应能力。

#### 如何启用

此功能目前是 [Experimental](components-stability#stability-levels-explained)。
要启用它，请在你的 `gradle.properties` 文件中设置以下选项：

```none
kotlin.native.binary.gc=cms
```

请将任何问题报告给我们的问题跟踪器 [YouTrack](https://kotl.in/issue)。

### 已删除对 bitcode 嵌入的支持

从 Kotlin 2.0.20 开始，Kotlin/Native 编译器不再支持 bitcode 嵌入。
Bitcode 嵌入在 Xcode 14 中已弃用，并在 Xcode 15 中针对所有 Apple 目标删除。

现在，框架配置的 `embedBitcode` 参数以及 `-Xembed-bitcode` 和 `-Xembed-bitcode-marker` 命令行参数已弃用。

如果你仍在使用早期版本的 Xcode 但想升级到 Kotlin 2.0.20，
请在你的 Xcode 项目中禁用 bitcode 嵌入。

### 使用 signpost 更改 GC 性能监视

Kotlin 2.0.0 使得可以通过 Xcode Instruments 监视 Kotlin/Native 垃圾回收器
(GC) 的性能。Instruments 包括 signpost 工具，该工具可以将 GC 暂停显示为事件。
这在检查 iOS 应用程序中与 GC 相关的冻结时非常有用。

该功能默认情况下已启用，但不幸的是，
当应用程序与 Xcode Instruments 同时运行时，有时会导致崩溃。
从 Kotlin 2.0.20 开始，它需要使用以下编译器选项显式选择加入：

```none
-Xbinary=enableSafepointSignposts=true
```

在[文档](native-memory-manager#monitor-gc-performance)中了解有关 GC 性能分析的更多信息。

### 能够在非主线程上从 Swift/Objective-C 调用 Kotlin 挂起函数

以前，Kotlin/Native 有一个默认限制，将从 Swift
和 Objective-C 调用 Kotlin 挂起函数的能力限制为主线程。Kotlin 2.0.20 解除了该限制，允许你在任何线程上从 Swift/Objective-C 运行 Kotlin
`suspend` 函数。

如果你以前使用 `kotlin.native.binary.objcExportSuspendFunctionLaunchThreadRestriction=none`
二进制选项切换了非主线程的默认行为，你现在可以将其从你的 `gradle.properties` 文件中删除。

## Kotlin/Wasm

在 Kotlin 2.0.20 中，Kotlin/Wasm 继续向命名导出迁移，并重新定位 `@ExperimentalWasmDsl` 注解。

### 默认导出用法中的错误

作为向命名导出迁移的一部分，以前在使用默认导出导入 JavaScript 中的 Kotlin/Wasm 导出时，会在控制台中打印警告消息。

为了完全支持命名导出，此警告现在已升级为错误。如果你使用默认导入，你将遇到以下错误消息：

```text
Do not use default import. Use the corresponding named import instead.
```

此更改是迁移到命名导出的弃用周期的一部分。以下是你可以在每个阶段期望的内容：

* **在 2.0.0 版本中**：会在控制台中打印警告消息，说明通过默认导出导出实体已弃用。
* **在 2.0.20 版本中**：会出现错误，要求使用相应的命名导入。
* **在 2.1.0 版本中**：将完全删除默认导入的使用。

### ExperimentalWasmDsl 注解的新位置

以前，用于 WebAssembly (Wasm) 功能的 `@ExperimentalWasmDsl` 注解位于 Kotlin Gradle 插件中的此位置：

```Kotlin
org.jetbrains.kotlin.gradle.targets.js.dsl.ExperimentalWasmDsl
```

在 2.0.20 中，`@ExperimentalWasmDsl` 注解已重新定位到：

```Kotlin
org.jetbrains.kotlin.gradle.ExperimentalWasmDsl
```

先前的位置现已弃用，并可能导致构建失败，并出现未解析的引用。

为了反映 `@ExperimentalWasmDsl` 注解的新位置，请更新你的 Gradle 构建脚本中的 import 语句。
为新的 `@ExperimentalWasmDsl` 位置使用显式导入：

```kotlin
import org.jetbrains.kotlin.gradle.ExperimentalWasmDsl
```

或者，从旧的包中删除此星号导入语句：

```kotlin
import org.jetbrains.kotlin.gradle.targets.js.dsl.*
```

## Kotlin/JS

Kotlin/JS 引入了一些 Experimental 功能来支持 JavaScript 中的静态成员并从 JavaScript 创建 Kotlin 集合。

### 支持在 JavaScript 中使用 Kotlin 静态成员

此功能是 [Experimental](components-stability#stability-levels-explained)。它可能会随时删除或更改。
仅将其用于评估目的。我们感谢你在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-18891/JS-provide-a-way-to-declare-static-members-JsStatic) 上提供的反馈。

从 Kotlin 2.0.20 开始，你可以使用 `@JsStatic` 注解。它的工作方式类似于 [@JvmStatic](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvm-static/)
并指示编译器为目标声明生成其他静态方法。这有助于你直接在 JavaScript 中使用来自你的 Kotlin 代码的静态成员。

你可以将 `@JsStatic` 注解用于在命名对象以及在类和接口内部声明的伴生对象中定义的函数。编译器会生成对象的静态方法和对象本身中的实例方法。例如：

```kotlin
class C {
    companion object {
        @JsStatic
        fun callStatic() {}
        fun callNonStatic() {}
    }
}
```

现在，`callStatic()` 在 JavaScript 中是静态的，而 `callNonStatic()` 不是：

```javascript
C.callStatic();              // 工作，访问静态函数
C.callNonStatic();           // 错误，在生成的 JavaScript 中不是静态函数
C.Companion.callStatic();    // 实例方法仍然存在
C.Companion.callNonStatic(); // 唯一有效的方式
```

也可以将 `@JsStatic` 注解应用于对象或伴生对象的属性，使其 getter 和 setter 方法成为该对象或包含伴生对象的类中的静态成员。

### 能够在 JavaScript 中创建 Kotlin 集合

此功能是 [Experimental](components-stability#stability-levels-explained)。它可能会随时删除或更改。
仅将其用于评估目的。我们感谢你在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-69133/Kotlin-JS-Add-support-for-collection-instantiation-in-JavaScript) 上提供的反馈。

Kotlin 2.0.0 引入了将 Kotlin 集合导出到 JavaScript（和 TypeScript）的能力。现在，JetBrains 团队
正在采取另一步骤来提高集合互操作性。从 Kotlin 2.0.20 开始，可以
直接从 JavaScript/TypeScript 端创建 Kotlin 集合。

你可以从 JavaScript 创建 Kotlin 集合并将它们作为参数传递给导出的构造函数或函数。
只要你在导出的声明中提到一个集合，Kotlin 就会为该集合生成一个工厂，该工厂可在 JavaScript/TypeScript 中使用。

请看以下导出的函数：

```kotlin
// Kotlin
@JsExport
fun consumeMutableMap(map: MutableMap<String, Int>)
```

由于提到了 `MutableMap` 集合，Kotlin 会生成一个对象，其中包含一个可从 JavaScript/TypeScript 访问的工厂方法。
然后，此工厂方法从 JavaScript `Map` 创建一个 `MutableMap`：

```javascript
// JavaScript
import { consumeMutableMap } from "an-awesome-kotlin-module"
import { KtMutableMap } from "an-awesome-kotlin-module/kotlin-kotlin-stdlib"

consumeMutableMap(
    KtMutableMap.fromJsMap(new Map([["First", 1], ["Second", 2]]))
)
```

此功能适用于 `Set`、`Map` 和 `List` Kotlin 集合类型及其可变对应项。

## Gradle

Kotlin 2.0.20 完全兼容 Gradle 6.8.3 到 8.6。Gradle 8.7 和 8.8 也受支持，但有一个
例外：如果你使用 Kotlin 多平台 Gradle 插件，你可能会在你的多平台项目中看到弃用警告，其中在 JVM 目标中调用 `withJava()` 函数。我们计划尽快解决此问题。

有关更多信息，请参阅 [YouTrack](https://youtrack.jetbrains.com/issue/KT-66542/Gradle-JVM-target-with-withJava-produces-a-deprecation-warning) 中的问题。

你还可以使用 Gradle 版本，直至最新的 Gradle 版本，但如果你这样做，请记住，你可能会遇到
弃用警告，或者某些新的 Gradle 功能可能无法正常工作。

此版本带来了一些更改，例如开始弃用基于 JVM 历史文件的旧增量编译方法的过程，以及一种在项目之间共享 JVM 构件的新方法。

### 弃用基于 JVM 历史文件的增量编译

在 Kotlin 2.0.20 中，基于 JVM 历史文件的增量编译方法已弃用，取而代之的是自 Kotlin 1.8.20 以来默认启用的新增量编译方法。

基于 JVM 历史文件的增量编译方法存在一些限制，
例如不适用于 [Gradle 的构建缓存](https://docs.gradle.org/current/userguide/build_cache.html) 并且不支持编译避免。
相比之下，新的增量编译方法克服了这些限制，并且自引入以来表现良好。

鉴于新的增量编译方法已在过去的两个主要 Kotlin 版本中默认使用，因此 `kotlin.incremental.useClasspathSnapshot` Gradle 属性在 Kotlin 2.0.20 中已弃用。
因此，如果你使用它来选择退出，你将看到一个弃用警告。

### 用于将 JVM 构件作为类文件在项目之间共享的选项

此功能是 [Experimental](components-stability#stability-levels-explained)。
它可能会随时删除或更改。仅将其用于评估目的。
我们感谢你在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-61861/Gradle-Kotlin-compilations-depend-on-packed-artifacts) 上提供的反馈。
需要选择加入（请参阅下面的详细信息）。

在 Kotlin 2.0.20 中，我们引入了一种新方法，该方法更改了 Kotlin/JVM 编译（例如 JAR 文件）的输出在项目之间共享的方式。使用此方法，Gradle 的 `apiElements` 配置现在有一个辅助变体，该变体提供对包含已编译 `.class` 文件的目录的访问。配置后，你的项目会使用此目录，而不是在编译期间请求压缩的 JAR 构件。这减少了 JAR 文件被压缩和解压缩的次数，尤其是在增量构建中。

我们的测试表明，这种新方法可以为 Linux 和 macOS 主机提供构建性能改进。
但是，在 Windows 主机上，由于 Windows 在处理文件时的 I/O 操作方式，我们看到了性能下降。

要尝试这种新方法，请将以下属性添加到你的 `gradle.properties` 文件中：

```none
kotlin.jvm.addClassesVariant=true
```

默认情况下，此属性设置为 `false`，并且 Gradle 中的 `apiElements` 变体会请求压缩的 JAR 构件。

Gradle 有一个相关的属性，你可以在仅 Java 项目中使用它，以便在编译期间**代替**包含已编译 `.class` 文件的目录，仅公开压缩的 JAR 构件：

```none
org.gradle.java.compile-classpath-packaging=true
```

有关此属性及其用途的更多信息，请参阅 Gradle 文档中的 [大型多项目在 Windows 上的构建性能显著下降](https://docs.gradle.org/current/userguide/java_library_plugin.html#sub:java_library_known_issues_windows_performance)。

:::

我们感谢你对此新方法的反馈。在使用它时，你是否注意到任何性能改进？
请通过在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-61861/Gradle-Kotlin-compilations-depend-on-packed-artifacts) 中添加评论来告诉我们。

### 使 Kotlin Gradle 插件的依赖项行为与 java-test-fixtures 插件对齐

在 Kotlin 2.0.20 之前，如果你在你的项目中使用 [`java-test-fixtures` 插件](https://docs.gradle.org/current/userguide/java_testing.html#sec:java_test_fixtures)，则 Gradle 和 Kotlin Gradle 插件在依赖项的传播方式上存在差异。

Kotlin Gradle 插件传播依赖项：

* 从 `java-test-fixtures` 插件的 `implementation` 和 `api` 依赖项类型到 `test` 源集编译类路径。
* 从主源集的 `implementation` 和 `api` 依赖项类型到 `java-test-fixtures` 插件的源集编译类路径。

但是，Gradle 仅传播 `api` 依赖项类型中的依赖项。

这种行为上的差异导致一些项目在类路径中多次找到资源文件。

从 Kotlin 2.0.20 开始，Kotlin Gradle 插件的行为与 Gradle 的 `java-test-fixtures` 插件对齐，因此对于此或其他 Gradle 插件，不再发生此问题。

由于此更改，`test` 和 `testFixtures` 源集中的某些依赖项可能不再可访问。
如果发生这种情况，请将依赖项声明类型从 `implementation` 更改为 `api`，或者在受影响的源集上添加新的依赖项声明。

### 为编译任务缺少构件上的任务依赖项的罕见情况添加了任务依赖项

在 2.0.20 之前，我们发现有些情况下，编译任务缺少其一个构件输入的任务依赖项。这意味着依赖的编译任务的结果是不稳定的，因为有时构件已及时生成，但有时没有。

为了解决此问题，Kotlin Gradle 插件现在会自动在这些情况下添加所需的任务依赖项。

在极少数情况下，我们发现这种新行为会导致循环依赖项错误。
例如，如果你有多个编译，其中一个编译可以看到另一个编译的所有内部声明，并且生成的构件依赖于两个编译任务的输出，你可能会看到如下错误：

```none
FAILURE: Build failed with an exception.

What went wrong:
Circular dependency between the following tasks:
:lib:compileKotlinJvm
--- :lib:jvmJar
     \--- :lib:compileKotlinJvm (*)
(*) - details omitted (listed previously)
```

为了解决此循环依赖项错误，我们添加了一个 Gradle 属性：`archivesTaskOutputAsFriendModule`。

默认情况下，此属性设置为 `true` 以跟踪任务依赖项。要禁用在编译任务中使用构件，以便不需要任务依赖项，请在你的 `gradle.properties` 文件中添加以下内容：

```kotlin
kotlin.build.archivesTaskOutputAsFriendModule=false
```

有关更多信息，请参阅 [YouTrack](https://youtrack.jetbrains.com/issue/KT-69330) 中的问题。

## Compose 编译器

在 Kotlin 2.0.20 中，Compose 编译器获得了一些改进。

### 修复了 2.0.0 中引入的不必要的重组问题

Compose 编译器 2.0.0 存在一个问题，有时会错误地推断具有非 JVM 目标的多平台项目中类型的稳定性。这可能会导致不必要的（甚至无休止的）重组。我们强烈建议将你为 Kotlin 2.0.0 制作的 Compose 应用程序更新到 2.0.10 或更高版本。

如果你的应用程序是使用 Compose 编译器 2.0.10 或更高版本构建的，但使用使用 2.0.0 版本构建的依赖项，这些较旧的依赖项可能仍然会导致重组问题。
为了防止这种情况，请将你的依赖项更新到使用与你的应用程序相同的 Compose 编译器构建的版本。

### 配置编译器选项的新方法

我们引入了一种新的选项配置机制，以避免顶层参数的流失。
Compose 编译器团队很难通过创建或删除 `composeCompiler {}` 块的顶层条目来测试内容。
因此，现在可以通过 `featureFlags` 属性启用诸如强跳过模式和非跳过组优化之类的选项。
此属性将用于测试最终将成为默认值的新 Compose 编译器选项。

此更改也已应用于 Compose 编译器 Gradle 插件。为了配置未来的功能标志，
请使用以下语法（此代码将翻转所有默认值）：

```kotlin
composeCompiler {
    featureFlags = setOf(
        ComposeFeatureFlag.IntrinsicRemember.disabled(),
        ComposeFeatureFlag.OptimizeNonSkippingGroups,
        ComposeFeatureFlag.StrongSkipping.disabled()
    )
}
```

或者，如果你直接配置 Compose 编译器，请使用以下语法：

```text
-P plugin:androidx.compose.compiler.plugins.kotlin:featureFlag=IntrinsicRemember
```

因此，`enableIntrinsicRemember`、`enableNonSkippingGroupOptimization` 和 `enableStrongSkippingMode` 属性已被弃用。

我们感谢你对 [YouTrack](https://youtrack.jetbrains.com/issue/KT-68651/Compose-provide-a-single-place-in-extension-to-configure-all-compose-flags) 上此新方法的任何反馈。

### 默认启用强跳过模式

Compose 编译器的强跳过模式现在默认启用。

强跳过模式是一种 Compose 编译器配置选项，它更改了可以跳过哪些可组合项的规则。
启用强跳过模式后，现在也可以跳过具有不稳定参数的可组合项。
强跳过模式还会自动记住可组合函数中使用的 lambda，
因此你不再需要使用 `remember` 包装你的 lambda 以避免重组。

有关更多详细信息，请参阅[强跳过模式文档](https://developer.android.com/develop/ui/compose/performance/stability/strongskipping)。

### 默认启用组合跟踪标记

`includeTraceMarkers` 选项现在默认在 Compose 编译器 Gradle 插件中设置为 `true`，以匹配编译器插件中的默认值。
这允许你在 Android Studio 系统跟踪分析器中查看可组合函数。有关组合跟踪的详细信息，请参阅此 [Android Developers 博客文章](https://medium.com/androiddevelopers/jetpack-compose-composition-tracing-9ec2b3aea535)。

### 非跳过组优化

此版本包含一个新的编译器选项：启用后，不可跳过和不可重新启动的可组合函数将不再生成可组合项主体周围的组。
这会导致更少的分配，从而提高性能。
此选项是 Experimental 的，默认情况下禁用，但可以使用功能标志 `OptimizeNonSkippingGroups` 启用，如[上文](#new-way-to-configure-compiler-options)所示。

此功能标志现在已准备好进行更广泛的测试。启用该功能时发现的任何问题都可以在 [Google 问题跟踪器](https://goo.gle/compose-feedback) 上提交。

### 支持抽象可组合函数中的默认参数

你现在可以向抽象可组合函数添加默认参数。

以前，即使它是有效的 Kotlin 代码，Compose 编译器也会在尝试这样做时报告一个错误。
我们现在已在 Compose 编译器中添加了对此的支持，并且已删除了该限制。
这对于包括默认的 `Modifier` 值特别有用：

```kotlin
abstract class Composables {
    @Composable
    abstract fun Composable(modifier: Modifier = Modifier)
}
```

开放可组合函数的默认参数在 2.0.20 中仍然受到限制。此限制将在未来的版本中解决。

## 标准库

标准库现在支持通用唯一标识符作为 Experimental 功能，并包括对 Base64 解码的一些更改。

### 通用 Kotlin 标准库中对 UUID 的支持

:::caution
此功能是 [Experimental](components-stability#stability-levels-explained)。
要选择加入，请使用 `@ExperimentalUuidApi` 注解或编译器选项 `-opt-in=kotlin.uuid.ExperimentalUuidApi`。

:::

Kotlin 2.0.20 引入了一个类，用于表示通用 Kotlin 标准库中的 [UUID（通用唯一标识符）](https://en.wikipedia.org/wiki/Universally_unique_identifier)，以解决唯一标识项目的挑战。

此外，此功能还提供了用于以下与 UUID 相关的操作的 API：

* 生成 UUID。
* 从 UUID 的字符串表示形式解析 UUID 并将其格式化为字符串表示形式。
* 从指定的 128 位值创建 UUID。
* 访问 UUID 的 128 位。

以下代码示例演示了这些操作：

```kotlin
// 构造一个字节数组以用于 UUID 创建
val byteArray = byteArrayOf(
    0x55, 0x0E, 0x84.toByte(), 0x00, 0xE2.toByte(), 0x9B.toByte(), 0x41, 0xD4.toByte(),
    0xA7.toByte(), 0x16, 0x44, 0x66, 0x55, 0x44, 0x00, 0x00
)

val uuid1 = Uuid.fromByteArray(byteArray)
val uuid2 = Uuid.fromULongs(0x550E8400E29B41D4uL, 0xA716446655440000uL)
val uuid3 = Uuid.parse("550e8400-e29b-41d4-a716-446655440000")

println(uuid1)
// 550e8400-e29b-41d4-a716-446655440000
println(uuid1 == uuid2)
// true
println(uuid2 == uuid3)