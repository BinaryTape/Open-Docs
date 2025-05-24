---
title: "Kotlin 1.7.20 的新功能"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

:::info
<p>
   Kotlin 1.7.20 的 IDE 支援適用於 IntelliJ IDEA 2021.3、2022.1 和 2022.2。
</p>

:::

_[已發佈：2022 年 9 月 29 日](releases#release-details)_

Kotlin 1.7.20 版本已發布！以下是此版本的一些重點：

* [新的 Kotlin K2 編譯器支援 `all-open`、具接收者的 SAM (SAM with receiver)、Lombok 和其他編譯器外掛程式](#support-for-kotlin-k2-compiler-plugins)
* [我們引入了用於建立開區間 (open-ended ranges) 的 `..<` 運算子的預覽](#preview-of-the-operator-for-creating-open-ended-ranges)
* [新的 Kotlin/Native 記憶體管理器現在預設啟用](#the-new-kotlin-native-memory-manager-enabled-by-default)
* [我們為 JVM 引入了一項新的實驗性功能：具有泛型底層型別的內聯類別 (inline classes)](#generic-inline-classes)

您也可以在此影片中找到變更的簡短概述：

<video src="https://www.youtube.com/v/OG9npowJgE8" title="What's new in Kotlin 1.7.20"/>

## 支援 Kotlin K2 編譯器外掛程式

Kotlin 團隊持續穩定 K2 編譯器。
K2 仍處於 **Alpha** 階段（如 [Kotlin 1.7.0 版本](whatsnew17#new-kotlin-k2-compiler-for-the-jvm-in-alpha)中所宣告），
但現在支援多個編譯器外掛程式。您可以追蹤 [此 YouTrack issue](https://youtrack.jetbrains.com/issue/KT-52604)
以取得 Kotlin 團隊關於新編譯器的更新。

自 1.7.20 版本開始，Kotlin K2 編譯器支援下列外掛程式：

* [`all-open`](all-open-plugin)
* [`no-arg`](no-arg-plugin)
* [具接收者的 SAM (SAM with receiver)](sam-with-receiver-plugin)
* [Lombok](lombok)
* AtomicFU
* `jvm-abi-gen`

:::note
新 K2 編譯器的 Alpha 版本僅適用於 JVM 專案。
它不支援 Kotlin/JS、Kotlin/Native 或其他多平台專案。

在以下影片中瞭解關於新編譯器及其優勢的更多資訊：
* [The Road to the New Kotlin Compiler](https://www.youtube.com/watch?v=iTdJJq_LyoY)
* [K2 Compiler: a Top-Down View](https://www.youtube.com/watch?v=db19VFLZqJM)

### 如何啟用 Kotlin K2 編譯器

若要啟用 Kotlin K2 編譯器並進行測試，請使用以下編譯器選項：

```bash
-Xuse-k2
```

您可以在 `build.gradle(.kts)` 檔案中指定它：

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
tasks.withType<KotlinCompile> {
    kotlinOptions.useK2 = true
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
compileKotlin {
    kotlinOptions.useK2 = true
}
```
</TabItem>
</Tabs>

檢查 JVM 專案的效能提升，並將其與舊編譯器的結果進行比較。

### 提供關於新 K2 編譯器的意見反應

我們非常感謝您以任何形式提供的意見反應：
* 在 Kotlin Slack 中直接向 K2 開發人員提供您的意見反應：[取得邀請](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up?_gl=1*ju6cbn*_ga*MTA3MTk5NDkzMC4xNjQ2MDY3MDU4*_ga_9J976DJZ68*MTY1ODMzNzA3OS4xMDAuMS4xNjU4MzQwODEwLjYw) 並加入 [#k2-early-adopters](https://kotlinlang.slack.com/archives/C03PK0PE257) 頻道。
* 向 [我們的 issue tracker](https://kotl.in/issue) 報告您在使用新 K2 編譯器時遇到的任何問題。
* [啟用 **傳送使用情況統計資料 (Send usage statistics)** 選項](https://www.jetbrains.com/help/idea/settings-usage-statistics.html) 以允許 JetBrains 收集關於 K2 使用情況的匿名資料。

## 語言

Kotlin 1.7.20 引入了新語言功能的預覽版本，並對建構器類型推論施加了限制：

* [用於建立開區間 (open-ended ranges) 的 ..< 運算子的預覽](#preview-of-the-operator-for-creating-open-ended-ranges)
* [新的 data object 宣告](#improved-string-representations-for-singletons-and-sealed-class-hierarchies-with-data-objects)
* [建構器類型推論限制](#new-builder-type-inference-restrictions)

### 用於建立開區間 (open-ended ranges) 的 ..< 運算子的預覽

新運算子是 [Experimental](components-stability#stability-levels-explained)，並且在 IDE 中具有有限的支援。

此版本引入了新的 `..<` 運算子。Kotlin 具有 `..` 運算子來表示值的範圍。新的 `..<`
運算子的作用類似於 `until` 函數，並協助您定義開區間。

<video src="https://www.youtube.com/watch?v=v0AHdAIBnbs" title="New operator for open-ended ranges"/>

我們的研究表明，這個新運算子在表示開區間方面做得更好，並且清楚地表明不包含上限。

以下是在 `when` 運算式中使用 `..<` 運算子的範例：

```kotlin
when (value) {
    in 0.0..&lt;0.25 `->` // First quarter
    in 0.25..&lt;0.5 `->` // Second quarter
    in 0.5..&lt;0.75 `->` // Third quarter
    in 0.75..1.0 `->`  // Last quarter  `<-` Note closed range here
}
```

#### 標準函式庫 API 變更

以下新類型和操作將在通用 Kotlin 標準
函式庫的 `kotlin.ranges` 套件中引入：

##### 新的 OpenEndRange&lt;T&gt; 介面

新的介面用於表示開區間，與現有的 `ClosedRange<T>` 介面非常相似：

```kotlin
interface OpenEndRange<T : Comparable<T>> {
    // Lower bound
    val start: T
    // Upper bound, not included in the range
    val endExclusive: T
    operator fun contains(value: T): Boolean = value >= start && value < endExclusive
    fun isEmpty(): Boolean = start >= endExclusive
}
```

##### 在現有可迭代範圍中實作 OpenEndRange

當開發人員需要取得具有排除上限的範圍時，他們目前使用 `until` 函數來有效地
產生具有相同值的閉合可迭代範圍。為了使這些範圍在新 API 中可接受，該 API 採用 `OpenEndRange<T>`，
我們希望在現有的可迭代範圍中實作該介面：`IntRange`、`LongRange`、`CharRange`、`UIntRange`
和 `ULongRange`。因此，它們將同時實作 `ClosedRange<T>` 和 `OpenEndRange<T>` 介面。

```kotlin
class IntRange : IntProgression(...), ClosedRange<Int>, OpenEndRange<Int> {
    override val start: Int
    override val endInclusive: Int
    override val endExclusive: Int
}
```

##### 標準類型的 rangeUntil 運算子

將為目前由 `rangeTo` 運算子定義的相同類型和組合提供 `rangeUntil` 運算子。
我們將它們作為原型目的的擴充函數提供，但為了保持一致性，我們計劃在穩定開區間 API 之前使它們成為成員。

#### 如何啟用 ..&lt; 運算子

若要使用 `..<` 運算子或為您自己的類型實作該運算子慣例，請啟用 `-language-version 1.8`
編譯器選項。

為支援標準類型的開區間而引入的新 API 元素需要選擇加入，就像實驗性 stdlib API 一樣：`@OptIn(ExperimentalStdlibApi::class)`。或者，您可以使用
`-opt-in=kotlin.ExperimentalStdlibApi` 編譯器選項。

[在此 KEEP 文件中閱讀有關新運算子的更多資訊](https://github.com/kotlin/KEEP/blob/open-ended-ranges/proposals/open-ended-ranges)。

### 改進了具有資料物件的單例和密封類別階層的字串表示

Data object 是 [Experimental](components-stability#stability-levels-explained)，並且目前在 IDE 中具有有限的支援。

此版本引入了一種新的 `object` 宣告類型供您使用：`data object`。[Data object](https://youtrack.jetbrains.com/issue/KT-4107)
在概念上與常規 `object` 宣告的行為相同，但具有開箱即用的乾淨 `toString` 表示。

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

這使得 `data object` 宣告非常適合密封類別階層，您可以在其中將它們與 `data class`
宣告一起使用。在此程式碼片段中，將 `EndOfFile` 宣告為 `data object` 而不是普通的 `object` 意味著它將
獲得漂亮的 `toString`，而無需手動覆寫它，從而與隨附的 `data class`
定義保持對稱性：

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

#### 如何啟用 data object

若要在您的程式碼中使用 data object 宣告，請啟用 `-language-version 1.9` 編譯器選項。在 Gradle 專案中，
您可以透過將以下內容新增至您的 `build.gradle(.kts)` 來執行此操作：

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
tasks.withType<org.jetbrains.kotlin.gradle.tasks.KotlinCompile>().configureEach {
    // ...
    kotlinOptions.languageVersion = "1.9"
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
compileKotlin {
    // ...
    kotlinOptions.languageVersion = '1.9'
}
```
</TabItem>
</Tabs>

閱讀有關 data object 的更多資訊，並在 [相應的 KEEP 文件](https://github.com/Kotlin/KEEP/pull/316)中分享您對其實作的意見反應。

### 新的建構器類型推論限制

Kotlin 1.7.20 對 [建構器類型推論的使用](using-builders-with-builder-inference)施加了一些主要限制，
可能會影響您的程式碼。這些限制適用於包含建構器 lambda 函數的程式碼，在這些函數中，不可能
在不分析 lambda 本身的情況下推導出參數。該參數用作引數。現在，編譯器將
始終顯示此類程式碼的錯誤，並要求您明確指定類型。

這是一個重大變更，但我們的研究表明這些情況非常罕見，並且這些限制不應影響
您的程式碼。如果它們確實影響了，請考慮以下情況：

* 具有隱藏成員的擴充功能的建構器推論。

  如果您的程式碼包含具有相同名稱的擴充函數，該函數將在建構器推論期間使用，
  編譯器將顯示錯誤：

    ```kotlin
    class Data {
        fun doSmth() {} // 1
    }
    
    fun <T> T.doSmth() {} // 2
    
    fun test() {
        buildList {
            this.add(Data())
            this.get(0).doSmth() // Resolves to 2 and leads to error
        }
    }
    ```
     
  
  若要修正程式碼，您應明確指定類型：

    ```kotlin
    class Data {
        fun doSmth() {} // 1
    }
    
    fun <T> T.doSmth() {} // 2
    
    fun test() {
        buildList<Data> { // Type argument!
            this.add(Data())
            this.get(0).doSmth() // Resolves to 1
        }
    }
    ```

* 具有多個 lambda 的建構器推論，並且未明確指定類型引數。

  如果建構器推論中有兩個或更多 lambda 區塊，它們會影響類型。為了防止錯誤，編譯器
  要求您指定類型：

    ```kotlin
    fun <T: Any> buildList(
        first: MutableList<T>.() `->` Unit, 
        second: MutableList<T>.() `->` Unit
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
    

  若要修正錯誤，您應明確指定類型並修正類型不符：

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

如果您沒有找到上面提到的案例，請 [提交 issue](https://kotl.in/issue) 給我們的團隊。

請參閱此 [YouTrack issue](https://youtrack.jetbrains.com/issue/KT-53797) 以取得關於此建構器推論更新的更多資訊。

## Kotlin/JVM

Kotlin 1.7.20 引入了泛型內聯類別，為委託屬性新增了更多位元組碼最佳化，並支援
kapt 樁生成任務中的 IR，從而可以使用 kapt 的所有最新 Kotlin 功能：

* [泛型內聯類別](#generic-inline-classes)
* [委託屬性的更多最佳化案例](#more-optimized-cases-of-delegated-properties)
* [支援 kapt 樁生成任務中的 JVM IR 後端](#support-for-the-jvm-ir-backend-in-kapt-stub-generating-task)

### 泛型內聯類別

泛型內聯類別是一項 [Experimental](components-stability#stability-levels-explained) 功能。
它可能會隨時被刪除或變更。需要選擇加入（請參閱下面的詳細資訊），並且您應該僅將其用於評估目的。
我們將感謝您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-52994) 中提供關於它的意見反應。

Kotlin 1.7.20 允許 JVM 內聯類別的底層類型為類型參數。編譯器將其對應到 `Any?` 或，
通常，對應到類型參數的上限。

<video src="https://www.youtube.com/v/0JRPA0tt9og" title="Generic inline classes in Kotlin 1.7.20"/>

請考慮以下範例：

```kotlin
@JvmInline
value class UserId<T>(val value: T)

fun compute(s: UserId<String>) {} // Compiler generates fun compute-<hashcode>(s: Any?)
```

該函數接受內聯類別作為參數。該參數對應到上限，而不是類型引數。

若要啟用此功能，請使用 `-language-version 1.8` 編譯器選項。

我們將感謝您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-52994) 中提供關於此功能的意見反應。

### 委託屬性的更多最佳化案例

在 Kotlin 1.6.0 中，我們透過省略 `$delegate` 欄位並 [產生
對參考屬性的立即存取](whatsnew16#optimize-delegated-properties-which-call-get-set-on-the-given-kproperty-instance) 來最佳化委託給屬性的案例。在 1.7.20 中，我們為更多案例實作了此最佳化。
如果委託是：

* 具名物件：

  ```kotlin
  object NamedObject {
      operator fun getValue(thisRef: Any?, property: KProperty<*>): String = ...
  }
  
  val s: String by NamedObject
  ```
  

* 具有 [後備欄位](properties#backing-fields) 和相同模組中預設 getter 的最終 `val` 屬性：

  ```kotlin
  val impl: ReadOnlyProperty<Any?, String> = ...
  
  class A {
      val s: String by impl
  }
  ```
  

* 常數運算式、列舉條目、`this` 或 `null`。以下是 `this` 的範例：

  ```kotlin
  class A {
      operator fun getValue(thisRef: Any?, property: KProperty<*>) ...
   
      val s by this
  }
  ```
  

瞭解有關 [委託屬性](delegated-properties) 的更多資訊。

我們將感謝您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-23397) 中提供關於此功能的意見反應。

### 支援 kapt 樁生成任務中的 JVM IR 後端

支援 kapt 樁生成任務中的 JVM IR 後端是一項 [Experimental](components-stability) 功能。
它可能會隨時變更。需要選擇加入（請參閱下面的詳細資訊），並且您應該僅將其用於評估目的。

在 1.7.20 之前，kapt 樁生成任務使用舊的後端，並且 [可重複註解](annotations#repeatable-annotations)
不適用於 [kapt](kapt)。使用 Kotlin 1.7.20，我們在 kapt 樁生成任務中新增了對 [JVM IR 後端](whatsnew15#stable-jvm-ir-backend) 的支援。
這使得可以使用 kapt 的所有最新 Kotlin 功能，包括
可重複註解。

若要在 kapt 中使用 IR 後端，請將以下選項新增至您的 `gradle.properties` 檔案：

```none
kapt.use.jvm.ir=true
```

我們將感謝您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-49682) 中提供關於此功能的意見反應。

## Kotlin/Native

Kotlin 1.7.20 預設啟用新的 Kotlin/Native 記憶體管理器，並讓您可以自訂
`Info.plist` 檔案：

* [新的預設記憶體管理器](#the-new-kotlin-native-memory-manager-enabled-by-default)
* [自訂 Info.plist 檔案](#customizing-the-info-plist-file)

### 新的 Kotlin/Native 記憶體管理器預設啟用

此版本為新的記憶體管理器帶來了進一步的穩定性和效能改進，使我們能夠將
新記憶體管理器升級到 [Beta](components-stability)。

先前的記憶體管理器使編寫並行和非同步程式碼變得複雜，包括實作
`kotlinx.coroutines` 函式庫的問題。這阻礙了 Kotlin Multiplatform Mobile 的採用，因為並行限制
在 iOS 和 Android 平台之間共用 Kotlin 程式碼時產生了問題。新的記憶體管理器最終為
[將 Kotlin Multiplatform Mobile 升級到 Beta 版](https://blog.jetbrains.com/kotlin/2022/05/kotlin-multiplatform-mobile-beta-roadmap-update/) 鋪平了道路。

新的記憶體管理器還支援編譯器快取，使編譯時間與先前的版本相當。
有關新的記憶體管理器的優勢的更多資訊，請參閱我們原始的 [部落格文章](https://blog.jetbrains.com/kotlin/2021/08/try-the-new-kotlin-native-memory-manager-development-preview/)
以取得預覽版本。您可以在 [文件](native-memory-manager)中找到更多技術詳細資訊。

#### 組態和設定

從 Kotlin 1.7.20 開始，新的記憶體管理器是預設值。不需要太多額外的設定。

如果您已經手動開啟它，則可以從
您的 `gradle.properties` 檔案中移除 `kotlin.native.binary.memoryModel=experimental` 選項，或從 `build.gradle(.kts)` 檔案中移除 `binaryOptions["memoryModel"] = "experimental"`。

如有必要，您可以使用 `gradle.properties` 中的 `kotlin.native.binary.memoryModel=strict` 選項切換回舊版記憶體管理器。
但是，舊版記憶體管理器不再提供編譯器快取支援，
因此編譯時間可能會變差。

#### 凍結

在新的記憶體管理器中，已棄用凍結。除非您需要您的程式碼與舊版管理器一起使用，否則請勿使用它
（在舊版管理器中仍然需要凍結）。這對於需要維護對舊版管理器支援的函式庫作者
或想要在遇到新記憶體管理器問題時擁有後備的開發人員可能很有用。

在這種情況下，您可以暫時支援新舊記憶體管理器的程式碼。若要忽略已棄用警告，
請執行下列其中一項操作：

* 使用 `@OptIn(FreezingIsDeprecated::class)` 註解已棄用 API 的用法。
* 將 `languageSettings.optIn("kotlin.native.FreezingIsDeprecated")` 應用於 Gradle 中的所有 Kotlin 原始碼集。
* 傳遞編譯器標記 `-opt-in=kotlin.native.FreezingIsDeprecated`。

#### 從 Swift/Objective-C 呼叫 Kotlin 暫停函數

新的記憶體管理器仍然限制從 Swift 和 Objective-C 從主要線程以外的線程呼叫 Kotlin `suspend` 函數，
但是您可以使用新的 Gradle 選項來解除它。

此限制最初是在舊版記憶體管理器中引入的，原因是程式碼將繼續分配到要在原始線程上恢復的案例。
如果此線程沒有支援的事件迴圈，則該任務將永遠不會執行，
並且協同程式將永遠不會恢復。

在某些情況下，不再需要此限制，但是無法輕易地實作所有必要條件的檢查。
因此，我們決定將其保留在新的記憶體管理器中，同時引入一個選項供您停用它。
為此，請將以下選項新增至您的 `gradle.properties`：

```none
kotlin.native.binary.objcExportSuspendFunctionLaunchThreadRestriction=none
```

如果您使用 `kotlinx.coroutines` 的 `native-mt` 版本或其他具有相同
「分配到原始線程」方法的函式庫，請勿新增此選項。

Kotlin 團隊非常感謝 [Ahmed El-Helw](https://github.com/ahmedre) 實作此選項。

#### 提供您的意見反應

這是我們生態系統的一個重大變更。我們將感謝您的意見反應，以協助使其變得更好。

在您的專案中嘗試新的記憶體管理器，並 [在我們的 issue tracker YouTrack 中分享意見反應](https://youtrack.jetbrains.com/issue/KT-48525)。

### 自訂 Info.plist 檔案

產生框架時，Kotlin/Native 編譯器會產生資訊屬性清單檔案 `Info.plist`。
先前，自訂其內容很麻煩。使用 Kotlin 1.7.20，您可以直接設定以下屬性：

| 屬性                     | 二進位選項              |
|------------------------------|----------------------------|
| `CFBundleIdentifier`         | `bundleId`                 |
| `CFBundleShortVersionString` | `bundleShortVersionString` |
| `CFBundleVersion`            | `bundleVersion`            |

為此，請使用相應的二進位選項。傳遞
`-Xbinary=$option=$value` 編譯器標記或為必要的框架設定 `binaryOption(option, value)` Gradle DSL。

Kotlin 團隊非常感謝 Mads Ager 實作此功能。

## Kotlin/JS

Kotlin/JS 收到了一些增強功能，這些功能改善了開發人員體驗並提高了效能：

* 由於相依性的載入效率提高，Klib 生成在增量和乾淨建置中都更快。
* [開發二進位檔的增量編譯](js-ir-compiler#incremental-compilation-for-development-binaries)
  已重新設計，從而大大改善了乾淨建置情境，加快了增量建置並修正了穩定性。
* 我們改進了巢狀物件、密封類別和建構子中可選參數的 `.d.ts` 生成。

## Gradle

Kotlin Gradle 外掛程式的更新重點在於與新的 Gradle 功能和最新的 Gradle
版本相容。

Kotlin 1.7.20 包含支援 Gradle 7.1 的變更。已移除或替換已棄用的方法和屬性，
減少了 Kotlin Gradle 外掛程式產生的已棄用警告的數量，並解鎖了對 Gradle 8.0 的未來支援。

但是，有一些可能需要您注意的潛在重大變更：

### 目標組態

* `org.jetbrains.kotlin.gradle.dsl.SingleTargetExtension` 現在具有泛型參數 `SingleTargetExtension<T : KotlinTarget>`。
* `kotlin.targets.fromPreset()` 慣例已棄用。相反，您仍然可以使用 `kotlin.targets { fromPreset() }`，
  但我們建議 [明確設定目標](multiplatform-discover-project#targets)。
* Gradle 自動產生的目標存取器在 `kotlin.targets { }` 區塊內不再可用。請改用 `findByName("targetName")`
  方法。

  請注意，在 `kotlin.targets` 的情況下，此類存取器仍然可用，例如 `kotlin.targets.linuxX64`。

### 原始碼目錄組態

Kotlin Gradle 外掛程式現在將 Kotlin `SourceDirectorySet` 作為 `kotlin` 擴充功能新增到 Java 的 `SourceSet` 群組。
這使得可以在 `build.gradle.kts` 檔案中組態原始碼目錄，方式與在
[Java、Groovy 和 Scala](https://docs.gradle.org/7.1/release-notes.html#easier-source-set-configuration-in-kotlin-dsl) 中組態它們的方式類似：

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

請記住，您也可以使用 `kotlin` 擴充功能來存取 `KotlinSourceSet`：

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

此版本提供了一個新的 `jvmToolchain()` 方法，用於啟用 [JVM 工具鏈功能](gradle-configure-project#gradle-java-toolchains-support)。
如果您不需要任何額外的 [組態欄位](https://docs.gradle.org/current/javadoc/org/gradle/jvm/toolchain/JavaToolchainSpec.html)，
例如 `implementation` 或 `vendor`，則可以使用 Kotlin 擴充功能的此方法：

```kotlin
kotlin {
    jvmToolchain(17)
}
```

這簡化了 Kotlin 專案設定流程，而無需任何額外的組態。
在此版本之前，您只能以下列方式指定 JDK 版本：

```kotlin
kotlin {
    jvmToolchain {
        languageVersion.set(JavaLanguageVersion.of(17))
    }
}
```

## 標準函式庫

Kotlin 1.7.20 為 `java.nio.file.Path` 類別提供了新的 [擴充函數](extensions#extension-functions)，使您可以遍歷檔案樹：

* `walk()` 會延遲遍歷以指定路徑為根的檔案樹。
* `fileVisitor()` 可以單獨建立 `FileVisitor`。`FileVisitor` 定義了在遍歷目錄
  和檔案時對它們執行的動作。
* `visitFileTree(fileVisitor: FileVisitor, ...)` 會消耗一個已準備好的 `FileVisitor`，並在後端使用 `java.nio.file.Files.walkFileTree()`。
* `visitFileTree(..., builderAction: FileVisitorBuilder.() `->` Unit)` 會建立一個具有 `builderAction` 的 `FileVisitor`，並
  呼叫 `visitFileTree(fileVisitor, ...)` 函數。
* `FileVisitResult`，`FileVisitor` 的傳回類型，具有 `CONTINUE` 預設值，該預設值會繼續處理
  檔案。

`java.nio.file.Path` 的新擴充函數是 [Experimental](components-stability)。
它們可能會隨時變更。需要選擇加入（請參閱下面的詳細資訊），並且您應該僅將它們用於評估目的。

以下是您可以使用這些新擴充函數執行的一些操作：

* 明確建立一個 `FileVisitor`，然後使用它：

  ```kotlin
  val cleanVisitor = fileVisitor {
      onPreVisitDirectory { directory, attributes `->`
          // Some logic on visiting directories
          FileVisitResult.CONTINUE
      }
  
      onVisitFile { file, attributes `->`
          // Some logic on visiting files
          FileVisitResult.CONTINUE
      }
  }
  
  // Some logic may go here
  
  projectDirectory.visitFileTree(cleanVisitor)
  ```

* 使用 `builderAction` 建立一個 `FileVisitor` 並立即使用它：

  ```kotlin
  projectDirectory.visitFileTree {
  // Definition of the builderAction:
      onPreVisitDirectory { directory, attributes `->`
          // Some logic on visiting directories
          FileVisitResult.CONTINUE
      }
  
      onVisitFile { file, attributes `->`
          // Some logic on visiting files
          FileVisitResult.CONTINUE
      }
  }
  ```

* 使用 `walk()` 函數遍歷以指定路徑為根的檔案樹：

  ```kotlin
  @OptIn(kotlin.io.path.ExperimentalPathApi::class)
  fun traverseFileTree() {
      val cleanVisitor = fileVisitor {
          onPreVisitDirectory { directory, _ `->`
              if (directory.name == "build") {
                  directory.toFile().deleteRecursively()
                  FileVisitResult.SKIP_SUBTREE
              } else {
                  FileVisitResult.CONTINUE
              }
          }
  
          onVisitFile { file, _ `->`
              if (file.extension == "class") {
                  file.deleteExisting()
              }
              FileVisitResult.CONTINUE
          }
      }
  
      val rootDirectory = createTempDirectory("Project")
  
      rootDirectory.resolve("src").let { srcDirectory `->`
          srcDirectory.createDirectory()
          srcDirectory.resolve("A.kt").createFile()
          srcDirectory.resolve("A.class").createFile()
      }
  
      rootDirectory.resolve("build").let { buildDirectory `->`
          buildDirectory.createDirectory()
          buildDirectory.resolve("Project.jar").createFile()
      }
  
   
  // Use walk function:
      val directoryStructure = rootDirectory.walk(PathWalkOption.INCLUDE_DIRECTORIES)
          .map { it.relativeTo(rootDirectory).toString() }
          .toList().sorted()
      assertPrints(directoryStructure, "[, build, build/Project.jar, src, src/A.class, src/A.kt]")
  
      rootDirectory.visitFileTree(cleanVisitor)
  
      val directoryStructureAfterClean = rootDirectory.walk(PathWalkOption.INCLUDE_DIRECTORIES)
          .map { it.relativeTo(rootDirectory).toString() }
          .toList().sorted()
      assertPrints(directoryStructureAfterClean, "[, src, src/A.kt]")

  }
  ```

與實驗性 API 通常的情況一樣，新的擴充功能需要選擇加入：`@OptIn(kotlin.io.path.ExperimentalPathApi::class)`
或 `@kotlin.io.path.ExperimentalPathApi`。或者，您可以使用編譯器選項：`-opt-in=kotlin.io.path.ExperimentalPathApi`。

我們將感謝您在 YouTrack 中提供關於 [`walk()` 函數](https://youtrack.jetbrains.com/issue/KT-52909) 和
[訪問擴充函數](https://youtrack.jetbrains.com/issue/KT-52910) 的意見反應。

## 文件更新

自上一個版本以來，Kotlin 文件收到了一些值得注意的變更：

### 經過修改和改進的頁面

* [基本類型概述](basic-types) – 瞭解 Kotlin 中使用的基本類型：數字、布林值、字元、字串、陣列和未簽署的整數數字。
* [用於 Kotlin 開發的 IDE](kotlin-ide) – 請參閱具有官方 Kotlin 支援的 IDE 列表以及具有社群支援外掛程式的工具。

### Kotlin Multiplatform journal 中的新文章

* [原生和跨平台應用程式開發：如何選擇？](https://www.jetbrains.com/help/kotlin-multiplatform-dev/native-and-cross-platform.html) – 查看我們對跨平台應用程式開發和原生方法的概述和優勢。
* [六個最佳跨平台應用程式開發框架](https://www.jetbrains.com/help/kotlin-multiplatform-dev/cross-platform-frameworks.html) – 閱讀有關協助您為跨平台專案選擇正確框架的關鍵