[//]: # (title: Kotlin/Native 常見問題)

## 如何執行我的程式？

若您不關心傳入的參數，請定義一個頂層函數 `fun main(args: Array<String>)` 或僅定義 `fun main()`，並請確保它不在任何套件中。
此外，編譯器開關 `-entry` 也可用於將任何接受 `Array<String>` 或不接受參數並傳回 `Unit` 的函數作為進入點。

## 什麼是 Kotlin/Native 記憶體管理模型？

Kotlin/Native 使用一種自動化記憶體管理方案，類似於 Java 或 Swift 所提供的。

[了解 Kotlin/Native 記憶體管理器](native-memory-manager.md)

## 如何建立共用程式庫？

在您的 Gradle 建構檔案中使用 `-produce dynamic` 編譯器選項或 `binaries.sharedLib()`：

```kotlin
kotlin {
    iosArm64("mylib") {
        binaries.sharedLib()
    }
}
```

它會產生一個平台特定的共用物件（Linux 上為 `.so`，macOS 上為 `.dylib`，Windows 目標上為 `.dll`）以及一個 C 語言標頭檔，允許您從 C/C++ 程式碼中使用 Kotlin/Native 程式中所有公開的 API。

[完成 Kotlin/Native 作為動態程式庫的教學](native-dynamic-libraries.md)

## 如何建立靜態程式庫或物件檔？

在您的 Gradle 建構檔案中使用 `-produce static` 編譯器選項或 `binaries.staticLib()`：

```kotlin
kotlin {
    iosArm64("mylib") {
        binaries.staticLib()
    }
}
```

它會產生一個平台特定的靜態物件（`.a` 程式庫格式）以及一個 C 語言標頭檔，允許您從 C/C++ 程式碼中使用 Kotlin/Native 程式中所有公開的 API。

## 如何在企業代理後面執行 Kotlin/Native？

由於 Kotlin/Native 需要下載平台特定的工具鏈，您需要將 `-Dhttp.proxyHost=xxx -Dhttp.proxyPort=xxx` 指定為編譯器或 `gradlew` 參數，
或者透過 `JAVA_OPTS` 環境變數來設定。

## 如何為我的 Kotlin 框架指定自訂的 Objective-C 前綴/名稱？

使用 `-module-name` 編譯器選項或相應的 Gradle DSL 語句。

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

iOS 框架的預設名稱為 `<project name>.framework`。
要設定自訂名稱，請使用 `baseName` 選項。這也將設定模組名稱。

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

從 Xcode 14 開始，Bitcode 嵌入功能已被棄用，並在 Xcode 15 中針對所有 Apple 目標平台移除。
自 Kotlin 2.0.20 起，Kotlin/Native 編譯器不再支援 Bitcode 嵌入。

如果您正在使用較早版本的 Xcode 但想升級到 Kotlin 2.0.20 或更高版本，請在您的 Xcode 專案中停用 Bitcode 嵌入。

## 如何安全地從不同協程參考物件？

為了在 Kotlin/Native 中跨多個協程安全地存取或更新物件，請考慮使用並行安全建構，例如 `@Volatile` 和 `AtomicReference`。

使用 [`@Volatile`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.concurrent/-volatile/) 來標註 `var` 屬性。
這使得對屬性後備欄位的所有讀取和寫入都具有原子性。此外，寫入會立即對其他執行緒可見。當另一個執行緒存取此屬性時，它不僅觀察到更新值，還觀察到更新之前發生的變更。

或者，使用 [AtomicReference](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.concurrent.atomics/-atomic-reference/)，它支援原子讀取和更新。在 Kotlin/Native 上，它包裹一個 volatile 變數並執行原子操作。
Kotlin 還提供了一組針對特定資料類型量身打造的原子操作類型。您可以使用 `AtomicInt`、`AtomicLong`、`AtomicBoolean`、`AtomicArray`，以及 `AtomicIntArray` 和 `AtomicLongArray`。

有關共用可變狀態存取的更多資訊，請參閱 [協程文件](shared-mutable-state-and-concurrency.md)。

## 如何使用未發布的 Kotlin/Native 版本編譯我的專案？

首先，請考慮嘗試 [預覽版本](eap.md)。

如果您需要更新的開發版本，您可以從原始碼建構 Kotlin/Native：克隆 [Kotlin 儲存庫](https://github.com/JetBrains/kotlin) 並遵循 [這些步驟](https://github.com/JetBrains/kotlin/blob/master/kotlin-native/README.md#building-from-source)。