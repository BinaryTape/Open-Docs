---
title: "Kotlin/Native 常見問題"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## 該如何執行我的程式？

定義一個頂層函數 `fun main(args: Array<String>)` 或直接定義 `fun main()`，如果你對傳入的參數不感興趣的話，請確保它不在任何 package 裡。
此外，編譯器開關 `-entry` 可以將任何接受 `Array<String>` 或不接受任何參數，且回傳 `Unit` 的函數作為進入點。

## Kotlin/Native 的記憶體管理模型是什麼？

Kotlin/Native 使用一種自動化的記憶體管理方案，類似於 Java 或 Swift 提供的機制。

[了解 Kotlin/Native 記憶體管理器](native-memory-manager)

## 該如何建立共享函式庫？

使用 `-produce dynamic` 編譯器選項，或在 Gradle 建置檔案中使用 `binaries.sharedLib()`：

```kotlin
kotlin {
    iosArm64("mylib") {
        binaries.sharedLib()
    }
}
```

它會產生一個平台特定的共享物件（Linux 上的 `.so`、macOS 上的 `.dylib` 和 Windows 目標上的 `.dll`），以及一個 C 語言標頭，允許從 C/C++ 程式碼中使用 Kotlin/Native 程式中的所有公開 API (Application Programming Interface)。

[完成 Kotlin/Native 作為動態函式庫的教學](native-dynamic-libraries)

## 該如何建立靜態函式庫或物件檔案？

使用 `-produce static` 編譯器選項，或在 Gradle 建置檔案中使用 `binaries.staticLib()`：

```kotlin
kotlin {
    iosArm64("mylib") {
        binaries.staticLib()
    }
}
```

它會產生一個平台特定的靜態物件（`.a` 函式庫格式）和一個 C 語言標頭，允許你從 C/C++ 程式碼中使用 Kotlin/Native 程式中的所有公開 API (Application Programming Interface)。

## 該如何在公司 Proxy (代理伺服器) 後方執行 Kotlin/Native？

由於 Kotlin/Native 需要下載平台特定的工具鏈 (toolchain)，你需要將 `-Dhttp.proxyHost=xxx -Dhttp.proxyPort=xxx` 指定為編譯器的或 `gradlew` 的參數，或透過 `JAVA_OPTS` 環境變數設定。

## 該如何為我的 Kotlin 框架指定自定義 Objective-C 前綴/名稱？

使用 `-module-name` 編譯器選項或相符的 Gradle DSL 語句。

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
kotlin {
    iosArm64("myapp") {
        binaries.framework {
            freeCompilerArgs += listOf("-module-name", "TheName")
        }
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
kotlin {
    iosArm64("myapp") {
        binaries.framework {
            freeCompilerArgs += ["-module-name", "TheName"]
        }
    }
}
```

</TabItem>
</Tabs>

## 該如何重新命名 iOS 框架？

iOS 框架的預設名稱為 `<project name>.framework`。
要設定自定義名稱，請使用 `baseName` 選項。這也會設定模組名稱。

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

## 該如何為我的 Kotlin 框架啟用 bitcode？

Bitcode 嵌入在 Xcode 14 中已被棄用，並在 Xcode 15 中針對所有 Apple 目標移除。
自 Kotlin 2.0.20 起，Kotlin/Native 編譯器不再支援 bitcode 嵌入。

如果你正在使用較早版本的 Xcode，但想升級到 Kotlin 2.0.20 或更新版本，請在 Xcode 專案中停用 bitcode 嵌入。

## 為什麼會看到 InvalidMutabilityException？

:::note
這個問題僅與舊版記憶體管理器相關。請參閱 [Kotlin/Native 記憶體管理](native-memory-manager) 以了解新的記憶體管理器，該管理器自 Kotlin 1.7.20 起已預設啟用。

:::

這很可能發生，因為你正在嘗試修改一個凍結的物件 (frozen object)。物件可以明確地轉換為凍結狀態，例如從呼叫 `kotlin.native.concurrent.freeze` 的物件中可訪問的物件，或隱含地轉換（即從 `enum` 或全域單例物件可訪問的物件 - 請參閱下一個問題）。

## 該如何讓單例物件 (singleton object) 變成可變的？

:::note
這個問題僅與舊版記憶體管理器相關。請參閱 [Kotlin/Native 記憶體管理](native-memory-manager) 以了解新的記憶體管理器，該管理器自 Kotlin 1.7.20 起已預設啟用。

:::

目前，單例物件是不可變的（即在建立後被凍結），並且通常認為保持全域狀態不可變是一種好的做法。如果由於某些原因你需要在這樣的物件內部有一個可變的狀態，請在該物件上使用 `@konan.ThreadLocal` 註解。此外，`kotlin.native.concurrent.AtomicReference` 類別可用於在凍結的物件中儲存指向不同凍結物件的指標，並自動更新它們。

## 該如何使用未發布的 Kotlin/Native 版本編譯我的專案？

首先，請考慮嘗試 [preview versions](eap)。

如果你需要更近期的開發版本，你可以從原始碼建置 Kotlin/Native：
複製 [Kotlin repository](https://github.com/JetBrains/kotlin) 並按照 [these steps](https://github.com/JetBrains/kotlin/blob/master/kotlin-native/README#building-from-source)。