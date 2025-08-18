[//]: # (title: Kotlin 1.7.20 有什麼新功能)

<tldr>
   <p>對 Kotlin 1.7.20 的 IDE 支援適用於 IntelliJ IDEA 2021.3、2022.1 和 2022.2。</p>
</tldr>

_[發佈日期：2022 年 9 月 29 日](releases.md#release-details)_

Kotlin 1.7.20 版本已發佈！以下是此版本的一些重點功能：

* [新的 Kotlin K2 編譯器支援 `all-open`、帶接收者的 SAM、Lombok 和其他編譯器外掛程式](#support-for-kotlin-k2-compiler-plugins)
* [我們引入了預覽版的 `..<` 運算子，用於建立開放式範圍](#preview-of-the-operator-for-creating-open-ended-ranges)
* [新的 Kotlin/Native 記憶體管理器現已預設啟用](#the-new-kotlin-native-memory-manager-enabled-by-default)
* [我們為 JVM 引入了一個新的實驗性功能：具有泛型基礎類型的內聯類別](#generic-inline-classes)

您也可以在此影片中找到這些變更的簡要概述：

<video src="https://www.youtube.com/v/OG9npowJgE8" title="What's new in Kotlin 1.7.20"/>

## 對 Kotlin K2 編譯器外掛程式的支援

Kotlin 團隊持續穩定 K2 編譯器。
K2 仍處於 **Alpha** 階段（如同在 [Kotlin 1.7.0 版本](whatsnew17.md#new-kotlin-k2-compiler-for-the-jvm-in-alpha) 中宣布的），
但它現在支援多個編譯器外掛程式。您可以追蹤 [此 YouTrack 問題](https://youtrack.jetbrains.com/issue/KT-52604)
以取得 Kotlin 團隊關於新編譯器的更新。

從此 1.7.20 版本開始，Kotlin K2 編譯器支援以下外掛程式：

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

在以下影片中了解更多關於新編譯器及其優點的資訊：
* [The Road to the New Kotlin Compiler](https://www.youtube.com/watch?v=iTdJJq_LyoY)
* [K2 Compiler: a Top-Down View](https://www.youtube.com/watch?v=db19VFLZqJM)

### 如何啟用 Kotlin K2 編譯器

要啟用並測試 Kotlin K2 編譯器，請使用以下編譯器選項：

```bash
-Xuse-k2
```

您可以在您的 `build.gradle(.kts)` 檔案中指定它：

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

查看您的 JVM 專案的效能提升，並與舊編譯器的結果進行比較。

### 留下您對新 K2 編譯器的回饋

我們非常感謝您以任何形式提供回饋：
* 直接向 Kotlin Slack 中的 K2 開發人員提供您的回饋：[取得邀請](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up?_gl=1*ju6cbn*_ga*MTA3MTk5NDkzMC4xNjQ2MDY3MDU4*_ga_9J976DJZ68*MTY1ODMzNzA3OS4xMDAuMS4xNjU4MzQwODEwLjYw) 並加入 [#k2-early-adopters](https://kotlinlang.slack.com/archives/C03PK0PE257) 頻道。
* 向 [我們的問題追蹤器](https://kotl.in/issue) 回報您在使用新 K2 編譯器時遇到的任何問題。
* [啟用「**傳送使用統計資料**」選項](https://www.jetbrains.com/help/idea/settings-usage-statistics.html) 以允許 JetBrains 收集關於 K2 使用的匿名資料。

## 語言

Kotlin 1.7.20 引入了新語言功能的預覽版本，並對建構器型別推斷施加了限制：

* [預覽版 `..<` 運算子，用於建立開放式範圍](#preview-of-the-operator-for-creating-open-ended-ranges)
* [新的資料物件宣告](#improved-string-representations-for-singletons-and-sealed-class-hierarchies-with-data-objects)
* [新的建構器型別推斷限制](#new-builder-type-inference-restrictions)

### 預覽版 `..<` 運算子，用於建立開放式範圍

> 新的運算子是 [實驗性](components-stability.md#stability-levels-explained) 功能，且在 IDE 中的支援有限。
>
{style="warning"}

此版本引入了新的 `..<` 運算子。Kotlin 具有 `..` 運算子來表達一個值範圍。新的 `..<` 運算子作用類似於 `until` 函式，幫助您定義開放式範圍。

<video src="https://www.youtube.com/watch?v=v0AHdAIBnbs" title="New operator for open-ended ranges"/>

我們的研究表明，這個新運算子更能有效地表達開放式範圍，並清楚表明上限不包含在內。

以下是 `when` 表達式中使用 `..<` 運算子的範例：

```kotlin
when (value) {
    in 0.0..<0.25 -> // 第一季
    in 0.25..<0.5 -> // 第二季
    in 0.5..<0.75 -> // 第三季
    in 0.75..1.0 ->  // 最後一季 <- 請注意此處為閉合範圍
}
```
{validate="false"}

#### 標準函式庫 API 變更

以下新類型和操作將被引入通用 Kotlin 標準函式庫中的 `kotlin.ranges` 軟體包中：

##### 新的 `OpenEndRange<T>` 介面

用於表示開放式範圍的新介面與現有的 `ClosedRange<T>` 介面非常相似：

```kotlin
interface OpenEndRange<T : Comparable<T>> {
    // 下限
    val start: T
    // 上限，不包含在範圍內
    val endExclusive: T
    operator fun contains(value: T): Boolean = value >= start && value < endExclusive
    fun isEmpty(): Boolean = start >= endExclusive
}
```
{validate="false"}

##### 在現有可疊代範圍中實作 OpenEndRange

當開發人員需要一個不包含上限的範圍時，他們目前使用 `until` 函式來有效地產生一個具有相同值的閉合可疊代範圍。為了使這些範圍在新接受 `OpenEndRange<T>` 的 API 中可用，我們希望在現有的可疊代範圍中實作該介面：`IntRange`、`LongRange`、`CharRange`、`UIntRange` 和 `ULongRange`。因此它們將同時實作 `ClosedRange<T>` 和 `OpenEndRange<T>` 介面。

```kotlin
class IntRange : IntProgression(...), ClosedRange<Int>, OpenEndRange<Int> {
    override val start: Int
    override val endInclusive: Int
    override val endExclusive: Int
}
```
{validate="false"}

##### 標準型別的 `rangeUntil` 運算子

`rangeUntil` 運算子將為目前由 `rangeTo` 運算子定義的相同型別和組合提供。我們將它們作為擴充函式提供，用於原型目的，但為了一致性，我們計劃在穩定開放式範圍 API 之前，稍後將它們設為成員。

#### 如何啟用 `..<` 運算子

要使用 `..<` 運算子或為您自己的型別實作該運算子約定，請啟用 `-language-version 1.8` 編譯器選項。

為支援標準型別的開放式範圍而引入的新 API 元素需要選擇性加入，這與實驗性標準函式庫 API 通常一樣：`@OptIn(ExperimentalStdlibApi::class)`。或者，您可以使用 `-opt-in=kotlin.ExperimentalStdlibApi` 編譯器選項。

[在此 KEEP 文件中閱讀更多關於新運算子的資訊](https://github.com/kotlin/KEEP/blob/open-ended-ranges/proposals/open-ended-ranges.md)。

### 使用資料物件改進單例與密封類別層次的字串表示

> 資料物件是 [實驗性](components-stability.md#stability-levels-explained) 功能，且目前在 IDE 中的支援有限。
>
{style="warning"}

此版本引入了一種新的 `object` 宣告型別供您使用：`data object`。[資料物件](https://youtrack.jetbrains.com/issue/KT-4107) 在概念上與常規 `object` 宣告行為相同，但預設提供簡潔的 `toString` 表示。

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

這使得 `data object` 宣告非常適合密封類別層次結構，您可以在其中將它們與 `data class` 宣告一起使用。在此程式碼片段中，將 `EndOfFile` 宣告為 `data object` 而非普通的 `object` 意味著它將獲得一個美觀的 `toString` 而無需手動覆寫，與伴隨的 `data class` 定義保持對稱：

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

要在您的程式碼中使用資料物件宣告，請啟用 `-language-version 1.9` 編譯器選項。在 Gradle 專案中，您可以透過在 `build.gradle(.kts)` 中新增以下內容來實現：

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

閱讀更多關於資料物件的資訊，並就其實作在 [相關 KEEP 文件](https://github.com/Kotlin/KEEP/pull/316) 中分享您的回饋。

### 新的建構器型別推斷限制

Kotlin 1.7.20 對 [建構器型別推斷的使用](using-builders-with-builder-inference.md) 施加了一些主要限制，這可能會影響您的程式碼。這些限制適用於包含建構器 lambda 函式的程式碼，在這種情況下，若不分析 lambda 本身，則無法推導出參數。該參數被用作引數。現在，編譯器將始終為此類程式碼顯示錯誤，並要求您明確指定型別。

這是一個破壞性變更，但我們的研究表明，這些情況非常罕見，這些限制不應影響您的程式碼。如果它們確實影響了您，請考慮以下情況：

* 帶有隱藏成員的擴充功能的建構器推斷。

  如果您的程式碼包含一個與建構器推斷期間將使用的擴充函式同名的擴充函式，編譯器將顯示錯誤：

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
  
  要修正此程式碼，您應該明確指定型別：

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

* 多個 lambda 的建構器推斷，且型別引數未明確指定。

  如果建構器推斷中存在兩個或更多 lambda 區塊，它們會影響型別。為避免錯誤，編譯器要求您指定型別：

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

  要修正此錯誤，您應該明確指定型別並修正型別不符問題：

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

如果您沒有找到上述提到的情況，請向我們的團隊 [提交問題](https://kotl.in/issue)。

有關此建構器推斷更新的更多資訊，請參閱 [此 YouTrack 問題](https://youtrack.jetbrains.com/issue/KT-53797)。

## Kotlin/JVM

Kotlin 1.7.20 引入了泛型內聯類別，為委託屬性增加了更多位元組碼優化，並在 kapt 存根生成任務中支援 IR，使得使用 kapt 能夠支援所有最新的 Kotlin 功能：

* [泛型內聯類別](#generic-inline-classes)
* [更多委託屬性的優化案例](#more-optimized-cases-of-delegated-properties)
* [Kapt 存根生成任務中對 JVM IR 後端支援](#support-for-the-jvm-ir-backend-in-kapt-stub-generating-task)

### 泛型內聯類別

> 泛型內聯類別是一個 [實驗性](components-stability.md#stability-levels-explained) 功能。
> 它可能隨時被移除或變更。需要選擇性加入 (詳情見下)，且您應僅將其用於評估目的。
> 我們歡迎您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-52994) 上提供回饋。
>
{style="warning"}

Kotlin 1.7.20 允許 JVM 內聯類別的基礎型別為型別參數。編譯器將其映射到 `Any?` 或通常是型別參數的上限。

<video src="https://www.youtube.com/v/0JRPA0tt9og" title="Generic inline classes in Kotlin 1.7.20"/>

考慮以下範例：

```kotlin
@JvmInline
value class UserId<T>(val value: T)

fun compute(s: UserId<String>) {} // 編譯器產生 fun compute-<hashcode>(s: Any?)
```

該函式接受內聯類別作為參數。該參數被映射到上限，而非型別引數。

要啟用此功能，請使用 `-language-version 1.8` 編譯器選項。

我們歡迎您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-52994) 上提供關於此功能的回饋。

### 更多委託屬性的優化案例

在 Kotlin 1.6.0 中，我們透過省略 `$delegate` 欄位並 [生成對引用屬性的直接存取](whatsnew16.md#optimize-delegated-properties-which-call-get-set-on-the-given-kproperty-instance) 來優化委託給屬性的情況。在 1.7.20 中，我們為更多情況實作了此優化。
如果委託是以下情況，現在將省略 `$delegate` 欄位：

* 具名物件：

  ```kotlin
  object NamedObject {
      operator fun getValue(thisRef: Any?, property: KProperty<*>): String = ...
  }
  
  val s: String by NamedObject
  ```
  {validate="false"}

* 在相同模組中帶有 [支援欄位](properties.md#backing-fields) 和預設 getter 的 final `val` 屬性：

  ```kotlin
  val impl: ReadOnlyProperty<Any?, String> = ...
  
  class A {
      val s: String by impl
  }
  ```
  {validate="false"}

* 常數表達式、列舉條目、`this` 或 `null`。以下是 `this` 的一個範例：

  ```kotlin
  class A {
      operator fun getValue(thisRef: Any?, property: KProperty<*>) ...
   
      val s by this
  }
  ```
  {validate="false"}

了解更多關於 [委託屬性](delegated-properties.md) 的資訊。

我們歡迎您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-23397) 上提供關於此功能的回饋。

### Kapt 存根生成任務中對 JVM IR 後端支援

> Kapt 存根生成任務中對 JVM IR 後端支援是一個 [實驗性](components-stability.md) 功能。
> 它可能隨時被變更。需要選擇性加入 (詳情見下)，且您應僅將其用於評估目的。
>
{style="warning"}

在 1.7.20 之前，kapt 存根生成任務使用舊後端，且 [可重複註解](annotations.md#repeatable-annotations) 不適用於 [kapt](kapt.md)。從 Kotlin 1.7.20 開始，我們在 kapt 存根生成任務中增加了對 [JVM IR 後端](whatsnew15.md#stable-jvm-ir-backend) 的支援。這使得使用 kapt 能夠支援所有最新的 Kotlin 功能，包括可重複註解。

要在 kapt 中使用 IR 後端，請將以下選項新增到您的 `gradle.properties` 檔案中：

```none
kapt.use.jvm.ir=true
```

我們歡迎您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-49682) 上提供關於此功能的回饋。

## Kotlin/Native

Kotlin 1.7.20 隨附預設啟用的新 Kotlin/Native 記憶體管理器，並提供了自訂 `Info.plist` 檔案的選項：

* [預設啟用的新 Kotlin/Native 記憶體管理器](#the-new-kotlin-native-memory-manager-enabled-by-default)
* [自訂 Info.plist 檔案](#customizing-the-info-plist-file)

### 預設啟用的新 Kotlin/Native 記憶體管理器

此版本為新的記憶體管理器帶來了進一步的穩定性和效能改進，使我們能夠將新的記憶體管理器提升到 [Beta](components-stability.md) 階段。

舊版記憶體管理器使編寫並行和非同步程式碼變得複雜，包括在實作 `kotlinx.coroutines` 函式庫時遇到的問題。這阻礙了 Kotlin Multiplatform Mobile 的採用，因為並行限制導致在 iOS 和 Android 平台之間共享 Kotlin 程式碼出現問題。新的記憶體管理器最終為 [將 Kotlin Multiplatform Mobile 提升到 Beta 階段](https://blog.jetbrains.com/kotlin/2022/05/kotlin-multiplatform-mobile-beta-roadmap-update/) 鋪平了道路。

新的記憶體管理器也支援編譯器快取，這使得編譯時間與之前的版本相當。有關新記憶體管理器優點的更多資訊，請參閱我們關於預覽版本的原始 [部落格文章](https://blog.jetbrains.com/kotlin/2021/08/try-the-new-kotlin-native-memory-manager-development-preview/)。您可以在 [文件](native-memory-manager.md) 中找到更多技術細節。

#### 組態與設定

從 Kotlin 1.7.20 開始，新的記憶體管理器是預設選項。無需太多額外設定。

如果您已經手動啟用它，您可以從 `gradle.properties` 或 `build.gradle(.kts)` 檔案中移除 `kotlin.native.binary.memoryModel=experimental` 或 `binaryOptions["memoryModel"] = "experimental"` 選項。

如有必要，您可以使用 `gradle.properties` 中的 `kotlin.native.binary.memoryModel=strict` 選項切換回舊版記憶體管理器。然而，舊版記憶體管理器不再支援編譯器快取，因此編譯時間可能會變長。

#### 凍結

在新記憶體管理器中，凍結已棄用。請勿使用它，除非您的程式碼需要與舊版管理器配合使用（在舊版管理器中仍然需要凍結）。這對於需要維護對舊版記憶體管理器支援的函式庫作者，或希望在新記憶體管理器遇到問題時有備用方案的開發人員來說可能很有幫助。

在這種情況下，您可以暫時支援新舊兩種記憶體管理器模式下的程式碼。要忽略棄用警告，請執行以下操作之一：

* 使用 `@OptIn(FreezingIsDeprecated::class)` 註解已棄用的 API 使用。
* 將 `languageSettings.optIn("kotlin.native.FreezingIsDeprecated")` 應用於 Gradle 中所有 Kotlin 原始碼集。
* 傳遞編譯器標誌 `-opt-in=kotlin.native.FreezingIsDeprecated`。

#### 從 Swift/Objective-C 呼叫 Kotlin suspend 函式

新的記憶體管理器仍然限制從 Swift 和 Objective-C 呼叫 Kotlin `suspend` 函式（僅限於主執行緒），但您可以使用新的 Gradle 選項來解除此限制。

此限制最初是在舊版記憶體管理器中引入的，因為某些情況下程式碼將一個延續分派到原始執行緒上恢復執行。如果此執行緒沒有支援的事件迴圈，任務將永遠不會執行，協程也永遠不會恢復。

在某些情況下，此限制不再是必需的，但所有必要條件的檢查無法輕易實作。因此，我們決定在新記憶體管理器中保留此功能，同時引入一個供您禁用的選項。為此，請將以下選項新增到您的 `gradle.properties` 中：

```none
kotlin.native.binary.objcExportSuspendFunctionLaunchThreadRestriction=none
```

> 如果您使用 `kotlinx.coroutines` 的 `native-mt` 版本或其他採用相同「分派到原始執行緒」方法的函式庫，請勿新增此選項。
>
{style="warning"}

Kotlin 團隊非常感謝 [Ahmed El-Helw](https://github.com/ahmedre) 實作此選項。

#### 留下您的回饋

這是我們生態系統的一個重大變更。我們歡迎您的回饋，以幫助我們做得更好。

請在您的專案中嘗試新的記憶體管理器，並在 [我們的問題追蹤器 YouTrack](https://youtrack.jetbrains.com/issue/KT-48525) 中分享回饋。

### 自訂 Info.plist 檔案

產生框架時，Kotlin/Native 編譯器會生成資訊屬性清單檔案 `Info.plist`。以前，自訂其內容很麻煩。從 Kotlin 1.7.20 開始，您可以直接設定以下屬性：

| 屬性                     | 二進位選項              |
|--------------------------|----------------------------|
| `CFBundleIdentifier`     | `bundleId`                 |
| `CFBundleShortVersionString` | `bundleShortVersionString` |
| `CFBundleVersion`        | `bundleVersion`            |

為此，請使用相應的二進位選項。傳遞 `-Xbinary=$option=$value` 編譯器標誌或為所需的框架設定 `binaryOption(option, value)` Gradle DSL。

Kotlin 團隊非常感謝 Mads Ager 實作此功能。

## Kotlin/JS

Kotlin/JS 收到了一些增強功能，提高了開發人員體驗並提升了效能：

* 由於依賴項載入效率的提高，Klib 生成在增量和全新建置中都更快。
* [開發二進位檔的增量編譯](js-ir-compiler.md#incremental-compilation-for-development-binaries) 已重新設計，從而顯著改善了全新建置場景、加快了增量建置並修正了穩定性問題。
* 我們改進了針對巢狀物件、密封類別以及建構函式中具有預設值的參數的 `.d.ts` 生成。

## Gradle

Kotlin Gradle 外掛程式的更新側重於與新的 Gradle 功能和最新 Gradle 版本的相容性。

Kotlin 1.7.20 包含支援 Gradle 7.1 的變更。已棄用的方法和屬性已被移除或替換，減少了 Kotlin Gradle 外掛程式產生的棄用警告數量，並解除了未來對 Gradle 8.0 的支援障礙。

然而，存在一些潛在的破壞性變更，可能需要您的關注：

### 目標組態

* `org.jetbrains.kotlin.gradle.dsl.SingleTargetExtension` 現在具有一個泛型參數 `SingleTargetExtension<T : KotlinTarget>`。
* `kotlin.targets.fromPreset()` 慣例已被棄用。您仍然可以使用 `kotlin.targets { fromPreset() }`，但我們建議 [明確設定目標](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-discover-project.html#targets)。
* Gradle 自動生成的目標存取器不再在 `kotlin.targets { }` 區塊內部可用。請改用 `findByName("targetName")` 方法。

  請注意，此類存取器在 `kotlin.targets` 的情況下仍然可用，例如 `kotlin.targets.linuxX64`。

### 原始碼目錄組態

Kotlin Gradle 外掛程式現在將 Kotlin `SourceDirectorySet` 作為 `kotlin` 擴充功能新增到 Java 的 `SourceSet` 群組。
這使得在 `build.gradle.kts` 檔案中配置原始碼目錄成為可能，其方式與在 [Java、Groovy 和 Scala](https://docs.gradle.org/7.1/release-notes.html#easier-source-set-configuration-in-kotlin-dsl) 中配置的方式類似：

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

請記住，您還可以使用 `kotlin` 擴充功能來存取 `KotlinSourceSet`：

```kotlin
kotlin {
    sourceSets {
        main {
        // ...
        }
    }
}
```

### JVM 工具鏈組態的新方法

此版本提供了一個新的 `jvmToolchain()` 方法，用於啟用 [JVM 工具鏈功能](gradle-configure-project.md#gradle-java-toolchains-support)。如果您不需要任何額外的 [組態欄位](https://docs.gradle.org/current/javadoc/org/gradle/jvm/toolchain/JavaToolchainSpec.html)，例如 `implementation` 或 `vendor`，您可以從 Kotlin 擴充功能中使用此方法：

```kotlin
kotlin {
    jvmToolchain(17)
}
```

這簡化了 Kotlin 專案的設定過程，無需任何額外組態。
在此版本之前，您只能透過以下方式指定 JDK 版本：

```kotlin
kotlin {
    jvmToolchain {
        languageVersion.set(JavaLanguageVersion.of(17))
    }
}
```

## 標準函式庫

Kotlin 1.7.20 為 `java.nio.file.Path` 類別提供了新的 [擴充函式](extensions.md#extension-functions)，這允許您遍歷檔案樹：

* `walk()` 惰性遍歷以指定路徑為根的檔案樹。
* `fileVisitor()` 使得可以單獨建立 `FileVisitor`。`FileVisitor` 定義了遍歷目錄和檔案時的操作。
* `visitFileTree(fileVisitor: FileVisitor, ...)` 消耗一個現成的 `FileVisitor` 並在底層使用 `java.nio.file.Files.walkFileTree()`。
* `visitFileTree(..., builderAction: FileVisitorBuilder.() -> Unit)` 使用 `builderAction` 建立一個 `FileVisitor` 並呼叫 `visitFileTree(fileVisitor, ...)` 函式。
* `FileVisitResult`，`FileVisitor` 的回傳型別，預設值為 `CONTINUE`，這會繼續處理檔案。

> 針對 `java.nio.file.Path` 的新擴充函式是 [實驗性](components-stability.md) 的。
> 它們可能隨時被變更。需要選擇性加入 (詳情見下)，且您應僅將其用於評估目的。
>
{style="warning"}

以下是您可以使用這些新擴充函式進行的一些操作：

* 明確建立一個 `FileVisitor` 然後使用：

  ```kotlin
  val cleanVisitor = fileVisitor {
      onPreVisitDirectory { directory, attributes ->
          // 處理目錄的一些邏輯
          FileVisitResult.CONTINUE
      }
  
      onVisitFile { file, attributes ->
          // 處理檔案的一些邏輯
          FileVisitResult.CONTINUE
      }
  }
  
  // 其他邏輯可能在此處
  
  projectDirectory.visitFileTree(cleanVisitor)
  ```

* 使用 `builderAction` 建立一個 `FileVisitor` 並立即使用它：

  ```kotlin
  projectDirectory.visitFileTree {
  // builderAction 的定義：
      onPreVisitDirectory { directory, attributes ->
          // 處理目錄的一些邏輯
          FileVisitResult.CONTINUE
      }
  
      onVisitFile { file, attributes ->
          // 處理檔案的一些邏輯
          FileVisitResult.CONTINUE
      }
  }
  ```

* 使用 `walk()` 函式遍歷以指定路徑為根的檔案樹：

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
  
   
  // 使用 walk 函式：
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

如同實驗性 API 的慣例，新的擴充功能需要選擇性加入：`@OptIn(kotlin.io.path.ExperimentalPathApi::class)` 或 `@kotlin.io.path.ExperimentalPathApi`。或者，您可以使用編譯器選項：`-opt-in=kotlin.io.path.ExperimentalPathApi`。

我們歡迎您在 YouTrack 上提供關於 [`walk()` 函式](https://youtrack.jetbrains.com/issue/KT-52909) 和 [visit 擴充函式](https://youtrack.jetbrains.com/issue/KT-52910) 的回饋。

## 文件更新

自上次發佈以來，Kotlin 文件收到了一些顯著變更：

### 重新設計和改進的頁面

* [基本類型概述](basic-types.md) – 了解 Kotlin 中使用的基本類型：數字、布林值、字元、字串、陣列和無符號整數。
* [Kotlin 開發的 IDE](kotlin-ide.md) – 查看支援 Kotlin 的官方 IDE 列表以及具有社群支援外掛程式的工具。

### Kotlin 多平台期刊中的新文章

* [原生和跨平台應用程式開發：如何選擇？](https://www.jetbrains.com/help/kotlin-multiplatform-dev/native-and-cross-platform.html) – 查看我們對跨平台應用程式開發和原生方法的概述及優勢。
* [六個最佳跨平台應用程式開發框架](https://www.jetbrains.com/help/kotlin-multiplatform-dev/cross-platform-frameworks.html) – 閱讀關於幫助您為跨平台專案選擇正確框架的關鍵方面。

### 新增和更新的教學

* [Kotlin 多平台入門](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-create-first-app.html) – 了解使用 Kotlin 進行跨平台行動開發，並建立一個同時適用於 Android 和 iOS 的應用程式。
* [使用 React 和 Kotlin/JS 建置網頁應用程式](js-react.md) – 建立一個瀏覽器應用程式，探索 Kotlin 的 DSL 和典型 React 程式的特點。

### 發佈文件中的變更

我們不再為每個發佈版本提供推薦的 kotlinx 函式庫列表。此列表僅包含與 Kotlin 本身推薦和測試過的版本。它沒有考慮到某些函式庫彼此依賴，並需要一個特殊的 kotlinx 版本，這可能與推薦的 Kotlin 版本不同。

我們正在努力尋找一種方法，以提供函式庫如何相互關聯和依賴的資訊，以便在您升級專案中的 Kotlin 版本時，可以清楚地知道應該使用哪個 kotlinx 函式庫版本。

## 安裝 Kotlin 1.7.20

[IntelliJ IDEA](https://www.jetbrains.com/idea/download/) 2021.3、2022.1 和 2022.2 會自動建議將 Kotlin 外掛程式更新到 1.7.20。

> 對於 Android Studio Dolphin (213)、Electric Eel (221) 和 Flamingo (222)，Kotlin 外掛程式 1.7.20 將隨即將推出的 Android Studio 更新一起提供。
>
{style="note"}

新的命令列編譯器可在 [GitHub 發佈頁面](https://github.com/JetBrains/kotlin/releases/tag/v1.7.20) 下載。

### Kotlin 1.7.20 相容性指南

儘管 Kotlin 1.7.20 是一個增量發佈，但仍然有一些我們不得不做的不相容變更，以限制 Kotlin 1.7.0 中引入問題的擴散。

在 [Kotlin 1.7.20 相容性指南](compatibility-guide-1720.md) 中找到此類變更的詳細列表。