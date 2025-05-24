---
title: 选择加入要求
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Kotlin 标准库提供了一种机制，用于要求和明确同意使用某些 API 元素。
此机制允许库作者告知用户需要选择加入的特定条件，
例如，当 API 处于实验状态并且将来可能发生更改时。

为了保护用户，编译器会警告这些情况，并要求他们在可以使用 API 之前选择加入。

## 选择加入 API

如果库作者将其库 API 中的声明标记为**[需要选择加入才能使用 API](#require-opt-in-to-use-api)**，
则您必须先明确同意，才能在代码中使用它。
有几种选择加入的方式。我们建议选择最适合您情况的方法。

### 在本地选择加入

要在代码中使用特定的 API 元素时选择加入，请使用 [`@OptIn`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-opt-in/)
注解，并引用实验性 API 标记。例如，假设您要使用需要选择加入的 `DateProvider` 类：

```kotlin
// Library code (库代码)
@RequiresOptIn(message = "This API is experimental. It could change in the future without notice.")
@Retention(AnnotationRetention.BINARY)
@Target(AnnotationTarget.CLASS, AnnotationTarget.FUNCTION)
annotation class MyDateTime

@MyDateTime
// A class requiring opt-in （一个需要选择加入的类）
class DateProvider
```

在您的代码中，在声明使用 `DateProvider` 类的函数之前，添加带有 `@OptIn` 注解，
并引用 `MyDateTime` 注解类：

```kotlin
// Client code (客户端代码)
@OptIn(MyDateTime::class)

// Uses DateProvider （使用 DateProvider）
fun getDate(): Date {
    val dateProvider: DateProvider
    // ...
}
```

重要的是要注意，使用这种方法，如果 `getDate()` 函数在您的代码中的其他地方被调用或被
另一位开发人员使用，则不需要选择加入：

```kotlin
// Client code (客户端代码)
@OptIn(MyDateTime::class)

// Uses DateProvider （使用 DateProvider）
fun getDate(): Date {
    val dateProvider: DateProvider
    // ...
}

fun displayDate() {
    // OK: No opt-in is required （OK：不需要选择加入）
    println(getDate()) 
}
```

选择加入要求不会传播，这意味着其他人可能在不知情的情况下使用实验性 API。为了避免这种情况，
传播选择加入要求更安全。

#### 传播选择加入要求

当您在代码中使用旨在供第三方使用的 API（例如在库中）时，您可以将其选择加入要求
传播到您的 API。为此，请使用库使用的相同的**[选择加入要求注解](#create-opt-in-requirement-annotations)**标记您的声明。

例如，在声明使用 `DateProvider` 类的函数之前，添加 `@MyDateTime` 注解：

```kotlin
// Client code (客户端代码)
@MyDateTime
fun getDate(): Date {
    // OK: the function requires opt-in as well （OK：该函数也需要选择加入）
    val dateProvider: DateProvider
    // ...
}

fun displayDate() {
    println(getDate())
    // Error: getDate() requires opt-in （错误：getDate() 需要选择加入）
}
```

正如您在本例中所看到的，带注解的函数似乎是 `@MyDateTime` API 的一部分。
选择加入会将选择加入要求传播给 `getDate()` 函数的用户。

如果 API 元素的签名包含需要选择加入的类型，则签名本身也必须需要选择加入。
否则，如果 API 元素不需要选择加入，但其签名包含需要选择加入的类型，则使用它会触发错误。

```kotlin
// Client code (客户端代码)
@MyDateTime
fun getDate(dateProvider: DateProvider = DateProvider()): Date

@MyDateTime
fun displayDate() {
    // OK: the function requires opt-in as well （OK：该函数也需要选择加入）
    println(getDate())
}
```

类似地，如果您将 `@OptIn` 应用于签名包含需要选择加入的类型的声明，则选择加入要求
仍然会传播：

```kotlin
// Client code (客户端代码)
@OptIn(MyDateTime::class)
// Propagates opt-in due to DateProvider in the signature （由于签名中的 DateProvider 而传播选择加入）
fun getDate(dateProvider: DateProvider = DateProvider()): Date

fun displayDate() {
    println(getDate())
    // Error: getDate() requires opt-in （错误：getDate() 需要选择加入）
}
```

在传播选择加入要求时，重要的是要理解，如果 API 元素变得稳定并且不再
具有选择加入要求，则任何仍然具有选择加入要求的其他 API 元素仍然是实验性的。例如，
假设库作者删除了 `getDate()` 函数的选择加入要求，因为它现在是稳定的：

```kotlin
// Library code (库代码)
// No opt-in requirement （没有选择加入要求）
fun getDate(): Date {
    val dateProvider: DateProvider
    // ...
}
```

如果您使用 `displayDate()` 函数而不删除选择加入注解，则它仍然是实验性的，即使
不再需要选择加入：

```kotlin
// Client code (客户端代码)

// Still experimental! （仍然是实验性的！）
@MyDateTime 
fun displayDate() {
    // Uses a stable library function （使用稳定的库函数）
    println(getDate())
}
```

#### 选择加入多个 API

要选择加入多个 API，请使用所有选择加入要求注解标记声明。例如：

```kotlin
@ExperimentalCoroutinesApi
@FlowPreview
```

或者使用 `@OptIn`：

```kotlin
@OptIn(ExperimentalCoroutinesApi::class, FlowPreview::class)
```

### 选择加入文件

要使用需要为文件中所有函数和类选择加入的 API，请将文件级别的注解 `@file:OptIn`
添加到文件顶部，位于包规范和导入之前。

 ```kotlin
 // Client code (客户端代码)
 @file:OptIn(MyDateTime::class)
 ```

### 选择加入模块

:::note
`-opt-in` 编译器选项自 Kotlin 1.6.0 起可用。对于早期的 Kotlin 版本，请使用 `-Xopt-in`。

:::

如果您不想注解每个需要选择加入的 API 的用法，您可以为整个模块选择加入它们。
要选择加入在模块中使用 API，请使用参数 `-opt-in` 编译它，
指定您使用的 API 的选择加入要求注解的完全限定名称：`-opt-in=org.mylibrary.OptInAnnotation`。
使用此参数进行编译的效果与模块中的每个声明都具有注解 `@OptIn(OptInAnnotation::class)` 相同。

如果您使用 Gradle 构建模块，则可以添加如下参数：

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
import org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask
// ...

tasks.named<KotlinCompilationTask<*>>("compileKotlin").configure {
    compilerOptions.optIn.add("org.mylibrary.OptInAnnotation")
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
import org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask
// ...

tasks.named('compileKotlin', KotlinCompilationTask) {
    compilerOptions {
        optIn.add('org.mylibrary.OptInAnnotation')
    }
}
```

</TabItem>
</Tabs>

如果您的 Gradle 模块是多平台模块，请使用 `optIn` 方法：

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
sourceSets {
    all {
        languageSettings.optIn("org.mylibrary.OptInAnnotation")
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
sourceSets {
    all {
        languageSettings {
            optIn('org.mylibrary.OptInAnnotation')
        }
    }
}
```

</TabItem>
</Tabs>

对于 Maven，请使用以下内容：

```xml
<build>
<plugins>
<plugin>
            <groupId>org.jetbrains.kotlin</groupId>
            <artifactId>kotlin-maven-plugin</artifactId>
            <version>${kotlin.version}</version>
            <executions>...</executions>
            <configuration>
                <args>
                    <arg>-opt-in=org.mylibrary.OptInAnnotation</arg>                    
                </args>
            </configuration>
        </plugin>
    </plugins>
</build>
```

要在模块级别选择加入多个 API，请为您模块中使用的每个选择加入要求标记添加一个描述的参数。

### 选择加入以从类或接口继承

有时，库作者会提供 API，但希望要求用户在扩展它之前明确选择加入。
例如，库 API 可能对于使用是稳定的，但对于继承是不稳定的，因为它可能会在将来
使用新的抽象函数进行扩展。库作者可以通过使用 [`@SubclassOptInRequired`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-subclass-opt-in-required/) 注解标记 [open](inheritance) 或 [抽象类](classes#abstract-classes) 和 [非函数式接口](interfaces) 来强制执行此操作。

要选择加入以使用此类 API 元素并在您的代码中扩展它，请使用 `@SubclassOptInRequired` 注解，
并引用注解类。例如，假设您要使用需要选择加入的 `CoreLibraryApi` 接口：

```kotlin
// Library code (库代码)
@RequiresOptIn(
 level = RequiresOptIn.Level.WARNING,
 message = "Interfaces in this library are experimental"
)
annotation class UnstableApi()

@SubclassOptInRequired(UnstableApi::class)
// An interface requiring opt-in to extend （一个需要选择加入才能扩展的接口）
interface CoreLibraryApi 
```

在您的代码中，在创建从 `CoreLibraryApi` 接口继承的新接口之前，添加带有 `@SubclassOptInRequired`
注解，并引用 `UnstableApi` 注解类：

```kotlin
// Client code (客户端代码)
@SubclassOptInRequired(UnstableApi::class)
interface SomeImplementation : CoreLibraryApi
```

请注意，当您在类上使用 `@SubclassOptInRequired` 注解时，选择加入要求不会传播到
任何[内部或嵌套类](nested-classes)：

```kotlin
// Library code (库代码)
@RequiresOptIn
annotation class ExperimentalFeature

@SubclassOptInRequired(ExperimentalFeature::class)
open class FileSystem {
    open class File
}

// Client code (客户端代码)

// Opt-in is required （需要选择加入）
class NetworkFileSystem : FileSystem()

// Nested class （嵌套类）
// No opt-in required （不需要选择加入）
class TextFile : FileSystem.File()
```

或者，您可以使用 `@OptIn` 注解选择加入。您还可以使用实验性标记注解
将要求进一步传播到您代码中该类的任何用法：

```kotlin
// Client code (客户端代码)
// With @OptIn annotation （使用 @OptIn 注解）
@OptIn(UnstableApi::class)
interface SomeImplementation : CoreLibraryApi

// With annotation referencing annotation class （使用引用注解类的注解）
// Propagates the opt-in requirement further （进一步传播选择加入要求）
@UnstableApi
interface SomeImplementation : CoreLibraryApi
```

## 要求选择加入才能使用 API

您可以要求您的库的用户在可以使用您的 API 之前选择加入。此外，您可以告知用户
使用您的 API 的任何特殊条件，直到您决定删除选择加入要求为止。

### 创建选择加入要求注解

要要求选择加入才能使用您模块的 API，请创建一个注解类用作**选择加入要求注解**。
此类必须使用 [`@RequiresOptIn`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-requires-opt-in/) 注解：

```kotlin
@RequiresOptIn
@Retention(AnnotationRetention.BINARY)
@Target(AnnotationTarget.CLASS, AnnotationTarget.FUNCTION)
annotation class MyDateTime
```

选择加入要求注解必须满足几个要求。它们必须具有：

* `BINARY` 或 `RUNTIME` [保留](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.annotation/-retention/)。
* `EXPRESSION`、`FILE`、`TYPE` 或 `TYPE_PARAMETER` 作为[目标](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.annotation/-target/)。
* 没有参数。

选择加入要求可以具有两个严重性[级别](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-requires-opt-in/-level/)之一：

* `RequiresOptIn.Level.ERROR`。选择加入是强制性的。否则，使用标记的 API 的代码将无法编译。这是默认级别。
* `RequiresOptIn.Level.WARNING`。选择加入不是强制性的，但建议这样做。没有它，编译器会发出警告。

要设置所需的级别，请指定 `@RequiresOptIn` 注解的 `level` 参数。

此外，您可以向 API 用户提供 `message`。编译器会向尝试使用 API
而不选择加入的用户显示此消息：

```kotlin
@RequiresOptIn(level = RequiresOptIn.Level.WARNING, message = "This API is experimental. It can be incompatibly changed in the future.")
@Retention(AnnotationRetention.BINARY)
@Target(AnnotationTarget.CLASS, AnnotationTarget.FUNCTION)
annotation class ExperimentalDateTime
```

如果您发布多个需要选择加入的独立功能，请为每个功能声明一个注解。
这使得您的客户端使用您的 API 更安全，因为他们只能使用他们明确接受的功能。
这也意味着您可以独立地从功能中删除选择加入要求，这使得您的 API 更容易
维护。

### 标记 API 元素

要要求选择加入才能使用 API 元素，请使用选择加入要求注解来注解其声明：

```kotlin
@MyDateTime
class DateProvider

@MyDateTime
fun getTime(): Time {}
```

请注意，对于某些语言元素，选择加入要求注解不适用：

* 您不能注解支持字段或属性的 getter，只能注解属性本身。
* 您不能注解局部变量或值参数。

## 要求选择加入才能扩展 API

有时，您可能希望对可以使用和
扩展的 API 的特定部分进行更精细的控制。例如，当您有一些 API 对于使用是稳定的，但：

* **由于正在进行的演变而导致实现不稳定**，例如当您有一系列接口，您希望在其中添加没有默认实现的新抽象函数时。
* **实现起来很微妙或脆弱**，例如需要以协调方式运行的各个函数。
* **具有可能在将来以向后不兼容的方式为外部实现削弱的契约**，例如将输入参数 `T` 更改为可为空的版本 `T?`，而代码以前没有考虑 `null` 值。

在这种情况下，您可以要求用户在可以进一步扩展您的 API 之前选择加入。用户可以通过从 API 继承或实现抽象函数来扩展您的 API。通过使用 [`@SubclassOptInRequired`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-subclass-opt-in-required/) 注解，
您可以强制执行此要求，以选择加入 [open](inheritance) 或 [抽象类](classes#abstract-classes) 和 [非函数式接口](interfaces)。

要将选择加入要求添加到 API 元素，请使用 [`@SubclassOptInRequired`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-subclass-opt-in-required/)
注解，并引用注解类：

```kotlin
@RequiresOptIn(
 level = RequiresOptIn.Level.WARNING,
 message = "Interfaces in this library are experimental"
)
annotation class UnstableApi()

@SubclassOptInRequired(UnstableApi::class)
// An interface requiring opt-in to extend （一个需要选择加入才能扩展的接口）
interface CoreLibraryApi 
```

请注意，当您使用 `@SubclassOptInRequired` 注解来要求选择加入时，该要求不会传播到
任何[内部或嵌套类](nested-classes)。

有关如何在您的 API 中使用 `@SubclassOptInRequired` 注解的真实示例，请查看 `kotlinx.coroutines` 库中的 [`SharedFlow`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/-shared-flow/)
接口。

## 预稳定 API 的选择加入要求

如果您对尚未稳定的功能使用选择加入要求，请谨慎处理 API 毕业，以避免
破坏客户端代码。

一旦您的预稳定 API 毕业并以稳定状态发布，请从
您的声明中删除选择加入要求注解。然后，客户端可以不受限制地使用它们。但是，您应该将注解类
保留在模块中，以便现有客户端代码保持兼容。

为了鼓励 API 用户通过从他们的代码中删除任何注解并重新编译来更新他们的模块，请将注解
标记为 [`@Deprecated`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-deprecated/) 并在弃用消息中提供解释。

```kotlin
@Deprecated("This opt-in requirement is not used anymore. Remove its usages from your code.")
@RequiresOptIn
annotation class ExperimentalDateTime
```