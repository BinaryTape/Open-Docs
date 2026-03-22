在字符串字面量中](strings.md#multi-dollar-string-interpolation)

[查看 Kotlin 语言设计功能和提案的完整列表](kotlin-language-features-and-proposals.md)。

## Kotlin 编译器：统一管理编译器警告
<primary-label ref="experimental-general"/>

Kotlin 2.2.0 引入了一个新的编译器选项 `-Xwarning-level`。它旨在提供一种在 Kotlin 项目中统一管理编译器警告的方法。

以前，你只能应用通用的模块范围规则，例如使用 `-nowarn` 禁用所有警告，使用 `-Werror` 将所有警告转为编译错误，或者使用 `-Wextra` 启用额外的编译器检查。针对特定警告调整它们的唯一选项是 `-Xsuppress-warning` 选项。

通过新方案，你可以覆盖通用规则并以一致的方式排除特定的诊断信息。

### 如何应用

新的编译器选项语法如下：

```bash
-Xwarning-level=DIAGNOSTIC_NAME:(error|warning|disabled)
```

* `error`：将指定的警告提升为错误。
* `warning`：发出警告，这是默认启用的。
* `disabled`：在模块范围内完全抑制指定的警告。

请记住，你只能使用新的编译器选项配置**警告**的严重级别。

### 使用场景

通过新方案，你可以结合通用规则和特定规则，更好地微调项目中的警告报告。选择你的使用场景：

#### 抑制警告

| 命令 | 描述 |
|---------------------------------------------------|--------------------------------------------------------|
| [`-nowarn`](compiler-reference.md#nowarn) | 在编译期间抑制所有警告。 |
| `-Xwarning-level=DIAGNOSTIC_NAME:disabled` | 仅抑制指定的警告。 |
| `-nowarn -Xwarning-level=DIAGNOSTIC_NAME:warning` | 抑制除指定警告外的所有警告。 |

#### 将警告提升为错误

| 命令 | 描述 |
|---------------------------------------------------|--------------------------------------------------------------|
| [`-Werror`](compiler-reference.md#werror) | 将所有警告提升为编译错误。 |
| `-Xwarning-level=DIAGNOSTIC_NAME:error` | 仅将指定的警告提升为错误。 |
| `-Werror -Xwarning-level=DIAGNOSTIC_NAME:warning` | 将除指定警告外的所有警告提升为错误。 |

#### 启用额外的编译器警告

| 命令 | 描述 |
|----------------------------------------------------|------------------------------------------------------------------------------------------------------|
| [`-Wextra`](compiler-reference.md#wextra) | 启用所有额外的声明、表达式和类型编译器检查（如果为真则发出警告）。 |
| `-Xwarning-level=DIAGNOSTIC_NAME:warning` | 仅启用指定的额外编译器检查。 |
| `-Wextra -Xwarning-level=DIAGNOSTIC_NAME:disabled` | 启用除指定检查外的所有额外检查。 |

#### 警告列表

如果你有许多想要从通用规则中排除的警告，可以通过 [`@argfile`](compiler-reference.md#argfile) 在单独的文件中列出它们。

### 留下反馈

新的编译器选项仍处于[实验性](components-stability.md#stability-levels-explained)阶段。请向我们的问题跟踪器 [YouTrack](https://kotl.in/issue) 报告任何问题。

## Kotlin/JVM

Kotlin 2.2.0 为 JVM 带来了许多更新。编译器现在支持 Java 24 字节码，并引入了接口函数默认方法生成的更改。此版本还简化了 Kotlin 元数据中注解的处理，改进了内联值类与 Java 的互操作性，并包含了对 JVM record 注解的更好支持。

### 接口函数默认方法生成的更改

从 Kotlin 2.2.0 开始，除非另有配置，否则接口中声明的函数将编译为 JVM 默认方法。此更改会影响带有实现的 Kotlin 接口函数编译为字节码的方式。

此行为由新的稳定编译器选项 `-jvm-default` 控制，它取代了已弃用的 `-Xjvm-default` 选项。

你可以使用以下值控制 `-jvm-default` 选项的行为：

* `enable`（默认）：在接口中生成默认实现，并在子类和 `DefaultImpls` 类中包含桥接函数。使用此模式可以保持与旧版本 Kotlin 的二进制兼容性。
* `no-compatibility`：仅在接口中生成默认实现。此模式跳过兼容性桥接和 `DefaultImpls` 类，使其适用于新代码。
* `disable`：在接口中禁用默认实现。仅生成桥接函数和 `DefaultImpls` 类，与 Kotlin 2.2.0 之前的行为一致。

要配置 `-jvm-default` 编译器选项，请在 Gradle Kotlin DSL 中设置 `jvmDefault` 属性：

```kotlin
// build.gradle.kts
kotlin {
    compilerOptions {
        jvmDefault = JvmDefaultMode.NO_COMPATIBILITY
    }
}
```

### 支持在 Kotlin 元数据中读取和写入注解
<primary-label ref="experimental-general"/>

以前，你必须使用反射或字节码分析从编译后的 JVM 类文件中读取注解，并根据签名手动将它们与元数据条目匹配。这个过程很容易出错，尤其是对于重载函数。

现在，在 Kotlin 2.2.0 中，[](metadata-jvm.md) 引入了对读取存储在 Kotlin 元数据中的注解的支持。

要使注解在编译文件的元数据中可用，请添加以下编译器选项：

```kotlin
-Xannotations-in-metadata
```

或者将其添加到 Gradle 构建文件的 `compilerOptions {}` 块中：

```kotlin
// build.gradle.kts
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xannotations-in-metadata")
    }
}
```

启用此选项后，Kotlin 编译器会将注解与 JVM 字节码一起写入元数据，从而使 `kotlin-metadata-jvm` 库可以访问它们。

该库提供了以下用于访问注解的 API：

* `KmClass.annotations`
* `KmFunction.annotations`
* `KmProperty.annotations`
* `KmConstructor.annotations`
* `KmPropertyAccessorAttributes.annotations`
* `KmValueParameter.annotations`
* `KmFunction.extensionReceiverAnnotations`
* `KmProperty.extensionReceiverAnnotations`
* `KmProperty.backingFieldAnnotations`
* `KmProperty.delegateFieldAnnotations`
* `KmEnumEntry.annotations`

这些 API 目前处于[实验性](components-stability.md#stability-levels-explained)阶段。要选择使用，请使用 `@OptIn(ExperimentalAnnotationsInMetadata::class)` 注解。

以下是从 Kotlin 元数据读取注解的示例：

```kotlin
@file:OptIn(ExperimentalAnnotationsInMetadata::class)

import kotlin.metadata.ExperimentalAnnotationsInMetadata
import kotlin.metadata.jvm.KotlinClassMetadata

annotation class Label(val value: String)

@Label("Message class")
class Message

fun main() {
    val metadata = Message::class.java.getAnnotation(Metadata::class.java)
    val kmClass = (KotlinClassMetadata.readStrict(metadata) as KotlinClassMetadata.Class).kmClass
    println(kmClass.annotations)
    // [@Label(value = StringValue("Message class"))]
}
```

> 如果你在项目中使用 `kotlin-metadata-jvm` 库，我们建议测试并更新你的代码以支持注解。否则，当元数据中的注解在未来的 Kotlin 版本中变为[默认启用](https://youtrack.jetbrains.com/issue/KT-75736)时，你的项目可能会产生无效或不完整的元数据。
>
> 如果你遇到任何问题，请在我们的[问题跟踪器](https://youtrack.jetbrains.com/issue/KT-31857)中报告。
>
{style="warning"}

### 改进内联值类与 Java 的互操作性
<primary-label ref="experimental-general"/>

Kotlin 2.2.0 引入了一个新的实验性注解：[`@JvmExposeBoxed`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.jvm/-jvm-expose-boxed/)。此注解使从 Java 调用[内联值类](inline-classes.md)变得更加容易。

你可以在此视频中找到该功能的概述：

<video src="https://www.youtube.com/v/KSvq7jHr1lo" title="Kotlin 2.2.0 中面向 Java 暴露的内联值类"/>

默认情况下，Kotlin 编译内联值类时会使用**未装箱表示**（unboxed representations），这种表示性能更高，但从 Java 中调用往往很困难甚至不可能。例如：

```kotlin
@JvmInline value class PositiveInt(val number: Int) {
    init { require(number >= 0) }
}
```

在这种情况下，由于类是未装箱的，Java 无法调用构造函数。Java 也无法触发 `init` 块来确保 `number` 是正数。

当你使用 `@JvmExposeBoxed` 为该类添加注解时，Kotlin 会生成一个 Java 可以直接调用的公共构造函数，确保 `init` 块也会运行。

你可以将 `@JvmExposeBoxed` 注解应用于类、构造函数或函数级别，以实现对暴露给 Java 的内容的精细控制。

例如，在以下代码中，扩展函数 `.timesTwoBoxed()` **不能**从 Java 访问：

```kotlin
@JvmInline
value class MyInt(val value: Int)

fun MyInt.timesTwoBoxed(): MyInt = MyInt(this.value * 2)
```

为了能够创建 `MyInt` 类的实例并从 Java 代码调用 `.timesTwoBoxed()` 函数，请将 `@JvmExposeBoxed` 注解同时添加到类和函数中：

```kotlin
@JvmExposeBoxed
@JvmInline
value class MyInt(val value: Int)

@JvmExposeBoxed
fun MyInt.timesTwoBoxed(): MyInt = MyInt(this.value * 2)
```

有了这些注解，Kotlin 编译器将为 `MyInt` 类生成一个可供 Java 访问的构造函数。它还为该扩展函数生成了一个使用值类装箱形式的重载。因此，以下 Java 代码可以成功运行：

```java
MyInt input = new MyInt(5);
MyInt output = ExampleKt.timesTwoBoxed(input);
```

如果你不想为你想要暴露的内联值类的每个部分都添加注解，你可以将该注解有效地应用于整个模块。要将此行为应用于模块，请使用 `-Xjvm-expose-boxed` 选项对其进行编译。使用此选项编译的效果等同于模块中的每个声明都带有 `@JvmExposeBoxed` 注解。

这一新注解不会改变 Kotlin 内部编译或使用值类的方式，所有现有的已编译代码仍然有效。它只是增加了提高 Java 互操作性的新能力。使用值类的 Kotlin 代码的性能不受影响。

`@JvmExposeBoxed` 注解对于想要暴露成员函数的装箱变体并接收装箱返回值类型的库作者非常有用。它消除了在内联值类（高效但仅限 Kotlin）和数据类（兼容 Java 但始终装箱）之间进行选择的需要。

有关 `@JvmExposedBoxed` 注解工作原理及其解决问题的更详细说明，请参阅此 [KEEP](https://github.com/Kotlin/KEEP/blob/jvm-expose-boxed/proposals/jvm-expose-boxed.md) 提案。

### 对 JVM record 注解的改进支持

Kotlin 自 1.5.0 起就已支持 [JVM record](jvm-records.md)。现在，Kotlin 2.2.0 改进了 Kotlin 处理 record 组件注解的方式，特别是与 Java 的 [`RECORD_COMPONENT`](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/lang/annotation/ElementType.html#RECORD_COMPONENT) 目标相关的处理。

首先，如果你想将 `RECORD_COMPONENT` 用作注解目标，你需要手动为 Kotlin (`@Target`) 和 Java 添加注解。这是因为 Kotlin 的 `@Target` 注解不支持 `RECORD_COMPONENT`。例如：

```kotlin
@Target(AnnotationTarget.CLASS, AnnotationTarget.PROPERTY)
@java.lang.annotation.Target(ElementType.CLASS, ElementType.RECORD_COMPONENT)
annotation class exampleClass
```

手动维护这两个列表很容易出错，因此 Kotlin 2.2.0 在 Kotlin 和 Java 目标不匹配时引入了编译器警告。例如，如果你在 Java 目标列表中省略了 `ElementType.CLASS`，编译器会报告：

```
Incompatible annotation targets: Java target 'CLASS' missing, corresponding to Kotlin targets 'CLASS'.
```

其次，在 record 中传播注解时，Kotlin 的行为与 Java 不同。在 Java 中，record 组件上的注解会自动应用于支持字段、getter 和构造函数形参。Kotlin 默认情况下不会这样做，但你现在可以使用 [`@all:` 使用点目标](#all-meta-target-for-properties)来复制该行为。

例如：

```kotlin
@JvmRecord
data class Person(val name: String, @all:Positive val age: Int)
```

当你将 `@JvmRecord` 与 `@all:` 一起使用时，Kotlin 现在：

* 将注解传播到属性、支持字段、构造函数形参和 getter。
* 如果该注解支持 Java 的 `RECORD_COMPONENT`，也会将该注解应用于 record 组件。

## Kotlin/Native

从 2.2.0 开始，Kotlin/Native 使用 LLVM 19。此版本还带来了几个旨在跟踪和调整内存消耗的实验性功能。

### 基于对象的内存分配
<primary-label ref="experimental-opt-in"/>

Kotlin/Native 的[内存分配器](https://github.com/JetBrains/kotlin/blob/master/kotlin-native/runtime/src/alloc/custom/README.md)现在可以基于对象预留内存。在某些情况下，它可以帮助你满足严格的内存限制或减少应用程序启动时的内存消耗。

新功能旨在取代 `-Xallocator=std` 编译器选项，该选项启用了系统内存分配器而不是默认的分配器。现在，你可以在不切换内存分配器的情况下禁用缓冲（分配的分页）。

该功能目前处于[实验性](components-stability.md#stability-levels-explained)阶段。要启用它，请在 `gradle.properties` 文件中设置以下选项：

```none
kotlin.native.binary.pagedAllocator=false
```

请向我们的问题跟踪器 [YouTrack](https://kotl.in/issue) 报告任何问题。

### 运行时支持 Latin-1 编码的字符串
<primary-label ref="experimental-opt-in"/>

Kotlin 现在支持 Latin-1 编码的字符串，类似于 [JVM](https://openjdk.org/jeps/254)。这应该有助于减小应用程序的二进制文件大小并调整内存消耗。

默认情况下，Kotlin 中的字符串使用 UTF-16 编码存储，其中每个字符由两个字节表示。在某些情况下，这会导致字符串在二进制文件中占用的空间是源代码的两倍，并且从简单的 ASCII 文件读取数据占用的内存是磁盘存储文件的两倍。

反之，[Latin-1 (ISO 8859-1)](https://en.wikipedia.org/wiki/ISO/IEC_8859-1) 编码仅用一个字节表示前 256 个 Unicode 字符。在启用 Latin-1 支持的情况下，只要所有字符都在其范围内，字符串就会以 Latin-1 编码存储。否则，将使用默认的 UTF-16 编码。

#### 如何启用 Latin-1 支持

该功能目前处于[实验性](components-stability.md#stability-levels-explained)阶段。要启用它，请在 `gradle.properties` 文件中设置以下选项：

```none
kotlin.native.binary.latin1Strings=true
```
#### 已知问题

只要该功能处于实验性阶段，cinterop 扩展函数 [`String.pin`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/pin.html)、[`String.usePinned`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/use-pinned.html) 和 [`String.refTo`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/ref-to.html) 的效率就会降低。每次调用它们都可能触发字符串自动转换为 UTF-16。

Kotlin 团队非常感谢我们在 Google 的同事，特别是 [Sonya Valchuk](https://github.com/pyos) 实现了这一功能。

有关 Kotlin 中内存消耗的更多信息，请参阅[文档](native-memory-manager.md#memory-consumption)。

### 改进 Apple 平台上的内存消耗跟踪

从 Kotlin 2.2.0 开始，由 Kotlin 代码分配的内存现在会被标记。这可以帮助你调试 Apple 平台上的内存问题。

在检查应用程序的高内存使用情况时，你现在可以识别出 Kotlin 代码预留了多少内存。Kotlin 的份额标记有一个标识符，可以通过 Xcode Instruments 中的 VM Tracker 等工具进行跟踪。

此功能默认启用，但仅在满足以下**所有**条件时才在 Kotlin/Native 默认内存分配器中可用：

* **标记已启用**。内存应使用有效的标识符进行标记。Apple 建议使用 240 到 255 之间的数字；默认值为 246。

  如果你设置了 `kotlin.native.binary.mmapTag=0` Gradle 属性，则标记将被禁用。

* **使用 mmap 分配**。分配器应使用 `mmap` 系统调用将文件映射到内存中。

  如果你设置了 `kotlin.native.binary.disableMmap=true` Gradle 属性，默认分配器将使用 `malloc` 而不是 `mmap`。

* **分页已启用**。分配的分页（缓冲）应启用。

  如果你设置了 [`kotlin.native.binary.pagedAllocator=false`](#per-object-memory-allocation) Gradle 属性，则内存将基于对象进行预留。

有关 Kotlin 中内存消耗的更多信息，请参阅[文档](native-memory-manager.md#memory-consumption)。

### LLVM 从 16 更新至 19

在 Kotlin 2.2.0 中，我们将 LLVM 从版本 16 更新到了 19。新版本包含性能改进、错误修复和安全更新。

此更新不应影响你的代码，但如果你遇到任何问题，请向我们的[问题跟踪器](http://kotl.in/issue)报告。

### Windows 7 目标已弃用

从 Kotlin 2.2.0 开始，支持的最低 Windows 版本已从 Windows 7 提高到 Windows 10。由于 Microsoft 已于 2025 年 1 月停止支持 Windows 7，我们也决定弃用此旧版目标。

欲了解更多信息，请参阅 [](native-target-support.md)。

## Kotlin/Wasm

在此版本中，[Wasm 目标的构建基础架构已与 JavaScript 目标分离](#build-infrastructure-for-wasm-target-separated-from-javascript-target)。此外，你现在可以[针对每个项目或模块配置 Binaryen 工具](#per-project-binaryen-configuration)。

### Wasm 目标的构建基础架构已与 JavaScript 目标分离

以前，`wasmJs` 目标与 `js` 目标共享相同的基础架构。因此，这两个目标都托管在同一个目录 (`build/js`) 中，并使用相同的 NPM 任务和配置。

现在，`wasmJs` 目标拥有独立于 `js` 目标的基础架构。这使得 Wasm 任务和类型与 JavaScript 的分离，从而能够进行独立配置。

此外，Wasm 相关的项目文件和 NPM 依赖项现在存储在单独的 `build/wasm` 目录中。

为 Wasm 引入了新的 NPM 相关任务，而现有的 JavaScript 任务现在仅专用于 JavaScript：

| **Wasm 任务** | **JavaScript 任务** |
|------------------------|----------------------|
| `kotlinWasmNpmInstall` | `kotlinNpmInstall` |
| `wasmRootPackageJson` | `rootPackageJson` |

同样，增加了新的 Wasm 特有声明：

| **Wasm 声明** | **JavaScript 声明** |
|---------------------------|-----------------------------|
| `WasmNodeJsRootPlugin` | `NodeJsRootPlugin` |
| `WasmNodeJsPlugin` | `NodeJsPlugin` |
| `WasmYarnPlugin` | `YarnPlugin` |
| `WasmNodeJsRootExtension` | `NodeJsRootExtension` |
| `WasmNodeJsEnvSpec` | `NodeJsEnvSpec` |
| `WasmYarnRootEnvSpec` | `YarnRootEnvSpec` |

你现在可以独立于 JavaScript 目标来处理 Wasm 目标，这简化了配置过程。

此更改默认启用，无需额外设置。

### 针对每个项目的 Binaryen 配置

在 Kotlin/Wasm 中用于[优化生产构建](whatsnew20.md#optimized-production-builds-by-default-using-binaryen)的 Binaryen 工具，此前是在根项目中统一配置的。

现在，你可以针对每个项目或模块配置 Binaryen 工具。这一更改符合 Gradle 的最佳实践，并确保更好地支持[项目隔离](https://docs.gradle.org/current/userguide/isolated_projects.html)等功能，从而在复杂构建中提高构建性能和可靠性。

此外，如果需要，你现在可以为不同的模块配置不同版本的 Binaryen。

此功能默认启用。但是，如果你有 Binaryen 的自定义配置，现在需要针对每个项目应用，而不是仅在根项目中应用。

## Kotlin/JS

此版本改进了[`@JsPlainObject` 接口中的 `copy()` 函数](#fix-for-copy-in-jsplainobject-interfaces)、[带有 `@JsModule` 注解文件中的类型别名](#support-for-type-aliases-in-files-with-jsmodule-annotation)以及其他 Kotlin/JS 功能。

### 修复 `@JsPlainObject` 接口中的 `copy()`

Kotlin/JS 有一个名为 `js-plain-objects` 的实验性插件，它为带 `@JsPlainObject` 注解的接口引入了 `copy()` 函数。你可以使用 `copy()` 函数来操作对象。

然而，`copy()` 的初始实现与继承不兼容，这在 `@JsPlainObject` 接口扩展其他接口时会导致问题。

为了避免对普通对象的限制，`copy()` 函数已从对象本身移动到了它的伴生对象中：

```kotlin
@JsPlainObject
external interface User {
    val name: String
    val age: Int
}

fun main() {
    val user = User(name = "SomeUser", age = 21)
    // 这种语法不再有效
    val copy = user.copy(age = 35)      
    // 这是正确的语法
    val copy = User.copy(user, age = 35)
}
```

此更改解决了继承层次结构中的冲突并消除了歧义。从 Kotlin 2.2.0 开始默认启用。

### 在带有 `@JsModule` 注解的文件中支持类型别名

以前，为了从 JavaScript 模块导入声明而使用 `@JsModule` 注解的文件被限制为只能包含外部声明。这意味着你不能在这些文件中声明 `typealias`。

从 Kotlin 2.2.0 开始，你可以在标记有 `@JsModule` 的文件中声明类型别名：

```kotlin
@file:JsModule("somepackage")
package somepackage
typealias SomeClass = Any
```

这一更改减少了 Kotlin/JS 互操作性限制的一个方面，未来版本还计划进行更多改进。

带有 `@JsModule` 文件中对类型别名的支持默认启用。

### 在多平台 `expect` 声明中支持 `@JsExport`

在 Kotlin Multiplatform 项目中使用[`expect/actual` 机制](https://kotlinlang.org/docs/multiplatform/multiplatform-expect-actual.html)时，无法在通用代码中为 `expect` 声明使用 `@JsExport` 注解。

从该版本开始，你可以直接对 `expect` 声明应用 `@JsExport`：

```kotlin
// commonMain

// 此前会报错，但现在可以正常工作
@JsExport
expect class WindowManager {
    fun close()
}

@JsExport
fun acceptWindowManager(manager: WindowManager) {
    ...
}

// jsMain

@JsExport
actual class WindowManager {
    fun close() {
        window.close()
    }
}
```

你还必须在 JavaScript 源集中为对应的 `actual` 实现添加 `@JsExport` 注解，并且它必须仅使用可导出的类型。

此修复允许在 `commonMain` 中定义的共享代码被正确导出到 JavaScript。你现在可以将多平台代码暴露给 JavaScript 消费者，而无需使用手动变通方案。

此更改默认启用。

### 在 `Promise<Unit>` 类型中使用 `@JsExport` 的能力

以前，当你尝试使用 `@JsExport` 注解导出返回 `Promise<Unit>` 类型的函数时，Kotlin 编译器会产生错误。

虽然 `Promise<Int>` 等返回类型可以正常工作，但使用 `Promise<Unit>` 会触发“不可导出类型”警告，尽管它在 TypeScript 中可以正确映射到 `Promise<void>`。

这一限制已被移除。现在，以下代码可以编译且不会报错：

```kotlin
// 此前可以正常工作
@JsExport
fun fooInt(): Promise<Int> = GlobalScope.promise {
    delay(100)
    return@promise 42
}

// 此前会报错，但现在可以正常工作
@JsExport
fun fooUnit(): Promise<Unit> = GlobalScope.promise {
    delay(100)
}
```

此更改移除了 Kotlin/JS 互操作模型中不必要的限制。此修复默认启用。

## Gradle

Kotlin 2.2.0 与 Gradle 7.6.3 到 8.14 完全兼容。你也可以使用最新 Gradle 版本。但是，请注意，这样做可能会导致弃用警告，并且某些新的 Gradle 功能可能无法工作。

在此版本中，Kotlin Gradle 插件对其诊断功能进行了多项改进。它还引入了[二进制兼容性验证](#binary-compatibility-validation-included-in-kotlin-gradle-plugin)的实验性集成，使得开发库变得更加容易。

### Kotlin Gradle 插件中包含二进制兼容性验证
<primary-label ref="experimental-general"/>

为了更轻松地检查库版本之间的二进制兼容性，我们正在尝试将[二进制兼容性验证器](https://github.com/Kotlin/binary-compatibility-validator)的功能移动到 Kotlin Gradle 插件 (KGP) 中。你可以在练手项目中试用它，但我们还不建议在生产环境中使用它。

原来的[二进制兼容性验证器](https://github.com/Kotlin/binary-compatibility-validator)在此实验阶段将继续维护。

Kotlin 库可以使用两种二进制格式之一：JVM 类文件或 `klib`。由于这些格式不兼容，KGP 分别处理它们。

要启用二进制兼容性验证功能集，请在 `build.gradle.kts` 文件的 `kotlin{}` 块中添加以下内容：

```kotlin
// build.gradle.kts
kotlin {
    @OptIn(org.jetbrains.kotlin.gradle.dsl.abi.ExperimentalAbiValidation::class)
    abiValidation {
        // 使用 set() 函数以确保与旧版本 Gradle 的兼容性
        enabled.set(true)
    }
}
```

如果你的项目中有多个模块想要检查二进制兼容性，请在每个模块中单独配置该功能。每个模块都可以有自己的自定义配置。

启用后，运行 `checkLegacyAbi` Gradle 任务来检查二进制兼容性问题。你可以在 IntelliJ IDEA 中或在项目目录的命令行中运行该任务：

```kotlin
./gradlew checkLegacyAbi
```

此任务会将当前代码的应用程序二进制接口 (ABI) 转储生成为一个 UTF-8 文本文件。然后，该任务会将新的转储与上一个版本的转储进行比较。如果任务发现任何差异，它会将其报告为错误。在审查错误后，如果你认为更改是可以接受的，可以通过运行 `updateLegacyAbi` Gradle 任务来更新参考 ABI 转储。

#### 过滤类

该功能允许你在 ABI 转储中过滤类。你可以通过名称或部分名称，或者通过标记它们的注解（或注解名称的一部分）来显式包含或排除类。

例如，此示例排除了 `com.company` 包中的所有类：

```kotlin
// build.gradle.kts
kotlin {
    @OptIn(org.jetbrains.kotlin.gradle.dsl.abi.ExperimentalAbiValidation::class)
    abiValidation {
        filters.excluded.byNames.add("com.company.**")
    }
}
```

探索 [KGP API 参考](https://kotlinlang.org/api/kotlin-gradle-plugin/kotlin-gradle-plugin-api/org.jetbrains.kotlin.gradle.dsl.abi/)以了解有关配置二进制兼容性验证器的更多信息。

#### 多平台限制

在多平台项目中，如果你的宿主环境不支持所有目标的交叉编译，KGP 会尝试通过检查其他目标的 ABI 转储来推断不支持目标的 ABI 更改。如果你稍后切换到**可以**编译所有目标的宿主环境，这种方法有助于避免错误的验证失败。

你可以通过在 `build.gradle.kts` 文件中添加以下内容来更改此默认行为，以便 KGP 不会为不支持的目标推断 ABI 更改：

```kotlin
// build.gradle.kts
kotlin {
    @OptIn(org.jetbrains.kotlin.gradle.dsl.abi.ExperimentalAbiValidation::class)
    abiValidation {
        klib {
            keepUnsupportedTargets = false
        }
    }
}
```

但是，如果你的项目中有一个不支持的目标，运行 `checkLegacyAbi` 任务将会失败，因为该任务无法创建 ABI 转储。如果任务失败比因为推断 ABI 更改而错过不兼容的更改更重要，那么这种行为可能是理想的。

### Kotlin Gradle 插件控制台支持富媒体输出

在 Kotlin 2.2.0 中，我们支持在 Gradle 构建过程中控制台输出颜色和其他富媒体输出，这使得阅读和理解报告的诊断信息变得更加容易。

Linux 和 macOS 上支持的终端模拟器中提供富媒体输出，我们正在努力增加对 Windows 的支持。

![Gradle 控制台](gradle-console-rich-output.png){width=600}

此功能默认启用，但如果你想覆盖它，请在 `gradle.properties` 文件中添加以下 Gradle 属性：

```
org.gradle.console=plain
```

有关此属性及其选项的更多信息，请参阅 Gradle 有关[自定义日志格式](https://docs.gradle.org/current/userguide/command_line_interface.html#sec:command_line_customizing_log_format)的文档。

### KGP 诊断中集成 Problems API

以前，Kotlin Gradle 插件 (KGP) 仅能将警告和错误等诊断信息作为纯文本输出到控制台或日志。

从 2.2.0 开始，KGP 引入了额外的报告机制：它现在使用 [Gradle 的 Problems API](https://docs.gradle.org/current/kotlin-dsl/gradle/org.gradle.api.problems/index.html)，这是一种在构建过程中报告丰富的、结构化的问题的标准化方式。

KGP 诊断信息现在更容易阅读，并且在 Gradle CLI 和 IntelliJ IDEA 等不同界面中显示得更加一致。

从 Gradle 8.6 或更高版本开始，此集成默认启用。由于 API 仍在演进中，请使用最新的 Gradle 版本以受益于最新的改进。

### KGP 与 `--warning-mode` 的兼容性

此前，Kotlin Gradle 插件 (KGP) 诊断报告的问题使用固定的严重级别，这意味着 Gradle 的 [`--warning-mode` 命令行选项](https://docs.gradle.org/current/userguide/command_line_interface.html#sec:command_line_warnings)对 KGP 显示错误的方式没有影响。

现在，KGP 诊断与 `--warning-mode` 选项兼容，提供了更多的灵活性。例如，你可以将所有警告转换为错误，或者完全禁用警告。

通过此更改，KGP 诊断会根据所选的警告模式调整输出：

* 当你设置 `--warning-mode=fail` 时，严重级别为 `Severity.Warning` 的诊断信息现在会提升为 `Severity.Error`。
* 当你设置 `--warning-mode=none` 时，严重级别为 `Severity.Warning` 的诊断信息将不再记录。

此行为从 2.2.0 开始默认启用。

要忽略 `--warning-mode` 选项，请在 `gradle.properties` 文件中设置以下 Gradle 属性：

```
kotlin.internal.diagnostics.ignoreWarningMode=true
```

## 新的实验性构建工具 API
<primary-label ref="experimental-general"/>

你可以在各种构建系统中使用 Kotlin，例如 Gradle、Maven、Amper 等。然而，将 Kotlin 集成到每个系统中以支持完整的功能集（如增量编译以及与 Kotlin 编译器插件、守护进程和 Kotlin Multiplatform 的兼容性）需要付出巨大的努力。

为了简化此过程，Kotlin 2.2.0 引入了一个新的实验性构建工具 API (BTA)。BTA 是一个通用 API，充当构建系统与 Kotlin 编译器生态系统之间的抽象层。通过这种方法，每个构建系统只需支持单个 BTA 入口点。

目前，BTA 仅支持 Kotlin/JVM。JetBrains 的 Kotlin 团队已经在 Kotlin Gradle 插件 (KGP) 和 `kotlin-maven-plugin` 中使用它。你可以通过这些插件尝试 BTA，但该 API 本身尚未准备好在你自己的构建工具集成中普遍使用。如果你对 BTA 提案感到好奇或想分享反馈，请参阅此 [KEEP](https://github.com/Kotlin/KEEP/issues/421) 提案。

要在以下插件中试用 BTA：

* 在 KGP 中，在 `gradle.properties` 文件中添加以下属性：

```kotlin
kotlin.compiler.runViaBuildToolsApi=true
```   

* 在 Maven 中，你不需要做任何事情。它默认启用。

BTA 目前对 Maven 插件没有直接的好处，但它为更快交付新功能奠定了坚实的基础，例如[对 Kotlin 守护进程的支持](https://youtrack.jetbrains.com/issue/KT-77587/Maven-Introduce-Kotlin-daemon-support-and-make-it-enabled-by-default)以及[增量编译的稳定](https://youtrack.jetbrains.com/issue/KT-77086/Stabilize-incremental-compilation-in-Maven)。

对于 KGP，使用 BTA 已经带来了以下好处：

* [改进的“进程内 (in process)”编译器执行策略](#improved-in-process-compiler-execution-strategy)
* [更灵活地从 Kotlin 配置不同的编译器版本](#flexibility-to-configure-different-compiler-versions-from-kotlin)

### 改进的“进程内 (in process)”编译器执行策略

KGP 支持三种[Kotlin 编译器执行策略](gradle-compilation-and-caches.md#defining-kotlin-compiler-execution-strategy)。以前，在 Gradle 守护进程中运行编译器的“进程内”策略不支持增量编译。

现在，通过使用 BTA，“进程内”策略**确实**支持增量编译。要使用它，请在 `gradle.properties` 文件中添加以下属性：

```kotlin
kotlin.compiler.execution.strategy=in-process
```

### 灵活地从 Kotlin 配置不同的编译器版本

有时你可能想在代码中使用较新的 Kotlin 编译器版本，同时让 KGP 保持在旧版本上——例如，在尝试新语言功能的同时仍然在处理构建脚本弃用。或者你可能想更新 KGP 的版本但保留旧的 Kotlin 编译器版本。

BTA 使这成为可能。以下是你在 `build.gradle.kts` 文件中配置它的方式：

```kotlin
// build.gradle.kts
import org.jetbrains.kotlin.buildtools.api.ExperimentalBuildToolsApi
import org.jetbrains.kotlin.gradle.ExperimentalKotlinGradlePluginApi

plugins { 
    kotlin("jvm") version "2.2.0"
}

group = "org.jetbrains.example"
version = "1.0-SNAPSHOT"

repositories { 
    mavenCentral()
}

kotlin { 
    jvmToolchain(8)
    @OptIn(ExperimentalBuildToolsApi::class, ExperimentalKotlinGradlePluginApi::class) 
    compilerVersion.set("2.1.21") // 使用与 2.2.0 不同的版本
}

```

BTA 支持配置 KGP 和 Kotlin 编译器版本，包含之前的三个主要版本和一个后续主要版本。因此在 KGP 2.2.0 中，支持 Kotlin 编译器版本 2.1.x、2.0.x 和 1.9.25。KGP 2.2.0 也与未来的 Kotlin 编译器版本 2.2.x 和 2.3.x 兼容。

但是，请记住，将不同的编译器版本与编译器插件一起使用可能会导致 Kotlin 编译器异常。Kotlin 团队计划在未来版本中解决这些类问题。

在这些插件中尝试 BTA，并在专用的 YouTrack 工单中向我们发送你的反馈：[KGP](https://youtrack.jetbrains.com/issue/KT-56574) 和 [Maven 插件](https://youtrack.jetbrains.com/issue/KT-73012)。

## 标准库

在 Kotlin 2.2.0 中，[`Base64` API](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.io.encoding/-base64/) 和 [`HexFormat` API](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.text/-hex-format/) 现已[稳定](components-stability.md#stability-levels-explained)。

### 稳定的 Base64 编码与解码

Kotlin 1.8.20 引入了[对 Base64 编码与解码的实验性支持](whatsnew1820.md#support-for-base64-encoding)。在 Kotlin 2.2.0 中，[Base64 API](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.io.encoding/-base64/) 现已[稳定](components-stability.md#stability-levels-explained)，并包含四种编码方案，此版本增加了新的 `Base64.Pem`：

* [`Base64.Default`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.io.encoding/-base64/-default/) 使用标准的 [Base64 编码方案](https://www.rfc-editor.org/rfc/rfc4648#section-4)。

  > `Base64.Default` 是 `Base64` 类的伴生对象。因此，你可以使用 `Base64.encode()` 和 `Base64.decode()` 来调用其函数，而不是 `Base64.Default.encode()` 和 `Base64.Default.decode()`。
  >
  {style="tip"}

* [`Base64.UrlSafe`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.io.encoding/-base64/-default/-url-safe.html) 使用[“URL 和文件名安全”](https://www.rfc-editor.org/rfc/rfc4648#section-5)编码方案。
* [`Base64.Mime`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.io.encoding/-base64/-default/-mime.html) 使用 [MIME](https://www.rfc-editor.org/rfc/rfc2045#section-6.8) 编码方案，在编码期间每 76 个字符插入一个换行符，并在解码期间跳过非法字符。
* `Base64.Pem` 编码数据类似于 `Base64.Mime`，但将行长度限制为 64 个字符。

你可以使用 Base64 API 将二进制数据编码为 Base64 字符串，并将其解码回字节。

示例如下：

```kotlin
val foBytes = "fo".map { it.code.toByte() }.toByteArray()
Base64.Default.encode(foBytes) // "Zm8="
// 或者：
// Base64.encode(foBytes)

val foobarBytes = "foobar".map { it.code.toByte() }.toByteArray()
Base64.UrlSafe.encode(foobarBytes) // "Zm9vYmFy"

Base64.Default.decode("Zm8=") // foBytes
// 或者：
// Base64.decode("Zm8=")

Base64.UrlSafe.decode("Zm9vYmFy") // foobarBytes
```

在 JVM 上，使用 `.encodingWith()` 和 `.decodingWith()` 扩展函数通过输入和输出流对 Base64 进行编码和解码：

```kotlin
import kotlin.io.encoding.*
import java.io.ByteArrayOutputStream

fun main() {
    val output = ByteArrayOutputStream()
    val base64Output = output.encodingWith(Base64.Default)

    base64Output.use { stream ->
        stream.write("Hello World!!".encodeToByteArray()) 
    }

    println(output.toString())
    // SGVsbG8gV29ybGQhIQ==
}
```

### 使用 `HexFormat` API 进行稳定的十六进制解析与格式设置

[Kotlin 1.9.0](whatsnew19.md#new-hexformat-class-to-format-and-parse-hexadecimals) 中引入的 [`HexFormat` API](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.text/-hex-format/) 现已[稳定](components-stability.md#stability-levels-explained)。你可以使用它在数值和十六进制字符串之间进行转换。

例如：

```kotlin
fun main() {
    //sampleStart
    println(93.toHexString())
    //sampleEnd
}
```
{kotlin-runnable="true"}

欲了解更多信息，请参阅[用于格式设置和解析十六进制的新 HexFormat 类](whatsnew19.md#new-hexformat-class-to-format-and-parse-hexadecimals)。

## Compose 编译器

在此版本中，Compose 编译器引入了对可组合函数引用的支持，并更改了多个功能标志的默认设置。

### 支持 `@Composable` 函数引用

Compose 编译器从 Kotlin 2.2.0 版本开始支持可组合函数引用的声明和使用：

```kotlin
val content: @Composable (String) -> Unit = ::Text

@Composable fun App() {
    content("My App")
}
```

可组合函数引用在运行时的行为与可组合 Lambda 对象略有不同。特别是，可组合 Lambda 通过扩展 `ComposableLambda` 类允许对跳过 (skipping) 进行更精细的控制。函数引用预期实现 `KCallable` 接口，因此同样的优化无法应用于它们。

### `PausableComposition` 功能标志默认启用

从 Kotlin 2.2.0 开始，`PausableComposition` 功能标志默认启用。此标志调整了 Compose 编译器对可重启函数的输出，允许运行时强制跳过行为，从而通过跳过每个函数有效地暂停重组 (composition)。这允许重型重组在帧之间拆分，这将在未来的发布中被预取 (prefetching) 功能使用。

要在 Gradle 配置中禁用此功能标志，请添加以下内容：

```kotlin
// build.gradle.kts
composeCompiler {
    featureFlag = setOf(ComposeFeatureFlag.PausableComposition.disabled())
}
```

### `OptimizeNonSkippingGroups` 功能标志默认启用

从 Kotlin 2.2.0 开始，`OptimizeNonSkippingGroups` 功能标志默认启用。此优化通过删除为不可跳过的可组合函数生成的组调用来提高运行时性能。它不应导致运行时出现任何可观察的行为变化。

如果你遇到任何问题，可以通过禁用该功能标志来验证是否是此更改导致的问题。请向 [Jetpack Compose 问题跟踪器](https://issuetracker.google.com/issues/new?component=610764&template=1424126)报告任何问题。

要在 Gradle 配置中禁用 `OptimizeNonSkippingGroups` 标志，请添加以下内容：

```kotlin
composeCompiler {
    featureFlag = setOf(ComposeFeatureFlag.OptimizeNonSkippingGroups.disabled())
}
```

### 已弃用的功能标志

`StrongSkipping` 和 `IntrinsicRemember` 功能标志现已弃用，并将在未来版本中移除。如果你遇到任何需要禁用这些功能标志的问题，请向 [Jetpack Compose 问题跟踪器](https://issuetracker.google.com/issues/new?component=610764&template=1424126)报告。

## 重大变更与弃用

本节重点介绍值得注意的重要重大变更和弃用。请参阅我们的[兼容性指南](compatibility-guide-22.md)以获取此版本中所有重大变更和弃用的完整概述。

* 从 Kotlin 2.2.0 开始，编译器[不再支持 `-language-version=1.6` 或 `-language-version=1.7`](compatibility-guide-22.md#drop-support-in-language-version-for-1-6-and-1-7)。早于 1.8 的语言功能集不再受支持，但语言本身仍与 Kotlin 1.0 完全向后兼容。
* 对 Ant 构建系统的支持已弃用。Kotlin 对 Ant 的支持已经很长时间没有活跃开发了，并且由于其用户群相对较小，没有计划进一步维护。我们计划在 2.3.0 中移除 Ant 支持。
* Kotlin 2.2.0 将 Gradle 中 [`kotlinOptions{}` 块的弃用级别提升为错误](compatibility-guide-22.md#deprecate-kotlinoptions-dsl)。请改用 `compilerOptions{}` 块。有关更新构建脚本的指导，请参阅[从 `kotlinOptions{}` 迁移到 `compilerOptions{}`](gradle-compiler-options.md#migrate-from-kotlinoptions-to-compileroptions)。
* Kotlin 脚本编写 (scripting) 仍然是 Kotlin 生态系统的重要部分，但我们正专注于特定的使用场景，如自定义脚本，以及 `gradle.kts` 和 `main.kts` 脚本，以提供更好的体验。欲了解更多信息，请参阅我们更新后的[博客文章](https://blog.jetbrains.com/kotlin/2024/11/state-of-kotlin-scripting-2024/)。因此，Kotlin 2.2.0 弃用了以下支持：
  
  * REPL：要继续通过 `kotlinc` 使用 REPL，请选择使用 `-Xrepl` 编译器选项。
  * JSR-223：由于此 [JSR](https://jcp.org/en/jsr/detail?id=223) 处于**撤回 (Withdrawn)** 状态，JSR-223 实现将继续在 1.9 语言版本下工作，但未来不会迁移到 K2 编译器。
  * `KotlinScriptMojo` Maven 插件：我们没有看到该插件有足够的吸引力。如果你继续使用它，将看到编译器警告。

* 在 Kotlin 2.2.0 中，[`KotlinCompileTool`](https://kotlinlang.org/api/kotlin-gradle-plugin/kotlin-gradle-plugin-api/org.jetbrains.kotlin.gradle.tasks/-kotlin-compile-tool/#) 中的 [`setSource()`](https://kotlinlang.org/api/kotlin-gradle-plugin/kotlin-gradle-plugin-api/org.jetbrains.kotlin.gradle.tasks/-kotlin-compile-tool/set-source.html#) 函数现在[会替换已配置的源，而不是向其添加](compatibility-guide-22.md#correct-setsource-function-in-kotlincompiletool-to-replace-sources)。如果你想在不替换现有源的情况下添加源，请使用 [`source()`](https://kotlinlang.org/api/kotlin-gradle-plugin/kotlin-gradle-plugin-api/org.jetbrains.kotlin.gradle.tasks/-kotlin-compile-tool/source.html#) 函数。
* `BaseKapt` 中 [`annotationProcessorOptionProviders`](https://kotlinlang.org/api/kotlin-gradle-plugin/kotlin-gradle-plugin-api/org.jetbrains.kotlin.gradle.tasks/-base-kapt/annotation-processor-option-providers.html#) 的类型已[从 `MutableList<Any>` 更改为 `MutableList<CommandLineArgumentProvider>`](compatibility-guide-22.md#deprecate-basekapt-annotationprocessoroptionproviders-property)。如果你的代码目前将列表作为单个元素添加，请改用 `addAll()` 函数而不是 `add()` 函数。
* 继旧版 Kotlin/JS 后端中使用的死代码消除 (DCE) 工具弃用之后，DCE 相关的剩余 DSL 现已从 Kotlin Gradle 插件中移除：
  * `org.jetbrains.kotlin.gradle.dsl.KotlinJsDce` 接口
  * `org.jetbrains.kotlin.gradle.targets.js.dsl.KotlinJsBrowserDsl.dceTask(body: Action<KotlinJsDce>)` 函数
  * `org.jetbrains.kotlin.gradle.dsl.KotlinJsDceCompilerToolOptions` 接口
  * `org.jetbrains.kotlin.gradle.dsl.KotlinJsDceOptions` 接口

  当前的 [JS IR 编译器](js-ir-compiler.md)开箱即用地支持 DCE，并且 [`@JsExport`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.js/-js-export/) 注解允许指定在 DCE 期间要保留的 Kotlin 函数和类。

* 弃用的 `kotlin-android-extensions` 插件在 [Kotlin 2.2.0 中被移除](compatibility-guide-22.md#deprecate-kotlin-android-extensions-plugin)。请使用 `kotlin-parcelize` 插件生成 `Parcelable` 实现，并使用 Android Jetpack 的[视图绑定](https://developer.android.com/topic/libraries/view-binding)代替合成视图 (synthetic views)。
* 实验性的 `kotlinArtifacts` API 在 [Kotlin 2.2.0 中已弃用](compatibility-guide-22.md#deprecate-kotlinartifacts-api)。请使用 Kotlin Gradle 插件中当前的 DSL 来[构建最终的原生二进制文件](https://kotlinlang.org/docs/multiplatform/multiplatform-build-native-binaries.html)。如果这不足以支持迁移，请在[此 YouTrack 问题](https://youtrack.jetbrains.com/issue/KT-74953)中留言。
* 在 Kotlin 1.9.0 中弃用的 `KotlinCompilation.source` 现已[从 Kotlin Gradle 插件中移除](compatibility-guide-22.md#deprecate-kotlincompilation-source-api)。
* 实验性公共化 (commonization) 模式的参数在 [Kotlin 2.2.0 中已弃用](compatibility-guide-22.md#deprecate-commonization-parameters)。请清除公共化缓存以删除无效的编译产物。
* 弃用的 `konanVersion` 属性现已[从 `CInteropProcess` 任务中移除](compatibility-guide-22.md#deprecate-konanversion-in-cinteropprocess)。请改用 `CInteropProcess.kotlinNativeVersion`。
* 使用弃用的 `destinationDir` 属性现在[会导致错误](compatibility-guide-22.md#deprecate-destinationdir-in-cinteropprocess)。请改用 `CInteropProcess.destinationDirectory.set()`。

## 文档更新

此版本带来了显著的文档变更，包括将 Kotlin Multiplatform 文档迁移到 [KMP 门户](https://kotlinlang.org/docs/multiplatform/get-started.html)。 

此外，我们创建了新的页面和教程，并翻新了现有内容。 

### 新增及翻新教程

* [Kotlin 中级之旅](kotlin-tour-welcome.md) – 提升你对 Kotlin 的理解。了解何时使用扩展函数、接口、类等。
* [构建使用 Spring AI 的 Kotlin 应用](spring-ai-guide.md) – 了解如何使用 OpenAI 和向量数据库创建一个能够回答问题的 Kotlin 应用。
* [](jvm-create-project-with-spring-boot.md) – 了解如何使用 IntelliJ IDEA 的 **New Project** 向导创建一个带有 Gradle 的 Spring Boot 项目。
* [映射 Kotlin 和 C 教程系列](mapping-primitive-data-types-from-c.md) – 了解如何在 Kotlin 和 C 之间映射不同的类型和构造。
* [使用 C 互操作和 libcurl 创建应用](native-app-with-c-and-libcurl.md) – 创建一个简单的 HTTP 客户端，可以使用 libcurl C 库在原生环境下运行。
* [创建你的 Kotlin Multiplatform 库](https://kotlinlang.org/docs/multiplatform/create-kotlin-multiplatform-library.html) – 了解如何使用 IntelliJ IDEA 创建和发布多平台库。
* [使用 Ktor 和 Kotlin Multiplatform 构建全栈应用程序](https://ktor.io/docs/full-stack-development-with-kotlin-multiplatform.html) – 此教程现在使用 IntelliJ IDEA 代替 Fleet，并结合 Material 3 以及最新版本的 Ktor 和 Kotlin。
* [在 Compose Multiplatform 应用中管理本地资源环境](https://kotlinlang.org/docs/multiplatform/compose-resource-environment.html) – 了解如何管理应用程序的资源环境，如应用内主题和语言。

### 新增及翻新页面

* [Kotlin 用于 AI 概述](kotlin-ai-apps-development-overview.md) – 探索 Kotlin 构建 AI 驱动应用程序的能力。
* [Dokka 迁移指南](https://kotlinlang.org/docs/dokka-migration.html) – 了解如何迁移到 Dokka Gradle 插件的 v2 版本。
* [](metadata-jvm.md) – 探索关于读取、修改和生成针对 JVM 编译的 Kotlin 类元数据的指导。
* [CocoaPods 集成](https://kotlinlang.org/docs/multiplatform/multiplatform-cocoapods-overview.html) – 了解如何通过教程和示例项目设置环境、添加 Pod 依赖项，或将 Kotlin 项目作为 CocoaPod 依赖项使用。
* 支持 iOS 稳定版本发布的 Compose Multiplatform 新页面：
    * 尤其是[导航](https://kotlinlang.org/docs/multiplatform/compose-navigation.html)和[深层链接 (Deep linking)](https://kotlinlang.org/docs/multiplatform/compose-navigation-deep-links.html)。
    * [在 Compose 中实现布局](https://kotlinlang.org/docs/multiplatform/compose-layout.html)。
    * [本地化字符串](https://kotlinlang.org/docs/multiplatform/compose-localize-strings.html)以及其他 i18n 页面，如对 RTL 语言的支持。
* [Compose 热重载 (Hot Reload)](https://kotlinlang.org/docs/multiplatform/compose-hot-reload.html) – 了解如何在桌面目标中使用 Compose 热重载，以及如何将其添加到现有项目中。
* [Exposed 迁移](https://www.jetbrains.com/help/exposed/migrations.html) – 了解 Exposed 提供的用于管理数据库架构更改的工具。

## 如何更新至 Kotlin 2.2.0

Kotlin 插件作为捆绑插件随 IntelliJ IDEA 和 Android Studio 一起分发。

要更新到新的 Kotlin 版本，请在构建脚本中将[Kotlin 版本更改](releases.md#update-to-a-new-kotlin-version)为 2.2.0。