[//]: # (title: 增量處理)

增量處理（Incremental processing）是一種盡可能避免重新處理原始碼的處理技術。
增量處理的主要目標是縮短典型的「變更-編譯-測試」循環的週轉時間。
如需一般資訊，請參閱維基百科關於 [增量計算](https://en.wikipedia.org/wiki/Incremental_computing) 的文章。

為了確定哪些原始碼是 *dirty* 的（那些需要重新處理的檔案），KSP 需要處理器的協助來識別哪些輸入來源對應到哪些產生的輸出。為了簡化這個通常繁瑣且容易出錯的過程，KSP 被設計為僅需要一組最小的「根來源（root sources）」，處理器以此作為導覽程式碼結構的起點。換句話說，如果 `KSNode` 是從以下任何一個方法取得的，處理器就需要將輸出與對應 `KSNode` 的來源建立關聯：
* `Resolver.getAllFiles`
* `Resolver.getSymbolsWithAnnotation`
* `Resolver.getClassDeclarationByName`
* `Resolver.getDeclarationsFromPackage`

增量處理目前預設為啟用。若要停用，請將 Gradle 屬性設定為 `ksp.incremental=false`。
若要啟用會根據相依性和輸出傾印 dirty 集合的日誌，請使用 `ksp.incremental.log=true`。
您可以在 `build` 輸出目錄中找到這些擴充名為 `.log` 的日誌檔案。

在 JVM 上，預設會追蹤類別路徑（classpath）的變更，以及 Kotlin 和 Java 原始碼的變更。
若要僅追蹤 Kotlin 和 Java 原始碼變更，請透過設定 `ksp.incremental.intermodule=false` Gradle 屬性來停用類別路徑追蹤。

## 聚合 vs 隔離（Aggregating vs Isolating）

與 [Gradle 註解處理](https://docs.gradle.org/current/userguide/java_plugin.html#sec:incremental_annotation_processing) 中的概念類似，KSP 同時支援「聚合（aggregating）」和「隔離（isolating）」模式。請注意，與 Gradle 註解處理不同的是，KSP 是將每個「輸出」分類為聚合或隔離，而不是針對整個處理器。

聚合輸出可能會受到任何輸入變更的影響，但移除不影響其他檔案的檔案除外。這意味著任何輸入變更都會導致所有聚合輸出重新建置，這進而意味著會重新處理所有對應的已註冊、新增和修改過的原始碼檔案。

例如，收集所有具有特定註解之符號的輸出被視為聚合輸出。

隔離輸出僅取決於其指定的來源。對其他來源的變更不會影響隔離輸出。請注意，與 Gradle 註解處理不同，您可以為給定的輸出定義多個原始碼檔案。

例如，專門為其所實作的介面而產生的類別被視為隔離的。

總結來說，如果一個輸出可能取決於新的或任何已變更的來源，它就被視為聚合。否則，該輸出就是隔離的。

以下是為熟悉 Java 註解處理的讀者提供的總結：
* 在隔離的 Java 註解處理器中，所有輸出在 KSP 中都是隔離的。
* 在聚合的 Java 註解處理器中，某些輸出在 KSP 中可以是隔離的，而某些可以是聚合的。

### 它是如何實作的

相依性是透過輸入和輸出檔案的關聯來計算的，而不是透過註解。這是一個多對多的關係。

由於輸入-輸出關聯而產生的 dirty 傳播規則如下：
1. 如果輸入檔案發生變更，它將始終被重新處理。
2. 如果輸入檔案發生變更，且它與某個輸出相關聯，則與該相同輸出相關聯的所有其他輸入檔案也將被重新處理。這是具備遞移性的，即失效會反覆發生，直到沒有新的 dirty 檔案為止。
3. 所有與一個或多個聚合輸出相關聯的輸入檔案都將被重新處理。換句話說，如果一個輸入檔案不與任何聚合輸出相關聯，它就不會被重新處理（除非它符合上述第 1 點或第 2 點）。

原因如下：
1. 如果輸入發生變更，可能會引入新資訊，因此處理器需要使用該輸入重新執行。
2. 一個輸出是由一組輸入組成的。處理器可能需要所有輸入才能重新產生該輸出。
3. `aggregating=true` 表示輸出可能取決於新資訊，而新資訊可能來自新檔案或已變更的現有檔案。
   `aggregating=false` 表示處理器確信資訊僅來自某些輸入檔案，絕不會來自其他檔案或新檔案。

## 範例 1

處理器在讀取 `A.kt` 中的類別 `A` 和 `B.kt` 中的類別 `B`（其中 `A` 繼承 `B`）後產生 `outputForA`。
處理器透過 `Resolver.getSymbolsWithAnnotation` 取得 `A`，然後從 `A` 透過 `KSClassDeclaration.superTypes` 取得 `B`。
因為包含 `B` 是由於 `A` 引起的，所以在 `outputForA` 的 `dependencies` 中不需要指定 `B.kt`。在這種情況下您仍然可以指定 `B.kt`，但這是不必要的。

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
        // 不需要 B.kt，因為它可以被 KSP 推導為相依性
        val dependencies = Dependencies(aggregating = true, declA.containingFile!!)
        // outputForA.kt
        val outputName = "outputFor${declA.simpleName.asString()}"
        // outputForA 取決於 A.kt 和 B.kt
        val output = codeGenerator.createNewFile(dependencies, "com.example", outputName, "kt")
        output.write("// $declA : $declB
".toByteArray())
        output.close()
    }
    // ...
}
```

## 範例 2

假設處理器在讀取 `sourceA` 後產生 `outputA`，在讀取 `sourceB` 後產生 `outputB`。

當 `sourceA` 變更時：
* 如果 `outputB` 是聚合的，則 `sourceA` 和 `sourceB` 都會被重新處理。
* 如果 `outputB` 是隔離的，則只有 `sourceA` 會被重新處理。

當新增 `sourceC` 時：
* 如果 `outputB` 是聚合的，則 `sourceC` 和 `sourceB` 都會被重新處理。
* 如果 `outputB` 是隔離的，則只有 `sourceC` 會被重新處理。

當移除 `sourceA` 時，不需要重新處理任何內容。

當移除 `sourceB` 時，不需要重新處理任何內容。

## 如何判定檔案的 dirty 狀態

dirty 檔案可能是由使用者直接「變更」的，或者是受其他 dirty 檔案間接「影響」的。KSP 分兩個步驟傳播 dirty 狀態：
* 透過「解析追蹤（resolution tracing）」傳播：
  解析型別參照（隱式或顯式）是從一個檔案巡覽到另一個檔案的唯一方式。當處理器解析型別參照時，如果某個已變更或受影響的檔案中包含可能影響解析結果的變更，則會影響包含該參照的檔案。
* 透過「輸入-輸出對應」傳播：
  如果原始碼檔案發生變更或受到影響，則與該檔案具有共同輸出的所有其他原始碼檔案都會受到影響。

請注意，這兩者都具有遞移性，且後者會形成等價類（equivalence classes）。

## 回報 Bug

若要回報 Bug，請設定 Gradle 屬性 `ksp.incremental=true` 和 `ksp.incremental.log=true`，並執行乾淨組建（clean build）。此組建會產生兩個日誌檔案：

* `build/kspCaches/<source set>/logs/kspDirtySet.log`
* `build/kspCaches/<source set>/logs/kspSourceToOutputs.log`

接著您可以執行後續的增量組建，這會產生另外兩個日誌檔案：

* `build/kspCaches/<source set>/logs/kspDirtySetByDeps.log`
* `build/kspCaches/<source set>/logs/kspDirtySetByOutputs.log`

這些日誌包含來源檔案與輸出的名稱，以及組建的時間戳記。