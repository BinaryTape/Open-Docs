[//]: # (title: Kotlin/Native 常見問題)

## 如何執行我的程式？

如果您不關心傳入的引數，請定義一個頂層函式 `fun main(args: Array<String>)` 或僅 `fun main()`，並確保它不在任何套件中。
此外，編譯器開關 `-entry` 也可用於將任何接受 `Array<String>` 或不接受任何引數並回傳 `Unit` 的函式設定為進入點。

## Kotlin/Native 的記憶體管理模型是什麼？

Kotlin/Native 採用自動記憶體管理方案，與 Java 或 Swift 提供的方案相似。

[了解 Kotlin/Native 記憶體管理器](native-memory-manager.md)

## 如何建立共享函式庫？

在您的 Gradle 建置檔中使用 `-produce dynamic` 編譯器選項或 `binaries.sharedLib()`：

```kotlin
kotlin {
    iosArm64("mylib") {
        binaries.sharedLib()
    }
}
```

它會產生一個平台專用的共享物件（Linux 上為 `.so`，macOS 上為 `.dylib`，Windows 目標上為 `.dll`）和一個 C 語言標頭檔，允許 C/C++ 程式碼使用您的 Kotlin/Native 程式中所有公共 API。

[完成 Kotlin/Native 作為動態函式庫的教程](native-dynamic-libraries.md)

## 如何建立靜態函式庫或物件檔？

在您的 Gradle 建置檔中使用 `-produce static` 編譯器選項或 `binaries.staticLib()`：

```kotlin
kotlin {
    iosArm64("mylib") {
        binaries.staticLib()
    }
}
```

它會產生一個平台專用的靜態物件（`.a` 函式庫格式）和一個 C 語言標頭檔，允許 C/C++ 程式碼使用您的 Kotlin/Native 程式中所有公共 API。

## 如何在企業代理背後執行 Kotlin/Native？

由於 Kotlin/Native 需要下載平台專用的工具鏈，您需要將 `-Dhttp.proxyHost=xxx -Dhttp.proxyPort=xxx` 指定為編譯器或 `gradlew` 的引數，或者透過 `JAVA_OPTS` 環境變數設定它。

## 如何為我的 Kotlin 框架指定自訂的 Objective-C 前綴/名稱？

使用 `-module-name` 編譯器選項或相應的 Gradle DSL 陳述式。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    iosArm64("myapp") {
        binaries.framework {
            freeCompilerArgs += listOf("-module-name", "TheName")
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    iosArm64("myapp") {
        binaries.framework {
            freeCompilerArgs += ["-module-name", "TheName"]
        }
    }
}
```

</tab>
</tabs>

## 如何重新命名 iOS 框架？

iOS 框架的預設名稱為 `<project name>.framework`。若要設定自訂名稱，請使用 `baseName` 選項。這也會設定模組名稱。

```kotlin
kotlin {
    iosArm64("myapp") {
       binaries {
          framework {
              baseName = "TheName"
          }
       }
    }
}
```

## 如何為我的 Kotlin 框架啟用 Bitcode？

Bitcode 嵌入在 Xcode 14 中已棄用，並在 Xcode 15 中針對所有 Apple 目標移除。Kotlin/Native 編譯器自 Kotlin 2.0.20 起不再支援 Bitcode 嵌入。

如果您使用較早版本的 Xcode 但想升級到 Kotlin 2.0.20 或更高版本，請在您的 Xcode 專案中停用 Bitcode 嵌入。

## 如何從不同的協程 (Coroutines) 安全地引用物件？

若要在 Kotlin/Native 中安全地存取或更新多個協程 (coroutines) 中的物件，請考慮使用並行安全建構，例如 `@Volatile` 和 `AtomicReference`。

使用 [`@Volatile`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.concurrent/-volatile/) 來註解 `var` 屬性。這會使對屬性支援欄位 (backing field) 的所有讀取和寫入都具有原子性 (atomic)。此外，寫入會立即對其他執行緒可見。當另一個執行緒存取此屬性時，它不僅會觀察到更新的值，還會觀察到在更新之前發生的變更。

或者，使用 [AtomicReference](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.concurrent.atomics/-atomic-reference/)，它支援原子性的讀取和更新。在 Kotlin/Native 上，它包裝一個易失性變數 (volatile variable) 並執行原子性操作。Kotlin 還提供了一組專為特定資料類型設計的原子性操作類型。您可以使用 `AtomicInt`、`AtomicLong`、`AtomicBoolean`、`AtomicArray`，以及 `AtomicIntArray` 和 `AtomicLongArray`。

有關共享可變狀態存取的更多資訊，請參閱 [協程文件](shared-mutable-state-and-concurrency.md)。

## 如何使用未發佈版本的 Kotlin/Native 編譯我的專案？

首先，請考慮嘗試[預覽版本](eap.md)。

如果您需要更近期開發版本，可以從原始碼建置 Kotlin/Native：複製 [Kotlin 儲存庫](https://github.com/JetBrains/kotlin) 並[遵循這些步驟](https://github.com/JetBrains/kotlin/blob/master/kotlin-native/README.md#building-from-source)。