[//]: # (title: Kotlin 2.0.20 新特性)

_[发布时间：2024 年 8 月 22 日](releases.md#release-details)_

Kotlin 2.0.20 版本已发布！此版本包含对 Kotlin 2.0.0 的性能改进和 bug 修复，我们在 Kotlin 2.0.0 中宣布 Kotlin K2 编译器已稳定。以下是此版本的一些额外亮点：

*   [数据类 `copy` 函数将与构造函数具有相同的可见性](#data-class-copy-function-to-have-the-same-visibility-as-constructor)
*   [多平台项目中现在支持默认目标层次结构中源集的静态访问器](#static-accessors-for-source-sets-from-the-default-target-hierarchy)
*   [垃圾收集器中已实现 Kotlin/Native 的并发标记](#concurrent-marking-in-garbage-collector)
*   [Kotlin/Wasm 中的 `@ExperimentalWasmDsl` 注解具有新位置](#new-location-of-experimentalwasmdsl-annotation)
*   [已添加对 Gradle 8.6–8.8 版本的支持](#gradle)
*   [新选项允许在 Gradle 项目之间以类文件形式共享 JVM 工件](#option-to-share-jvm-artifacts-between-projects-as-class-files)
*   [Compose 编译器已更新](#compose-compiler)
*   [通用 Kotlin 标准库已添加对 UUID 的支持](#support-for-uuids-in-the-common-kotlin-standard-library)

## IDE 支持

支持 2.0.20 的 Kotlin 插件已捆绑在最新的 IntelliJ IDEA 和 Android Studio 中。
你无需更新 IDE 中的 Kotlin 插件。
你只需在构建脚本中将 Kotlin 版本更改为 2.0.20。

有关详细信息，请参阅[更新到新版本](releases.md#update-to-a-new-kotlin-version)。

## 语言

Kotlin 2.0.20 开始引入更改，以改进数据类的一致性并替换实验性上下文接收器特性。

### 数据类 `copy` 函数将与构造函数具有相同的可见性

目前，如果你使用 `private` 构造函数创建数据类，自动生成的 `copy()` 函数不会具有相同的可见性。这可能会在代码中导致问题。在未来的 Kotlin 版本中，我们将引入 `copy()` 函数的默认可见性与构造函数相同的行为。此更改将逐步引入，以帮助你尽可能顺利地迁移代码。

我们的迁移计划从 Kotlin 2.0.20 开始，它会在代码中未来可见性将发生变化的地方发出警告。例如：

```kotlin
// 在 2.0.20 中会触发警告
data class PositiveInteger private constructor(val number: Int) {
    companion object {
        fun create(number: Int): PositiveInteger? = if (number > 0) PositiveInteger(number) else null
    }
}

fun main() {
    val positiveNumber = PositiveInteger.create(42) ?: return
    // 在 2.0.20 中会触发警告
    val negativeNumber = positiveNumber.copy(number = -1)
    // 警告：非公共主构造函数通过生成的数据类“copy()”方法暴露。
    // 生成的“copy()”方法在未来版本中将改变其可见性。
}
```

有关我们迁移计划的最新信息，请参阅 [YouTrack](https://youtrack.jetbrains.com/issue/KT-11914) 中的相应议题。

为了让你更好地控制此行为，Kotlin 2.0.20 中引入了两个注解：

*   `@ConsistentCopyVisibility`：在未来的版本中成为默认行为之前，现在选择启用此行为。
*   `@ExposedCopyVisibility`：选择退出此行为，并在声明点抑制警告。
    请注意，即使使用了此注解，编译器在调用 `copy()` 函数时仍会报告警告。

如果你希望在 2.0.20 中为整个模块而不是单个类选择启用新行为，可以使用 `-Xconsistent-data-class-copy-visibility` 编译器选项。
此选项的效果与将 `@ConsistentCopyVisibility` 注解添加到模块中的所有数据类相同。

### 上下文接收器分阶段替换为上下文参数

在 Kotlin 1.6.20 中，我们引入了 [上下文接收器](whatsnew1620.md#prototype-of-context-receivers-for-kotlin-jvm) 作为一项[实验性](components-stability.md#stability-levels-explained)特性。在听取社区反馈后，我们决定不继续采用此方法，并将采取不同的方向。

在未来的 Kotlin 版本中，上下文接收器将被上下文参数取代。上下文参数仍处于设计阶段，你可以在 [KEEP](https://github.com/Kotlin/KEEP/blob/context-parameters/proposals/context-parameters.md) 中找到提案。

由于上下文参数的实现需要对编译器进行重大更改，我们决定不同时支持上下文接收器和上下文参数。此决定极大地简化了实现并最大限度地降低了不稳定行为的风险。

我们理解许多开发者已经在使用上下文接收器。因此，我们将开始逐步移除对上下文接收器的支持。我们的迁移计划从 Kotlin 2.0.20 开始，当使用 `-Xcontext-receivers` 编译器选项时，你的代码中会发出有关上下文接收器使用的警告。例如：

```kotlin
class MyContext

context(MyContext)
// 警告：实验性上下文接收器已废弃，将被上下文参数取代。
// 请勿使用上下文接收器。您可以显式传递参数，或使用带有扩展的成员。
fun someFunction() {
}
```

此警告将在未来的 Kotlin 版本中变为错误。

如果你在代码中使用了上下文接收器，我们建议你将代码迁移为使用以下任一方式：

*   显式参数。

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

*   扩展成员函数（如果可能）。

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

或者，你可以等到支持上下文参数的 Kotlin 编译器版本发布。请注意，上下文参数最初将作为实验性特性引入。

## Kotlin 多平台

Kotlin 2.0.20 改进了多平台项目中的源集管理，并由于 Gradle 的最新更改，废弃了与某些 Gradle Java 插件的兼容性。

### 默认目标层次结构中源集的静态访问器

自 Kotlin 1.9.20 以来，[默认层次结构模板](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-hierarchy.html#default-hierarchy-template)会自动应用于所有 Kotlin 多平台项目。
对于默认层次结构模板中的所有源集，Kotlin Gradle 插件提供了类型安全的访问器。
这样，你最终无需使用 `by getting` 或 `by creating` 构造即可访问所有指定目标的源集。

Kotlin 2.0.20 旨在进一步改善你的 IDE 体验。它现在在 `sourceSets {}` 块中为默认层次结构模板中的所有源集提供了静态访问器。
我们相信此更改将使按名称访问源集变得更容易、更可预测。

现在每个此类源集都具有一个详细的 KDoc 注释，其中包含示例和诊断消息，如果尝试在未首先声明相应目标的情况下访问源集，则会发出警告：

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
        // 警告：未注册目标就访问源集
        iosX64Main { }
    }
}
```

![按名称访问源集](accessing-sourse-sets.png){width=700}

了解更多关于 [Kotlin 多平台中的分层项目结构](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-hierarchy.html)的信息。

### Kotlin 多平台 Gradle 插件与 Gradle Java 插件的兼容性废弃

在 Kotlin 2.0.20 中，当你将 Kotlin 多平台 Gradle 插件和以下任何 Gradle Java 插件应用于同一项目时，我们会引入一个废弃警告：[Java](https://docs.gradle.org/current/userguide/java_plugin.html)、[Java Library](https://docs.gradle.org/current/userguide/java_library_plugin.html) 和 [Application](https://docs.gradle.org/current/userguide/application_plugin.html)。
当你的多平台项目中的另一个 Gradle 插件应用 Gradle Java 插件时，也会出现此警告。
例如，[Spring Boot Gradle 插件](https://docs.spring.io/spring-boot/gradle-plugin/index.html)会自动应用 Application 插件。

我们添加此废弃警告是由于 Kotlin 多平台的项目模型与 Gradle 的 Java 生态系统插件之间存在根本性的兼容性问题。Gradle 的 Java 生态系统插件目前没有考虑到其他插件可能：

*   也以与 Java 生态系统插件不同的方式发布或编译 JVM 目标。
*   在同一项目中拥有两个不同的 JVM 目标，例如 JVM 和 Android。
*   拥有复杂的多平台项目结构，可能包含多个非 JVM 目标。

不幸的是，Gradle 目前没有提供任何 API 来解决这些问题。

我们之前在 Kotlin 多平台中使用了某些变通方法来帮助集成 Java 生态系统插件。
然而，这些变通方法从未真正解决兼容性问题，并且自 Gradle 8.8 发布以来，这些变通方法不再可能。有关更多信息，请参阅我们的 [YouTrack 议题](https://youtrack.jetbrains.com/issue/KT-66542/Gradle-JVM-target-with-withJava-produces-a-deprecation-warning)。

虽然我们尚不清楚如何精确解决此兼容性问题，但我们致力于继续支持你的 Kotlin 多平台项目中的某些形式的 Java 源代码编译。至少，我们将支持 Java 源代码的编译以及在你的多平台项目中使用 Gradle 的 [`java-base`](https://docs.gradle.org/current/javadoc/org/gradle/api/plugins/JavaBasePlugin.html) 插件。

同时，如果你在多平台项目中看到此废弃警告，我们建议你：
1.  确定你是否确实需要在项目中包含 Gradle Java 插件。如果不需要，请考虑将其移除。
2.  检查 Gradle Java 插件是否仅用于单个任务。如果是，你可能无需太多努力即可移除该插件。例如，如果任务使用 Gradle Java 插件来创建 Javadoc JAR 文件，你可以手动定义 Javadoc 任务。

否则，如果你希望在多平台项目中使用 Kotlin 多平台 Gradle 插件和这些 Gradle Java 插件，我们建议你：

1.  在你的多平台项目中创建一个单独的子项目。
2.  在该单独的子项目中，应用 Gradle Java 插件。
3.  在该单独的子项目中，添加对你的父多平台项目的依赖。

> 单独的子项目**不得**是多平台项目，并且你只能使用它来设置对多平台项目的依赖。
>
{style="warning"}

例如，你有一个名为 `my-main-project` 的多平台项目，并且你希望使用 [Application](https://docs.gradle.org/current/userguide/application_plugin.html) Gradle 插件来运行 JVM 应用程序。

创建子项目后，我们将其命名为 `subproject-A`，你的父项目结构应如下所示：

```text
.
├── build.gradle.kts
├── settings.gradle
├── subproject-A
    └── build.gradle.kts
    └── src
        └── Main.java
```

在子项目的 `build.gradle.kts` 文件中，在 `plugins {}` 块中应用 Application 插件：

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

在子项目的 `build.gradle.kts` 文件中，添加对父多平台项目的依赖：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
dependencies {
    implementation(project(":my-main-project")) // 你的父多平台项目的名称
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
dependencies {
    implementation project(':my-main-project') // 你的父多平台项目的名称
}
```

</tab>
</tabs>

你的父项目现已配置为可同时使用这两个插件。

## Kotlin/Native

Kotlin/Native 在垃圾收集器以及从 Swift/Objective-C 调用 Kotlin 挂起函数方面得到了改进。

### 垃圾收集器中的并发标记

在 Kotlin 2.0.20 中，JetBrains 团队在提高 Kotlin/Native 运行时性能方面又迈出了一步。
我们为垃圾收集器 (GC) 中的并发标记添加了实验性支持。

默认情况下，当 GC 标记堆中的对象时，应用程序线程必须暂停。这极大地影响了 GC 暂停的持续时间，这对于对延迟敏感的应用程序（例如使用 Compose Multiplatform 构建的 UI 应用程序）的性能至关重要。

现在，垃圾收集的标记阶段可以与应用程序线程同时运行。
这应该会显著缩短 GC 暂停时间并有助于提高应用程序响应能力。

#### 如何启用

此特性目前处于[实验性](components-stability.md#stability-levels-explained)阶段。
要启用它，请在 `gradle.properties` 文件中设置以下选项：

```none
kotlin.native.binary.gc=cms
```

请将任何问题报告到我们的问题跟踪器 [YouTrack](https://kotl.in/issue)。

### 移除对 Bitcode 嵌入的支持

从 Kotlin 2.0.20 开始，Kotlin/Native 编译器不再支持 Bitcode 嵌入。
Bitcode 嵌入在 Xcode 14 中被废弃，并在 Xcode 15 中针对所有 Apple 目标移除。

现在，用于框架配置的 `embedBitcode` 参数，以及 `-Xembed-bitcode` 和 `-Xembed-bitcode-marker` 命令行参数均已废弃。

如果你仍在使用早期版本的 Xcode 但希望升级到 Kotlin 2.0.20，
请在你的 Xcode 项目中禁用 Bitcode 嵌入。

### 使用 Signposts 监控 GC 性能的变化

Kotlin 2.0.0 使通过 Xcode Instruments 监控 Kotlin/Native 垃圾收集器 (GC) 的性能成为可能。Instruments 包含 Signposts 工具，它可以将 GC 暂停显示为事件。
这在检查 iOS 应用程序中与 GC 相关的卡顿时非常有用。

此特性默认启用，但不幸的是，
当应用程序与 Xcode Instruments 同时运行时，有时会导致崩溃。
从 Kotlin 2.0.20 开始，它需要使用以下编译器选项显式选择启用：

```none
-Xbinary=enableSafepointSignposts=true
```

在[文档](native-memory-manager.md#monitor-gc-performance)中了解更多关于 GC 性能分析的信息。

### 从 Swift/Objective-C 的非主线程调用 Kotlin 挂起函数的能力

以前，Kotlin/Native 有一个默认限制，将从 Swift 和 Objective-C 调用 Kotlin 挂起函数的能力限制为只能在主线程上。Kotlin 2.0.20 解除了这一限制，允许你从 Swift/Objective-C 的任何线程运行 Kotlin `suspend` 函数。

如果你之前使用 `kotlin.native.binary.objcExportSuspendFunctionLaunchThreadRestriction=none` 二进制选项切换了非主线程的默认行为，你现在可以将其从 `gradle.properties` 文件中移除。

## Kotlin/Wasm

在 Kotlin 2.0.20 中，Kotlin/Wasm 继续向命名导出迁移，并重新定位了 `@ExperimentalWasmDsl` 注解。

### 默认导出使用错误

作为向命名导出迁移的一部分，之前在使用 Kotlin/Wasm 导出在 JavaScript 中进行默认导入时，控制台会打印警告消息。

为了完全支持命名导出，此警告现在已升级为错误。如果你使用默认导入，你会遇到以下错误消息：

```text
Do not use default import. Use the corresponding named import instead.
```

此更改是废弃周期的一部分，旨在迁移到命名导出。以下是每个阶段的预期情况：

*   **在 2.0.0 版本中**：控制台会打印一条警告消息，解释通过默认导出实体已被废弃。
*   **在 2.0.20 版本中**：发生错误，要求使用相应的命名导入。
*   **在 2.1.0 版本中**：将完全移除默认导入的使用。

### ExperimentalWasmDsl 注解的新位置

以前，WebAssembly (Wasm) 特性的 `@ExperimentalWasmDsl` 注解在 Kotlin Gradle 插件中的位置是：

```Kotlin
org.jetbrains.kotlin.gradle.targets.js.dsl.ExperimentalWasmDsl
```

在 2.0.20 中，`@ExperimentalWasmDsl` 注解已重新定位到：

```Kotlin
org.jetbrains.kotlin.gradle.ExperimentalWasmDsl
```

旧位置现在已废弃，并可能导致由于未解析的引用而导致构建失败。

为了反映 `@ExperimentalWasmDsl` 注解的新位置，请更新你的 Gradle 构建脚本中的导入语句。
为新的 `@ExperimentalWasmDsl` 位置使用显式导入：

```kotlin
import org.jetbrains.kotlin.gradle.ExperimentalWasmDsl
```

或者，从旧包中移除此星号导入语句：

```kotlin
import org.jetbrains.kotlin.gradle.targets.js.dsl.*
```

## Kotlin/JS

Kotlin/JS 引入了一些实验性特性，以支持 JavaScript 中的静态成员以及从 JavaScript 创建 Kotlin 集合。

### 支持在 JavaScript 中使用 Kotlin 静态成员

> 此特性是[实验性](components-stability.md#stability-levels-explained)的。它可能随时被删除或更改。
> 仅将其用于评估目的。我们感谢你通过 [YouTrack](https://youtrack.jetbrains.com/issue/KT-18891/JS-provide-a-way-to-declare-static-members-JsStatic) 提供反馈。
>
{style="warning"}

从 Kotlin 2.0.20 开始，你可以使用 `@JsStatic` 注解。它的工作方式类似于 [@JvmStatic](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvm-static/)
并指示编译器为目标声明生成额外的静态方法。这有助于你直接在 JavaScript 中使用 Kotlin 代码中的静态成员。

你可以将 `@JsStatic` 注解用于在命名对象中定义的函数，以及在类和接口中声明的伴生对象中的函数。编译器会同时生成对象的静态方法和对象本身的实例方法。例如：

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
C.callStatic();              // 工作正常，访问静态函数
C.callNonStatic();           // 错误，生成的 JavaScript 中不是静态函数
C.Companion.callStatic();    // 实例方法仍然存在
C.Companion.callNonStatic(); // 唯一可以工作的方式
```

也可以将 `@JsStatic` 注解应用于对象或伴生对象的属性，使其 getter 和 setter 方法成为该对象或包含伴生对象的类的静态成员。

### 从 JavaScript 创建 Kotlin 集合的能力

> 此特性是[实验性](components-stability.md#stability-levels-explained)的。它可能随时被删除或更改。
> 仅将其用于评估目的。我们感谢你通过 [YouTrack](https://youtrack.jetbrains.com/issue/KT-69133/Kotlin-JS-Add-support-for-collection-instantiation-in-JavaScript) 提供反馈。
>
{style="warning"}

Kotlin 2.0.0 引入了将 Kotlin 集合导出到 JavaScript（和 TypeScript）的能力。现在，JetBrains 团队
又向前迈出了一步，以改进集合互操作性。从 Kotlin 2.0.20 开始，可以直接从 JavaScript/TypeScript 端创建 Kotlin 集合。

你可以从 JavaScript 创建 Kotlin 集合，并将它们作为参数传递给导出的构造函数或函数。
一旦你在导出的声明中提及集合，Kotlin 就会为该集合生成一个工厂，该工厂在 JavaScript/TypeScript 中可用。

请看以下导出的函数：

```kotlin
// Kotlin
@JsExport
fun consumeMutableMap(map: MutableMap<String, Int>)
```

由于提到了 `MutableMap` 集合，Kotlin 会生成一个带有工厂方法的对象，该工厂方法可从 JavaScript/TypeScript 中访问。
然后，此工厂方法会从 JavaScript `Map` 创建一个 `MutableMap`：

```javascript
// JavaScript
import { consumeMutableMap } from "an-awesome-kotlin-module"
import { KtMutableMap } from "an-awesome-kotlin-module/kotlin-kotlin-stdlib"

consumeMutableMap(
    KtMutableMap.fromJsMap(new Map([["First", 1], ["Second", 2]]))
)
```

此特性适用于 `Set`、`Map` 和 `List` Kotlin 集合类型及其对应的可变类型。

## Gradle

Kotlin 2.0.20 完全兼容 Gradle 6.8.3 到 8.6。Gradle 8.7 和 8.8 也受支持，只有一个例外：如果你使用 Kotlin 多平台 Gradle 插件，你可能会在多平台项目中看到调用 JVM 目标中的 `withJava()` 函数的废弃警告。我们计划尽快修复此问题。

有关更多信息，请参阅 [YouTrack](https://youtrack.jetbrains.com/issue/KT-66542/Gradle-JVM-target-with-withJava-produces-a-deprecation-warning) 中的议题。

你也可以使用 Gradle 的最新版本，但如果你这样做，请记住你可能会遇到废弃警告或某些新的 Gradle 特性可能无法正常工作。

此版本带来了一些变化，例如开始废弃基于 JVM 历史文件的旧增量编译方法，以及在项目之间共享 JVM 工件的新方式。

### 基于 JVM 历史文件的增量编译废弃

在 Kotlin 2.0.20 中，基于 JVM 历史文件的增量编译方法已废弃，取而代之的是自 Kotlin 1.8.20 以来默认启用的新增量编译方法。

基于 JVM 历史文件的增量编译方法存在局限性，
例如不适用于 [Gradle 的构建缓存](https://docs.gradle.org/current/userguide/build_cache.html)
和不支持编译避免。
相比之下，新的增量编译方法克服了这些局限性，并且自推出以来表现良好。

鉴于新的增量编译方法在过去两个主要的 Kotlin 版本中已默认使用，
`kotlin.incremental.useClasspathSnapshot` Gradle 属性在 Kotlin 2.0.20 中已废弃。
因此，如果你使用它来选择退出，你将看到一个废弃警告。

### 在项目之间以类文件形式共享 JVM 工件的选项

> 此特性是[实验性](components-stability.md#stability-levels-explained)的。
> 它可能随时被删除或更改。仅将其用于评估目的。
> 我们感谢你通过 [YouTrack](https://youtrack.jetbrains.com/issue/KT-61861/Gradle-Kotlin-compilations-depend-on-packed-artifacts) 提供反馈。
> 需要选择启用（参见下方详细信息）。
>
{style="warning"}

在 Kotlin 2.0.20 中，我们引入了一种新方法，它改变了 Kotlin/JVM 编译的输出（例如 JAR 文件）在项目之间共享的方式。通过此方法，Gradle 的 `apiElements` 配置现在具有一个辅助变体，提供对包含已编译 `.class` 文件的目录的访问。配置后，你的项目在编译期间将使用此目录，而不是请求压缩的 JAR 工件。这减少了 JAR 文件压缩和解压缩的次数，尤其是对于增量构建。

我们的测试表明，这种新方法可以为 Linux 和 macOS 主机提供构建性能改进。
然而，在 Windows 主机上，由于 Windows 处理文件 I/O 操作的方式，我们观察到性能下降。

要尝试这种新方法，请将以下属性添加到你的 `gradle.properties` 文件中：

```none
kotlin.jvm.addClassesVariant=true
```

默认情况下，此属性设置为 `false`，并且 Gradle 中的 `apiElements` 变体请求压缩的 JAR 工件。

> Gradle 有一个相关属性，你可以在仅限 Java 的项目中使用它，以便在编译期间仅公开压缩的 JAR 工件，而**不是**包含已编译 `.class` 文件的目录：
>
> ```none
> org.gradle.java.compile-classpath-packaging=true
> ```
>
> 有关此属性及其用途的更多信息，
> 请参阅 Gradle 关于 [Windows 上大型多项目构建性能显著下降](https://docs.gradle.org/current/userguide/java_library_plugin.html#sub:java_library_known_issues_windows_performance) 的文档。
>
{style="note"}

我们感谢你对这种新方法的反馈。你是否在使用它时注意到任何性能改进？
请通过在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-61861/Gradle-Kotlin-compilations-depend-on-packed-artifacts) 中添加评论告诉我们。

### Kotlin Gradle 插件的依赖行为与 `java-test-fixtures` 插件对齐

在 Kotlin 2.0.20 之前，如果你在项目中使用 [`java-test-fixtures` 插件](https://docs.gradle.org/current/userguide/java_testing.html#sec:java_test_fixtures)，Gradle 和 Kotlin Gradle 插件在依赖项传播方面存在差异。

Kotlin Gradle 插件会传播依赖项：

*   从 `java-test-fixtures` 插件的 `implementation` 和 `api` 依赖类型到 `test` 源集编译类路径。
*   从主源集的 `implementation` 和 `api` 依赖类型到 `java-test-fixtures` 插件的源集编译类路径。

然而，Gradle 只会传播 `api` 依赖类型中的依赖项。

这种行为差异导致某些项目在类路径中多次找到资源文件。

从 Kotlin 2.0.20 开始，Kotlin Gradle 插件的行为与 Gradle 的 `java-test-fixtures` 插件对齐，因此对于此插件或其他 Gradle 插件，此问题不再发生。

由于此更改，`test` 和 `testFixtures` 源集中的某些依赖项可能不再可访问。
如果发生这种情况，请将依赖声明类型从 `implementation` 更改为 `api`，或在受影响的源集上添加新的依赖声明。

### 在编译任务缺少对工件的依赖时，为罕见情况添加任务依赖

在 2.0.20 之前，我们发现某些情况下编译任务缺少对其工件输入之一的任务依赖。这意味着依赖编译任务的结果是不稳定的，因为有时工件已及时生成，但有时却没有。

为了解决此问题，Kotlin Gradle 插件现在会自动在这些情况下添加所需的任务依赖。

在极少数情况下，我们发现这种新行为可能导致循环依赖错误。
例如，如果你有多个编译，其中一个编译可以看到另一个编译的所有内部声明，并且生成的工件依赖于两个编译任务的输出，你可能会看到类似以下的错误：

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

默认情况下，此属性设置为 `true` 以跟踪任务依赖。要禁用编译任务中使用工件，从而不需要任务依赖，请在 `gradle.properties` 文件中添加以下内容：

```kotlin
kotlin.build.archivesTaskOutputAsFriendModule=false
```

有关更多信息，请参阅 [YouTrack](https://youtrack.jetbrains.com/issue/KT-69330) 中的议题。

## Compose 编译器

在 Kotlin 2.0.20 中，Compose 编译器得到了一些改进。

### 修复 2.0.0 中引入的不必要的重组问题

Compose 编译器 2.0.0 存在一个问题，即有时它会错误地推断具有非 JVM 目标的多平台项目中类型的稳定性。这可能导致不必要的（甚至无限的）重组。我们强烈建议将使用 Kotlin 2.0.0 构建的 Compose 应用程序更新到 2.0.10 或更高版本。

如果你的应用程序使用 Compose 编译器 2.0.10 或更高版本构建，但使用了使用 2.0.0 版本构建的依赖项，这些旧依赖项仍可能导致重组问题。
为防止这种情况发生，请将你的依赖项更新到与你的应用程序使用相同 Compose 编译器构建的版本。

### 配置编译器选项的新方式

我们引入了一种新的选项配置机制，以避免顶级参数的频繁变更。
Compose 编译器团队通过为 `composeCompiler {}` 块创建或删除顶级条目来测试功能变得更加困难。
因此，强跳过模式和非跳过组优化等选项现在通过 `featureFlags` 属性启用。
此属性将用于测试最终将成为默认值的新 Compose 编译器选项。

此更改也已应用于 Compose 编译器 Gradle 插件。要继续配置特性标志，
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

因此，`enableIntrinsicRemember`、`enableNonSkippingGroupOptimization` 和 `enableStrongSkippingMode` 属性已废弃。

我们感谢你对这种新方法的任何反馈，请在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-68651/Compose-provide-a-single-place-in-extension-to-configure-all-compose-flags) 中提出。

### 强跳过模式默认启用

Compose 编译器的强跳过模式现在默认启用。

强跳过模式是 Compose 编译器的一种配置选项，它改变了可跳过组合项的规则。
启用强跳过模式后，具有不稳定参数的组合项现在也可以被跳过。
强跳过模式还会自动记住组合函数中使用的 lambda 表达式，
因此你不再需要用 `remember` 包装 lambda 表达式以避免重组。

有关更多详细信息，请参阅[强跳过模式文档](https://developer.android.com/develop/ui/compose/performance/stability/strongskipping)。

### 组合跟踪标记默认启用

`includeTraceMarkers` 选项现在在 Compose 编译器 Gradle 插件中默认设置为 `true`，以匹配编译器插件中的默认值。这允许你在 Android Studio 系统跟踪分析器中查看可组合函数。有关组合跟踪的详细信息，请参阅这篇 [Android 开发者博客文章](https://medium.com/androiddevelopers/jetpack-compose-composition-tracing-9ec2b3aea535)。

### 非跳过组优化

此版本包含一个新编译器选项：启用后，不可跳过和不可重启的可组合函数将不再在组合体周围生成组。这会导致更少的内存分配，从而提高性能。
此选项是实验性的，默认禁用，但可以通过 [上面](#new-way-to-configure-compiler-options) 所示的 `OptimizeNonSkippingGroups` 特性标志启用。

此特性标志现在已准备好进行更广泛的测试。启用该特性时发现的任何问题都可以在 [Google 问题跟踪器](https://goo.gle/compose-feedback) 上提交。

### 支持抽象可组合函数中的默认参数

你现在可以为抽象可组合函数添加默认参数。

以前，Compose 编译器在尝试这样做时会报告错误，尽管它是有效的 Kotlin 代码。
我们现在已在 Compose 编译器中添加了对此的支持，并且限制已移除。
这对于包含默认的 `Modifier` 值特别有用：

```kotlin
abstract class Composables {
    @Composable
    abstract fun Composable(modifier: Modifier = Modifier)
}
```

对于开放的可组合函数，默认参数在 2.0.20 中仍然受限。此限制将在未来版本中解决。

## 标准库

标准库现在支持作为实验性特性的通用唯一标识符 (UUID)，并包含 Base64 解码的一些更改。

### 通用 Kotlin 标准库中对 UUID 的支持

> 此特性是[实验性](components-stability.md#stability-levels-explained)的。
> 要选择启用，请使用 `@ExperimentalUuidApi` 注解或编译器选项 `-opt-in=kotlin.uuid.ExperimentalUuidApi`。
>
{style="warning"}

Kotlin 2.0.20 在通用 Kotlin 标准库中引入了一个用于表示 [UUID（通用唯一标识符）](https://en.wikipedia.org/wiki/Universally_unique_identifier) 的类，以解决唯一标识项目的挑战。

此外，此特性还提供了以下 UUID 相关操作的 API：

*   生成 UUID。
*   从字符串表示形式解析 UUID 并将其格式化为字符串表示形式。
*   从指定的 128 位值创建 UUID。
*   访问 UUID 的 128 位。

以下代码示例演示了这些操作：

```kotlin
// 构造用于创建 UUID 的字节数组
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

// 生成随机 UUID
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

此特性和提供的 API 通过允许多个平台之间的代码共享来简化多平台软件开发。UUID 也非常适合在难以生成唯一标识符的环境中使用。

涉及 UUID 的一些示例用例包括：

*   为数据库记录分配唯一 ID。
*   生成 Web 会话标识符。
*   任何需要唯一标识或跟踪的场景。

### HexFormat 中对 `minLength` 的支持

> [`HexFormat` 类](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-hex-format/)及其属性是
> [实验性](components-stability.md#stability-levels-explained)的。
> 要选择启用，请使用 `@OptIn(ExperimentalStdlibApi::class)` 注解或编译器
> 选项 `-opt-in=kotlin.ExperimentalStdlibApi`。
>
{style="warning"}

Kotlin 2.0.20 为 [`NumberHexFormat` 类](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-hex-format/-number-hex-format/)添加了一个新的 `minLength` 属性，
通过 [`HexFormat.number`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-hex-format/number.html) 访问。
此属性允许你指定数字值的十六进制表示中的最小位数，从而可以通过用零填充来满足所需的长度。此外，可以使用 `removeLeadingZeros` 属性截去前导零：

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

`minLength` 属性不影响解析。但是，解析现在允许十六进制字符串的位数多于类型的宽度，如果额外的先导位是零。

### Base64 解码器行为的变化

> [`Base64` 类](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io.encoding/-base64/)及其
> 相关特性是[实验性](components-stability.md#stability-levels-explained)的。
> 要选择启用，请使用 `@OptIn(ExperimentalEncodingApi::class)`
> 注解或编译器选项 `-opt-in=kotlin.io.encoding.ExperimentalEncodingApi`。
>
{style="warning"}

Kotlin 2.0.20 对 Base64 解码器的行为引入了两项更改：

*   [Base64 解码器现在要求填充](#the-base64-decoder-now-requires-padding)
*   [已添加 `withPadding` 函数用于填充配置](#withpadding-function-for-padding-configuration)

#### Base64 解码器现在要求填充

Base64 编码器现在默认添加填充，并且解码器在解码时要求填充并禁止非零填充位。

#### `withPadding` 函数用于填充配置

已引入新的 `.withPadding()` 函数，以允许用户控制 Base64 编码和解码的填充行为：

```kotlin
val base64 = Base64.UrlSafe.withPadding(Base64.PaddingOption.ABSENT_OPTIONAL)
```

此函数允许创建具有不同填充选项的 `Base64` 实例：

| `PaddingOption` | 编码时 | 解码时 |
|---|---|---|
| `PRESENT` | 添加填充 | 要求填充 |
| `ABSENT` | 省略填充 | 不允许填充 |
| `PRESENT_OPTIONAL` | 添加填充 | 填充可选 |
| `ABSENT_OPTIONAL` | 省略填充 | 填充可选 |

你可以创建具有不同填充选项的 `Base64` 实例，并使用它们对数据进行编码和解码：

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
    println("使用 PRESENT 填充编码的数据：$encodedDataPresent")
    // 使用 PRESENT 填充编码的数据：Zm9vYmE=

    // 创建一个具有 URL 安全字母表和 ABSENT 填充的 Base64 实例
    val base64Absent = Base64.UrlSafe.withPadding(Base64.PaddingOption.ABSENT)
    val encodedDataAbsent = base64Absent.encode(data)
    println("使用 ABSENT 填充编码的数据：$encodedDataAbsent")
    // 使用 ABSENT 填充编码的数据：Zm9vYmE

    // 解码数据
    val decodedDataPresent = base64Present.decode(encodedDataPresent)
    println("使用 PRESENT 填充解码的数据：${String(decodedDataPresent)}")
    // 使用 PRESENT 填充解码的数据：fooba

    val decodedDataAbsent = base64Absent.decode(encodedDataAbsent)
    println("使用 ABSENT 填充解码的数据：${String(decodedDataAbsent)}")
    // 使用 ABSENT 填充解码的数据：fooba
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.0" id="kotlin-2-0-20-base64-decoder" validate="false"}

## 文档更新

Kotlin 文档收到了一些值得注意的更改：

*   改进的[标准输入页面](standard-input.md) - 了解如何使用 Java Scanner 和 `readln()`。
*   改进的 [K2 编译器迁移指南](k2-compiler-migration-guide.md) - 了解性能改进、与 Kotlin 库的兼容性以及如何处理自定义编译器插件。
*   改进的[异常页面](exceptions.md) - 了解异常以及如何抛出和捕获它们。
*   改进的 [在 JVM 中使用 JUnit 进行测试 - 教程](jvm-test-using-junit.md) - 了解如何使用 JUnit 创建测试。
*   改进的 [与 Swift/Objective-C 互操作性页面](native-objc-interop.md) - 了解如何在 Swift/Objective-C 代码中使用 Kotlin 声明以及如何在 Kotlin 代码中使用 Objective-C 声明。
*   改进的 [Swift 包导出设置页面](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-spm-export.html) - 了解如何设置可供 Swift 包管理器依赖项使用的 Kotlin/Native 输出。

## 安装 Kotlin 2.0.20

从 IntelliJ IDEA 2023.3 和 Android Studio Iguana (2023.2.1) Canary 15 开始，Kotlin 插件作为捆绑插件包含在你的 IDE 中。这意味着你无法再从 JetBrains Marketplace 安装该插件。

要更新到新的 Kotlin 版本，请在你的构建脚本中[将 Kotlin 版本更改为 2.0.20](releases.md#update-to-a-new-kotlin-version)。