[//]: # (title: Kotlin 1.8.20 最新变化)

<web-summary>阅读 Kotlin 1.8.20 发布说明，涵盖新的语言功能、Kotlin 多平台、JVM、Native、JS 和 Wasm 的更新，以及 Gradle 和 Maven 的构建工具支持。</web-summary>

_[发布日期：2023 年 4 月 25 日](releases.md#release-history)_

Kotlin 1.8.20 版本已发布，以下是其一些重磅亮点：

* [新的 Kotlin K2 编译器更新](#new-kotlin-k2-compiler-updates)
* [新的实验性 Kotlin/Wasm 目标](#new-kotlin-wasm-target)
* [Gradle 中默认启用新的 JVM 增量编译](#new-jvm-incremental-compilation-by-default-in-gradle)
* [Kotlin/Native 目标更新](#update-for-kotlin-native-targets)
* [Kotlin 多平台中 Gradle 复合构建的预览](#preview-of-gradle-composite-builds-support-in-kotlin-multiplatform)
* [改进了 Xcode 中的 Gradle 错误输出](#improved-output-for-gradle-errors-in-xcode)
* [标准库中对 AutoCloseable 接口的实验性支持](#support-for-the-autocloseable-interface)
* [标准库中对 Base64 编码的实验性支持](#support-for-base64-encoding)

您也可以在此视频中找到这些变化的简短概述：

<video src="https://www.youtube.com/v/R1JpkpPzyBU" title="Kotlin 1.8.20 最新变化"/>

> 有关 Kotlin 发布周期的信息，请参阅 [Kotlin 发布过程](releases.md)。
>
{style="tip"}

## IDE 支持

支持 1.8.20 的 Kotlin 插件适用于：

| IDE            | 支持的版本                        |
|----------------|-------------------------------|
| IntelliJ IDEA  | 2022.2.x, 2022.3.x,  2023.1.x |
| Android Studio | Flamingo (222)                |

> 为了正确下载 Kotlin 构件和依赖项，请[配置 Gradle 设置](#configure-gradle-settings)以使用 Maven Central 仓库。
>
{style="warning"}

## 新的 Kotlin K2 编译器更新

Kotlin 团队继续稳定 K2 编译器。正如在 [Kotlin 1.7.0 发布公告](whatsnew17.md#new-kotlin-k2-compiler-for-the-jvm-in-alpha)中提到的，它目前仍处于 **Alpha** 阶段。此版本在通往 [K2 Beta](https://youtrack.jetbrains.com/issue/KT-52604) 的道路上引入了进一步的改进。

从 1.8.20 版本开始，Kotlin K2 编译器：

* 拥有序列化插件的预览版本。
* 为 [JS IR 编译器](js-ir-compiler.md)提供 Alpha 支持。
* 引入了未来的[新语言版本 Kotlin 2.0](https://blog.jetbrains.com/kotlin/2023/02/k2-kotlin-2-0/)。

在以下视频中详细了解新编译器及其优势：

* [每个人都必须了解的关于新 Kotlin K2 编译器的信息](https://www.youtube.com/watch?v=iTdJJq_LyoY)
* [新 Kotlin K2 编译器：专家评论](https://www.youtube.com/watch?v=db19VFLZqJM)

### 如何启用 Kotlin K2 编译器

要启用并测试 Kotlin K2 编译器，请使用以下编译器选项指定新的语言版本：

```bash
-language-version 2.0
```

您可以在 `build.gradle(.kts)` 文件中指定它：

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

> 新 K2 编译器的 Alpha 版本仅适用于 JVM 和 JS IR 项目。它目前尚不支持 Kotlin/Native 或任何多平台项目。
>
{style="warning"}

### 留下您对新 K2 编译器的反馈

我们非常感谢您的任何反馈！

* 在 Kotlin Slack 上直接向 K2 开发者提供您的反馈——[获取邀请](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up?_gl=1*ju6cbn*_ga*MTA3MTk5NDkzMC4xNjQ2MDY3MDU4*_ga_9J976DJZ68*MTY1ODMzNzA3OS4xMDAuMS4xNjU4MzQwODEwLjYw)并加入 [#k2-early-adopters](https://kotlinlang.slack.com/archives/C03PK0PE257) 频道。
* 在[我们的问题跟踪器](https://kotl.in/issue)上报告您在使用新 K2 编译器时遇到的任何问题。
* [启用 **发送使用情况统计信息** 选项](https://www.jetbrains.com/help/idea/settings-usage-statistics.html)，允许 JetBrains 收集有关 K2 使用情况的匿名数据。

## 语言

随着 Kotlin 的不断发展，我们在 1.8.20 中为新的语言功能引入了预览版本：

* [枚举类 values 函数的一种现代且高效的替代方案](#a-modern-and-performant-replacement-of-the-enum-class-values-function)
* [与数据类对称的数据对象](#preview-of-data-objects-for-symmetry-with-data-classes)
* [取消对内联类中带主体的次构造函数的限制](#preview-of-lifting-restriction-on-secondary-constructors-with-bodies-in-inline-classes)

### 枚举类 values 函数的一种现代且高效的替代方案

> 此功能是[实验性的](components-stability.md#stability-levels-explained)。它可能随时被删除或更改。需要启用 (Opt-in)（详情见下文）。仅用于评估目的。我们感谢您在 [YouTrack](https://kotl.in/issue) 上提供的反馈。
>
{style="warning"}

枚举类具有一个合成的 `values()` 函数，该函数返回定义的枚举常量数组。然而，使用数组可能会在 Kotlin 和 Java 中导致[隐藏的性能问题](https://github.com/Kotlin/KEEP/blob/master/proposals/enum-entries.md#examples-of-performance-issues)。此外，大多数 API 使用集合，这最终需要进行转换。为了解决这些问题，我们为枚举类引入了 `entries` 属性，应该使用它来替代 `values()` 函数。调用时，`entries` 属性会返回一个预先分配的、由定义的枚举常量组成的不可变列表。

> `values()` 函数仍然受支持，但我们建议您改用 `entries` 属性。
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

要尝试此功能，请通过 `@OptIn(ExperimentalStdlibApi)` 进行启用，并启用 `-language-version 1.9` 编译器选项。在 Gradle 项目中，您可以通过在 `build.gradle(.kts)` 文件中添加以下内容来实现：

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

> 从 IntelliJ IDEA 2023.1 开始，如果您已启用此功能，相应的 IDE 检查将通知您从 `values()` 转换为 `entries` 并提供快速修复。
>
{style="tip"}

有关该提案的更多信息，请参阅 [KEEP 说明](https://github.com/Kotlin/KEEP/blob/master/proposals/enum-entries.md)。

### 与数据类对称的数据对象预览

数据对象允许您声明具有单例语义和整洁 `toString()` 表示的对象。在此代码片段中，您可以看到将 `data` 关键字添加到对象声明中如何提高其 `toString()` 输出的可读性：

```kotlin
package org.example
object MyObject
data object MyDataObject

fun main() {
    println(MyObject) // org.example.MyObject@1f32e575
    println(MyDataObject) // MyDataObject
}
```

特别是对于 `sealed` 层次结构（如 `sealed class` 或 `sealed interface` 层次结构），`data objects` 是极佳的选择，因为它们可以方便地与 `data class` 声明一起使用。在此代码片段中，将 `EndOfFile` 声明为 `data object` 而不是普通 `object`，意味着它将获得美观的 `toString` 而无需手动重写。这保持了与伴随的数据类定义之间的对称性。

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

自其在 [Kotlin 1.7.20](whatsnew1720.md#improved-string-representations-for-singletons-and-sealed-class-hierarchies-with-data-objects) 中的第一个预览版以来，数据对象的语义已经过改进。编译器现在会自动为它们生成一系列便捷函数：

##### toString

数据对象的 `toString()` 函数返回该对象的简单名称：

```kotlin
data object MyDataObject {
    val x: Int = 3
}

fun main() {
    println(MyDataObject) // MyDataObject
}
```

##### equals 和 hashCode

`data object` 的 `equals()` 函数确保所有具有该 `data object` 类型的对象都被视为相等。在大多数情况下，您在运行时只会拥有数据对象的一个实例（毕竟 `data object` 声明的是一个单例）。然而，在运行时生成了另一个相同类型对象的边缘情况下（例如，通过 `java.lang.reflect` 使用平台反射，或者使用在底层调用此 API 的 JVM 序列化库），这可以确保这些对象被视为相等。

请务必仅对 `data objects` 进行结构比较（使用 `==` 运算符），而绝不要进行引用比较（使用 `===` 运算符）。这有助于避免运行时存在多个数据对象实例时的陷阱。以下代码片段说明了这种特定的边缘情况：

```kotlin
import java.lang.reflect.Constructor

data object MySingleton

fun main() {
    val evilTwin = createInstanceViaReflection()

    println(MySingleton) // MySingleton
    println(evilTwin) // MySingleton

    // 即使库强制创建了 MySingleton 的第二个实例，其 `equals` 方法也会返回 true：
    println(MySingleton == evilTwin) // true

    // 不要通过 === 比较数据对象。
    println(MySingleton === evilTwin) // false
}

fun createInstanceViaReflection(): MySingleton {
    // Kotlin 反射不允许实例化数据对象。
    // 这将“强制”创建一个新的 MySingleton 实例（即通过 Java 平台反射）
    // 请不要自己尝试这样做！
    return (MySingleton.javaClass.declaredConstructors[0].apply { isAccessible = true } as Constructor<MySingleton>).newInstance()
}
```

生成的 `hashCode()` 函数的行为与 `equals()` 函数保持一致，因此 `data object` 的所有运行时实例都具有相同的哈希码。

##### 数据对象不提供 copy 和 componentN 函数

虽然 `data object` 和 `data class` 声明经常一起使用且具有一些相似之处，但有些函数不会为 `data object` 生成：

由于 `data object` 声明旨在作为单例对象使用，因此不会生成 `copy()` 函数。单例模式限制一个类仅能有一个实例，允许创建实例的副本将违反该限制。

此外，与 `data class` 不同，`data object` 没有任何数据属性。由于尝试析构此类对象没有意义，因此不会生成 `componentN()` 函数。

我们感谢您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-4107) 上对该功能的反馈。

#### 如何启用数据对象预览

要尝试此功能，请启用 `-language-version 1.9` 编译器选项。在 Gradle 项目中，您可以通过在 `build.gradle(.kts)` 文件中添加以下内容来实现：

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

### 取消对内联类中带主体的次构造函数的限制预览

> 此功能是[实验性的](components-stability.md#stability-levels-explained)。它可能随时被删除或更改。需要启用 (Opt-in)（详情见下文）。仅用于评估目的。我们感谢您在 [YouTrack](https://kotl.in/issue) 上提供的反馈。
>
{style="warning"}

Kotlin 1.8.20 取消了对[内联类](inline-classes.md)中使用带主体次构造函数的限制。

内联类过去仅允许一个不带 `init` 块的公共主构造函数，或者不允许次构造函数拥有明确的初始化语义。结果，无法封装底层值，也无法创建代表某些受限值的内联类。

这些问题在 Kotlin 1.4.30 取消对 `init` 块的限制时得到了修复。现在我们更进一步，在预览模式下允许带主体的次构造函数：

```kotlin
@JvmInline
value class Person(private val fullName: String) {
    // 自 Kotlin 1.4.30 起允许：
    init { 
        check(fullName.isNotBlank()) {
            "Full name shouldn't be empty"
        }
    }

    // 自 Kotlin 1.8.20 起提供预览：
    constructor(name: String, lastName: String) : this("$name $lastName") {
        check(lastName.isNotBlank()) {
            "Last name shouldn't be empty"
        }
    }
}
```

#### 如何启用带主体的次构造函数

要尝试此功能，请启用 `-language-version 1.9` 编译器选项。在 Gradle 项目中，您可以通过在 `build.gradle(.kts)` 中添加以下内容来实现：

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

我们鼓励您尝试此功能，并在 [YouTrack](https://kotl.in/issue) 中提交所有报告，以帮助我们使其在 Kotlin 1.9.0 中成为默认行为。

在[此 KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/inline-classes.md) 中详细了解 Kotlin 内联类的发展。

## 新的 Kotlin/Wasm 目标

Kotlin/Wasm (Kotlin WebAssembly) 在此版本中进入[实验性 (Experimental)](components-stability.md#stability-levels-explained) 阶段。Kotlin 团队认为 [WebAssembly](https://webassembly.org/) 是一项非常有前途的技术，并希望为您找到更好的使用方式，以获得 Kotlin 的所有优势。

WebAssembly 二进制格式与平台无关，因为它运行在自己的虚拟机上。几乎所有现代浏览器都已经支持 WebAssembly 1.0。要设置运行 WebAssembly 的环境，您只需要启用 Kotlin/Wasm 目标所需的实验性垃圾回收模式。您可以在此处找到详细说明：[如何启用 Kotlin/Wasm](#how-to-enable-kotlin-wasm)。

我们要强调新的 Kotlin/Wasm 目标的以下优势：

* 与 `wasm32` Kotlin/Native 目标相比，编译速度更快，因为 Kotlin/Wasm 不需要使用 LLVM。
* 得益于 [Wasm 垃圾回收](https://github.com/WebAssembly/gc)，与 JS 的互操作性更容易，与浏览器的集成也更方便（相较于 `wasm32` 目标）。
* 由于 Wasm 具有紧凑且易于解析的字节码，因此与 Kotlin/JS 和 JavaScript 相比，应用程序启动速度可能更快。
* 由于 Wasm 是一种静态类型语言，因此与 Kotlin/JS 和 JavaScript 相比，应用程序运行性能有所提高。

从 1.8.20 版本开始，您可以在实验性项目中使用 Kotlin/Wasm。我们开箱即用地为 Kotlin/Wasm 提供了 Kotlin 标准库 (`stdlib`) 和测试库 (`kotlin.test`)。IDE 支持将在未来的版本中添加。

[在 YouTube 视频中了解更多关于 Kotlin/Wasm 的信息](https://www.youtube.com/watch?v=-pqz9sKXatw)。

### 如何启用 Kotlin/Wasm

要启用并测试 Kotlin/Wasm，请更新您的 `build.gradle.kts` 文件：

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

要运行 Kotlin/Wasm 项目，您需要更新目标环境的设置：

<tabs>
<tab title="Chrome">

* 对于版本 109：

  使用 `--js-flags=--experimental-wasm-gc` 命令行参数运行应用程序。

* 对于版本 110 或更高版本：

    1. 在浏览器中访问 `chrome://flags/#enable-webassembly-garbage-collection`。
    2. 启用 **WebAssembly Garbage Collection**。
    3. 重新启动浏览器。

</tab>
<tab title="Firefox">

对于版本 109 或更高版本：

1. 在浏览器中访问 `about:config`。
2. 启用 `javascript.options.wasm_function_references` 和 `javascript.options.wasm_gc` 选项。
3. 重新启动浏览器。

</tab>
<tab title="Edge">

对于版本 109 或更高版本：

使用 `--js-flags=--experimental-wasm-gc` 命令行参数运行应用程序。

</tab>
</tabs>

### 留下您对 Kotlin/Wasm 的反馈

我们非常感谢您的任何反馈！

* 在 Kotlin Slack 上直接向开发者提供反馈——[获取邀请](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up?_gl=1*ju6cbn*_ga*MTA3MTk5NDkzMC4xNjQ2MDY3MDU4*_ga_9J976DJZ68*MTY1ODMzNzA3OS4xMDAuMS4xNjU4MzQwODEwLjYw)并加入 [#webassembly](https://kotlinlang.slack.com/archives/CDFP59223) 频道。
* 在[此 YouTrack 问题](https://youtrack.jetbrains.com/issue/KT-56492)中报告您在使用 Kotlin/Wasm 时遇到的任何问题。

## Kotlin/JVM

Kotlin 1.8.20 引入了 [Java 合成属性引用的预览](#preview-of-java-synthetic-property-references)，并[默认在 kapt 存根生成任务中支持 JVM IR 后端](#support-for-the-jvm-ir-backend-in-kapt-stub-generating-task-by-default)。

### Java 合成属性引用预览

> 此功能是[实验性的](components-stability.md#stability-levels-explained)。它可能随时被删除或更改。仅用于评估目的。我们感谢您在 [YouTrack](https://kotl.in/issue) 上提供的反馈。
>
{style="warning"}

Kotlin 1.8.20 引入了创建 Java 合成属性引用的能力，例如对于以下 Java 代码：

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

Kotlin 始终允许您编写 `person.age`，其中 `age` 是合成属性。现在，您还可以创建对 `Person::age` 和 `person::age` 的引用。同样的功能也适用于 `name`。

```kotlin
val persons = listOf(Person("Jack", 11), Person("Sofie", 12), Person("Peter", 11))
    persons
        // 调用对 Java 合成属性的引用：
        .sortedBy(Person::age)
        // 通过 Kotlin 属性语法调用 Java getter：
        .forEach { person -> println(person.name) }
```
{validate="false"}

#### 如何启用 Java 合成属性引用

要尝试此功能，请启用 `-language-version 1.9` 编译器选项。在 Gradle 项目中，您可以通过在 `build.gradle(.kts)` 中添加以下内容来实现：

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

### kapt 存根生成任务默认支持 JVM IR 后端

在 Kotlin 1.7.20 中，我们引入了[在 kapt 存根生成任务中对 JVM IR 后端的支持](whatsnew1720.md#support-for-the-jvm-ir-backend-in-kapt-stub-generating-task)。从该版本开始，此支持默认生效。您不再需要在 `gradle.properties` 中指定 `kapt.use.jvm.ir=true` 来启用它。我们感谢您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-49682) 上对该功能的反馈。

## Kotlin/Native

Kotlin 1.8.20 包含对受支持的 Kotlin/Native 目标的更改、与 Objective-C 的互操作性以及 CocoaPods Gradle 插件的改进等更新：

* [Kotlin/Native 目标更新](#update-for-kotlin-native-targets)
* [弃用旧版内存管理器](#deprecation-of-the-legacy-memory-manager)
* [支持带有 @import 指令的 Objective-C 头文件](#support-for-objective-c-headers-with-import-directives)
* [Cocoapods Gradle 插件支持仅链接模式](#support-for-the-link-only-mode-in-cocoapods-gradle-plugin)
* [在 UIKit 中将 Objective-C 扩展导入为类成员](#import-objective-c-extensions-as-class-members-in-uikit)
* [在编译器中重新实现编译器缓存管理](#reimplementation-of-compiler-cache-management-in-the-compiler)
* [在 Cocoapods Gradle 插件中弃用 `useLibraries()`](#deprecation-of-uselibraries-in-cocoapods-gradle-plugin)
  
### Kotlin/Native 目标更新
  
Kotlin 团队决定重新审视 Kotlin/Native 支持的目标列表，将其分为不同的层级 (tiers)，并从 Kotlin 1.8.20 开始弃用其中一些。有关受支持和已弃用目标的完整列表，请参阅 [Kotlin/Native 目标支持](native-target-support.md)部分。

以下目标在 Kotlin 1.8.20 中已弃用，并将于 1.9.20 中移除：

* `iosArm32`
* `watchosX86`
* `wasm32`
* `mingwX86`
* `linuxArm32Hfp`
* `linuxMips32`
* `linuxMipsel32`

至于其余目标，现在根据目标在 Kotlin/Native 编译器中的支持和测试程度，分为三个支持层级。目标可以移动到不同的层级。例如，我们将尽最大努力在未来为 `iosArm64` 提供全面支持，因为它对于 [Kotlin 多平台](https://kotlinlang.org/docs/multiplatform/get-started.html)非常重要。

如果您是库作者，这些目标层级可以帮助您决定在 CI 工具上测试哪些目标以及跳过哪些目标。Kotlin 团队在开发官方 Kotlin 库（如 [kotlinx.coroutines](coroutines-guide.md)）时也将采用相同的方法。

查看我们的[博客文章](https://blog.jetbrains.com/kotlin/2023/02/update-regarding-kotlin-native-targets/)，了解有关这些更改原因的更多信息。

### 弃用旧版内存管理器

从 1.8.20 开始，旧版内存管理器已被弃用，并将于 1.9.20 中移除。[新内存管理器](native-memory-manager.md)在 1.7.20 中已默认启用，并一直在接受进一步的稳定性更新和性能改进。

如果您仍在使用旧版内存管理器，请从 `gradle.properties` 中移除 `kotlin.native.binary.memoryModel=strict` 选项，并按照我们的[迁移指南](native-migration-guide.md)进行必要的更改。

新内存管理器不支持 `wasm32` 目标。该目标也从[此版本开始被弃用](#update-for-kotlin-native-targets)，并将于 1.9.20 中移除。

### 支持带有 @import 指令的 Objective-C 头文件

> 此功能是[实验性的](components-stability.md#stability-levels-explained)。它可能随时被删除或更改。需要启用 (Opt-in)（详情见下文）。仅用于评估目的。我们感谢您在 [YouTrack](https://kotl.in/issue) 上提供的反馈。
>
{style="warning"}

Kotlin/Native 现在可以导入带有 `@import` 指令的 Objective-C 头文件。此功能对于使用具有自动生成的 Objective-C 头文件的 Swift 库或使用 Swift 编写的 CocoaPods 依赖项的类非常有用。

此前，cinterop 工具无法分析通过 `@import` 指令依赖 Objective-C 模块的头文件。原因是它缺乏对 `-fmodules` 选项的支持。

从 Kotlin 1.8.20 开始，您可以使用带有 `@import` 的 Objective-C 头文件。为此，请在定义文件中将 `-fmodules` 选项作为 `compilerOpts` 传递给编译器。如果您使用 [CocoaPods 集成](https://kotlinlang.org/docs/multiplatform/multiplatform-cocoapods-overview.html)，请在 `pod()` 函数的配置块中按如下方式指定 cinterop 选项：

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

这是一个[备受期待的功能](https://youtrack.jetbrains.com/issue/KT-39120)，我们欢迎您在 [YouTrack](https://kotl.in/issue) 中提供关于它的反馈，以帮助我们使其在未来版本中成为默认行为。

### Cocoapods Gradle 插件支持仅链接模式

在 Kotlin 1.8.20 中，您可以将具有动态框架的 Pod 依赖项仅用于链接，而无需生成 cinterop 绑定。当 cinterop 绑定已经生成时，这可能会派上用场。

考虑一个具有 2 个模块（一个库和一个应用）的项目。库依赖于一个 Pod，但不产生框架，仅产生一个 `.klib`。应用依赖于该库并产生一个动态框架。在这种情况下，您需要将此框架与库所依赖的 Pod 链接，但不需要 cinterop 绑定，因为库已经生成了它们。

要启用该功能，请在添加对 Pod 的依赖时使用 `linkOnly` 选项或构建器属性：

```kotlin
cocoapods {
    summary = "CocoaPods test library"
    homepage = "https://github.com/JetBrains/kotlin"

    pod("Alamofire", linkOnly = true) {
        version = "5.7.0"
    }
}
```

> 如果您将此选项与静态框架一起使用，它将完全移除 Pod 依赖，因为 Pod 不用于静态框架链接。
>
{style="note"}

### 在 UIKit 中将 Objective-C 扩展导入为类成员

自 Xcode 14.1 起，Objective-C 类中的一些方法已移至分类 (category) 成员。这导致生成了不同的 Kotlin API，这些方法被导入为 Kotlin 扩展而不是方法。

在 Kotlin 中子类化 UIView 时，您可能遇到过由此导致的重写方法的问题。例如，在 Kotlin 中子类化 UIView 时，变得无法重写 `drawRect()` 或 `layoutSubviews()` 方法。

自 1.8.20 起，与 NSView 和 UIView 类在相同头文件中声明的分类成员将被导入为这些类的成员。这意味着子类化 NSView 和 UIView 的方法可以像任何其他方法一样轻松重写。

如果一切顺利，我们计划为所有 Objective-C 类默认启用此行为。

### 在编译器中重新实现编译器缓存管理

为了加快编译器缓存的发展，我们将编译器缓存管理从 Kotlin Gradle 插件移动到了 Kotlin/Native 编译器中。这为几项重要改进扫清了障碍，包括编译时间和编译器缓存灵活性的改进。

如果您遇到某些问题并需要返回旧行为，请使用 `kotlin.native.cacheOrchestration=gradle` Gradle 属性。

我们感谢您在 [YouTrack](https://kotl.in/issue) 上对此提供的反馈。

### 在 Cocoapods Gradle 插件中弃用 useLibraries()

Kotlin 1.8.20 开始了在 [CocoaPods 集成](https://kotlinlang.org/docs/multiplatform/multiplatform-cocoapods-overview.html)中用于静态库的 `useLibraries()` 函数的弃用周期。

我们引入 `useLibraries()` 函数是为了允许依赖包含静态库的 Pod。随着时间的推移，这种情况已变得非常罕见。大多数 Pod 通过源码分发，而 Objective-C 框架或 XCFramework 是二进制分发的常见选择。

由于此函数不常用，且会产生使 Kotlin CocoaPods Gradle 插件开发复杂化的问题，我们决定将其弃用。

有关框架和 XCFramework 的更多信息，请参阅[构建最终原生二进制文件](https://kotlinlang.org/docs/multiplatform/multiplatform-build-native-binaries.html)。

## Kotlin 多平台

Kotlin 1.8.20 致力于通过 Kotlin 多平台的以下更新来改善开发者体验：

* [设置源集层次结构的新方式](#new-approach-to-source-set-hierarchy)
* [Kotlin 多平台中 Gradle 复合构建支持的预览](#preview-of-gradle-composite-builds-support-in-kotlin-multiplatform)
* [改进了 Xcode 中的 Gradle 错误输出](#improved-output-for-gradle-errors-in-xcode)

### 设置源集层次结构的新方式

> 设置源集层次结构的新方式是[实验性的](components-stability.md#stability-levels-explained)。它可能会在未来的 Kotlin 版本中发生更改，恕不另行通知。需要启用 (Opt-in)（详情见下文）。我们感谢您在 [YouTrack](https://kotl.in/issue) 上提供的反馈。
>
{style="warning"}

Kotlin 1.8.20 为您的多平台项目提供了一种设置源集层次结构的新方法——默认目标层次结构。这种新方式旨在取代像 `ios` 这样具有[设计缺陷](#why-replace-shortcuts)的目标快捷方式。

默认目标层次结构背后的理念很简单：您显式声明项目编译到的所有目标，Kotlin Gradle 插件将根据指定的目标自动创建共享源集。

#### 设置您的项目

考虑这个简单的多平台移动应用的例子：

```kotlin
@OptIn(ExperimentalKotlinGradlePluginApi::class)
kotlin {
    // 启用默认目标层次结构：
    targetHierarchy.default()

    android()
    iosArm64()
    iosSimulatorArm64()
}
```

您可以将默认目标层次结构视为所有可能目标及其共享源集的模板。当您在代码中声明最终目标 `android`、`iosArm64` 和 `iosSimulatorArm64` 时，Kotlin Gradle 插件会从模板中查找合适的共享源集并为您创建它们。生成的层次结构如下所示：

![使用默认目标层次结构的示例](default-hierarchy-example.svg){thumbnail="true" width="350" thumbnail-same-file="true"}

绿色的源集是实际创建并存在于项目中的，而默认模板中灰色的源集则被忽略。如您所见，Kotlin Gradle 插件没有创建 `watchos` 源集，例如，因为项目中没有 watchOS 目标。

如果您添加了一个 watchOS 目标，如 `watchosArm64`，则会创建 `watchos` 源集，并且 `apple`、`native` 和 `common` 源集中的代码也将编译到 `watchosArm64`。

您可以在[文档](https://kotlinlang.org/docs/multiplatform/multiplatform-hierarchy.html#default-hierarchy-template)中找到默认目标层次结构的完整方案。

> 在此示例中，`apple` 和 `native` 源集仅编译到 `iosArm64` 和 `iosSimulatorArm64` 目标。因此，尽管它们叫这个名字，它们仍具有访问完整 iOS API 的权限。这对于像 `native` 这样的源集可能并不直观，因为您可能期望在该源集中只能访问在所有原生目标上都可用的 API。这种行为未来可能会发生变化。
>
{style="note"}

#### 为什么要替换快捷方式 {initial-collapse-state="collapsed" collapsible="true"}

创建源集层次结构可能很冗长、容易出错且对初学者不友好。我们之前的解决方案是引入像 `ios` 这样的快捷方式，为您创建部分层次结构。然而，使用快捷方式证明了它们有一个很大的设计缺陷：难以更改。

以 `ios` 快捷方式为例。它仅创建 `iosArm64` 和 `iosX64` 目标，这可能会令人困惑，并且在需要 `iosSimulatorArm64` 目标的基于 M1 的主机上工作时可能会导致问题。然而，添加 `iosSimulatorArm64` 目标对于用户项目来说可能是一个极具破坏性的改变：

* `iosMain` 源集中使用的所有依赖项都必须支持 `iosSimulatorArm64` 目标；否则，依赖项解析将失败。
* 添加新目标时，`iosMain` 中使用的某些原生 API 可能会消失（尽管在 `iosSimulatorArm64` 的情况下不太可能）。
* 在某些情况下，例如在基于 Intel 的 MacBook 上编写一个小型个人项目时，您甚至可能不需要此更改。

显而易见，快捷方式并不能解决配置层次结构的问题，这就是为什么我们在某个时刻停止添加新快捷方式的原因。

默认目标层次结构乍一看可能与快捷方式相似，但它们有一个关键区别：**用户必须显式指定目标集**。此集合定义了项目的编译、发布方式以及参与依赖项解析的方式。由于此集合是固定的，来自 Kotlin Gradle 插件的默认配置更改对生态系统造成的困扰应该会显著减少，并且提供工具辅助的迁移也会容易得多。

#### 如何启用默认层次结构

这项新功能是[实验性的](components-stability.md#stability-levels-explained)。对于 Kotlin Gradle 构建脚本，您需要通过 `@OptIn(ExperimentalKotlinGradlePluginApi::class)` 进行启用。

更多信息请参阅[层次化项目结构](https://kotlinlang.org/docs/multiplatform/multiplatform-hierarchy.html#default-hierarchy-template)。

#### 留下反馈

这是对多平台项目的一次重大更改。我们感谢您的[反馈](https://kotl.in/issue)，以帮助我们做得更好。

### Kotlin 多平台中 Gradle 复合构建支持预览

> 自 Kotlin Gradle 插件 1.8.20 起，Gradle 构建已支持此功能。如需 IDE 支持，请使用 IntelliJ IDEA 2023.1 Beta 2 (231.8109.2) 或更高版本，以及带有任何 Kotlin IDE 插件的 Kotlin Gradle 插件 1.8.20。
>
{style="note"}

从 1.8.20 开始，Kotlin 多平台支持 [Gradle 复合构建](https://docs.gradle.org/current/userguide/composite_builds.html)。复合构建允许您将独立项目或同一项目的不同部分的构建包含到单个构建中。

由于一些技术挑战，在 Kotlin 多平台中使用 Gradle 复合构建之前仅得到部分支持。Kotlin 1.8.20 包含改进支持的预览，应该适用于更多种类的项目。要尝试它，请将以下选项添加到您的 `gradle.properties` 中：

```none
kotlin.mpp.import.enableKgpDependencyResolution=true
```

此选项启用了新导入模式的预览。除了对复合构建的支持外，它还在多平台项目中提供了更流畅的导入体验，因为我们包含了重大的错误修复和改进，使导入更加稳定。

#### 已知问题

它仍是一个预览版本，需要进一步稳定，您在过程中可能会遇到一些导入问题。以下是我们计划在 Kotlin 1.8.20 最终发布之前修复的一些已知问题：

* 目前还没有适用于 IntelliJ IDEA 2023.1 EAP 的 Kotlin 1.8.20 插件。尽管如此，您仍然可以将 Kotlin Gradle 插件版本设置为 1.8.20，并在此 IDE 中尝试复合构建。
* 如果您的项目包含具有指定 `rootProject.name` 的构建，复合构建可能无法解析 Kotlin 元数据。有关解决方法和详情，请参阅此 [Youtrack 问题](https://youtrack.jetbrains.com/issue/KT-56536)。

我们鼓励您尝试并向 [YouTrack](https://kotl.in/issue) 提交所有报告，以帮助我们使其在 Kotlin 1.9.0 中成为默认行为。

### 改进了 Xcode 中的 Gradle 错误输出

如果您在 Xcode 中构建多平台项目时遇到问题，可能会遇到 "Command PhaseScriptExecution failed with a nonzero exit code" 错误。这条消息表明 Gradle 调用失败，但在尝试检测问题时并没有太大帮助。

从 Kotlin 1.8.20 开始，Xcode 可以解析来自 Kotlin/Native 编译器的输出。此外，如果 Gradle 构建失败，您将在 Xcode 中看到来自根本原因异常的额外错误消息。在大多数情况下，它将有助于识别根本问题。

![改进了 Xcode 中的 Gradle 错误输出](xcode-gradle-output.png){width=700}

对于标准的 Xcode 集成 Gradle 任务，新行为默认启用，例如 `embedAndSignAppleFrameworkForXcode`，它可以将多平台项目中的 iOS 框架连接到 Xcode 中的 iOS 应用程序。它也可以通过 `kotlin.native.useXcodeMessageStyle` Gradle 属性来启用（或禁用）。

## Kotlin/JavaScript

Kotlin 1.8.20 更改了 TypeScript 定义的生成方式。它还包含了一项旨在改善调试体验的更改：

* [从 Gradle 插件中移除 Dukat 集成](#removal-of-dukat-integration-from-gradle-plugin)
* [源代码映射中的 Kotlin 变量和函数名](#kotlin-variable-and-function-names-in-source-maps)
* [选择启用生成 TypeScript 定义文件](#opt-in-for-generation-of-typescript-definition-files)

### 从 Gradle 插件中移除 Dukat 集成

在 Kotlin 1.8.20 中，我们从 Kotlin/JavaScript Gradle 插件中移除了我们的[实验性](components-stability.md#stability-levels-explained) Dukat 集成。Dukat 集成支持将 TypeScript 声明文件 (`.d.ts`) 自动转换为 Kotlin 外部声明。

您仍然可以通过改用我们的 [Dukat 工具](https://github.com/Kotlin/dukat)将 TypeScript 声明文件 (`.d.ts`) 转换为 Kotlin 外部声明。

> Dukat 工具是[实验性的](components-stability.md#stability-levels-explained)。它可能随时被删除或更改。
>
{style="warning"}

### 源代码映射中的 Kotlin 变量和函数名

为了辅助调试，我们引入了将您在 Kotlin 代码中为变量和函数声明的名称添加到源代码映射中的功能。在 1.8.20 之前，这些在源代码映射中不可用，因此在调试器中，您始终只能看到生成的 JavaScript 的变量和函数名。

您可以通过在 Gradle 文件 `build.gradle.kts` 中使用 `sourceMapNamesPolicy`，或使用 `-source-map-names-policy` 编译器选项来配置添加的内容。下表列出了可能的设置：

| 设置                      | 说明                                     | 示例输出                            |
|-------------------------|----------------------------------------|-----------------------------------|
| `simple-names`          | 添加变量名和简单函数名。（默认）                       | `main`                            |
| `fully-qualified-names` | 添加变量名和完全限定函数名。                         | `com.example.kjs.playground.main` |
| `no`                    | 不添加变量或函数名。                             | N/A                               |

请参阅下面 `build.gradle.kts` 文件中的示例配置：

```kotlin
tasks.withType<org.jetbrains.kotlin.gradle.tasks.Kotlin2JsCompile>().configureEach {
    compilercompileOptions.sourceMapNamesPolicy.set(org.jetbrains.kotlin.gradle.dsl.JsSourceMapNamesPolicy.SOURCE_MAP_NAMES_POLICY_FQ_NAMES) // 或 SOURCE_MAP_NAMES_POLICY_NO, 或 SOURCE_MAP_NAMES_POLICY_SIMPLE_NAMES
}
```
{validate="false"}

像 Chromium 系浏览器提供的调试工具可以从源代码映射中获取原始 Kotlin 名称，从而提高堆栈跟踪的可读性。祝调试愉快！

> 在源代码映射中添加变量和函数名是[实验性的](components-stability.md#stability-levels-explained)。它可能随时被删除或更改。
>
{style="warning"}

### 选择启用生成 TypeScript 定义文件

以前，如果您有一个产生可执行文件的项目 (`binaries.executable()`)，Kotlin/JS IR 编译器会收集任何标有 `@JsExport` 的顶层声明，并在 `.d.ts` 文件中自动生成 TypeScript 定义。

由于这并非对每个项目都有用，我们在 Kotlin 1.8.20 中更改了这一行为。如果您想生成 TypeScript 定义，必须在 Gradle 构建文件中显式配置。在 `build.gradle.kts` 文件的 [`js` 部分](js-project-setup.md#execution-environments)添加 `generateTypeScriptDefinitions()`。例如：

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

> 生成 TypeScript 定义 (`d.ts`) 是[实验性的](components-stability.md#stability-levels-explained)。它可能随时被删除或更改。
>
{style="warning"}

## Gradle

Kotlin 1.8.20 与 Gradle 6.8 至 7.6 完全兼容，但[多平台插件中的一些特殊情况](https://youtrack.jetbrains.com/issue/KT-55751)除外。您也可以使用截至最新 Gradle 版本的 Gradle 版本，但如果这样做，请记住您可能会遇到弃用警告，或者某些新的 Gradle 功能可能无法正常工作。

此版本带来了以下变化：

* [新的 Gradle 插件版本对齐](#new-gradle-plugins-versions-alignment)
* [Gradle 中默认启用新的 JVM 增量编译](#new-jvm-incremental-compilation-by-default-in-gradle)
* [编译任务输出的精确备份](#precise-backup-of-compilation-tasks-outputs)
* [所有 Gradle 版本的延迟 Kotlin/JVM 任务创建](#lazy-kotlin-jvm-tasks-creation-for-all-gradle-versions)
* [编译任务 destinationDirectory 的非默认位置](#non-default-location-of-compile-tasks-destinationdirectory)
* [能够选择不向 HTTP 统计服务报告编译器参数](#ability-to-opt-out-from-reporting-compiler-arguments-to-an-http-statistics-service)

### 新的 Gradle 插件版本对齐

Gradle 提供了一种方式来确保必须协同工作的依赖项始终在[版本上保持对齐](https://docs.gradle.org/current/userguide/dependency_version_alignment.html#aligning_versions_natively_with_gradle)。Kotlin 1.8.20 也采用了这种方法。它默认生效，因此您无需更改或更新配置来启用它。此外，您不再需要诉诸于[此解决方法来解析 Kotlin Gradle 插件的传递依赖项](whatsnew18.md#resolution-of-kotlin-gradle-plugins-transitive-dependencies)。

我们感谢您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-54691) 上对该功能的反馈。

### Gradle 中默认启用新的 JVM 增量编译

[自 Kotlin 1.7.0 起可用](whatsnew17.md#a-new-approach-to-incremental-compilation)的新增量编译方法现在默认生效。您不再需要在 `gradle.properties` 中指定 `kotlin.incremental.useClasspathSnapshot=true` 来启用它。

我们感谢您对此提供的反馈。您可以在 YouTrack 中[提交问题](https://kotl.in/issue)。

### 编译任务输出的精确备份

> 编译任务输出的精确备份是[实验性的](components-stability.md#stability-levels-explained)。要使用它，请将 `kotlin.compiler.preciseCompilationResultsBackup=true` 添加到 `gradle.properties`。我们感谢您在 [YouTrack](https://kotl.in/issue/experimental-ic-optimizations) 上提供的反馈。
>
{style="warning"}

从 Kotlin 1.8.20 开始，您可以启用精确备份，只有那些 Kotlin 在[增量编译](gradle-compilation-and-caches.md#incremental-compilation)中重新编译的类才会被备份。全量备份和精确备份都有助于在编译错误后再次以增量方式运行构建。与全量备份相比，精确备份还能节省构建时间。在大型项目中，或者如果许多任务正在进行备份，全量备份可能会花费**显著**的构建时间，特别是如果项目位于缓慢的机械硬盘上。

此优化是实验性的。您可以通过在 `gradle.properties` 文件中添加 `kotlin.compiler.preciseCompilationResultsBackup` Gradle 属性来启用它：

```none
kotlin.compiler.preciseCompilationResultsBackup=true
```

#### JetBrains 中使用精确备份的示例 {initial-collapse-state="collapsed" collapsible="true"}

在以下图表中，您可以看到使用精确备份与全量备份的对比示例：

![全量备份与精确备份的对比](comparison-of-full-and-precise-backups.png){width=700}

第一和第二张图表显示了 Kotlin 项目中的精确备份如何影响 Kotlin Gradle 插件的构建：

1. 在对一个被许多模块依赖的模块进行小型 [ABI](https://en.wikipedia.org/wiki/Application_binary_interface) 更改（添加一个新的公共方法）之后。
2. 在对一个不被其他任何模块依赖的模块进行小型非 ABI 更改（添加一个私有函数）之后。

第三张图表显示了 [Space](https://www.jetbrains.com/space/) 项目中的精确备份如何在对一个被许多模块依赖的 Kotlin/JS 模块进行小型非 ABI 更改（添加一个私有函数）后影响 Web 前端的构建。

这些测量是在配备 Apple M1 Max CPU 的计算机上执行的；不同的计算机将产生略有不同的结果。影响性能的因素包括但不限于：

* [Kotlin 守护进程](gradle-compilation-and-caches.md#the-kotlin-daemon-and-how-to-use-it-with-gradle) 和 [Gradle 守护进程](https://docs.gradle.org/current/userguide/gradle_daemon.html) 的热身程度。
* 磁盘的速度快慢。
* CPU 型号及其繁忙程度。
* 哪些模块受更改影响以及这些模块的大小。
* 更改是 ABI 还是非 ABI 更改。

#### 通过构建报告评估优化效果 {initial-collapse-state="collapsed" collapsible="true"}

要评估优化对您的计算机、项目和场景的影响，您可以使用 [Kotlin 构建报告](gradle-compilation-and-caches.md#build-reports)。通过将以下属性添加到您的 `gradle.properties` 文件中，启用文本文件格式的报告：

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
  Backup output: 0.22 s // 注意这个数字
<...>
```

以下是启用精确备份后报告相关部分的示例：

```none
Task ':kotlin-gradle-plugin:compileCommonKotlin' finished in 0.46 s
<...>
Time metrics:
 Total Gradle task time: 0.46 s
 Task action before worker execution: 0.07 s
  Backup output: 0.05 s // 时间已减少
 Run compilation in Gradle worker: 0.32 s
  Clear jar cache: 0.00 s
  Precise backup output: 0.00 s // 与精确备份相关
  Cleaning up the backup stash: 0.00 s // 与精确备份相关
<...>
```

### 所有 Gradle 版本的延迟 Kotlin/JVM 任务创建

对于在 Gradle 7.3+ 上使用 `org.jetbrains.kotlin.gradle.jvm` 插件的项目，Kotlin Gradle 插件不再预先创建和配置 `compileKotlin` 任务。在较低的 Gradle 版本上，它只是注册所有任务，并且不会在干跑 (dry run) 时配置它们。现在在运行 Gradle 7.3+ 时也采用同样的行为。

### 编译任务 destinationDirectory 的非默认位置

如果您执行以下操作之一，请使用一些额外代码更新您的构建脚本：

* 重写 Kotlin/JVM `KotlinJvmCompile`/`KotlinCompile` 任务的 `destinationDirectory` 位置。
* 使用已弃用的 Kotlin/JS/非 IR [变体](gradle-plugin-variants.md)并重写 `Kotlin2JsCompile` 任务的 `destinationDirectory`。

您需要在 JAR 文件中显式地将 `sourceSets.main.kotlin.classesDirectories` 添加到 `sourceSets.main.outputs`：

```groovy
tasks.jar(type: Jar) {
    from sourceSets.main.outputs
    from sourceSets.main.kotlin.classesDirectories
}
```

### 能够选择不向 HTTP 统计服务报告编译器参数

您现在可以控制 Kotlin Gradle 插件是否应在 HTTP [构建报告](gradle-compilation-and-caches.md#build-reports)中包含编译器参数。有时，您可能不需要插件报告这些参数。如果一个项目包含许多模块，其报告中的编译器参数可能会非常沉重且用处不大。现在有一种方法可以禁用它，从而节省内存。在您的 `gradle.properties` 或 `local.properties` 中，使用 `kotlin.build.report.include_compiler_arguments=(true|false)` 属性。

我们感谢您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-55323/) 上对此功能的反馈。

## 标准库

Kotlin 1.8.20 添加了多种新功能，其中一些对 Kotlin/Native 开发特别有用：

* [支持 AutoCloseable 接口](#support-for-the-autocloseable-interface)
* [支持 Base64 编码和解码](#support-for-base64-encoding)
* [Kotlin/Native 中支持 @Volatile](#support-for-volatile-in-kotlin-native)
* [修复了 Kotlin/Native 中使用正则表达式时的栈溢出错误](#bug-fix-for-stack-overflow-when-using-regex-in-kotlin-native)

### 支持 AutoCloseable 接口

> 新的 `AutoCloseable` 接口是[实验性的](components-stability.md#stability-levels-explained)，要使用它，您需要通过 `@OptIn(ExperimentalStdlibApi::class)` 或编译器参数 `-opt-in=kotlin.ExperimentalStdlibApi` 进行启用。
>

{style="warning"}

`AutoCloseable` 接口已添加到通用标准库中，以便您可以使用一个通用接口来关闭所有库的资源。在 Kotlin/JVM 中，`AutoCloseable` 接口是 [`java.lang.AutoClosable`](https://docs.oracle.com/javase/8/docs/api/java/lang/AutoCloseable.html) 的别名。

此外，现在包含扩展函数 `use()`，它在选定的资源上执行给定的代码块函数，然后正确地关闭资源，无论是否抛出异常。

通用标准库中没有实现 `AutoCloseable` 接口的公共类。在下面的示例中，我们定义了 `XMLWriter` 接口并假设有一个实现它的资源。例如，该资源可能是一个打开文件、写入 XML 内容然后关闭文件的类。

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

> 新的编码和解码功能是[实验性的](components-stability.md#stability-levels-explained)，要使用它，您需要通过 `@OptIn(ExperimentalEncodingApi::class)` 或编译器参数 `-opt-in=kotlin.io.encoding.ExperimentalEncodingApi` 进行启用。
>
{style="warning"}

我们添加了对 Base64 编码和解码的支持。我们提供了 3 个类实例，每个实例使用不同的编码方案并表现出不同的行为。使用 `Base64.Default` 实例进行标准的 [Base64 编码方案](https://www.rfc-editor.org/rfc/rfc4648#section-4)。

使用 `Base64.UrlSafe` 实例进行 [“URL 和文件名安全”](https://www.rfc-editor.org/rfc/rfc4648#section-5) 编码方案。

使用 `Base64.Mime` 实例进行 [MIME](https://www.rfc-editor.org/rfc/rfc2045#section-6.8) 编码方案。当您使用 `Base64.Mime` 实例时，所有编码函数每 76 个字符插入一个行分隔符。在解码情况下，任何非法字符都会被跳过，不会抛出异常。

> `Base64.Default` 实例是 `Base64` 类的伴生对象。因此，您可以通过 `Base64.encode()` 和 `Base64.decode()` 调用其函数，而不是 `Base64.Default.encode()` 和 `Base64.Default.decode()`。
>
{style="tip"}

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
{validate="false"}

您可以使用额外的函数将字节编码或解码到现有缓冲区中，以及将编码结果附加到提供的 `Appendable` 类型对象中。

在 Kotlin/JVM 中，我们还添加了扩展函数 `encodingWith()` 和 `decodingWith()`，使您能够通过输入和输出流执行 Base64 编码和解码。

### Kotlin/Native 中支持 @Volatile

> Kotlin/Native 中的 `@Volatile` 是[实验性的](components-stability.md#stability-levels-explained)。它可能随时被删除或更改。需要启用 (Opt-in)（详情见下文）。仅用于评估目的。我们感谢您在 [YouTrack](https://kotl.in/issue) 上提供的反馈。
>
{style="warning"}

如果您使用 `@Volatile` 注解一个 `var` 属性，那么支持字段会被标记，从而使该字段的任何读取或写入都是原子的，并且写入始终对其他线程可见。

在 1.8.20 之前，[`kotlin.jvm.Volatile` 注解](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-volatile/)在通用标准库中可用。然而，该注解仅在 JVM 中有效。如果您在 Kotlin/Native 中使用它，它将被忽略，这可能会导致错误。

在 1.8.20 中，我们引入了一个通用注解 `kotlin.concurrent.Volatile`，您可以在 JVM 和 Kotlin/Native 中同时使用它。

#### 如何启用

要尝试此功能，请通过 `@OptIn(ExperimentalStdlibApi)` 进行启用，并启用 `-language-version 1.9` 编译器选项。在 Gradle 项目中，您可以通过在 `build.gradle(.kts)` 文件中添加以下内容来实现：

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

### 修复了 Kotlin/Native 中使用正则表达式时的栈溢出错误

在之前的 Kotlin 版本中，如果您的正则输入包含大量字符，即使正则表达式模式非常简单，也可能发生崩溃。在 1.8.20 中，此问题已得到解决。有关更多信息，请参阅 [KT-46211](https://youtrack.jetbrains.com/issue/KT-46211)。

## 序列化更新

Kotlin 1.8.20 带来了[对 Kotlin K2 编译器的 Alpha 支持](#prototype-serialization-compiler-plugin-for-kotlin-k2-compiler)，并[禁止通过伴生对象自定义序列化器](#prohibit-implicit-serializer-customization-via-companion-object)。

### 针对 Kotlin K2 编译器的原型序列化编译器插件

> 对 K2 序列化编译器插件的支持处于 [Alpha](components-stability.md#stability-levels-explained) 阶段。要使用它，请[启用 Kotlin K2 编译器](#how-to-enable-the-kotlin-k2-compiler)。
>
{style="warning"}

从 1.8.20 开始，序列化编译器插件可与 Kotlin K2 编译器协同工作。请试用并[向我们分享您的反馈](#leave-your-feedback-on-the-new-k2-compiler)！

### 禁止通过伴生对象隐式自定义序列化器

目前，可以使用 `@Serializable` 注解将一个类声明为可序列化的，同时在其伴生对象上使用 `@Serializer` 注解声明一个自定义序列化器。

例如：

```kotlin
import kotlinx.serialization.*

@Serializable
class Foo(val a: Int) {
    @Serializer(Foo::class)
    companion object {
        // KSerializer<Foo> 的自定义实现
    }
}
```

在这种情况下，从 `@Serializable` 注解中无法清楚地看出使用了哪个序列化器。实际上，类 `Foo` 有一个自定义序列化器。

为了防止这种混淆，在 Kotlin 1.8.20 中，我们在检测到这种情况时引入了编译器警告。该警告包含了解决此问题的可能迁移路径。

如果您在代码中使用了此类结构，我们建议将其更新为以下形式：

```kotlin
import kotlinx.serialization.*

@Serializable(Foo.Companion::class)
class Foo(val a: Int) {
    // 无论您是否使用 @Serializer(Foo::class) 都没有关系
    companion object: KSerializer<Foo> {
        // KSerializer<Foo> 的自定义实现
    }
}
```

通过这种方式，可以清楚地看到 `Foo` 类使用了在伴生对象中声明的自定义序列化器。更多信息请参阅我们的 [YouTrack 工单](https://youtrack.jetbrains.com/issue/KT-54441)。

> 在 Kotlin 2.0 中，我们计划将编译警告升级为编译器错误。如果您看到此警告，建议您迁移代码。
>
{style="tip"}

## 文档更新

Kotlin 文档进行了一些显著更改：

* [Spring Boot 与 Kotlin 入门](jvm-get-started-spring-boot.md)——创建一个带有数据库的简单应用程序，并了解有关 Spring Boot 和 Kotlin 功能的更多信息。
* [作用域函数](scope-functions.md)——了解如何使用标准库中有用的作用域函数来简化您的代码。
* [CocoaPods 集成](https://kotlinlang.org/docs/multiplatform/multiplatform-cocoapods-overview.html)——设置使用 CocoaPods 的环境。

## 安装 Kotlin 1.8.20

### 检查 IDE 版本

[IntelliJ IDEA](https://www.jetbrains.com/idea/download/) 2022.2 和 2022.3 会自动建议将 Kotlin 插件更新到 1.8.20 版本。IntelliJ IDEA 2023.1 内置了 Kotlin 插件 1.8.20。

Android Studio Flamingo (222) 和 Giraffe (223) 将在后续版本中支持 Kotlin 1.8.20。

新的命令行编译器可在 [GitHub 发布页面](https://github.com/JetBrains/kotlin/releases/tag/v1.8.20)下载。

### 配置 Gradle 设置

为了正确下载 Kotlin 构件和依赖项，请更新您的 `settings.gradle(.kts)` 文件以使用 Maven Central 仓库：

```kotlin
pluginManagement {
    repositories {
        mavenCentral()
        gradlePluginPortal()
    }
}
```

如果未指定该仓库，Gradle 将使用已关停的 JCenter 仓库，这可能会导致 Kotlin 构件出现问题。