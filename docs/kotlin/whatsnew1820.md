[//]: # (title: Kotlin 1.8.20 的新特性)

_[发布日期：2023 年 4 月 25 日](releases.md#release-details)_

Kotlin 1.8.20 版本已发布，以下是其一些重要亮点：

*   [Kotlin K2 编译器新更新](#new-kotlin-k2-compiler-updates)
*   [新的实验性 Kotlin/Wasm 目标](#new-kotlin-wasm-target)
*   [Gradle 中默认启用新的 JVM 增量编译](#new-jvm-incremental-compilation-by-default-in-gradle)
*   [Kotlin/Native 目标更新](#update-for-kotlin-native-targets)
*   [Kotlin Multiplatform 中 Gradle 复合构建支持预览](#preview-of-gradle-composite-builds-support-in-kotlin-multiplatform)
*   [Xcode 中 Gradle 错误输出改进](#improved-output-for-gradle-errors-in-xcode)
*   [标准库中 AutoCloseable 接口的实验性支持](#support-for-the-autocloseable-interface)
*   [标准库中 Base64 编码的实验性支持](#support-for-base64-encoding)

你还可以在此视频中找到更改的简短概述：

<video src="https://www.youtube.com/v/R1JpkpPzyBU" title="Kotlin 1.8.20 的新特性"/>

## IDE 支持

支持 1.8.20 的 Kotlin 插件适用于：

| IDE           | 支持的版本              |
|---------------|-------------------------|
| IntelliJ IDEA | 2022.2.x, 2022.3.x, 2023.1.x |
| Android Studio | Flamingo (222)          |

> 为了正确下载 Kotlin 工件和依赖项，请[配置 Gradle 设置](#configure-gradle-settings)以使用 Maven Central 仓库。
>
{style="warning"}

## Kotlin K2 编译器新更新

Kotlin 团队持续稳定 K2 编译器。正如在 [Kotlin 1.7.0 公告](whatsnew17.md#new-kotlin-k2-compiler-for-the-jvm-in-alpha)中所述，它仍处于 **Alpha** 阶段。此版本引入了更多改进，以迈向 [K2 Beta](https://youtrack.jetbrains.com/issue/KT-52604)。

从 1.8.20 版本开始，Kotlin K2 编译器：

*   拥有序列化插件的预览版本。
*   为 [JS IR 编译器](js-ir-compiler.md)提供 Alpha 支持。
*   引入了即将发布的[新语言版本 Kotlin 2.0](https://blog.jetbrains.com/kotlin/2023/02/k2-kotlin-2-0/)。

在以下视频中了解有关新编译器及其优点的更多信息：

*   [每个人都必须了解的全新 Kotlin K2 编译器](https://www.youtube.com/watch?v=iTdJJq_LyoY)
*   [全新 Kotlin K2 编译器：专家评测](https://www.youtube.com/watch?v=db19VFLZqJM)

### 如何启用 Kotlin K2 编译器

要启用并测试 Kotlin K2 编译器，请使用以下编译器选项设置新语言版本：

```bash
-language-version 2.0
```

你可以在你的 `build.gradle(.kts)` 文件中指定它：

```kotlin
kotlin {
   sourceSets.all {
       languageSettings {
           languageVersion = "2.0"
       }
   }
}
```

之前的 `-Xuse-k2` 编译器选项已被弃用。

> 新 K2 编译器的 Alpha 版本仅适用于 JVM 和 JS IR 项目。它尚不支持 Kotlin/Native 或任何多平台项目。
>
{style="warning"}

### 提供有关新 K2 编译器的反馈

我们非常感谢您的任何反馈！

*   通过 Kotlin Slack 直接向 K2 开发者提供反馈 – [获取邀请](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up?_gl=1*ju6cbn*_ga*MTA3MTk5NDkzMC4xNjQ2MDY3MDU4*_ga_9J976DJZ68*MTY1ODMzNzA3OS4xMDAuMS4xNjU4MzQwODEwLjYw)并加入 [#k2-early-adopters](https://kotlinlang.slack.com/archives/C03PK0PE257) 频道。
*   在[我们的问题跟踪器](https://kotl.in/issue)上报告您使用新 K2 编译器时遇到的任何问题。
*   [启用 **发送使用情况统计信息** 选项](https://www.jetbrains.com/help/idea/settings-usage-statistics.html)以允许 JetBrains 收集 K2 使用情况的匿名数据。

## 语言

随着 Kotlin 的持续发展，我们在 1.8.20 中引入了新语言功能的预览版本：

*   [Enum 类 values 函数的现代高性能替代方案](#a-modern-and-performant-replacement-of-the-enum-class-values-function)
*   [与数据类对称的数据对象](#preview-of-data-objects-for-symmetry-with-data-classes)
*   [解除对内联类中带体二级构造函数的限制](#preview-of-lifting-restriction-on-secondary-constructors-with-bodies-in-inline-classes)

### Enum 类 values 函数的现代高性能替代方案

> 此功能为[实验性功能](components-stability.md#stability-levels-explained)。它可能随时被移除或更改。需要选择启用（详见下文）。仅用于评估目的。我们非常感谢您在 [YouTrack](https://kotl.in/issue) 上提供反馈。
>
{style="warning"}

Enum 类有一个合成的 `values()` 函数，它返回一个已定义枚举常量的数组。然而，在 Kotlin 和 Java 中使用数组可能导致[隐藏的性能问题](https://github.com/Kotlin/KEEP/blob/master/proposals/enum-entries.md#examples-of-performance-issues)。此外，大多数 API 使用集合，这需要最终进行转换。为了解决这些问题，我们为 Enum 类引入了 `entries` 属性，它应该替代 `values()` 函数使用。调用时，`entries` 属性返回一个预分配的不可变（immutable）枚举常量列表。

> `values()` 函数仍受支持，但我们建议您改用 `entries` 属性。
>
{style="tip"}

```kotlin
enum class Color(val colorName: String, val rgb: String) {
    RED("Red", "#FF0000"),
    ORANGE("Orange", "#FF7F00"),
    YELLOW("Yellow", "#FFFF00")
}

@OptIn(ExperimentalStdlibApi::class)
fun findByRgb(rgb: String): Color? = Color.entries.find { it.rgb == rgb }
```
{validate="false"}

#### 如何启用 entries 属性

要试用此功能，请使用 `@OptIn(ExperimentalStdlibApi)` 进行选择启用，并启用 `-language-version 1.9` 编译器选项。在 Gradle 项目中，你可以通过将以下内容添加到 `build.gradle(.kts)` 文件中来实现：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
tasks
    .withType<org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask<*>>()
    .configureEach {
        compilerOptions
            .languageVersion
            .set(
                org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_1_9
            )
    }
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
tasks
    .withType(org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask.class)
    .configureEach {
        compilerOptions.languageVersion =
            org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_1_9
    }
```

</tab>
</tabs>

> 从 IntelliJ IDEA 2023.1 开始，如果你已选择启用此功能，相应的 IDE 检查将通知你将 `values()` 转换为 `entries` 并提供快速修复。
>
{style="tip"}

有关此提案的更多信息，请参阅 [KEEP 笔记](https://github.com/Kotlin/KEEP/blob/master/proposals/enum-entries.md)。

### 与数据类对称的数据对象预览

数据对象（Data objects）允许你声明具有单例语义和简洁 `toString()` 表示的对象。在此代码片段中，你可以看到将 `data` 关键字添加到对象声明如何提高其 `toString()` 输出的可读性：

```kotlin
package org.example
object MyObject
data object MyDataObject

fun main() {
    println(MyObject) // org.example.MyObject@1f32e575
    println(MyDataObject) // MyDataObject
}
```

特别是对于 `sealed` 层次结构（如 `sealed class` 或 `sealed interface` 层次结构），`data objects` 是一个极好的选择，因为它们可以方便地与 `data class` 声明一起使用。在此代码片段中，将 `EndOfFile` 声明为 `data object` 而不是普通的 `object` 意味着它将获得一个漂亮的 `toString`，而无需手动覆盖它。这与伴随的数据类定义保持了对称性。

```kotlin
sealed interface ReadResult
data class Number(val number: Int) : ReadResult
data class Text(val text: String) : ReadResult
data object EndOfFile : ReadResult

fun main() {
    println(Number(7)) // Number(number=7)
    println(EndOfFile) // EndOfFile
}
```

#### 数据对象的语义

自 [Kotlin 1.7.20](whatsnew1720.md#improved-string-representations-for-singletons-and-sealed-class-hierarchies-with-data-objects) 的第一个预览版本以来，数据对象的语义得到了完善。编译器现在会自动为它们生成一些便捷函数：

##### toString

数据对象的 `toString()` 函数返回对象的简单名称：

```kotlin
data object MyDataObject {
    val x: Int = 3
}

fun main() {
    println(MyDataObject) // MyDataObject
}
```

##### equals 和 hashCode

`data object` 的 `equals()` 函数确保所有具有你的 `data object` 类型的对象都被视为相等。在大多数情况下，你将只在运行时拥有数据对象的一个实例（毕竟，`data object` 声明了一个单例）。然而，在运行时生成相同类型的另一个对象的边缘情况（例如，通过 `java.lang.reflect` 进行平台反射，或者使用底层使用此 API 的 JVM 序列化库），这确保了这些对象被视为相等。

确保只通过结构（使用 `==` 运算符）比较 `data objects`，而不要通过引用（`===` 运算符）比较。这有助于避免在运行时存在多个数据对象实例时出现的陷阱。以下代码片段说明了这种特定的边缘情况：

```kotlin
import java.lang.reflect.Constructor

data object MySingleton

fun main() {
    val evilTwin = createInstanceViaReflection()

    println(MySingleton) // MySingleton
    println(evilTwin) // MySingleton

    // Even when a library forcefully creates a second instance of MySingleton, its `equals` method returns true:
    println(MySingleton == evilTwin) // true

    // Do not compare data objects via ===.
    println(MySingleton === evilTwin) // false
}

fun createInstanceViaReflection(): MySingleton {
    // Kotlin reflection does not permit the instantiation of data objects.
    // This creates a new MySingleton instance "by force" (i.e., Java platform reflection)
    // Don't do this yourself!
    return (MySingleton.javaClass.declaredConstructors[0].apply { isAccessible = true } as Constructor<MySingleton>).newInstance()
}
```

生成的 `hashCode()` 函数的行为与 `equals()` 函数的行为一致，因此 `data object` 的所有运行时实例都具有相同的哈希码。

##### 数据对象没有 copy 和 componentN 函数

虽然 `data object` 和 `data class` 声明经常一起使用并有一些相似之处，但有些函数不会为 `data object` 生成：

由于 `data object` 声明旨在用作单例对象，因此不会生成 `copy()` 函数。单例模式将类的实例化限制为单个实例，允许创建实例的副本将违反该限制。

此外，与 `data class` 不同，`data object` 不包含任何数据属性。由于尝试解构此类对象没有意义，因此不会生成 `componentN()` 函数。

我们非常感谢您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-4107) 上提供有关此功能的反馈。

#### 如何启用数据对象预览

要试用此功能，请启用 `-language-version 1.9` 编译器选项。在 Gradle 项目中，你可以通过将以下内容添加到 `build.gradle(.kts)` 文件中来实现：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
tasks
    .withType<org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask<*>>()
    .configureEach {
        compilerOptions
            .languageVersion
            .set(
                org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_1_9
            )
    }
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
tasks
    .withType(org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask.class)
    .configureEach {
        compilerOptions.languageVersion =
            org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_1_9
    }
```

</tab>
</tabs>

### 解除对内联类中带体二级构造函数的限制预览

> 此功能为[实验性功能](components-stability.md#stability-levels-explained)。它可能随时被移除或更改。需要选择启用（详见下文）。仅用于评估目的。我们非常感谢您在 [YouTrack](https://kotl.in/issue) 上提供反馈。
>
{style="warning"}

Kotlin 1.8.20 解除了对在[内联类](inline-classes.md)中使用带体二级构造函数的限制。

内联类过去只允许公共主构造函数不带 `init` 块或二级构造函数，以保持清晰的初始化语义。因此，无法封装底层值或创建表示某些受限值的内联类。

当 Kotlin 1.4.30 解除对 `init` 块的限制时，这些问题得到了修复。现在我们更进一步，在预览模式下允许带体的二级构造函数：

```kotlin
@JvmInline
value class Person(private val fullName: String) {
    // Allowed since Kotlin 1.4.30:
    init { 
        check(fullName.isNotBlank()) {
            "Full name shouldn't be empty"
        }
    }

    // Preview available since Kotlin 1.8.20:
    constructor(name: String, lastName: String) : this("$name $lastName") {
        check(lastName.isNotBlank()) {
            "Last name shouldn't be empty"
        }
    }
}
```

#### 如何启用带体的二级构造函数

要试用此功能，请启用 `-language-version 1.9` 编译器选项。在 Gradle 项目中，你可以通过将以下内容添加到 `build.gradle(.kts)` 中来实现：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
tasks
    .withType<org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask<*>>()
    .configureEach {
        compilerOptions
            .languageVersion
            .set(
                org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_1_9
            )
    }
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
tasks
    .withType(org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask.class)
    .configureEach {
        compilerOptions.languageVersion =
            org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_1_9
    }
```

</tab>
</tabs>

我们鼓励你试用此功能，并在 [YouTrack](https://kotl.in/issue) 中提交所有报告，以帮助我们使其在 Kotlin 1.9.0 中成为默认设置。

在此 [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/inline-classes.md) 中了解有关 Kotlin 内联类开发的更多信息。

## 新的 Kotlin/Wasm 目标

Kotlin/Wasm (Kotlin WebAssembly) 在此版本中进入[实验阶段](components-stability.md#stability-levels-explained)。Kotlin 团队认为 [WebAssembly](https://webassembly.org/) 是一项很有前途的技术，并希望找到更好的方式让你使用它并获得 Kotlin 的所有优势。

WebAssembly 二进制格式与平台无关，因为它使用自己的虚拟机运行。几乎所有现代浏览器都已支持 WebAssembly 1.0。要设置运行 WebAssembly 的环境，你只需启用 Kotlin/Wasm 目标支持的实验性垃圾回收模式。你可以在此处找到详细说明：[如何启用 Kotlin/Wasm](#how-to-enable-kotlin-wasm)。

我们想强调新 Kotlin/Wasm 目标的以下优势：

*   与 `wasm32` Kotlin/Native 目标相比，编译速度更快，因为 Kotlin/Wasm 无需使用 LLVM。
*   与 `wasm32` 目标相比，与 JS 互操作和与浏览器集成更容易，这要归功于 [Wasm 垃圾回收](https://github.com/WebAssembly/gc)。
*   与 Kotlin/JS 和 JavaScript 相比，应用程序启动可能更快，因为 Wasm 具有紧凑且易于解析的字节码。
*   与 Kotlin/JS 和 JavaScript 相比，应用程序运行时性能更高，因为 Wasm 是一种静态类型语言。

从 1.8.20 版本开始，你可以在你的实验性项目中使用 Kotlin/Wasm。我们为 Kotlin/Wasm 开箱即用地提供了 Kotlin 标准库 (`stdlib`) 和测试库 (`kotlin.test`)。IDE 支持将在未来的版本中添加。

[在此 YouTube 视频中了解有关 Kotlin/Wasm 的更多信息](https://www.youtube.com/watch?v=-pqz9sKXatw)。

### 如何启用 Kotlin/Wasm

要启用并测试 Kotlin/Wasm，请更新你的 `build.gradle.kts` 文件：

```kotlin
plugins {
    kotlin("multiplatform") version "1.8.20"
}

kotlin {
    wasm {
        binaries.executable()
        browser {
        }
    }
    sourceSets {
        val commonMain by getting
        val commonTest by getting {
            dependencies {
                implementation(kotlin("test"))
            }
        }
        val wasmMain by getting
        val wasmTest by getting
    }
}
```

> 查看[包含 Kotlin/Wasm 示例的 GitHub 仓库](https://github.com/Kotlin/kotlin-wasm-examples)。
>
{style="tip"}

要运行 Kotlin/Wasm 项目，你需要更新目标环境的设置：

<tabs>
<tab title="Chrome">

*   对于版本 109：

    使用 `--js-flags=--experimental-wasm-gc` 命令行参数运行应用程序。

*   对于版本 110 或更高版本：

    1.  在浏览器中访问 `chrome://flags/#enable-webassembly-garbage-collection`。
    2.  启用 **WebAssembly Garbage Collection**。
    3.  重启浏览器。

</tab>
<tab title="Firefox">

对于版本 109 或更高版本：

1.  在浏览器中访问 `about:config`。
2.  启用 `javascript.options.wasm_function_references` 和 `javascript.options.wasm_gc` 选项。
3.  重启浏览器。

</tab>
<tab title="Edge">

对于版本 109 或更高版本：

使用 `--js-flags=--experimental-wasm-gc` 命令行参数运行应用程序。

</tab>
</tabs>

### 提供有关 Kotlin/Wasm 的反馈

我们非常感谢您的任何反馈！

*   通过 Kotlin Slack 直接向开发者提供反馈 – [获取邀请](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up?_gl=1*ju6cbn*_ga*MTA3MTk5NDkzMC4xNjQ2MDY3MDU4*_ga_9J976DJZ68*MTY1ODMzNzA3OS4xMDAuMS4xNjU4MzQwODEwLjYw)并加入 [#webassembly](https://kotlinlang.slack.com/archives/CDFP59223) 频道。
*   在[此 YouTrack 问题](https://youtrack.jetbrains.com/issue/KT-56492)上报告您使用 Kotlin/Wasm 时遇到的任何问题。

## Kotlin/JVM

Kotlin 1.8.20 引入了 [Java 合成属性引用的预览](#preview-of-java-synthetic-property-references)以及[默认在 kapt stub 生成任务中支持 JVM IR 后端](#support-for-the-jvm-ir-backend-in-kapt-stub-generating-task-by-default)。

### Java 合成属性引用预览

> 此功能为[实验性功能](components-stability.md#stability-levels-explained)。它可能随时被移除或更改。仅用于评估目的。我们非常感谢您在 [YouTrack](https://kotl.in/issue) 上提供反馈。
>
{style="warning"}

Kotlin 1.8.20 引入了创建对 Java 合成属性引用的能力，例如，对于这样的 Java 代码：

```java
public class Person {
    private String name;
    private int age;

    public Person(String name, int age) {
        this.name = name;
        this.age = age;
    }

    public String getName() {
        return name;
    }

    public int getAge() {
        return age;
    }
}
```

Kotlin 一直允许你编写 `person.age`，其中 `age` 是一个合成属性。现在，你还可以创建对 `Person::age` 和 `person::age` 的引用。对于 `name` 也是如此。

```kotlin
val persons = listOf(Person("Jack", 11), Person("Sofie", 12), Person("Peter", 11))
    persons
        // Call a reference to Java synthetic property:
        .sortedBy(Person::age)
        // Call Java getter via the Kotlin property syntax:
        .forEach { person -> println(person.name) }
```
{validate="false"}

#### 如何启用 Java 合成属性引用

要试用此功能，请启用 `-language-version 1.9` 编译器选项。在 Gradle 项目中，你可以通过将以下内容添加到 `build.gradle(.kts)` 中来实现：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
tasks
    .withType<org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask<*>>()
    .configureEach {
        compilerOptions
            .languageVersion
            .set(
                org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_1_9
            )
    }
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
tasks
    .withType(org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask.class)
    .configureEach {
        compilerOptions.languageVersion =
            org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_1_9
    }
```

</tab>
</tabs>

### 默认在 kapt stub 生成任务中支持 JVM IR 后端

在 Kotlin 1.7.20 中，我们引入了[在 kapt stub 生成任务中支持 JVM IR 后端](whatsnew1720.md#support-for-the-jvm-ir-backend-in-kapt-stub-generating-task)。从本版本开始，此支持默认启用。你不再需要在 `gradle.properties` 中指定 `kapt.use.jvm.ir=true` 来启用它。我们非常感谢您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-49682) 上提供有关此功能的反馈。

## Kotlin/Native

Kotlin 1.8.20 包含了对支持的 Kotlin/Native 目标、与 Objective-C 的互操作性以及 CocoaPods Gradle 插件改进等方面的更改：

*   [Kotlin/Native 目标更新](#update-for-kotlin-native-targets)
*   [弃用旧版内存管理器](#deprecation-of-the-legacy-memory-manager)
*   [支持带有 @import 指令的 Objective-C 头文件](#support-for-objective-c-headers-with-import-directives)
*   [Cocoapods Gradle 插件中支持仅链接模式](#support-for-the-link-only-mode-in-cocoapods-gradle-plugin)
*   [在 UIKit 中将 Objective-C 扩展作为类成员导入](#import-objective-c-extensions-as-class-members-in-uikit)
*   [编译器中编译器缓存管理的重新实现](#reimplementation-of-compiler-cache-management-in-the-compiler)
*   [Cocoapods Gradle 插件中弃用 `useLibraries()` ](#deprecation-of-uselibraries-in-cocoapods-gradle-plugin)

### Kotlin/Native 目标更新

Kotlin 团队决定重新审视 Kotlin/Native 支持的目标列表，将其分为不同的层级，并从 Kotlin 1.8.20 开始弃用其中一些目标。有关支持和已弃用目标的完整列表，请参阅 [Kotlin/Native 目标支持](native-target-support.md)部分。

以下目标已随 Kotlin 1.8.20 弃用，并将在 1.9.20 中移除：

*   `iosArm32`
*   `watchosX86`
*   `wasm32`
*   `mingwX86`
*   `linuxArm32Hfp`
*   `linuxMips32`
*   `linuxMipsel32`

至于其余目标，现在根据目标在 Kotlin/Native 编译器中受支持和测试的程度，分为三个支持层级。目标可以被移动到不同的层级。例如，我们将尽力在未来为 `iosArm64` 提供全面支持，因为它对 [Kotlin Multiplatform](https://www.jetbrains.com/help/kotlin-multiplatform-dev/get-started.html) 至关重要。

如果你是库作者，这些目标层级可以帮助你决定在 CI 工具上测试哪些目标以及跳过哪些目标。Kotlin 团队在开发官方 Kotlin 库时，如 [kotlinx.coroutines](coroutines-guide.md)，也将采用相同的方法。

查看我们的[博客文章](https://blog.jetbrains.com/kotlin/2023/02/update-regarding-kotlin-native-targets/)，了解有关这些更改原因的更多信息。

### 弃用旧版内存管理器

从 1.8.20 开始，旧版内存管理器已被弃用，并将在 1.9.20 中移除。[新内存管理器](native-memory-manager.md)已在 1.7.20 中默认启用，并持续获得稳定性更新和性能改进。

如果你仍在使用旧版内存管理器，请从你的 `gradle.properties` 中移除 `kotlin.native.binary.memoryModel=strict` 选项，并遵循我们的[迁移指南](native-migration-guide.md)进行必要的更改。

新内存管理器不支持 `wasm32` 目标。此目标也已[随本版本弃用](#update-for-kotlin-native-targets)，并将在 1.9.20 中移除。

### 支持带有 @import 指令的 Objective-C 头文件

> 此功能为[实验性功能](components-stability.md#stability-levels-explained)。它可能随时被移除或更改。需要选择启用（详见下文）。仅用于评估目的。我们非常感谢您在 [YouTrack](https://kotl.in/issue) 上提供反馈。
>
{style="warning"}

Kotlin/Native 现在可以导入带有 `@import` 指令的 Objective-C 头文件。此功能对于消费具有自动生成的 Objective-C 头文件或用 Swift 编写的 CocoaPods 依赖项类的 Swift 库非常有用。

以前，cinterop 工具无法分析通过 `@import` 指令依赖于 Objective-C 模块的头文件。原因是它缺少对 `-fmodules` 选项的支持。

从 Kotlin 1.8.20 开始，你可以使用带有 `@import` 的 Objective-C 头文件。为此，请在定义文件中将 `-fmodules` 选项作为 `compilerOpts` 传递给编译器。如果你使用 [CocoaPods 集成](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-cocoapods-overview.html)，请像这样在 `pod()` 函数的配置块中指定 cinterop 选项：

```kotlin
kotlin {
    ios()

    cocoapods {
        summary = "CocoaPods test library"
        homepage = "https://github.com/JetBrains/kotlin"

        ios.deploymentTarget = "13.5"

        pod("PodName") {
            extraOpts = listOf("-compiler-option", "-fmodules")
        }
    }
}
```

这是一个[备受期待的功能](https://youtrack.jetbrains.com/issue/KT-39120)，我们欢迎您在 [YouTrack](https://kotl.in/issue) 上提供反馈，以帮助我们在未来的版本中将其设为默认。

### Cocoapods Gradle 插件中支持仅链接模式

借助 Kotlin 1.8.20，你可以使用带有动态框架的 Pod 依赖项仅用于链接，而无需生成 cinterop 绑定。当 cinterop 绑定已生成时，这可能会派上用场。

考虑一个包含 2 个模块的项目，一个库和一个应用程序。该库依赖于 Pod 但不生成框架，只生成 `.klib`。应用程序依赖于该库并生成动态框架。在这种情况下，你需要将此框架与库所依赖的 Pods 链接起来，但你不需要 cinterop 绑定，因为它们已经为库生成了。

要启用此功能，在添加 Pod 依赖项时使用 `linkOnly` 选项或构建器属性：

```kotlin
cocoapods {
    summary = "CocoaPods test library"
    homepage = "https://github.com/JetBrains/kotlin"

    pod("Alamofire", linkOnly = true) {
        version = "5.7.0"
    }
}
```

> 如果你将此选项与静态框架一起使用，它将完全移除 Pod 依赖项，因为 Pods 不用于静态框架链接。
>
{style="note"}

### 在 UIKit 中将 Objective-C 扩展作为类成员导入

自 Xcode 14.1 起，Objective-C 类中的某些方法已移动到类别成员中。这导致生成了不同的 Kotlin API，并且这些方法被导入为 Kotlin 扩展而不是方法。

在使用 UIKit 覆盖方法时，你可能因此遇到了问题。例如，在 Kotlin 中子类化 UIVIew 时，无法覆盖 `drawRect()` 或 `layoutSubviews()` 方法。

从 1.8.20 开始，与 NSView 和 UIView 类在相同头文件中声明的类别成员被导入为这些类的成员。这意味着从 NSView 和 UIView 子类化的方法可以像任何其他方法一样轻松覆盖。

如果一切顺利，我们计划默认对所有 Objective-C 类启用此行为。

### 编译器中编译器缓存管理的重新实现

为了加速编译器缓存的演进，我们已将编译器缓存管理从 Kotlin Gradle 插件移至 Kotlin/Native 编译器。这为多项重要改进扫清了障碍，包括编译时间缩短和编译器缓存灵活性增强。

如果你遇到问题需要恢复旧行为，请使用 `kotlin.native.cacheOrchestration=gradle` Gradle 属性。

我们非常感谢您在 [YouTrack](https://kotl.in/issue) 上提供反馈。

### Cocoapods Gradle 插件中弃用 `useLibraries()` 

Kotlin 1.8.20 开始弃用用于静态库的 [CocoaPods 集成](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-cocoapods-overview.html)中的 `useLibraries()` 函数。

我们引入了 `useLibraries()` 函数，以允许依赖包含静态库的 Pods。随着时间的推移，这种情况变得非常罕见。大多数 Pods 通过源代码分发，而 Objective-C 框架或 XCFrameworks 是二进制分发的常见选择。

由于此函数不受欢迎且它会产生问题，从而使 Kotlin CocoaPods Gradle 插件的开发复杂化，我们决定弃用它。

有关框架和 XCFrameworks 的更多信息，请参阅[构建最终原生二进制文件](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-build-native-binaries.html)。

## Kotlin Multiplatform

Kotlin 1.8.20 致力于通过以下对 Kotlin Multiplatform 的更新来改善开发者体验：

*   [设置源集层次结构的新方法](#new-approach-to-source-set-hierarchy)
*   [Kotlin Multiplatform 中 Gradle 复合构建支持预览](#preview-of-gradle-composite-builds-support-in-kotlin-multiplatform)
*   [Xcode 中 Gradle 错误输出改进](#improved-output-for-gradle-errors-in-xcode)

### 源集层次结构的新方法

> 源集层次结构的新方法是[实验性功能](components-stability.md#stability-levels-explained)。它可能在未来的 Kotlin 版本中在不提前通知的情况下更改。需要选择启用（详见下文）。我们非常感谢您在 [YouTrack](https://kotl.in/issue) 上提供反馈。
>
{style="warning"}

Kotlin 1.8.20 提供了一种在多平台项目中设置源集层次结构的新方法——默认目标层次结构。新方法旨在取代像 `ios` 这样的目标快捷方式，因为它们存在[设计缺陷](#why-replace-shortcuts)。

默认目标层次结构背后的想法很简单：你明确声明项目编译到的所有目标，Kotlin Gradle 插件会根据指定的目标自动创建共享源集。

#### 设置你的项目

考虑这个简单的多平台移动应用程序示例：

```kotlin
@OptIn(ExperimentalKotlinGradlePluginApi::class)
kotlin {
    // Enable the default target hierarchy:
    targetHierarchy.default()

    android()
    iosArm64()
    iosSimulatorArm64()
}
```

你可以将默认目标层次结构视为所有可能目标及其共享源集的模板。当你在代码中声明最终目标 `android`、`iosArm64` 和 `iosSimulatorArm64` 时，Kotlin Gradle 插件会从模板中找到合适的共享源集并为你创建它们。最终的层次结构如下所示：

![An example of using the default target hierarchy](default-hierarchy-example.svg){thumbnail="true" width="350" thumbnail-same-file="true"}

绿色的源集实际创建并存在于项目中，而默认模板中灰色的源集则被忽略。如你所见，例如，Kotlin Gradle 插件没有创建 `watchos` 源集，因为项目中没有 watchOS 目标。

如果你添加一个 watchOS 目标，例如 `watchosArm64`，则会创建 `watchos` 源集，并且来自 `apple`、`native` 和 `common` 源集的代码也会编译到 `watchosArm64`。

你可以在[文档](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-hierarchy.html#default-hierarchy-template)中找到默认目标层次结构的完整方案。

> 在此示例中，`apple` 和 `native` 源集仅编译到 `iosArm64` 和 `iosSimulatorArm64` 目标。因此，尽管有其名称，它们仍然可以访问完整的 iOS API。这对于像 `native` 这样的源集可能有些反直觉，因为你可能期望此源集中只有所有原生目标上可用的 API 才能访问。此行为在未来可能会更改。
>
{style="note"}

#### 为何替换快捷方式 {initial-collapse-state="collapsed" collapsible="true"}

创建源集层次结构可能冗长、容易出错，并且对初学者不友好。我们之前的解决方案是引入像 `ios` 这样的快捷方式，为你创建部分层次结构。然而，事实证明使用快捷方式存在一个大的设计缺陷：它们难以更改。

以 `ios` 快捷方式为例。它只创建 `iosArm64` 和 `iosX64` 目标，这可能会令人困惑，并且在需要 `iosSimulatorArm64` 目标的 M1 主机上工作时可能导致问题。然而，添加 `iosSimulatorArm64` 目标对于用户项目来说可能是一个非常有破坏性的改变：

*   `iosMain` 源集中使用的所有依赖项都必须支持 `iosSimulatorArm64` 目标；否则，依赖解析将失败。
*   在添加新目标时，`iosMain` 中使用的某些原生 API 可能会消失（尽管在 `iosSimulatorArm64` 的情况下不太可能）。
*   在某些情况下，例如在你的基于 Intel 的 MacBook 上编写一个小型宠物项目时，你甚至可能不需要此更改。

很明显，快捷方式并未解决配置层次结构的问题，这就是我们停止添加新快捷方式的原因。

默认目标层次结构乍一看可能与快捷方式相似，但它们有一个关键区别：**用户必须明确指定目标集**。此集合定义了项目如何编译和发布以及如何参与依赖解析。由于此集合是固定的，因此 Kotlin Gradle 插件的默认配置更改应该会在生态系统中造成更少的困扰，并且提供工具辅助迁移将更容易。

#### 如何启用默认层次结构

此新功能是[实验性功能](components-stability.md#stability-levels-explained)。对于 Kotlin Gradle 构建脚本，你需要使用 `@OptIn(ExperimentalKotlinGradlePluginApi::class)` 进行选择启用。

有关更多信息，请参阅[分层项目结构](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-hierarchy.html#default-hierarchy-template)。

#### 留下反馈

这是多平台项目的一项重大更改。我们非常感谢您的[反馈](https://kotl.in/issue)，以帮助我们做得更好。

### Kotlin Multiplatform 中 Gradle 复合构建支持预览

> 此功能自 Kotlin Gradle 插件 1.8.20 起已在 Gradle 构建中受支持。对于 IDE 支持，请使用 IntelliJ IDEA 2023.1 Beta 2 (231.8109.2) 或更高版本，以及带有任何 Kotlin IDE 插件的 Kotlin Gradle 插件 1.8.20。
>
{style="note"}

从 1.8.20 开始，Kotlin Multiplatform 支持 [Gradle 复合构建](https://docs.gradle.org/current/userguide/composite_builds.html)。复合构建允许你将独立项目或同一项目部分的构建包含到单个构建中。

由于一些技术挑战，Kotlin Multiplatform 对 Gradle 复合构建的支持一直不完全。Kotlin 1.8.20 包含了改进支持的预览，它应该适用于更多种类的项目。要试用它，请将以下选项添加到你的 `gradle.properties`：

```none
kotlin.mpp.import.enableKgpDependencyResolution=true
```

此选项启用了新导入模式的预览。除了对复合构建的支持外，它还提供了更流畅的多平台项目导入体验，因为我们包含了主要的错误修复和改进，以使导入更稳定。

#### 已知问题

它仍然是一个需要进一步稳定的预览版本，在此过程中你可能会遇到一些导入问题。以下是我们计划在 Kotlin 1.8.20 最终发布之前修复的一些已知问题：

*   IntelliJ IDEA 2023.1 EAP 尚无 Kotlin 1.8.20 插件可用。尽管如此，你仍然可以将 Kotlin Gradle 插件版本设置为 1.8.20，并在此 IDE 中试用复合构建。
*   如果你的项目包含指定了 `rootProject.name` 的构建，复合构建可能无法解析 Kotlin 元数据。有关解决方法和详细信息，请参阅此 [Youtrack 问题](https://youtrack.jetbrains.com/issue/KT-56536)。

我们鼓励你试用此功能，并在 [YouTrack](https://kotl.in/issue) 上提交所有报告，以帮助我们使其在 Kotlin 1.9.0 中成为默认设置。

### Xcode 中 Gradle 错误输出改进

如果你在 Xcode 中构建多平台项目时遇到问题，你可能会遇到“Command PhaseScriptExecution failed with a nonzero exit code”错误。此消息表明 Gradle 调用失败，但在尝试检测问题时帮助不大。

从 Kotlin 1.8.20 开始，Xcode 可以解析 Kotlin/Native 编译器的输出。此外，如果 Gradle 构建失败，你将在 Xcode 中看到来自根本原因异常的额外错误消息。在大多数情况下，它将有助于识别根本问题。

![Improved output for Gradle errors in Xcode](xcode-gradle-output.png){width=700}

对于 Xcode 集成的标准 Gradle 任务，新行为默认启用，例如 `embedAndSignAppleFrameworkForXcode`，它可以将多平台项目中的 iOS 框架连接到 Xcode 中的 iOS 应用程序。它也可以通过 `kotlin.native.useXcodeMessageStyle` Gradle 属性启用（或禁用）。

## Kotlin/JavaScript

Kotlin 1.8.20 更改了 TypeScript 定义的生成方式。它还包含一项旨在改善你的调试体验的更改：

*   [从 Gradle 插件中移除 Dukat 集成](#removal-of-dukat-integration-from-gradle-plugin)
*   [源映射中的 Kotlin 变量和函数名称](#kotlin-variable-and-function-names-in-source-maps)
*   [选择启用 TypeScript 定义文件生成](#opt-in-for-generation-of-typescript-definition-files)

### 从 Gradle 插件中移除 Dukat 集成

在 Kotlin 1.8.20 中，我们已从 Kotlin/JavaScript Gradle 插件中移除了我们的[实验性](components-stability.md#stability-levels-explained) Dukat 集成。Dukat 集成支持将 TypeScript 声明文件（`.d.ts`）自动转换为 Kotlin 外部声明。

你仍然可以使用我们的 [Dukat 工具](https://github.com/Kotlin/dukat)将 TypeScript 声明文件（`.d.ts`）转换为 Kotlin 外部声明。

> Dukat 工具是[实验性功能](components-stability.md#stability-levels-explained)。它可能随时被移除或更改。
>
{style="warning"}

### 源映射中的 Kotlin 变量和函数名称

为了帮助调试，我们引入了将你在 Kotlin 代码中声明的变量和函数名称添加到源映射中的功能。在 1.8.20 之前，这些在源映射中不可用，因此在调试器中，你总是看到生成的 JavaScript 的变量和函数名称。

你可以通过在 Gradle 文件 `build.gradle.kts` 中使用 `sourceMapNamesPolicy` 或 `-source-map-names-policy` 编译器选项来配置添加的内容。下表列出了可能的设置：

| 设置                  | 描述                            | 示例输出                    |
|-----------------------|---------------------------------|-----------------------------|
| `simple-names`        | 添加变量名和简单函数名。（默认）        | `main`                      |
| `fully-qualified-names` | 添加变量名和完全限定函数名。        | `com.example.kjs.playground.main` |
| `no`                  | 不添加变量或函数名。              | 不适用                       |

有关 `build.gradle.kts` 文件中的配置示例，请参见下文：

```kotlin
tasks.withType<org.jetbrains.kotlin.gradle.tasks.Kotlin2JsCompile>().configureEach {
    compilercompileOptions.sourceMapNamesPolicy.set(org.jetbrains.kotlin.gradle.dsl.JsSourceMapNamesPolicy.SOURCE_MAP_NAMES_POLICY_FQ_NAMES) // or SOURCE_MAP_NAMES_POLICY_NO, or SOURCE_MAP_NAMES_POLICY_SIMPLE_NAMES
}
```
{validate="false"}

基于 Chromium 的浏览器中提供的调试工具可以从你的源映射中获取原始 Kotlin 名称，以提高堆栈跟踪的可读性。祝你调试愉快！

> 在源映射中添加变量和函数名称是[实验性功能](components-stability.md#stability-levels-explained)。它可能随时被移除或更改。
>
{style="warning"}

### 选择启用 TypeScript 定义文件生成

以前，如果你有一个生成可执行文件（`binaries.executable()`）的项目，Kotlin/JS IR 编译器会自动收集任何带有 `@JsExport` 标记的顶级声明，并在 `.d.ts` 文件中自动生成 TypeScript 定义。

由于这并非对所有项目都有用，我们在 Kotlin 1.8.20 中更改了此行为。如果你想生成 TypeScript 定义，你必须在 Gradle 构建文件中明确配置。在 [`js` 部分](js-project-setup.md#execution-environments)的 `build.gradle.kts.file` 中添加 `generateTypeScriptDefinitions()`。例如：

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
{validate="false"}

> TypeScript 定义（`d.ts`）的生成是[实验性功能](components-stability.md#stability-levels-explained)。它可能随时被移除或更改。
>
{style="warning"}

## Gradle

Kotlin 1.8.20 完全兼容 Gradle 6.8 到 7.6，除了多平台插件中的一些[特殊情况](https://youtrack.jetbrains.com/issue/KT-55751)。你也可以使用直到最新 Gradle 版本的 Gradle，但如果你这样做，请记住你可能会遇到弃用警告或某些新的 Gradle 功能可能无法工作。

此版本带来了以下更改：

*   [新 Gradle 插件版本对齐](#new-gradle-plugins-versions-alignment)
*   [Gradle 中默认启用新的 JVM 增量编译](#new-jvm-incremental-compilation-by-default-in-gradle)
*   [精确备份编译任务输出](#precise-backup-of-compilation-tasks-outputs)
*   [所有 Gradle 版本均延迟创建 Kotlin/JVM 任务](#lazy-kotlin-jvm-tasks-creation-for-all-gradle-versions)
*   [编译任务 destinationDirectory 的非默认位置](#non-default-location-of-compile-tasks-destinationdirectory)
*   [选择不向 HTTP 统计服务报告编译器参数的功能](#ability-to-opt-out-from-reporting-compiler-arguments-to-an-http-statistics-service)

### 新 Gradle 插件版本对齐

Gradle 提供了一种方法来确保必须协同工作的依赖项始终[在版本上对齐](https://docs.gradle.org/current/userguide/dependency_version_alignment.html#aligning_versions_natively_with_gradle)。Kotlin 1.8.20 也采用了这种方法。它默认启用，因此你无需更改或更新配置即可启用它。此外，你不再需要通过[此变通方法来解决 Kotlin Gradle 插件的传递性依赖](whatsnew18.md#resolution-of-kotlin-gradle-plugins-transitive-dependencies)。

我们非常感谢您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-54691) 上提供有关此功能的反馈。

### Gradle 中默认启用新的 JVM 增量编译

增量编译的新方法[自 Kotlin 1.7.0 起已可用](whatsnew17.md#a-new-approach-to-incremental-compilation)，现在默认启用。你不再需要在 `gradle.properties` 中指定 `kotlin.incremental.useClasspathSnapshot=true` 来启用它。

我们非常感谢您对此的反馈。你可以在 YouTrack 中[提交一个问题](https://kotl.in/issue)。

### 精确备份编译任务输出

> 编译任务输出的精确备份是[实验性功能](components-stability.md#stability-levels-explained)。要使用它，请将 `kotlin.compiler.preciseCompilationResultsBackup=true` 添加到 `gradle.properties`。我们非常感谢您在 [YouTrack](https://kotl.in/issue/experimental-ic-optimizations) 上提供反馈。
>
{style="warning"}

从 Kotlin 1.8.20 开始，你可以启用精确备份，这样只有 Kotlin 在[增量编译](gradle-compilation-and-caches.md#incremental-compilation)中重新编译的那些类才会被备份。完整备份和精确备份都有助于在编译错误后再次增量运行构建。与完整备份相比，精确备份还能节省构建时间。在大型项目或有许多任务进行备份时，完整备份可能会占用**显著**的构建时间，特别是当项目位于慢速 HDD 上时。

此优化是实验性的。你可以通过将 `kotlin.compiler.preciseCompilationResultsBackup` Gradle 属性添加到 `gradle.properties` 文件来启用它：

```none
kotlin.compiler.preciseCompilationResultsBackup=true
```

#### JetBrains 中精确备份使用示例 {initial-collapse-state="collapsed" collapsible="true"}

在下面的图表中，你可以看到精确备份与完整备份的使用示例：

![Comparison of full and precise backups](comparison-of-full-and-precise-backups.png){width=700}

第一张和第二张图表显示了 Kotlin 项目中的精确备份如何影响 Kotlin Gradle 插件的构建：

1.  对许多模块依赖的模块进行小的 [ABI](https://en.wikipedia.org/wiki/Application_binary_interface) 更改后——添加一个新的公共方法。
2.  对没有其他模块依赖的模块进行小的非 ABI 更改后——添加一个私有函数。

第三张图表显示了 [Space](https://www.jetbrains.com/space/) 项目中的精确备份如何影响在对许多模块依赖的 Kotlin/JS 模块进行小的非 ABI 更改后（添加一个私有函数）构建 Web 前端。

这些测量是在配备 Apple M1 Max CPU 的计算机上进行的；不同的计算机将产生略有不同的结果。影响性能的因素包括但不限于：

*   [Kotlin 守护进程](gradle-compilation-and-caches.md#the-kotlin-daemon-and-how-to-use-it-with-gradle)和 [Gradle 守护进程](https://docs.gradle.org/current/userguide/gradle_daemon.html)的“热身”程度。
*   磁盘的速度快慢。
*   CPU 型号及其繁忙程度。
*   哪些模块受更改影响以及这些模块的大小。
*   更改是 ABI 相关的还是非 ABI 相关的。

#### 使用构建报告评估优化 {initial-collapse-state="collapsed" collapsible="true"}

要评估优化对你的计算机、项目和场景的影响，你可以使用 [Kotlin 构建报告](gradle-compilation-and-caches.md#build-reports)。通过将以下属性添加到你的 `gradle.properties` 文件中，启用文本文件格式的报告：

```none
kotlin.build.report.output=file
```

以下是启用精确备份前报告相关部分的示例：

```none
Task ':kotlin-gradle-plugin:compileCommonKotlin' finished in 0.59 s
<...>
Time metrics:
 Total Gradle task time: 0.59 s
 Task action before worker execution: 0.24 s
  Backup output: 0.22 s // 注意此数字 
<...>
```

以下是启用精确备份后报告相关部分的示例：

```none
Task ':kotlin-gradle-plugin:compileCommonKotlin' finished in 0.46 s
<...>
Time metrics:
 Total Gradle task time: 0.46 s
 Task action before worker execution: 0.07 s
  Backup output: 0.05 s // 时间已缩短
 Run compilation in Gradle worker: 0.32 s
  Clear jar cache: 0.00 s
  Precise backup output: 0.00 s // 与精确备份相关
  Cleaning up the backup stash: 0.00 s // 与精确备份相关
<...>
```

### 所有 Gradle 版本均延迟创建 Kotlin/JVM 任务

对于使用 `org.jetbrains.kotlin.gradle.jvm` 插件且 Gradle 版本为 7.3+ 的项目，Kotlin Gradle 插件不再急切地创建和配置 `compileKotlin` 任务。在较低的 Gradle 版本上，它只是注册所有任务，并且在空运行（dry run）时不会配置它们。现在使用 Gradle 7.3+ 时，也已采用相同的行为。

### 编译任务 destinationDirectory 的非默认位置

如果你执行以下操作之一，请使用一些额外的代码更新你的构建脚本：

*   覆盖 Kotlin/JVM `KotlinJvmCompile`/`KotlinCompile` 任务的 `destinationDirectory` 位置。
*   使用已弃用的 Kotlin/JS/Non-IR [变体](gradle-plugin-variants.md)并覆盖 `Kotlin2JsCompile` 任务的 `destinationDirectory`。

你需要显式地将 `sourceSets.main.kotlin.classesDirectories` 添加到你的 JAR 文件中的 `sourceSets.main.outputs`：

```groovy
tasks.jar(type: Jar) {
    from sourceSets.main.outputs
    from sourceSets.main.kotlin.classesDirectories
}
```

### 选择不向 HTTP 统计服务报告编译器参数的功能

你现在可以控制 Kotlin Gradle 插件是否应在 HTTP [构建报告](gradle-compilation-and-caches.md#build-reports)中包含编译器参数。有时，你可能不需要插件报告这些参数。如果一个项目包含许多模块，报告中的编译器参数可能会非常庞大且帮助不大。现在有一种方法可以禁用它，从而节省内存。在你的 `gradle.properties` 或 `local.properties` 中，使用 `kotlin.build.report.include_compiler_arguments=(true|false)` 属性。

我们非常感谢您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-55323/) 上提供有关此功能的反馈。

## 标准库

Kotlin 1.8.20 添加了各种新功能，其中一些对于 Kotlin/Native 开发特别有用：

*   [支持 AutoCloseable 接口](#support-for-the-autocloseable-interface)
*   [支持 Base64 编码和解码](#support-for-base64-encoding)
*   [Kotlin/Native 中对 @Volatile 的支持](#support-for-volatile-in-kotlin-native)
*   [修复 Kotlin/Native 中使用正则表达式时堆栈溢出问题](#bug-fix-for-stack-overflow-when-using-regex-in-kotlin-native)

### 支持 AutoCloseable 接口

> 新的 `AutoCloseable` 接口是[实验性功能](components-stability.md#stability-levels-explained)，要使用它，你需要通过 `@OptIn(ExperimentalStdlibApi::class)` 或编译器参数 `-opt-in=kotlin.ExperimentalStdlibApi` 进行选择启用。
>
{style="warning"}

`AutoCloseable` 接口已添加到公共标准库中，以便你可以为所有库使用一个公共接口来关闭资源。在 Kotlin/JVM 中，`AutoCloseable` 接口是 [`java.lang.AutoClosable`](https://docs.oracle.com/javase/8/docs/api/java/lang/AutoCloseable.html) 的别名。

此外，现在还包含了扩展函数 `use()`，它在选定的资源上执行给定的代码块函数，然后正确关闭它，无论是否抛出异常。

公共标准库中没有实现 `AutoCloseable` 接口的公共类。在下面的示例中，我们定义了 `XMLWriter` 接口，并假设存在一个实现它的资源。例如，这个资源可能是一个打开文件、写入 XML 内容然后关闭它的类。

```kotlin
interface XMLWriter : AutoCloseable {
    fun document(encoding: String, version: String, content: XMLWriter.() -> Unit)
    fun element(name: String, content: XMLWriter.() -> Unit)
    fun attribute(name: String, value: String)
    fun text(value: String)
}

fun writeBooksTo(writer: XMLWriter) {
    writer.use { xml ->
        xml.document(encoding = "UTF-8", version = "1.0") {
            element("bookstore") {
                element("book") {
                    attribute("category", "fiction")
                    element("title") { text("Harry Potter and the Prisoner of Azkaban") }
                    element("author") { text("J. K. Rowling") }
                    element("year") { text("1999") }
                    element("price") { text("29.99") }
                }
                element("book") {
                    attribute("category", "programming")
                    element("title") { text("Kotlin in Action") }
                    element("author") { text("Dmitry Jemerov") }
                    element("author") { text("Svetlana Isakova") }
                    element("year") { text("2017") }
                    element("price") { text("25.19") }
                }
            }
        }
    }
}
```
{validate="false"}

### 支持 Base64 编码

> 新的编码和解码功能是[实验性功能](components-stability.md#stability-levels-explained)，要使用它，你需要通过 `@OptIn(ExperimentalEncodingApi::class)` 或编译器参数 `-opt-in=kotlin.io.encoding.ExperimentalEncodingApi` 进行选择启用。
>
{style="warning"}

我们已添加对 Base64 编码和解码的支持。我们提供 3 个类实例，每个都使用不同的编码方案并显示不同的行为。对于标准 [Base64 编码方案](https://www.rfc-editor.org/rfc/rfc4648#section-4)，请使用 `Base64.Default` 实例。

对于["URL 和文件名安全"](https://www.rfc-editor.org/rfc/rfc4648#section-5)编码方案，请使用 `Base64.UrlSafe` 实例。

对于 [MIME](https://www.rfc-editor.org/rfc/rfc2045#section-6.8) 编码方案，请使用 `Base64.Mime` 实例。当你使用 `Base64.Mime` 实例时，所有编码函数每 76 个字符会插入一个行分隔符。在解码的情况下，任何非法字符都会被跳过，并且不会抛出异常。

> `Base64.Default` 实例是 `Base64` 类的伴生对象。因此，你可以通过 `Base64.encode()` 和 `Base64.decode()` 调用其函数，而不是 `Base64.Default.encode()` 和 `Base64.Default.decode()`。
>
{style="tip"}

```kotlin
val foBytes = "fo".map { it.code.toByte() }.toByteArray()
Base64.Default.encode(foBytes) // "Zm8="
// Alternatively:
// Base64.encode(foBytes)

val foobarBytes = "foobar".map { it.code.toByte() }.toByteArray()
Base64.UrlSafe.encode(foobarBytes) // "Zm9vYmFy"

Base64.Default.decode("Zm8=") // foBytes
// Alternatively:
// Base64.decode("Zm8=")

Base64.UrlSafe.decode("Zm9vYmFy") // foobarBytes
```
{validate="false"}

你可以使用额外的函数将字节编码或解码到现有缓冲区中，以及将编码结果附加到提供的 `Appendable` 类型对象。

在 Kotlin/JVM 中，我们还添加了扩展函数 `encodingWith()` 和 `decodingWith()`，使你能够使用输入和输出流执行 Base64 编码和解码。

### Kotlin/Native 中对 @Volatile 的支持

> Kotlin/Native 中的 `@Volatile` 是[实验性功能](components-stability.md#stability-levels-explained)。它可能随时被移除或更改。需要选择启用（详见下文）。仅用于评估目的。我们非常感谢您在 [YouTrack](https://kotl.in/issue) 上提供反馈。
>
{style="warning"}

如果你用 `@Volatile` 注解一个 `var` 属性，那么支持字段将被标记，使得对该字段的任何读写都是原子的，并且写入始终对其他线程可见。

在 1.8.20 之前，公共标准库中提供了 [`kotlin.jvm.Volatile` 注解](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-volatile/)。然而，此注解仅在 JVM 中有效。如果你在 Kotlin/Native 中使用它，它将被忽略，这可能导致错误。

在 1.8.20 中，我们引入了一个公共注解 `kotlin.concurrent.Volatile`，你可以在 JVM 和 Kotlin/Native 中使用它。

#### 如何启用

要试用此功能，请使用 `@OptIn(ExperimentalStdlibApi)` 进行选择启用，并启用 `-language-version 1.9` 编译器选项。在 Gradle 项目中，你可以通过将以下内容添加到 `build.gradle(.kts)` 文件中来实现：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
tasks
    .withType<org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask<*>>()
    .configureEach {
        compilerOptions
            .languageVersion
            .set(
                org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_1_9
            )
    }
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
tasks
    .withType(org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask.class)
    .configureEach {
        compilerOptions.languageVersion =
            org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_1_9
    }
```

</tab>
</tabs>

### 修复 Kotlin/Native 中使用正则表达式时堆栈溢出问题

在 Kotlin 的早期版本中，如果你的正则表达式输入包含大量字符，即使正则表达式模式非常简单，也可能发生崩溃。在 1.8.20 中，此问题已得到解决。有关更多信息，请参阅 [KT-46211](https://youtrack.jetbrains.com/issue/KT-46211)。

## 序列化更新

Kotlin 1.8.20 附带了对 [Kotlin K2 编译器的 Alpha 支持](#prototype-serialization-compiler-plugin-for-kotlin-k2-compiler)以及[禁止通过伴生对象自定义序列化器](#prohibit-implicit-serializer-customization-via-companion-object)。

### Kotlin K2 编译器的原型序列化编译器插件

> K2 序列化编译器插件的支持处于 [Alpha 阶段](components-stability.md#stability-levels-explained)。要使用它，请[启用 Kotlin K2 编译器](#how-to-enable-the-kotlin-k2-compiler)。
>
{style="warning"}

从 1.8.20 开始，序列化编译器插件与 Kotlin K2 编译器配合使用。快来试用并[与我们分享您的反馈](#leave-your-feedback-on-the-new-k2-compiler)吧！

### 禁止通过伴生对象进行隐式序列化器定制

目前，可以通过 `@Serializable` 注解将一个类声明为可序列化，同时在其伴生对象上通过 `@Serializer` 注解声明一个自定义序列化器。

例如：

```kotlin
import kotlinx.serialization.*

@Serializable
class Foo(val a: Int) {
    @Serializer(Foo::class)
    companion object {
        // Custom implementation of KSerializer<Foo>
    }
}
```

在这种情况下，`@Serializable` 注解并未明确指示使用了哪个序列化器。实际上，`Foo` 类具有一个自定义序列化器。

为了防止这种混淆，在 Kotlin 1.8.20 中，我们针对检测到此情况时引入了一个编译器警告。该警告包含一个解决此问题的可能迁移路径。

如果你的代码中使用了此类构造，我们建议将其更新为以下形式：

```kotlin
import kotlinx.serialization.*

@Serializable(Foo.Companion::class)
class Foo(val a: Int) {
    // Doesn't matter if you use @Serializer(Foo::class) or not
    companion object: KSerializer<Foo> {
        // Custom implementation of KSerializer<Foo>
    }
}
```

通过这种方法，很明显 `Foo` 类使用了在伴生对象中声明的自定义序列化器。有关更多信息，请参阅我们的 [YouTrack 工单](https://youtrack.jetbrains.com/issue/KT-54441)。

> 在 Kotlin 2.0 中，我们计划将此编译警告提升为编译器错误。如果你看到此警告，我们建议你迁移代码。
>
{style="tip"}

## 文档更新

Kotlin 文档收到了一些值得注意的更改：

*   [Spring Boot 和 Kotlin 入门](jvm-get-started-spring-boot.md) – 创建一个带有数据库的简单应用程序，了解有关 Spring Boot 和 Kotlin 功能的更多信息。
*   [作用域函数](scope-functions.md) – 了解如何使用标准库中有用的作用域函数来简化你的代码。
*   [CocoaPods 集成](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-cocoapods-overview.html) – 设置与 CocoaPods 协同工作的环境。

## 安装 Kotlin 1.8.20

### 检查 IDE 版本

[IntelliJ IDEA](https://www.jetbrains.com/idea/download/) 2022.2 和 2022.3 会自动建议将 Kotlin 插件更新到 1.8.20 版本。IntelliJ IDEA 2023.1 内置了 Kotlin 插件 1.8.20。

Android Studio Flamingo (222) 和 Giraffe (223) 将在后续版本中支持 Kotlin 1.8.20。

新的命令行编译器可在 [GitHub 发布页面](https://github.com/JetBrains/kotlin/releases/tag/v1.8.20)下载。

### 配置 Gradle 设置

为了正确下载 Kotlin 工件和依赖项，请更新你的 `settings.gradle(.kts)` 文件以使用 Maven Central 仓库：

```kotlin
pluginManagement {
    repositories {
        mavenCentral()
        gradlePluginPortal()
    }
}
```

如果未指定仓库，Gradle 将使用已停止维护的 JCenter 仓库，这可能导致 Kotlin 工件出现问题。