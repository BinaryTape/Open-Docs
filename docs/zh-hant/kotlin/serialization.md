---
title: "序列化 (Serialization)"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

所謂的 *序列化 (Serialization)* 是將應用程式使用的資料轉換為可在網路上傳輸或儲存在資料庫或檔案中的格式的過程。 反過來說，*反序列化 (deserialization)* 是從外部來源讀取資料並將其轉換為執行階段物件的相反過程。 總而言之，它們對於大多數與第三方交換資料的應用程式至關重要。

某些資料序列化格式，例如 [JSON](https://www.json.org/json-en.html) 和 [protocol buffers](https://developers.google.com/protocol-buffers) 尤其常見。 由於它們與語言和平台無關，因此它們能夠在以任何現代語言編寫的系統之間進行資料交換。

在 Kotlin 中，資料序列化工具可在單獨的元件 [kotlinx.serialization](https://github.com/Kotlin/kotlinx.serialization) 中找到。
它由幾個部分組成：`org.jetbrains.kotlin.plugin.serialization` Gradle 插件、[runtime libraries](#libraries) 和編譯器插件。

編譯器插件 `kotlinx-serialization-compiler-plugin` 和 `kotlinx-serialization-compiler-plugin-embeddable` 直接發佈到 Maven Central。 第二個插件旨在與 `kotlin-compiler-embeddable` artifact 搭配使用，後者是 scripting artifacts 的預設選項。 Gradle 會將編譯器插件作為編譯器引數新增到您的專案中。

## Libraries

`kotlinx.serialization` 為所有支援的平台（JVM、JavaScript、Native）和各種序列化格式（JSON、CBOR、protocol buffers 等）提供了一組 libraries。 您可以在[下方](#formats)找到支援的序列化格式的完整清單。

所有 Kotlin 序列化 libraries 都屬於 `org.jetbrains.kotlinx:` 群組。 它們的名稱以 `kotlinx-serialization-` 開頭，並具有反映序列化格式的字尾。 範例：
* `org.jetbrains.kotlinx:kotlinx-serialization-json` 為 Kotlin 專案提供 JSON 序列化。
* `org.jetbrains.kotlinx:kotlinx-serialization-cbor` 提供 CBOR 序列化。

特定於平台的 artifacts 會自動處理；您無需手動新增它們。 在 JVM、JS、Native 和多平台專案中使用相同的 dependencies。

請注意，`kotlinx.serialization` libraries 使用它們自己的版本控制結構，該結構與 Kotlin 的版本控制不符。 查看 [GitHub](https://github.com/Kotlin/kotlinx.serialization/releases) 上的發佈版本以尋找最新版本。

## Formats

`kotlinx.serialization` 包括用於各種序列化格式的 libraries：

* [JSON](https://www.json.org/): [`kotlinx-serialization-json`](https://github.com/Kotlin/kotlinx.serialization/blob/master/formats/README#json)
* [Protocol buffers](https://developers.google.com/protocol-buffers): [`kotlinx-serialization-protobuf`](https://github.com/Kotlin/kotlinx.serialization/blob/master/formats/README#protobuf)
* [CBOR](https://cbor.io/): [`kotlinx-serialization-cbor`](https://github.com/Kotlin/kotlinx.serialization/blob/master/formats/README#cbor)
* [Properties](https://en.wikipedia.org/wiki/.properties): [`kotlinx-serialization-properties`](https://github.com/Kotlin/kotlinx.serialization/blob/master/formats/README#properties)
* [HOCON](https://github.com/lightbend/config/blob/master/HOCON): [`kotlinx-serialization-hocon`](https://github.com/Kotlin/kotlinx.serialization/blob/master/formats/README#hocon) (僅在 JVM 上)

請注意，除了 JSON 序列化 (`kotlinx-serialization-json`) 之外的所有 libraries 都是 [Experimental](components-stability)，這意味著它們的 API 可以在不另行通知的情況下進行更改。

還有社群維護的 libraries，它們支援更多序列化格式，例如 [YAML](https://yaml.org/) 或 [Apache Avro](https://avro.apache.org/)。 有關可用序列化格式的詳細資訊，請參閱 [`kotlinx.serialization` documentation](https://github.com/Kotlin/kotlinx.serialization/blob/master/formats/README)。

## Example: JSON serialization

讓我們看看如何將 Kotlin 物件序列化為 JSON。

### Add plugins and dependencies

在開始之前，您必須設定您的建置腳本，以便您可以在專案中使用 Kotlin 序列化工具：

1. 應用 Kotlin 序列化 Gradle 插件 `org.jetbrains.kotlin.plugin.serialization` (或 Kotlin Gradle DSL 中的 `kotlin("plugin.serialization")`)。

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

2. 新增 JSON 序列化 library dependency:`org.jetbrains.kotlinx:kotlinx-serialization-json:1.8.0`

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

現在您已準備好在您的程式碼中使用序列化 API。 該 API 位於 `kotlinx.serialization` 套件及其特定於格式的子套件中，例如 `kotlinx.serialization.json`。

### Serialize and deserialize JSON

1. 透過使用 `@Serializable` 註釋一個類別，使其可序列化。

```kotlin
import kotlinx.serialization.Serializable

@Serializable
data class Data(val a: Int, val b: String)
```

2. 透過呼叫 `Json.encodeToString()` 序列化此類別的例項。

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

結果，您會得到一個字串，其中包含此物件在 JSON 格式中的狀態：`{"a": 42, "b": "str"}`

:::note
您也可以在單次呼叫中序列化物件集合，例如 lists：

```kotlin
val dataList = listOf(Data(42, "str"), Data(12, "test"))
val jsonList = Json.encodeToString(dataList)
```

:::

3. 使用 `decodeFromString()` 函式從 JSON 反序列化物件：

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

就是這樣！ 您已成功將物件序列化為 JSON 字串，並將它們反序列化回物件。

## What's next

有關 Kotlin 中序列化的更多資訊，請參閱 [Kotlin Serialization Guide](https://github.com/Kotlin/kotlinx.serialization/blob/master/docs/serialization-guide)。

您可以在以下資源中探索 Kotlin 序列化的不同方面：

* [Learn more about Kotlin serialization and its core concepts](https://github.com/Kotlin/kotlinx.serialization/blob/master/docs/basic-serialization)
* [Explore the built-in serializable classes of Kotlin](https://github.com/Kotlin/kotlinx.serialization/blob/master/docs/builtin-classes)
* [Look at serializers in more detail and learn how to create custom serializers](https://github.com/Kotlin/kotlinx.serialization/blob/master/docs/serializers)
* [Discover how polymorphic serialization is handled in Kotlin](https://github.com/Kotlin/kotlinx.serialization/blob/master/docs/polymorphism#open-polymorphism)
* [Look into the various JSON features handling Kotlin serialization](https://github.com/Kotlin/kotlinx.serialization/blob/master/docs/json#json-elements)
* [Learn more about the experimental serialization formats supported by Kotlin](https://github.com/Kotlin/kotlinx.serialization/blob/master/docs/formats)