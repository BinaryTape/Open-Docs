[//]: # (title: 序列化)

_序列化_ 是將應用程式使用的資料轉換為可以透過網路傳輸或儲存於資料庫或檔案中的格式的過程。相對地，_反序列化_ 則是從外部來源讀取資料並將其轉換為執行時期物件的相反過程。這兩者對於大多數與第三方交換資料的應用程式來說至關重要。

某些資料序列化格式，例如 [JSON](https://www.json.org/json-en.html) 和 [Protocol Buffers (協定緩衝)](https://developers.google.com/protocol-buffers)，特別常見。它們是語言中立且平台中立的，使其能夠在任何現代語言撰寫的系統之間交換資料。

在 Kotlin 中，資料序列化工具可透過獨立元件 [kotlinx.serialization](https://github.com/Kotlin/kotlinx.serialization) 取得。它包含幾個部分：`org.jetbrains.kotlin.plugin.serialization` Gradle 外掛、[執行時期函式庫](#libraries)以及編譯器外掛。

編譯器外掛 `kotlinx-serialization-compiler-plugin` 和 `kotlinx-serialization-compiler-plugin-embeddable` 直接發佈到 Maven Central。第二個外掛專為與 `kotlin-compiler-embeddable` 構件協同工作而設計，這是指令碼構件的預設選項。Gradle 會將編譯器外掛作為編譯器引數新增到您的專案中。

## 函式庫

`kotlinx.serialization` 為所有支援的平台——JVM、JavaScript、Native——以及各種序列化格式——JSON、CBOR、Protocol Buffers 等等——提供了一系列函式庫。您可以在[下方](#formats)找到所有支援的序列化格式的完整列表。

所有 Kotlin 序列化函式庫都屬於 `org.jetbrains.kotlinx:` 群組。它們的名稱以 `kotlinx-serialization-` 開頭，並帶有反映序列化格式的後綴。例如：
* `org.jetbrains.kotlinx:kotlinx-serialization-json` 為 Kotlin 專案提供 JSON 序列化功能。
* `org.jetbrains.kotlinx:kotlinx-serialization-cbor` 提供 CBOR 序列化功能。

特定平台的構件會自動處理；您無需手動新增它們。在 JVM、JS、Native 和多平台專案中使用相同的依賴。

請注意，`kotlinx.serialization` 函式庫使用其自己的版本控制結構，這與 Kotlin 的版本控制不符。請查看 [GitHub](https://github.com/Kotlin/kotlinx.serialization/releases) 上的發佈版本以找到最新版本。

## 格式

`kotlinx.serialization` 包含用於各種序列化格式的函式庫：

* [JSON](https://www.json.org/): [`kotlinx-serialization-json`](https://github.com/Kotlin/kotlinx.serialization/blob/master/formats/README.md#json)
* [Protocol Buffers](https://developers.google.com/protocol-buffers): [`kotlinx-serialization-protobuf`](https://github.com/Kotlin/kotlinx.serialization/blob/master/formats/README.md#protobuf)
* [CBOR](https://cbor.io/): [`kotlinx-serialization-cbor`](https://github.com/Kotlin/kotlinx.serialization/blob/master/formats/README.md#cbor)
* [Properties](https://en.wikipedia.org/wiki/.properties): [`kotlinx-serialization-properties`](https://github.com/Kotlin/kotlinx.serialization/blob/master/formats/README.md#properties)
* [HOCON](https://github.com/lightbend/config/blob/master/HOCON.md): [`kotlinx-serialization-hocon`](https://github.com/Kotlin/kotlinx.serialization/blob/master/formats/README.md#hocon) (僅限於 JVM)

請注意，除了 JSON 序列化 (`kotlinx-serialization-json`) 之外的所有函式庫都是[實驗性 (Experimental)](components-stability.md) 的，這意味著它們的 API 可能會在不另行通知的情況下更改。

還有社群維護的函式庫，支援更多序列化格式，例如 [YAML](https://yaml.org/) 或 [Apache Avro](https://avro.apache.org/)。有關可用序列化格式的詳細資訊，請參閱 [`kotlinx.serialization` 文件](https://github.com/Kotlin/kotlinx.serialization/blob/master/formats/README.md)。

## 範例：JSON 序列化

讓我們看看如何將 Kotlin 物件序列化為 JSON。

### 新增外掛和依賴

開始之前，您必須配置您的建置指令碼，以便在專案中使用 Kotlin 序列化工具：

1. 應用 Kotlin 序列化 Gradle 外掛 `org.jetbrains.kotlin.plugin.serialization` (或在 Kotlin Gradle DSL 中使用 `kotlin("plugin.serialization")`)。

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

2. 新增 JSON 序列化函式庫依賴：`org.jetbrains.kotlinx:kotlinx-serialization-json:%serializationVersion%`

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

現在您已準備好在程式碼中使用序列化 API。該 API 位於 `kotlinx.serialization` 套件及其特定格式的子套件中，例如 `kotlinx.serialization.json`。

### 序列化和反序列化 JSON

1. 透過使用 `@Serializable` 註解類別來使其可序列化。

```kotlin
import kotlinx.serialization.Serializable

@Serializable
data class Data(val a: Int, val b: String)
```

2. 透過呼叫 `Json.encodeToString()` 來序列化此類別的實例。

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

結果，您將得到一個包含此物件狀態的 JSON 格式字串：`{"a": 42, "b": "str"}`

> 您也可以在一次呼叫中序列化物件集合，例如列表：
> 
> ```kotlin
> val dataList = listOf(Data(42, "str"), Data(12, "test"))
> val jsonList = Json.encodeToString(dataList)
> ```
> 
{style="note"}

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

就是這樣！您已成功將物件序列化為 JSON 字串並將其反序列化回物件。

## 下一步

有關 Kotlin 中序列化的更多資訊，請參閱 [Kotlin 序列化指南](https://github.com/Kotlin/kotlinx.serialization/blob/master/docs/serialization-guide.md)。

您可以在以下資源中探索 Kotlin 序列化的不同方面：

* [深入了解 Kotlin 序列化及其核心概念](https://github.com/Kotlin/kotlinx.serialization/blob/master/docs/basic-serialization.md)
* [探索 Kotlin 的內建可序列化類別](https://github.com/Kotlin/kotlinx.serialization/blob/master/docs/builtin-classes.md)
* [更詳細地了解序列化器並學習如何建立自訂序列化器](https://github.com/Kotlin/kotlinx.serialization/blob/master/docs/serializers.md)
* [了解 Kotlin 中如何處理多態序列化](https://github.com/Kotlin/kotlinx.serialization/blob/master/docs/polymorphism.md#open-polymorphism)
* [深入了解處理 Kotlin 序列化的各種 JSON 功能](https://github.com/Kotlin/kotlinx.serialization/blob/master/docs/json.md#json-elements)
* [深入了解 Kotlin 支援的實驗性序列化格式](https://github.com/Kotlin/kotlinx.serialization/blob/master/docs/formats.md)