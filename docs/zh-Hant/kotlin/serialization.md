[//]: # (title: 序列化)

_序列化_是將應用程式使用的資料轉換為可以透過網路傳輸，或儲存於資料庫或檔案中的格式的過程。反之，_反序列化_是從外部來源讀取資料並將其轉換為執行時物件的相反過程。這兩者對於大多數與第三方交換資料的應用程式來說都至關重要。

某些資料序列化格式，例如 [JSON](https://www.json.org/json-en.html) 和 [protocol buffers](https://developers.google.com/protocol-buffers) 特別常見。由於它們具備語言無關性與平台無關性，因此能夠在以任何現代語言編寫的系統之間進行資料交換。

在 Kotlin 中，資料序列化工具由一個獨立的組件 [kotlinx.serialization](https://github.com/Kotlin/kotlinx.serialization) 提供。它由幾個部分組成：`org.jetbrains.kotlin.plugin.serialization` Gradle 外掛程式、[執行階段庫](#libraries)以及編譯器外掛程式。

編譯器外掛程式 `kotlinx-serialization-compiler-plugin` 和 `kotlinx-serialization-compiler-plugin-embeddable` 會直接發佈到 Maven Central。第二個外掛程式專為配合 `kotlin-compiler-embeddable` 構件使用而設計，這是指令碼構件的預設選項。Gradle 會將編譯器外掛程式作為編譯器引數新增到您的專案中。

## 庫

`kotlinx.serialization` 為所有支援的平台（JVM、JavaScript、Native）以及各種序列化格式（JSON、CBOR、protocol buffers 等）提供了一系列庫。您可以在[下方](#formats)找到支援的序列化格式完整清單。

所有 Kotlin 序列化庫都屬於 `org.jetbrains.kotlinx:` 群組。它們的名稱以 `kotlinx-serialization-` 開頭，並帶有反映序列化格式的後綴。例如：
* `org.jetbrains.kotlinx:kotlinx-serialization-json` 為 Kotlin 專案提供 JSON 序列化。
* `org.jetbrains.kotlinx:kotlinx-serialization-cbor` 提供 CBOR 序列化。

平台特定的構件會自動處理；您不需要手動新增它們。在 JVM、JS、Native 和多平台專案中使用相同的相依性即可。

請注意，`kotlinx.serialization` 庫使用自己的版本管理結構，與 Kotlin 的版本並不一致。請查看 [GitHub](https://github.com/Kotlin/kotlinx.serialization/releases) 上的版本發佈以尋找最新版本。

## 格式

`kotlinx.serialization` 包含適用於各種序列化格式的庫：

* [JSON](https://www.json.org/): [`kotlinx-serialization-json`](https://github.com/Kotlin/kotlinx.serialization/blob/master/formats/README.md#json)
* [Protocol buffers](https://developers.google.com/protocol-buffers): [`kotlinx-serialization-protobuf`](https://github.com/Kotlin/kotlinx.serialization/blob/master/formats/README.md#protobuf)
* [CBOR](https://cbor.io/): [`kotlinx-serialization-cbor`](https://github.com/Kotlin/kotlinx.serialization/blob/master/formats/README.md#cbor)
* [Properties](https://en.wikipedia.org/wiki/.properties): [`kotlinx-serialization-properties`](https://github.com/Kotlin/kotlinx.serialization/blob/master/formats/README.md#properties)
* [HOCON](https://github.com/lightbend/config/blob/master/HOCON.md): [`kotlinx-serialization-hocon`](https://github.com/Kotlin/kotlinx.serialization/blob/master/formats/README.md#hocon)（僅限 JVM）

請注意，除 JSON 序列化 (`kotlinx-serialization-json`) 之外，所有庫均處於[實驗功能](components-stability.md)階段，這意味著其 API 可能會在不經通知的情況下發生更動。

此外還有由社群維護的庫，支援更多序列化格式，例如 [YAML](https://yaml.org/) 或 [Apache Avro](https://avro.apache.org/)。有關可用序列化格式的詳細資訊，請參閱 [`kotlinx.serialization` 文件](https://github.com/Kotlin/kotlinx.serialization/blob/master/formats/README.md)。

## 範例：JSON 序列化

讓我們來看看如何將 Kotlin 物件序列化為 JSON。

### 新增外掛程式與相依性

在開始之前，您必須配置建置指令碼，以便在專案中使用 Kotlin 序列化工具：

1. 套用 Kotlin 序列化 Gradle 外掛程式 `org.jetbrains.kotlin.plugin.serialization`（或在 Kotlin Gradle DSL 中使用 `kotlin("plugin.serialization")`）。

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

2. 新增 JSON 序列化庫相依性：`org.jetbrains.kotlinx:kotlinx-serialization-json:%serializationVersion%`

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

現在您可以在程式碼中使用序列化 API 了。該 API 位於 `kotlinx.serialization` 套件及其格式特定子套件中，例如 `kotlinx.serialization.json`。

### 序列化與反序列化 JSON

1. 透過使用 `@Serializable` 進行註解，使類別可序列化。

    ```kotlin
    import kotlinx.serialization.Serializable
    
    @Serializable
    data class Data(val a: Int, val b: String)
    ```

2. 透過呼叫 `Json.encodeToString()` 來序列化該類別的執行個體。

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

   結果，您將得到一個包含該物件狀態的 JSON 格式字串：`{"a": 42, "b": "str"}`

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

就這樣！您已成功將物件序列化為 JSON 字串，並將其反序列化回物件。

## 下一步

欲了解更多關於 Kotlin 序列化的資訊，請參閱 [Kotlin 序列化指南](https://github.com/Kotlin/kotlinx.serialization/blob/master/docs/serialization-guide.md)。

您可以透過以下資源探索 Kotlin 序列化的不同面向：

* [進一步了解 Kotlin 序列化及其核心概念](https://github.com/Kotlin/kotlinx.serialization/blob/master/docs/basic-serialization.md)
* [探索 Kotlin 內建的可序列化類別](https://github.com/Kotlin/kotlinx.serialization/blob/master/docs/builtin-classes.md)
* [詳細了解序列化器以及如何建立自訂序列化器](https://github.com/Kotlin/kotlinx.serialization/blob/master/docs/serializers.md)
* [探索 Kotlin 如何處理多型序列化](https://github.com/Kotlin/kotlinx.serialization/blob/master/docs/polymorphism.md#open-polymorphism)
* [了解處理 Kotlin 序列化的各種 JSON 特性](https://github.com/Kotlin/kotlinx.serialization/blob/master/docs/json.md#json-elements)
* [進一步了解 Kotlin 支援的實驗性序列化格式](https://github.com/Kotlin/kotlinx.serialization/blob/master/docs/formats.md)