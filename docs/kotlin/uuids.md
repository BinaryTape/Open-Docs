[//]: # (title: UUID)
[//]: # (description: 了解如何在 Kotlin 中使用 UUID，包括创建、解析、格式化、序列化，以及在多平台和 JVM 代码中处理 UUID 值。)

[`Uuid`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/-uuid/)
类表示通用唯一标识符 (UUID)，
也称为全局唯一标识符 (GUID)。

`Uuid` 是一个 128 位的值，用于在不依赖分配 ID 的中央系统的情况下唯一标识实体。这使得 UUID 在分布式应用程序、数据库、客户端生成的记录或 [Kotlin Multiplatform](https://kotlinlang.org/docs/multiplatform/get-started.html) 应用程序中非常有用。

使用 `Uuid` 类来处理 UUID 值。与普通字符串不同，专用的 UUID 类型使您的代码更显式，并防止意外使用无效值。

要在您的项目中使用 UUID，请从 `kotlin.uuid` 软件包中导入 `Uuid` 类：

```kotlin
import kotlin.uuid.Uuid
```

## 生成 UUID

要为常规标识符（如用户或数据库 ID）生成随机第 4 版 UUID，请使用 [`Uuid.random()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/-uuid/-companion/random.html) 函数：

```kotlin
import kotlin.uuid.Uuid

fun main() {
//sampleStart    
    val id = Uuid.random()
    println(id)
//sampleEnd    
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.0"}

您还可以使用以下 [实验性功能](components-stability.md#stability-levels-explained) 函数生成特定版本的 UUID：

* [`Uuid.generateV4()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/-uuid/-companion/generate-v4.html) 函数生成的 UUID 类型与 `Uuid.random()` 函数相同，但显式说明该值是第 4 版 UUID。
* [`Uuid.generateV7()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/-uuid/-companion/generate-v7.html) 函数生成带有时间戳的第 7 版 UUID，您可以将其用于 UUID 排序。
* [`Uuid.generateV7NonMonotonicAt()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/-uuid/-companion/generate-v7-non-monotonic-at.html) 函数为特定时间点生成第 7 版 UUID。

这些 UUID 生成函数是实验性的。要启用它们，请使用 `@OptIn(ExperimentalUuidApi::class)` 注解或在您的构建文件中添加以下编译器选项：

<tabs group="build-system">
<tab title="Gradle" group-key="gradle">

```kotlin
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-opt-in=kotlin.uuid.ExperimentalUuidApi")
    }
}
```

</tab>
<tab title="Maven" group-key="maven">

```xml
<build>
    <plugins>
        <plugin>
            <groupId>org.jetbrains.kotlin</groupId>
            <artifactId>kotlin-maven-plugin</artifactId>
            <configuration>
                <args>
                    <arg>-opt-in=kotlin.uuid.ExperimentalUuidApi</arg>
                </args>
            </configuration>
        </plugin>
    </plugins>
</build>
```

</tab>
</tabs>

以下是一个生成特定版本 UUID 的示例：

```kotlin
import kotlin.time.Instant
import kotlin.time.ExperimentalTime
import kotlin.uuid.Uuid

@OptIn(kotlin.uuid.ExperimentalUuidApi::class, ExperimentalTime::class)
fun main() {
    // 生成第 4 版 UUID
    val idVersion4 = Uuid.generateV4()
    println(idVersion4)

    // 生成第 7 版 UUID
    val idVersion7 = Uuid.generateV7()
    println(idVersion7)

    // 为指定的时间戳生成第 7 版 UUID
    val timestamp = Instant.fromEpochMilliseconds(1757440583000L)
    val idVersion7SpecificTime = Uuid.generateV7NonMonotonicAt(timestamp)
    println(idVersion7SpecificTime)
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.3"}

## 解析 UUID

UUID 值通常表示为字符串，例如在 URL 参数或数据库记录中。

要将 `String` 值转换为 `Uuid` 值，请使用 [`Uuid.parse()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/-uuid/-companion/parse.html) 函数：

```kotlin
import kotlin.uuid.Uuid

fun main() {
//sampleStart
    val id = Uuid.parse("de2bc56c-ea73-4f3c-8a37-5a46fdb2d79a")
    println(id)
//sampleEnd    
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.0"}

`Uuid.parse()` 函数同时接受标准的十六进制加连字符格式和不带连字符的十六进制格式。

如果输入无效，`Uuid.parse()` 函数将抛出 `IllegalArgumentException`：

```kotlin
import kotlin.uuid.Uuid

fun main() { 
//sampleStart    
    val id = Uuid.parse("10")
    println(id)
//sampleEnd    
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.0"}

如果您的应用程序仅接受一种表示形式，请使用特定于格式的函数：

* [`Uuid.parseHexDash()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/-uuid/-companion/parse-hex-dash.html) 用于十六进制加连字符的字符串表示形式。
* [`Uuid.parseHex()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/-uuid/-companion/parse-hex.html) 用于不带连字符的十六进制字符串表示形式。

例如：

```kotlin
import kotlin.uuid.Uuid

fun main() {
//sampleStart  
    val standard = Uuid.parseHexDash("de2bc56c-ea73-4f3c-8a37-5a46fdb2d79a")
    val compact = Uuid.parseHex("de2bc56cea734f3c8a375a46fdb2d79a")
    
    println(standard)
    println(compact)
//sampleEnd    
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.3"}

如果您有来自外部源的 UUID，并且必须安全地处理无效输入，请使用 [`Uuid.parseOrNull()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/-uuid/-companion/parse-or-null.html)、[`Uuid.parseHexDashOrNull()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/-uuid/-companion/parse-hex-dash-or-null.html) 或 [`Uuid.parseHexOrNull()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/-uuid/-companion/parse-hex-or-null.html)。如果输入无效，这些函数将返回 `null`：

```kotlin
fun parseId(input: String): Uuid? { 
    return Uuid.parseOrNull(input) 
}
```

## 将 UUID 转换为字符串

您可以使用以下函数将 `Uuid` 值转换为 `String` 值：

* [`toString()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/-uuid/to-string.html) 用于标准字符串表示形式
* [`toHexDashString()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/-uuid/to-hex-dash-string.html) 用于十六进制加连字符格式
* [`toHexString()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/-uuid/to-hex-string.html) 用于不带连字符的十六进制格式

例如：

```kotlin
import kotlin.uuid.Uuid

fun main() {
//sampleStart    
    val id = Uuid.parse("de2bc56c-ea73-4f3c-8a37-5a46fdb2d79a")
    
    println(id.toString())
    // de2bc56c-ea73-4f3c-8a37-5a46fdb2d79a
    println(id.toHexDashString())
    // de2bc56c-ea73-4f3c-8a37-5a46fdb2d79a
    println(id.toHexString())
    // de2bc56cea734f3c8a375a46fdb2d79a 
//sampleEnd    
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.3"}

## 比较 UUID

您可以使用 `==` 运算符检查 `Uuid` 值是否相等。

Kotlin 根据 UUID 值而不是文本表示形式来比较值。例如，即使两个值具有不同的形式，如果它们表示相同的 128 位值，它们也是相等的：

```kotlin
import kotlin.uuid.Uuid

fun main() {
//sampleStart    
    val first = Uuid.parse("de2bc56c-ea73-4f3c-8a37-5a46fdb2d79a")
    val second = Uuid.parse("de2bc56cea734f3c8a375a46fdb2d79a")

    println(first == second) 
    // true 
//sampleEnd    
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.3"}

这使得 `Uuid` 比较比比较字符串更可靠，因为字符串比较会将不同格式的相同值视为不同值。`Uuid` 比较会检查实际的标识符值。

`Uuid` 实现了 `Comparable<Uuid>` 接口，因此可以使用标准集合函数（如 `sorted()`）对 UUID 值进行排序。在这种情况下，Kotlin 会按字典序（从最高有效位到最低有效位）比较值：

```kotlin
import kotlin.uuid.Uuid

fun main() {
//sampleStart    
    val first = Uuid.generateV7()
    val second = Uuid.generateV7()

    val sorted = listOf(first, second).sorted()
    println(sorted) 
//sampleEnd    
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.3"}

## 处理二进制表示形式

某些 API、存储格式和二进制协议不将 UUID 表示为字符串。相反，它们将 128 位 UUID 值存储为以下形式之一：

* 16 字节数组
* 两个 64 位值

当您需要与期望二进制 UUID 数据的系统交换 UUID 时，请使用这些表示形式。

要在 UUID 和 16 字节表示形式之间进行转换，请使用 [`.toByteArray()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/-uuid/to-byte-array.html) 和 [`Uuid.fromByteArray()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/-uuid/-companion/from-byte-array.html) 函数：

```kotlin
import kotlin.uuid.Uuid

fun main() {
//sampleStart 
    val id = Uuid.random()

    val bytes = id.toByteArray()
    val original = Uuid.fromByteArray(bytes)
  
    println(id)
    
    println(bytes)
    println(original)

    println(id == original) 
    // true
//sampleEnd  
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.0"}

您还可以将同一个 128 位 UUID 值表示为两个 `Long` 值。这很有用，因为 Kotlin 没有提供内置的 128 位整数类型。这两个 `Long` 值分两部分存储 UUID：

* `mostSignificantBits` 形参用于 UUID 的前 64 位。
* `leastSignificantBits` 形参用于 UUID 的后 64 位。

要从两个 `Long` 值创建 `Uuid` 值，请使用 [`Uuid.fromLongs()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/-uuid/-companion/from-longs.html) 函数：

```kotlin
import kotlin.uuid.Uuid

fun main() {
//sampleStart 
    val id = Uuid.fromLongs(
        mostSignificantBits = -4653685776373167443,
        leastSignificantBits = -6288180676521310383.toLong()
    )
    println(id) 
    // bf6ac971-52fd-4aad-a8bb-e4fdac78c751
//sampleEnd  
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.0"}

要从现有的 `Uuid` 值中提取这两部分，请使用 [`Uuid.toLongs()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/-uuid/to-longs.html) 函数：

```kotlin
import kotlin.uuid.Uuid

fun main() {
//sampleStart 
    val id = Uuid.random()
    
    id.toLongs { mostSignificantBits, leastSignificantBits ->
        println(mostSignificantBits)
        println(leastSignificantBits)
    }
//sampleEnd  
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.0"}

## 序列化 UUID

Kotlin 支持 `Uuid` 值的序列化。使用它可以在 Kotlin 代码之外存储或传输 UUID 值，例如在 JSON API 或配置文件中。

要序列化 `Uuid` 值，除非您的应用程序需要其他格式，否则请将其表示为字符串。[`kotlinx.serialization`](https://kotlinlang.org/docs/serialization.html) 库使用十六进制加连字符格式：

```kotlin
//sampleStart 
import kotlin.uuid.Uuid
import kotlinx.serialization.Serializable
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json

@Serializable
data class User(
    val id: Uuid,
    val name: String
)

fun main() {
    val user = User(
        id = Uuid.parse("de2bc56cea734f3c8a375a46fdb2d79a"),
        name = "Kotlin"
    )

    println(Json.encodeToString(user))
    // {"id":"de2bc56c-ea73-4f3c-8a37-5a46fdb2d79a","name":"Kotlin"}
}
//sampleEnd
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.3"}

## 在 Java API 中使用 UUID

Java 使用 `java.util.UUID` 类来表示 UUID。在 JVM 上，Java API 可能会接受或返回此类型。虽然 `java.util.UUID` 和 `kotlin.uuid.Uuid` 都表示 UUID，但它们是两个不同的类型。

在 Kotlin 和 Java 之间传递 UUID 时，请显式转换值：

* 使用 [`.toKotlinUuid()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/to-kotlin-uuid.html) 扩展方法将 Java UUID 转换为 Kotlin：

  ```kotlin
  import kotlin.uuid.toKotlinUuid
  
  val kotlinId: Uuid = javaId.toKotlinUuid()
  ```

* 使用 [`.toJavaUuid()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/to-java-uuid.html) 扩展方法将 Kotlin UUID 转换为 Java：

  ```kotlin
  import kotlin.uuid.toJavaUuid
  
  val javaId: java.util.UUID = kotlinId.toJavaUuid()
  ```

这些函数允许您在 JVM 互操作性边界处使用 `Uuid` 表示您的 UUID 值。

> `java.util.UUID` 和 `kotlin.uuid.Uuid` 类是可比较的，但排序方式可能不同。在从 Java API 迁移到 Kotlin API 之前，请务必检查依赖 UUID 排序的代码。
>
{style="note"}

Kotlin 还提供对处理 Java 缓冲区的支持。使用 JVM 特定的函数来处理 `ByteBuffer` 中的 UUID：

* 使用 [`.getUuid()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/get-uuid.html) 函数从缓冲区读取 UUID。
* 使用 [`.putUuid()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/put-uuid.html) 函数将 UUID 写入缓冲区。