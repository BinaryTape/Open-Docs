[//]: # (title: 选择启用要求)

Kotlin 标准库提供了一种机制，用于在使用某些 API 元素时要求和给予明确同意。这种机制允许库作者告知用户需要明确选择启用的特定条件，例如当某个 API 处于实验性状态且未来可能发生更改时。

为了保护用户，编译器会警告这些条件，并要求用户在使用 API 之前选择启用。

## 选择启用 API

如果库作者将其库 API 中的某个声明标记为**[需要选择启用](#require-opt-in-to-use-api)**，则您必须在代码中使用它之前给予明确同意。有几种选择启用的方式。我们建议选择最适合您情况的方法。

### 局部选择启用

要在代码中使用特定 API 元素时局部选择启用它，请使用 [`@OptIn`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-opt-in/) 注解，并引用实验性 API 标记。例如，假设您想使用 `DateProvider` 类，该类需要选择启用：

```kotlin
// Library code
@RequiresOptIn(message = "This API is experimental. It could change in the future without notice.")
@Retention(AnnotationRetention.BINARY)
@Target(AnnotationTarget.CLASS, AnnotationTarget.FUNCTION)
annotation class MyDateTime

@MyDateTime
// A class requiring opt-in
class DateProvider
```

在您的代码中，在使用 `DateProvider` 类声明函数之前，添加 `@OptIn` 注解并引用 `MyDateTime` 注解类：

```kotlin
// Client code
@OptIn(MyDateTime::class)

// Uses DateProvider
fun getDate(): Date {
    val dateProvider: DateProvider
    // ...
}
```

值得注意的是，使用这种方法，如果 `getDate()` 函数在您的代码中的其他地方被调用或被其他开发人员使用，则不需要选择启用：

```kotlin
// Client code
@OptIn(MyDateTime::class)

// Uses DateProvider
fun getDate(): Date {
    val dateProvider: DateProvider
    // ...
}

fun displayDate() {
    // OK: No opt-in is required
    println(getDate())
}
```

选择启用要求不会传播，这意味着其他人可能会在不知情的情况下使用实验性 API。为避免这种情况，传播选择启用要求会更安全。

#### 传播选择启用要求

当您在代码中使用旨在供第三方使用的 API（例如在库中）时，您可以将其选择启用要求也传播到您的 API。为此，请使用库使用的相同**[选择启用要求注解](#create-opt-in-requirement-annotations)**标记您的声明。

例如，在使用 `DateProvider` 类声明函数之前，添加 `@MyDateTime` 注解：

```kotlin
// Client code
@MyDateTime
fun getDate(): Date {
    // OK: the function requires opt-in as well
    val dateProvider: DateProvider
    // ...
}

fun displayDate() {
    println(getDate())
    // Error: getDate() requires opt-in
}
```

如您在此示例中看到的，被注解的函数似乎是 `@MyDateTime` API 的一部分。选择启用会将选择启用要求传播给 `getDate()` 函数的用户。

如果 API 元素的签名包含需要选择启用的类型，则签名本身也必须要求选择启用。否则，如果 API 元素不需要选择启用，但其签名包含一个需要选择启用的类型，则使用它会触发错误。

```kotlin
// Client code
@MyDateTime
fun getDate(dateProvider: DateProvider = DateProvider()): Date

@MyDateTime
fun displayDate() {
    // OK: the function requires opt-in as well
    println(getDate())
}
```

类似地，如果您将 `@OptIn` 应用于其签名包含需要选择启用的类型的声明，则选择启用要求仍然会传播：

```kotlin
// Client code
@OptIn(MyDateTime::class)
// Propagates opt-in due to DateProvider in the signature
fun getDate(dateProvider: DateProvider = DateProvider()): Date

fun displayDate() {
    println(getDate())
    // Error: getDate() requires opt-in
}
```

在传播选择启用要求时，重要的是要理解，如果某个 API 元素变得稳定并且不再有选择启用要求，则任何其他仍有选择启用要求的 API 元素将保持实验性。例如，假设库作者因为 `getDate()` 函数现在稳定而取消了它的选择启用要求：

```kotlin
// Library code
// No opt-in requirement
fun getDate(): Date {
    val dateProvider: DateProvider
    // ...
}
```

如果您在不移除选择启用注解的情况下使用 `displayDate()` 函数，即使不再需要选择启用，它仍然是实验性的：

```kotlin
// Client code

// Still experimental!
@MyDateTime
fun displayDate() {
    // Uses a stable library function
    println(getDate())
}
```

#### 选择启用多个 API

要选择启用多个 API，请使用所有相关的选择启用要求注解标记声明。例如：

```kotlin
@ExperimentalCoroutinesApi
@FlowPreview
```

或者使用 `@OptIn`：

```kotlin
@OptIn(ExperimentalCoroutinesApi::class, FlowPreview::class)
```

### 在文件中选择启用

要为文件中的所有函数和类使用需要选择启用的 API，请在文件顶部、包声明和导入之前添加文件级注解 `@file:OptIn`。

 ```kotlin
 // Client code
 @file:OptIn(MyDateTime::class)
 ```

### 在模块中选择启用

> `-opt-in` 编译器选项从 Kotlin 1.6.0 开始可用。对于更早的 Kotlin 版本，请使用 `-Xopt-in`。
>
{style="note"}

如果您不想注解每个需要选择启用的 API 用法，您可以为整个模块选择启用它们。要在模块中选择启用 API 的使用，请使用参数 `-opt-in` 进行编译，指定您使用的 API 的选择启用要求注解的完全限定名：`-opt-in=org.mylibrary.OptInAnnotation`。使用此参数编译的效果等同于模块中的每个声明都带有注解 `@OptIn(OptInAnnotation::class)`。

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
sourceSets {
    all {
        languageSettings.optIn("org.mylibrary.OptInAnnotation")
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
sourceSets {
    all {
        languageSettings {
            optIn('org.mylibrary.OptInAnnotation')
        }
    }
}
```

</tab>
</tabs>

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

要在模块级别选择启用多个 API，请为模块中使用的每个选择启用要求标记添加一个上述参数。

### 选择启用继承类或接口

有时，库作者提供 API 但希望用户在扩展它之前明确选择启用。例如，库 API 可能在使用上是稳定的，但在继承方面不稳定，因为它未来可能会通过新的抽象函数进行扩展。库作者可以通过使用 [`@SubclassOptInRequired`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-subclass-opt-in-required/) 注解标记 [开放类](inheritance.md) 或 [抽象类](classes.md#abstract-classes) 以及 [非函数式接口](interfaces.md) 来强制执行此操作。

要在代码中选择启用此类 API 元素并进行扩展，请使用 `@SubclassOptInRequired` 注解并引用注解类。例如，假设您想使用 `CoreLibraryApi` 接口，该接口需要选择启用：

```kotlin
// Library code
@RequiresOptIn(
 level = RequiresOptIn.Level.WARNING,
 message = "Interfaces in this library are experimental"
)
annotation class UnstableApi()

@SubclassOptInRequired(UnstableApi::class)
// An interface requiring opt-in to extend
interface CoreLibraryApi
```

在您的代码中，在创建继承自 `CoreLibraryApi` 接口的新接口之前，添加 `@SubclassOptInRequired` 注解并引用 `UnstableApi` 注解类：

```kotlin
// Client code
@SubclassOptInRequired(UnstableApi::class)
interface SomeImplementation : CoreLibraryApi
```

请注意，当您在类上使用 `@SubclassOptInRequired` 注解时，选择启用要求不会传播到任何[内部类或嵌套类](nested-classes.md)：

```kotlin
// Library code
@RequiresOptIn
annotation class ExperimentalFeature

@SubclassOptInRequired(ExperimentalFeature::class)
open class FileSystem {
    open class File
}

// Client code

// Opt-in is required
class NetworkFileSystem : FileSystem()

// Nested class
// No opt-in required
class TextFile : FileSystem.File()
```

或者，您可以通过使用 `@OptIn` 注解来选择启用。您还可以使用实验性标记注解将要求进一步传播到代码中对该类的任何使用：

```kotlin
// Client code
// With @OptIn annotation
@OptInRequired(UnstableApi::class)
interface SomeImplementation : CoreLibraryApi

// With annotation referencing annotation class
// Propagates the opt-in requirement further
@UnstableApi
interface SomeImplementation : CoreLibraryApi
```

## 要求选择启用 API

您可以要求您的库用户在能够使用您的 API 之前选择启用。此外，您可以告知用户在使用您的 API 方面的任何特殊条件，直到您决定移除选择启用要求。

### 创建选择启用要求注解

要要求选择启用您的模块 API，请创建一个注解类作为**选择启用要求注解**。此注解类必须用 [`@RequiresOptIn`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-requires-opt-in/) 注解：

```kotlin
@RequiresOptIn
@Retention(AnnotationRetention.BINARY)
@Target(AnnotationTarget.CLASS, AnnotationTarget.FUNCTION)
annotation class MyDateTime
```

选择启用要求注解必须满足一些要求。它们必须具有：

* `BINARY` 或 `RUNTIME` [保留策略](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.annotation/-retention/)。
* `EXPRESSION`、`FILE`、`TYPE` 或 `TYPE_PARAMETER` 作为 [目标](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.annotation/-target/)。
* 没有参数。

选择启用要求可以具有两种严重性[级别](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-requires-opt-in/-level/)之一：

* `RequiresOptIn.Level.ERROR`。选择启用是强制性的。否则，使用标记 API 的代码将无法编译。这是默认级别。
* `RequiresOptIn.Level.WARNING`。选择启用不是强制性的，但建议这样做。否则，编译器会发出警告。

要设置所需的级别，请指定 `@RequiresOptIn` 注解的 `level` 参数。

此外，您可以向 API 用户提供 `message`。编译器会向尝试在未选择启用情况下使用 API 的用户显示此消息：

```kotlin
@RequiresOptIn(level = RequiresOptIn.Level.WARNING, message = "This API is experimental. It can be incompatibly changed in the future.")
@Retention(AnnotationRetention.BINARY)
@Target(AnnotationTarget.CLASS, AnnotationTarget.FUNCTION)
annotation class ExperimentalDateTime
```

如果您发布多个需要选择启用的独立功能，请为每个功能声明一个注解。这使得您的客户端使用您的 API 更安全，因为他们只能使用他们明确接受的功能。这也意味着您可以独立地移除功能的选择启用要求，这使得您的 API 更易于维护。

### 标记 API 元素

要要求选择启用 API 元素，请使用选择启用要求注解标记其声明：

```kotlin
@MyDateTime
class DateProvider

@MyDateTime
fun getTime(): Time {}
```

请注意，对于某些语言元素，选择启用要求注解不适用：

* 您不能注解属性的支持字段或 Getter，只能注解属性本身。
* 您不能注解局部变量或值参数。

## 要求选择启用扩展 API

有时，您可能希望更精细地控制 API 的哪些特定部分可以被使用和扩展。例如，当您有一些在使用上稳定的 API 但：

* **实现不稳定**，由于持续演进，例如当您有一系列接口，并且预期会添加新的抽象函数而没有默认实现时。
* **实现微妙或脆弱**，例如需要协同行为的单个函数。
* **契约未来可能会以向后不兼容的方式削弱**外部实现，例如将输入参数 `T` 更改为可空版本 `T?`，而之前的代码没有考虑 `null` 值。

在这种情况下，您可以要求用户在进一步扩展您的 API 之前选择启用您的 API。用户可以通过继承 API 或实现抽象函数来扩展您的 API。通过使用 [`@SubclassOptInRequired`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-subclass-opt-in-required/) 注解，您可以强制执行对 [开放类](inheritance.md) 或 [抽象类](classes.md#abstract-classes) 以及 [非函数式接口](interfaces.md) 的此选择启用要求。

要向 API 元素添加选择启用要求，请使用 [`@SubclassOptInRequired`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-subclass-opt-in-required/) 注解并引用注解类：

```kotlin
@RequiresOptIn(
 level = RequiresOptIn.Level.WARNING,
 message = "Interfaces in this library are experimental"
)
annotation class UnstableApi()

@SubclassOptInRequired(UnstableApi::class)
// An interface requiring opt-in to extend
interface CoreLibraryApi
```

请注意，当您使用 `@SubclassOptInRequired` 注解来要求选择启用时，该要求不会传播到任何[内部类或嵌套类](nested-classes.md)。

要查看如何在您的 API 中使用 `@SubclassOptInRequired` 注解的实际示例，请查看 `kotlinx.coroutines` 库中的 [`SharedFlow`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/-shared-flow/) 接口。

## 预稳定 API 的选择启用要求

如果您对尚未稳定的功能使用选择启用要求，请仔细处理 API 的演进以避免破坏客户端代码。

一旦您的预稳定 API 演进并在稳定状态发布，请从您的声明中移除选择启用要求注解。然后，客户端可以不受限制地使用它们。但是，您应该将注解类保留在模块中，以便现有客户端代码保持兼容。

为了鼓励 API 用户通过从代码中移除任何注解并重新编译来更新其模块，请将这些注解标记为 [`@Deprecated`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-deprecated/)，并在弃用消息中提供解释。

```kotlin
@Deprecated("This opt-in requirement is not used anymore. Remove its usages from your code.")
@RequiresOptIn
annotation class ExperimentalDateTime
```