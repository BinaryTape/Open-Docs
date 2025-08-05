[//]: # (title: Kotlin 1.8.20 有哪些新特性)

_[发布日期：2023 年 4 月 25 日](releases.md#release-details)_

Kotlin 1.8.20 版本已发布，以下是其一些重要亮点：

* [Kotlin K2 编译器新更新](#new-kotlin-k2-compiler-updates)
* [新的实验性 Kotlin/Wasm 目标平台](#new-kotlin-wasm-target)
* [Gradle 中默认启用新的 JVM 增量编译](#new-jvm-incremental-compilation-by-default-in-gradle)
* [Kotlin/Native 目标平台更新](#update-for-kotlin-native-targets)
* [Kotlin Multiplatform 中 Gradle 复合构建的预览版](#preview-of-gradle-composite-builds-support-in-kotlin-multiplatform)
* [改进了 Xcode 中 Gradle 错误的输出](#improved-output-for-gradle-errors-in-xcode)
* [标准库中对 AutoCloseable 接口的实验性支持](#support-for-the-autocloseable-interface)
* [标准库中对 Base64 编码的实验性支持](#support-for-base64-encoding)

你也可以在这段视频中找到这些更改的简短概述：

<video src="https://www.youtube.com/v/R1JpkpPzyBU" title="Kotlin 1.8.20 有哪些新特性"/>

## IDE 支持

支持 1.8.20 的 Kotlin 插件适用于：

| IDE            | 支持的版本            |
|----------------|-------------------------------|
| IntelliJ IDEA  | 2022.2.x, 2022.3.x,  2023.1.x |
| Android Studio | Flamingo (222)                |

> 为了正确下载 Kotlin 构件和依赖项，请[配置 Gradle 设置](#configure-gradle-settings)以使用 Maven Central 仓库。
>
{style="warning"}

## Kotlin K2 编译器新更新

Kotlin 团队持续稳定 K2 编译器。正如在 [Kotlin 1.7.0 公告](whatsnew17.md#new-kotlin-k2-compiler-for-the-jvm-in-alpha)中提及的，它仍处于 **Alpha** 阶段。
此版本引入了进一步的改进，为迈向 [K2 Beta](https://youtrack.jetbrains.com/issue/KT-52604) 铺平了道路。

从 1.8.20 版本开始，Kotlin K2 编译器：

* 拥有序列化插件的预览版本。
* 为 [JS IR 编译器](js-ir-compiler.md)提供了 Alpha 支持。
* 引入了 [新语言版本 Kotlin 2.0](https://blog.jetbrains.com/kotlin/2023/02/k2-kotlin-2-0/) 的未来版本。

通过以下视频了解新编译器及其优势：

* [每个人都必须了解的全新 Kotlin K2 编译器](https://www.youtube.com/watch?v=iTdJJq_LyoY)
* [全新 Kotlin K2 编译器：专家审阅](https://www.youtube.com/watch?v=db19VFLZqJM)

### 如何启用 Kotlin K2 编译器

要启用并测试 Kotlin K2 编译器，请使用新语言版本以及以下编译器选项：

```bash
-language-version 2.0
```

你可以在 `build.gradle(.kts)` 文件中指定它：

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

> 新 K2 编译器的 Alpha 版本仅适用于 JVM 和 JS IR 项目。
> 它尚不支持 Kotlin/Native 或任何多平台项目。
>
{style="warning"}

### 对新 K2 编译器留下你的反馈

我们非常感谢你提供的任何反馈！

* 直接向 Kotlin Slack 上的 K2 开发者提供反馈 – [获取邀请](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up?_gl=1*ju6cbn*_ga*MTA3MTk5NDkzMC4xNjQ2MDY3MDU4*_ga_9J976DJZ68*MTY1ODMzNzA3OS4xMDAuMS4xNjU4MzQwODEwLjYw)并加入 [#k2-early-adopters](https://kotlinlang.slack.com/archives/C03PK0PE257) 频道。
* 在[我们的问题追踪器](https://kotl.in/issue)上报告你使用新 K2 编译器时遇到的任何问题。
* [启用 **Send usage statistics** 选项](https://www.jetbrains.com/help/idea/settings-usage-statistics.html)以允许 JetBrains 收集有关 K2 使用的匿名数据。

## 语言

随着 Kotlin 的不断发展，我们将在 1.8.20 中引入新语言特性的预览版本：

* [Enum 类 values 函数的现代化高性能替代方案](#a-modern-and-performant-replacement-of-the-enum-class-values-function)
* [与数据类对称的数据对象](#preview-of-data-objects-for-symmetry-with-data-classes)
* [取消对内联类中带有函数体的次构造函数限制的预览](#preview-of-lifting-restriction-on-secondary-constructors-with-bodies-in-inline-classes)

### Enum 类 values 函数的现代化高性能替代方案

> 这项特性是[实验性的](components-stability.md#stability-levels-explained)。
> 它可能随时被删除或更改。需要选择启用（详见下文）。仅用于评估目的。
> 我们非常感谢你在 [YouTrack](https://kotl.in/issue) 上提供反馈。
>
{style="warning"}

Enum 类有一个合成的 `values()` 函数，它返回一个已定义枚举常量的数组。然而，在 Kotlin 和 Java 中，使用数组可能导致[隐藏的性能问题](https://github.com/Kotlin/KEEP/blob/master/proposals/enum-entries.md#examples-of-performance-issues)。
此外，大多数 API 使用集合，这需要最终进行转换。为了解决这些问题，我们为 Enum 类引入了 `entries` 属性，它应该替代 `values()` 函数使用。调用时，`entries` 属性返回一个预分配的不可变 Enum 常量 list。

> `values()` 函数仍然受支持，但我们建议你使用 `entries` 属性来替代。
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

要试用这项特性，请选择启用 `@OptIn(ExperimentalStdlibApi)` 并启用 `-language-version 1.9` 编译器选项。在 Gradle 项目中，你可以通过将以下内容添加到 `build.gradle(.kts)` 文件中来完成：

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

> 从 IntelliJ IDEA 2023.1 开始，如果你已选择启用此特性，则相应的 IDE 检查将通知你从 `values()` 转换为 `entries` 并提供快速修复。
>
{style="tip"}

有关该提案的更多信息，请参见 [KEEP 笔记](https://github.com/Kotlin/KEEP/blob/master/proposals/enum-entries.md)。

### 与数据类对称的数据对象预览

data object 允许你声明具有单例语义和简洁 `toString()` 表示的对象。在此代码片段中，你可以看到将 `data` 关键字添加到对象声明如何提高其 `toString()` 输出的可读性：

```kotlin
package org.example
object MyObject
data object MyDataObject

fun main() {
    println(MyObject) // org.example.MyObject@1f32e575
    println(MyDataObject) // MyDataObject
}
```

特别对于 `sealed` 层次结构（例如 `sealed class` 或 `sealed interface` 层次结构），`data object` 是一个绝佳的选择，因为它们可以方便地与 `data class` 声明一起使用。在此代码片段中，将 `EndOfFile` 声明为 `data object` 而不是普通 `object` 意味着它将获得一个漂亮的 `toString`，而无需手动覆盖它。这与随附的数据类定义保持了对称性。

```kotlin
sealed interface ReadResult
data class Number(val number: Int) : ReadResult
data class Text(val text: Int) : ReadResult
data object EndOfFile : ReadResult

fun main() {
    println(Number(7)) // Number(number=7)
    println(EndOfFile) // EndOfFile
}
```

#### data object 的语义

自 [Kotlin 1.7.20](whatsnew1720.md#improved-string-representations-for-singletons-and-sealed-class-hierarchies-with-data-objects) 的第一个预览版本以来，data object 的语义已经过改进。编译器现在会自动为它们生成多个便利函数：

##### toString

data object 的 `toString()` 函数返回对象的简单名称：

```kotlin
data object MyDataObject {
    val x: Int = 3
}

fun main() {
    println(MyDataObject) // MyDataObject
}
```

##### equals 和 hashCode

data object 的 `equals()` 函数确保所有具有你的 `data object` 类型的对象都被认为是相等的。在大多数情况下，你只会有一个 data object 的单例实例（毕竟，`data object` 声明了一个单例）。然而，在运行时生成相同类型的另一个对象的边缘情况下（例如，通过 `java.lang.reflect` 的平台反射，或者使用底层使用此 API 的 JVM 序列化库），这确保了这些对象被视为相等。

确保只对 `data object` 进行结构化比较（使用 `==` 操作符），而不要进行引用比较（`===` 操作符）。这有助于避免在运行时存在多个 data object 实例时可能遇到的陷阱。以下代码片段说明了这个特殊的边缘情况：

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

生成的 `hashCode()` 函数的行为与 `equals()` 函数一致，因此 data object 的所有运行时实例都具有相同的哈希码。

##### data object 没有 copy 和 componentN 函数

虽然 `data object` 和 `data class` 声明经常一起使用并有一些相似之处，但有些函数是不会为 `data object` 生成的：

因为 `data object` 声明旨在用作单例对象，所以不生成 `copy()` 函数。单例模式将类的实例化限制为单个实例，允许创建实例的副本将违反该限制。

此外，与 `data class` 不同，`data object` 没有任何数据属性。由于尝试[解构](destructure)此类对象没有意义，因此不生成 `componentN()` 函数。

我们非常感谢你在 [YouTrack](https://youtrack.com/issue/KT-4107) 上对此特性提供反馈。

#### 如何启用 data object 预览

要试用这项特性，请启用 `-language-version 1.9` 编译器选项。在 Gradle 项目中，你可以通过将以下内容添加到 `build.gradle(.kts)` 文件中来完成：

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

### 取消对内联类中带有函数体的次构造函数限制的预览

> 这项特性是[实验性的](components-stability.md#stability-levels-explained)。它可能随时被删除或更改。
> 需要选择启用（详见下文）。仅用于评估目的。我们非常感谢你在 [YouTrack](https://kotl.in/issue) 上对此提供反馈。
>
{style="warning"}

Kotlin 1.8.20 取消了对[内联类](inline-classes.md)中使用带函数体的次构造函数的限制。

内联类以前只允许一个不带 `init` 代码块或次构造函数的公共主构造函数，以保持清晰的初始化语义。结果，无法封装底层值或创建表示某些受限值的内联类。

当 Kotlin 1.4.30 取消对 `init` 代码块的限制时，这些问题得到了解决。现在我们更进一步，在预览模式下允许带有函数体的次构造函数：

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

#### 如何启用带函数体的次构造函数

要试用这项特性，请启用 `-language-version 1.9` 编译器选项。在 Gradle 项目中，你可以通过将以下内容添加到 `build.gradle(.kts)` 中来完成：

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

我们鼓励你试用此特性，并在 [YouTrack](https://kotl.in/issue) 中提交所有报告，以帮助我们在 Kotlin 1.9.0 中将其设为默认。

通过 [此 KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/inline-classes.md) 了解更多关于 Kotlin 内联类的开发信息。

## 新的 Kotlin/Wasm 目标平台

Kotlin/Wasm (Kotlin WebAssembly) 在此版本中进入[实验阶段](components-stability.md#stability-levels-explained)。Kotlin 团队认为 [WebAssembly](https://webassembly.org/) 是一项很有前景的技术，并希望找到更好的方法让你使用它并获得 Kotlin 的所有优势。

WebAssembly 二进制格式是平台独立的，因为它使用自己的虚拟机运行。几乎所有现代浏览器都已支持 WebAssembly 1.0。要设置运行 WebAssembly 的环境，你只需启用 Kotlin/Wasm 所面向的实验性垃圾回收模式。你可以在此处找到详细说明：[如何启用 Kotlin/Wasm](#how-to-enable-kotlin-wasm)。

我们希望强调新的 Kotlin/Wasm 目标平台的以下优点：

* 与 `wasm32` Kotlin/Native 目标平台相比，编译速度更快，因为 Kotlin/Wasm 无需使用 LLVM。
* 与 `wasm32` 目标平台相比，与 JS 的[互操作性](interop)和与浏览器的集成更容易，这得益于 [Wasm 垃圾回收](https://github.com/WebAssembly/gc)。
* 与 Kotlin/JS 和 JavaScript 相比，应用程序启动可能更快，因为 Wasm 具有紧凑且易于解析的字节码。
* 与 Kotlin/JS 和 JavaScript 相比，应用程序运行时性能有所提高，因为 Wasm 是一种静态类型语言。

从 1.8.20 版本开始，你可以在实验性项目中使用 Kotlin/Wasm。
我们开箱即用地为 Kotlin/Wasm 提供了 Kotlin 标准库 (`stdlib`) 和测试库 (`kotlin.test`)。
IDE 支持将在未来的版本中添加。

[在此 YouTube 视频中了解更多关于 Kotlin/Wasm 的信息](https://www.youtube.com/watch?v=-pqz9sKXatw)。

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

> 访问[包含 Kotlin/Wasm 示例的 GitHub 版本库](https://github.com/Kotlin/kotlin-wasm-examples)。
>
{style="tip"}

要运行 Kotlin/Wasm 项目，你需要更新目标环境的设置：

<tabs>
<tab title="Chrome">

* 对于 109 版本：

  使用 `--js-flags=--experimental-wasm-gc` 命令行实参运行应用程序。

* 对于 110 或更高版本：

    1. 在浏览器中打开 `chrome://flags/#enable-webassembly-garbage-collection`。
    2. 启用 **WebAssembly Garbage Collection**。
    3. 重启你的浏览器。

</tab>
<tab title="Firefox">

对于 109 或更高版本：

1. 在浏览器中打开 `about:config`。
2. 启用 `javascript.options.wasm_function_references` 和 `javascript.options.wasm_gc` 选项。
3. 重启你的浏览器。

</tab>
<tab title="Edge">

对于 109 或更高版本：

使用 `--js-flags=--experimental-wasm-gc` 命令行实参运行应用程序。

</tab>
</tabs>

### 对 Kotlin/Wasm 留下你的反馈

我们非常感谢你提供的任何反馈！

* 直接向 Kotlin Slack 上的开发者提供反馈 – [获取邀请](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up?_gl=1*ju6cbn*_ga*MTA3MTk5NDkzMC4xNjQ2MDY3MDU4*_ga_9J976DJZ68*MTY1ODMzNzA3OS4xMDAuMS4xNjU4MzQwODEwLjYw)并加入 [#webassembly](https://kotlinlang.slack.com/archives/CDFP59223) 频道。
* 在 [此 YouTrack 问题](https://youtrack.jetbrains.com/issue/KT-56492)上报告你使用 Kotlin/Wasm 时遇到的任何问题。

## Kotlin/JVM

Kotlin 1.8.20 引入了 [Java 合成属性引用的预览](#preview-of-java-synthetic-property-references)，
以及[默认情况下 kapt 存根生成任务中对 JVM IR 后端的支持](#support-for-the-jvm-ir-backend-in-kapt-stub-generating-task-by-default)。

### Java 合成属性引用的预览

> 这项特性是[实验性的](components-stability.md#stability-levels-explained)。
> 它可能随时被删除或更改。仅用于评估目的。
> 我们非常感谢你在 [YouTrack](https://kotl.in/issue) 上对此提供反馈。
>
{style="warning"}

Kotlin 1.8.20 引入了创建 Java 合成属性引用的能力，例如，对于以下 Java 代码：

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

Kotlin 一直允许你编写 `person.age`，其中 `age` 是一个合成属性。
现在，你也可以创建对 `Person::age` 和 `person::age` 的引用。`name` 也同样适用。

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

要试用这项特性，请启用 `-language-version 1.9` 编译器选项。
在 Gradle 项目中，你可以通过将以下内容添加到 `build.gradle(.kts)` 中来完成：

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

### 默认情况下 kapt 存根生成任务中对 JVM IR 后端的支持

在 Kotlin 1.7.20 中，我们引入了[在 kapt 存根生成任务中对 JVM IR 后端的支持](whatsnew1720.md#support-for-the-jvm-ir-backend-in-kapt-stub-generating-task)。从本版本开始，这项支持默认生效。你不再需要
在 `gradle.properties` 中指定 `kapt.use.jvm.ir=true` 来启用它。
我们非常感谢你在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-49682) 上对此特性提供反馈。

## Kotlin/Native

Kotlin 1.8.20 包含对支持的 Kotlin/Native 目标平台、与 Objective-C 的[互操作性](interop)以及 CocoaPods Gradle 插件改进等更新：

* [Kotlin/Native 目标平台更新](#update-for-kotlin-native-targets)
* [旧内存管理器的弃用](#deprecation-of-the-legacy-memory-manager)
* [支持带有 @import 指令的 Objective-C 头文件](#support-for-objective-c-headers-with-import-directives)
* [Cocoapods Gradle 插件中支持仅链接模式](#support-for-the-link-only-mode-in-cocoapods-gradle-plugin)
* [在 UIKit 中将 Objective-C 扩展作为类成员导入](#import-objective-c-extensions-as-class-members-in-uikit)
* [重新实现编译器中的编译器缓存管理](#reimplementation-of-compiler-cache-management-in-the-compiler)
* [Cocoapods Gradle 插件中 `useLibraries()` 的弃用](#deprecation-of-uselibraries-in-cocoapods-gradle-plugin)
  
### Kotlin/Native 目标平台更新
  
Kotlin 团队决定重新审视 Kotlin/Native 支持的[目标平台](target)列表，将其分为不同的层级，并从 Kotlin 1.8.20 开始弃用其中一些。
请参见 [Kotlin/Native 目标平台支持](native-target-support.md)部分，了解受支持和已弃用目标平台的完整列表。

以下目标平台已随 Kotlin 1.8.20 弃用，并将在 1.9.20 中移除：

* `iosArm32`
* `watchosX86`
* `wasm32`
* `mingwX86`
* `linuxArm32Hfp`
* `linuxMips32`
* `linuxMipsel32`

至于其余目标平台，现在有三种支持层级，取决于 Kotlin/Native 编译器对其支持和测试的程度。
一个目标平台可以被移动到不同的层级。例如，我们将尽最大努力在未来为 `iosArm64` 提供全面支持，因为它对 [Kotlin Multiplatform](https://www.jetbrains.com/help/kotlin-multiplatform-dev/get-started.html) 很重要。

如果你是库作者，这些目标平台层级可以帮助你决定在 CI 工具上测试哪些目标平台以及跳过哪些。
Kotlin 团队在开发官方 Kotlin 库（例如 [kotlinx.coroutines](coroutines-guide.md)）时将采用相同的方法。

请查看我们的[博客文章](https://blog.jetbrains.com/kotlin/2023/02/update-regarding-kotlin-native-targets/)，了解这些更改的原因。

### 旧内存管理器的弃用

从 1.8.20 开始，旧内存管理器已被弃用，并将在 1.9.20 中移除。
[新内存管理器](native-memory-manager.md)在 1.7.20 中默认启用，并已获得进一步的稳定性更新和性能改进。

如果你仍在使用旧内存管理器，请从 `gradle.properties` 中移除 `kotlin.native.binary.memoryModel=strict` 选项，并遵循我们的[迁移指南](native-migration-guide.md)进行必要的更改。

新内存管理器不支持 `wasm32` 目标平台。该目标平台也[从本版本开始](#update-for-kotlin-native-targets)弃用，并将在 1.9.20 中移除。

### 支持带有 @import 指令的 Objective-C 头文件

> 这项特性是[实验性的](components-stability.md#stability-levels-explained)。
> 它可能随时被删除或更改。需要选择启用（详见下文）。仅用于评估目的。
> 我们非常感谢你在 [YouTrack](https://kotl.in/issue) 上对此提供反馈。
>
{style="warning"}

Kotlin/Native 现在可以导入带有 `@import` 指令的 Objective-C 头文件。这项特性对于使用具有自动生成 Objective-C 头文件的 Swift 库，或用 Swift 编写的 CocoaPods 依赖项的类非常有用。

以前，cinterop 工具无法分析通过 `@import` 指令依赖于 Objective-C 模块的头文件。原因是它缺少对 `-fmodules` 选项的支持。

从 Kotlin 1.8.20 开始，你可以使用带有 `@import` 的 Objective-C 头文件。为此，请在定义文件中将 `-fmodules` 选项作为 `compilerOpts` 传递给编译器。
如果你使用 [CocoaPods 集成](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-cocoapods-overview.html)，请在 `pod()` 函数的配置代码块中指定 cinterop 选项，如下所示：

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

这是一项[备受期待的特性](https://youtrack.jetbrains.com/issue/KT-39120)，我们欢迎你在 [YouTrack](https://kotl.in/issue) 上提供反馈，以帮助我们在未来的版本中将其设为默认。

### Cocoapods Gradle 插件中支持仅链接模式

使用 Kotlin 1.8.20，你可以仅将 Pod 依赖项与动态 framework 用于链接，而无需生成 cinterop 绑定。
当 cinterop 绑定已生成时，这可能会派上用场。

考虑一个包含 2 个模块的[项目](project)：一个库和一个应用。该库依赖于一个 Pod，但不生成 framework，
只生成一个 `.klib`。该应用依赖于该库并生成一个动态 framework。
在这种情况下，你需要将此 framework 与该库依赖的 Pods 链接，
但你不需要 cinterop 绑定，因为它们已经为该库生成了。

要启用该特性，请在添加 Pod [依赖项](dependency)时使用 `linkOnly` 选项或构建器属性：

```kotlin
cocoapods {
    summary = "CocoaPods test library"
    homepage = "https://github.com/JetBrains/kotlin"

    pod("Alamofire", linkOnly = true) {
        version = "5.7.0"
    }
}
```

> 如果你将此选项与静态 framework 一起使用，它将完全移除 Pod [依赖项](dependency)，因为 Pods 不用于静态 framework 链接。
>
{style="note"}

### 在 UIKit 中将 Objective-C 扩展作为类成员导入

自 Xcode 14.1 以来，Objective-C 类中的一些[方法](method)已移至类别成员。这导致生成了不同的 Kotlin API，并且这些[方法](method)被作为 Kotlin [扩展](extension)而不是[方法](method)导入。

在使用 UIKit [覆盖](override)[方法](method)时，你可能因此遇到了问题。例如，在 Kotlin 中对 UIVIew 进行子类化时，无法[覆盖](override) `drawRect()` 或 `layoutSubviews()` [方法](method)。

从 1.8.20 开始，与 NSView 和 UIView 类在相同头文件中[声明](declare)的类别成员将作为这些类的成员导入。
这意味着从 NSView 和 UIView 子类化的[方法](method)可以像任何其他[方法](method)一样轻松地被[覆盖](override)。

如果一切顺利，我们计划默认对所有 Objective-C 类启用此行为。

### 重新实现编译器中的编译器缓存管理

为了加速编译器缓存的演进，我们已将编译器缓存管理从 Kotlin Gradle 插件转移到 Kotlin/Native 编译器。
这为几项重要改进扫清了障碍，包括与[编译](compilation)时间 和编译器缓存灵活性相关的改进。

如果你遇到问题并需要恢复旧行为，请使用 `kotlin.native.cacheOrchestration=gradle` Gradle 属性。

我们非常感谢你在 [YouTrack](https://kotl.in/issue) 上对此提供反馈。

### Cocoapods Gradle 插件中 `useLibraries()` 的弃用

Kotlin 1.8.20 开始弃用用于静态库的 [CocoaPods 集成](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-cocoapods-overview.html)中的 `useLibraries()` 函数。

我们引入 `useLibraries()` 函数是为了允许对包含静态库的 Pod 进行[依赖项](dependency)引用。随着时间的推移，这种情况变得非常罕见。大多数 Pod 通过源代码分发，而 Objective-C framework 或 XCFramework 是二进制分发的常见选择。

由于此函数不受欢迎，并且它会产生复杂化 Kotlin CocoaPods Gradle 插件开发的问题，我们已决定弃用它。

有关 framework 和 XCFramework 的更多信息，请参见[构建最终原生二进制文件](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-build-native-binaries.html)。

## Kotlin Multiplatform

Kotlin 1.8.20 旨在通过以下对 Kotlin Multiplatform 的更新来改善开发者体验：

* [设置源代码集层次结构的新方法](#new-approach-to-source-set-hierarchy)
* [Kotlin Multiplatform 中 Gradle 复合构建支持的预览](#preview-of-gradle-composite-builds-support-in-kotlin-multiplatform)
* [改进了 Xcode 中 Gradle 错误的输出](#improved-output-for-gradle-errors-in-xcode)

### 源代码集层次结构的新方法

> 源代码集层次结构的新方法是[实验性的](components-stability.md#stability-levels-explained)。
> 它可能会在未来的 Kotlin 版本中在不提前通知的情况下更改。需要选择启用（详见下文）。
> 我们非常感谢你在 [YouTrack](https://kotl.in/issue) 中提供反馈。
>
{style="warning"}

Kotlin 1.8.20 提供了一种在多平台项目中设置源代码集层次结构的新方法——默认目标层次结构。
新方法旨在取代像 `ios` 这样的目标快捷方式，这些快捷方式存在[设计缺陷](#why-replace-shortcuts)。

默认目标层次结构背后的思想很简单：你[显式](explicit)[声明](declare)项目[编译](compilation)到的所有[目标平台](target)，而 Kotlin Gradle 插件会根据指定的[目标平台](target)自动创建共享源代码集。

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

你可以将默认目标层次结构视为所有可能目标平台及其共享源代码集的模板。
当你在代码中[声明](declare)最终目标平台 `android`、`iosArm64` 和 `iosSimulatorArm64` 时，Kotlin Gradle 插件会从模板中找到合适的共享源代码集并为你创建它们。
最终的层次结构如下所示：

![An example of using the default target hierarchy](default-hierarchy-example.svg){thumbnail="true" width="350" thumbnail-same-file="true"}

绿色源代码集是实际创建并存在于[项目](project)中的，而默认模板中的灰色源代码集则被忽略。
如你所见，Kotlin Gradle 插件没有创建 `watchos` 源代码集，例如，因为[项目](project)中没有 watchOS 目标平台。

如果你添加一个 watchOS 目标平台，例如 `watchosArm64`，`watchos` 源代码集将被创建，并且来自 `apple`、`native` 和 `common` 源代码集的代码也将[编译](compilation)到 `watchosArm64`。

你可以在[文档](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-hierarchy.html#default-hierarchy-template)中找到默认目标层次结构的完整方案。

> 在此示例中，`apple` 和 `native` 源代码集仅[编译](compilation)到 `iosArm64` 和 `iosSimulatorArm64` 目标平台。
> 因此，尽管名称如此，它们仍可访问完整的 iOS API。
> 这对于像 `native` 这样的源代码集来说可能有些反直觉，因为你可能期望只有在所有[原生](native)目标平台上可用的 API 才能在此源代码集中访问。
> 此行为在未来可能会改变。
>
{style="note"}

#### 为何取代快捷方式 {initial-collapse-state="collapsed" collapsible="true"}

创建源代码集层次结构可能冗长、容易出错且对初学者不友好。我们之前的解决方案是引入像 `ios` 这样的快捷方式，它们为你创建了部分层次结构。
然而，事实证明，使用快捷方式存在一个巨大的设计缺陷：它们难以更改。

以 `ios` 快捷方式为例。它只创建 `iosArm64` 和 `iosX64` 目标平台，这可能会令人困惑，并在需要 `iosSimulatorArm64` 目标平台的基于 M1 的主机上工作时导致问题。
然而，添加 `iosSimulatorArm64` 目标平台对用户[项目](project)来说可能是一个非常具有破坏性的更改：

* 在 `iosMain` 源代码集中使用的所有[依赖项](dependency)都必须支持 `iosSimulatorArm64` 目标平台；否则，[依赖项](dependency)解析将失败。
* 添加新目标平台时，`iosMain` 中使用的一些[原生](native) API 可能会消失（尽管在 `iosSimulatorArm64` 的情况下不太可能）。
* 在某些情况下，例如在你的基于 Intel 的 MacBook 上编写一个小型宠物[项目](project)时，你甚至可能不需要此更改。

很明显，快捷方式并未解决配置层次结构的问题，这就是我们停止添加新快捷方式的原因。

默认目标层次结构乍看起来可能与快捷方式相似，但它们有一个关键区别：**用户必须[显式](explicit)指定目标平台集**。
此集合[定义](define)了你的[项目](project)如何[编译](compilation)和发布，以及它如何参与[依赖项](dependency)解析。
由于此集合是固定的，因此 Kotlin Gradle 插件的默认配置更改应该会显著减少生态系统中的困扰，并且提供工具辅助迁移将变得更加容易。

#### 如何启用默认层次结构

这项新[特性](feature)是[实验性的](components-stability.md#stability-levels-explained)。对于 Kotlin Gradle [构建](build)脚本，
你需要选择启用 `@OptIn(ExperimentalKotlinGradlePluginApi::class)`。

有关更多信息，请参见[分层项目结构](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-hierarchy.html#default-hierarchy-template)。

#### 留下反馈

这是多平台[项目](project)的一项重大变更。我们非常感谢你的[反馈](https://kotl.in/issue)，以帮助我们做得更好。

### Kotlin Multiplatform 中 Gradle 复合构建支持的预览

> 自 Kotlin Gradle Plugin 1.8.20 起，此[特性](feature)已在 Gradle [构建](build)中得到支持。对于 IDE 支持，请使用 IntelliJ IDEA
> 2023.1 Beta 2 (231.8109.2) 或更高版本，以及带有任何 Kotlin IDE 插件的 Kotlin Gradle 插件 1.8.20。
>
{style="note"}

从 1.8.20 开始，Kotlin Multiplatform 支持 [Gradle 复合构建](https://docs.gradle.org/current/userguide/composite_builds.html)。
复合构建允许你将独立[项目](project)或同一[项目](project)部分的[构建](build)包含到单个[构建](build)中。

由于一些技术挑战，Kotlin Multiplatform 对 Gradle 复合构建的支持一直不完整。
Kotlin 1.8.20 包含了改进支持的预览版，该版本应该适用于更广泛的[项目](project)类型。
要试用它，请将以下选项添加到你的 `gradle.properties` 中：

```none
kotlin.mpp.import.enableKgpDependencyResolution=true
```

此选项启用了新导入模式的预览。除了对复合[构建](build)的支持外，它还提供了更流畅的多平台[项目](project)导入体验，
因为我们包含了主要的错误修复和改进，以使导入更加稳定。

#### 已知问题

它仍然是一个需要进一步稳定的预览版本，你在导入过程中可能会遇到一些问题。以下是我们计划在 Kotlin 1.8.20 最终发布之前修复的一些已知问题：

* 目前还没有适用于 IntelliJ IDEA 2023.1 EAP 的 Kotlin 1.8.20 插件。尽管如此，你仍然可以将 Kotlin Gradle 插件版本设置为 1.8.20 并在该 IDE 中试用复合[构建](build)。
* 如果你的[项目](project)包含带有指定 `rootProject.name` 的[构建](build)，复合[构建](build)可能无法解析 Kotlin 元数据。有关解决方法和详细信息，请参见此 [Youtrack 问题](https://youtrack.jetbrains.com/issue/KT-56536)。

我们鼓励你试用此特性，并在 [YouTrack](https://kotl.in/issue) 上提交所有报告，以帮助我们在 Kotlin 1.9.0 中将其设为默认。

### 改进了 Xcode 中 Gradle 错误的输出

如果你在 Xcode 中[构建](build)多平台[项目](project)时遇到问题，你可能会遇到“Command PhaseScriptExecution failed with a nonzero exit code”错误。
此消息表明 Gradle 调用失败，但在尝试检测问题时帮助不大。

从 Kotlin 1.8.20 开始，Xcode 可以解析 Kotlin/Native 编译器的输出。此外，如果 Gradle [构建](build)失败，你将在 Xcode 中看到来自根本原因异常的附加错误消息。在大多数情况下，
这将有助于识别根本问题。

![Improved output for Gradle errors in Xcode](xcode-gradle-output.png){width=700}

新行为默认对用于 Xcode 集成的标准 Gradle [任务](task)启用，
例如 `embedAndSignAppleFrameworkForXcode`，它可将多平台[项目](project)中的 iOS framework 连接到 Xcode 中的 iOS [应用程序](application)。
它也可以通过 `kotlin.native.useXcodeMessageStyle` Gradle 属性启用（或禁用）。

## Kotlin/JavaScript

Kotlin 1.8.20 改变了 TypeScript [定义](definition)的生成方式。它还包括一项旨在改善你的调试体验的更改：

* [从 Gradle 插件中移除 Dukat 集成](#removal-of-dukat-integration-from-gradle-plugin)
* [源代码映射中的 Kotlin 变量和函数名称](#kotlin-variable-and-function-names-in-source-maps)
* [选择启用 TypeScript 定义文件的生成](#opt-in-for-generation-of-typescript-definition-files)

### 从 Gradle 插件中移除 Dukat 集成

在 Kotlin 1.8.20 中，我们已将[实验性](components-stability.md#stability-levels-explained) Dukat
集成从 Kotlin/JavaScript Gradle 插件中移除。Dukat 集成支持将 TypeScript [声明](declaration)文件 (`.d.ts`) 自动转换为 Kotlin 外部[声明](declaration)。

你仍然可以使用我们的 [Dukat 工具](https://github.com/Kotlin/dukat)将 TypeScript [声明](declaration)文件 (`.d.ts`) 转换为 Kotlin 外部[声明](declaration)。

> Dukat 工具是[实验性的](components-stability.md#stability-levels-explained)。
> 它可能随时被删除或更改。
>
{style="warning"}

### 源代码映射中的 Kotlin 变量和函数名称

为了帮助调试，我们引入了将你在 Kotlin 代码中为变量和[函数](function)[声明](declare)的名称添加到源代码映射中的功能。
在 1.8.20 之前，这些名称在源代码映射中不可用，因此在调试器中，你总是看到生成的 JavaScript 的变量和[函数](function)名称。

你可以通过在 Gradle 文件 `build.gradle.kts` 中使用 `sourceMapNamesPolicy` 或
`-source-map-names-policy` 编译器选项来配置要添加的内容。下表列出了可能的设置：

| 设置                 | 描述                                                   | 示例输出                    |
|-------------------------|---------------------------------------------------------------|-----------------------------------|
| `simple-names`          | 添加变量名称和简单的函数名称。（默认） | `main`                            |
| `fully-qualified-names` | 添加变量名称和完全限定的函数名称。  | `com.example.kjs.playground.main` |
| `no`                    | 不添加变量或函数名称。                      | 不适用 |

请参见 `build.gradle.kts` 文件中的示例配置：

```kotlin
tasks.withType<org.jetbrains.kotlin.gradle.tasks.Kotlin2JsCompile>().configureEach {
    compilercompileOptions.sourceMapNamesPolicy.set(org.jetbrains.kotlin.gradle.dsl.JsSourceMapNamesPolicy.SOURCE_MAP_NAMES_POLICY_FQ_NAMES) // or SOURCE_MAP_NAMES_POLICY_NO, or SOURCE_MAP_NAMES_POLICY_SIMPLE_NAMES
}
```
{validate="false"}

基于 Chromium 的浏览器中提供的调试工具可以从你的源代码映射中获取原始 Kotlin 名称，以提高堆栈跟踪的可读性。祝你调试愉快！

> 源代码映射中添加变量和[函数](function)名称是[实验性的](components-stability.md#stability-levels-explained)。
> 它可能随时被删除或更改。
>
{style="warning"}

### 选择启用 TypeScript 定义文件的生成

以前，如果你有一个生成可执行文件 (`binaries.executable()`) 的[项目](project)，Kotlin/JS IR 编译器会收集任何带有 `@JsExport` 标记的[顶层](top-level)[声明](declaration)，并自动在 `.d.ts` 文件中生成 TypeScript [定义](definition)。

由于这并非对每个[项目](project)都适用，因此我们在 Kotlin 1.8.20 中更改了行为。如果你想生成 TypeScript [定义](definition)，你必须在 Gradle [构建](build)文件中[显式](explicit)配置此项。
将 `generateTypeScriptDefinitions()` 添加到你的 `build.gradle.kts.file` 中[`js` 部分](js-project-setup.md#execution-environments)。例如：

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

> TypeScript [定义](definition) (`d.ts`) 的生成是[实验性的](components-stability.md#stability-levels-explained)。它可能随时被删除或更改。
>
{style="warning"}

## Gradle

Kotlin 1.8.20 完全兼容 Gradle 6.8 到 7.6 版本，除了[多平台插件中的一些特殊情况](https://youtrack.jetbrains.com/issue/KT-55751)。
你也可以使用最新的 Gradle 版本，但如果你这样做，
请记住你可能会遇到弃用警告或某些新的 Gradle [特性](feature)可能无法工作。

此版本带来了以下更改：

* [Gradle 插件版本新对齐方式](#new-gradle-plugins-versions-alignment)
* [Gradle 中默认启用新的 JVM 增量编译](#new-jvm-incremental-compilation-by-default-in-gradle)
* [编译任务输出的精确备份](#precise-backup-of-compilation-tasks-outputs)
* [所有 Gradle 版本都可延迟创建 Kotlin/JVM 任务](#lazy-kotlin-jvm-tasks-creation-for-all-gradle-versions)
* [编译任务 destinationDirectory 的非默认位置](#non-default-location-of-compile-tasks-destinationdirectory)
* [选择退出向 HTTP 统计服务报告编译器实参的能力](#ability-to-opt-out-from-reporting-compiler-arguments-to-an-http-statistics-service)

### Gradle 插件版本新对齐方式

Gradle 提供了一种方法来确保必须协同工作的[依赖项](dependency)在其版本上始终[对齐](https://docs.gradle.org/current/userguide/dependency_version_alignment.html#aligning_versions_natively_with_gradle)。
Kotlin 1.8.20 也采用了这种方法。它默认工作，因此你无需更改或更新配置即可启用它。
此外，你不再需要通过[此变通方法来解决 Kotlin Gradle 插件的传递依赖项](whatsnew18.md#resolution-of-kotlin-gradle-plugins-transitive-dependencies)。

我们非常感谢你在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-54691) 上对此特性提供反馈。

### Gradle 中默认启用新的 JVM 增量编译

增量[编译](compilation)的新方法（[自 Kotlin 1.7.0 起可用](whatsnew17.md#a-new-approach-to-incremental-compilation)）现在默认工作。
你不再需要在 `gradle.properties` 中指定 `kotlin.incremental.useClasspathSnapshot=true` 来启用它。

我们非常感谢你对此的反馈。你可以在 YouTrack 中[提交一个问题](https://kotl.in/issue)。

### 编译任务输出的精确备份

> 编译任务输出的精确备份是[实验性的](components-stability.md#stability-levels-explained)。
> 要使用它，请将 `kotlin.compiler.preciseCompilationResultsBackup=true` 添加到 `gradle.properties` 中。
> 我们非常感谢你在 [YouTrack](https://kotl.in/issue/experimental-ic-optimizations) 上对此提供反馈。
>
{style="warning"}

从 Kotlin 1.8.20 开始，你可以启用精确备份，只有 Kotlin 在[增量编译](gradle-compilation-and-caches.md#incremental-compilation)中重新[编译](compilation)的类才会被备份。
完整备份和精确备份都有助于在[编译](compilation)错误后再次增量运行[构建](build)。精确备份还可以节省[构建](build)时间。
在大型[项目](project)中，或者如果许多[任务](task)正在进行备份，完整备份可能会花费**显著的**[构建](build)时间，特别是当[项目](project)位于慢速 HDD 上时。

这项优化是实验性的。你可以通过将 `kotlin.compiler.preciseCompilationResultsBackup` Gradle 属性添加到 `gradle.properties` 文件中来启用它：

```none
kotlin.compiler.preciseCompilationResultsBackup=true
```

#### JetBrains 中精确备份用法的示例 {initial-collapse-state="collapsed" collapsible="true"}

在下面的图表中，你可以看到与完整备份相比使用精确备份的示例：

![Comparison of full and precise backups](comparison-of-full-and-precise-backups.png){width=700}

第一个和第二个图表显示了 Kotlin [项目](project)中精确备份如何影响 Kotlin Gradle 插件的[构建](build)：

1. 在对许多模块[依赖项](dependency)的模块进行小的 [ABI](https://en.wikipedia.org/wiki/Application_binary_interface) 更改（添加一个新的公共[方法](method)）之后。
2. 在对没有其他模块[依赖项](dependency)的模块进行小的非 ABI 更改（添加一个私有[函数](function)）之后。

第三个图表显示了在 [Space](https://www.jetbrains.com/space/) [项目](project)中，在对许多模块[依赖项](dependency)的 Kotlin/JS 模块进行小的非 ABI 更改（添加一个私有[函数](function)）之后，精确备份如何影响 Web 前端的[构建](build)。

这些测量是在配备 Apple M1 Max CPU 的计算机上进行的；不同的计算机将产生略有不同的结果。影响性能的因素包括但不限于：

* [Kotlin daemon](gradle-compilation-and-caches.md#the-kotlin-daemon-and-how-to-use-it-with-gradle) 和 [Gradle daemon](https://docs.gradle.org/current/userguide/gradle_daemon.html) 的“预热”程度。
* 磁盘的速度。
* CPU 型号及其繁忙程度。
* 哪些模块受更改影响以及这些模块的大小。
* 更改是 ABI 还是非 ABI。

#### 使用构建报告评估优化 {initial-collapse-state="collapsed" collapsible="true"}

要估算优化对你的计算机在你的[项目](project)和场景中的影响，
你可以使用 [Kotlin [构建](build)报告](gradle-compilation-and-caches.md#build-reports)。
通过将以下属性添加到你的 `gradle.properties` 文件中，启用文本文件格式的报告：

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
  Backup output: 0.22 s // Pay attention to this number 
<...>
```

以下是启用精确备份后报告相关部分的示例：

```none
Task ':kotlin-gradle-plugin:compileCommonKotlin' finished in 0.46 s
<...>
Time metrics:
 Total Gradle task time: 0.46 s
 Task action before worker execution: 0.07 s
  Backup output: 0.05 s // The time has reduced
 Run compilation in Gradle worker: 0.32 s
  Clear jar cache: 0.00 s
  Precise backup output: 0.00 s // Related to precise backup
  Cleaning up the backup stash: 0.00 s // Related to precise backup
<...>
```

### 所有 Gradle 版本都可延迟创建 Kotlin/JVM 任务

对于在 Gradle 7.3+ 上使用 `org.jetbrains.kotlin.gradle.jvm` 插件的[项目](project)，Kotlin Gradle 插件不再急切地创建和配置[任务](task) `compileKotlin`。
在较低的 Gradle 版本上，它只是注册所有[任务](task)并且在空运行时不配置它们。
现在在使用 Gradle 7.3+ 时也存在相同的行为。

### 编译任务 destinationDirectory 的非默认位置

如果执行以下任一操作，请更新你的[构建](build)脚本并添加一些额外的代码：

* [覆盖](override) Kotlin/JVM `KotlinJvmCompile`/`KotlinCompile` [任务](task)的 `destinationDirectory` 位置。
* 使用已弃用的 Kotlin/JS/Non-IR [变体](gradle-plugin-variants.md)并[覆盖](override) `Kotlin2JsCompile` [任务](task)的 `destinationDirectory`。

你需要在 JAR 文件中将 `sourceSets.main.kotlin.classesDirectories` [显式](explicit)添加到 `sourceSets.main.outputs`：

```groovy
tasks.jar(type: Jar) {
    from sourceSets.main.outputs
    from sourceSets.main.kotlin.classesDirectories
}
```

### 选择退出向 HTTP 统计服务报告编译器实参的能力

你现在可以控制 Kotlin Gradle 插件是否应在 HTTP [构建](build)报告中包含编译器[实参](argument)。
有时，你可能不需要插件报告这些[实参](argument)。如果一个[项目](project)包含许多模块，
报告中的编译器[实参](argument)可能会非常庞大且帮助不大。现在有一种方法可以禁用它，从而节省内存。
在你的 `gradle.properties` 或 `local.properties` 中，使用 `kotlin.build.report.include_compiler_arguments=(true|false)` 属性。

我们非常感谢你在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-55323/) 上对此特性提供反馈。

## 标准库

Kotlin 1.8.20 添加了各种新的[特性](feature)，其中包括一些对 Kotlin/Native 开发特别有用的[特性](feature)：

* [支持 AutoCloseable 接口](#support-for-the-autocloseable-interface)
* [支持 Base64 编码和解码](#support-for-base64-encoding)
* [支持 Kotlin/Native 中的 @Volatile](#support-for-volatile-in-kotlin-native)
* [修复 Kotlin/Native 中使用正则表达式时的堆栈溢出错误](#bug-fix-for-stack-overflow-when-using-regex-in-kotlin-native)

### 支持 AutoCloseable 接口

> 新的 `AutoCloseable` 接口是[实验性的](components-stability.md#stability-levels-explained)，要使用它，
> 你需要选择启用 `@OptIn(ExperimentalStdlibApi::class)` 或编译器[实参](argument) `-opt-in=kotlin.ExperimentalStdlibApi`。
>
{style="warning"}

`AutoCloseable` 接口已添加到公共标准库中，以便你可以使用一个通用的接口来关闭所有库的资源。
在 Kotlin/JVM 中，`AutoCloseable` 接口是 [`java.lang.AutoClosable`](https://docs.oracle.com/javase/8/docs/api/java/lang/AutoCloseable.html) 的别名。

此外，现在包含[扩展](extension)[函数](function) `use()`，它在选定的资源上执行给定的代码块[函数](function)，
然后正确关闭它，无论是否抛出异常。

公共标准库中没有实现 `AutoCloseable` 接口的公共类。在下面的示例中，我们[定义](define)了 `XMLWriter` 接口，并假设存在实现它的资源。
例如，此资源可能是一个打开文件、写入 XML 内容然后关闭它的类。

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

> 新的编码和解码[功能](functionality)是[实验性的](components-stability.md#stability-levels-explained)，
> 要使用它，你需要选择启用 `@OptIn(ExperimentalEncodingApi::class)` 或编译器[实参](argument) `-opt-in=kotlin.io.encoding.ExperimentalEncodingApi`。
>
{style="warning"}

我们已添加对 Base64 编码和解码的支持。我们提供了 3 个类实例，每个实例使用不同的编码方案并显示不同的行为。
使用 `Base64.Default` 实例用于标准 [Base64 编码方案](https://www.rfc-editor.org/rfc/rfc4648#section-4)。

使用 `Base64.UrlSafe` 实例用于[“URL 和文件名安全”](https://www.rfc-editor.org/rfc/rfc4648#section-5)编码方案。

使用 `Base64.Mime` 实例用于 [MIME](https://www.rfc-editor.org/rfc/rfc2045#section-6.8) 编码方案。
当你使用 `Base64.Mime` 实例时，所有编码[函数](function)每隔 76 个字符会插入一个行分隔符。
在解码的情况下，任何非法字符都会被跳过，并且不会抛出异常。

> `Base64.Default` 实例是 `Base64` 类的伴生对象。因此，你可以通过 `Base64.encode()` 和 `Base64.decode()` 调用其[函数](function)，而不是 `Base64.Default.encode()` 和 `Base64.Default.decode()`。
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

你可以使用附加[函数](function)将字节编码或解码到现有缓冲区中，以及将编码结果附加到提供的 `Appendable` 类型对象。

在 Kotlin/JVM 中，我们还添加了[扩展](extension)[函数](function) `encodingWith()` 和 `decodingWith()`，使你能够使用输入和输出流执行 Base64 编码和解码。

### 支持 Kotlin/Native 中的 @Volatile

> Kotlin/Native 中的 `@Volatile` 是[实验性的](components-stability.md#stability-levels-explained)。
> 它可能随时被删除或更改。需要选择启用（详见下文）。
> 仅用于评估目的。我们非常感谢你在 [YouTrack](https://kotl.in/issue) 上对此提供反馈。
>
{style="warning"}

如果你用 `@Volatile` 注解一个 `var` 属性，那么[幕后字段](backing field)会被标记，
使得对该字段的任何读取或写入都是原子的，并且写入始终对其他线程可见。

在 1.8.20 之前，[`kotlin.jvm.Volatile` 注解](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-volatile/)在公共标准库中可用。
然而，此注解仅在 JVM 中有效。如果你在 Kotlin/Native 中使用它，它将被忽略，这可能导致错误。

在 1.8.20 中，我们引入了一个通用注解 `kotlin.concurrent.Volatile`，你可以在 JVM 和 Kotlin/Native 中使用它。

#### 如何启用

要试用这项特性，请选择启用 `@OptIn(ExperimentalStdlibApi)` 并启用 `-language-version 1.9` 编译器选项。
在 Gradle [项目](project)中，你可以通过将以下内容添加到你的 `build.gradle(.kts)` 文件中来完成：

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

### 修复 Kotlin/Native 中使用正则表达式时的堆栈溢出错误

在 Kotlin 的早期版本中，如果你的正则表达式输入包含大量字符，即使正则表达式模式非常简单，也可能发生崩溃。
在 1.8.20 中，此问题已得到解决。
有关更多信息，请参见 [KT-46211](https://youtrack.jetbrains.com/issue/KT-46211)。

## 序列化更新

Kotlin 1.8.20 附带了[对 Kotlin K2 编译器的 Alpha 支持](#prototype-serialization-compiler-plugin-for-kotlin-k2-compiler)
并[禁止通过伴生对象进行序列化器定制](#prohibit-implicit-serializer-customization-via-companion-object)。

### 适用于 Kotlin K2 编译器的原型序列化编译器插件

> 对 K2 序列化编译器插件的支持处于 [Alpha](components-stability.md#stability-levels-explained) 阶段。
> 要使用它，请[启用 Kotlin K2 编译器](#how-to-enable-the-kotlin-k2-compiler)。
>
{style="warning"}

从 1.8.20 开始，序列化编译器插件可与 Kotlin K2 编译器配合使用。
试一试，并[与我们分享你的反馈](#leave-your-feedback-on-the-new-k2-compiler)！

### 禁止通过伴生对象进行隐式序列化器定制

目前，可以使用 `@Serializable` 注解将类[声明](declare)为可序列化，同时使用 `@Serializer` 注解在其伴生对象上[声明](declare)自定义序列化器。

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

在这种情况下，从 `@Serializable` 注解中不清楚使用了哪个序列化器。实际上，类 `Foo` 有一个自定义序列化器。

为了防止这种混淆，在 Kotlin 1.8.20 中，我们引入了一个编译器警告，用于检测此场景。
该警告包含一个可能的迁移路径来解决此问题。

如果你在代码中使用了此类构造，我们建议将其更新为以下形式：

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

通过这种方法，很明显 `Foo` 类使用了在伴生对象中[声明](declare)的自定义序列化器。
有关更多信息，请参见我们的 [YouTrack 工单](https://youtrack.jetbrains.com/issue/KT-54441)。

> 在 Kotlin 2.0 中，我们计划将编译警告提升为编译器错误。
> 如果你看到此警告，我们建议你迁移代码。
>
{style="tip"}

## 文档更新

Kotlin 文档已收到一些显著的更改：

* [Spring Boot 和 Kotlin 入门](jvm-get-started-spring-boot.md) – 创建一个带有数据库的简单[应用程序](application)，并了解更多关于 Spring Boot 和 Kotlin [特性](feature)的信息。
* [作用域函数](scope-functions.md) – 了解如何使用标准库中有用的[作用域函数](scope-functions.md)来简化你的代码。
* [CocoaPods 集成](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-cocoapods-overview.html) – 设置一个环境来使用 CocoaPods。

## 安装 Kotlin 1.8.20

### 检测 IDE 版本

[IntelliJ IDEA](https://www.jetbrains.com/idea/download/) 2022.2 和 2022.3 会自动建议将 Kotlin 插件更新到 1.8.20 版本。
IntelliJ IDEA 2023.1 内置了 Kotlin 插件 1.8.20。

Android Studio Flamingo (222) 和 Giraffe (223) 将在下一版本中支持 Kotlin 1.8.20。

新的命令行编译器可在 [GitHub 发布页面](https://github.com/JetBrains/kotlin/releases/tag/v1.8.20)下载。

### 配置 Gradle 设置

为了正确下载 Kotlin [构件](artifact)和[依赖项](dependency)，请更新你的 `settings.gradle(.kts)` 文件
以使用 Maven Central [仓库](repository)：

```kotlin
pluginManagement {
    repositories {
        mavenCentral()
        gradlePluginPortal()
    }
}
```

如果未指定[仓库](repository)，Gradle 将使用已淘汰的 JCenter [仓库](repository)，这可能导致 Kotlin [构件](artifact)相关问题。