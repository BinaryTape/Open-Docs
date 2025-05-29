[//]: # (title: 增量處理)

增量處理是一種處理技術，它會盡可能避免對原始碼進行重複處理。
增量處理的主要目標是縮短典型變更-編譯-測試週期的週轉時間。
有關一般資訊，請參閱維基百科關於[增量計算](https://en.wikipedia.org/wiki/Incremental_computing)的文章。

為了判斷哪些原始碼是 _髒污的_ (需要重新處理的)，KSP 需要處理器的幫助來識別
哪些輸入原始碼對應到哪些生成的輸出。為了解決這個通常繁瑣且容易出錯的過程，
KSP 設計成只要求最少量的 _根源碼_，處理器將其用作導航程式碼結構的起始點。
換句話說，如果 `KSNode` 是從以下任何一個方法獲得的，處理器就需要將輸出與對應 `KSNode` 的原始碼關聯起來：
* `Resolver.getAllFiles`
* `Resolver.getSymbolsWithAnnotation`
* `Resolver.getClassDeclarationByName`
* `Resolver.getDeclarationsFromPackage`

增量處理目前預設啟用。要停用它，請設定 Gradle 屬性 `ksp.incremental=false`。
要啟用根據依賴項和輸出傾印髒污集合的日誌，請使用 `ksp.incremental.log=true`。
你可以在 `build` 輸出目錄中找到這些副檔名為 `.log` 的日誌檔。

在 JVM 上，類路徑變更以及 Kotlin 和 Java 原始碼變更預設會被追蹤。
若要僅追蹤 Kotlin 和 Java 原始碼變更，請透過設定 `ksp.incremental.intermodule=false` Gradle 屬性來停用類路徑追蹤。

## 聚合式 (Aggregating) 與 隔離式 (Isolating)

與 [Gradle 註解處理](https://docs.gradle.org/current/userguide/java_plugin.html#sec:incremental_annotation_processing)中的概念類似，
KSP 同時支援 _聚合式 (aggregating)_ 和 _隔離式 (isolating)_ 模式。請注意，與 Gradle 註解處理不同，KSP 是將
每個輸出歸類為聚合式或隔離式，而不是整個處理器。

聚合式輸出可能會受到任何輸入變更的影響，除非是移除不影響其他檔案的檔案。
這表示任何輸入變更都會導致所有聚合式輸出的重新建構，
這反過來意味著重新處理所有對應的已註冊、新增和修改的原始碼檔案。

舉例來說，一個收集所有帶有特定註解的符號的輸出被視為聚合式輸出。

隔離式輸出僅依賴於其指定的原始碼。對其他原始碼的變更不會影響隔離式輸出。
請注意，與 Gradle 註解處理不同，你可以為給定輸出定義多個原始碼檔案。

舉例來說，一個專門用於其所實作介面的生成類別被視為隔離式。

總之，如果輸出可能依賴於新增或任何變更的原始碼，則被視為聚合式。
否則，輸出是隔離式。

以下是熟悉 Java 註解處理的讀者摘要：
* 在隔離式 Java 註解處理器中，所有輸出在 KSP 中都是隔離式。
* 在聚合式 Java 註解處理器中，某些輸出可以是隔離式，某些可以是聚合式。

### 實作方式

依賴項是透過輸入和輸出檔案的關聯來計算的，而不是透過註解。
這是一種多對多關係。

由於輸入-輸出關聯而導致的髒污傳播規則是：
1. 如果輸入檔案發生變更，它將始終被重新處理。
2. 如果輸入檔案發生變更，且它與輸出相關聯，則所有與相同輸出相關聯的其他輸入檔案也將被重新處理。
   這是遞移的，即失效會重複發生，直到沒有新的髒污檔案為止。
3. 所有與一個或多個聚合式輸出相關聯的輸入檔案都將被重新處理。
   換句話說，如果輸入檔案未與任何聚合式輸出相關聯，它就不會被重新處理
   (除非它符合上述第 1 或第 2 條)。

原因如下：
1. 如果輸入發生變更，可以引入新資訊，因此處理器需要再次使用該輸入運行。
2. 一個輸出由一組輸入構成。處理器可能需要所有輸入才能重新生成輸出。
3. `aggregating=true` 表示輸出可能潛在地依賴於新資訊，這可以來自新檔案，或已變更的現有檔案。
   `aggregating=false` 表示處理器確信資訊僅來自某些輸入檔案，而絕不來自其他或新檔案。

## 範例 1

一個處理器在讀取 `A.kt` 中的類別 `A` 和 `B.kt` 中的類別 `B` 後生成 `outputForA`，其中 `A` 繼承自 `B`。
處理器透過 `Resolver.getSymbolsWithAnnotation` 取得 `A`，然後透過 `A` 的 `KSClassDeclaration.superTypes` 取得 `B`。
因為包含 `B` 是由於 `A`，所以 `outputForA` 的 `dependencies` 中不需要指定 `B.kt`。
在此情況下，你仍然可以指定 `B.kt`，但這是不必要的。

```kotlin
// A.kt
@Interesting
class A : B()

// B.kt
open class B

// Example1Processor.kt
class Example1Processor : SymbolProcessor {
    override fun process(resolver: Resolver) {
        val declA = resolver.getSymbolsWithAnnotation("Interesting").first() as KSClassDeclaration
        val declB = declA.superTypes.first().resolve().declaration
        // B.kt 不是必需的，因為 KSP 可以將其推導為依賴項
        val dependencies = Dependencies(aggregating = true, declA.containingFile!!)
        // outputForA.kt
        val outputName = "outputFor${declA.simpleName.asString()}"
        // outputForA 依賴於 A.kt 和 B.kt
        val output = codeGenerator.createNewFile(dependencies, "com.example", outputName, "kt")
        output.write("// $declA : $declB
".toByteArray())
        output.close()
    }
    // ...
}
```

## 範例 2

假設一個處理器在讀取 `sourceA` 後生成 `outputA`，並在讀取 `sourceB` 後生成 `outputB`。

`sourceA` 變更時：
* 如果 `outputB` 是聚合式，則 `sourceA` 和 `sourceB` 都會被重新處理。
* 如果 `outputB` 是隔離式，則只有 `sourceA` 會被重新處理。

`sourceC` 新增時：
* 如果 `outputB` 是聚合式，則 `sourceC` 和 `sourceB` 都會被重新處理。
* 如果 `outputB` 是隔離式，則只有 `sourceC` 會被重新處理。

`sourceA` 移除時，不需要重新處理任何內容。

`sourceB` 移除時，不需要重新處理任何內容。

## 檔案髒污的判斷方式

髒污檔案是由使用者直接 _變更_，或間接被其他髒污檔案 _影響_。KSP 以兩個步驟傳播髒污：
* 透過 _解析追蹤_ 傳播：
  解析型別引用 (隱式或顯式) 是從一個檔案導航到另一個檔案的唯一方式。
  當處理器解析型別引用時，一個已變更或受影響的檔案如果包含可能影響解析結果的變更，將會影響包含該引用的檔案。
* 透過 _輸入-輸出對應_ 傳播：
  如果原始碼檔案發生變更或受影響，則所有與該檔案有共同輸出的其他原始碼檔案都會受影響。

請注意，這兩者都是遞移的，且第二者形成等價類別。

## 回報錯誤

要回報錯誤，請設定 Gradle 屬性 `ksp.incremental=true` 和 `ksp.incremental.log=true`，並執行一次乾淨的建構。
這次建構會產生兩個日誌檔：

* `build/kspCaches/<source set>/logs/kspDirtySet.log`
* `build/kspCaches/<source set>/logs/kspSourceToOutputs.log`

接著你可以運行連續的增量建構，這會產生兩個額外的日誌檔：

* `build/kspCaches/<source set>/logs/kspDirtySetByDeps.log`
* `build/kspCaches/<source set>/logs/kspDirtySetByOutputs.log`

這些日誌包含原始碼和輸出的檔案名稱，以及建構的時間戳記。