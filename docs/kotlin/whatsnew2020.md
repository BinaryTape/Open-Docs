[//]: # (title: Kotlin 2.0.20 最新变化)

<web-summary>阅读 Kotlin 2.0.20 发布说明，涵盖新的语言功能、Kotlin Multiplatform、JVM、Native、JS 和 Wasm 的更新，以及 Gradle 和 Maven 的构建工具支持。</web-summary>

_[发布日期：2024 年 8 月 22 日](releases.md#release-history)_

Kotlin 2.0.20 正式发布！此版本包含针对 Kotlin 2.0.0 的性能改进和错误修复，我们在 2.0.0 版本中宣布了 Kotlin K2 编译器进入稳定版 (Stable)。以下是此版本的一些其他亮点：

* [data class 的 copy 函数将具有与构造函数相同的可见性](#data-class-copy-function-to-have-the-same-visibility-as-constructor)
* [多平台项目中现在可以使用来自默认目标层次结构的源集静态访问器](#static-accessors-for-source-sets-from-the-default-target-hierarchy)
* [Kotlin/Native 的垃圾回收器已支持并发标记](#concurrent-marking-in-garbage-collector)
* [Kotlin/Wasm 中的 `@ExperimentalWasmDsl` 注解有了新位置](#new-location-of-experimentalwasmdsl-annotation)
* [添加了对 Gradle 8.6–8.8 版本的支持](#gradle)
* [新选项允许将 Gradle 项目间的 JVM 构件作为类文件共享](#option-to-share-jvm-artifacts-between-projects-as-class-files)
* [Compose 编译器已更新](#compose-compiler)
* [Kotlin 公共标准库中添加了对 UUID 的支持](#support-for-uuids-in-the-common-kotlin-standard-library)

> 有关 Kotlin 发布周期的信息，请参阅 [Kotlin 发布流程](releases.md)。
>
{style="tip"}

## IDE 支持

支持 2.0.20 的 Kotlin 插件已打包在最新的 IntelliJ IDEA 和 Android Studio 中。
您无需在 IDE 中更新 Kotlin 插件。
您只需要在构建脚本中将 Kotlin 版本更改为 2.0.20 即可。

有关详细信息，请参阅[更新至新版本](releases.md#update-to-a-new-kotlin-version)。

## 语言

Kotlin 2.0.20 开始引入一些变更，以提高 data class 的一致性，并取代实验性的 context receiver 功能。

### Data class copy 函数将具有与构造函数相同的可见性

目前，如果您使用 `private` 构造函数创建 data class，则自动生成的 `copy()` 函数并不具有相同的可见性。这可能会在以后的代码中引发问题。在未来的 Kotlin 版本中，我们将引入 `copy()` 函数的默认可见性与构造函数相同的行为。此变更将逐步引入，以帮助您尽可能顺利地迁移代码。

我们的迁移计划从 Kotlin 2.0.20 开始，如果您的代码中存在未来可见性会发生变化的情况，该版本会发出警告。例如：

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
    // 警告：非公开主构造函数通过生成的 'data' 类 'copy()' 方法暴露。
    // 生成的 'copy()' 将在未来版本中更改其可见性。
}
```

有关我们迁移计划的最新信息，请参阅 [YouTrack](https://youtrack.jetbrains.com/issue/KT-11914) 中的相应问题。

为了让您能够更好地控制此行为，我们在 Kotlin 2.0.20 中引入了两个注解：

* `@ConsistentCopyVisibility`：现在就启用此行为，而不必等待在以后的版本中成为默认行为。
* `@ExposedCopyVisibility`：禁用此行为并在声明处取消警告。
  请注意，即使使用了此注解，编译器在调用 `copy()` 函数时仍会报告警告。

如果您希望在 2.0.20 中针对整个模块而不是单个类启用新行为，
可以使用 `-Xconsistent-data-class-copy-visibility` 编译器选项。
此选项的效果等同于在模块中的所有 data class 上添加 `@ConsistentCopyVisibility` 注解。

### 逐步用 context parameter 替换 context receiver

在 Kotlin 1.6.20 中，我们将 [context receiver](whatsnew1620.md#prototype-of-context-receivers-for-kotlin-jvm) 作为一项[实验性 (Experimental)](components-stability.md#stability-levels-explained)功能引入。在听取了社区反馈后，我们决定不再继续采用这种方法，而是改用另一个方向。

在未来的 Kotlin 版本中，context receiver 将被 context parameter 取代。context parameter 仍处于设计阶段，您可以在 [KEEP](https://github.com/Kotlin/KEEP/blob/context-parameters/proposals/context-parameters.md) 中找到该提案。

由于实现 context parameter 需要对编译器进行重大更改，我们决定不同时支持 context receiver 和 context parameter。这一决定大大简化了实现过程，并最大限度地降低了行为不稳定的风险。

我们了解到 context receiver 已被大量开发者使用。因此，我们将开始逐步移除对 context receiver 的支持。我们的迁移计划从 Kotlin 2.0.20 开始，当在使用 `-Xcontext-receivers` 编译器选项的代码中使用 context receiver 时，会发出警告。例如：

```kotlin
class MyContext

context(MyContext)
// 警告：实验性 context receiver 已弃用，将被 context parameter 取代。
// 请不要使用 context receiver。您可以显式传递参数，或使用带有扩展的成员。
fun someFunction() {
}
```

此警告将在未来的 Kotlin 版本中变为错误。

如果您的代码中使用了 context receiver，我们建议您将代码迁移为使用以下任一方式：

* 显式参数。

   <table>
      <tr>
          <td>迁移前</td>
          <td>迁移后</td>
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
          <td>迁移前</td>
          <td>迁移后</td>
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

或者，您可以等到编译器支持 context parameter 的 Kotlin 版本发布。请注意，context parameter 最初将作为实验性功能引入。

## Kotlin Multiplatform

Kotlin 2.0.20 改进了多平台项目中的源集管理，并由于 Gradle 最近的变更，弃用了与某些 Gradle Java 插件的兼容性。

### 来自默认目标层次结构的源集静态访问器

自 Kotlin 1.9.20 起，[默认层次结构模板](https://kotlinlang.org/docs/multiplatform/multiplatform-hierarchy.html#default-hierarchy-template)会自动应用于所有 Kotlin Multiplatform 项目。
对于默认层次结构模板中的所有源集，Kotlin Gradle 插件都提供了类型安全访问器。
这样，您终于可以访问所有指定目标的源集，而无需使用 `by getting` 或 `by creating` 构造。

Kotlin 2.0.20 旨在进一步提升您的 IDE 体验。它现在在 `sourceSets {}` 块中为来自默认层次结构模板的所有源集提供静态访问器。
我们相信此变更将使按名称访问源集变得更加容易且更具可预测性。

现在，每个此类源集都有一个带有示例的详细 KDoc 注释，以及一条诊断消息，如果您在未先声明相应目标的情况下尝试访问源集，则会发出警告：

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
        // 警告：在未注册目标的情况下访问源集
        iosX64Main { }
    }
}
```

![按名称访问源集](accessing-sourse-sets.png){width=700}

详细了解 [Kotlin Multiplatform 中的层次项目结构](https://kotlinlang.org/docs/multiplatform/multiplatform-hierarchy.html)。

### 弃用 Kotlin Multiplatform Gradle 插件与 Gradle Java 插件的兼容性

在 Kotlin 2.0.20 中，当您在同一个项目中同时应用 Kotlin Multiplatform Gradle 插件和以下任何 Gradle Java 插件时，我们会引入弃用警告：[Java](https://docs.gradle.org/current/userguide/java_plugin.html)、[Java Library](https://docs.gradle.org/current/userguide/java_library_plugin.html) 和 [Application](https://docs.gradle.org/current/userguide/application_plugin.html)。
当多平台项目中的另一个 Gradle 插件应用了 Gradle Java 插件时，也会出现该警告。
例如，[Spring Boot Gradle Plugin](https://docs.spring.io/spring-boot/gradle-plugin/index.html) 会自动应用 Application 插件。

添加此弃用警告是由于 Kotlin Multiplatform 的项目模型与 Gradle 的 Java 生态系统插件之间存在根本的兼容性问题。Gradle 的 Java 生态系统插件目前未考虑到其他插件可能会：

* 也会以与 Java 生态系统插件不同的方式为 JVM 目标发布或编译。
* 在同一个项目中拥有两个不同的 JVM 目标，例如 JVM 和 Android。
* 具有复杂的多平台项目结构，可能包含多个非 JVM 目标。

不幸的是，Gradle 目前没有提供任何 API 来解决这些问题。

我们之前在 Kotlin Multiplatform 中使用了一些临时变通方法来协助 Java 生态系统插件的集成。
然而，这些变通方法从未真正解决兼容性问题，且自 Gradle 8.8 发布以来，这些变通方法已不再可行。有关更多信息，请参阅我们的 [YouTrack 问题](https://youtrack.jetbrains.com/issue/KT-66542/Gradle-JVM-target-with-withJava-produces-a-deprecation-warning)。

虽然我们尚不确定如何解决此兼容性问题，但我们致力于继续支持在 Kotlin Multiplatform 项目中进行某种形式的 Java 源码编译。至少，我们将支持 Java 源码的编译，并支持在多平台项目中使用 Gradle 的 [`java-base`](https://docs.gradle.org/current/javadoc/org/gradle/api/plugins/JavaBasePlugin.html) 插件。

与此同时，如果您在多平台项目中看到此弃用警告，我们建议您：
1. 确定您的项目是否真正需要 Gradle Java 插件。如果不需要，请考虑将其移除。
2. 检查 Gradle Java 插件是否仅用于单个任务。如果是，您或许可以毫不费力地移除该插件。例如，如果该任务使用 Gradle Java 插件来创建 Javadoc JAR 文件，您可以改为手动定义 Javadoc 任务。

否则，如果您希望在多平台项目中同时使用 Kotlin Multiplatform Gradle 插件和这些 Java 的 Gradle 插件，我们建议您：

1. 在多平台项目中创建一个单独的子项目。
2. 在该单独的子项目中，应用 Java 的 Gradle 插件。
3. 在该单独的子项目中，添加对父多平台项目的依赖项。

> 该单独的子项目**不得**是多平台项目，您必须仅使用它来设置对多平台项目的依赖项。
>
{style="warning"}

例如，您有一个名为 `my-main-project` 的多平台项目，并且您想使用 [Application](https://docs.gradle.org/current/userguide/application_plugin.html) Gradle 插件来运行 JVM 应用程序。

创建子项目（假设名为 `subproject-A`）后，您的父项目结构应如下所示：

```text
.
├── build.gradle.kts
├── settings.gradle
├── subproject-A
    └── build.gradle.kts
    └── src
        └── Main.java
```

在子项目的 `build.gradle.kts` 文件中，于 `plugins {}` 块内应用 Application 插件：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
plugins {
    id("application")
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
plugins {
    id('application')
}
```

</tab>
</tabs>

在子项目的 `build.gradle.kts` 文件中，添加对父多平台项目的依赖项：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
dependencies {
    implementation(project(":my-main-project")) // 父多平台项目的名称
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
dependencies {
    implementation project(':my-main-project') // 父多平台项目的名称
}
```

</tab>
</tabs>

您的父项目现在已设置为可以同时使用这两个插件。

## Kotlin/Native

Kotlin/Native 在垃圾回收器以及从 Swift/Objective-C 调用 Kotlin 挂起函数方面获得了改进。

### 垃圾回收器中的并发标记

在 Kotlin 2.0.20 中，JetBrains 团队在提高 Kotlin/Native 运行时性能方面又迈出了一步。
我们在垃圾回收器 (GC) 中添加了对并发标记的实验性支持。

默认情况下，当 GC 正在标记堆中的对象时，应用程序线程必须暂停。这极大地影响了 GC 暂停时间的长短，这对于对延迟敏感的应用程序（如使用 Compose Multiplatform 构建的 UI 应用程序）的性能至关重要。

现在，垃圾回收的标记阶段可以与应用程序线程同时运行。
这应该会显著缩短 GC 暂停时间，并有助于提高应用程序的响应能力。

#### 如何启用

此功能目前处于[实验性 (Experimental)](components-stability.md#stability-levels-explained)。
要启用它，请在您的 `gradle.properties` 文件中设置以下选项：

```none
kotlin.native.binary.gc=cms
```

请向我们的问题跟踪器 [YouTrack](https://kotl.in/issue) 报告任何问题。

### 移除了对 bitcode 嵌入的支持

从 Kotlin 2.0.20 开始，Kotlin/Native 编译器不再支持 bitcode 嵌入。
Bitcode 嵌入在 Xcode 14 中被弃用，并在 Xcode 15 中针对所有 Apple 目标被移除。

现在，框架配置的 `embedBitcode` 参数以及 `-Xembed-bitcode` 和 `-Xembed-bitcode-marker` 命令行参数已被弃用。

如果您仍在使用较早版本的 Xcode 但希望升级到 Kotlin 2.0.20，请在您的 Xcode 项目中禁用 bitcode 嵌入。

### 通过 signpost 监控 GC 性能的变更

Kotlin 2.0.0 实现了通过 Xcode Instruments 监控 Kotlin/Native 垃圾回收器 (GC) 性能的功能。Instruments 包含 signpost 工具，可以将 GC 暂停显示为事件。
这在检查 iOS 应用程序中与 GC 相关的卡顿时非常有用。

该功能曾默认启用，但遗憾的是，当应用程序与 Xcode Instruments 同时运行时，有时会导致崩溃。
从 Kotlin 2.0.20 开始，它需要通过以下编译器选项显式启用：

```none
-Xbinary=enableSafepointSignposts=true
```

在[文档](native-memory-manager.md#monitor-gc-performance)中详细了解 GC 性能分析。

### 在非主线程上从 Swift/Objective-C 调用 Kotlin 挂起函数的能力

以前，Kotlin/Native 有一个默认限制，即限制从 Swift 和 Objective-C 调用 Kotlin 挂起函数的能力只能在主线程上进行。Kotlin 2.0.20 取消了这一限制，允许您在任何线程上从 Swift/Objective-C 运行 Kotlin `suspend` 函数。

如果您之前通过 `kotlin.native.binary.objcExportSuspendFunctionLaunchThreadRestriction=none` 二进制选项更改了非主线程的默认行为，现在可以将其从 `gradle.properties` 文件中移除。

## Kotlin/Wasm

在 Kotlin 2.0.20 中，Kotlin/Wasm 继续向具名导出 (named exports) 迁移，并重新放置了 `@ExperimentalWasmDsl` 注解。

### 默认导出用法错误

作为向具名导出迁移的一部分，之前在 JavaScript 中对 Kotlin/Wasm 导出项使用默认导入 (default import) 时，控制台会打印一条警告消息。

为了全面支持具名导出，此警告现在已升级为错误。如果您使用默认导入，将会遇到以下错误消息：

```text
Do not use default import. Use the corresponding named import instead.
```

此变更属于向具名导出迁移的弃用周期的一部分。以下是各阶段的预期情况：

* **在 2.0.0 版本中**：控制台会打印一条警告消息，说明通过默认导出导出实体已弃用。
* **在 2.0.20 版本中**：发生错误，要求使用对应的具名导入。
* **在 2.1.0 版本中**：完全移除对默认导入的使用。

### ExperimentalWasmDsl 注解的新位置

以前，WebAssembly (Wasm) 功能的 `@ExperimentalWasmDsl` 注解位于 Kotlin Gradle 插件的以下位置：

```Kotlin
org.jetbrains.kotlin.gradle.targets.js.dsl.ExperimentalWasmDsl
```

在 2.0.20 中，`@ExperimentalWasmDsl` 注解已迁移到：

```Kotlin
org.jetbrains.kotlin.gradle.ExperimentalWasmDsl
```

以前的位置现已弃用，并可能由于未解析的引用而导致构建失败。

为了反映 `@ExperimentalWasmDsl` 注解的新位置，请更新 Gradle 构建脚本中的 import 语句。
为新的 `@ExperimentalWasmDsl` 位置使用显式导入：

```kotlin
import org.jetbrains.kotlin.gradle.ExperimentalWasmDsl
```

或者，从旧软件包中移除此通配符导入 (star import) 语句：

```kotlin
import org.jetbrains.kotlin.gradle.targets.js.dsl.*
```

## Kotlin/JS

Kotlin/JS 引入了一些实验性功能，以支持 JavaScript 中的静态成员以及从 JavaScript 创建 Kotlin 集合。

### 在 JavaScript 中支持使用 Kotlin 静态成员

> 此功能是[实验性 (Experimental)](components-stability.md#stability-levels-explained)的。它可能随时被放弃或更改。
> 请仅将其用于评估目的。我们欢迎您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-18891/JS-provide-a-way-to-declare-static-members-JsStatic) 上提供反馈。
>
{style="warning"}

从 Kotlin 2.0.20 开始，您可以使用 `@JsStatic` 注解。它的工作方式类似于 [@JvmStatic](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvm-static/)，并指示编译器为目标声明生成额外的静态方法。这有助于您直接在 JavaScript 中使用 Kotlin 代码中的静态成员。

您可以对具名对象中定义的函数，以及在类和接口内部声明的伴生对象中的函数使用 `@JsStatic` 注解。编译器会同时生成对象的静态方法和对象本身的实例方法。例如：

```kotlin
class C {
    companion object {
        @JsStatic
        fun callStatic() {}
        fun callNonStatic() {}
    }
}
```

现在，`callStatic()` 在 JavaScript 中是静态的，而 `callNonStatic()` 则不是：

```javascript
C.callStatic();              // 有效，访问静态函数
C.callNonStatic();           // 错误，在生成的 JavaScript 中不是静态函数
C.Companion.callStatic();    // 实例方法依然存在
C.Companion.callNonStatic(); // 唯一有效的方式
```

也可以将 `@JsStatic` 注解应用于对象或伴生对象的属性，使其 getter 和 setter 方法成为该对象或包含伴生对象的类中的静态成员。

### 从 JavaScript 创建 Kotlin 集合的能力

> 此功能是[实验性 (Experimental)](components-stability.md#stability-levels-explained)的。它可能随时被放弃或更改。
> 请仅将其用于评估目的。我们欢迎您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-69133/Kotlin-JS-Add-support-for-collection-instantiation-in-JavaScript) 上提供反馈。
>
{style="warning"}

Kotlin 2.0.0 引入了将 Kotlin 集合导出到 JavaScript（和 TypeScript）的功能。现在，JetBrains 团队在改进集合互操作性方面又迈出了一步。从 Kotlin 2.0.20 开始，可以直接从 JavaScript/TypeScript 端创建 Kotlin 集合。

您可以从 JavaScript 创建 Kotlin 集合，并将它们作为参数传递给导出的构造函数或函数。
只要您在导出的声明中提及集合，Kotlin 就会为该集合生成一个在 JavaScript/TypeScript 中可用的工厂。

请看以下导出的函数：

```kotlin
// Kotlin
@JsExport
fun consumeMutableMap(map: MutableMap<String, Int>)
```

由于提到了 `MutableMap` 集合，Kotlin 会生成一个带有工厂方法的对象，该方法可在 JavaScript/TypeScript 中使用。
该工厂方法随后会从 JavaScript 的 `Map` 创建一个 `MutableMap`：

```javascript
// JavaScript
import { consumeMutableMap } from "an-awesome-kotlin-module"
import { KtMutableMap } from "an-awesome-kotlin-module/kotlin-kotlin-stdlib"

consumeMutableMap(
    KtMutableMap.fromJsMap(new Map([["First", 1], ["Second", 2]]))
)
```

此功能适用于 `Set`、`Map` 和 `List` Kotlin 集合类型及其对应的可变版本。

## Gradle

Kotlin 2.0.20 与 Gradle 6.8.3 到 8.6 完全兼容。Gradle 8.7 和 8.8 也受支持，只有一个例外：如果您使用 Kotlin Multiplatform Gradle 插件，您可能会在多平台项目中调用 JVM 目标中的 `withJava()` 函数时看到弃用警告。我们计划尽快修复此问题。

有关更多信息，请参阅 [YouTrack](https://youtrack.jetbrains.com/issue/KT-66542/Gradle-JVM-target-with-withJava-produces-a-deprecation-warning) 中的问题。

您也可以使用最高到最新版本的 Gradle，但如果这样做，请记住您可能会遇到弃用警告，或者某些新的 Gradle 功能可能无法正常工作。

此版本带来了一些变更，例如开始弃用基于 JVM 历史文件的旧增量编译方法，以及一种在项目之间共享 JVM 构件的新方法。

### 弃用基于 JVM 历史文件的增量编译

在 Kotlin 2.0.20 中，基于 JVM 历史文件的增量编译方法已被弃用，取而代之的是自 Kotlin 1.8.20 起默认启用的新增量编译方法。

基于 JVM 历史文件的增量编译方法存在局限性，例如无法与 [Gradle 的构建缓存 (build cache)](https://docs.gradle.org/current/userguide/build_cache.html) 配合使用，也不支持编译规避 (compilation avoidance)。
相比之下，新的增量编译方法克服了这些局限性，自推出以来表现良好。

鉴于新的增量编译方法在过去两个主要的 Kotlin 版本中已被默认使用，
`kotlin.incremental.useClasspathSnapshot` Gradle 属性在 Kotlin 2.0.20 中被弃用。
因此，如果您使用它来关闭该功能，将会看到弃用警告。

### 将 Gradle 项目间的 JVM 构件作为类文件共享的选项

> 此功能是[实验性 (Experimental)](components-stability.md#stability-levels-explained)的。
> 它可能随时被放弃或更改。请仅将其用于评估目的。
> 我们欢迎您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-61861/Gradle-Kotlin-compilations-depend-on-packed-artifacts) 上提供反馈。
> 需要显式开启（详情见下文）。
>
{style="warning"}

在 Kotlin 2.0.20 中，我们引入了一种新方法，改变了 Kotlin/JVM 编译输出（如 JAR 文件）在项目间共享的方式。通过这种方法，Gradle 的 `apiElements` 配置现在有了一个辅助变体，该变体提供对包含编译后的 `.class` 文件的目录的访问。配置后，您的项目在编译期间将使用此目录，而不是请求压缩的 JAR 构件。这减少了 JAR 文件被压缩和解压缩的次数，尤其是对于增量构建。

我们的测试表明，这种新方法可以为 Linux 和 macOS 主机提供构建性能提升。
然而，在 Windows 主机上，我们观察到性能有所下降，这是由于 Windows 在处理文件时的 I/O 操作方式所致。

要尝试这种新方法，请在您的 `gradle.properties` 文件中添加以下属性：

```none
kotlin.jvm.addClassesVariant=true
```

默认情况下，此属性设置为 `false`，Gradle 中的 `apiElements` 变体会请求压缩的 JAR 构件。

> Gradle 有一个相关属性，您可以在仅限 Java 的项目中使用该属性，以便在编译期间**仅**公开压缩的 JAR 构件，而不公开包含编译后的 `.class` 文件的目录：
>
> ```none
> org.gradle.java.compile-classpath-packaging=true
> ```
>
> 有关此属性及其用途的更多信息，
> 请参阅 Gradle 关于 [Windows 上大型多项目的构建性能显著下降](https://docs.gradle.org/current/userguide/java_library_plugin.html#sub:java_library_known_issues_windows_performance)的文档。
>
{style="note"}

我们欢迎您对这种新方法提供反馈。您在使用它时是否注意到了性能提升？
请通过在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-61861/Gradle-Kotlin-compilations-depend-on-packed-artifacts) 中添加评论来告诉我们。

### 使 Kotlin Gradle 插件的依赖行为与 java-test-fixtures 插件对齐

在 Kotlin 2.0.20 之前，如果您在项目中使用 [`java-test-fixtures` 插件](https://docs.gradle.org/current/userguide/java_testing.html#sec:java_test_fixtures)，Gradle 和 Kotlin Gradle 插件在依赖项传播方式上存在差异。

Kotlin Gradle 插件传播了以下依赖项：

* 从 `java-test-fixtures` 插件的 `implementation` 和 `api` 依赖类型传播到 `test` 源集的编译类路径。
* 从主源集的 `implementation` 和 `api` 依赖类型传播到 `java-test-fixtures` 插件源集的编译类路径。

然而，Gradle 仅传播 `api` 依赖类型中的依赖项。

这种行为差异导致某些项目在类路径中多次发现资源文件。

从 Kotlin 2.0.20 开始，Kotlin Gradle 插件的行为与 Gradle 的 `java-test-fixtures` 插件对齐，因此对于此插件或其他 Gradle 插件，此问题将不再发生。

作为此变更的结果，`test` 和 `testFixtures` 源集中的某些依赖项可能不再可访问。
如果发生这种情况，请将依赖项声明类型从 `implementation` 更改为 `api`，或者在受影响的源集上添加新的依赖项声明。

### 为极少数编译任务缺少构件依赖项的情况添加了任务依赖

在 2.0.20 之前，我们发现存在编译任务缺少其某个构件输入的任务依赖项的情况。这意味着依赖的编译任务结果是不稳定的，因为构件有时能及时生成，有时则不能。

为了解决此问题，Kotlin Gradle 插件现在会在这些情况下自动添加所需的任务依赖项。

在极少数情况下，我们发现这种新行为可能会导致循环依赖错误。
例如，如果您有多个编译任务，其中一个编译任务可以看到另一个编译任务的所有内部声明，且生成的构件依赖于这两个编译任务的输出，您可能会看到如下错误：

```none
FAILURE: Build failed with an exception.

What went wrong:
Circular dependency between the following tasks:
:lib:compileKotlinJvm
--- :lib:jvmJar
     \--- :lib:compileKotlinJvm (*)
(*) - details omitted (listed previously)
```

为了修复此循环依赖错误，我们添加了一个 Gradle 属性：`archivesTaskOutputAsFriendModule`。

默认情况下，此属性设置为 `true` 以跟踪任务依赖项。要禁用在编译任务中使用构件（从而不需要任务依赖项），请在您的 `gradle.properties` 文件中添加以下内容：

```kotlin
kotlin.build.archivesTaskOutputAsFriendModule=false
```

有关更多信息，请参阅 [YouTrack](https://youtrack.jetbrains.com/issue/KT-69330) 中的问题。

## Compose 编译器

在 Kotlin 2.0.20 中，Compose 编译器获得了一些改进。

### 修复了 2.0.0 中引入的不必要重组问题

Compose 编译器 2.0.0 存在一个问题，即在具有非 JVM 目标的多平台项目中，它有时会错误地推断类型的稳定性。这可能会导致不必要的（甚至是无限的）重组。我们强烈建议将针对 Kotlin 2.0.0 的 Compose 应用更新至 2.0.10 或更高版本。

如果您的应用是使用 Compose 编译器 2.0.10 或更高版本构建的，但使用了使用 2.0.0 版本构建的依赖项，这些旧依赖项仍可能导致重组问题。
为了防止这种情况，请将您的依赖项更新为使用与您的应用相同的 Compose 编译器构建的版本。

### 配置编译器选项的新方式

我们引入了一种新的选项配置机制，以避免顶层参数的频繁变动。
对于 Compose 编译器团队来说，通过为 `composeCompiler {}` 块创建或移除顶层条目来测试功能是比较困难的。
因此，强跳过模式 (strong skipping mode) 和非跳过组优化等选项现在通过 `featureFlags` 属性启用。
此属性将用于测试最终将成为默认选项的新 Compose 编译器选项。

此变更也已应用于 Compose 编译器 Gradle 插件。要配置未来的功能标志 (feature flags)，请使用以下语法（此代码将翻转所有默认值）：

```kotlin
composeCompiler {
    featureFlags = setOf(
        ComposeFeatureFlag.IntrinsicRemember.disabled(),
        ComposeFeatureFlag.OptimizeNonSkippingGroups,
        ComposeFeatureFlag.StrongSkipping.disabled()
    )
}
```

或者，如果您直接配置 Compose 编译器，请使用以下语法：

```text
-P plugin:androidx.compose.compiler.plugins.kotlin:featureFlag=IntrinsicRemember
```

因此，`enableIntrinsicRemember`、`enableNonSkippingGroupOptimization` 和 `enableStrongSkippingMode` 属性已被弃用。

我们欢迎您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-68651/Compose-provide-a-single-place-in-extension-to-configure-all-compose-flags) 上对这种新方法提供任何反馈。

### 默认启用强跳过模式

Compose 编译器的强跳过模式 (strong skipping mode) 现在默认启用。

强跳过模式是一种 Compose 编译器配置选项，它改变了哪些 composable 函数可以被跳过的规则。
启用强跳过模式后，带有不稳定参数的 composable 函数现在也可以被跳过。
强跳过模式还会自动记住 (remember) 在 composable 函数中使用的 lambda，因此您不再需要用 `remember` 包装 lambda 以避免重组。

有关更多详细信息，请参阅[强跳过模式文档](https://developer.android.com/develop/ui/compose/performance/stability/strongskipping)。

### 默认启用组合跟踪标记

在 Compose 编译器 Gradle 插件中，`includeTraceMarkers` 选项现在默认设置为 `true`，以匹配编译器插件中的默认值。这允许您在 Android Studio 系统跟踪分析器中查看 composable 函数。有关组合跟踪 (composition tracing) 的详细信息，请参阅这篇 [Android Developers 博客文章](https://medium.com/androiddevelopers/jetpack-compose-composition-tracing-9ec2b3aea535)。

### 非跳过组优化

此版本包含一个新的编译器选项：启用后，不可跳过且不可重启的 composable 函数将不再在函数体周围生成组 (group)。这会减少内存分配，从而提高性能。
此选项是实验性的，默认禁用，但可以通过 `OptimizeNonSkippingGroups` 功能标志启用，如[上文](#new-way-to-configure-compiler-options)所示。

该功能标志现在已准备好进行更广泛的测试。启用该功能时发现的任何问题都可以在 [Google 问题跟踪器](https://goo.gle/compose-feedback)上提交。

### 支持抽象 composable 函数中的默认参数

您现在可以向抽象 composable 函数添加默认参数。

以前，即使这是有效的 Kotlin 代码，Compose 编译器在尝试这样做时也会报错。
我们现在在 Compose 编译器中添加了对此功能的支持，并移除了该限制。
这对于包含默认 `Modifier` 值特别有用：

```kotlin
abstract class Composables {
    @Composable
    abstract fun Composable(modifier: Modifier = Modifier)
}
```

2.0.20 中仍然限制 open composable 函数的默认参数。此限制将在未来的版本中解决。

## 标准库

标准库现在将通用唯一标识符 (UUID) 作为一项实验性功能支持，并包含对 Base64 解码的一些变更。

### Kotlin 公共标准库中对 UUID 的支持

> 此功能是[实验性 (Experimental)](components-stability.md#stability-levels-explained)的。
> 要开启此功能，请使用 `@ExperimentalUuidApi` 注解或编译器选项 `-opt-in=kotlin.uuid.ExperimentalUuidApi`。
>
{style="warning"}

Kotlin 2.0.20 在 Kotlin 公共标准库中引入了一个用于表示 [UUID (通用唯一标识符)](https://en.wikipedia.org/wiki/Universally_unique_identifier) 的类，以解决唯一标识条目的挑战。

此外，此功能还为以下 UUID 相关操作提供了 API：

* 生成 UUID。
* 从字符串表示形式解析 UUID 以及将其格式化为字符串。
* 从指定的 128 位值创建 UUID。
* 访问 UUID 的 128 位数据。

以下代码示例演示了这些操作：

```kotlin
// 构建用于创建 UUID 的字节数组
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
// true

// 访问 UUID 位
val version = uuid1.toLongs { mostSignificantBits, _ ->
    ((mostSignificantBits shr 12) and 0xF).toInt()
}
println(version)
// 4

// 生成一个随机 UUID
val randomUuid = Uuid.random()

println(uuid1 == randomUuid)
// false
```

为了保持与使用 `java.util.UUID` 的 API 的兼容性，Kotlin/JVM 中有两个扩展函数用于在 `java.util.UUID` 和 `kotlin.uuid.Uuid` 之间进行转换：`.toJavaUuid()` 和 `.toKotlinUuid()`。例如：

```kotlin
val kotlinUuid = Uuid.parseHex("550e8400e29b41d4a716446655440000")
// 将 Kotlin UUID 转换为 java.util.UUID
val javaUuid = kotlinUuid.toJavaUuid()

val javaUuid = java.util.UUID.fromString("550e8400-e29b-41d4-a716-446655440000")
// 将 Java UUID 转换为 kotlin.uuid.Uuid
val kotlinUuid = javaUuid.toKotlinUuid()
```

此功能和提供的 API 允许在多个平台之间共享代码，从而简化了多平台软件开发。UUID 也非常适合难以生成唯一标识符的环境。

UUID 的一些示例用例包括：

* 为数据库记录分配唯一 ID。
* 生成 Web 会话标识符。
* 任何需要唯一标识或跟踪的场景。

### HexFormat 中添加对 minLength 的支持

> [`HexFormat`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-hex-format/) 类及其属性是[实验性 (Experimental)](components-stability.md#stability-levels-explained)的。
> 要开启此功能，请使用 `@OptIn(ExperimentalStdlibApi::class)` 注解或编译器选项 `-opt-in=kotlin.ExperimentalStdlibApi`。
>
{style="warning"}

Kotlin 2.0.20 为 [`NumberHexFormat`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-hex-format/-number-hex-format/) 类添加了一个新的 `minLength` 属性，可通过 [`HexFormat.number`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-hex-format/number.html) 访问。
此属性允许您指定数值的十六进制表示形式中的最小位数，从而能够通过补零来满足所需的长度。此外，还可以使用 `removeLeadingZeros` 属性来修剪前导零：

```kotlin
fun main() {
    println(93.toHexString(HexFormat {
        number.minLength = 4
        number.removeLeadingZeros = true
    }))
    // "005d"
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.0" id="kotlin-2-0-20-minlength-hexformat" validate="false"}

`minLength` 属性不影响解析。但是，如果多余的前导位是零，解析现在允许十六进制字符串的位数多于该类型的宽度。

### Base64 解码器行为的变更

> [`Base64` 类](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io.encoding/-base64/)及其相关功能是[实验性 (Experimental)](components-stability.md#stability-levels-explained)的。
> 要开启此功能，请使用 `@OptIn(ExperimentalEncodingApi::class)` 注解或编译器选项 `-opt-in=kotlin.io.encoding.ExperimentalEncodingApi`。
>
{style="warning"}

Kotlin 2.0.20 中对 Base64 解码器的行为引入了两项变更：

* [Base64 解码器现在要求填充 (padding)](#the-base64-decoder-now-requires-padding)
* [添加了用于填充配置的 `withPadding` 函数](#withpadding-function-for-padding-configuration)

#### Base64 解码器现在要求填充

Base64 编码器现在默认添加填充，而解码器在解码时要求填充并禁止非零填充位。

#### 用于填充配置的 withPadding 函数

引入了一个新的 `.withPadding()` 函数，让用户能够控制 Base64 编码和解码的填充行为：

```kotlin
val base64 = Base64.UrlSafe.withPadding(Base64.PaddingOption.ABSENT_OPTIONAL)
```

此函数可以创建具有不同填充选项的 `Base64` 实例：

| `PaddingOption`    | 编码时       | 解码时              |
|--------------------|--------------|---------------------|
| `PRESENT`          | 添加填充     | 填充是必需的        |
| `ABSENT`           | 省略填充     | 不允许填充          |
| `PRESENT_OPTIONAL` | 添加填充     | 填充是可选的        |
| `ABSENT_OPTIONAL`  | 省略填充     | 填充是可选的        |

您可以创建具有不同填充选项的 `Base64` 实例，并使用它们来编码和解码数据：

```kotlin
import kotlin.io.encoding.Base64
import kotlin.io.encoding.ExperimentalEncodingApi

@OptIn(ExperimentalEncodingApi::class)
fun main() {
    // 要编码的示例数据
    val data = "fooba".toByteArray()

    // 创建一个具有 URL 安全字母表和 PRESENT 填充的 Base64 实例
    val base64Present = Base64.UrlSafe.withPadding(Base64.PaddingOption.PRESENT)
    val encodedDataPresent = base64Present.encode(data)
    println("使用 PRESENT 填充编码的数据: $encodedDataPresent")
    // 使用 PRESENT 填充编码的数据: Zm9vYmE=

    // 创建一个具有 URL 安全字母表和 ABSENT 填充的 Base64 实例
    val base64Absent = Base64.UrlSafe.withPadding(Base64.PaddingOption.ABSENT)
    val encodedDataAbsent = base64Absent.encode(data)
    println("使用 ABSENT 填充编码的数据: $encodedDataAbsent")
    // 使用 ABSENT 填充编码的数据: Zm9vYmE

    // 将数据解码回来
    val decodedDataPresent = base64Present.decode(encodedDataPresent)
    println("使用 PRESENT 填充解码的数据: ${String(decodedDataPresent)}")
    // 使用 PRESENT 填充解码的数据: fooba

    val decodedDataAbsent = base64Absent.decode(encodedDataAbsent)
    println("使用 ABSENT 填充解码的数据: ${String(decodedDataAbsent)}")
    // 使用 ABSENT 填充解码的数据: fooba
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.0" id="kotlin-2-0-20-base64-decoder" validate="false"}

## 文档更新

Kotlin 文档进行了一些显著的变更：

* 改进了[标准输入页面](standard-input.md) - 了解如何使用 Java Scanner 和 `readln()`。
* 改进了 [K2 编译器迁移指南](k2-compiler-migration-guide.md) - 了解性能改进、与 Kotlin 库的兼容性以及如何处理自定义编译器插件。
* 改进了[异常页面](exceptions.md) - 了解异常，以及如何抛出和捕获它们。
* 改进了[在 JVM 中使用 JUnit 测试代码 - 教程](jvm-test-using-junit.md) - 了解如何使用 JUnit 创建测试。
* 改进了[与 Swift/Objective-C 的互操作性页面](native-objc-interop.md) - 了解如何在 Swift/Objective-C 代码中使用 Kotlin 声明，以及在 Kotlin 代码中使用 Objective-C 声明。
* 改进了 [Swift 软件包导出设置页面](https://kotlinlang.org/docs/multiplatform/multiplatform-spm-export.html) - 了解如何设置可由 Swift 软件包管理器依赖项使用的 Kotlin/Native 输出。

## 安装 Kotlin 2.0.20

从 IntelliJ IDEA 2023.3 和 Android Studio Iguana (2023.2.1) Canary 15 开始，Kotlin 插件作为 IDE 中包含的捆绑插件分发。这意味着您无法再从 JetBrains Marketplace 安装该插件。

要更新到新的 Kotlin 版本，请在构建脚本中将 [Kotlin 版本更改](releases.md#update-to-a-new-kotlin-version)为 2.0.20。