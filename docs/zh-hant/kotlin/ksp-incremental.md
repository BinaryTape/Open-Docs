---
title: 增量式處理
---
增量處理是一種盡可能避免重新處理原始碼的處理技術。
增量處理的主要目標是減少典型「變更-編譯-測試」週期的周轉時間。
如需一般資訊，請參閱 Wikipedia 上關於[增量計算](https://en.wikipedia.org/wiki/Incremental_computing)的文章。

為了確定哪些原始碼是「髒的」(dirty，需要重新處理)，KSP 需要處理器 (processor) 的協助來識別哪些輸入原始碼對應於哪些產生的輸出。
為了幫助處理這個通常繁瑣且容易出錯的過程，KSP 的設計要求只有一組最小的「根原始碼」(root sources)，處理器將其用作導航程式碼結構的起點。
換句話說，如果 `KSNode` 是從以下任何一項取得的，則處理器 (processor) 需要將輸出與相應 `KSNode` 的原始碼相關聯：
* `Resolver.getAllFiles`
* `Resolver.getSymbolsWithAnnotation`
* `Resolver.getClassDeclarationByName`
* `Resolver.getDeclarationsFromPackage`

目前預設啟用增量處理。要停用它，請設定 Gradle 屬性 `ksp.incremental=false`。
要啟用記錄 (log)，以轉儲根據依賴關係和輸出的 dirty set，請使用 `ksp.incremental.log=true`。
您可以在 `build` 輸出目錄中找到這些記錄檔，其檔案副檔名為 `.log`。

在 JVM 上，classpath 的變更以及 Kotlin 和 Java 原始碼的變更，預設會被追蹤。
要僅追蹤 Kotlin 和 Java 原始碼的變更，請透過設定 `ksp.incremental.intermodule=false` Gradle 屬性來停用 classpath 追蹤。

## 聚合 (Aggregating) vs 隔離 (Isolating)

與 [Gradle 注釋處理](https://docs.gradle.org/current/userguide/java_plugin.html#sec:incremental_annotation_processing) 中的概念類似，KSP 支援「聚合 (aggregating)」和「隔離 (isolating)」模式。
請注意，與 Gradle 注釋處理不同，KSP 將每個輸出歸類為聚合或隔離，而不是整個處理器 (processor)。

一個聚合輸出可能受到任何輸入變更的影響，除了刪除不影響其他檔案的檔案。
這意味著任何輸入變更都會導致重建所有聚合輸出，進而意味著重新處理所有相應的已註冊、新增和修改的原始碼檔案。

例如，收集具有特定注釋的所有符號的輸出被認為是聚合輸出。

一個隔離輸出僅依賴於其指定的原始碼。對其他原始碼的變更不會影響隔離輸出。
請注意，與 Gradle 注釋處理不同，您可以為給定的輸出定義多個原始碼檔案。

例如，專用於它所實現的介面的生成類別被認為是隔離的。

總而言之，如果輸出可能依賴於新的或任何已變更的原始碼，則它被認為是聚合的。
否則，該輸出是隔離的。

以下是針對熟悉 Java 注釋處理的讀者的摘要：
* 在一個隔離的 Java 注釋處理器中，所有輸出在 KSP 中都是隔離的。
* 在一個聚合的 Java 注釋處理器中，一些輸出可以是隔離的，而另一些輸出可以是聚合的在 KSP 中。

### 它是如何實現的

依賴關係是透過輸入和輸出檔案的關聯來計算的，而不是透過注釋。
這是一種多對多的關係。

由於輸入-輸出關聯而產生的 dirtiness 傳播規則是：
1. 如果一個輸入檔案被更改，它將始終被重新處理。
2. 如果一個輸入檔案被更改，並且它與一個輸出相關聯，那麼所有與該輸出相關聯的其他輸入檔案也將被重新處理。
   這是可傳遞的，也就是說，失效 (invalidation) 會重複發生，直到沒有新的 dirty 檔案。
3. 所有與一個或多個聚合輸出相關聯的輸入檔案都將被重新處理。
   換句話說，如果一個輸入檔案沒有與任何聚合輸出相關聯，它將不會被重新處理
   (除非它滿足上述 1. 或 2.)。

理由是：
1. 如果一個輸入被更改，可能會引入新的資訊，因此處理器 (processor) 需要再次使用該輸入執行。
2. 一個輸出是由一組輸入組成的。處理器可能需要所有輸入來重新產生輸出。
3. `aggregating=true` 意味著一個輸出可能潛在地依賴於新的資訊，這些資訊可能來自新的檔案或已變更的現有檔案。
   `aggregating=false` 意味著處理器 (processor) 確信該資訊僅來自某些輸入檔案，而絕不會來自其他或新的檔案。

## 範例 1

一個處理器在讀取 `A.kt` 中的類別 `A` 和 `B.kt` 中的類別 `B` (其中 `A` 繼承自 `B`) 後產生 `outputForA`。
處理器 (processor) 通過 `Resolver.getSymbolsWithAnnotation` 獲得 `A`，然後通過 `KSClassDeclaration.superTypes` 從 `A` 獲得 `B`。
因為包含 `B` 是由於 `A`，所以 `B.kt` 不需要在 `outputForA` 的 `dependencies` 中指定。
在這種情況下，您仍然可以指定 `B.kt`，但這是沒有必要的。

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
        // B.kt isn't required, because it can be deduced as a dependency by KSP
        val dependencies = Dependencies(aggregating = true, declA.containingFile!!)
        // outputForA.kt
        val outputName = "outputFor${declA.simpleName.asString()}"
        // outputForA depends on A.kt and B.kt
        val output = codeGenerator.createNewFile(dependencies, "com.example", outputName, "kt")
        output.write("// $declA : $declB
".toByteArray())
        output.close()
    }
    // ...
}
```

## 範例 2

假設一個處理器在讀取 `sourceA` 後產生 `outputA`，在讀取 `sourceB` 後產生 `outputB`。

當 `sourceA` 被更改時：
* 如果 `outputB` 是聚合的，則 `sourceA` 和 `sourceB` 都會被重新處理。
* 如果 `outputB` 是隔離的，則只有 `sourceA` 會被重新處理。

當 `sourceC` 被添加時：
* 如果 `outputB` 是聚合的，則 `sourceC` 和 `sourceB` 都會被重新處理。
* 如果 `outputB` 是隔離的，則只有 `sourceC` 會被重新處理。

當 `sourceA` 被刪除時，不需要重新處理任何內容。

當 `sourceB` 被刪除時，不需要重新處理任何內容。

## 如何確定檔案的 dirtiness

一個 dirty 檔案要么是使用者直接「變更」的，要么是間接被其他 dirty 檔案「影響」的。 KSP 分兩個步驟傳播 dirtiness：
* 通過「解析追蹤」(resolution tracing) 傳播：
  解析型別參考 (隱式或顯式) 是從一個檔案導航到另一個檔案的唯一方法。
  當型別參考被處理器 (processor) 解析時，包含可能潛在影響解析結果的變更的已更改或受影響檔案將影響包含該參考的檔案。
* 通過「輸入-輸出對應」(input-output correspondence) 傳播：
  如果一個原始碼檔案被更改或受影響，則所有與該檔案具有一些共同輸出的其他原始碼檔案都會受到影響。

請注意，它們都是可傳遞的，並且第二種形式是等價類。

## 報告錯誤

要報告錯誤，請設定 Gradle 屬性 `ksp.incremental=true` 和 `ksp.incremental.log=true`，並執行一次 clean build。
這個 build 會產生兩個記錄檔：

* `build/kspCaches/<source set>/logs/kspDirtySet.log`
* `build/kspCaches/<source set>/logs/kspSourceToOutputs.log`

然後，您可以執行連續的增量 build，這將會產生兩個額外的記錄檔：

* `build/kspCaches/<source set>/logs/kspDirtySetByDeps.log`
* `build/kspCaches/<source set>/logs/kspDirtySetByOutputs.log`

這些記錄包含原始碼和輸出檔案的檔名，以及 build 的時間戳記。