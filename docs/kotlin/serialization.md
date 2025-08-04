[//]: # (title: 序列化)

_序列化_ 是将应用程序使用的数据转换为可以通过网络传输或存储在数据库或文件中的格式的过程。反之，_反序列化_ 则是从外部源读取数据并将其转换为运行时对象的相反过程。它们共同对大多数与第三方交换数据的应用程序至关重要。

一些数据序列化格式，例如 [JSON](https://www.json.org/json-en.html) 和 [protocol buffers](https://developers.google.com/protocol-buffers) 特别常见。由于它们是语言无关和平台无关的，因此可以在任何现代语言编写的系统之间实现数据交换。

在 Kotlin 中，数据序列化工具可在独立组件 [kotlinx.serialization](https://github.com/Kotlin/kotlinx.serialization) 中获得。它由几个部分组成：`org.jetbrains.kotlin.plugin.serialization` Gradle 插件、[运行时库](#libraries) 和编译器插件。

编译器插件 `kotlinx-serialization-compiler-plugin` 和 `kotlinx-serialization-compiler-plugin-embeddable` 直接发布到 Maven Central。第二个插件旨在与 `kotlin-compiler-embeddable` 构件配合使用，这是脚本构件的默认选项。Gradle 会将编译器插件作为编译器实参添加到你的项目中。

## 库

`kotlinx.serialization` 为所有支持的平台（JVM、JavaScript、Native）以及各种序列化格式（JSON、CBOR、protocol buffers 等）提供了库集。你可以在[下方](#formats)找到支持的序列化格式的完整列表。

所有 Kotlin 序列化库都属于 `org.jetbrains.kotlinx:` 组。它们的名称以 `kotlinx-serialization-` 开头，并带有反映序列化格式的后缀。例如：
* `org.jetbrains.kotlinx:kotlinx-serialization-json` 为 Kotlin 项目提供 JSON 序列化。
* `org.jetbrains.kotlinx:kotlinx-serialization-cbor` 提供 CBOR 序列化。

平台特有的构件会自动处理；你无需手动添加它们。在 JVM、JS、Native 和多平台项目中使用相同的依赖项。

请注意，`kotlinx.serialization` 库使用其自己的版本控制结构，与 Kotlin 的版本控制不匹配。请查看 [GitHub](https://github.com/Kotlin/kotlinx.serialization/releases) 上的版本发布以查找最新版本。

## 格式

`kotlinx.serialization` 包含用于各种序列化格式的库：

* [JSON](https://www.json.org/): [`kotlinx-serialization-json`](https://github.com/Kotlin/kotlinx.serialization/blob/master/formats/README.md#json)
* [Protocol buffers](https://developers.google.com/protocol-buffers): [`kotlinx-serialization-protobuf`](https://github.com/Kotlin/kotlinx.serialization/blob/master/formats/README.md#protobuf)
* [CBOR](https://cbor.io/): [`kotlinx-serialization-cbor`](https://github.com/Kotlin/kotlinx.serialization/blob/master/formats/README.md#cbor)
* [Properties](https://en.wikipedia.org/wiki/.properties): [`kotlinx-serialization-properties`](https://github.com/Kotlin/kotlinx.serialization/blob/master/formats/README.md#properties)
* [HOCON](https://github.com/lightbend/config/blob/master/HOCON.md): [`kotlinx-serialization-hocon`](https://github.com/lightbend/config/blob/master/HOCON.md) （仅限 JVM）

请注意，除 JSON 序列化 (`kotlinx-serialization-json`) 之外的所有库都是[实验性的](components-stability.md)，这意味着它们的 API 可能会在恕不另行通知的情况下更改。

还有社区维护的库，它们支持更多序列化格式，例如 [YAML](https://yaml.org/) 或 [Apache Avro](https://avro.apache.org/)。有关可用序列化格式的详细信息，请参阅 [`kotlinx.serialization` 文档](https://github.com/Kotlin/kotlinx.serialization/blob/master/formats/README.md)。

## 示例：JSON 序列化

让我们看看如何将 Kotlin 对象序列化为 JSON。

### 添加插件和依赖项

在开始之前，你必须配置构建脚本，以便在项目中可以使用 Kotlin 序列化工具：

1. 应用 Kotlin 序列化 Gradle 插件 `org.jetbrains.kotlin.plugin.serialization`（或 Kotlin Gradle DSL 中的 `kotlin("plugin.serialization")`）。

    <tabs group="build-script">
    <tab title="Kotlin" group-key="kotlin">

    ```kotlin
    plugins {
        kotlin("jvm") version "%kotlinVersion%"
        kotlin("plugin.serialization") version "%kotlinVersion%"
    }
    ```

    </tab>
    <tab title="Groovy" group-key="groovy">

    ```groovy
    plugins {
        id 'org.jetbrains.kotlin.jvm' version '%kotlinVersion%'
        id 'org.jetbrains.kotlin.plugin.serialization' version '%kotlinVersion%'  
    }
    ```

    </tab>
    </tabs>

2. 添加 JSON 序列化库依赖项：`org.jetbrains.kotlinx:kotlinx-serialization-json:%serializationVersion%`

    <tabs group="build-script">
    <tab title="Kotlin" group-key="kotlin">

    ```kotlin
    dependencies {
        implementation("org.jetbrains.kotlinx:kotlinx-serialization-json:%serializationVersion%")
    } 
    ```

    </tab>
    <tab title="Groovy" group-key="groovy">

    ```groovy
    dependencies {
        implementation 'org.jetbrains.kotlinx:kotlinx-serialization-json:%serializationVersion%'
    } 
    ```

    </tab>
    </tabs>

现在，你已准备好在代码中使用序列化 API。该 API 位于 `kotlinx.serialization` 包及其格式特有的子包中，例如 `kotlinx.serialization.json`。

### 序列化和反序列化 JSON

1. 通过使用 `@Serializable` 注解来使类可序列化。

```kotlin
import kotlinx.serialization.Serializable

@Serializable
data class Data(val a: Int, val b: String)
```

2. 通过调用 `Json.encodeToString()` 来序列化此类的实例。

```kotlin
import kotlinx.serialization.Serializable
import kotlinx.serialization.json.Json
import kotlinx.serialization.encodeToString

@Serializable
data class Data(val a: Int, val b: String)

fun main() {
   val json = Json.encodeToString(Data(42, "str"))
}
```

结果，你会得到一个包含此对象 JSON 格式状态的字符串：`{"a": 42, "b": "str"}`

> 你也可以在单次调用中序列化对象集合，例如列表：
> 
> ```kotlin
> val dataList = listOf(Data(42, "str"), Data(12, "test"))
> val jsonList = Json.encodeToString(dataList)
> ```
> 
{style="note"}

3. 使用 `decodeFromString()` 函数从 JSON 反序列化对象：

```kotlin
import kotlinx.serialization.Serializable
import kotlinx.serialization.json.Json
import kotlinx.serialization.decodeFromString

@Serializable
data class Data(val a: Int, val b: String)

fun main() {
   val obj = Json.decodeFromString<Data>("""{"a":42, "b": "str"}""")
}
```

就是这样！你已成功地将对象序列化为 JSON 字符串并将其反序列化回对象。

## 接下来

关于 Kotlin 中的序列化，请参阅 [Kotlin 序列化指南](https://github.com/Kotlin/kotlinx.serialization/blob/master/docs/serialization-guide.md)。

你可以在以下资源中探究 Kotlin 序列化的不同方面：

* [了解更多关于 Kotlin 序列化及其核心概念](https://github.com/Kotlin/kotlinx.serialization/blob/master/docs/basic-serialization.md)
* [探究 Kotlin 的内置可序列化类](https://github.com/Kotlin/kotlinx.serialization/blob/master/docs/builtin-classes.md)
* [更详细地查看序列化器并学习如何创建自定义序列化器](https://github.com/Kotlin/kotlinx.serialization/blob/master/docs/serializers.md)
* [了解 Kotlin 如何处理多态序列化](https://github.com/Kotlin/kotlinx.serialization/blob/master/docs/polymorphism.md#open-polymorphism)
* [探究处理 Kotlin 序列化的各种 JSON 特性](https://github.com/Kotlin/kotlinx.serialization/blob/master/docs/json.md#json-elements)
* [了解更多关于 Kotlin 支持的实验性序列化格式](https://github.com/Kotlin/kotlinx.serialization/blob/master/docs/formats.md)