---
title: "Kotlin 1.8.20 版本的新特性"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

_[发布日期：2023年4月25日](releases#release-details)_

Kotlin 1.8.20 版本已发布，以下是其一些最重要的亮点：

* [新的 Kotlin K2 编译器更新](#new-kotlin-k2-compiler-updates)
* [新的实验性 Kotlin/Wasm 目标平台](#new-kotlin-wasm-target)
* [Gradle 中默认启用新的 JVM 增量编译](#new-jvm-incremental-compilation-by-default-in-gradle)
* [Kotlin/Native 目标平台更新](#update-for-kotlin-native-targets)
* [Kotlin 多平台中 Gradle 组合构建的预览](#preview-of-gradle-composite-builds-support-in-kotlin-multiplatform)
* [改进了 Xcode 中 Gradle 错误的输出](#improved-output-for-gradle-errors-in-xcode)
* [标准库中对 AutoCloseable 接口的实验性支持](#support-for-the-autocloseable-interface)
* [标准库中对 Base64 编码的实验性支持](#support-for-base64-encoding)

您还可以观看此视频，简要了解这些更改：

<video src="https://www.youtube.com/v/R1JpkpPzyBU" title="What's new in Kotlin 1.8.20"/>

## IDE 支持

支持 1.8.20 的 Kotlin 插件可用于：

| IDE            | 支持的版本            |
|----------------|-------------------------------|
| IntelliJ IDEA  | 2022.2.x, 2022.3.x,  2023.1.x |
| Android Studio | Flamingo (222)                |
:::note
要正确下载 Kotlin 构件和依赖项，请[配置 Gradle 设置](#configure-gradle-settings)
以使用 Maven Central 仓库。

## 新的 Kotlin K2 编译器更新

Kotlin 团队正在继续稳定 K2 编译器。正如
[Kotlin 1.7.0 发布公告](whatsnew17#new-kotlin-k2-compiler-for-the-jvm-in-alpha)中所述，它仍然处于 **Alpha** 阶段。
此版本引入了在 [K2 Beta](https://youtrack.jetbrains.com/issue/KT-52604) 之路上所做的进一步改进。

从 1.8.20 版本开始，Kotlin K2 编译器：

* 具有序列化插件的预览版本。
* 为 [JS IR 编译器](js-ir-compiler) 提供 Alpha 支持。
* 引入了未来发布的
  [新语言版本 Kotlin 2.0](https://blog.jetbrains.com/kotlin/2023/02/k2-kotlin-2-0/)。

请在以下视频中了解有关新编译器及其优点的更多信息：

* [What Everyone Must Know About The NEW Kotlin K2 Compiler](https://www.youtube.com/watch?v=iTdJJq_LyoY)
* [The New Kotlin K2 Compiler: Expert Review](https://www.youtube.com/watch?v=db19VFLZqJM)

### 如何启用 Kotlin K2 编译器

要启用和测试 Kotlin K2 编译器，请使用新的语言版本以及以下编译器选项：

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

新的 K2 编译器的 Alpha 版本仅适用于 JVM 和 JS IR 项目。
它尚不支持 Kotlin/Native 或任何多平台项目。

### 留下您对新 K2 编译器的反馈

我们感谢您的任何反馈！

* 在 Kotlin Slack 上直接向 K2 开发者提供您的反馈 – [获取邀请](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up?_gl=1*ju6cbn*_ga*MTA3MTk5NDkzMC4xNjQ2MDY3MDU4*_ga_9J976DJZ68*MTY1ODMzNzA3OS4xMDAuMS4xNjU4MzQwODEwLjYw)
  并加入 [#k2-early-adopters](https://kotlinlang.slack.com/archives/C03PK0PE257) 频道。
* 在 [我们的 issue tracker](https://kotl.in/issue) 上报告您在使用新的 K2 编译器时遇到的任何问题。
* [启用 **发送使用情况统计信息** 选项](https://www.jetbrains.com/help/idea/settings-usage-statistics.html) 以
  允许 JetBrains 收集有关 K2 使用情况的匿名数据。

## 语言

随着 Kotlin 的不断发展，我们将在 1.8.20 中推出新语言功能的预览版本：

* [Enum 类 values 函数的现代高性能替代品](#a-modern-and-performant-replacement-of-the-enum-class-values-function)
* [与数据类对称的数据对象](#preview-of-data-objects-for-symmetry-with-data-classes)
* [取消对内联类中带有主体的二级构造函数的限制](#preview-of-lifting-restriction-on-secondary-constructors-with-bodies-in-inline-classes)

### Enum 类 values 函数的现代高性能替代品

此功能是 [Experimental](components-stability#stability-levels-explained)。
它可能会随时删除或更改。 需要选择加入（请参阅下面的详细信息）。 仅用于评估目的。
我们欢迎您在 [YouTrack](https://kotl.in/issue) 中对此提出反馈。

Enum 类具有一个合成的 `values()` 函数，该函数返回一个已定义的枚举常量数组。 但是，使用数组可能会导致
Kotlin 和 Java 中 [隐藏的性能问题](https://github.com/Kotlin/KEEP/blob/master/proposals/enum-entries#examples-of-performance-issues)。
此外，大多数 API 都使用集合，这需要最终转换。 为了解决这些问题，我们为 Enum 类引入了 `entries` 属性，
应使用该属性代替 `values()` 函数。 调用时，`entries` 属性返回一个预分配的已定义的枚举常量不可变列表。

`values()` 函数仍然受支持，但我们建议您使用 `entries` 属性
代替。

```kotlin
enum class Color(val colorName: String, val rgb: String) {
    RED("Red", "#FF0000"),
    ORANGE("Orange", "#FF7F00"),
    YELLOW("Yellow", "#FFFF00")
}

@OptIn(ExperimentalStdlibApi::class)
fun findByRgb(rgb: String): Color? = Color.entries.find { it.rgb == rgb }
```

#### 如何启用 entries 属性

要试用此功能，请选择使用 `@OptIn(ExperimentalStdlibApi)` 并启用 `-language-version 1.9` 编译器
选项。 在 Gradle 项目中，您可以通过将以下内容添加到 `build.gradle(.kts)` 文件中来实现：

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

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

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
tasks
    .withType(org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask.class)
    .configureEach {
        compilerOptions.languageVersion =
            org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_1_9
    }
```

</TabItem>
</Tabs>

从 IntelliJ IDEA 2023.1 开始，如果您已选择加入此功能，则相应的 IDE
检查将通知您有关从 `values()` 转换为 `entries()` 并提供快速修复。

有关该提案的更多信息，请参阅 [KEEP 说明](https://github.com/Kotlin/KEEP/blob/master/proposals/enum-entries)。

### 与数据类对称的数据对象预览

数据对象允许您声明具有单例语义和干净 `toString()` 表示形式的对象。 在此
代码段中，您可以看到将 `data` 关键字添加到对象声明如何提高其 `toString()`
输出的可读性：

```kotlin
package org.example
object MyObject
data object MyDataObject

fun main() {
    println(MyObject) // org.example.MyObject@1f32e575
    println(MyDataObject) // MyDataObject
}
```

特别是对于 `sealed` 层次结构（例如 `sealed class` 或 `sealed interface` 层次结构），`data objects` 非常适合，
因为它们可以与 `data class` 声明一起方便地使用。 在此代码段中，将 `EndOfFile`
声明为 `data object` 而不是普通的 `object` 意味着它将获得漂亮的 `toString` 而无需手动覆盖它。 这与随附的数据类定义保持对称。

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

自从它们在 [Kotlin 1.7.20](whatsnew1720#improved-string-representations-for-singletons-and-sealed-class-hierarchies-with-data-objects) 中首次预览以来，
数据对象的语义已得到改进。 编译器现在自动为它们生成许多便捷
函数：

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

`data object` 的 `equals()` 函数确保将所有具有您的 `data object` 类型的对象都
视为相等。 在大多数情况下，您在运行时只会有一个 `data object` 实例（毕竟，
`data object` 声明一个单例）。 但是，在运行时生成相同类型的另一个对象（例如，
通过 `java.lang.reflect` 的平台反射，或者通过使用 JVM 序列化库
在幕后使用此 API），这可以确保将对象视为相等。

确保仅以结构方式比较 `data objects`（使用 `==` 运算符），而永远不要通过引用（`===`
运算符）。 这有助于避免在运行时存在多个数据对象实例时的陷阱。 以下
代码段说明了这个特定的边缘情况：

```kotlin
import java.lang.reflect.Constructor

data object MySingleton

fun main() {
    val evilTwin = createInstanceViaReflection()

    println(MySingleton) // MySingleton
    println(evilTwin) // MySingleton

    // 即使一个库强行创建 MySingleton 的第二个实例，其 `equals` 方法也会返回 true：
    println(MySingleton == evilTwin) // true

    // 不要通过 === 比较数据对象。
    println(MySingleton === evilTwin) // false
}

fun createInstanceViaReflection(): MySingleton {
    // Kotlin 反射不允许实例化数据对象。
    // 这会“强行”创建一个新的 MySingleton 实例（即，Java 平台反射）
    // 不要自己这样做！
    return (MySingleton.javaClass.declaredConstructors[0].apply { isAccessible = true } as Constructor<MySingleton>).newInstance()
}
```

生成的 `hashCode()` 函数的行为与 `equals()` 函数的行为一致，因此 `data object` 的所有
运行时实例都具有相同的哈希代码。

##### 没有用于数据对象的 copy 和 componentN 函数

虽然 `data object` 和 `data class` 声明经常一起使用并且有一些相似之处，但有些
函数不会为 `data object` 生成：

由于 `data object` 声明旨在用作单例对象，因此不会生成 `copy()` 函数。
单例模式将类的实例化限制为单个实例，并且允许创建该实例的副本会违反该限制。

此外，与 `data class` 不同，`data object` 没有任何数据属性。 由于尝试解构这样的
对象没有意义，因此不会生成 `componentN()` 函数。

我们欢迎您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-4107) 中对此功能提出反馈。

#### 如何启用数据对象预览

要试用此功能，请启用 `-language-version 1.9` 编译器选项。 在 Gradle 项目中，您可以通过
将以下内容添加到 `build.gradle(.kts)` 文件中来实现：

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

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

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
tasks
    .withType(org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask.class)
    .configureEach {
        compilerOptions.languageVersion =
            org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_1_9
    }
```

</TabItem>
</Tabs>

### 取消对内联类中带有主体的二级构造函数的限制预览

此功能是 [Experimental](components-stability#stability-levels-explained)。 它可能会随时删除或更改。
需要选择加入（请参阅下面的详细信息）。 仅用于评估目的。 我们欢迎您在 [YouTrack](https://kotl.in/issue) 中对此提出反馈。

Kotlin 1.8.20 取消了对在 [内联类](inline-classes) 中使用带有主体的二级构造函数的限制。

内联类过去只允许一个没有 `init` 块的公共主构造函数或二级构造函数具有
清晰的初始化语义。 因此，无法封装基础值或创建表示某些约束值的内联类。

当 Kotlin 1.4.30 取消对 `init` 块的限制时，这些问题得到了解决。 现在，我们将更进一步，允许在预览模式下使用带有主体的二级构造函数：

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

#### 如何启用带有主体的二级构造函数

要试用此功能，请启用 `-language-version 1.9` 编译器选项。 在 Gradle 项目中，您可以通过
将以下内容添加到 `build.gradle(.kts)` 中来实现：

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

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

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
tasks
    .withType(org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask.class)
    .configureEach {
        compilerOptions.languageVersion =
            org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_1_9
    }
```

</TabItem>
</Tabs>

我们鼓励您试用此功能并在 [YouTrack](https://kotl.in/issue) 中提交所有报告，以帮助我们在 Kotlin 1.9.0 中将其设置为默认值。

请在 [此 KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/inline-classes) 中了解有关 Kotlin 内联类开发的更多信息。

## 新的 Kotlin/Wasm 目标平台

Kotlin/Wasm (Kotlin WebAssembly) 在此版本中进入 [Experimental](components-stability#stability-levels-explained) 阶段。
Kotlin 团队认为 [WebAssembly](https://webassembly.org/) 是一项很有前途的技术，并希望找到
更好的方式让您使用它并获得 Kotlin 的所有好处。

WebAssembly 二进制格式独立于平台，因为它使用自己的虚拟机运行。 几乎所有现代
浏览器都已经支持 WebAssembly 1.0。 要设置运行 WebAssembly 的环境，您只需要启用
Kotlin/Wasm 目标平台的实验性垃圾回收模式即可。 您可以在此处找到详细说明：[如何启用 Kotlin/Wasm](#how-to-enable-kotlin-wasm)。

我们想强调新的 Kotlin/Wasm 目标平台的以下优点：

* 与 `wasm32` Kotlin/Native 目标平台相比，编译速度更快，因为 Kotlin/Wasm 不必使用 LLVM。
* 与 `wasm32` 目标平台相比，更容易与 JS 互操作和与浏览器集成，这得益于 [Wasm 垃圾回收](https://github.com/WebAssembly/gc)。
* 与 Kotlin/JS 和 JavaScript 相比，应用程序启动速度可能更快，因为 Wasm 具有紧凑且
  易于解析的字节码。
* 与 Kotlin/JS 和 JavaScript 相比，应用程序运行时性能得到改进，因为 Wasm 是一种静态类型语言。

从 1.8.20 版本开始，您可以在实验性项目中使用 Kotlin/Wasm。
我们开箱即用地为 Kotlin/Wasm 提供了 Kotlin 标准库 (`stdlib`) 和测试库 (`kotlin.test`)。
IDE 支持将在未来的版本中添加。

[请在此 YouTube 视频中了解有关 Kotlin/Wasm 的更多信息](https://www.youtube.com/watch?v=-pqz9sKXatw)。

### 如何启用 Kotlin/Wasm

要启用和测试 Kotlin/Wasm，请更新您的 `build.gradle.kts` 文件：

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

请查看 [包含 Kotlin/Wasm 示例的 GitHub 仓库](https://github.com/Kotlin/kotlin-wasm-examples)。

要运行 Kotlin/Wasm 项目，您需要更新目标环境的设置：

<Tabs>
<TabItem value="Chrome" label="Chrome">

* 对于版本 109：

  使用 `--js-flags=--experimental-wasm-gc` 命令行参数运行应用程序。

* 对于版本 110 或更高版本：

    1. 在您的浏览器中转到 `chrome://flags/#enable-webassembly-garbage-collection`。
    2. 启用 **WebAssembly Garbage Collection**。
    3. 重新启动您的浏览器。

</TabItem>
<TabItem value="Firefox" label="Firefox">

对于版本 109 或更高版本：

1. 在您的浏览器中转到 `about:config`。
2. 启用 `javascript.options.wasm_function_references` 和 `javascript.options.wasm_gc` 选项。
3. 重新启动您的浏览器。

</TabItem>
<TabItem value="Edge" label="Edge">

对于版本 109 或更高版本：

使用 `--js-flags=--experimental-wasm-gc` 命令行参数运行应用程序。

</TabItem>
</Tabs>

### 留下您对 Kotlin/Wasm 的反馈

我们感谢您的任何反馈！

* 在 Kotlin Slack 上直接向开发者提供您的反馈 – [获取邀请](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up?_gl=1*ju6cbn*_ga*MTA3MTk5NDkzMC4xNjQ2MDY3MDU4*_ga_9J976DJZ68*MTY1ODMzNzA3OS4xMDAuMS4xNjU4MzQwODEwLjYw)
  并加入 [#webassembly](https://kotlinlang.slack.com/archives/CDFP59223) 频道。
* 在 [此 YouTrack issue](https://youtrack.jetbrains.com/issue/KT-56492) 上报告您在使用 Kotlin/Wasm 时遇到的任何问题。

## Kotlin/JVM

Kotlin 1.8.20 引入了 [Java 合成属性引用的预览](#preview-of-java-synthetic-property-references)
并 [默认情况下支持 kapt 桩生成任务中的 JVM IR 后端](#support-for-the-jvm-ir-backend-in-kapt-stub-generating-task-by-default)。

### Java 合成属性引用的预览

此功能是 [Experimental](components-stability#stability-levels-explained)。
它可能会随时删除或更改。 仅用于评估目的。
我们欢迎您在 [YouTrack](https://kotl.in/issue) 中对此提出反馈。

Kotlin 1.8.20 引入了创建对 Java 合成属性的引用的能力，例如，对于以下 Java 代码：

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

Kotlin 始终允许您编写 `person.age`，其中 `age` 是一个合成属性。
现在，您还可以创建对 `Person::age` 和 `person::age` 的引用。 所有相同的操作也适用于 `name`。

```kotlin
val persons = listOf(Person("Jack", 11), Person("Sofie", 12), Person("Peter", 11))
    persons
        // 调用对 Java 合成属性的引用：
        .sortedBy(Person::age)
        // 通过 Kotlin 属性语法调用 Java getter：
        .forEach { person `->` println(person.name) }
```

#### 如何启用 Java 合成属性引用

要试用此功能，请启用 `-language-version 1.9` 编译器选项。
在 Gradle 项目中，您可以通过将以下内容添加到 `build.gradle(.kts)` 中来实现：

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

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

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
tasks
    .withType(org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask.class)
    .configureEach {
        compilerOptions.languageVersion =
            org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_1_9
    }
```

</TabItem>
</Tabs>

### 默认情况下支持 kapt 桩生成任务中的 JVM IR 后端

在 Kotlin 1.7.20 中，我们引入了 [对 kapt 桩生成任务中的 JVM IR 后端的支持](whatsnew1720#support-for-the-jvm-ir-backend-in-kapt-stub-generating-task)。 从此版本开始，此支持默认情况下有效。 您不再需要在 `gradle.properties` 中指定 `kapt.use.jvm.ir=true` 来启用它。
我们欢迎您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-49682) 中对此功能提出反馈。

## Kotlin/Native

Kotlin 1.8.20 包括对支持的 Kotlin/Native 目标平台、与 Objective-C 的互操作性以及 CocoaPods Gradle 插件的改进的更改，以及其他更新：

* [Kotlin/Native 目标平台更新](#update-for-kotlin-native-targets)
* [弃用旧版内存管理器](#deprecation-of-the-legacy-memory-manager)
* [支持带有 @import 指令的 Objective-C 标头](#support-for-objective-c-headers-with-import-directives)
* [支持 Cocoapods Gradle 插件中的仅链接模式](#support-for-the-link-only-mode-in-cocoapods-gradle-plugin)
* [将 UIKit 中的 Objective-C 扩展作为类成员导入](#import-objective-c-extensions-as-class-members-in-uikit)
* [在编译器中重新实现编译器缓存管理](#reimplementation-of-compiler-cache-management-in-the-compiler)
* [弃用 Cocoapods Gradle 插件中的 `useLibraries()` ](#deprecation-of-uselibraries-in-cocoapods-gradle-plugin)
  
### Kotlin/Native 目标平台更新
  
Kotlin 团队决定重新审视 Kotlin/Native 支持的目标平台列表，将其分为几个层级，
并从 Kotlin 1.8.20 开始弃用其中的一些目标平台。 有关支持和已弃用目标的完整列表，请参阅 [Kotlin/Native 目标平台支持](native-target-support)
部分。

以下目标平台已在 Kotlin 1.8.20 中弃用，将在 1.9.20 中删除：

* `iosArm32`
* `watchosX86`
* `wasm32`
* `mingwX86`
* `linuxArm32Hfp`
* `linuxMips32`
* `linuxMipsel32`

对于剩余的目标平台，现在有三个支持层级，具体取决于 Kotlin/Native 编译器中对目标平台的支持和测试程度。 可以将目标平台移动到不同的层级。 例如，我们将尽最大努力
在未来为 `iosArm64` 提供全面支持，因为它对于 [Kotlin 多平台](multiplatform-intro)
非常重要。

如果您是库的作者，这些目标平台层级可以帮助您决定要在 CI 工具上测试哪些目标平台以及要跳过哪些目标平台。 Kotlin 团队将在开发官方 Kotlin 库（例如 [kotlinx.coroutines](coroutines-guide)）时使用相同的方法。

请查看我们的 [博客文章](https://blog.jetbrains.com/kotlin/2023/02/update-regarding-kotlin-native-targets/) 以
了解有关这些更改原因的更多信息。

### 弃用旧版内存管理器

从 1.8.20 开始，旧版内存管理器已被弃用，将在 1.9.20 中删除。
[新的内存管理器](native-memory-manager) 在 1.7.20 中默认启用，并且一直在接受进一步的
稳定性更新和性能改进。

如果您仍在使用旧版内存管理器，请从您的 `gradle.properties` 中删除 `kotlin.native.binary.memoryModel=strict` 选项，并按照我们的 [迁移指南](native-migration-guide) 进行必要的更改。

新的内存管理器不支持 `wasm32` 目标平台。 此目标平台也已[从此版本开始弃用](#update-for-kotlin-native-targets)，将在 1.9.20 中删除。

### 支持带有 @import 指令的 Objective-C 标头

此功能是 [Experimental](components-stability#stability-levels-explained)。
它可能会随时删除或更改。 需要选择加入（请参阅下面的详细信息）。 仅用于评估目的。
我们欢迎您在 [YouTrack](https://kotl.in/issue) 中对此提出反馈。

Kotlin/Native 现在可以导入带有 `@import` 指令的 Objective-C 标头。 此功能对于使用具有自动生成的 Objective-C 标头或用 Swift 编写的 CocoaPods 依赖项类的 Swift 库非常有用。

以前，cinterop 工具无法分析通过 `@import` 指令依赖于 Objective-C 模块的标头。
原因是它缺少对 `-fmodules` 选项的支持。

从 Kotlin 1.8.20 开始，您可以使用带有 `@import` 的 Objective-C 标头。 为此，请在定义文件中将 `-fmodules` 选项作为 `compilerOpts` 传递给编译器。 如果您使用 [CocoaPods 集成](native-cocoapods)，请在此配置块中指定 cinterop 选项：`pod()` 函数，如下所示：

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

这是一个 [高度期待的功能](https://youtrack.jetbrains.com/issue/KT-39120)，我们欢迎您在 [YouTrack](https://kotl.in/issue) 中提供有关它的反馈，以帮助我们在未来的版本中将其设置为默认值。

### 支持 Cocoapods Gradle 插件中的仅链接模式

使用 Kotlin 1.8.20，您可以仅将 Pod 依赖项与动态框架一起使用以进行链接，
而无需生成 cinterop 绑定。 当已经生成 cinterop 绑定时，这可能会派上用场。

考虑一个包含 2 个模块的项目，一个库和一个应用程序。 该库依赖于一个 Pod，但不生成框架，
仅生成一个 `.klib`。 该应用程序依赖于该库并生成一个动态框架。
在这种情况下，您需要将此框架与该库所依赖的 Pod 链接，
但您不需要 cinterop 绑定，因为它们已经为该库生成。

要启用此功能，请在使用 Pod 添加依赖项时使用 `linkOnly` 选项或构建器属性：

```kotlin
cocoapods {
    summary = "CocoaPods test library"
    homepage = "https://github.com/JetBrains/kotlin"

    pod("Alamofire", linkOnly = true) {
        version = "5.7.0"
    }
}
```

如果将此选项与静态框架一起使用，它将完全删除 Pod 依赖项，因为 Pod 不用于
静态框架链接。

:::

### 将 UIKit 中的 Objective-C 扩展作为类成员导入

自 Xcode 14.1 以来，Objective-C 类中的某些方法已移至类别成员。 这导致生成
不同的 Kotlin API，并且这些方法作为 Kotlin 扩展而不是方法导入。

当使用 UIKit 覆盖方法时，您可能遇到了由此导致的问题。 例如，在 Kotlin 中对 UIVIew 进行子类化时，变得
无法覆盖 `drawRect()` 或 `layoutSubviews()` 方法。

自 1.8.20 起，在与 NSView 和 UIView 类相同的标头中声明的类别成员将作为
这些类的成员导入。 这意味着可以像任何其他方法一样轻松地覆盖从 NSView 和 UIView 进行子类化的方法。

如果一切顺利，我们计划默认对所有 Objective-C 类启用此行为。

### 在编译器中重新实现编译器缓存管理

为了加速编译器缓存的发展，我们已将编译器缓存管理从 Kotlin Gradle 插件移至
Kotlin/Native 编译器。 这为几个重要的改进解锁了工作，包括与编译
时间和编译器缓存灵活性相关的改进。

如果您遇到一些问题并且需要返回到旧的行为，请使用 `kotlin.native.cacheOrchestration=gradle`
Gradle 属性。

我们欢迎您在 [YouTrack 中](https://kotl.in/issue) 提供有关此内容的反馈。

### 弃用 Cocoapods Gradle 插件中的 useLibraries()

Kotlin 1.8.20 开始弃用用于静态库的 [CocoaPods 集成](native-cocoapods) 中的 `useLibraries()` 函数的周期。

我们引入了 `useLibraries()` 函数以允许依赖于包含静态库的 Pod。 随着时间的推移，这种情况变得非常罕见。 大多数 Pod 都是按源代码分发的，而 Objective-C 框架或 XCFramework 是
二进制分发的常见选择。

由于此函数不受欢迎，并且它创建了使 Kotlin CocoaPods Gradle
插件的开发复杂化的问题，因此我们决定弃用它。

有关框架和 XCFramework 的更多信息，请参阅 [构建最终原生二进制文件](multiplatform-build-native-binaries)。

## Kotlin 多平台

Kotlin 1.8.20 致力于通过以下 Kotlin 多平台更新来改善开发人员体验：

* [设置源集层次结构的新方法](#new-approach-to-source-set-hierarchy)
* [Kotlin 多平台中 Gradle 组合构建的预览](#preview-of-gradle-composite-builds-support-in-kotlin-multiplatform)
* [改进了 Xcode 中 Gradle 错误的输出](#improved-output-for-gradle-errors-in-xcode)

### 设置源集层次结构的新方法

:::note
设置源集层次结构的新方法是 [Experimental](components-stability#stability-levels-explained)。
它可能会在未来的 Kotlin 版本中更改，恕不另行通知。 需要选择加入（请参阅下面的详细信息）。
我们欢迎您在 [YouTrack](https://kotl.in/issue) 中提供反馈。

Kotlin 1.8.20 提供了一种在您的多平台项目中设置源集层次结构的新方法 – 默认目标
层次结构。 新方法旨在替换目标快捷方式，如 `ios`，它们具有 [设计缺陷](#why-replace-shortcuts)。

默认目标层次结构背后的想法很简单：您显式声明您的项目编译到的所有目标，并且
Kotlin Gradle 插件会自动根据指定的目标创建共享源集。

#### 设置您的项目

考虑以下简单多平台移动应用程序的示例：

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

您可以将默认目标层次结构视为所有可能目标及其共享源集的模板。 当
您在代码中声明最终目标 `android`、`iosArm64` 和 `iosSimulatorArm64` 时，Kotlin Gradle 插件会
从模板中找到合适的共享源集并为您创建它们。 生成的层次结构如下所示：

<img src="/img/default-hierarchy-example.svg" alt="使用默认目标层次结构的示例" width="350" style={{verticalAlign: 'middle'}}/>

绿色源集是实际创建并在项目中存在的源集，而来自默认模板的灰色源集则被忽略。
如您所见，Kotlin Gradle 插件尚未创建 `watchos` 源集，例如，因为
项目中没有 watchOS 目标。

如果您添加一个 watchOS 目标，例如 `