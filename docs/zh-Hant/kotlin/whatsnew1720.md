[//]: # (title: Kotlin 1.7.20 有什麼新功能)

<tldr>
   <p>Kotlin 1.7.20 的 IDE 支援適用於 IntelliJ IDEA 2021.3、2022.1 及 2022.2。</p>
</tldr>

_[發佈日期：2022 年 9 月 29 日](releases.md#release-details)_

Kotlin 1.7.20 版本現已發佈！以下是此版本的一些亮點：

* [新的 Kotlin K2 編譯器支援 `all-open`、帶接收者的 SAM、Lombok 及其他編譯器外掛程式](#support-for-kotlin-k2-compiler-plugins)
* [我們推出了 `..<` 運算子的預覽版，用於建立開放區間](#preview-of-the-operator-for-creating-open-ended-ranges)
* [新的 Kotlin/Native 記憶體管理員現已預設啟用](#the-new-kotlin-native-memory-manager-enabled-by-default)
* [我們為 JVM 引入了一項新的實驗性功能：具有泛型基礎型別的行內類別](#generic-inline-classes)

您也可以透過此影片簡要了解這些變更：

<video src="https://www.youtube.com/v/OG9npowJgE8" title="What's new in Kotlin 1.7.20"/>

## 支援 Kotlin K2 編譯器外掛程式

Kotlin 團隊持續穩定 K2 編譯器。
K2 仍處於 **Alpha** 階段（如 [Kotlin 1.7.0 版本](whatsnew17.md#new-kotlin-k2-compiler-for-the-jvm-in-alpha) 中所宣佈），但它現在支援多個編譯器外掛程式。您可以追蹤 [此 YouTrack issue](https://youtrack.jetbrains.com/issue/KT-52604) 以獲取 Kotlin 團隊關於新編譯器的更新。

從 1.7.20 版本開始，Kotlin K2 編譯器支援以下外掛程式：

* [`all-open`](all-open-plugin.md)
* [`no-arg`](no-arg-plugin.md)
* [SAM with receiver](sam-with-receiver-plugin.md)
* [Lombok](lombok.md)
* AtomicFU
* `jvm-abi-gen`

> 新 K2 編譯器的 Alpha 版本僅適用於 JVM 專案。
> 它不支援 Kotlin/JS、Kotlin/Native 或其他多平台專案。
>
{style="warning"}

透過以下影片了解更多關於新編譯器及其優勢的資訊：
* [The Road to the New Kotlin Compiler](https://www.youtube.com/watch?v=iTdJJq_LyoY)
* [K2 Compiler: a Top-Down View](https://www.youtube.com/watch?v=db19VFLZqJM)

### 如何啟用 Kotlin K2 編譯器

要啟用 Kotlin K2 編譯器並進行測試，請使用以下編譯器選項：

```bash
-Xuse-k2
```

您可以在 `build.gradle(.kts)` 檔案中指定它：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
tasks.withType<KotlinCompile> {
    kotlinOptions.useK2 = true
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
compileKotlin {
    kotlinOptions.useK2 = true
}
```
</tab>
</tabs>

在您的 JVM 專案上查看效能提升，並與舊編譯器的結果進行比較。

### 提供您對新 K2 編譯器的意見回饋

我們非常感謝您以任何形式提供意見回饋：
* 直接在 Kotlin Slack 中向 K2 開發人員提供您的意見回饋：[獲取邀請](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up?_gl=1*ju6cbn*_ga*MTA3MTk5NDkzMC4xNjQ2MDY3MDU4*_ga_9J976DJZ68*MTY1ODMzNzA3OS4xMDAuMS4xNjU4MzQwODEwLjYw) 並加入 [#k2-early-adopters](https://kotlinlang.slack.com/archives/C03PK0PE257) 頻道。
* 向 [我們的 issue tracker](https://kotl.in/issue) 報告您在使用新 K2 編譯器時遇到的任何問題。
* [啟用 **發送使用統計數據** 選項](https://www.jetbrains.com/help/idea/settings-usage-statistics.html) 以允許 JetBrains 收集有關 K2 使用的匿名數據。

## 語言

Kotlin 1.7.20 引入了新語言功能的預覽版本，並對建構器型別推斷 (builder type inference) 施加了限制：

* [用於建立開放區間的 `..<` 運算子預覽](#preview-of-the-operator-for-creating-open-ended-ranges)
* [新的資料物件宣告](#improved-string-representations-for-singletons-and-sealed-class-hierarchies-with-data-objects)
* [建構器型別推斷限制](#new-builder-type-inference-restrictions)

### 用於建立開放區間的 `..<` 運算子預覽

> 這個新運算子是 [實驗性的](components-stability.md#stability-levels-explained)，且在 IDE 中的支援有限。
>
{style="warning"}

此版本引入了新的 `..<` 運算子。Kotlin 擁有 `..` 運算子來表示數值區間。新的 `..<` 運算子作用類似 `until` 函數，可協助您定義開放區間。

<video src="https://www.youtube.com/watch?v=v0AHdAIBnbs" title="New operator for open-ended ranges"/>

我們的研究顯示，這個新運算子在表達開放區間方面做得更好，並明確指出上限不包含在內。

以下是在 `when` 表達式中使用 `..<` 運算子的範例：

```kotlin
when (value) {
    in 0.0..<0.25 -> // 第一個季度
    in 0.25..<0.5 -> // 第二個季度
    in 0.5..<0.75 -> // 第三個季度
    in 0.75..1.0 ->  // 最後一個季度  <- 請注意這裡是一個閉區間
}
```
{validate="false"}

#### 標準函式庫 API 變更

以下新的型別和操作將在通用 Kotlin 標準函式庫的 `kotlin.ranges` 軟體包中引入：

##### 新的 OpenEndRange&lt;T&gt; 介面

表示開放區間的新介面與現有的 `ClosedRange<T>` 介面非常相似：

```kotlin
interface OpenEndRange<T : Comparable<T>> {
    // 下限
    val start: T
    // 上限，不包含在區間內
    val endExclusive: T
    operator fun contains(value: T): Boolean = value >= start && value < endExclusive
    fun isEmpty(): Boolean = start >= endExclusive
}
```
{validate="false"}

##### 在現有可疊代區間中實作 OpenEndRange

當開發人員需要獲取一個不包含上限的區間時，他們目前使用 `until` 函數來有效地產生一個具有相同值的閉合可疊代區間。為了使這些區間在採用 `OpenEndRange<T>` 的新 API 中可用，我們希望在現有的可疊代區間：`IntRange`、`LongRange`、`CharRange`、`UIntRange` 和 `ULongRange` 中實作該介面。這樣它們將同時實作 `ClosedRange<T>` 和 `OpenEndRange<T>` 兩個介面。

```kotlin
class IntRange : IntProgression(...), ClosedRange<Int>, OpenEndRange<Int> {
    override val start: Int
    override val endInclusive: Int
    override val endExclusive: Int
}
```
{validate="false"}

##### 標準型別的 rangeUntil 運算子

`rangeUntil` 運算子將提供給目前由 `rangeTo` 運算子定義的相同型別和組合。我們將其作為原型目的的擴充函數提供，但為了保持一致性，我們計劃在穩定開放區間 API 之前將它們變為成員。

#### 如何啟用 `..<` 運算子

要使用 `..<` 運算子或為您自己的型別實作該運算子慣例，請啟用 `-language-version 1.8` 編譯器選項。

為支援標準型別的開放區間而引入的新 API 元素需要選擇啟用 (opt-in)，這對於實驗性標準函式庫 API 來說是常見做法：`@OptIn(ExperimentalStdlibApi::class)`。或者，您也可以使用 `-opt-in=kotlin.ExperimentalStdlibApi` 編譯器選項。

[在此 KEEP 文件中閱讀更多關於新運算子的資訊](https://github.com/kotlin/KEEP/blob/open-ended-ranges/proposals/open-ended-ranges.md)。

### 使用資料物件 (data object) 改進單例 (singleton) 和密封類別階層 (sealed class hierarchy) 的字串表示

> 資料物件 (Data objects) 是 [實驗性的](components-stability.md#stability-levels-explained)，且目前在 IDE 中的支援有限。
>
{style="warning"}

此版本引入了一種新的 `object` 宣告型別供您使用：`data object`。[資料物件](https://youtrack.jetbrains.com/issue/KT-4107) 在概念上與常規的 `object` 宣告相同，但預設提供了簡潔的 `toString` 表示。

<video src="https://www.youtube.com/v/ovAqcwFhEGc" title="Data objects in Kotlin 1.7.20"/>

```kotlin
package org.example
object MyObject
data object MyDataObject

fun main() {
    println(MyObject) // org.example.MyObject@1f32e575
    println(MyDataObject) // MyDataObject
}
```

這使得 `data object` 宣告非常適合密封類別階層，您可以在其中將它們與 `data class` 宣告一起使用。在此程式碼片段中，將 `EndOfFile` 宣告為 `data object` 而非普通的 `object` 意味著它將獲得一個美觀的 `toString` 表示，無需手動覆寫，與伴隨的 `data class` 定義保持對稱性：

```kotlin
sealed class ReadResult {
    data class Number(val value: Int) : ReadResult()
    data class Text(val value: String) : ReadResult()
    data object EndOfFile : ReadResult()
}

fun main() {
    println(ReadResult.Number(1)) // Number(value=1)
    println(ReadResult.Text("Foo")) // Text(value=Foo)
    println(ReadResult.EndOfFile) // EndOfFile
}
```

#### 如何啟用資料物件

要在您的程式碼中使用資料物件宣告，請啟用 `-language-version 1.9` 編譯器選項。在 Gradle 專案中，您可以透過在 `build.gradle(.kts)` 中加入以下內容來實現：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
tasks.withType<org.jetbrains.kotlin.gradle.tasks.KotlinCompile>().configureEach {
    // ...
    kotlinOptions.languageVersion = "1.9"
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
compileKotlin {
    // ...
    kotlinOptions.languageVersion = '1.9'
}
```
</tab>
</tabs>

閱讀更多關於資料物件的資訊，並在 [相應的 KEEP 文件](https://github.com/Kotlin/KEEP/pull/316) 中分享您對其實作的意見回饋。

### 新的建構器型別推斷限制

Kotlin 1.7.20 對 [建構器型別推斷的使用](using-builders-with-builder-inference.md) 施加了一些主要限制，這可能會影響您的程式碼。這些限制適用於包含建構器 lambda 函數的程式碼，在這種情況下，若不分析 lambda 本身，就無法推導出參數。該參數被用作引數。現在，編譯器將始終對此類程式碼顯示錯誤，並要求您明確指定型別。

這是一個破壞性變更，但我們的研究顯示這些情況非常罕見，且這些限制不應影響您的程式碼。如果確實受到影響，請考慮以下情況：

* 使用隱藏成員的擴充函數進行建構器推斷。

  如果您的程式碼包含一個與建構器推斷期間將使用的擴充函數同名的函數，編譯器將會向您顯示錯誤：

    ```kotlin
    class Data {
        fun doSmth() {} // 1
    }
    
    fun <T> T.doSmth() {} // 2
    
    fun test() {
        buildList {
            this.add(Data())
            this.get(0).doSmth() // 解析為 2 並導致錯誤
        }
    }
    ```
    {validate="false"} 
  
  要修正程式碼，您應該明確指定型別：

    ```kotlin
    class Data {
        fun doSmth() {} // 1
    }
    
    fun <T> T.doSmth() {} // 2
    
    fun test() {
        buildList<Data> { // 型別引數！
            this.add(Data())
            this.get(0).doSmth() // 解析為 1
        }
    }
    ```

* 在建構器推斷中使用多個 lambda，且型別引數未明確指定。

  如果在建構器推斷中有兩個或更多 lambda 區塊，它們會影響型別。為防止錯誤，編譯器要求您指定型別：

    ```kotlin
    fun <T: Any> buildList(
        first: MutableList<T>.() -> Unit, 
        second: MutableList<T>.() -> Unit
    ): List<T> {
        val list = mutableListOf<T>()
        list.first()
        list.second()
        return list 
    }
    
    fun main() {
        buildList(
            first = { // this: MutableList<String>
                add("")
            },
            second = { // this: MutableList<Int> 
                val i: Int = get(0)
                println(i)
            }
        )
    }
    ```
    {validate="false"}

  要修正錯誤，您應該明確指定型別並修正型別不匹配的問題：

    ```kotlin
    fun main() {
        buildList<Int>(
            first = { // this: MutableList<Int>
                add(0)
            },
            second = { // this: MutableList<Int>
                val i: Int = get(0)
                println(i)
            }
        )
    }
    ```

如果您沒有找到上述提到的情況，請向我們的團隊 [提出 issue](https://kotl.in/issue)。

有關此建構器推斷更新的更多資訊，請參見此 [YouTrack issue](https://youtrack.jetbrains.com/issue/KT-53797)。

## Kotlin/JVM

Kotlin 1.7.20 引入了泛型行內類別 (generic inline classes)，為委託屬性 (delegated properties) 增加了更多位元組碼最佳化，並在 kapt stub 生成任務中支援 IR，使得所有最新的 Kotlin 功能都能與 kapt 一起使用：

* [泛型行內類別](#generic-inline-classes)
* [更多經過最佳化的委託屬性案例](#more-optimized-cases-of-delegated-properties)
* [kapt stub 生成任務中對 JVM IR 後端的支援](#support-for-the-jvm-ir-backend-in-kapt-stub-generating-task)

### 泛型行內類別

> 泛型行內類別是一個 [實驗性](components-stability.md#stability-levels-explained) 功能。
> 它可能隨時被移除或更改。需要選擇啟用 (opt-in)（詳情見下文），且您應僅將其用於評估目的。
> 我們非常感謝您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-52994) 上提供關於此功能的意見回饋。
>
{style="warning"}

Kotlin 1.7.20 允許 JVM 行內類別的基礎型別是一個型別參數。編譯器將其映射到 `Any?` 或通常是型別參數的上限。

<video src="https://www.youtube.com/v/0JRPA0tt9og" title="Generic inline classes in Kotlin 1.7.20"/>

請考慮以下範例：

```kotlin
@JvmInline
value class UserId<T>(val value: T)

fun compute(s: UserId<String>) {} // 編譯器生成 fun compute-<hashcode>(s: Any?)
```

該函數接受行內類別作為參數。參數被映射到上限，而不是型別引數。

要啟用此功能，請使用 `-language-version 1.8` 編譯器選項。

我們非常感謝您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-52994) 上提供關於此功能的意見回饋。

### 更多經過最佳化的委託屬性案例

在 Kotlin 1.6.0 中，我們透過省略 `$delegate` 欄位並 [生成對引用屬性的直接存取](whatsnew16.md#optimize-delegated-properties-which-call-get-set-on-the-given-kproperty-instance) 來最佳化了委託給屬性的情況。在 1.7.20 中，我們已將此最佳化實作於更多案例。如果委託是一個，現在將省略 `$delegate` 欄位：

* 一個具名物件 (named object)：

  ```kotlin
  object NamedObject {
      operator fun getValue(thisRef: Any?, property: KProperty<*>): String = ...
  }
  
  val s: String by NamedObject
  ```
  {validate="false"}

* 一個在相同模組中具有 [後備欄位 (backing field)](properties.md#backing-fields) 和預設 getter 的最終 `val` 屬性：

  ```kotlin
  val impl: ReadOnlyProperty<Any?, String> = ...
  
  class A {
      val s: String by impl
  }
  ```
  {validate="false"}

* 一個常數表達式、一個列舉條目、`this` 或 `null`。以下是 `this` 的範例：

  ```kotlin
  class A {
      operator fun getValue(thisRef: Any?, property: KProperty<*>) ...
   
      val s by this
  }
  ```
  {validate="false"}

了解更多關於 [委託屬性](delegated-properties.md) 的資訊。

我們非常感謝您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-23397) 上提供關於此功能的意見回饋。

### kapt stub 生成任務中對 JVM IR 後端的支援

> kapt stub 生成任務中對 JVM IR 後端的支援是一個 [實驗性](components-stability.md) 功能。
> 它可能隨時被更改。需要選擇啟用 (opt-in)（詳情見下文），且您應僅將其用於評估目的。
>
{style="warning"}

在 1.7.20 之前，kapt stub 生成任務使用舊的後端，且 [可重複註解 (repeatable annotations)](annotations.md#repeatable-annotations) 無法與 [kapt](kapt.md) 配合使用。在 Kotlin 1.7.20 中，我們已在 kapt stub 生成任務中新增了對 [JVM IR 後端](whatsnew15.md#stable-jvm-ir-backend) 的支援。這使得所有最新的 Kotlin 功能（包括可重複註解）都能與 kapt 一起使用。

要在 kapt 中使用 IR 後端，請將以下選項添加到您的 `gradle.properties` 檔案中：

```none
kapt.use.jvm.ir=true
```

我們非常感謝您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-49682) 上提供關於此功能的意見回饋。

## Kotlin/Native

Kotlin 1.7.20 預設啟用新的 Kotlin/Native 記憶體管理員，並為您提供了自訂 `Info.plist` 檔案的選項：

* [新的預設記憶體管理員](#the-new-kotlin-native-memory-manager-enabled-by-default)
* [自訂 `Info.plist` 檔案](#customizing-the-info-plist-file)

### 預設啟用新的 Kotlin/Native 記憶體管理員

此版本為新的記憶體管理員帶來了進一步的穩定性和效能改進，使我們能夠將新的記憶體管理員提升至 [Beta](components-stability.md) 版本。

之前的記憶體管理員使編寫並發 (concurrent) 和非同步 (asynchronous) 程式碼變得複雜，包括實作 `kotlinx.coroutines` 函式庫時遇到的問題。這阻礙了 Kotlin Multiplatform Mobile 的採用，因為並發限制導致在 iOS 和 Android 平台之間共享 Kotlin 程式碼時出現問題。新的記憶體管理員最終為 [將 Kotlin Multiplatform Mobile 提升至 Beta 版本](https://blog.jetbrains.com/kotlin/2022/05/kotlin-multiplatform-mobile-beta-roadmap-update/) 鋪平了道路。

新的記憶體管理員也支援編譯器快取，使編譯時間與之前版本相當。有關新記憶體管理員優勢的更多資訊，請參閱我們關於預覽版本的原始 [部落格文章](https://blog.jetbrains.com/kotlin/2021/08/try-the-new-kotlin-native-memory-manager-development-preview/)。您可以在 [文件中](native-memory-manager.md) 找到更多技術細節。

#### 配置與設定

從 Kotlin 1.7.20 開始，新的記憶體管理員為預設。不需要太多額外設定。

如果您已經手動開啟它，您可以從 `gradle.properties` 中移除 `kotlin.native.binary.memoryModel=experimental` 選項，或從 `build.gradle(.kts)` 檔案中移除 `binaryOptions["memoryModel"] = "experimental"`。

如有必要，您可以在 `gradle.properties` 中使用 `kotlin.native.binary.memoryModel=strict` 選項切換回舊版記憶體管理員。然而，舊版記憶體管理員不再支援編譯器快取，因此編譯時間可能會變差。

#### 凍結 (Freezing)

在新記憶體管理員中，凍結功能已棄用。除非您的程式碼需要與舊版管理員配合使用（舊版仍需要凍結），否則請勿使用此功能。這對於需要維護舊版記憶體管理員支援的函式庫作者，或在遇到新記憶體管理員問題時希望有備用方案的開發人員來說可能會有幫助。

在這種情況下，您可以暫時支援新舊記憶體管理員的程式碼。要忽略棄用警告，請執行以下任一操作：

* 使用 `@OptIn(FreezingIsDeprecated::class)` 註解棄用 API 的使用。
* 將 `languageSettings.optIn("kotlin.native.FreezingIsDeprecated")` 應用於 Gradle 中的所有 Kotlin 原始碼集。
* 傳遞編譯器標誌 `-opt-in=kotlin.native.FreezingIsDeprecated`。

#### 從 Swift/Objective-C 呼叫 Kotlin suspending 函數

新的記憶體管理員仍然限制從 Swift 和 Objective-C 呼叫來自主執行緒以外的 Kotlin `suspend` 函數，但您可以使用新的 Gradle 選項解除此限制。

此限制最初是在舊版記憶體管理員中引入的，因為在某些情況下，程式碼會將一個延續 (continuation) 分派到原始執行緒上恢復。如果該執行緒沒有支援的事件迴圈，任務將永遠不會執行，協程 (coroutine) 也永遠不會恢復。

在某些情況下，此限制不再是必需的，但無法輕易實作所有必要條件的檢查。因此，我們決定將其保留在新記憶體管理員中，同時引入一個選項讓您禁用它。為此，請將以下選項添加到您的 `gradle.properties` 中：

```none
kotlin.native.binary.objcExportSuspendFunctionLaunchThreadRestriction=none
```

> 如果您使用 `kotlinx.coroutines` 的 `native-mt` 版本或其他具有相同「分派到原始執行緒」方法的函式庫，請勿添加此選項。
>
{style="warning"}

Kotlin 團隊非常感謝 [Ahmed El-Helw](https://github.com/ahmedre) 實作此選項。

#### 提供您的意見回饋

這是我們生態系統的一個重大變更。我們非常感謝您的意見回饋，以協助我們使其變得更好。

在您的專案上試用新的記憶體管理員，並在 [我們的 issue tracker YouTrack](https://youtrack.jetbrains.com/issue/KT-48525) 中分享意見回饋。

### 自訂 `Info.plist` 檔案

當生成框架時，Kotlin/Native 編譯器會生成資訊屬性列表檔案 `Info.plist`。以前，自訂其內容非常麻煩。在 Kotlin 1.7.20 中，您可以直接設定以下屬性：

| 屬性                     | 二進位選項              |
|--------------------------|------------------------|
| `CFBundleIdentifier`     | `bundleId`             |
| `CFBundleShortVersionString` | `bundleShortVersionString` |
| `CFBundleVersion`        | `bundleVersion`        |

為此，請使用相應的二進位選項。傳遞 `-Xbinary=$option=$value` 編譯器標誌，或為所需的框架設定 `binaryOption(option, value)` Gradle DSL。

Kotlin 團隊非常感謝 Mads Ager 實作此功能。

## Kotlin/JS

Kotlin/JS 獲得了一些增強功能，這些功能改進了開發人員體驗並提升了效能：

* 由於載入依賴項的效率提高，Klib 的生成在增量構建和清理構建中都更快。
* [開發二進位檔案的增量編譯](js-ir-compiler.md#incremental-compilation-for-development-binaries) 已進行重構，從而在清理構建場景、更快的增量構建和穩定性修復方面取得了重大改進。
* 我們改進了巢狀物件 (nested objects)、密封類別 (sealed classes) 和建構子中可選參數的 `.d.ts` 生成。

## Gradle

Kotlin Gradle 外掛程式的更新主要集中於與新的 Gradle 功能和最新 Gradle 版本的相容性。

Kotlin 1.7.20 包含支援 Gradle 7.1 的變更。已棄用的方法和屬性已被移除或替換，減少了 Kotlin Gradle 外掛程式產生的棄用警告數量，並解除了對未來 Gradle 8.0 支援的阻礙。

然而，有一些潛在的破壞性變更可能需要您的注意：

### 目標配置

* `org.jetbrains.kotlin.gradle.dsl.SingleTargetExtension` 現在具有一個泛型參數：`SingleTargetExtension<T : KotlinTarget>`。
* `kotlin.targets.fromPreset()` 慣例已棄用。取而代之，您仍然可以使用 `kotlin.targets { fromPreset() }`，但我們建議 [明確設定目標](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-discover-project.html#targets)。
* Gradle 自動生成的目標存取器 (target accessors) 不再在 `kotlin.targets { }` 區塊內部可用。請改用 `findByName("targetName")` 方法。

  請注意，此類存取器在 `kotlin.targets` 的情況下仍然可用，例如 `kotlin.targets.linuxX64`。

### 原始碼目錄配置

Kotlin Gradle 外掛程式現在將 Kotlin `SourceDirectorySet` 作為 `kotlin` 擴充加入到 Java 的 `SourceSet` 群組中。這使得在 `build.gradle.kts` 檔案中配置原始碼目錄的方式與在 [Java、Groovy 和 Scala](https://docs.gradle.org/7.1/release-notes.html#easier-source-set-configuration-in-kotlin-dsl) 中配置的方式類似：

```kotlin
sourceSets {
    main {
        kotlin {
            java.setSrcDirs(listOf("src/java"))
            kotlin.setSrcDirs(listOf("src/kotlin"))
        }
    }
}
```

您不再需要使用已棄用的 Gradle 慣例並為 Kotlin 指定原始碼目錄。

請記住，您也可以使用 `kotlin` 擴充來存取 `KotlinSourceSet`：

```kotlin
kotlin {
    sourceSets {
        main {
        // ...
        }
    }
}
```

### JVM 工具鏈配置的新方法

此版本提供了一個新的 `jvmToolchain()` 方法，用於啟用 [JVM 工具鏈功能](gradle-configure-project.md#gradle-java-toolchains-support)。
如果您不需要任何額外的 [配置欄位](https://docs.gradle.org/current/javadoc/org/gradle/jvm/toolchain/JavaToolchainSpec.html)，例如 `implementation` 或 `vendor`，您可以從 Kotlin 擴充中使用此方法：

```kotlin
kotlin {
    jvmToolchain(17)
}
```

這簡化了 Kotlin 專案的設定過程，無需任何額外配置。
在此版本之前，您只能透過以下方式指定 JDK 版本：

```kotlin
kotlin {
    jvmToolchain {
        languageVersion.set(JavaLanguageVersion.of(17))
    }
}
```

## 標準函式庫

Kotlin 1.7.20 為 `java.nio.file.Path` 類別提供了新的 [擴充函數 (extension functions)](extensions.md#extension-functions)，可讓您遍歷檔案樹：

* `walk()` 函數惰性遍歷以指定路徑為根的檔案樹。
* `fileVisitor()` 使您可以單獨建立一個 `FileVisitor`。`FileVisitor` 定義了遍歷目錄和檔案時的操作。
* `visitFileTree(fileVisitor: FileVisitor, ...)` 接收一個準備好的 `FileVisitor`，並在內部使用 `java.nio.file.Files.walkFileTree()`。
* `visitFileTree(..., builderAction: FileVisitorBuilder.() -> Unit)` 透過 `builderAction` 建立一個 `FileVisitor`，並呼叫 `visitFileTree(fileVisitor, ...)` 函數。
* `FileVisitResult`，`FileVisitor` 的回傳型別，其預設值為 `CONTINUE`，表示繼續處理檔案。

> 用於 `java.nio.file.Path` 的新擴充函數是 [實驗性](components-stability.md) 的。
> 它們可能隨時被更改。需要選擇啟用 (opt-in)（詳情見下文），且您應僅將其用於評估目的。
>
{style="warning"}

以下是您可以使用這些新擴充函數執行的一些操作：

* 明確建立一個 `FileVisitor` 然後使用：

  ```kotlin
  val cleanVisitor = fileVisitor {
      onPreVisitDirectory { directory, attributes ->
          // 遍歷目錄時的某些邏輯
          FileVisitResult.CONTINUE
      }
  
      onVisitFile { file, attributes ->
          // 遍歷檔案時的某些邏輯
          FileVisitResult.CONTINUE
      }
  }
  
  // 某些邏輯可能在此處
  
  projectDirectory.visitFileTree(cleanVisitor)
  ```

* 使用 `builderAction` 建立一個 `FileVisitor` 並立即使用它：

  ```kotlin
  projectDirectory.visitFileTree {
  // builderAction 的定義：
      onPreVisitDirectory { directory, attributes ->
          // 遍歷目錄時的某些邏輯
          FileVisitResult.CONTINUE
      }
  
      onVisitFile { file, attributes ->
          // 遍歷檔案時的某些邏輯
          FileVisitResult.CONTINUE
      }
  }
  ```

* 使用 `walk()` 函數遍歷以指定路徑為根的檔案樹：

  ```kotlin
  @OptIn(kotlin.io.path.ExperimentalPathApi::class)
  fun traverseFileTree() {
      val cleanVisitor = fileVisitor {
          onPreVisitDirectory { directory, _ ->
              if (directory.name == "build") {
                  directory.toFile().deleteRecursively()
                  FileVisitResult.SKIP_SUBTREE
              } else {
                  FileVisitResult.CONTINUE
              }
          }
  
          onVisitFile { file, _ ->
              if (file.extension == "class") {
                  file.deleteExisting()
              }
              FileVisitResult.CONTINUE
          }
      }
  
      val rootDirectory = createTempDirectory("Project")
  
      rootDirectory.resolve("src").let { srcDirectory ->
          srcDirectory.createDirectory()
          srcDirectory.resolve("A.kt").createFile()
          srcDirectory.resolve("A.class").createFile()
      }
  
      rootDirectory.resolve("build").let { buildDirectory ->
          buildDirectory.createDirectory()
          buildDirectory.resolve("Project.jar").createFile()
      }
  
   
  // 使用 walk 函數：
      val directoryStructure = rootDirectory.walk(PathWalkOption.INCLUDE_DIRECTORIES)
          .map { it.relativeTo(rootDirectory).toString() }
          .toList().sorted()
      assertPrints(directoryStructure, "[, build, build/Project.jar, src, src/A.class, src/A.kt]")
  
      rootDirectory.visitFileTree(cleanVisitor)
  
      val directoryStructureAfterClean = rootDirectory.walk(PathWalkOption.INCLUDE_DIRECTORIES)
          .map { it.relativeTo(rootDirectory).toString() }
          .toList().sorted()
      assertPrints(directoryStructureAfterClean, "[, src, src/A.kt]")
  //sampleEnd
  }
  ```

與實驗性 API 的常見做法一樣，新的擴充功能需要選擇啟用：`@OptIn(kotlin.io.path.ExperimentalPathApi::class)` 或 `@kotlin.io.path.ExperimentalPathApi`。或者，您可以使用編譯器選項：`-opt-in=kotlin.io.path.ExperimentalPathApi`。

我們非常感謝您在 YouTrack 上提供關於 [`walk()` 函數](https://youtrack.jetbrains.com/issue/KT-52909) 和 [訪問擴充函數](https://youtrack.jetbrains.com/issue/KT-52910) 的意見回饋。

## 文件更新

自上一個版本以來，Kotlin 文件進行了一些顯著的變更：

### 改版與改進的頁面

* [基本型別概覽](basic-types.md) – 了解 Kotlin 中使用的基本型別：數字、布林值、字元、字串、陣列和無符號整數。
* [Kotlin 開發 IDE](kotlin-ide.md) – 查看官方支援 Kotlin 的 IDE 列表以及擁有社群支援外掛程式的工具。

### Kotlin 多平台期刊中的新文章

* [原生與跨平台應用程式開發：如何選擇？](https://www.jetbrains.com/help/kotlin-multiplatform-dev/native-and-cross-platform.html) – 查看我們關於跨平台應用程式開發和原生方法的概覽及優勢。
* [六個最佳跨平台應用程式開發框架](https://www.jetbrains.com/help/kotlin-multiplatform-dev/cross-platform-frameworks.html) – 閱讀關鍵考量，以協助您為跨平台專案選擇合適的框架。

### 新與更新的教學

* [Kotlin 多平台入門](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-create-first-app.html) – 了解使用 Kotlin 進行跨平台行動開發，並建立一個可在 Android 和 iOS 上運行的應用程式。
* [使用 React 和 Kotlin/JS 建立網頁應用程式](js-react.md) – 建立一個瀏覽器應用程式，探索 Kotlin 的 DSL 和典型 React 程式的功能。

### 發佈文件中變更

我們不再為每個版本提供推薦的 kotlinx 函式庫列表。此列表僅包含與 Kotlin 本身推薦和測試過的版本。它沒有考慮到某些函式庫相互依賴並需要特殊的 kotlinx 版本，這可能與推薦的 Kotlin 版本不同。

我們正在努力尋找一種方法，以提供函式庫如何相互關聯和依賴的資訊，這樣在您的專案中升級 Kotlin 版本時，就能清楚應使用哪個 kotlinx 函式庫版本。

## 安裝 Kotlin 1.7.20

[IntelliJ IDEA](https://www.jetbrains.com/idea/download/) 2021.3、2022.1 和 2022.2 會自動建議將 Kotlin 外掛程式更新到 1.7.20。

> 對於 Android Studio Dolphin (213)、Electric Eel (221) 和 Flamingo (222)，Kotlin 外掛程式 1.7.20 將隨即將推出的 Android Studio 更新一起提供。
>
{style="note"}

新的命令列編譯器可從 [GitHub 發佈頁面](https://github.com/JetBrains/kotlin/releases/tag/v1.7.20) 下載。

### Kotlin 1.7.20 相容性指南

儘管 Kotlin 1.7.20 是一個增量發佈版本，但我們仍不得不進行一些不相容的變更，以限制 Kotlin 1.7.0 中引入的問題蔓延。

在 [Kotlin 1.7.20 相容性指南](compatibility-guide-1720.md) 中找到此類變更的詳細列表。