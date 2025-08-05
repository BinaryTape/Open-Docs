[//]: # (title: 增量處理)

增量處理是一種盡可能避免重新處理源碼的處理技術。增量處理的主要目標是縮短典型變更-編譯-測試週期的週轉時間。有關一般資訊，請參閱維基百科關於[增量計算](https://en.wikipedia.org/wiki/Incremental_computing)的文章。

為了判斷哪些源碼是_髒污的_（即需要重新處理的），KSP 需要處理器（processor）的協助來識別哪些輸入源碼對應哪些生成的輸出。為了協助處理這個經常繁瑣且容易出錯的過程，KSP 的設計旨在只要求最少量的_根源碼_，處理器將其用作導航程式碼結構的起始點。換句話說，如果 `KSNode` 是從以下任何一個方法獲得的，處理器需要將輸出與對應 `KSNode` 的源碼關聯起來：
* `Resolver.getAllFiles`
* `Resolver.getSymbolsWithAnnotation`
* `Resolver.getClassDeclarationByName`
* `Resolver.getDeclarationsFromPackage`

增量處理目前預設為啟用。要停用它，請將 Gradle 屬性 `ksp.incremental=false` 設定。要啟用日誌，以根據依賴項和輸出傾印髒污集，請使用 `ksp.incremental.log=true`。您可以在 `build` 輸出目錄中找到這些副檔名為 `.log` 的日誌檔案。

在 JVM 上，類別路徑變更以及 Kotlin 和 Java 源碼變更預設會被追蹤。要僅追蹤 Kotlin 和 Java 源碼變更，請透過設定 `ksp.incremental.intermodule=false` Gradle 屬性來停用類別路徑追蹤。

## 聚合式與隔離式

類似於[Gradle 註解處理](https://docs.gradle.org/current/userguide/java_plugin.html#sec:incremental_annotation_processing)中的概念，KSP 同時支援_聚合式_和_隔離式_模式。請注意，與 Gradle 註解處理不同，KSP 將每個輸出歸類為聚合式或隔離式，而不是將整個處理器歸類。

聚合式輸出可能會受到任何輸入變更的影響，除了移除不影響其他檔案的檔案。這意味著任何輸入變更都會導致所有聚合式輸出被重建，進而意味著所有對應的已註冊、新增和修改的源碼檔案都會被重新處理。

例如，一個收集所有帶有特定註解符號的輸出被視為聚合式輸出。

隔離式輸出僅依賴於其指定的源碼。其他源碼的變更不會影響隔離式輸出。請注意，與 Gradle 註解處理不同，您可以為給定的輸出定義多個源碼檔案。

例如，一個專用於它所實作的介面的生成類別被視為隔離式。

總結來說，如果一個輸出可能依賴於新的或任何已變更的源碼，它就被視為聚合式。否則，該輸出是隔離式。

以下是為熟悉 Java 註解處理的讀者提供的摘要：
* 在隔離式 Java 註解處理器中，所有輸出在 KSP 中都是隔離式。
* 在聚合式 Java 註解處理器中，某些輸出可以是隔離式，某些可以是聚合式。

### 如何實作

依賴項是透過輸入和輸出檔案的關聯來計算的，而不是透過註解。這是一種多對多關係。

由於輸入-輸出關聯所造成的髒污傳播規則如下：
1. 如果輸入檔案被變更，它將總是會被重新處理。
2. 如果輸入檔案被變更，且它與某個輸出相關聯，那麼與該相同輸出相關聯的所有其他輸入檔案也將被重新處理。這是遞移的，也就是說，失效會重複發生，直到沒有新的髒污檔案為止。
3. 所有與一個或多個聚合式輸出相關聯的輸入檔案都將被重新處理。換句話說，如果一個輸入檔案未與任何聚合式輸出相關聯，它將不會被重新處理（除非它符合上述第 1 或第 2 點）。

原因如下：
1. 如果輸入被變更，可能會引入新資訊，因此處理器需要再次以該輸入執行。
2. 輸出是由一組輸入構成的。處理器可能需要所有輸入才能重新生成輸出。
3. `aggregating=true` 意味著輸出可能依賴於新資訊，這些資訊可以來自新檔案，或已變更的現有檔案。
   `aggregating=false` 意味著處理器確定資訊僅來自某些輸入檔案，而不會來自其他或新的檔案。

## 範例 1

處理器在讀取 `A.kt` 中的類別 `A` 和 `B.kt` 中的類別 `B` 之後生成 `outputForA`，其中 `A` 繼承 `B`。處理器透過 `Resolver.getSymbolsWithAnnotation` 獲得 `A`，然後從 `A` 的 `KSClassDeclaration.superTypes` 獲得 `B`。因為包含 `B` 是由於 `A`，所以 `B.kt` 不需要為 `outputForA` 在 `dependencies` 中指定。在這種情況下，您仍然可以指定 `B.kt`，但這是沒有必要的。

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
        // B.kt 不是必需的，因為它可以被 KSP 推斷為依賴項
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

假設處理器在讀取 `sourceA` 後生成 `outputA`，且在讀取 `sourceB` 後生成 `outputB`。

當 `sourceA` 變更時：
* 如果 `outputB` 是聚合式，`sourceA` 和 `sourceB` 都會被重新處理。
* 如果 `outputB` 是隔離式，只有 `sourceA` 會被重新處理。

當 `sourceC` 被新增時：
* 如果 `outputB` 是聚合式，`sourceC` 和 `sourceB` 都會被重新處理。
* 如果 `outputB` 是隔離式，只有 `sourceC` 會被重新處理。

當 `sourceA` 被移除時，無需重新處理。

當 `sourceB` 被移除時，無需重新處理。

## 檔案髒污是如何判斷的

髒污檔案要麼是使用者直接_變更_，要麼是受到其他髒污檔案間接_影響_。KSP 分兩步傳播髒污：
* 透過_解析追蹤_傳播：
  解析類型引用（隱式或顯式）是從一個檔案導航到另一個檔案的唯一方式。當處理器解析類型引用時，一個包含可能影響解析結果的變更的已變更或受影響的檔案將影響包含該引用的檔案。
* 透過_輸入-輸出對應_傳播：
  如果源碼檔案被變更或受影響，所有與該檔案有共同輸出的其他源碼檔案都會受到影響。

請注意，它們兩者都是遞移的，並且第二種形式構成等價類別。

## 報告錯誤

要報告錯誤，請設定 Gradle 屬性 `ksp.incremental=true` 和 `ksp.incremental.log=true`，並執行一次乾淨的建置。此建置會產生兩個日誌檔案：

* `build/kspCaches/<source set>/logs/kspDirtySet.log`
* `build/kspCaches/<source set>/logs/kspSourceToOutputs.log`

然後您可以執行連續的增量建置，這將產生另外兩個日誌檔案：

* `build/kspCaches/<source set>/logs/kspDirtySetByDeps.log`
* `build/kspCaches/<source set>/logs/kspDirtySetByOutputs.log`

這些日誌包含源碼和輸出的檔案名稱，加上建置的時間戳記。