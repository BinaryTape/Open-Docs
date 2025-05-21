---
title: 序列化
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

_Serialization_ (序列化) 是将应用程序使用的数据转换为可以通过网络传输或存储在数据库或文件中的格式的过程。反过来，_deserialization_ (反序列化) 是从外部源读取数据并将其转换为运行时对象的相反过程。 它们共同构成了与第三方交换数据的大多数应用程序的基础。

一些数据序列化格式，例如 [JSON](https://www.json.org/json-en.html) 和 [protocol buffers](https://developers.google.com/protocol-buffers) (协议缓冲区) 尤其常见。 由于它们是语言中立和平台中立的，因此它们支持以任何现代语言编写的系统之间的数据交换。

在 Kotlin 中，数据序列化工具在单独的组件 [kotlinx.serialization](https://github.com/Kotlin/kotlinx.serialization) 中提供。 它由几个部分组成：`org.jetbrains.kotlin.plugin.serialization` Gradle 插件、[runtime libraries](#libraries) (运行时库)和编译器插件。

编译器插件 `kotlinx-serialization-compiler-plugin` 和 `kotlinx-serialization-compiler-plugin-embeddable` 直接发布到 Maven Central。 第二个插件设计用于与 `kotlin-compiler-embeddable` artifact (构件) 一起使用，它是脚本构件的默认选项。 Gradle 将编译器插件作为编译器参数添加到你的项目中。

## Libraries (库)

`kotlinx.serialization` 提供了适用于所有支持平台的库集 – JVM、JavaScript、Native – 以及各种序列化格式 – JSON、CBOR、协议缓冲区和其他。 你可以在[下面](#formats)找到支持的序列化格式的完整列表。

所有 Kotlin 序列化库都属于 `org.jetbrains.kotlinx:` group (组)。 它们的名称以 `kotlinx-serialization-` 开头，并具有反映序列化格式的后缀。 例子：
* `org.jetbrains.kotlinx:kotlinx-serialization-json` 为 Kotlin 项目提供 JSON 序列化。
* `org.jetbrains.kotlinx:kotlinx-serialization-cbor` 提供 CBOR 序列化。

特定于平台的 artifacts (构件) 会自动处理； 你无需手动添加它们。 在 JVM、JS、Native 和多平台项目中使用相同的 dependencies (依赖项)。

请注意，`kotlinx.serialization` 库使用自己的版本控制结构，该结构与 Kotlin 的版本控制不匹配。 查看 [GitHub](https://github.com/Kotlin/kotlinx.serialization/releases) 上的 releases (版本)，以查找最新版本。

## Formats (格式)

`kotlinx.serialization` 包括适用于各种序列化格式的库：

* [JSON](https://www.json.org/): [`kotlinx-serialization-json`](https://github.com/Kotlin/kotlinx.serialization/blob/master/formats/README#json)
* [Protocol buffers](https://developers.google.com/protocol-buffers): [`kotlinx-serialization-protobuf`](https://github.com/Kotlin/kotlinx.serialization/blob/master/formats/README#protobuf)
* [CBOR](https://cbor.io/): [`kotlinx-serialization-cbor`](https://github.com/Kotlin/kotlinx.serialization/blob/master/formats/README#cbor)
* [Properties](https://en.wikipedia.org/wiki/.properties): [`kotlinx-serialization-properties`](https://github.com/Kotlin/kotlinx.serialization/blob/master/formats/README#properties)
* [HOCON](https://github.com/lightbend/config/blob/master/HOCON): [`kotlinx-serialization-hocon`](https://github.com/Kotlin/kotlinx.serialization/blob/master/formats/README#hocon) (仅在 JVM 上)

请注意，除了 JSON 序列化 (`kotlinx-serialization-json`) 之外的所有库都是 [Experimental](components-stability)，这意味着它们的 API 可能会在没有通知的情况下更改。

还有一些社区维护的库支持更多序列化格式，例如 [YAML](https://yaml.org/) 或 [Apache Avro](https://avro.apache.org/)。 有关可用序列化格式的详细信息，请参阅 [`kotlinx.serialization` documentation](https://github.com/Kotlin/kotlinx.serialization/blob/master/formats/README)。

## Example: JSON serialization (示例：JSON 序列化)

让我们看一下如何将 Kotlin 对象序列化为 JSON。

### Add plugins and dependencies (添加插件和依赖项)

在开始之前，你必须配置你的构建脚本，以便你可以在你的项目中使用 Kotlin 序列化工具：

1. 应用 Kotlin 序列化 Gradle 插件 `org.jetbrains.kotlin.plugin.serialization` (或 Kotlin Gradle DSL 中的 `kotlin("plugin.serialization")`)。

    <Tabs groupId="build-script">
    <TabItem value="kotlin" label="Kotlin" default>

    ```kotlin
    plugins {
        kotlin("jvm") version "2.1.20"
        kotlin("plugin.serialization") version "2.1.20"
    }
    ```

    </TabItem>
    <TabItem value="groovy" label="Groovy" default>

    ```groovy
    plugins {
        id 'org.jetbrains.kotlin.jvm' version '2.1.20'
        id 'org.jetbrains.kotlin.plugin.serialization' version '2.1.20'  
    }
    ```

    </TabItem>
    </Tabs>

2. 添加 JSON 序列化库 dependency (依赖项)：`org.jetbrains.kotlinx:kotlinx-serialization-json:1.8.0`

    <Tabs groupId="build-script">
    <TabItem value="kotlin" label="Kotlin" default>

    ```kotlin
    dependencies {
        implementation("org.jetbrains.kotlinx:kotlinx-serialization-json:1.8.0")
    } 
    ```

    </TabItem>
    <TabItem value="groovy" label="Groovy" default>

    ```groovy
    dependencies {
        implementation 'org.jetbrains.kotlinx:kotlinx-serialization-json:1.8.0'
    } 
    ```

    </TabItem>
    </Tabs>

现在你已准备好在你的代码中使用序列化 API。 该 API 位于 `kotlinx.serialization` package (包) 及其特定于格式的子包中，例如 `kotlinx.serialization.json`。

### Serialize and deserialize JSON (序列化和反序列化 JSON)

1. 通过使用 `@Serializable` 注释类来使该类可序列化。

```kotlin
import kotlinx.serialization.Serializable

@Serializable
data class Data(val a: Int, val b: String)
```

2. 通过调用 `Json.encodeToString()` 序列化此类的 instance (实例)。

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

因此，你将获得一个字符串，其中包含此对象在 JSON 格式中的状态：`{"a": 42, "b": "str"}`

:::note
你还可以通过一次调用序列化对象集合，例如列表：

```kotlin
val dataList = listOf(Data(42, "str"), Data(12, "test"))
val jsonList = Json.encodeToString(dataList)
```

:::

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

就是这样！ 你已成功将对象序列化为 JSON 字符串，并将它们反序列化回对象。

## What's next (下一步)

有关 Kotlin 中序列化的更多信息，请参阅 [Kotlin Serialization Guide](https://github.com/Kotlin/kotlinx.serialization/blob/master/docs/serialization-guide)。

你可以在以下资源中浏览 Kotlin 序列化的不同方面：

* [Learn more about Kotlin serialization and its core concepts](https://github.com/Kotlin/kotlinx.serialization/blob/master/docs/basic-serialization) (了解有关 Kotlin 序列化及其核心概念的更多信息)
* [Explore the built-in serializable classes of Kotlin](https://github.com/Kotlin/kotlinx.serialization/blob/master/docs/builtin-classes) (探索 Kotlin 的内置可序列化类)
* [Look at serializers in more detail and learn how to create custom serializers](https://github.com/Kotlin/kotlinx.serialization/blob/master/docs/serializers) (更详细地了解 serializers (序列化器)，并学习如何创建自定义序列化器)
* [Discover how polymorphic serialization is handled in Kotlin](https://github.com/Kotlin/kotlinx.serialization/blob/master/docs/polymorphism#open-polymorphism) (了解如何在 Kotlin 中处理 polymorphic serialization (多态序列化))
* [Look into the various JSON features handling Kotlin serialization](https://github.com/Kotlin/kotlinx.serialization/blob/master/docs/json#json-elements) (研究处理 Kotlin 序列化的各种 JSON 功能)
* [Learn more about the experimental serialization formats supported by Kotlin](https://github.com/Kotlin/kotlinx.serialization/blob/master/docs/formats) (了解有关 Kotlin 支持的 experimental serialization formats (实验性序列化格式) 的更多信息)