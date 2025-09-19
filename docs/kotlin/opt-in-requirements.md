[//]: # (title: 显式选择加入要求)

Kotlin 标准库提供了一种机制，用于要求并明确同意使用某些 API 元素。该机制允许库作者告知用户需要显式选择加入的特定条件，例如当 API 处于实验性状态且未来可能发生变化时。

为了保护用户，编译器会针对这些条件发出警告，并要求用户显式选择加入才能使用该 API。

## 显式选择加入 API

如果库作者将库 API 中的一个声明标记为**[需要显式选择加入](#require-opt-in-to-use-api)**，则在您的代码中使用它之前，您必须明确同意。有几种方法可以显式选择加入。我们建议选择最适合您情况的方法。

### 局部显式选择加入

为了在您的代码中使用特定 API 元素时局部显式选择加入，请使用 [`@OptIn`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-opt-in/) 注解并引用实验性 API 标记。例如，假设您想使用 `DateProvider` 类，它需要显式选择加入：

```kotlin
// 库代码
@RequiresOptIn(message = "此 API 为实验性的。未来可能在不另行通知的情况下发生变化。")
@Retention(AnnotationRetention.BINARY)
@Target(AnnotationTarget.CLASS, AnnotationTarget.FUNCTION)
annotation class MyDateTime

@MyDateTime
// 一个需要显式选择加入的类
class DateProvider
```

在您的代码中，在声明一个使用 `DateProvider` 类的函数之前，添加 `@OptIn` 注解并引用 `MyDateTime` 注解类：

```kotlin
// 客户端代码
@OptIn(MyDateTime::class)

// 使用 DateProvider
fun getDate(): Date {
    val dateProvider: DateProvider
    // ...
}
```

重要的是要注意，使用这种方法时，如果 `getDate()` 函数在代码的其他地方被调用或被其他开发者使用，则不需要显式选择加入：

```kotlin
// 客户端代码
@OptIn(MyDateTime::class)

// 使用 DateProvider
fun getDate(): Date {
    val dateProvider: DateProvider
    // ...
}

fun displayDate() {
    // OK：不需要显式选择加入
    println(getDate())
}
```

显式选择加入要求不会传播，这意味着其他人可能在不知情的情况下使用实验性 API。为了避免这种情况，传播显式选择加入要求会更安全。

#### 传播显式选择加入要求

当您在代码中使用旨在供第三方使用的 API（例如在库中）时，您可以将其显式选择加入要求也传播到您的 API。为此，请使用库中使用的相同**[显式选择加入要求注解](#create-opt-in-requirement-annotations)**标记您的声明。

例如，在声明一个使用 `DateProvider` 类的函数之前，添加 `@MyDateTime` 注解：

```kotlin
// 客户端代码
@MyDateTime
fun getDate(): Date {
    // OK：该函数也需要显式选择加入
    val dateProvider: DateProvider
    // ...
}

fun displayDate() {
    println(getDate())
    // 错误：getDate() 需要显式选择加入
}
```

如您在此示例中所示，带注解的函数似乎是 `@MyDateTime` API 的一部分。显式选择加入会将显式选择加入要求传播给 `getDate()` 函数的用户。

如果 API 元素的签名包含一个需要显式选择加入的类型，则签名本身也必须需要显式选择加入。否则，如果 API 元素不需要显式选择加入，但其签名包含需要显式选择加入的类型，则使用它会触发错误。

```kotlin
// 客户端代码
@MyDateTime
fun getDate(dateProvider: DateProvider = DateProvider()): Date

@MyDateTime
fun displayDate() {
    // OK：该函数也需要显式选择加入
    println(getDate())
}
```

同样，如果您将 `@OptIn` 应用于其签名包含需要显式选择加入的类型的声明，则显式选择加入要求仍然会传播：

```kotlin
// 客户端代码
@OptIn(MyDateTime::class)
// 由于签名中包含 DateProvider 而传播显式选择加入
fun getDate(dateProvider: DateProvider = DateProvider()): Date

fun displayDate() {
    println(getDate())
    // 错误：getDate() 需要显式选择加入
}
```

传播显式选择加入要求时，需要注意的是，如果一个 API 元素变得稳定并且不再有显式选择加入要求，则任何仍然有显式选择加入要求的其他 API 元素仍将保持实验性。例如，假设库作者移除了 `getDate()` 函数的显式选择加入要求，因为它现在已经稳定：

```kotlin
// 库代码
// 无显式选择加入要求
fun getDate(): Date {
    val dateProvider: DateProvider
    // ...
}
```

如果您在不移除显式选择加入注解的情况下使用 `displayDate()` 函数，它仍然保持实验性，即使不再需要显式选择加入了：

```kotlin
// 客户端代码

// 仍然是实验性的！
@MyDateTime
fun displayDate() {
    // 使用了一个稳定的库函数
    println(getDate())
}
```

#### 显式选择加入多个 API

为了显式选择加入多个 API，请使用所有显式选择加入要求注解标记声明。例如：

```kotlin
@ExperimentalCoroutinesApi
@FlowPreview
```

或者，使用 `@OptIn` 替代：

```kotlin
@OptIn(ExperimentalCoroutinesApi::class, FlowPreview::class)
```

### 显式选择加入文件

为了对文件中所有函数和类使用需要显式选择加入的 API，请在包声明和导入之前，将文件级注解 `@file:OptIn` 添加到文件顶部。

 ```kotlin
 // 客户端代码
 @file:OptIn(MyDateTime::class)
 ```

### 显式选择加入模块

> `-opt-in` 编译器选项自 Kotlin 1.6.0 起可用。对于更早的 Kotlin 版本，请使用 `-Xopt-in`。
>
{style="note"}

如果您不想为每个需要显式选择加入的 API 用法添加注解，您可以为整个模块显式选择加入它们。为了显式选择加入模块中的 API，请使用参数 `-opt-in` 编译它，指定您使用的 API 的显式选择加入要求注解的完全限定名：`-opt-in=org.mylibrary.OptInAnnotation`。使用此参数编译的效果与模块中的每个声明都带有注解`@OptIn(OptInAnnotation::class)` 相同。

如果您使用 Gradle 构建模块，可以像这样添加参数：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
import org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask
// ...

tasks.named<KotlinCompilationTask<*>>("compileKotlin").configure {
    compilerOptions.optIn.add("org.mylibrary.OptInAnnotation")
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
import org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask
// ...

tasks.named('compileKotlin', KotlinCompilationTask) {
    compilerOptions {
        optIn.add('org.mylibrary.OptInAnnotation')
    }
}
```

</tab>
</tabs>

如果您的 Gradle 模块是多平台模块，请使用 `optIn` 方法：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    compilerOptions {
        optIn.add("org.mylibrary.OptInAnnotation")
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    compilerOptions {
        optIn.add('org.mylibrary.OptInAnnotation')
    }
}
```

</tab>
</tabs>

对于 Maven，使用以下内容：

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

要在模块级别显式选择加入多个 API，请为您模块中使用的每个显式选择加入要求标记添加一个上述参数。

### 显式选择加入以继承类或接口

有时，库作者提供 API 但希望要求用户在扩展它之前明确选择加入。例如，库 API 可能对于使用来说是稳定的，但对于继承则不是，因为它未来可能通过新的抽象函数进行扩展。库作者可以通过使用 [`@SubclassOptInRequired`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-subclass-opt-in-required/) 注解标记 [开放类](inheritance.md) 或 [抽象类](classes.md#abstract-classes) 以及 [非函数式接口](interfaces.md) 来强制执行此要求。

为了显式选择加入以使用此类 API 元素并在您的代码中扩展它，请使用 `@SubclassOptInRequired` 注解并引用该注解类。例如，假设您想使用 `CoreLibraryApi` 接口，它需要显式选择加入：

```kotlin
// 库代码
@RequiresOptIn(
 level = RequiresOptIn.Level.WARNING,
 message = "此库中的接口是实验性的"
)
annotation class UnstableApi()

@SubclassOptInRequired(UnstableApi::class)
// 一个需要显式选择加入才能扩展的接口
interface CoreLibraryApi
```

在您的代码中，在创建继承自 `CoreLibraryApi` 接口的新接口之前，添加 `@SubclassOptInRequired` 注解，并引用 `UnstableApi` 注解类：

```kotlin
// 客户端代码
@SubclassOptInRequired(UnstableApi::class)
interface SomeImplementation : CoreLibraryApi
```

请注意，当您在类上使用 `@SubclassOptInRequired` 注解时，显式选择加入要求不会传播到任何[内部类或嵌套类](nested-classes.md)：

```kotlin
// 库代码
@RequiresOptIn
annotation class ExperimentalFeature

@SubclassOptInRequired(ExperimentalFeature::class)
open class FileSystem {
    open class File
}

// 客户端代码

// 需要显式选择加入
class NetworkFileSystem : FileSystem()

// 嵌套类
// 不需要显式选择加入
class TextFile : FileSystem.File()
```

或者，您可以通过使用 `@OptIn` 注解来显式选择加入。您还可以使用实验性标记注解将要求进一步传播到代码中该类的任何使用处：

```kotlin
// 客户端代码
// 使用 @OptIn 注解
@OptInRequired(UnstableApi::class)
interface SomeImplementation : CoreLibraryApi

// 使用引用注解类的注解
// 进一步传播显式选择加入要求
@UnstableApi
interface SomeImplementation : CoreLibraryApi
```

## 要求显式选择加入才能使用 API

您可以要求库的用户在能够使用您的 API 之前显式选择加入。此外，您可以告知用户使用您的 API 的任何特殊条件，直到您决定移除显式选择加入要求。

### 创建显式选择加入要求注解

为了要求显式选择加入才能使用模块的 API，请创建一个注解类作为**显式选择加入要求注解**。该类必须使用 [`@RequiresOptIn`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-requires-opt-in/) 进行注解：

```kotlin
@RequiresOptIn
@Retention(AnnotationRetention.BINARY)
@Target(AnnotationTarget.CLASS, AnnotationTarget.FUNCTION)
annotation class MyDateTime
```

显式选择加入要求注解必须满足几个要求。它们必须具有：

* `BINARY` 或 `RUNTIME` [保留策略](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.annotation/-retention/)。
* `EXPRESSION`、`FILE`、`TYPE` 或 `TYPE_PARAMETER` 作为[目标](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.annotation/-target/)。
* 无参数。

显式选择加入要求可以具有以下两种严重程度[级别](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-requires-opt-in/-level/)之一：

* `RequiresOptIn.Level.ERROR`。显式选择加入是强制性的。否则，使用标记 API 的代码将无法编译。这是默认级别。
* `RequiresOptIn.Level.WARNING`。显式选择加入不是强制性的，但建议这样做。否则，编译器会发出警告。

要设置所需的级别，请指定 `@RequiresOptIn` 注解的 `level` 形参。

此外，您可以向 API 用户提供 `message`。编译器会将此消息显示给尝试在未显式选择加入的情况下使用 API 的用户：

```kotlin
@RequiresOptIn(level = RequiresOptIn.Level.WARNING, message = "此 API 为实验性的。未来可能发生不兼容的变更。")
@Retention(AnnotationRetention.BINARY)
@Target(AnnotationTarget.CLASS, AnnotationTarget.FUNCTION)
annotation class ExperimentalDateTime
```

如果您发布多个需要显式选择加入的独立特性，请为每个特性声明一个注解。这使得您的 API 对您的客户端更安全，因为他们只能使用他们明确接受的特性。这也意味着您可以独立地从特性中移除显式选择加入要求，从而使您的 API 更易于维护。

### 标记 API 元素

为了要求显式选择加入才能使用 API 元素，请使用显式选择加入要求注解标记其声明：

```kotlin
@MyDateTime
class DateProvider

@MyDateTime
fun getTime(): Time {}
```

请注意，对于某些语言元素，显式选择加入要求注解不适用：

* 您不能注解属性的幕后字段或 getter，只能注解属性本身。
* 您不能注解局部变量或值形参。

## 要求显式选择加入才能扩展 API

有时，您可能希望对您的 API 的哪些特定部分可以被使用和扩展进行更细粒度的控制。例如，当您有一些 API 在使用上是稳定的，但：

* 由于持续演进而导致**实现不稳定**，例如当您拥有一系列接口，并且期望在不提供默认实现的情况下添加新的抽象函数时。
* **实现微妙或脆弱**，例如需要协同行为的独立函数。
* 具有可能在未来以向后不兼容的方式为外部实现**削弱的契约**，例如将输入形参 `T` 更改为可空版本 `T?`，而以前的代码未考虑 `null` 值的情况。

在这种情况下，您可以要求用户在进一步扩展您的 API 之前显式选择加入。用户可以通过继承 API 或实现抽象函数来扩展您的 API。通过使用 [`@SubclassOptInRequired`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-subclass-opt-in-required/) 注解，您可以强制对 [开放类](inheritance.md) 或 [抽象类](classes.md#abstract-classes) 以及 [非函数式接口](interfaces.md) 执行此显式选择加入要求。

要将显式选择加入要求添加到 API 元素，请使用 [`@SubclassOptInRequired`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-subclass-opt-in-required/) 注解并引用该注解类：

```kotlin
@RequiresOptIn(
 level = RequiresOptIn.Level.WARNING,
 message = "此库中的接口是实验性的"
)
annotation class UnstableApi()

@SubclassOptInRequired(UnstableApi::class)
// 一个需要显式选择加入才能扩展的接口
interface CoreLibraryApi
```

请注意，当您使用 `@SubclassOptInRequired` 注解要求显式选择加入时，该要求不会传播到任何[内部类或嵌套类](nested-classes.md)。

有关如何在您的 API 中使用 `@SubclassOptInRequired` 注解的实际示例，请查看 `kotlinx.coroutines` 库中的 [`SharedFlow`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/-shared-flow/) 接口。

## 预稳定 API 的显式选择加入要求

如果您对尚未稳定的特性使用显式选择加入要求，请仔细处理 API 的演进，以避免破坏客户端代码。

一旦您的预稳定 API 演进并以稳定状态发布，请从您的声明中移除显式选择加入要求注解。客户端届时可以不受限制地使用它们。但是，您应该将注解类保留在模块中，以便现有客户端代码保持兼容。

为了鼓励 API 用户通过从其代码中移除任何注解并重新编译来更新其模块，请将注解标记为 [`@Deprecated`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-deprecated/)，并在弃用消息中提供解释。

```kotlin
@Deprecated("此显式选择加入要求不再使用。请从您的代码中移除其用法。")
@RequiresOptIn
annotation class ExperimentalDateTime