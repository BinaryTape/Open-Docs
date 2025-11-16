[//]: # (title: Kotlin 2.0.20 的新特性)

_[发布时间：2024 年 8 月 22 日](releases.md#release-details)_

Kotlin 2.0.20 版本已发布！此版本包含 Kotlin 2.0.0 的性能改进和错误修复，在 2.0.0 中我们
宣布 Kotlin K2 编译器已稳定。以下是此版本的一些额外亮点：

* [数据类 copy 函数与构造函数保持相同可见性](#data-class-copy-function-to-have-the-same-visibility-as-constructor)
* [默认目标层级结构中源代码集的静态访问器现已在多平台项目中可用](#static-accessors-for-source-sets-from-the-default-target-hierarchy)
* [Kotlin/Native 的垃圾回收器中已支持并发标记](#concurrent-marking-in-garbage-collector)
* [Kotlin/Wasm 中的 `@ExperimentalWasmDsl` 注解有了新的位置](#new-location-of-experimentalwasmdsl-annotation)
* [已添加对 Gradle 8.6–8.8 版本的支持](#gradle)
* [一个新选项允许在 Gradle 项目之间以类文件的形式共享 JVM artifact](#option-to-share-jvm-artifacts-between-projects-as-class-files)
* [Compose 编译器已更新](#compose-compiler)
* [公共 Kotlin 标准库中已添加对 UUID 的支持](#support-for-uuids-in-the-common-kotlin-standard-library)

## IDE 支持

支持 2.0.20 的 Kotlin 插件已捆绑在最新的 IntelliJ IDEA 和 Android Studio 中。
您无需在 IDE 中更新 Kotlin 插件。
您只需在构建脚本中将 Kotlin 版本更改为 2.0.20。

关于 [更新到新版本](releases.md#update-to-a-new-kotlin-version) 请参见详细信息。

## 语言

Kotlin 2.0.20 开始引入更改，以改进数据类的一致性并替换实验性的 context receiver 特性。

### 数据类 copy 函数与构造函数保持相同可见性

目前，如果您使用 `private` 构造函数创建数据类，自动生成的 `copy()` 函数不会
具有相同的可见性。这可能会在您的代码中导致问题。在未来的 Kotlin 版本中，我们将引入
`copy()` 函数的默认可见性与构造函数相同的行为。此更改将
逐步引入，以帮助您尽可能顺利地迁移代码。

我们的迁移计划从 Kotlin 2.0.20 开始，它会在您的代码中发出警告，指出可见性将在
未来发生变化。例如：

```kotlin
// Triggers a warning in 2.0.20
data class PositiveInteger private constructor(val number: Int) {
    companion object {
        fun create(number: Int): PositiveInteger? = if (number > 0) PositiveInteger(number) else null
    }
}

fun main() {
    val positiveNumber = PositiveInteger.create(42) ?: return
    // Triggers a warning in 2.0.20
    val negativeNumber = positiveNumber.copy(number = -1)
    // Warning: Non-public primary constructor is exposed via the generated 'copy()' method of the 'data' class.
    // The generated 'copy()' will change its visibility in future releases.
}
```

关于我们迁移计划的最新信息，请参见 [YouTrack](https://youtrack.jetbrains.com/issue/KT-11914) 中的相应问题。

为了让您对此行为有更多控制，在 Kotlin 2.0.20 中我们引入了两个注解：

* `@ConsistentCopyVisibility`：用于现在选择此行为，以便在后续版本中将其设为默认值。
* `@ExposedCopyVisibility`：用于选择退出此行为并抑制声明站点的警告。
  请注意，即使有此注解，当调用 `copy()` 函数时，编译器仍会报告警告。

如果您想在 2.0.20 中为整个模块而非单个类选择启用新行为，
您可以使用 `-Xconsistent-data-class-copy-visibility` 编译器选项。
此选项的效果与向模块中的所有数据类添加 `@ConsistentCopyVisibility` 注解相同。

### context receiver 逐步替换为 context parameter

在 Kotlin 1.6.20 中，我们引入了 [context receiver](whatsnew1620.md#prototype-of-context-receivers-for-kotlin-jvm) 作为一项
[实验性](components-stability.md#stability-levels-explained) 特性。在听取社区反馈后，我们决定
不继续采用此方法，并将采取不同的方向。

在未来的 Kotlin 版本中，context receiver 将被 context parameter 替换。Context parameter 仍处于
设计阶段，您可以在 [KEEP](https://github.com/Kotlin/KEEP/blob/context-parameters/proposals/context-parameters.md) 中找到该提案。

由于 context parameter 的实现需要对编译器进行重大更改，我们决定不同时支持
context receiver 和 context parameter。这一决定大大简化了实现并最大程度地减少了
不稳定行为的风险。

我们理解 context receiver 已被大量开发者使用。因此，我们将开始
逐步移除对 context receiver 的支持。我们的迁移计划从 Kotlin 2.0.20 开始，在使用
`-Xcontext-receivers` 编译器选项时，您的代码中会发出有关使用 context receiver 的警告。例如：

```kotlin
class MyContext

context(MyContext)
// Warning: Experimental context receivers are deprecated and will be superseded by context parameters. 
// Please don't use context receivers. You can either pass parameters explicitly or use members with extensions.
fun someFunction() {
}
```

此警告将在未来的 Kotlin 版本中变为错误。

如果您在代码中使用 context receiver，我们建议您将代码迁移为使用以下任一方式：

* 显式形参（Explicit parameters）。

   <table>
      <tr>
          <td>之前</td>
          <td>之后</td>
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
          <td>之前</td>
          <td>之后</td>
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

或者，您可以等到编译器支持 context parameter 的 Kotlin 版本。请注意，
context parameter 最初将作为一项实验性特性引入。

## Kotlin Multiplatform

Kotlin 2.0.20 改进了多平台项目中的源代码集管理，并由于 Gradle 的最新更改，弃用了与某些 Gradle Java 插件的兼容性。

### 默认目标层级结构中源代码集的静态访问器

自 Kotlin 1.9.20 起，[默认层级结构模板](https://kotlinlang.org/docs/multiplatform/multiplatform-hierarchy.html#default-hierarchy-template)
会自动应用于所有 Kotlin Multiplatform 项目。
对于默认层级结构模板中的所有源代码集，Kotlin Gradle 插件提供了类型安全的访问器。
这样，您最终可以访问所有指定目标的源代码集，而无需使用 `by getting` 或 `by creating` 构造。

Kotlin 2.0.20 旨在进一步改善您的 IDE 体验。它现在在
`sourceSets {}` 代码块中为默认层级结构模板中的所有源代码集提供了静态访问器。
我们相信此更改将使按名称访问源代码集更容易且更可预测。

每个此类源代码集现在都有详细的 KDoc 注释，其中包含示例和诊断消息，并在您尝试
在未首先声明相应目标的情况下访问源代码集时发出警告：

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

![Accessing the source sets by name](accessing-sourse-sets.png){width=700}

关于 [Kotlin Multiplatform 中的层级项目结构](https://kotlinlang.org/docs/multiplatform/multiplatform-hierarchy.html) 请了解更多信息。

### 弃用 Kotlin Multiplatform Gradle 插件与 Gradle Java 插件的兼容性

在 Kotlin 2.0.20 中，当您将 Kotlin Multiplatform Gradle 插件和
以下任何 Gradle Java 插件应用于同一项目时，我们会引入弃用警告：[Java](https://docs.gradle.org/current/userguide/java_plugin.html)、
[Java Library](https://docs.gradle.org/current/userguide/java_library_plugin.html) 和 [Application](https://docs.gradle.org/current/userguide/application_plugin.html)。
当您的多平台项目中的另一个 Gradle 插件应用 Gradle Java 插件时，也会出现此警告。
例如，[Spring Boot Gradle Plugin](https://docs.spring.io/spring-boot/gradle-plugin/index.html) 会自动
应用 Application 插件。

我们添加此弃用警告是由于 Kotlin Multiplatform 的项目模型
与 Gradle 的 Java 生态系统插件之间存在根本性的兼容性问题。Gradle 的 Java 生态系统插件目前没有考虑到其他插件可能：

* 也以与 Java 生态系统插件不同的方式为 JVM 目标发布或编译。
* 在同一项目中有两个不同的 JVM 目标，例如 JVM 和 Android。
* 具有复杂的多平台项目结构，可能包含多个非 JVM 目标。

不幸的是，Gradle 目前没有提供任何 API 来解决这些问题。

我们之前在 Kotlin Multiplatform 中使用了一些变通方法来帮助集成 Java 生态系统插件。
然而，这些变通方法从未真正解决兼容性问题，并且自 Gradle 8.8 发布以来，这些变通方法
已不再可能。关于更多信息，请参见我们的 [YouTrack 问题](https://youtrack.jetbrains.com/issue/KT-66542/Gradle-JVM-target-with-withJava-produces-a-deprecation-warning)。

虽然我们尚不清楚如何确切地解决此兼容性问题，但我们致力于继续支持
您的 Kotlin Multiplatform 项目中的某种形式的 Java 源代码编译。最低限度，我们将支持
Java 源代码的编译以及在您的多平台项目中使用 Gradle 的 [`java-base`](https://docs.gradle.org/current/javadoc/org/gradle/api/plugins/JavaBasePlugin.html) 插件。

在此期间，如果您在多平台项目中看到此弃用警告，我们建议您：
1. 确定您是否确实需要在项目中使用 Gradle Java 插件。如果不需要，请考虑将其删除。
2. 检查 Gradle Java 插件是否仅用于单个任务。如果是，您可能无需
   太多努力即可删除该插件。例如，如果任务使用 Gradle Java 插件来创建 Javadoc JAR 文件，您可以改为手动定义 Javadoc 任务。

否则，如果您想在多平台项目中使用 Kotlin Multiplatform Gradle 插件和这些 Gradle Java 插件，我们建议您：

1. 在您的多平台项目中创建一个单独的子项目。
2. 在单独的子项目中，应用 Gradle Java 插件。
3. 在单独的子项目中，添加对父多平台项目的依赖项。

> 单独的子项目**不得**是多平台项目，并且您只能使用它来设置对多平台项目的依赖项。
>
{style="warning"}

例如，您有一个名为 `my-main-project` 的多平台项目，并且您想
使用 [Application](https://docs.gradle.org/current/userguide/application_plugin.html) Gradle 插件来运行 JVM 应用程序。

一旦您创建了一个子项目，我们称之为 `subproject-A`，您的父项目结构应如下所示：

```text
.
├── build.gradle.kts
├── settings.gradle
├── subproject-A
    └── build.gradle.kts
    └── src
        └── Main.java
```

在您的子项目的 `build.gradle.kts` 文件中，在 `plugins {}` 代码块中应用 Application 插件：

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

在您的子项目的 `build.gradle.kts` 文件中，添加对父多平台项目的依赖项：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
dependencies {
    implementation(project(":my-main-project")) // The name of your parent multiplatform project
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
dependencies {
    implementation project(':my-main-project') // The name of your parent multiplatform project
}
```

</tab>
</tabs>

您的父项目现在已设置为与这两个插件协同工作。

## Kotlin/Native

Kotlin/Native 在垃圾回收器以及从 Swift/Objective-C 调用 Kotlin 挂起函数方面获得了改进。

### 垃圾回收器中的并发标记

在 Kotlin 2.0.20 中，JetBrains 团队朝着提高 Kotlin/Native 运行时性能又迈进了一步。
我们为垃圾回收器 (GC) 中的并发标记添加了实验性支持。

默认情况下，当 GC 标记堆中的对象时，应用程序线程必须暂停。这极大地影响了 GC 暂停的持续时间，
这对于延迟敏感型应用程序（例如使用 Compose Multiplatform 构建的 UI 应用程序）的性能至关重要。

现在，垃圾回收的标记阶段可以与应用程序线程同时运行。
这应该会显著缩短 GC 暂停时间，并有助于提高应用程序的响应性。

#### 如何启用

此特性目前为 [实验性的](components-stability.md#stability-levels-explained)。
要启用它，请在您的 `gradle.properties` 文件中设置以下选项：

```none
kotlin.native.binary.gc=cms
```

请向我们的问题跟踪器 [YouTrack](https://kotl.in/issue) 报告任何问题。

### 移除对 bitcode 嵌入的支持

从 Kotlin 2.0.20 开始，Kotlin/Native 编译器不再支持 bitcode 嵌入。
Bitcode 嵌入在 Xcode 14 中被弃用，并在 Xcode 15 中为所有 Apple 目标移除。

现在，用于 framework 配置的 `embedBitcode` 形参，以及
`-Xembed-bitcode` 和 `-Xembed-bitcode-marker` 命令行实参均已弃用。

如果您仍在使用早期版本的 Xcode 但想升级到 Kotlin 2.0.20，
请在您的 Xcode 项目中禁用 bitcode 嵌入。

### 通过 signpost 更改 GC 性能监控

Kotlin 2.0.0 使得通过 Xcode Instruments 监控 Kotlin/Native 垃圾回收器 (GC) 的性能成为可能。
Instruments 包含 signposts 工具，可以显示 GC 暂停作为事件。
这在检查 iOS 应用中与 GC 相关的冻结时非常方便。

此特性默认启用，但不幸的是，
有时当应用程序与 Xcode Instruments 同时运行时会导致崩溃。
从 Kotlin 2.0.20 开始，它需要使用以下编译器选项显式选择启用：

```none
-Xbinary=enableSafepointSignposts=true
```

关于 GC 性能分析，请在 [文档](native-memory-manager.md#monitor-gc-performance) 中了解更多信息。

### 能够在非主线程上从 Swift/Objective-C 调用 Kotlin 挂起函数

以前，Kotlin/Native 默认有限制，将从 Swift
和 Objective-C 调用 Kotlin 挂起函数的能力限制在主线程。Kotlin 2.0.20 解除了这一限制，
允许您在任何线程上从 Swift/Objective-C 运行 Kotlin `suspend` 函数。

如果您之前已使用 `kotlin.native.binary.objcExportSuspendFunctionLaunchThreadRestriction=none`
二进制选项切换了非主线程的默认行为，您现在可以从 `gradle.properties` 文件中将其删除。

## Kotlin/Wasm

在 Kotlin 2.0.20 中，Kotlin/Wasm 继续向命名导出迁移，并重新定位了 `@ExperimentalWasmDsl` 注解。

### 默认导出用法中的错误

作为向命名导出迁移的一部分，在使用 JavaScript 中的 Kotlin/Wasm 导出的默认导入时，之前会向控制台打印警告消息。

为了完全支持命名导出，此警告现已升级为错误。如果您使用默认导入，您会遇到
以下错误消息：

```text
Do not use default import. Use the corresponding named import instead.
```

此更改是向命名导出迁移的弃用周期的一部分。以下是您在每个阶段可以期待的内容：

* **在 2.0.0 版本中**：控制台会打印警告消息，解释通过默认导出实体已被弃用。
* **在 2.0.20 版本中**：发生错误，要求使用相应的命名导入。
* **在 2.1.0 版本中**：默认导入的使用被完全移除。

### ExperimentalWasmDsl 注解的新位置

以前，WebAssembly (Wasm) 特性的 `@ExperimentalWasmDsl` 注解位于
Kotlin Gradle 插件中的此位置：

```Kotlin
org.jetbrains.kotlin.gradle.targets.js.dsl.ExperimentalWasmDsl
```

在 2.0.20 中，`@ExperimentalWasmDsl` 注解已重新定位到：

```Kotlin
org.jetbrains.kotlin.gradle.ExperimentalWasmDsl
```

旧位置现已弃用，并可能导致因未解析的引用而构建失败。

为了反映 `@ExperimentalWasmDsl` 注解的新位置，请更新您的 Gradle 构建脚本中的导入语句。
为新的 `@ExperimentalWasmDsl` 位置使用显式导入：

```kotlin
import org.jetbrains.kotlin.gradle.ExperimentalWasmDsl
```

或者，从旧包中删除此星号导入语句：

```kotlin
import org.jetbrains.kotlin.gradle.targets.js.dsl.*
```

## Kotlin/JS

Kotlin/JS 引入了一些实验性特性，以支持 JavaScript 中的静态成员以及从 JavaScript 创建 Kotlin 集合。

### 支持在 JavaScript 中使用 Kotlin 静态成员

> 此特性为 [实验性的](components-stability.md#stability-levels-explained)。它可能随时被移除或更改。
> 仅用于求值目的。我们非常感谢您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-18891/JS-provide-a-way-to-declare-static-members-JsStatic) 上提供的反馈。
>
{style="warning"}

从 Kotlin 2.0.20 开始，您可以使用 `@JsStatic` 注解。它的工作方式与 [@JvmStatic](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvm-static/) 类似，
并指示编译器为目标声明生成额外的静态方法。这有助于您直接在 JavaScript 中使用 Kotlin 代码中的静态成员。

您可以将 `@JsStatic` 注解用于命名对象以及类和接口中声明的伴生对象中的函数。
编译器会同时生成对象的静态方法和对象本身的实例方法。例如：

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
C.callStatic();              // Works, accessing the static function
C.callNonStatic();           // Error, not a static function in the generated JavaScript
C.Companion.callStatic();    // Instance method remains
C.Companion.callNonStatic(); // The only way it works
```

也可以将 `@JsStatic` 注解应用于对象或伴生对象的属性，使其 getter
和 setter 方法成为该对象或包含伴生对象的类中的静态成员。

### 能够从 JavaScript 创建 Kotlin 集合

> 此特性为 [实验性的](components-stability.md#stability-levels-explained)。它可能随时被移除或更改。
> 仅用于求值目的。我们非常感谢您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-69133/Kotlin-JS-Add-support-for-collection-instantiation-in-JavaScript) 上提供的反馈。
>
{style="warning"}

Kotlin 2.0.0 引入了将 Kotlin 集合导出到 JavaScript（和 TypeScript）的能力。现在，JetBrains 团队
正在采取另一步骤来改进集合互操作。从 Kotlin 2.0.20 开始，可以
直接从 JavaScript/TypeScript 端创建 Kotlin 集合。

您可以从 JavaScript 创建 Kotlin 集合并将它们作为实参传递给导出的构造函数或函数。
一旦您在导出的声明中提及集合，Kotlin 就会为该集合生成一个工厂，该工厂在 JavaScript/TypeScript 中可用。

请看以下导出的函数：

```kotlin
// Kotlin
@JsExport
fun consumeMutableMap(map: MutableMap<String, Int>)
```

由于提到了 `MutableMap` 集合，Kotlin 会生成一个对象，其中包含一个可从 JavaScript/TypeScript 访问的工厂方法。
此工厂方法随后会从 JavaScript `Map` 创建一个 `MutableMap`：

```javascript
// JavaScript
import { consumeMutableMap } from "an-awesome-kotlin-module"
import { KtMutableMap } from "an-awesome-kotlin-module/kotlin-kotlin-stdlib"

consumeMutableMap(
    KtMutableMap.fromJsMap(new Map([["First", 1], ["Second", 2]]))
)
```

此特性适用于 `Set`、`Map` 和 `List` Kotlin 集合类型及其可变对应项。

## Gradle

Kotlin 2.0.20 完全兼容 Gradle 6.8.3 到 8.6。Gradle 8.7 和 8.8 也受支持，只有一个
例外：如果您使用 Kotlin Multiplatform Gradle 插件，您可能会在调用 JVM 目标中的 `withJava()` 函数的多平台项目中看到弃用警告。我们计划尽快修复此问题。

关于更多信息，请参见 [YouTrack](https://youtrack.jetbrains.com/issue/KT-66542/Gradle-JVM-target-with-withJava-produces-a-deprecation-warning) 中的问题。

您还可以使用直至最新 Gradle 版本的 Gradle 版本，但如果您这样做，请记住您可能会遇到
弃用警告或某些新的 Gradle 特性可能无法正常工作。

此版本带来了更改，例如开始弃用基于 JVM 历史文件的旧增量编译方法，以及一种在项目之间共享 JVM artifact 的新方法。

### 弃用基于 JVM 历史文件的增量编译

在 Kotlin 2.0.20 中，基于 JVM 历史文件的增量编译方法被弃用，转而采用
自 Kotlin 1.8.20 起默认启用的新增量编译方法。

基于 JVM 历史文件的增量编译方法存在局限性，
例如不与 [Gradle 的构建缓存](https://docs.gradle.org/current/userguide/build_cache.html) 协同工作
以及不支持编译避免。
相比之下，新的增量编译方法克服了这些局限性，并且自推出以来表现良好。

鉴于新的增量编译方法已在过去两个主要 Kotlin 版本中默认使用，
`kotlin.incremental.useClasspathSnapshot` Gradle 属性在 Kotlin 2.0.20 中被弃用。
因此，如果您使用它来选择退出，您将看到弃用警告。

### 允许在项目之间以类文件的形式共享 JVM artifact 的选项

> 此特性为 [实验性的](components-stability.md#stability-levels-explained)。
> 它可能随时被移除或更改。仅用于求值目的。
> 我们非常感谢您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-61861/Gradle-Kotlin-compilations-depend-on-packed-artifacts) 上提供的反馈。
> 需要选择启用（参见下方详细信息）。
>
{style="warning"}

在 Kotlin 2.0.20 中，我们引入了一种新方法，它改变了 Kotlin/JVM 编译的输出（例如 JAR 文件）
在项目之间共享的方式。通过这种方法，Gradle 的 `apiElements` 配置现在有一个次要
变体，提供对包含编译后的 `.class` 文件的目录的访问。配置后，您的项目将在编译期间使用此
目录，而不是请求压缩的 JAR artifact。这减少了 JAR 文件
被压缩和解压缩的次数，尤其是对于增量构建。

我们的测试表明，这种新方法可以为 Linux 和 macOS 主机提供构建性能改进。
然而，在 Windows 主机上，我们发现性能下降，原因是 Windows 在处理文件时的 I/O 操作方式。

要尝试此新方法，请将以下属性添加到您的 `gradle.properties` 文件中：

```none
kotlin.jvm.addClassesVariant=true
```

默认情况下，此属性设置为 `false`，Gradle 中的 `apiElements` 变体请求压缩的 JAR artifact。

> Gradle 有一个相关属性，您可以在纯 Java 项目中使用它，以便仅在编译期间公开压缩的 JAR artifact，
> **而不是**包含编译后的 `.class` 文件的目录：
>
> ```none
> org.gradle.java.compile-classpath-packaging=true
> ```
>
> 关于此属性及其目的的更多信息，请参见 Gradle 文档中关于 [Windows 上巨型多项目构建性能显著下降](https://docs.gradle.org/current/userguide/java_library_plugin.html#sub:java_library_known_issues_windows_performance) 的部分。
>
{style="note"}

我们非常感谢您对此新方法的反馈。您在使用它时是否注意到任何性能改进？
请在 [YouTrack](https://youtrack.com/issue/KT-61861/Gradle-Kotlin-compilations-depend-on-packed-artifacts) 中添加评论，让我们知道。

### Kotlin Gradle 插件与 java-test-fixtures 插件的依赖行为对齐

在 Kotlin 2.0.20 之前，如果您在项目中使用 [`java-test-fixtures` 插件](https://docs.gradle.org/current/userguide/java_testing.html#sec:java_test_fixtures)，
Gradle 和 Kotlin Gradle 插件在依赖项传播方面存在差异。

Kotlin Gradle 插件传播依赖项：

* 从 `java-test-fixtures` 插件的 `implementation` 和 `api` 依赖类型到 `test` 源代码集编译类路径。
* 从主源代码集的 `implementation` 和 `api` 依赖类型到 `java-test-fixtures` 插件的源代码集编译类路径。

然而，Gradle 只传播 `api` 依赖类型中的依赖项。

这种行为差异导致某些项目在类路径中多次找到资源文件。

从 Kotlin 2.0.20 开始，Kotlin Gradle 插件的行为与 Gradle 的 `java-test-fixtures` 插件保持一致，因此
此问题不再发生于此插件或其他 Gradle 插件。

由于此更改，`test` 和 `testFixtures` 源代码集中的某些依赖项可能不再可访问。
如果发生这种情况，请将依赖声明类型从 `implementation` 更改为 `api`，或者
在受影响的源代码集上添加新的依赖声明。

### 为编译任务缺少 artifact 输入的极少数情况添加任务依赖项

在 2.0.20 之前，我们发现有些情况下，编译任务缺少对其某个 artifact 输入的任务依赖项。
这意味着依赖编译任务的结果不稳定，因为有时 artifact 及时生成了，但有时没有。

为了解决此问题，Kotlin Gradle 插件现在会自动在这些情况下添加所需的任务依赖项。

在极少数情况下，我们发现这种新行为可能导致循环依赖错误。
例如，如果您有多个编译，其中一个编译可以看到另一个编译的所有内部声明，
并且生成的 artifact 依赖于两个编译任务的输出，您可能会看到如下错误：

```none
FAILURE: Build failed with an exception.

What went wrong:
Circular dependency between the following tasks:
:lib:compileKotlinJvm
--- :lib:jvmJar
     \--- :lib:compileKotlinJvm (*)
(*) - details omitted (listed previously)
```

为了解决此循环依赖错误，我们添加了一个 Gradle 属性：`archivesTaskOutputAsFriendModule`。

默认情况下，此属性设置为 `true` 以跟踪任务依赖项。要禁用在编译任务中使用 artifact，
从而不需要任务依赖项，请在您的 `gradle.properties` 文件中添加以下内容：

```kotlin
kotlin.build.archivesTaskOutputAsFriendModule=false
```

关于更多信息，请参见 [YouTrack](https://youtrack.jetbrains.com/issue/KT-69330) 中的问题。

## Compose 编译器

在 Kotlin 2.0.20 中，Compose 编译器获得了一些改进。

### 修复 2.0.0 中引入的不必要 recomposition 问题

Compose 编译器 2.0.0 存在一个问题，它有时会错误地推断非 JVM 目标的多平台项目中的类型稳定性。
这可能导致不必要（甚至无限）的 recomposition。我们强烈建议将为 Kotlin 2.0.0 构建的 Compose 应用程序
更新到 2.0.10 或更高版本。

如果您的应用程序使用 Compose 编译器 2.0.10 或更高版本构建，但使用了 2.0.0 版本构建的依赖项，
这些旧依赖项仍可能导致 recomposition 问题。
为防止这种情况，请将您的依赖项更新到与您的应用程序使用相同 Compose 编译器构建的版本。

### 配置编译器选项的新方法

我们引入了一种新的选项配置机制，以避免顶层形参的频繁更改。
Compose 编译器团队很难通过为 `composeCompiler {}` 代码块创建或删除顶层条目来测试功能。
因此，强跳过模式和非跳过组优化等选项现在通过 `featureFlags` 属性启用。
此属性将用于测试新的 Compose 编译器选项，这些选项最终将成为默认选项。

此更改也已应用于 Compose 编译器 Gradle 插件。要继续配置特性标记，
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

或者，如果您直接配置 Compose 编译器，请使用以下语法：

```text
-P plugin:androidx.compose.compiler.plugins.kotlin:featureFlag=IntrinsicRemember
```

`enableIntrinsicRemember`、`enableNonSkippingGroupOptimization` 和 `enableStrongSkippingMode` 属性因此已被弃用。

我们非常感谢您对这种新方法的任何反馈，请在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-68651/Compose-provide-a-single-place-in-extension-to-configure-all-compose-flags) 中提出。

### 强跳过模式默认启用

Compose 编译器的强跳过模式现在默认启用。

强跳过模式是 Compose 编译器的一种配置选项，它改变了哪些可组合项可以被跳过的规则。
启用强跳过模式后，带有不稳定形参的可组合项现在也可以被跳过。
强跳过模式还会自动记住可组合函数中使用的 lambda 表达式，
因此您不再需要将 lambda 表达式包装在 `remember` 中以避免 recomposition。

关于更多细节，请参见 [强跳过模式文档](https://developer.android.com/develop/ui/compose/performance/stability/strongskipping)。

### 组合跟踪标记默认启用

`includeTraceMarkers` 选项现在在 Compose 编译器 Gradle 插件中默认设置为 `true`，以匹配
编译器插件中的默认值。这允许您在 Android Studio 系统跟踪分析器中查看可组合函数。关于
组合跟踪的详细信息，请参见这篇 [Android Developers 博客文章](https://medium.com/androiddevelopers/jetpack-compose-composition-tracing-9ec2b3aea535)。

### 非跳过组优化

此版本包含一个新的编译器选项：启用后，不可跳过且不可重启的可组合函数将不再在可组合项的主体周围生成一个组。
这会导致更少的内存分配，从而提高性能。此选项是实验性的，默认禁用，但可以通过特性标记
`OptimizeNonSkippingGroups` 启用，如 [上文](#new-way-to-configure-compiler-options) 所示。

此特性标记现在已准备好进行更广泛的测试。启用该特性时发现的任何问题都可以在 [Google 问题跟踪器](https://goo.gle/compose-feedback) 上提交。

### 支持抽象可组合函数中的默认形参

您现在可以为抽象可组合函数添加默认形参。

以前，Compose 编译器在尝试这样做时会报告错误，即使这是有效的 Kotlin 代码。
我们现在已经在 Compose 编译器中添加了对此的支持，并且限制已被移除。
这对于包含默认 `Modifier` 值特别有用：

```kotlin
abstract class Composables {
    @Composable
    abstract fun Composable(modifier: Modifier = Modifier)
}
```

开放可组合函数中的默认形参在 2.0.20 中仍然受限制。此限制将在
未来版本中解决。

## 标准库

标准库现在支持全局唯一标识符作为实验性特性，并包含 Base64 解码的一些更改。

### 公共 Kotlin 标准库中对 UUID 的支持

> 此特性为 [实验性的](components-stability.md#stability-levels-explained)。
> 要选择启用，请使用 `@ExperimentalUuidApi` 注解或编译器选项 `-opt-in=kotlin.uuid.ExperimentalUuidApi`。
>
{style="warning"}

Kotlin 2.0.20 在公共 Kotlin 标准库中引入了一个表示 [UUID（全局唯一标识符）](https://en.wikipedia.org/wiki/Universally_unique_identifier) 的类，
以解决唯一标识项的挑战。

此外，此特性还提供了用于以下 UUID 相关操作的 API：

* 生成 UUID。
* 从其字符串表示中解析 UUID 并将其格式化为字符串。
* 从指定的 128 位值创建 UUID。
* 访问 UUID 的 128 位。

以下代码示例演示了这些操作：

```kotlin
// Constructs a byte array for UUID creation
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

// Accesses UUID bits
val version = uuid1.toLongs { mostSignificantBits, _ ->
    ((mostSignificantBits shr 12) and 0xF).toInt()
}
println(version)
// 4

// Generates a random UUID
val randomUuid = Uuid.random()

println(uuid1 == randomUuid)
// false
```

为了保持与使用 `java.util.UUID` 的 API 的兼容性，Kotlin/JVM 中有两个扩展函数用于在 `java.util.UUID` 和 `kotlin.uuid.Uuid` 之间进行转换：`.toJavaUuid()` 和 `.toKotlinUuid()`。例如：

```kotlin
val kotlinUuid = Uuid.parseHex("550e8400e29b41d4a716446655440000")
// Converts Kotlin UUID to java.util.UUID
val javaUuid = kotlinUuid.toJavaUuid()

val javaUuid = java.util.UUID.fromString("550e8400-e29b-41d4-a716-446655440000")
// Converts Java UUID to kotlin.uuid.Uuid
val kotlinUuid = javaUuid.toKotlinUuid()
```

此特性和所提供的 API 通过允许在多个平台之间共享代码来简化多平台软件开发。
UUID 在生成唯一标识符困难的环境中也很有用。

涉及 UUID 的一些用例包括：

* 为数据库记录分配唯一 ID。
* 生成 Web 会话标识符。
* 任何需要唯一识别或跟踪的场景。

### HexFormat 中对 minLength 的支持

> [`HexFormat` 类](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-hex-format/) 及其属性为
> [实验性的](components-stability.md#stability-levels-explained)。
> 要选择启用，请使用 `@OptIn(ExperimentalStdlibApi::class)` 注解或编译器
> 选项 `-opt-in=kotlin.ExperimentalStdlibApi`。
>
{style="warning"}

Kotlin 2.0.20 向 [`NumberHexFormat` 类](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-hex-format/-number-hex-format/) 添加了一个新的 `minLength` 属性，
通过 [`HexFormat.number`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-hex-format/number.html) 访问。
此属性允许您指定数值的十六进制表示中的最小位数，从而能够用零进行填充以满足所需的长度。
此外，可以使用 `removeLeadingZeros` 属性去除前导零：

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

`minLength` 属性不影响解析。然而，解析现在允许十六进制字符串的位数多于类型宽度，
如果多余的前导位数是零的话。

### Base64 解码器行为的更改

> [`Base64` 类](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io.encoding/-base64/) 及其
> 相关特性为 [实验性的](components-stability.md#stability-levels-explained)。
> 要选择启用，请使用 `@OptIn(ExperimentalEncodingApi::class)`
> 注解或编译器选项 `-opt-in=kotlin.io.encoding.ExperimentalEncodingApi`。
>
{style="warning"}

Kotlin 2.0.20 中对 Base64 解码器的行为进行了两项更改：

* [Base64 解码器现在要求填充](#the-base64-decoder-now-requires-padding)
* [已添加 `withPadding` 函数用于填充配置](#withpadding-function-for-padding-configuration)

#### Base64 解码器现在要求填充

Base64 编码器现在默认添加填充，并且解码器在解码时要求填充并禁止非零填充位。

#### withPadding 函数用于填充配置

引入了一个新的 `.withPadding()` 函数，以使用户能够控制 Base64 编码和解码的填充行为：

```kotlin
val base64 = Base64.UrlSafe.withPadding(Base64.PaddingOption.ABSENT_OPTIONAL)
```

此函数允许创建具有不同填充选项的 `Base64` 实例：

| `PaddingOption`    | 编码时       | 解码时              |
|--------------------|--------------|---------------------|
| `PRESENT`          | 添加填充     | 要求填充            |
| `ABSENT`           | 省略填充     | 不允许填充          |
| `PRESENT_OPTIONAL` | 添加填充     | 填充可选            |
| `ABSENT_OPTIONAL`  | 省略填充     | 填充可选            |

您可以创建具有不同填充选项的 `Base64` 实例，并使用它们来编码和解码数据：

```kotlin
import kotlin.io.encoding.Base64
import kotlin.io.encoding.ExperimentalEncodingApi

@OptIn(ExperimentalEncodingApi::class)
fun main() {
    // Example data to encode
    val data = "fooba".toByteArray()

    // Creates a Base64 instance with URL-safe alphabet and PRESENT padding
    val base64Present = Base64.UrlSafe.withPadding(Base64.PaddingOption.PRESENT)
    val encodedDataPresent = base64Present.encode(data)
    println("Encoded data with PRESENT padding: $encodedDataPresent")
    // Encoded data with PRESENT padding: Zm9vYmE=

    // Creates a Base64 instance with URL-safe alphabet and ABSENT padding
    val base64Absent = Base64.UrlSafe.withPadding(Base64.PaddingOption.ABSENT)
    val encodedDataAbsent = base64Absent.encode(data)
    println("Encoded data with ABSENT padding: $encodedDataAbsent")
    // Encoded data with ABSENT padding: Zm9vYmE

    // Decodes the data back
    val decodedDataPresent = base64Present.decode(encodedDataPresent)
    println("Decoded data with PRESENT padding: ${String(decodedDataPresent)}")
    // Decoded data with PRESENT padding: fooba

    val decodedDataAbsent = base64Absent.decode(encodedDataAbsent)
    println("Decoded data with ABSENT padding: ${String(decodedDataAbsent)}")
    // Decoded data with ABSENT padding: fooba
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.0" id="kotlin-2-0-20-base64-decoder" validate="false"}

## 文档更新

Kotlin 文档收到了一些值得注意的更改：

* 改进的 [标准输入页面](standard-input.md) - 了解如何使用 Java Scanner 和 `readln()`。
* 改进的 [K2 编译器迁移指南](k2-compiler-migration-guide.md) - 了解性能改进、与 Kotlin 库的兼容性以及如何处理自定义编译器插件。
* 改进的 [异常页面](exceptions.md) - 了解异常以及如何抛出和捕获它们。
* 改进的 [在 JVM 中使用 JUnit 测试代码 - 教程](jvm-test-using-junit.md) - 了解如何使用 JUnit 创建测试。
* 改进的 [与 Swift/Objective-C 互操作页面](native-objc-interop.md) - 了解如何在 Swift/Objective-C 代码中使用 Kotlin 声明以及如何在 Kotlin 代码中使用 Objective-C 声明。
* 改进的 [Swift 包导出设置页面](https://kotlinlang.org/docs/multiplatform/multiplatform-spm-export.html) - 了解如何设置可由 Swift 包管理器依赖项使用的 Kotlin/Native 输出。

## 安装 Kotlin 2.0.20

从 IntelliJ IDEA 2023.3 和 Android Studio Iguana (2023.2.1) Canary 15 开始，Kotlin 插件作为
捆绑插件包含在您的 IDE 中分发。这意味着您无法再从 JetBrains Marketplace 安装该插件。

要更新到新的 Kotlin 版本，请在您的构建脚本中 [更改 Kotlin 版本](releases.md#update-to-a-new-kotlin-version)
为 2.0.20。