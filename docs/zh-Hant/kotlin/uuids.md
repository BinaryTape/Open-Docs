---
title: UUID
description: 了解如何在 Kotlin 中使用 UUID，包括在多平台和 JVM 程式碼中建立、剖析、格式化、序列化以及處理 UUID 值。
---

[//]: # (title: UUID)

[`Uuid`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/-uuid/) 類別代表通用唯一識別符號 (UUID)，也稱為全域唯一識別符號 (GUID)。

`Uuid` 是一個 128 位元的值，用於唯一識別實體，而不依賴分配 ID 的中央系統。這使得 UUID 在分散式應用程式、資料庫、用戶端產生的記錄或 [Kotlin 多平台](https://kotlinlang.org/docs/multiplatform/get-started.html) 應用程式中非常有用。

使用 `Uuid` 類別來處理 UUID 值。與純字串不同，專用的 UUID 型別使您的程式碼更明確，並防止意外使用無效值。

要在您的專案中使用 UUID，請從 `kotlin.uuid` 封裝中匯入 `Uuid` 類別：

```kotlin
import kotlin.uuid.Uuid
```

## 產生 UUID

要為一般識別符號（例如使用者或資料庫 ID）產生隨機的第 4 版 UUID，請使用 [`Uuid.random()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/-uuid/-companion/random.html) 函式：

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

您還可以使用以下[實驗性](components-stability.md#stability-levels-explained)功能函式產生特定版本的 UUID：

* [`Uuid.generateV4()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/-uuid/-companion/generate-v4.html) 函式產生與 `Uuid.random()` 函式相同類型的 UUID，但明確說明該值是第 4 版 UUID。
* [`Uuid.generateV7()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/-uuid/-companion/generate-v7.html) 函式產生帶有時間戳記的第 7 版 UUID，您可以將其用於 UUID 排序。
* [`Uuid.generateV7NonMonotonicAt()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/-uuid/-companion/generate-v7-non-monotonic-at.html) 函式為特定時間點產生第 7 版 UUID。

這些 UUID 產生函式是實驗性的。要選擇加入 (Opt-in)，請使用 `@OptIn(ExperimentalUuidApi::class)` 註解，或在您的組建檔案中加入以下編譯器選項：

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

以下是產生特定版本 UUID 的範例：

```kotlin
import kotlin.time.Instant
import kotlin.time.ExperimentalTime
import kotlin.uuid.Uuid

@OptIn(kotlin.uuid.ExperimentalUuidApi::class, ExperimentalTime::class)
fun main() {
    // 產生第 4 版 UUID
    val idVersion4 = Uuid.generateV4()
    println(idVersion4)

    // 產生第 7 版 UUID
    val idVersion7 = Uuid.generateV7()
    println(idVersion7)

    // 為指定的時間戳記產生第 7 版 UUID
    val timestamp = Instant.fromEpochMilliseconds(1757440583000L)
    val idVersion7SpecificTime = Uuid.generateV7NonMonotonicAt(timestamp)
    println(idVersion7SpecificTime)
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.3"}

## 剖析 UUID

UUID 值通常以字串表示，例如在 URL 參數或資料庫記錄中。

要將 `String` 值轉換為 `Uuid` 值，請使用 [`Uuid.parse()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/-uuid/-companion/parse.html) 函式：

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

`Uuid.parse()` 函式同時接受標準的十六進位與連字號格式，以及不含連字號的十六進位格式。

如果輸入無效，`Uuid.parse()` 函式會拋出 `IllegalArgumentException`：

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

如果您的應用程式僅接受一種表示形式，請使用格式專用的函式：

* [`Uuid.parseHexDash()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/-uuid/-companion/parse-hex-dash.html) 用於十六進位與連字號字串表示法。
* [`Uuid.parseHex()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/-uuid/-companion/parse-hex.html) 用於不含連字號的十六進位字串表示法。

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

如果您有來自外部來源的 UUID，且必須安全地處理無效輸入，請使用 [`Uuid.parseOrNull()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/-uuid/-companion/parse-or-null.html)、[`Uuid.parseHexDashOrNull()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/-uuid/-companion/parse-hex-dash-or-null.html) 或 [`Uuid.parseHexOrNull()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/-uuid/-companion/parse-hex-or-null.html)。如果輸入無效，這些函式會傳回 `null`：

```kotlin
fun parseId(input: String): Uuid? { 
    return Uuid.parseOrNull(input) 
}
```

## 將 UUID 轉換為字串

您可以使用以下函式將 `Uuid` 值轉換為 `String` 值：

* [`toString()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/-uuid/to-string.html) 用於標準字串表示法
* [`toHexDashString()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/-uuid/to-hex-dash-string.html) 用於十六進位與連字號格式
* [`toHexString()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/-uuid/to-hex-string.html) 用於不含連字號的十六進位格式

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

## 比較 UUID

您可以使用 `==` 運算子檢查 `Uuid` 值是否相等。

Kotlin 會根據 UUID 的值進行比較，而不是根據文字表示法。例如，如果兩個不同形式的值代表相同的 128 位元值，則它們相等：

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

這使得 `Uuid` 比較比字串比較更可靠，字串比較會將不同格式的相同值視為不同的值。`Uuid` 比較會檢查實際的識別符號值。

`Uuid` 實作了 `Comparable<Uuid>` 介面，因此可以使用標準集合函式（如 `sorted()`）對 UUID 值進行排序。在這種情況下，Kotlin 會按字典序比較值（從最高有效位元到最低有效位元）：

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

## 處理二進制表示法

某些 API、儲存格式和二進制協定不將 UUID 表示為字串。相反地，它們將 128 位元 UUID 值儲存為以下任一形式：

* 16 位元組陣列
* 兩個 64 位元值

當您需要與預期二進制 UUID 資料的系統交換 UUID 時，請使用這些表示法。

要在 UUID 和 16 位元組表示法之間進行轉換，請使用 [`.toByteArray()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/-uuid/to-byte-array.html) 和 [`Uuid.fromByteArray()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/-uuid/-companion/from-byte-array.html) 函式：

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

您也可以將相同的 128 位元 UUID 值表示為兩個 `Long` 值。這很有用，因為 Kotlin 沒有提供內建的 128 位元整數型別。這兩個 `Long` 值將 UUID 儲存在兩個部分：

* `mostSignificantBits` 參數用於 UUID 的前 64 位元。
* `leastSignificantBits` 參數用於 UUID 的後 64 位元。

要從兩個 `Long` 值建立 `Uuid` 值，請使用 [`Uuid.fromLongs()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/-uuid/-companion/from-longs.html) 函式：

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

要從現有的 `Uuid` 值中提取這兩個部分，請使用 [`Uuid.toLongs()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/-uuid/to-longs.html) 函式：

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

Kotlin 支援對 `Uuid` 值進行序列化。使用它在 Kotlin 程式碼之外儲存或傳輸 UUID 值，例如在 JSON API 或組態檔案中。

要序列化 `Uuid` 值，除非您的應用程式需要其他格式，否則將其表示為字串。[`kotlinx.serialization`](https://kotlinlang.org/docs/serialization.html) 程式庫使用十六進位與連字號格式：

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

## 搭配 Java API 使用 UUID

Java 使用 `java.util.UUID` 類別來代表 UUID。在 JVM 上，Java API 可能會接受或回傳此型別。雖然 `java.util.UUID` 和 `kotlin.uuid.Uuid` 都代表 UUID，但它們是兩個不同的型別。

在 Kotlin 和 Java 之間傳遞 UUID 時，請明確轉換值：

* 使用 [`.toKotlinUuid()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/to-kotlin-uuid.html) 擴充方法將 Java UUID 轉換為 Kotlin：

  ```kotlin
  import kotlin.uuid.toKotlinUuid
  
  val kotlinId: Uuid = javaId.toKotlinUuid()
  ```

* 使用 [`.toJavaUuid()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/to-java-uuid.html) 擴充方法將 Kotlin UUID 轉換為 Java：

  ```kotlin
  import kotlin.uuid.toJavaUuid
  
  val javaId: java.util.UUID = kotlinId.toJavaUuid()
  ```

這些函式允許您在 JVM 互通性邊界使用 `Uuid` 代表您的 UUID 值。

> `java.util.UUID` 和 `kotlin.uuid.Uuid` 類別是可比較的，但排序可能有所不同。從 Java API 遷移到 Kotlin API 之前，請務必檢查依賴 UUID 排序的程式碼。
>
{style="note"}

Kotlin 還提供對處理 Java 緩衝區的支援。使用 JVM 專用的函式來處理 `ByteBuffer` 中的 UUID：

* 使用 [`.getUuid()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/get-uuid.html) 函式從緩衝區讀取 UUID。
* 使用 [`.putUuid()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/put-uuid.html) 函式將 UUID 寫入緩衝區。